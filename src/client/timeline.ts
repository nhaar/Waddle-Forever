import path from 'path'

import { BrowserWindow, ipcMain } from "electron";

export function createTimelinePicker (mainWindow: BrowserWindow) {
  const timelinePicker = new BrowserWindow({
    width: 500,
    height: 500,
    title: "Timeline Picker",
    webPreferences: {
      preload: path.join(__dirname, 'preload/timeline-preload.js')
    }
  });
  timelinePicker.loadFile(path.join(__dirname, 'views/timeline.html'));

  ipcMain.on('update-version', () => {
    mainWindow.webContents.reloadIgnoringCache();
  });
}