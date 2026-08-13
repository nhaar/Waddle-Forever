import { BrowserWindow, ipcMain } from "electron";
import path from "path";
import { getPopupCreator } from "./popups";
import { getCommandsList } from "@server/commands/commands";

export const createCommandsList = getPopupCreator('commandslist', ['get-commands'], (mainWindow, settings, server
) => {
  const commandsWindow = new BrowserWindow({
    width: 500,
    height: 600,
    title: "List of Commands",
    webPreferences: {
      preload: path.join(__dirname, 'preload/commandslist-preload.js')
    },
    resizable: false,
    parent: mainWindow
  });

  commandsWindow.setMenu(null);

  commandsWindow.loadFile(path.join(__dirname, 'views/commandslist.html'));

  commandsWindow.webContents.on('did-finish-load', () => {
    commandsWindow.webContents.send('get-commands', getCommandsList());
  });

  return commandsWindow;
})