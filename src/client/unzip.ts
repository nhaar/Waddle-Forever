import fs from 'fs'
import unzipper from 'unzipper';
import { showProgress, ProgressCallback } from './progress';

function unzipFile(zipDir: string, outDir: string, progress: ProgressCallback, end: () => void, onError: () => void) {
  const stream = fs.createReadStream(zipDir)

  const unzipStream = unzipper.Extract({ path: outDir })
  
  const totalBytes = fs.statSync(zipDir).size;
  let processedBytes = 0

  // removes the zipped file
  const unlink = () => {
    fs.unlinkSync(zipDir);
  }

  const handleError = () => {
    unlink();
    onError();
    end();
  }

  unzipStream.on('close', () => {
    unlink();
    end();
  })

  unzipStream.on('error', handleError)

  stream.on('data', (chunk) => {
    processedBytes += chunk.length;
    progress(processedBytes / totalBytes);
  })

  stream.on('error', handleError);
  stream.pipe(unzipStream)
}

export async function unzip(zipDir: string, outDir: string) {
  await showProgress('Extracting file', async (progress, end) => {
    return await new Promise<boolean>((resolve, reject) => {
      unzipFile(zipDir, outDir, progress, () => {
        end();
        resolve(true);
      }, () => {
        reject();
      })
    })
  })
}
