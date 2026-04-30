import { BrowserWindow, ipcMain } from "electron";
import path from "path";
import { getPopupCreator } from "./popups";

export const createCommands = getPopupCreator('commands', ['get-players'], (mainWindow, settings, server) => {
  const commandsWindow = new BrowserWindow({
    width: 500,
    height: 300,
    title: "Commands",
    webPreferences: {
      preload: path.join(__dirname, 'preload/commands-preload.js')
    },
    resizable: false,
    parent: mainWindow
  });

  commandsWindow.setMenu(null);

  commandsWindow.loadFile(path.join(__dirname, 'views/commands.html'));

  ipcMain.on('get-players', () => {
    commandsWindow.webContents.send('get-players', server.getAllPlayersInfo());
  });

  return commandsWindow;
})