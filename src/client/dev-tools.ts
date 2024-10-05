import { BrowserWindow } from "electron";

const openDevTools = async (mainWindow: BrowserWindow) => {
  mainWindow.webContents.openDevTools();
};

export default openDevTools;