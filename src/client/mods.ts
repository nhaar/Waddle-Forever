import { BrowserWindow, ipcMain, shell } from "electron";
import path from "path";
import fs from "fs";
import { MODS_DIRECTORY, MOD_HACKS_FILE, MOD_ITEMS_FILE } from "@common/paths";
import { getPopupCreator } from "./popups";
import { SettingsManager } from "@server/settings";
import { ModError } from "@server/mods";
import { WorldServer } from "@server/socket-server/world-server";

export const createModsWindow = getPopupCreator('mods', ['update-mod', 'open-mods-folder', 'mod-from-path', 'get-mods'], (mainWindow: BrowserWindow, settings: SettingsManager, server: WorldServer) => {
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

  ipcMain.on('update-mod', (_, arg) => {
    const { name, state } = arg;

    let worked = true;

    if (state) {
      try {
        settings.mods.setModActive(name);
      } catch (error) {
        if (error instanceof ModError) {
          worked = false;
          modsWindow.webContents.send('mod-error', { message: error.message, name });
        } else {
          throw error;
        }
      }
    } else {
      settings.mods.setModInactive(name);
    }

    if (worked) {
      server.reset();
      mainWindow.webContents.reloadIgnoringCache();
    }
  })

  ipcMain.on('open-mods-folder', () => {
    shell.openPath(MODS_DIRECTORY);
  });

  const sendMods = () => {
    const mods = settings.mods.getMods();
    const modsRelation: Record<string, boolean> = {};
    for (const mod of mods) {
      modsRelation[mod] = settings.mods.isModActive(mod);
    }
    modsWindow.webContents.send('get-mods', modsRelation);
  };

  ipcMain.on('get-mods', sendMods);

  ipcMain.on('mod-from-path', (event, modName: string, dir: string) => {
    const modDir = path.join(MODS_DIRECTORY, modName);
    const dirExisted = fs.existsSync(modDir);
    fs.mkdir(path.join(modDir, dir), { recursive: true }, (err) => {
      // add mod extensions if creating the directory
      if (!dirExisted) {
        fs.writeFileSync(path.join(modDir, MOD_ITEMS_FILE), JSON.stringify([]));
        fs.writeFileSync(path.join(modDir, MOD_HACKS_FILE), JSON.stringify([]));
      }
      event.reply('mod-created', err);
    })
  });

  modsWindow.webContents.on('did-finish-load', sendMods);

  return modsWindow;
});
