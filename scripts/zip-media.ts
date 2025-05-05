import fs from 'fs';
import path from 'path';
import { zip, OUT_DIR, createOut } from './zip';
import { generateGlobalCrumbs } from '../crumbs/global-crumbs'
import { generateLocalCrumbs } from '../crumbs/local-crumbs'
import { generateNewsCrumbsFiles } from '../crumbs/news-crumbs'
import { VERSION } from '../src/common/version';

const MEDIA_DIR = path.join(__dirname, '..', 'media');

const dirs = fs.readdirSync(MEDIA_DIR);

createOut();

(async () => {
  console.log('global crumbs');
  await generateGlobalCrumbs();
  console.log('local crumbs');
  await generateLocalCrumbs();
  console.log('news crumbs');
  await generateNewsCrumbsFiles(true);
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

