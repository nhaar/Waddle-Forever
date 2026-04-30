import { Server } from "@server/client";
import { SettingsManager } from "@server/settings";
import { BrowserWindow, ipcMain } from "electron";

export type Popups = Map<string, BrowserWindow>;

/** Create a popup window which can only have on instance at once
 * Name is just an unique identifier of this window, the value itself doesn't matter
 * eventListeners are the list of events that have to be cleaned in ipcMain after the windows closes
 * The initializer is a function that creates the window and returns it
 */
export function getPopupCreator(
  name: string,
  eventListeners: string[],
  windowInitializer: (mainWindow: BrowserWindow, settings: SettingsManager, gameServer: Server) => BrowserWindow
): (mainWin: BrowserWindow, wins: Popups, settings: SettingsManager, gameServer: Server) => Promise<void> {
  return (async (mainWin: BrowserWindow, wins: Popups, settings: SettingsManager, gameServer: Server) => {
    const prev = wins.get(name);
    if (prev !== undefined) {
      prev.focus();
      return;
    }
  
    const popup = windowInitializer(mainWin, settings, gameServer);
    wins.set(name, popup);
      popup.on('closed', () => {
      for (const event of eventListeners) {
        ipcMain.removeAllListeners(event);
      }
      wins.delete(name);
    });
  })
}