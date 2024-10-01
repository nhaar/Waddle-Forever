import { BrowserWindow, dialog } from "electron";

const openDevTools = async (mainWindow: BrowserWindow) => {
  mainWindow.webContents.openDevTools();
};

export default openDevTools;