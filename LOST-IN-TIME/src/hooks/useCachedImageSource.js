import { useEffect, useState } from 'react';
import { getCachedImageUri } from '../utils/imageCache';

const normalize = (value) => {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).trim();
};

export function useCachedImageSource(uri, options = {}) {
  const normalizedUri = normalize(uri);
  const storagePath = normalize(options.storagePath);
  const updatedAt = normalize(options.updatedAt);
  const cacheKey = normalize(options.cacheKey);

  const [source, setSource] = useState(() => (normalizedUri ? { uri: normalizedUri } : null));

  useEffect(() => {
    let isMounted = true;

    if (!normalizedUri) {
      setSource(null);
      return () => {
        isMounted = false;
      };
    }

    setSource({ uri: normalizedUri });

    if (!/^https?:/i.test(normalizedUri)) {
      return () => {
        isMounted = false;
      };
    }

    const load = async () => {
      try {
        const cachedUri = await getCachedImageUri(normalizedUri, {
          storagePath,
          updatedAt,
          cacheKey,
        });
        if (isMounted && cachedUri) {
          setSource({ uri: cachedUri });
        }
      } catch (error) {
        console.warn('[useCachedImageSource] Failed to resolve image cache', error);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [normalizedUri, storagePath, updatedAt, cacheKey]);

  return source;
}
