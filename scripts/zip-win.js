const { zip, OUT_DIR, createOut } = require('./zip.js')
const VERSION = require('../package.json').version;

createOut();

zip('dist/win-unpacked', `${OUT_DIR}/client-${VERSION}.zip`)
zip('dist/WaddleForeverServer.exe', `${OUT_DIR}/server-${VERSION}.zip`)