import { BrowserWindow } from "electron";

const clearCache = (mainWindow: BrowserWindow) => {
  mainWindow.webContents.session.clearCache();
};

export default clearCache;