/** Script generates the package info TypeScript file. Needed for all functions to work */

import path from "path";
import fs from 'fs';
import { getFilesInDirectory, MEDIA_DIRECTORY } from "../src/common/utils";
import { PackageName } from '../src/server/game-data/packages';

// this is just the only way I figured out how to properly put all names at runtime
const packageInfo: Record<PackageName, null> = {
  'clothing': null
};

let file = 'export const PACKAGE_INFO = {';

const packages = Object.keys(packageInfo) as PackageName[];
packages.forEach(pkg => {
  const packageFiles = getFilesInDirectory(path.join(MEDIA_DIRECTORY, pkg));
  file += `${pkg}: new Set([${packageFiles.map((file) => `"${file.replaceAll('\\', '\\\\')}"`).join(',\n')}]),\n`;
})
file += '};';

fs.writeFileSync(path.join(process.cwd(), 'src/server/game-data/package-info.ts'), file);
