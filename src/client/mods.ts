import { BrowserWindow, ipcMain, shell } from "electron";
import path from "path";
import fs from "fs";
import { MODS_DIRECTORY, MOD_ITEMS_FILE } from "@common/paths";
import { getPopupCreator } from "./popups";

export const createModsWindow = getPopupCreator('mods', ['update-mod', 'open-mods-folder', 'mod-from-path'], (mainWindow: BrowserWindow) => {
  const modsWindow = new BrowserWindow({
    width: 500,
    height: 500,
    title: "Mods",
    webPreferences: {
      preload: path.join(__dirname, 'preload/mods-preload.js'),
    },
    resizable: false
  });

  modsWindow.setMenu(null);

  modsWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  })

  modsWindow.loadFile(path.join(__dirname, 'views/mods.html'));

  ipcMain.on('update-mod', () => {
    mainWindow.webContents.reloadIgnoringCache();
  })

  ipcMain.on('open-mods-folder', () => {
    shell.openPath(MODS_DIRECTORY);
  });

  ipcMain.on('mod-from-path', (event, modName: string, dir: string) => {
    const modDir = path.join(MODS_DIRECTORY, modName);
    const dirExisted = fs.existsSync(modDir);
    fs.mkdir(path.join(modDir, dir), { recursive: true }, (err) => {
      // add mod extensions if creating the directory
      if (!dirExisted) {
        fs.writeFileSync(path.join(modDir, MOD_ITEMS_FILE), JSON.stringify([]));
      }
      event.reply('mod-created', err);
    })
  });

  return modsWindow;
});
