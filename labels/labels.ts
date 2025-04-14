import readline from "readline"
import fs from 'fs';
import path from 'path';

/**
 * This module handles making sure every file in the game is properly labeled
 * Runs this script and you can get a list of every unlabeled file outputed!
 */

const MEDIA_DIRECTORY = path.join(__dirname, '..', 'media');

/** Read a file path in the label style and get all files that are labeled in it */
function processLabelFile(filePath: string): Set<string> {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(filePath)
  });

  const files = new Set<string>();

  let number = 0;
  lineReader.on('line', (line) => {
    number++;
    // three possible allowed lines in this file:
    // 1. start with hyphen (comment, ignore)
    if (line.startsWith('-')) {
      return;
    } else if (line.match(/^\s*$/) !== null) { // 2. white space only (ignore)
      return;
    } else {
      // starts with file path and name (capture)
      const fileMatch = line.match('^[\\w\\d_-/\\.]+');
      
      // no match means the line doesn't conform to any thing we allow
      if (fileMatch === null) {
        throw new Error(`Invalid line for file ${filePath}, line ${number}: ${line}`);
      } else {
        const fileName = fileMatch[0];
        if (fs.existsSync(path.join(MEDIA_DIRECTORY, fileName))) {
          files.add(fileName);
        } else {
          throw new Error(`Labeled file does not exist: ${fileName}`);
        }
      }
    }
  });

  return files;
}

function getFilesInDirectory(basePath: string, relativePath: string): string[] {
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

function getEveryMediaFile(): Set<string> {
  const files = getFilesInDirectory(MEDIA_DIRECTORY, '');

  return new Set(files.map((name) => name.replaceAll('\\', '/')));
}

const LABEL_FILES = [
  'legacy-media.txt', // files from legacy media from Solero
  'vanilla-media.txt', // files from vanilla media from Solero
  'cparchives.txt', // files from cparchives (basically original files)
  'modified.txt', // files MODDED for Waddle Forever specifically
  'recreations.txt', // files recreated (for Waddle Forever or not)
];

const labeledFiles = new Set<string>();
for (const labelFile of LABEL_FILES) {
  const files = processLabelFile(path.join(__dirname, labelFile));
  files.forEach((file) => { labeledFiles.add(file) });
}

const everyFile = getEveryMediaFile();
const nonLabeledFiles = new Set<string>();

everyFile.forEach((file) => {
  if (!labeledFiles.has(file)) {
    nonLabeledFiles.add(file);
  }
});

const unlabeledArray = Array.from(nonLabeledFiles.values());
fs.writeFileSync(path.join(__dirname, 'unlabeled.txt'), unlabeledArray.join('\n'));

const unlabeledAmount = unlabeledArray.length;
const totalAmount = Array.from(everyFile.values()).length;
console.log(`Unlabeled search complete. ${unlabeledAmount} unlabeled files found out of ${totalAmount} (${unlabeledAmount}/${totalAmount})`);
