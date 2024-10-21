import { BrowserWindow, ipcMain, dialog } from "electron";
import { SettingsManager } from "../server/settings";
import path from "path";
import fs from 'fs';
import { download } from "./download";
import { VERSION } from "../common/version";
import { unzip } from "./unzip";

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

    ipcMain.on('download-package', (e, arg) => {
      (async () => {
        // avoid collision (unlink only deletes after the app is closed)
        const zipName = String(Date.now()) + '.zip'
        const mediaDir = path.join(process.cwd(), 'media');
        const zipDir = path.join(mediaDir, zipName)
        const success = await download(`${arg}-${VERSION}.zip`, zipDir)
        if (success) {
          await unzip(zipDir, path.join(mediaDir, arg))
          settingsWindow.webContents.send('finish-download', arg)
          settingsManager.updateSettings({
            [arg]: true
          })
        } else {
          settingsWindow.webContents.send('download-fail')
        }
      })()
    })

    ipcMain.on('delete-package', (e, arg) => {
      fs.rmdirSync(path.join(process.cwd(), 'media', arg), { recursive: true })
      settingsWindow.webContents.send('finish-deleting', arg)
      settingsManager.updateSettings({
        [arg]: false
      })
    })
  }
};