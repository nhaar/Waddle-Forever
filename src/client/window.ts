import path from 'path';
import { BrowserWindow, shell } from "electron";
import { Store } from "./store";
import { checkUpdates } from "./update";
import { GlobalSettings } from '../common/utils';
import { SettingsManager } from '../server/settings';
import { getSiteUrl } from './views/multiplayer/multiplayer';

const faviconPaths = {
  win32: "../assets/favicon.ico",
  darwin: "../assets/icon.png",
  linux: "../assets/icon.png"
}

function getIP(clientSettings: GlobalSettings, serverSettings: SettingsManager) {
  if (clientSettings.multiplayer.type === 'guest') {
    return clientSettings.multiplayer.ip;
  }
  return serverSettings.targetIP;
}

export const toggleFullScreen = (store: Store, mainWindow: BrowserWindow) => {
  const fullScreen = !store.private.get("fullScreen");

  store.private.set("fullScreen", fullScreen);

  mainWindow.setFullScreen(fullScreen);
};

export const loadMain = (window: BrowserWindow, settings: GlobalSettings, serverSettings: SettingsManager) => {
  window.loadURL(getSiteUrl(settings, serverSettings));    
}

export const createWindow = async (store: Store, clientSettings: GlobalSettings, serverSettings: SettingsManager) => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: "Loading...",
    webPreferences: {
      plugins: true,
    },
  });

  mainWindow.setIcon(path.join(__dirname, faviconPaths[process.platform]));
  
  mainWindow.setMenu(null);
  mainWindow.maximize();
  
  checkUpdates(mainWindow, serverSettings);

  loadMain(mainWindow, clientSettings, serverSettings);

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.includes('localhost') || !url.includes(getIP(clientSettings, serverSettings))) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  return mainWindow;
};
