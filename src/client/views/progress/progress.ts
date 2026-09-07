import path from 'path'
import { app, BrowserWindow, dialog } from "electron";

export async function createProgressBarWindow() {
  const progressBarWindow = new BrowserWindow({
      width: 300,
      height: 200,
      frame: false, // cleaner look
      alwaysOnTop: false,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
  });

  progressBarWindow.on('close', async (e) => {
    // This is needed because the progress updater will break
    // when the window is closed. it's better to quit the whole app
    // in this case, but not before asking the user if they're sure.

    e.preventDefault();

    const result = await dialog.showMessageBox(progressBarWindow, {
      buttons: ['Yes', 'No'],
      title: 'Close Waddle Forever?',
      message: 'Are you sure you want to close this window? If you do, Waddle Forever will close and the media download will be cancelled.',
      defaultId: 1,
      cancelId: 1
    });

    if (result.response === 0) {
      progressBarWindow.destroy();
      app.quit();
      process.exit(0);
    }
  })

  await progressBarWindow.loadFile(path.join(__dirname, 'progress.html'));

  return progressBarWindow
}

export function setPrompt(prompt: string, window: BrowserWindow) {
  if (window && !window.isDestroyed()) {
    window.webContents.send('prompt-name', prompt);
  }
}

function setProgress(value: number, window: BrowserWindow) {
  if (window && !window.isDestroyed()) {
    window.webContents.send('update-progress', value);
  }
}

export type ProgressCallback = (progress: number) => void

export async function showProgress(progressWin: BrowserWindow, task: (progress: ProgressCallback, end: () => void) => Promise<boolean>): Promise<boolean> {
  let lastUpdate = Date.now();
  return await task((progress: number) => {
    const cur = Date.now();
    if (cur > lastUpdate + 1000) {
      lastUpdate = cur
      setProgress(progress, progressWin)
    }
  }, () => {})
}