import path from 'path';
import fs, { read } from 'fs';
import { BrowserWindow, dialog, shell } from 'electron';
import { postJSON } from "../common/utils";
import { VERSION } from '../common/version';
import { showWarning } from './warning';

// there used to be other versions, but it's been deprecated
type VersionStatus = 'current' | 'notcurrent'

const UPDATE_PATH = path.join(process.cwd(), 'tempupdate');

export async function checkUpdates (mainWindow: BrowserWindow): Promise<void> {
  if (fs.existsSync(UPDATE_PATH)) {
    fs.rmdirSync(UPDATE_PATH, { recursive: true })
  }

  const versionStatus = await postJSON(`/api/version`, {
    version: VERSION
  })

  if (versionStatus === undefined) {
    return;
  }

  const readStatus = versionStatus.status
  let status: VersionStatus
  if (readStatus === 'current') {
    status = readStatus
  } else {
    status = 'notcurrent'
  }
  
  if (status !== 'current') {
    if (process.platform === 'linux') {
      const result = await dialog.showMessageBox(mainWindow, {
        buttons: ['Ignore', 'Update'],
        title: 'New version available',
        message: `A new version is available. Please redownload the game.`,
        defaultId: 1,
        cancelId: 0
      });
  
      if (result.response === 1) {
        shell.openExternal('https://waddleforever.com/linux')
      }
    } else {
      await showWarning(mainWindow, 'New version available', `A new version is available and being downloaded.\n\nOnce the download is complete, you will be notified, and you can update by restarting the game (it may have finished already!).\n\nIf the notification or update doesn't come through, please redownload the game.`)
    }
  }
}