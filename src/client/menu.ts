import { BrowserWindow, Menu, MenuItemConstructorOptions } from "electron";
import { enableOrDisableDiscordRPC, enableOrDisableDiscordRPCLocationTracking } from "./discord";
import { Store } from "./store";
import { loadMain, toggleFullScreen } from "./window";
import { createSettingsWindow } from "./views/settings/settings";
import { GlobalSettings } from "@common/utils";
import { createTimelinePicker } from "./views/timeline/timeline";
import { createModsWindow } from "./views/mods/mods";
import { SettingsManager } from "@server/settings";
import { createMultiplayerSettings } from "./views/multiplayer/multiplayer";
import { createCommands } from "./views/commands/commands";
import { Popups } from "./popups";
import { WorldServer } from "@server/socket-server/world-server";

const startMenu = (
  store: Store,
  mainWindow: BrowserWindow,
  globalSettings: GlobalSettings,
  serverSettings: SettingsManager,
  popups: Popups,
  gameServer: WorldServer
) => {
  const app: MenuItemConstructorOptions = { 
    id: '0', 
    role: 'appMenu'
  };
  
  const options: MenuItemConstructorOptions = {
    id: '1',
    label: 'Options',
    submenu: [
      {
        label: 'Open Settings',
        accelerator: 'CommandOrControl+,',
        click: () => createSettingsWindow(mainWindow, popups, serverSettings, gameServer)
      },
      {
        label: 'Open Mods',
        accelerator: 'CommandOrControl+M',
        click: () => createModsWindow(mainWindow, popups, serverSettings, gameServer)
      },
      {
        label: 'Open Multiplayer Settings',
        click: () => createMultiplayerSettings(globalSettings,serverSettings, mainWindow)
      },
      {
        label: 'Open Commands',
        accelerator: 'CommandOrControl+D',
        click: () => createCommands(mainWindow, popups, serverSettings, gameServer)
      },
      {
        type: 'separator'
      },
      {
        label: 'Open Dev Tools',
        accelerator: 'CommandOrControl+Shift+I',
        click: () => mainWindow.webContents.openDevTools()
      },
      {
        label: 'Clear Cache',
        click: () => mainWindow.webContents.session.clearCache()
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
    click: () => createTimelinePicker(mainWindow, popups, serverSettings, gameServer)
  };

  // only adding the submenu if Mac, because empty submenu leads to it not working on other OSes, and it's a necessary Mac feature
  if (process.platform === 'darwin') {
    timeline.submenu = [{ 
      label: 'Timeline Picker', 
      click: () => createTimelinePicker(mainWindow, popups, serverSettings, gameServer)
    }];
  }

  // on Mac, stuff like copying/pasting does not work without this
  const edit: MenuItemConstructorOptions = {
    id: '4',
    role: 'editMenu'
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

  const menuTemplate = process.platform === 'darwin' ? 
    [app, options, timeline, edit, view] : 
    [options, timeline, view];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};

export default startMenu;