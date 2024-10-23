const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

async function zip(inputPath, outputPath) {
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
      console.log(`Zipped ${inputPath}, total size: ${archive.pointer()} bytes`);
  });

  archive.on('error', (err) => {
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

module.exports = {
  zip,
  OUT_DIR,
  createOut
}