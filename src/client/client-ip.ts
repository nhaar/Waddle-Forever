import { BrowserWindow, ipcMain } from "electron";
import path from "path";
import { GlobalSettings, makeURL } from "../common/utils";

/** Creates the window which allows changing which IP the client connects to */
export function createChangeClientIPWindow(globalSettings: GlobalSettings, mainWindow: BrowserWindow) {
  const window = new BrowserWindow({
    height: 200,
    width: 500,
    title: "Change Client IP",
    webPreferences: {
      preload: path.join(__dirname, 'preload/client-ip-preload.js')
    }
  });

  window.setMenu(null);

  window.loadFile(path.join(__dirname, 'views/client-ip.html'));

  ipcMain.on('update-ip', (_, arg) => {
    globalSettings.targetIP = arg;
    mainWindow.loadURL(makeURL(arg));
  });

  ipcMain.on('reset-ip', () => {
    globalSettings.targetIP = undefined;
    mainWindow.loadURL(makeURL('localhost'));
  });
}