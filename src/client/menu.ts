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
import { createChangeClientIPWindow } from "./client-ip";
import { createChangeServerIPWindow } from "./server-ip";

const createMenuTemplate = (store: Store, mainWindow: BrowserWindow, globalSettings: GlobalSettings, serverSettings: SettingsManager): MenuItemConstructorOptions[] => {
  const options: MenuItemConstructorOptions = {
    id: '1',
    label: 'Options',
    submenu: [
      {
        label: 'Open Settings',
        click: () => { createSettingsWindow(globalSettings, mainWindow); }
      },
      {
        label: 'Open Mods',
        click: () => { createModsWindow(mainWindow) }
      },
      {
        label: 'Clear Cache',
        click: () => { clearCache(mainWindow); }
      },
      {
        label: 'Open Dev Tools',
        accelerator: 'CommandOrControl+Shift+I',
        click: () => { openDevTools(mainWindow); }
      },
      {
        label: 'Reload',
        accelerator: 'F5',
        click: () => loadMain(mainWindow, globalSettings, serverSettings)
      },
      {
        label: 'Reload Clear Cache',
        accelerator: 'CommandOrControl+R',
        click: () => { mainWindow.webContents.reloadIgnoringCache(); }
      },
      {
        label: 'Toggle Full Screen',
        accelerator: 'F11',
        click: () => { toggleFullScreen(store, mainWindow); }
      },
      { 
        label: 'Zoom In',
        role: 'zoomIn',
        accelerator: 'CommandOrControl+=',
      },
      {
        label: 'Zoom Out',
        role: 'zoomOut',
        accelerator: 'CommandOrControl+-',
      },

      {
        label: 'Reset Zoom',
        role: 'resetZoom',
        accelerator: 'CommandOrControl+0',
      },
      {
        label: 'Enable/Disable Discord Rich Presence',
        click: () => { enableOrDisableDiscordRPC(store, mainWindow); }
      },
      {
        label: 'Enable/Disable room tracking through Discord Rich Presence',
        click: () => { enableOrDisableDiscordRPCLocationTracking(store, mainWindow); }
      },
      {
        label: 'Change the client IP',
        click: () => { createChangeClientIPWindow(globalSettings, mainWindow); }
      },
      {
        label: 'Change your server\'s IP',
        click: () => { createChangeServerIPWindow(serverSettings, mainWindow) }
      }
    ]
  };

  const timeline: MenuItemConstructorOptions = {
    id: '3',
    label: 'Timeline',
    click: () => { createTimelinePicker(mainWindow); }
  };

  return [
    options,
    timeline
  ];
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