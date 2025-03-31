import path from 'path'
import fs from 'fs'

import electronIsDev from "electron-is-dev";

import { VERSION } from '../common/version';
import settingsManager from '../server/settings';
import { download } from './download';
import { unzip } from './unzip';

export const MEDIA_DIRECTORY = path.join(process.cwd(), 'media');

export const DEFAULT_DIRECTORY = path.join(MEDIA_DIRECTORY, 'default');

/**
 * Downloads and extracts a media folder from the website
 * @param mediaName Name used for the folder and in the website
 * @param onSuccess Function for running if it succeeds
 * @param onFail Function for running if it fails
 */
export const downloadMediaFolder = async (mediaName: string, onSuccess: () => void, onFail: () => void) => {
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
  const success = await download(`media/${mediaName}-${VERSION}.zip`, zipDir);
  if (success) {
    const folderDestination = path.join(MEDIA_DIRECTORY, mediaName);
    try {
      await unzip(zipDir, folderDestination);
    } catch {
      onFail();
      return;
    }
    fs.writeFileSync(path.join(folderDestination, '.version'), VERSION);
    onSuccess();
  } else {
    onFail();
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
    const version = fs.readFileSync(versionFile, { encoding: 'utf-8' }).trim();
    if (version !== VERSION) {
      isUpToDate = false;
    }
  }

  let success = true;
  if (!isUpToDate) {
    fs.rmdirSync(TARGET_DIRECTORY, { recursive: true })
    await downloadMediaFolder(mediaName, () => {}, () => { success = false });
  }

  return success;
}

/**
 * Initializes the media folders, downloading when needed to update things
 * @returns Whether the checks and downloads were successful
 */
export const startMedia = async (): Promise<boolean> => {
  // in dev, there's no reason to mess with the media folder as they are all part of the github repo
  if (electronIsDev) {
    return true;
  }

  if (!fs.existsSync(MEDIA_DIRECTORY)) {
    fs.mkdirSync(MEDIA_DIRECTORY);
  }

  // check media of name "string" if the "boolean" is true
  const mediaConditions: [string, boolean][] = [
    ['default', true], // mandatory check
    ['clothing', settingsManager.settings.clothing]
  ];
  
  // built so it aborts the moment something goes wrong
  for (const mediaCondition of mediaConditions) {
    const [name, mustCheck] = mediaCondition;
    if (mustCheck) {
      if ((await checkMedia(name)) === false) {
        return false;
      }
    }
  }

  return true;
}