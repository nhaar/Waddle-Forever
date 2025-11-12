import path from 'path'

import { app, BrowserWindow, dialog } from "electron";
import log from "electron-log";
import { autoUpdater } from "electron-updater";
import { startDiscordRPC } from "./discord";
import loadFlashPlugin from "./flash-loader";
import startMenu from "./menu";
import createStore from "./store";
import createWindow from "./window";
import startServer from "../server/server";
import settingsManager from "../server/settings";
import { showWarning } from "./warning";
import { setLanguageInStore } from "./discord/localization/localization";
import electronIsDev from "electron-is-dev";
import { AdminError, downloadMediaFolder, startMedia } from "./media";
import { GlobalSettings } from '../common/utils';
import { VERSION } from '../common/version';

log.initialize();

console.log = log.log;

const store = createStore();

setLanguageInStore(store, 'en')


if (process.platform === 'linux') {
  app.commandLine.appendSwitch('no-sandbox');
}


loadFlashPlugin(app);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow;

/** An object to keep global variables in memory across windows */
let globalSettings : GlobalSettings = {
  isEditting: false,
  targetIP: undefined,
  targetPort: undefined
};

app.on('ready', async () => {
  // setup window is necessary so that in case we need to
  // download media, closing the windows won't abort and close the program
  const setupWindow = new BrowserWindow({
    width: 200,
    height: 100,
    frame: false,
    resizable: false
  });
  setupWindow.loadFile(path.join(__dirname, 'views/setup.html'));

  let mediaSuccess;
  try {
    // this will throw an error if installing for all users and not running as
    // an administrator
    mediaSuccess = await startMedia();
  } catch (error) {
    if (error instanceof AdminError) {
      await dialog.showMessageBox(setupWindow, {
        buttons: ['Ok'],
        title: 'Permission Error',
        message: 'Waddle Forever could not initiate the files. Please run Waddle Forever as an administrator to fix this issue.'
      });
      app.quit();

    } else {
      const message = error instanceof Error ? `${error.name}:${error.message}\n${error.stack}` : 'Unknown';
      await dialog.showMessageBox(setupWindow, {
        buttons: ['Ok'],
        title: 'Download Error',
        message: `It was not possible to finish the installation.\nPlease check your internet connection, and if the problem persists contact the Waddle Forever admins.\n\nShow this to the admins:\n${message}`
      })
  
      app.quit();
    }
  }
  
  // only check if the clothing settings is false, otherwise it would have been downloaded already
  if (!settingsManager.settings.clothing && settingsManager.settings.answered_packages !== VERSION) {
    const result = await dialog.showMessageBox(mainWindow, {
      buttons: ['Download Clothing (~600 MB)', 'No Thanks'],
      title: 'Download package?',
      message: 'Would you like to download the clothing package? It includes all non essential clothing items from Club Penguin. If you say no, you can always download it later.',
      defaultId: 0,
      cancelId: 1
    });
    if (result.response === 0) {
      await downloadMediaFolder('clothing', () => {
        settingsManager.updateSettings({ clothing: true });
      }, () => {
        mediaSuccess = false;
      })
    }
    settingsManager.updateSettings({ answered_packages: VERSION });
  }
  try {
    await startServer(settingsManager);

    // this message box is useless, but for some reason, it is the only way for auto reload to work
    await dialog.showMessageBox(mainWindow, {
      buttons: ['Start'],
      title: 'Ready',
      message: `Waddle Forever is Ready!`
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('EADDRINUSE')) {
      const result = await dialog.showMessageBox(mainWindow, {
        buttons: ['Boot Serverless', 'Check out error'],
        title: 'Server Error',
        message: `Another process is already using the designated ports. If you want, you can boot Waddle Forever without its server, but this is only useful if you have another Waddle Forever client running already, otherwise you may have to close the other process using the ports (check error).`,
        defaultId: 1,
        cancelId: 0
      });
      
      if (result.response === 1) {
        await showWarning(mainWindow, 'Error', error.message + '\n' + error.stack);
      }
    } else {
      throw error;
    }
  }

  mainWindow = await createWindow(store, globalSettings, settingsManager);
  // release window since the main window now serves as
  // the window that will remain open
  setupWindow.close();

  // Some users was reporting problems with cache.
  await mainWindow.webContents.session.clearHostResolverCache();

  startMenu(store, mainWindow, globalSettings, settingsManager);

  if (!electronIsDev) {
    startDiscordRPC(store, mainWindow);
  }
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
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = await createWindow(store, globalSettings, settingsManager);
    startMenu(store, mainWindow, globalSettings, settingsManager);
  }
});