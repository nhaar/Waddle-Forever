import fs from 'fs';
import http from 'http';
import https from 'https';

import { parseURL } from '../common/utils';
import { WEBSITE } from '../common/website';
import { showProgress } from './progress';

async function downloadFile(filename: string, destination: string, update: (progress: number) => void, finish: () => void) {
  const file = fs.createWriteStream(destination);

  const url = `${WEBSITE}/${filename}`

  const { protocol } = parseURL(url)

  const module = protocol === 'http' ? http : https

  return await new Promise<boolean>((resolve, reject) => {
    module.get(url, (response) => {
        const totalSize = Number(response.headers['content-length'])
        let downloadedSize = 0;

        response.on('data', (chunk) => {
          downloadedSize += chunk.length;
          update(downloadedSize / totalSize);
        })

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          finish();
          resolve(true);
        });
    }).on('error', (err) => {
        fs.unlink(destination, () => {});
        // file.close();
        finish();
        resolve(false);
    });
  })
}

interface ProgressObject {
  current: number,
  total: number
}

export async function download(filename: string, destination: string, progress?: ProgressObject): Promise<boolean> {
  let message = 'Downloading files'
  if (progress !== undefined) {
    message += ` (${progress.current} out of ${progress.total})`
  }
  message += ': '
  
  return await showProgress(message, async (progress, end) => {
    return await downloadFile(filename, destination, progress, end)
  })
}