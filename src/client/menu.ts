import { BrowserWindow, Menu, MenuItem, MenuItemConstructorOptions } from "electron";
import clearCache from "./cache";
import openDevTools from "./dev-tools";
import { enableOrDisableDiscordRPC, enableOrDisableDiscordRPCLocationTracking } from "./discord";
import { Store } from "./store";
import { loadMain, toggleFullScreen } from "./window";
import { createSettingsWindow } from "./settings";
import { GlobalSettings } from "../common/utils";
import { createTimelinePicker } from "./timeline";
import { createModsWindow } from "./mods";
import { SettingsManager } from "../server/settings";
import { createMultiplayerSettings } from "./multiplayer";
import { createCommands } from "./commands";

const createMenuTemplate = (store: Store, mainWindow: BrowserWindow, globalSettings: GlobalSettings, serverSettings: SettingsManager): MenuItemConstructorOptions[] => {
  const app: MenuItemConstructorOptions = { 
    id: '0', 
    label: 'Waddle Forever', 
    submenu: [
      {
        label: 'Quit Waddle Forever', 
        role: 'quit'
      }, 
      {
        role: 'close'
      }
    ]
  };
  
  const options: MenuItemConstructorOptions = {
    id: '1',
    label: 'Options',
    submenu: [
      {
        label: 'Open Settings',
        accelerator: 'CommandOrControl+,',
        click: () => createSettingsWindow(globalSettings, mainWindow)
      },
      {
        label: 'Open Mods',
        accelerator: 'CommandOrControl+M',
        click: () => createModsWindow(mainWindow)
      },
      {
        label: 'Open Multiplayer Settings',
        click: () => createMultiplayerSettings(globalSettings,serverSettings, mainWindow)
      },
      {
        label: 'Open Commands',
        accelerator: 'CommandOrControl+D',
        click: () => createCommands(mainWindow)
      },
      {
        type: 'separator'
      },
      {
        label: 'Open Dev Tools',
        accelerator: 'CommandOrControl+Shift+I',
        click: () => openDevTools(mainWindow)
      },
      {
        label: 'Clear Cache',
        click: () => clearCache(mainWindow)
      },
      {
        label: 'Reload',
        accelerator: 'F5',
        click: () => loadMain(mainWindow, globalSettings, serverSettings)
      },
      {
        label: 'Reload Clear Cache',
        accelerator: 'CommandOrControl+R',
        click: () => mainWindow.webContents.reloadIgnoringCache()
      },
      {
        type: 'separator'
      },
      {
        label: 'Toggle Discord Rich Presence',
        click: () => enableOrDisableDiscordRPC(store, mainWindow)
      },
      {
        label: 'Toggle room tracking through Discord Rich Presence',
        click: () => enableOrDisableDiscordRPCLocationTracking(store, mainWindow)
      }
    ]
  };

  const timeline: MenuItemConstructorOptions = {
    id: '3',
    label: 'Timeline',
    click: () => createTimelinePicker(mainWindow)
  };

  // only adding the submenu if Mac, because empty submenu leads to it not working on other OSes, and it's a necessary Mac feature
  if (process.platform === 'darwin') {
    timeline.submenu = [{ 
      label: 'Timeline Picker', 
      click: () => createTimelinePicker(mainWindow)
    }];
  }

  // on Mac, stuff like copying/pasting does not work without this
  const edit: MenuItemConstructorOptions = {
    id: '4',
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectAll' }
    ]
  }

  const view: MenuItemConstructorOptions = {
    id: '4',
    label: 'View',
    submenu: [
      { role: 'zoomIn', accelerator: 'CommandOrControl+Plus' },
      { role: 'zoomOut', accelerator: 'CommandOrControl+-' },
      { role: 'resetZoom' },
      { type: 'separator' },
      {
        label: 'Toggle Full Screen',
        accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
        click: () => toggleFullScreen(store, mainWindow)
      },
    ]
  }

  return process.platform === 'darwin' ? 
    [app, options, timeline, edit, view] : 
    [options, timeline, view];
};

const startMenu = (store: Store, mainWindow: BrowserWindow, globalSettings: GlobalSettings, serverSettings: SettingsManager) => {
  const menuTemplate = createMenuTemplate(store, mainWindow, globalSettings, serverSettings);
  buildMenu(menuTemplate);
};

const buildMenu = (menuTemplate: MenuItemConstructorOptions[] | MenuItem[]) => {
  const menu = Menu.buildFromTemplate(menuTemplate);

  Menu.setApplicationMenu(menu);
};

export default startMenu;