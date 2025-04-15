import fs from 'fs';
import path from 'path';
import { getEveryMediaFile, LABEL_FILES, LabelFile, processLabelFile } from "./labels";

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
    return `${pair[0]}:${pair[1]}`
  });
  
  const unlabeledAmount = unlabeledArray.length;
  const totalAmount = Array.from(everyFile.values()).length;
  const endTime = Date.now();
  const secondsTaken = (endTime - startTime) / 1000;
  
  if (unlabeledAmount < 20) {
    unlabeledArray.forEach((file) => console.log(file));
  }

  fs.writeFileSync(path.join(__dirname, 'unlabeled.txt'), unlabeledArray.join('\n'));
  console.log(`Unlabeled search complete. ${unlabeledAmount} unlabeled files found out of ${totalAmount} (${unlabeledAmount}/${totalAmount})`);
  
  console.log(`Total time taken: ${secondsTaken}`);

});
