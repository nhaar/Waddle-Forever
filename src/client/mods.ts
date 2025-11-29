import { BrowserWindow, ipcMain, shell } from "electron";
import electronIsDev from "electron-is-dev";
import path from "path";
import { MODS_DIRECTORY } from "../common/paths";

export const createModsWindow = async (mainWindow: BrowserWindow) => {
  const modsWindow = new BrowserWindow({
    width: 500,
    height: 500,
    title: "Mods",
    webPreferences: {
      preload: path.join(__dirname, 'preload/mods-preload.js'),
    },
    parent: mainWindow
  });

  modsWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  })

  modsWindow.loadFile(path.join(__dirname, 'views/mods.html'));
  modsWindow.webContents.on('did-finish-load', () => {
    if (electronIsDev) {
      modsWindow.webContents.openDevTools();
    }
  });

  ipcMain.on('update-mod', () => {
    mainWindow.webContents.reloadIgnoringCache();
  })

  ipcMain.on('open-mods-folder', () => {
    shell.openPath(MODS_DIRECTORY);
  });
};