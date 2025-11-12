import { BrowserWindow, ipcMain } from "electron";
import path from "path";
import { SettingsManager } from "../server/settings";
import { GlobalSettings, makeUrl } from "../common/utils";
import { HTTP_PORT } from "../common/constants";

export function getSiteUrl(settings: GlobalSettings, serverSettings: SettingsManager): string {
  if (settings.multiplayer.type === 'guest') {
    return makeUrl(settings.multiplayer.ip, settings.multiplayer.port ?? HTTP_PORT);
  } else {
    return makeUrl(serverSettings.targetIP, serverSettings.targetPort);
  }
}

/** Creates the window which allows changing which IP the client connects to */
export function createMultiplayerSettings(globalSettings: GlobalSettings, serverSettings: SettingsManager, mainWindow: BrowserWindow) {
  const window = new BrowserWindow({
    height: 300,
    width: 500,
    title: "Multiplayer Settings",
    webPreferences: {
      preload: path.join(__dirname, 'preload/multiplayer-preload.js')
    }
  });

  window.setMenu(null);

  window.loadFile(path.join(__dirname, 'views/multiplayer.html'));

  window.webContents.on('did-finish-load', () => {
    const multiplayerSettings: { type: string; ip?: string; port?: number } = globalSettings.multiplayer;
    if (multiplayerSettings.type === 'host') {
      multiplayerSettings.ip = serverSettings.targetIP;
      multiplayerSettings.port = serverSettings.targetPort;
    }
    window.webContents.send('get-info', multiplayerSettings);
  });

  ipcMain.on('update', (_, arg) => {
    const { ip, port, type } = arg;
    globalSettings.multiplayer = { ip, port, type };
    switch (type) {
      case 'guest':
        globalSettings.multiplayer = { ip, port, type};
        break;
      case 'local':
        serverSettings.targetPort = HTTP_PORT;
        serverSettings.targetIP = '127.0.0.1';
        globalSettings.multiplayer = { type };
        break;
      case 'host':
        serverSettings.targetIP = ip;
        serverSettings.targetPort = port;
        globalSettings.multiplayer = { type };
        break;
      default:
        throw new Error(`Unknown type in update: ${type}`);
    }
    mainWindow.loadURL(getSiteUrl(globalSettings, serverSettings));
  });
}