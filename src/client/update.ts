import path from 'path';
import fs from 'fs';
import { BrowserWindow, dialog, shell } from 'electron';
import { postJSON } from "../common/utils";
import { VERSION } from '../common/version';
import { SettingsManager } from '../server/settings';

const UPDATE_PATH = path.join(process.cwd(), 'tempupdate');

export async function checkUpdates (mainWindow: BrowserWindow, settings: SettingsManager): Promise<void> {
  if (fs.existsSync(UPDATE_PATH)) {
    fs.rmdirSync(UPDATE_PATH, { recursive: true })
  }

  const versionStatus = await postJSON(`/api/version`, {
    version: VERSION
  })

  if (versionStatus === undefined) {
    return;
  }

  const newVersion = versionStatus.version;
  if (typeof newVersion !== 'string') {
    return;
  }
  
  if (newVersion !== VERSION && settings.settings.ignored_version !== newVersion) {
    const result = await dialog.showMessageBox(mainWindow, {
      buttons: ['Ok', 'Don\'t Ask Again', 'Open Download Website'],
      title: 'New version available',
      message: `A new version is available (${newVersion}). Please redownload the game to have access to the latest features and bug fixes.`,
      defaultId: 0,
      cancelId: 1
    });

    if (result.response === 1) {
      settings.updateSettings({ ignored_version: newVersion });
    } else if (result.response === 2) {
      shell.openExternal('https://waddleforever.com/');
    }
  }
}