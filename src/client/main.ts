import { app, BrowserWindow } from "electron";
import log from "electron-log";
import { startDiscordRPC } from "./discord";
import loadFlashPlugin from "./flash-loader";
import startMenu from "./menu";
import createStore from "./store";
import createWindow from "./window";
import startServer from "../server/server";
import settingsManager from "../server/settings";

log.initialize();

console.log = log.log;

const store = createStore();

if (process.platform === 'linux') {
  app.commandLine.appendSwitch('no-sandbox');
}


loadFlashPlugin(app);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow;

app.on('ready', async () => {
  console.log('hellobruv');
  startServer(settingsManager);

  mainWindow = await createWindow(store);

  // Some users was reporting problems with cache.
  await mainWindow.webContents.session.clearHostResolverCache();

  startMenu(store, mainWindow, settingsManager);

  startDiscordRPC(store, mainWindow);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-closed', async () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    try
    {
      const discordClient = store.private.get('discordState')?.client;

      if (discordClient) {
        await discordClient.destroy();
      }
    }
    finally
    {
      // Always try to quit
      app.quit();

      process.exit(0);
    }    
  }
});

app.on('activate', async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    mainWindow = await createWindow(store);
  }
});