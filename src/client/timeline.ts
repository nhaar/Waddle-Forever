import path from 'path'

import { BrowserWindow, ipcMain } from "electron";
import { SettingsManager } from "../server/settings";

export function createTimelinePicker (settingsManager: SettingsManager, mainWindow: BrowserWindow) {
  const timelinePicker = new BrowserWindow({
    width: 500,
    height: 500,
    title: "Timeline Picker",
    webPreferences: {
      preload: path.join(__dirname, 'preload/timeline-preload.js')
    }
  });
  timelinePicker.loadFile(path.join(__dirname, 'views/timeline.html'));
  timelinePicker.webContents.on('did-finish-load', () => {
    timelinePicker.webContents.send('receive-version', settingsManager.settings.version);
  });

  ipcMain.on('update-version', (e, arg) => {
    settingsManager.updateSettings({ version: arg });
    mainWindow.webContents.reloadIgnoringCache();
  });
}