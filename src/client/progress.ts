import path from 'path'
import { BrowserWindow } from "electron";

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

  progressBarWindow.loadFile(path.join(__dirname, 'views/progress.html'));
  
  progressBarWindow.on('ready-to-show', () => {
    progressBarWindow.webContents.send('prompt-name', prompt)
  })

  return progressBarWindow
}

function setProgress(value: number, window: BrowserWindow) {
  if (window) {
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
    progressWin.close()
  })
}