import path from 'path';
import { BrowserWindow, dialog } from "electron";
import { Store } from "./store";
import { checkUpdates, update } from "./update";

export const toggleFullScreen = (store: Store, mainWindow: BrowserWindow) => {
  const fullScreen = !store.private.get("fullScreen");

  store.private.set("fullScreen", fullScreen);

  mainWindow.setFullScreen(fullScreen);
};

interface FiveIconByPlatforms {
  [key: string]: () => void;
}

const createWindow = async (store: Store) => {
  const setFaviconByPlatform: FiveIconByPlatforms = {
    win32: () => {
      mainWindow.setIcon(path.join(__dirname, "../assets/favicon.ico"));
    },
    darwin: () => {
      mainWindow.setIcon(path.join(__dirname, "assets/icon.png"));
    },
    linux: () => {
      mainWindow.setIcon(path.join(__dirname, "assets/icon.png"));
    },
  };

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: "Starting...",
    webPreferences: {
      plugins: true,
    },
  });
  
  setFaviconByPlatform[process.platform]();
  
  mainWindow.setMenu(null);
  mainWindow.maximize();
  
  await checkUpdates(mainWindow);

  mainWindow.loadURL('http://localhost');
  
  return mainWindow;
};

export default createWindow;
