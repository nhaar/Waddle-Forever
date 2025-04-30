/**
 * MODULE HASN'T BEEN TESTED,
 * there turned out to be a lot of duplicated files that will need to be handled
 * accordingly
 */

import { getEveryMediaFile, LABEL_FILES, LabelFile } from "./labels";

const everyFile = reverseMap(getEveryMediaFile());

function reverseMap(map: Map<string, string>): Map<string, string> {
  const reversed = new Map<string, string>();
  map.forEach((value, key) => {
    reversed.set(value, key);
  });
  return reversed;
}

Promise.all(LABEL_FILES.map((labelFileName) => {
  return new Promise<void>(async (resolve) => {
    const labelFile = await LabelFile.fromFile(labelFileName);
    const fileMap = labelFile.getFileMap();
    fileMap.forEach((filePath, hash) => {
      const existingPath = everyFile.get(hash);
      if (existingPath !== undefined) {
        if (filePath !== existingPath) {
          labelFile.updatePath(filePath, existingPath);
        }
      }
    })
    labelFile.write();
    resolve();
  })
}))