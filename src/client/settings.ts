import { BrowserWindow, ipcMain, dialog } from "electron";
import { SettingsManager } from "../server/settings";
import path from "path";
import fs from 'fs';
import { downloadMediaFolder } from "./media";

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
      width: 500,
      height: 500,
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

    ipcMain.on('download-package', (e, arg) => {
      (async () => {
        downloadMediaFolder(arg, () => {
          settingsWindow.webContents.send('finish-download', arg)
          settingsManager.updateSettings({
            [arg]: true
          })
        }, () => {
          settingsWindow.webContents.send('download-fail')
        })
      })()
    })

    ipcMain.on('delete-package', (e, arg) => {
      // must not remove packages in development, as that would greatly disturb git
      if (!electronIsDev) {
        fs.rmdirSync(path.join(process.cwd(), 'media', arg), { recursive: true })
      }
      settingsWindow.webContents.send('finish-deleting', arg)
      settingsManager.updateSettings({
        [arg]: false
      })
    })

    ipcMain.on('reload-window', () => {
      mainWindow.reload();
    })

    ipcMain.on('clear-cache', () => {
      mainWindow.webContents.session.clearCache();
    })

    ipcMain.on('reload-cache', () => {
      mainWindow.webContents.reloadIgnoringCache();
    })
  }
};