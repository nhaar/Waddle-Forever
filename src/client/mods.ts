import { BrowserWindow, ipcMain, shell } from "electron";
import { SettingsManager } from "../server/settings";
import path from "path";

export const createModsWindow = async (settingsManager: SettingsManager, mainWindow: BrowserWindow) => {
  const modsWindow = new BrowserWindow({
    width: 500,
    height: 500,
    title: "Mods",
    webPreferences: {
      preload: path.join(__dirname, 'preload/mods-preload.js')
    }
  });

  modsWindow.loadFile(path.join(__dirname, 'views/mods.html'));
  modsWindow.webContents.on('did-finish-load', () => {
    const activeMods = settingsManager.activeMods;
    const mods = settingsManager.installedMods;
    const modsRelation: Record<string, boolean> = {};
    for (const mod of mods) {
      modsRelation[mod] = activeMods.includes(mod);
    }
    modsWindow.webContents.send('receive-mods', modsRelation);
  });

  ipcMain.on('set-mod-active', (e, arg) => {
    settingsManager.setModActive(arg);
    mainWindow.webContents.reloadIgnoringCache();
  })

  ipcMain.on('set-mod-inactive', (e, arg) => {
    settingsManager.setModInactive(arg);
    mainWindow.webContents.reloadIgnoringCache();
  })

  ipcMain.on('open-mods-folder', () => {
    shell.openPath(path.join(process.cwd(), 'mods'));
  });
};