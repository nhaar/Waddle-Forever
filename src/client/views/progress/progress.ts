import path from 'path'
import { app, BrowserWindow, dialog } from "electron";

function createProgressBarWindow(prompt: string) {
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

  progressBarWindow.loadFile(path.join(__dirname, 'progress.html'));
  
  progressBarWindow.on('ready-to-show', () => {
    progressBarWindow.webContents.send('prompt-name', prompt)
  })

  return progressBarWindow
}

function setProgress(value: number, window: BrowserWindow) {
  if (window && !window.isDestroyed()) {
    window.webContents.send('update-progress', value);
  }
}

export type ProgressCallback = (progress: number) => void

export async function showProgress(message: string, task: (progress: ProgressCallback, end: () => void) => Promise<boolean>): Promise<boolean> {
  const progressWin = createProgressBarWindow(message)
  let lastUpdate = Date.now();
  return await task((progress: number) => {
    const cur = Date.now();
    if (cur > lastUpdate + 1000) {
      lastUpdate = cur
      setProgress(progress, progressWin)
    }
  }, () => {
    // destroy, not close, otherwise we'll trigger the popup in the 'close' event
    progressWin.destroy()
  })
}