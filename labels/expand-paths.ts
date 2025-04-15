import path from "path";
import { LABEL_FILES, LabelFile } from "./labels";

Promise.all(LABEL_FILES.map((file) => new Promise<void>(async (resolve) => {
  const labelFile = await LabelFile.fromFile(path.join(__dirname, 'groups', file));
  labelFile.write();
  resolve();
})));