import { BrowserWindow, ipcMain, shell } from "electron";
import electronIsDev from "electron-is-dev";
import path from "path";
import fs from "fs";
import { MODS_DIRECTORY } from "../common/paths";

let modsWindow: BrowserWindow | null;

export const createModsWindow = async (mainWindow: BrowserWindow) => {
  if (modsWindow) {
    modsWindow.focus();
    return;
  }
  modsWindow = new BrowserWindow({
    width: 500,
    height: 500,
    title: "Mods",
    webPreferences: {
      preload: path.join(__dirname, 'preload/mods-preload.js'),
    },
    resizable: false,
    parent: mainWindow
  });

  modsWindow.setMenu(null);

  modsWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  })

  modsWindow.loadFile(path.join(__dirname, 'views/mods.html'));
  modsWindow.webContents.on('did-finish-load', () => {
    if (electronIsDev) {
      modsWindow?.webContents.openDevTools();
    }
  });

  modsWindow.on('closed', () => {
    modsWindow = null;
    for (const event of ['update-mod', 'open-mods-folder', 'mod-from-path']) {
      ipcMain.removeAllListeners(event);
    }
  });

  ipcMain.on('update-mod', () => {
    mainWindow.webContents.reloadIgnoringCache();
  })

  ipcMain.on('open-mods-folder', () => {
    shell.openPath(MODS_DIRECTORY);
  });

  ipcMain.on('mod-from-path', (event, modName: string, dir: string) => {
    fs.mkdir(path.join(MODS_DIRECTORY, modName, dir), { recursive: true }, (err) => {
      event.reply('mod-created', err);
    })
  });
};