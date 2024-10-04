import { BrowserWindow } from "electron";

export const createSettingsWindow = async () => {
  const settingsWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: "Settings"
  });

  settingsWindow.loadFile('views/settings.html');

  return settingsWindow;
}