import { BrowserWindow, dialog } from "electron";

export async function showWarning(window: BrowserWindow, title: string, message: string) {
  await dialog.showMessageBox(window, {
    buttons: ['Ok'],
    title,
    message
  });
}