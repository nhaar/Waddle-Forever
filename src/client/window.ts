import path from 'path';
import { BrowserWindow, shell } from "electron";
import { Store } from "./store";
import { checkUpdates } from "./update";
import { GlobalSettings } from '../common/utils';
import { SettingsManager } from '../server/settings';
import { getSiteUrl } from './multiplayer';

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
  
  checkUpdates(mainWindow, serverSettings);

  loadMain(mainWindow, clientSettings, serverSettings);

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.includes('localhost') || !url.includes(getIP(clientSettings, serverSettings))) {
      event.preventDefault();

      if (url.includes("clubpenguin.com")){
        console.log("tried navigating to clubpenguin url");
        return;
      }
      shell.openExternal(url);
    }
  });

  mainWindow.webContents.on('did-start-navigation', (event, url) => {
    console.log("started navigate: " + url);
  })

  return mainWindow;
};

export default createWindow;
