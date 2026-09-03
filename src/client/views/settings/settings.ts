import { BrowserWindow, ipcMain } from "electron";
import electronIsDev from "electron-is-dev";
import path from "path";
import fs from 'fs';
import { downloadMediaFolder, destroyProgressWindow } from "@client/media";
import { MEDIA_DIRECTORY } from "@common/utils";
import { getPopupCreator } from "@client/popups";
import { SettingsManager } from "@server/settings";
import { WorldServer } from "@server/socket-server/world-server";

export const createSettingsWindow = getPopupCreator('settings', ['download-package', 'delete-package', 'reload-window', 'clear-cache', 'update-settings'], (mainWindow: BrowserWindow, settings: SettingsManager, server: WorldServer) => {
  const settingsWindow = new BrowserWindow({
    width: 500,
    height: 500,
    title: "Settings",
    webPreferences: {
      preload: path.join(__dirname, 'settings-preload.js')
    },
    resizable: false
  });

  settingsWindow.setMenu(null);

  settingsWindow.loadFile(path.join(__dirname, 'settings.html'));

  ipcMain.on('download-package', (e, arg) => {
    (async () => {
      downloadMediaFolder(arg, () => {
        destroyProgressWindow()
        settingsWindow?.webContents.send('finish-download', arg)
      }, () => {
        destroyProgressWindow()
        settingsWindow?.webContents.send('download-fail')
      })
    })()
  })

  ipcMain.on('delete-package', (e, arg) => {
    // must not remove packages in development, as that would greatly disturb git
    if (!electronIsDev) {
      fs.rmdirSync(path.join(MEDIA_DIRECTORY, arg), { recursive: true })
    }
    settingsWindow?.webContents.send('finish-deleting', arg)
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

  ipcMain.on('update-settings', (_, arg) => {
    const { settings: s, reset } = arg;
    if (reset === true) {
      server.reset();
    }
    settings.updateSettings(s);
  });


  settingsWindow.webContents.on('did-finish-load', () => {
    settingsWindow.webContents.send('get-settings', settings.settings);
  });

  return settingsWindow;
});