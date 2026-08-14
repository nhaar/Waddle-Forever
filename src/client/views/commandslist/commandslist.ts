import { BrowserWindow } from "electron";
import path from "path";
import { getPopupCreator } from "@client/popups";
import { getCommandsList } from "@server/commands/commands";

export const createCommandsList = getPopupCreator('commandslist', ['get-commands'], (mainWindow, settings, server
) => {
  const commandsWindow = new BrowserWindow({
    width: 500,
    height: 600,
    title: "List of Commands",
    webPreferences: {
      preload: path.join(__dirname, 'commandslist-preload.js')
    },
    resizable: false,
    parent: mainWindow
  });

  commandsWindow.setMenu(null);

  commandsWindow.loadFile(path.join(__dirname, 'commandslist.html'));

  commandsWindow.webContents.on('did-finish-load', () => {
    commandsWindow.webContents.send('get-commands', getCommandsList());
  });

  return commandsWindow;
})