import fs from 'fs';
import path from 'path';
import { getEveryMediaFile, getShortcutString, LABEL_FILES, MEDIA_DIRECTORY, processLabelFile } from "./labels";

// for timing script execution
const startTime = Date.now();

/**
 * This module handles making sure every file in the game is properly labeled
 * Runs this script and you can get a list of every unlabeled file outputed!
 */

const labeledFiles = new Map<string, string>();

async function addLabeledFiles(file: string): Promise<void> {
  const files = await processLabelFile(path.join(__dirname, 'groups', file));
  files.forEach((hash, file) => {
    if (labeledFiles.has(file)) {
      throw new Error(`A file which has been labeled multiple times has been found: ${file}`);
    } else {
      labeledFiles.set(file, hash);
    }
  });
}

// adding all labeled files, once that's done we finish the process
Promise.all(LABEL_FILES.map((file) => addLabeledFiles(file))).then(() => {
  const everyFile = getEveryMediaFile();
  const nonLabeledFiles = new Map<string, string>();
  
  everyFile.forEach((hash, file) => {
    const labeledHash = labeledFiles.get(file);
    // if file is not found, then it's unlabeled
    if (labeledHash === undefined) {
      nonLabeledFiles.set(file, hash);
    } else {
      // if found, check if it's the same file
      if (hash !== labeledHash) {
        nonLabeledFiles.set(file, hash);
      }
    }
  });
  
  const unlabeledArray = Array.from(nonLabeledFiles.entries()).map((pair) => {
    return `${getShortcutString(pair[0])}:${pair[1]}`
  });
  
  const unlabeledAmount = unlabeledArray.length;
  const totalAmount = Array.from(everyFile.values()).length;

  const deadFiles = Array.from(labeledFiles.entries()).filter((pair) => {
    return !fs.existsSync(path.join(MEDIA_DIRECTORY, pair[0]));
  }).map((pair) => `${getShortcutString(pair[0])}:${pair[1]}`);

  const endTime = Date.now();
  const secondsTaken = (endTime - startTime) / 1000;
  
  if (unlabeledAmount < 20) {
    unlabeledArray.forEach((file) => console.log(file));
  }

  const warnings: string[] = [];

  deadFiles.forEach((line) => {
    warnings.push(`dead: ${line}`);
  })

  unlabeledArray.forEach((line) => {
    warnings.push(`unlabeled: ${line}`);
  })

  fs.writeFileSync(path.join(__dirname, 'warnings.txt'), warnings.join('\n'));
  console.log(`Files search complete. ${unlabeledAmount} unlabeled files found out of ${totalAmount} (${unlabeledAmount}/${totalAmount}). Found ${deadFiles.length} dead files`);
  
  console.log(`Total time taken: ${secondsTaken}`);

});
