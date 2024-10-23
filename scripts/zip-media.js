const fs = require('fs')
const path = require('path')
const { zip, OUT_DIR, createOut } = require('./zip.js')

const VERSION = require('../package.json').version;

const mediaDir = 'media'

const dirs = fs.readdirSync(mediaDir);

createOut();

dirs.forEach((dir) => {
  const fullDir = path.join(mediaDir, dir)
  if (fs.lstatSync(fullDir).isDirectory()) {
    zip(fullDir, path.join(OUT_DIR, `${dir}-${VERSION}.zip`))
  }
})
