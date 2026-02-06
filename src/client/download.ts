import fs from 'fs';
import http from 'http';
import https from 'https';

import { logError, parseURL } from '@common/utils';
import { showProgress } from './progress';

async function downloadFile(
  url: string,
  destination: string,
  update: (progress: number) => void,
  finish: () => void,
  maxRedirects = 5
): Promise<boolean> {

  const { protocol } = parseURL(url);
  const module = protocol === 'http' ? http : https;

  return await new Promise<boolean>((resolve, reject) => {
    module.get(url, (response) => {
      // handle redirects
      const status = response.statusCode ?? 0;
      if ([301, 302, 303, 307, 308].includes(status)) {
        const redirectURL = response.headers.location;

        if (redirectURL === undefined) {
          return reject(new Error("Redirect with no location header"));
        }
        if (maxRedirects <= 0) {
          return reject(new Error("Too many redirects"));
        }
        return resolve(
          downloadFile(redirectURL, destination, update, finish, maxRedirects - 1)
        );
      }

      // non redirect
      const file = fs.createWriteStream(destination);
      const totalSize = Number(response.headers['content-length'] || 0);
      let downloadedSize = 0;

      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        if (totalSize > 0) {
          update(downloadedSize / totalSize)
        }
      });

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        finish();
        resolve(true);
      });

    }).on('error', (err) => {
      fs.unlink(destination, () => {});
      logError('Error downloading', err);
      finish();
      reject(err);
    });
  });
}

interface ProgressObject {
  current: number,
  total: number
}

export async function download(url: string, destination: string, progress?: ProgressObject): Promise<boolean> {
  let message = 'Downloading files'
  if (progress !== undefined) {
    message += ` (${progress.current} out of ${progress.total})`
  }
  message += ': '
  
  return await showProgress(message, async (progress, end) => {
    return await downloadFile(url, destination, progress, end)
  })
}