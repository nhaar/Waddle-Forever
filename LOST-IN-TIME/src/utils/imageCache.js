import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';

const CACHE_DIRECTORY = `${FileSystem.cacheDirectory}image-cache`;
const METADATA_PREFIX = 'imageCache.metadata';
const TEMP_SUFFIX = '.tmp';

const pendingRequests = new Map();
let ensureDirectoryPromise = null;

function normalizeString(value) {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).trim();
}

async function ensureCacheDirectory() {
  if (!ensureDirectoryPromise) {
    ensureDirectoryPromise = FileSystem.makeDirectoryAsync(CACHE_DIRECTORY, { intermediates: true }).catch(
      (error) => {
        if (error?.message?.includes('File already exists')) {
          return;
        }
        console.warn('[imageCache] Failed to ensure cache directory', error);
      }
    );
  }
  return ensureDirectoryPromise;
}

async function readMetadata(key) {
  try {
    const stored = await AsyncStorage.getItem(key);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.warn('[imageCache] Failed to read metadata', key, error);
    return null;
  }
}

async function writeMetadata(key, metadata) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(metadata));
  } catch (error) {
    console.warn('[imageCache] Failed to write metadata', key, error);
  }
}

async function removeMetadata(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn('[imageCache] Failed to remove metadata', key, error);
  }
}

async function deleteFileIfExists(fileUri) {
  try {
    const info = await FileSystem.getInfoAsync(fileUri);
    if (info.exists) {
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
    }
  } catch (error) {
    console.warn('[imageCache] Failed to delete file', fileUri, error);
  }
}

async function moveFileSafely(from, to) {
  try {
    await FileSystem.moveAsync({ from, to });
  } catch (error) {
    console.warn('[imageCache] Failed to move file', { from, to }, error);
    throw error;
  }
}

async function downloadImageToCache(uri, filePath) {
  const tempPath = `${filePath}${TEMP_SUFFIX}`;
  await deleteFileIfExists(tempPath);

  try {
    const result = await FileSystem.downloadAsync(uri, tempPath);
    if (!result || result.status < 200 || result.status >= 300) {
      throw new Error(`Unexpected status code ${result?.status ?? 'unknown'}`);
    }

    await deleteFileIfExists(filePath);
    await moveFileSafely(tempPath, filePath);

    const info = await FileSystem.getInfoAsync(filePath);
    if (info.exists) {
      return info.uri;
    }

    throw new Error('Downloaded file is not accessible');
  } catch (error) {
    await deleteFileIfExists(tempPath);
    throw error;
  }
}

function buildIdentity(uri, { storagePath, cacheKey, updatedAt }) {
  const normalizedUri = normalizeString(uri);
  const normalizedStoragePath = normalizeString(storagePath);
  const normalizedCacheKey = normalizeString(cacheKey);
  const normalizedUpdatedAt = normalizeString(updatedAt);

  return [normalizedCacheKey || normalizedStoragePath || normalizedUri, normalizedUpdatedAt]
    .filter((segment) => segment)
    .join('|');
}

export async function getCachedImageUri(uri, options = {}) {
  const normalizedUri = normalizeString(uri);
  if (!normalizedUri) {
    return null;
  }

  if (!/^https?:/i.test(normalizedUri)) {
    return normalizedUri;
  }

  const identity = buildIdentity(normalizedUri, options);
  const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, identity);
  const filePath = `${CACHE_DIRECTORY}/${hash}.cache`;
  const metadataKey = `${METADATA_PREFIX}:${hash}`;
  const pendingKey = `${hash}:${normalizedUri}`;

  if (pendingRequests.has(pendingKey)) {
    return pendingRequests.get(pendingKey);
  }

  const requestPromise = (async () => {
    await ensureCacheDirectory();

    const metadata = await readMetadata(metadataKey);
    const fileInfo = await FileSystem.getInfoAsync(filePath);

    const expectedRemote = normalizeString(options.storagePath) || normalizedUri;
    const expectedUpdatedAt = normalizeString(options.updatedAt);

    if (
      fileInfo.exists &&
      metadata?.remoteUri === normalizedUri &&
      normalizeString(metadata?.identity) === identity &&
      normalizeString(metadata?.expectedRemote) === expectedRemote &&
      normalizeString(metadata?.updatedAt) === expectedUpdatedAt
    ) {
      return fileInfo.uri;
    }

    try {
      const cachedUri = await downloadImageToCache(normalizedUri, filePath);
      await writeMetadata(metadataKey, {
        remoteUri: normalizedUri,
        identity,
        expectedRemote,
        updatedAt: expectedUpdatedAt,
        timestamp: Date.now(),
      });
      return cachedUri;
    } catch (error) {
      console.warn('[imageCache] Failed to download image', normalizedUri, error);
      if (fileInfo.exists) {
        return fileInfo.uri;
      }
      await removeMetadata(metadataKey);
      return normalizedUri;
    }
  })()
    .finally(() => {
      pendingRequests.delete(pendingKey);
    });

  pendingRequests.set(pendingKey, requestPromise);
  return requestPromise;
}

export async function clearImageCache() {
  await ensureCacheDirectory();

  try {
    const directoryContents = await FileSystem.readDirectoryAsync(CACHE_DIRECTORY);
    await Promise.all(
      directoryContents.map((entry) => deleteFileIfExists(`${CACHE_DIRECTORY}/${entry}`))
    );
  } catch (error) {
    console.warn('[imageCache] Failed to clear cache directory', error);
  }

  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((key) => key.startsWith(`${METADATA_PREFIX}:`));
    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
    }
  } catch (error) {
    console.warn('[imageCache] Failed to clear metadata', error);
  }
}
