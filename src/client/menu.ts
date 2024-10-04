import { BrowserWindow, Menu, MenuItem, MenuItemConstructorOptions } from "electron";
import clearCache from "./cache";
import openDevTools from "./dev-tools";
import { enableOrDisableDiscordRPC, enableOrDisableDiscordRPCLocationTracking } from "./discord";
import { Store } from "./store";
import { toggleFullScreen } from "./window";
import { createSettingsWindow } from "./settings";

const createMenuTemplate = (store: Store, mainWindow: BrowserWindow): MenuItemConstructorOptions[] => {
  const options: MenuItemConstructorOptions = {
    id: '1',
    label: 'Options',
    submenu: [
      {
        label: 'Open Settings',
        click: () => { createSettingsWindow(); }
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
        role: 'reload',
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
    ]
  };

  const discord: MenuItemConstructorOptions = {
    id: '3',
    label: 'Discord',
    submenu: [
      {
        label: 'Enable/Disable Discord Rich Presence',
        click: () => { enableOrDisableDiscordRPC(store, mainWindow); }
      },
      {
        label: 'Enable/Disable room tracking through Discord Rich Presence',
        click: () => { enableOrDisableDiscordRPCLocationTracking(store, mainWindow); }
      }
    ]
  };

  return [
    options,
    discord
  ];
};

const startMenu = (store: Store, mainWindow: BrowserWindow) => {
  const menuTemplate = createMenuTemplate(store, mainWindow);

  buildMenu(menuTemplate);
};

const buildMenu = (menuTemplate: MenuItemConstructorOptions[] | MenuItem[]) => {
  const menu = Menu.buildFromTemplate(menuTemplate);

  Menu.setApplicationMenu(menu);
};

export default startMenu;