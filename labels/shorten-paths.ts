import path from "path";
import { getShortcutString, LABEL_FILES, LabelFile } from "./labels";

Promise.all(LABEL_FILES.map((file) => new Promise<void>(async (resolve) => {
  const labelFile = await LabelFile.fromFile(path.join(__dirname, 'groups', file));
  const paths = labelFile.paths;
  paths.forEach((filePath) => {
    const newPath = getShortcutString(filePath);
    labelFile.updatePath(filePath, newPath);
  });
  labelFile.write();
  resolve();
})));