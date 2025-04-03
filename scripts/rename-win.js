const fs = require('fs');
const path = require('path');
const VERSION = require('../package.json').version;

const pathToFile = path.join(process.cwd(), 'dist');
fs.rename(path.join(pathToFile, 'WaddleForeverServer.exe'), path.join(pathToFile, `WaddleForeverServer-${VERSION}.exe`), () => {});