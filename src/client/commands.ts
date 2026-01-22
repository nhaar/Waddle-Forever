import { BrowserWindow } from "electron";
import path from "path";

let commandsWindow: BrowserWindow | null;

export function createCommands(mainWindow: BrowserWindow) {
  if (commandsWindow) {
    commandsWindow.focus();
    return;
  } 
  commandsWindow = new BrowserWindow({
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

  commandsWindow.on('closed', () => {
    commandsWindow = null;
  });

  commandsWindow.loadFile(path.join(__dirname, 'views/commands.html'));
}