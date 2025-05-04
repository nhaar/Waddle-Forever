import path from 'path'
import fs from 'fs'

import electronIsDev from "electron-is-dev";

import { VERSION } from '../common/version';
import settingsManager from '../server/settings';
import { download } from './download';
import { unzip } from './unzip';
import { logError, MEDIA_DIRECTORY, postJSON } from '../common/utils';

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

  // use date to avoid collision (unlink only deletes after the app is closed)
  const zipName = String(Date.now()) + '.zip';
  const zipDir = path.join(MEDIA_DIRECTORY, zipName);
  // using the "media file name convention"
  // the media/ is to access the proper API route
  try {
    await download(`media/${mediaName}-${VERSION}.zip`, zipDir);
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

const checkMedia = async (mediaName: string): Promise<boolean> => {
  let isUpToDate = true;

  const TARGET_DIRECTORY = path.join(MEDIA_DIRECTORY, mediaName);
  if (!fs.existsSync(TARGET_DIRECTORY)) {
    isUpToDate = false;
    fs.mkdirSync(TARGET_DIRECTORY);
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
    await downloadMediaFolder(mediaName, () => {}, (err) => { throw err; });
  }

  return success;
}

export class AdminError extends Error {};

/**
 * Initializes the media folders, downloading when needed to update things
 * @returns Whether the checks and downloads were successful
 */
export const startMedia = async (): Promise<void> => {
  // in dev, there's no reason to mess with the media folder as they are all part of the github repo
  if (electronIsDev) {
    return;
  }

  try {
    if (!fs.existsSync(MEDIA_DIRECTORY)) {
      fs.mkdirSync(MEDIA_DIRECTORY);
    }
  } catch (error) {
    throw new AdminError('Could not create media directory');
  }

  // check media of name "string" if the "boolean" is true
  const mediaConditions: [string, boolean][] = [
    ['default', true], // mandatory check
    ['clothing', settingsManager.settings.clothing]
  ];

  for (const mediaCondition of mediaConditions) {
    const [name, mustCheck] = mediaCondition;
    if (mustCheck) {
      await checkMedia(name);
    }
  }
}