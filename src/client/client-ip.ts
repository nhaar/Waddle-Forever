import { BrowserWindow, ipcMain } from "electron";
import path from "path";
import { GlobalSettings, makeURL } from "../common/utils";

/** Creates the window which allows changing which IP the client connects to */
export function createChangeClientIPWindow(globalSettings: GlobalSettings, mainWindow: BrowserWindow) {
  const window = new BrowserWindow({
    height: 300,
    width: 500,
    title: "Change Client IP",
    webPreferences: {
      preload: path.join(__dirname, 'preload/client-ip-preload.js')
    }
  });

  window.setMenu(null);

  window.loadFile(path.join(__dirname, 'views/client-ip.html'));

  window.webContents.on('did-finish-load', () => {
    window.webContents.send('get-info', { ip: globalSettings.targetIP, port: globalSettings.targetPort });
  });

  ipcMain.on('update-ip', (_, arg) => {
    const { ip, port } = arg;
    globalSettings.targetIP = ip;
    globalSettings.targetPort = port;
    mainWindow.loadURL(makeURL(ip, port));
  });

  ipcMain.on('reset-ip', () => {
    globalSettings.targetIP = undefined;
    mainWindow.loadURL(makeURL('127.0.0.1'));
  });
}