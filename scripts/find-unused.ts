import { getRoutesTimeline } from '../src/server/timelines/route';
import path from 'path';
import fs from 'fs';

const routesTimeline = getRoutesTimeline();

async function getFiles(dir: string): Promise<string[]> {
  const ents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = [];
  const dirs = [];
  for (const e of ents) {
    const name = path.join(dir, e.name);
    if (e.isFile()) {
      files.push(name);
    } else if (e.isDirectory()) {
      dirs.push(name);
    }
  }

  const promises = dirs.map(dir => getFiles(dir));

  return [...files, ...(await Promise.all(promises)).flat()];
}

getFiles(path.join(__dirname, '../media')).then(f => {
  const files = new Set<string>(f);

  const usedFiles = new Set<string>();

  routesTimeline.forEach((versions) => {
    for (const version of versions) {
      usedFiles.add(path.join(__dirname, '../media', version.info));
    }
  });

  const unusedFiles: string[] = [];
  files.forEach(f => {
    if (!usedFiles.has(f)) {
      unusedFiles.push(f);
    }
  });

  // warning: websites (and any other static service) are not detectable as used
  // (cant remember if anything besides website existed which was static service)
  fs.writeFileSync('unused.txt', unusedFiles.join('\n'));
});
