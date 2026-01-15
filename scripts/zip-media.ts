import fs from 'fs';
import path from 'path';
import { zip, OUT_DIR, createOut } from './zip';
import { VERSION } from '../src/common/version';

const MEDIA_DIR = path.join(__dirname, '..', 'media');

const dirs = fs.readdirSync(MEDIA_DIR);

createOut();

(async () => {
  for (const dir of dirs) {
    const fullDir = path.join(MEDIA_DIR, dir)
    const versionFilePath = path.join(fullDir, '.version');
    fs.writeFileSync(versionFilePath, VERSION);
    if (fs.lstatSync(fullDir).isDirectory()) {
      await zip(fullDir, path.join(OUT_DIR, `${dir}-${VERSION}.zip`))
    }
    fs.unlinkSync(versionFilePath);
  }
})();

