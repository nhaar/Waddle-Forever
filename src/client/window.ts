import path from 'path';
import { BrowserWindow, shell } from "electron";
import { Store } from "./store";
import { checkUpdates } from "./update";
import { GlobalSettings, makeURL } from '../common/utils';
import { SettingsManager } from '../server/settings';

function getIP(clientSettings: GlobalSettings, serverSettings: SettingsManager) {
  return clientSettings.targetIP ?? serverSettings.targetIP;
}

export const toggleFullScreen = (store: Store, mainWindow: BrowserWindow) => {
  const fullScreen = !store.private.get("fullScreen");

  store.private.set("fullScreen", fullScreen);

  mainWindow.setFullScreen(fullScreen);
};

export const loadMain = (window: BrowserWindow, settings: GlobalSettings, serverSettings: SettingsManager) => {
  window.loadURL(makeURL(getIP(settings, serverSettings), settings.targetPort));
}

interface FiveIconByPlatforms {
  [key: string]: () => void;
}

const createWindow = async (store: Store, clientSettings: GlobalSettings, serverSettings: SettingsManager) => {
  const setFaviconByPlatform: FiveIconByPlatforms = {
    win32: () => {
      mainWindow.setIcon(path.join(__dirname, "../assets/favicon.ico"));
    },
    darwin: () => {
      mainWindow.setIcon(path.join(__dirname, "../assets/icon.png"));
    },
    linux: () => {
      mainWindow.setIcon(path.join(__dirname, "../assets/icon.png"));
    },
  };

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: "Loading...",
    webPreferences: {
      plugins: true,
    },
  });
  
  setFaviconByPlatform[process.platform]();
  
  mainWindow.setMenu(null);
  mainWindow.maximize();
  
  await checkUpdates(mainWindow);

  loadMain(mainWindow, clientSettings, serverSettings);

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.includes('localhost') || !url.includes(getIP(clientSettings, serverSettings))) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });  
  return mainWindow;
};

export default createWindow;
