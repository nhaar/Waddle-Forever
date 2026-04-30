import { BrowserWindow, ipcMain } from "electron";
import path from "path";
import { getPopupCreator } from "./popups";

export const createCommands = getPopupCreator('commands', ['get-players', 'run-command'], (mainWindow, settings, server, handler) => {
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

  ipcMain.on('run-command', (_, arg) => {
    const { id, command } = arg;
    if (typeof id === 'number' && typeof command === 'string') {
      const client = server.getPlayerById(id);
      if (client !== undefined) {
        handler.runCommand(client, command);
      }
    }
  });

  return commandsWindow;
})