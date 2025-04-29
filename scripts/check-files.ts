import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { getFileServer } from '../src/server/routes/client-files';
import { specialServer } from '../src/server/data/specials';

// finding duplicates

function getHash(filePath: string): string {
  const hash = crypto.createHash('md5').update(fs.readFileSync(filePath, { encoding: 'utf-8' })).digest('hex');
  return hash;
}

function getFilesInDirectory(basePath: string, relativePath: string = ''): string[] {
  const fileNames: string[] = [];
  const absolutePath = path.join(basePath, relativePath);
  const files = fs.readdirSync(absolutePath);
  files.forEach((file) => {
    const fileAbsolutePath = path.join(absolutePath, file);
    const fileRelativePath = path.join(relativePath, file);
    if (fs.lstatSync(fileAbsolutePath).isDirectory()) {
      const childFiles = getFilesInDirectory(basePath, fileRelativePath);
      fileNames.push(...childFiles);
    } else {
      fileNames.push(fileRelativePath);
    }
  })

  return fileNames;
}

const MEDIA_DIRECTORY = path.join(__dirname, '..', 'media');

const fileMap = new Map<string, string>();

const duplicates = new Map<string, Set<string>>();

const filesInMedia = getFilesInDirectory(MEDIA_DIRECTORY);
filesInMedia.forEach((file) => {
  const hash = getHash(path.join(MEDIA_DIRECTORY, file));
  const previous = fileMap.get(hash);
  if (previous === undefined) {
    fileMap.set(hash, file);
  } else {
    const dupeSet = duplicates.get(hash);
    if (dupeSet === undefined) {
      duplicates.set(hash, new Set<string>([file, previous]));
    } else {
      dupeSet.add(file);
    }
  }
});

let dupesOutput = '';
duplicates.forEach((dupes) => {
  dupesOutput += '\n';
  dupes.forEach((file) => {
    dupesOutput += `${file}\n`;
  })
})

// orphan files
function getUsedFiles(): Set<string> {
  const fileServer = getFileServer();
  const files = new Set<string>();
  specialServer.forEach((special, route) => {
    for (const enums in special.files) {
      files.add(special.files[enums]);
    }
  })
  fileServer.forEach((info, route) => {
    if (typeof info === 'string') {
      files.add(info);
    } else {
      info.forEach((value) => {
        files.add(value.file);
      })
    }
  });

  return files;
}

const usedFiles = getUsedFiles();

let unusedOutput = '';
filesInMedia.forEach((file) => {
  if (!usedFiles.has(file)) {
    unusedOutput += file + '\n';
  }
})

fs.writeFileSync('dupes.txt', dupesOutput);
fs.writeFileSync('unused.txt', unusedOutput);