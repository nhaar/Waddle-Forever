import fs from 'fs'
import unzipper from 'unzipper';
import { showProgress, ProgressCallback } from './progress';

function unzipFile(zipDir: string, outDir: string, progress: ProgressCallback, end: () => void) {
  const stream = fs.createReadStream(zipDir)

  const unzipStream = unzipper.Extract({ path: outDir })
  
  const totalBytes = fs.statSync(zipDir).size;
  let processedBytes = 0

  unzipStream.on('close', () => {
    fs.unlinkSync(zipDir);
    end();
  })

  stream.on('data', (chunk) => {
    processedBytes += chunk.length;
    progress(processedBytes / totalBytes);
  })

  stream.on('error', (err) => {
    throw err
  });
  stream.pipe(unzipStream)
}

export async function unzip(zipDir: string, outDir: string) {
  await showProgress('Extracting file', async (progress, end) => {
    await new Promise<void>((resolve) => {
      unzipFile(zipDir, outDir, progress, () => {
        end();
        resolve();
      })
    })
  })
}
