import { BrowserWindow, ipcMain, dialog } from "electron";
import electronIsDev from "electron-is-dev";
import path from "path";
import fs from 'fs';
import { downloadMediaFolder } from "./media";
import { GlobalSettings } from "../common/utils";

// preventing garbage collection
let settingsWindow: BrowserWindow;

export const createSettingsWindow = async (globalSettings: GlobalSettings, mainWindow: BrowserWindow) => {
  if (globalSettings.isEditting) {
    await dialog.showMessageBox(mainWindow, {
      buttons: ['Ok'],
      title: 'Error',
      message: `You already have the settings window open.`,
    });
  } else {
    globalSettings.isEditting = true;
    settingsWindow = new BrowserWindow({
      width: 500,
      height: 500,
      title: "Settings",
      webPreferences: {
        preload: path.join(__dirname, 'preload/settings-preload.js')
      }
    });
  
    settingsWindow.loadFile(path.join(__dirname, 'views/settings.html'));

    if (electronIsDev) {
      settingsWindow.webContents.on('did-finish-load', () => {
        settingsWindow.webContents.openDevTools();
      });
    }

    settingsWindow.on('close', () => {
      globalSettings.isEditting = false;
    });

    ipcMain.on('download-package', (e, arg) => {
      (async () => {
        downloadMediaFolder(arg, () => {
          settingsWindow.webContents.send('finish-download', arg)
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