import fs from 'fs';
import path from 'path';
import { zip, OUT_DIR, createOut } from './zip';
import { generateGlobalCrumbs } from '../crumbs/global-crumbs'
import { generateLocalCrumbs } from '../crumbs/local-crumbs'
import { generateNewsCrumbsFiles } from '../crumbs/news-crumbs'

const VERSION = require('../package.json').version;

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
  dirs.forEach((dir) => {
    const fullDir = path.join(MEDIA_DIR, dir)
    if (fs.lstatSync(fullDir).isDirectory()) {
      zip(fullDir, path.join(OUT_DIR, `${dir}-${VERSION}.zip`))
    }
  })
})();

