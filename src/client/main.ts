import path from 'path'

import { app, BrowserWindow, dialog, shell } from "electron";
import log from "electron-log";
import { startDiscordRPC } from "./discord";
import loadFlashPlugin from "./flash-loader";
import startMenu from "./menu";
import createStore from "./store";
import createWindow from "./window";
import settingsManager from "@server/settings";
import { showWarning } from "./warning";
import { setLanguageInStore } from "./discord/localization/localization";
import electronIsDev from "electron-is-dev";
import { AdminError, downloadMediaFolder, startMedia } from "./media";
import { GlobalSettings } from '@common/utils';
import { VERSION } from '@common/version';
import { Popups } from './popups';
import { WEBSITE } from '@common/website';
import { WorldServer } from '@server/socket-server/world-server';
import { startMods, startServices } from '@server/boot';

log.initialize();

console.log = log.log;

const store = createStore();

setLanguageInStore(store, 'en')


if (process.platform === 'linux') {
  app.commandLine.appendSwitch('no-sandbox');
}

let server: WorldServer | null = null;

loadFlashPlugin(app);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow;

/** An object to keep global variables in memory across windows */
let globalSettings : GlobalSettings = {
  multiplayer: { type: 'local' }
};

const popups: Popups = new Map<string, BrowserWindow>();

app.on('ready', async () => {
  // a window needs to exist at least for windows, during the download process
  const setupWindow = new BrowserWindow({
    width: 200,
    height: 100,
    frame: false,
    resizable: false
  });
  await setupWindow.loadFile(path.join(__dirname, 'views/setup.html'));

  try {
    // this will throw an error if installing for all users and not running as
    // an administrator
    await startMedia();
  } catch (error) {
    if (error instanceof AdminError) {
      await dialog.showMessageBox(setupWindow, {
        buttons: ['Ok'],
        title: 'Permission Error',
        message: 'Waddle Forever could not initiate the files. Please run Waddle Forever as an administrator to fix this issue.'
      });
      app.quit();
      return;
    } else {
      const message = error instanceof Error ? `${error.name}:${error.message}\n${error.stack}` : 'Unknown';
      await dialog.showMessageBox(setupWindow, {
        buttons: ['Ok'],
        title: 'Download Error',
        message: `It was not possible to finish the installation.\nPlease check your internet connection, and if the problem persists contact the Waddle Forever admins.\n\nShow this to the admins:\n${message}`
      })
  
      app.quit();
      return;
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
      }, () => {})
    }
    settingsManager.updateSettings({ answered_packages: VERSION });
  }

  if (!settingsManager.settings.faq_warning) {
    const result = await dialog.showMessageBox(mainWindow, {
      buttons: ['Take me to the FAQ', 'Understood'],
      title: 'Heads-Up!',
      message: `Welcome to Waddle Forever! If you know nothing about this client, you might be confused about some things:
- You don't need to create an account, just log in with any name or password
- The game is entirely offline
- You can choose the day in the timeline, use commands, and more through the menu

These are the most important things, but there is a full list of questions in our FAQ. If you're ever lost, you can read it in our website.`,
      cancelId: 2
    });

    if (result.response === 0 || result.response === 1) {
      if (result.response === 0) {
        shell.openExternal(`${WEBSITE}/faq`);
      }
      settingsManager.updateSettings({ faq_warning: true });
    }
  }

  const failedMods = startMods();
  if (failedMods.length > 0) {
    await dialog.showMessageBox(mainWindow, {
      buttons: ['OK'],
      title: 'Error with Mods',
      message: `The following mods could not be turned on. Please fix them and then try enabling them again:

${failedMods.map(mod => `* ${mod}`).join('\n')}}`
    });
  }

  try {
    server = await startServices();
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
  setupWindow.close();

  // Some users were reporting problems with cache.
  await mainWindow.webContents.session.clearHostResolverCache();

  startMenu(store, mainWindow, globalSettings, settingsManager, popups, server);

  if (!electronIsDev) {
    startDiscordRPC(store, mainWindow);
  }

  mainWindow.on('closed', () => {
    popups.forEach(win => {
      win.close();
    });
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
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = await createWindow(store, globalSettings, settingsManager);
    startMenu(store, mainWindow, globalSettings, settingsManager, popups, server);
  }
});