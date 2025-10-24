import { BrowserWindow, ipcMain } from "electron";
import path from "path";
import { SettingsManager } from "../server/settings";
import { HTTP_PORT } from "../common/constants";

/** Create window that allows the user to change the IP of their own local server */
export function createChangeServerIPWindow(serverSettings: SettingsManager, mainWindow: BrowserWindow) {
    const window = new BrowserWindow({
      height: 200,
      width: 500,
      title: "Change Server IP",
      webPreferences: {
        preload: path.join(__dirname, 'preload/server-ip-preload.js')
      }
    });
  
    window.setMenu(null);
  
    window.loadFile(path.join(__dirname, 'views/server-ip.html'));

    ipcMain.on('update-ip', (_, arg) => {
      serverSettings.targetIP = arg;
      mainWindow.loadURL(`http://${arg}:${HTTP_PORT}`);
    });
}