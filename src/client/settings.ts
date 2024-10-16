import { BrowserWindow, ipcMain, dialog } from "electron";
import { SettingsManager } from "../server/settings";
import path from "path";

export const createSettingsWindow = async (settingsManager: SettingsManager, mainWindow: BrowserWindow) => {
  if (settingsManager.isEditting) {
    await dialog.showMessageBox(mainWindow, {
      buttons: ['Ok'],
      title: 'Error',
      message: `You already have the settings window open.`,
    });
  } else {
    settingsManager.isEditting = true;
    const settingsWindow = new BrowserWindow({
      width: 400,
      height: 300,
      title: "Settings",
      webPreferences: {
        preload: path.join(__dirname, 'preload/settings-preload.js')
      }
    });
  
    settingsWindow.loadFile(path.join(__dirname, 'views/settings.html'));
    settingsWindow.webContents.on('did-finish-load', () => {
      settingsWindow.webContents.send('receive-settings', settingsManager.settings);
    });

    settingsWindow.on('close', () => {
      settingsManager.isEditting = false;
    });
  
    ipcMain.on('update-settings', (e, arg) => {
      settingsManager.updateSettings(arg);
    });
  }
};