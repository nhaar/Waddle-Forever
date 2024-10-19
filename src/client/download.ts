import path from 'path';
import fs from 'fs';
import http from 'http';
import https from 'https';

import { BrowserWindow } from "electron";
import { parseURL } from '../common/utils';
import { WEBSITE } from '../common/website';

function setProgress(value: number, window: BrowserWindow) {
  if (window) {
    window.webContents.send('update-progress', value);
  }
}

function createProgressBarWindow(prompt: string) {
  const progressBarWindow = new BrowserWindow({
      width: 300,
      height: 100,
      frame: false, // cleaner look
      alwaysOnTop: true,
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

export async function downloadFile(filename: string, destination: string, current: number, total: number) {
    const progressWin = createProgressBarWindow(`Downloading files (${current} out of ${total}): `)

    const file = fs.createWriteStream(destination);

    const url = `${WEBSITE}/${filename}`

    const { protocol } = parseURL(url)

    const module = protocol === 'http' ? http : https

    await new Promise<void>((resolve, reject) => {
      module.get(url, (response) => {
          const totalSize = Number(response.headers['content-length'])
          let downloadedSize = 0;

          // update every second
          let lastUpdate = Date.now();
          let progress = 0;
          response.on('data', (chunk) => {
            downloadedSize += chunk.length;
            const cur = Date.now()
            if (cur > lastUpdate + 1000) {
              lastUpdate = cur 
              progress = downloadedSize / totalSize;
              setProgress(progress, progressWin)
            }
          })

          response.pipe(file);
  
          file.on('finish', () => {
              file.close();
              progressWin.close();
              resolve();
          });
      }).on('error', (err) => {
          fs.unlink(destination, () => {});
          console.error(`Error: ${err.message}`);
          reject(err);
      });
    })
}