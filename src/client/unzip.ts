import fs from 'fs'
import unzipper from 'unzipper';
import { showProgress, ProgressCallback } from './progress';

function unzipFile(zipDir: string, outDir: string, progress: ProgressCallback, end: () => void, onError: (err: unknown) => void) {
  // removes the zipped file
  const unlink = () => {
    fs.unlinkSync(zipDir);
  }

  const handleError = (err: unknown) => {
    unlink();
    onError(err);
    end();
  }
  try {
    const stream = fs.createReadStream(zipDir)
  
    const unzipStream = unzipper.Extract({ path: outDir })
    
    const totalBytes = fs.statSync(zipDir).size;
    let processedBytes = 0
  
  
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
  } catch (error) {
    handleError(error);
  }
}

export async function unzip(zipDir: string, outDir: string) {
  await showProgress('Extracting file', async (progress, end) => {
    return await new Promise<boolean>((resolve, reject) => {
      unzipFile(zipDir, outDir, progress, () => {
        end();
        resolve(true);
      }, (err) => {
        reject(err);
      })
    })
  })
}
