const fs = require('fs');
const path = require('path');
const VERSION = require('../package.json').version;

const pathToFile = path.join(process.cwd(), 'dist');
fs.rename(path.join(pathToFile, 'WaddleForeverServer'), path.join(pathToFile, `WaddleForeverServer-linux-${VERSION}`), () => {});