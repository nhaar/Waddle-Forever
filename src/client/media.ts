import path from 'path'
import fs from 'fs'
import http from 'http';
import https from 'https';
import unzipper from 'unzipper';

import electronIsDev from "electron-is-dev";
import { BrowserWindow, dialog } from "electron";

import { VERSION } from '@common/version';
import settingsManager from '@server/settings';
import { logError, MEDIA_DIRECTORY, parseURL, postJSON } from '@common/utils';
import { showProgress, createProgressBarWindow, setPrompt } from './views/progress/progress';

let window: BrowserWindow = null;

/** Creates the progress bar window if it doesn't exist yet, and then returns it. */
export async function progressWindow() {
  if (window === null) {
    window = await createProgressBarWindow();
  }
  return window;
}

export function destroyProgressWindow() {
  if (window !== null && !window.isDestroyed()) {
    // destroy, not close, otherwise we'll trigger
    // the popup in the 'close' event (see progress.ts)
    window.destroy();
  }
}

async function downloadFile(
  url: string,
  destination: string,
  update: (progress: number) => void,
  finish: () => void,
  maxRedirects = 5
): Promise<boolean> {

  const { protocol } = parseURL(url);
  const module = protocol === 'http' ? http : https;

  return await new Promise<boolean>((resolve, reject) => {
    module.get(url, (response) => {
      // handle redirects
      const status = response.statusCode ?? 0;
      if ([301, 302, 303, 307, 308].includes(status)) {
        const redirectURL = response.headers.location;

        if (redirectURL === undefined) {
          return reject(new Error("Redirect with no location header"));
        }
        if (maxRedirects <= 0) {
          return reject(new Error("Too many redirects"));
        }
        return resolve(
          downloadFile(redirectURL, destination, update, finish, maxRedirects - 1)
        );
      }

      // non redirect
      const file = fs.createWriteStream(destination);
      const totalSize = Number(response.headers['content-length'] || 0);
      let downloadedSize = 0;

      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        if (totalSize > 0) {
          update(downloadedSize / totalSize)
        }
      });

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        finish();
        resolve(true);
      });

    }).on('error', (err) => {
      fs.unlink(destination, () => {});
      logError('Error downloading', err);
      finish();
      reject(err);
    });
  });
}

const downloadMessages = {
  'default': 'Downloading Media:',
  'clothing': 'Downloading Clothing:'
}

async function download(url: string, destination: string, name: string) {
  setPrompt(downloadMessages[name], window);
  await showProgress(window, async (progress, end) => {
    return await downloadFile(url, destination, progress, end)
  })
}

export async function unzip(zipDir: string, outDir: string) {
  setPrompt('Extracting Media:', window);
  await showProgress(window, async (progress, end) => {
    return await new Promise<boolean>((resolve, reject) => {
      // removes the zipped file
      const unlink = () => fs.unlinkSync(zipDir);

      const handleError = (err: unknown) => {
        unlink();
        end();
        reject(err);
      }

      try {
        const stream = fs.createReadStream(zipDir)
      
        const unzipStream = unzipper.Extract({ path: outDir })
        
        const totalBytes = fs.statSync(zipDir).size;
        let processedBytes = 0
      
        unzipStream.on('close', () => {
          unlink();
          end();
          resolve(true);
        })
      
        unzipStream.on('error', handleError)
      
        stream.on('data', (chunk) => {
          processedBytes += chunk.length;
          progress(processedBytes / totalBytes);
        })
      
        stream.on('error', handleError);
        stream.pipe(unzipStream)
      } catch (error) {
        handleError(error);
      }
    })
  })
}

/**
 * Downloads and extracts a media folder from the website
 * @param mediaName Name used for the folder and in the website
 * @param onSuccess Function for running if it succeeds
 * @param onFail Function for running if it fails
 */
export const downloadMediaFolder = async (mediaName: string, onSuccess: () => void, onFail: (err: unknown) => void) => {
  // in dev, the medias are always installed
  // can only test this in production builds
  if (electronIsDev) {
    onSuccess();
    return;
  }

  // call this so the window is guaranteed to exist, so it's
  // safe to use 'window' directly in other methods
  await progressWindow();

  // remove any existing .zip files that may be leftover if a download was cancelled
  try {
    // media folder should exist by this point
    for (const file of fs.readdirSync(MEDIA_DIRECTORY).filter(f => f.endsWith('.zip'))) {
      try {
        fs.unlinkSync(path.join(MEDIA_DIRECTORY, file));
      } catch (err) {
        logError('Failed to unlink existing zip file', err);
      }
    }
  } catch (err) {
    logError('Error reading media directory for zip files', err);
  }

  // use date to avoid collision (unlink only deletes after the app is closed)
  const zipName = String(Date.now()) + '.zip';
  const zipDir = path.join(MEDIA_DIRECTORY, zipName);
  // using the "media file name convention"
  // the media/ is to access the proper API route
  try {
    await download(`https://github.com/nhaar/Waddle-Forever/releases/download/v${VERSION}/${mediaName}.zip`, zipDir, mediaName);
    const folderDestination = path.join(MEDIA_DIRECTORY, mediaName);
    try {
      await unzip(zipDir, folderDestination);
    } catch (error) {
      logError('Error unzipping: ', error);
      onFail(error);
      return;
    }
    fs.writeFileSync(path.join(folderDestination, '.version'), VERSION);
    onSuccess();
    
  } catch (error) {
    onFail(error);    
  }
}

const checkMedia = async (mediaName: string, onSuccess = () => {}): Promise<boolean> => {
  let isUpToDate = true;

  const TARGET_DIRECTORY = path.join(MEDIA_DIRECTORY, mediaName);
  if (!fs.existsSync(TARGET_DIRECTORY)) {
    isUpToDate = false;
    try {
      fs.mkdirSync(TARGET_DIRECTORY);
    } catch (error) {
      throw new AdminError();
    }
  }

  const versionFile = path.join(TARGET_DIRECTORY, '.version');
  if (!fs.existsSync(versionFile)) {
    isUpToDate = false;
  } else {
    const previousVersion = fs.readFileSync(versionFile, { encoding: 'utf-8' }).trim();
    if (previousVersion === VERSION) {
      isUpToDate = true;
    } else {
      // even though the versions are different,
      // the contents may be the same, so we can skip
      // downloading a new file if they are equivalent
      const response = await postJSON('/compare-versions', { oldVersion: previousVersion, newVersion: VERSION, media: mediaName });
      if (response !== undefined) {
        if (response.isEquivalent) {
          fs.writeFileSync(versionFile, VERSION);
          isUpToDate = true;
        } else {
          isUpToDate = false;
        }
      } else {
        // API error on server, we assume there's no equivalence
        // this scenario shouldn't happen, and if it does
        // we might get an error trying to download anyways
        isUpToDate = false;
      }
    }
  }

  let success = true;
  if (!isUpToDate) {
    fs.rmdirSync(TARGET_DIRECTORY, { recursive: true })
    await downloadMediaFolder(mediaName, onSuccess, (err) => { throw err; });
  }

  return success;
}

export class AdminError extends Error {
  constructor() {
    super('Could not create media directory');
  }
};

/**
 * Initializes the media folders, downloading when needed to update things
 */
export const startMedia = async (): Promise<void> => {
  // in dev, there's no reason to mess with the media folder as they are all part of the github repo
  if (electronIsDev) {
    return;
  }

  if (!fs.existsSync(MEDIA_DIRECTORY)) {
    try {
      fs.mkdirSync(MEDIA_DIRECTORY);
    } catch (error) {
      throw new AdminError();
    }
  }

  // Check for default media
  await checkMedia('default');

  // Check for clothing (only if its flagged as having been downloaded previously)
  if (settingsManager.settings.clothing) {
    await checkMedia('clothing');
  }

  // Only show dialog if the clothing settings is false, otherwise it would have been downloaded already
  if (!settingsManager.settings.clothing && settingsManager.settings.answered_packages !== VERSION) {
    const result = await dialog.showMessageBox(await progressWindow(), {
      buttons: ['Download Clothing (~600 MB)', 'No Thanks'],
      title: 'Download package?',
      message: 'Would you like to download the clothing package? It includes all non essential clothing items from Club Penguin. If you say no, you can always download it later.',
      defaultId: 0,
      cancelId: 1
    });
    if (result.response === 0) {
      await downloadMediaFolder('clothing', () => {
        settingsManager.updateSettings({ clothing: true });
      }, () => {})
    }
    settingsManager.updateSettings({ answered_packages: VERSION });
  }

  // everything is done, so destroy the window now
  destroyProgressWindow();
}