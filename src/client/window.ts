import path from 'path';
import { BrowserWindow, shell } from "electron";
import { Store } from "./store";
import { checkUpdates } from "./update";
import { HTTP_PORT } from '../common/constants';

export const toggleFullScreen = (store: Store, mainWindow: BrowserWindow) => {
  const fullScreen = !store.private.get("fullScreen");

  store.private.set("fullScreen", fullScreen);

  mainWindow.setFullScreen(fullScreen);
};

export const loadMain = (window: BrowserWindow) => {
  window.loadURL(`http://localhost:${HTTP_PORT}`)
}

interface FiveIconByPlatforms {
  [key: string]: () => void;
}

const createWindow = async (store: Store) => {
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

  loadMain(mainWindow);

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.includes("localhost")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });  
  return mainWindow;
};

export default createWindow;
