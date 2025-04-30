import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

async function zip(inputPath: string, outputPath: string) {
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
      console.log(`Zipped ${inputPath}, total size: ${archive.pointer()} bytes`);
  });

  archive.on('error', (err: unknown) => {
      throw err;
  });

  archive.pipe(output);

  if (fs.lstatSync(inputPath).isDirectory()) {
    archive.directory(inputPath, false);
  } else {
    archive.file(inputPath, { name: path.basename(inputPath) })
  }

  await archive.finalize();
}

const OUT_DIR = 'zip'

function createOut() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR)
  }
}

export {
  zip,
  OUT_DIR,
  createOut
}