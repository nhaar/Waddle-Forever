import { BrowserWindow, ipcMain } from "electron";
import path from "path";
import { getPopupCreator } from "@client/popups";
import { createCommandsList } from "../commandslist/commandslist";

export const createCommands = getPopupCreator('commands', ['get-players', 'run-command'], (mainWindow, settings, server, wins
) => {
  const commandsWindow = new BrowserWindow({
    width: 500,
    height: 300,
    title: "Commands",
    webPreferences: {
      preload: path.join(__dirname, 'commands-preload.js')
    },
    resizable: false,
    parent: mainWindow
  });

  commandsWindow.setMenu(null);

  commandsWindow.loadFile(path.join(__dirname, 'commands.html'));

  ipcMain.on('get-players', () => {
    commandsWindow.webContents.send('get-players', server.getAllPlayersInfo());
  });

  ipcMain.on('run-command', (_, arg) => {
    const { id, command } = arg;
    if (typeof id === 'number' && typeof command === 'string') {
      const response = server.runCommand(id, command);
      commandsWindow.webContents.send('command-response', response);
    }
  });

  ipcMain.on('open-commands-list', () => {
    createCommandsList(mainWindow, wins, settings, server)
  });

  return commandsWindow;
})