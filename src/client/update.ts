import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { BrowserWindow, dialog } from 'electron';
import { postJSON } from "../common/utils";
import { downloadFile } from './download';
import { VERSION } from '../common/version';
import { showWarning } from './warning';

type VersionStatus = 'unsupported' | 'old' | 'current' | 'unknown'

const UPDATE_PATH = path.join(process.cwd(), 'tempupdate');

async function getOSFile (url: string): Promise<{
  filename: string,
  name: string
} | undefined> {
  const response = await postJSON(url, {
    platform: process.platform,
    arch: process.arch
  })
  if (response.exists === true) {
    return {
      filename: response.filename,
      name: response.name
    }
  } else {
    return undefined;
  }
}

export async function checkUpdates (mainWindow: BrowserWindow): Promise<void> {
  if (fs.existsSync(UPDATE_PATH)) {
    fs.rmdirSync(UPDATE_PATH, { recursive: true })
  }

  const versionStatus = await postJSON(`/api/version`, {
    version: VERSION
  }, () => undefined)

  if (versionStatus === undefined) {
    return;
  }

  const readStatus = versionStatus.status
  let status: VersionStatus
  if (typeof readStatus === 'string' && (readStatus === 'unsupported' || readStatus === 'old' || readStatus === 'current')) {
    status = readStatus
  } else {
    status = 'unknown'
  }

  if (status === 'old') {
    const result = await dialog.showMessageBox(mainWindow, {
      buttons: ['Ignore', 'Update'],
      title: 'New version available',
      message: `A new version is available.`,
      defaultId: 1,
      cancelId: 0
    });
    
    if (result.response === 1) {
      await update(mainWindow);
    }
  } else if (status === 'unsupported') {
    await showWarning(mainWindow, 'New version available', `A new version is available, but it is not compatible with this version.\nPlease download Waddle Forever again to update it.`)
  }
}

export async function update(mainWindow: BrowserWindow) {
  let downloadNumber = 0;
  
  if (!fs.existsSync(UPDATE_PATH)) {
    fs.mkdirSync(UPDATE_PATH);
  }

  downloadNumber++;
  const CLIENT_DOWNLOAD_NUMBER = downloadNumber;
  const clientInfo = await getOSFile('/api/client');

  const settingsJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'settings.json'), { encoding: 'utf-8'}))

  const mediaFiles = (await postJSON('/api/media', settingsJson)).filenames
  const MEDIA_DOWNLOAD_START = downloadNumber + 1;
  downloadNumber += mediaFiles.length;
  
  const updaterInfo = await getOSFile('/api/updater')
  downloadNumber += 1;

  if (clientInfo === undefined || updaterInfo === undefined) {
    showWarning(mainWindow, 'Error', 'Your platform or architecture is not supported')
    return
  }

  await downloadFile(clientInfo.filename, path.join(UPDATE_PATH, 'client.zip'), CLIENT_DOWNLOAD_NUMBER, downloadNumber);

  for (const i in mediaFiles) {
    const file = mediaFiles[i];
    await downloadFile(file.filename, path.join(UPDATE_PATH, file.name + '.zip'), Number(i) + MEDIA_DOWNLOAD_START, downloadNumber);
  }

  const updaterPath = path.join(UPDATE_PATH, 'update.exe');

  await downloadFile(updaterInfo.filename, updaterPath, downloadNumber, downloadNumber);

  fs.writeFileSync(path.join(UPDATE_PATH, 'version'), VERSION);

  await new Promise<void>((resolve) => {
    exec(`"${updaterPath}"`, () => resolve());
  })
}