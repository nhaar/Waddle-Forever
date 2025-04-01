import { exec } from "child_process";
import path from 'path';
import fs from 'fs';
import { FFDEC_PATH } from "./ffdec-path";

/** Directory to save temporary files */
const PCODE_DIR = path.join(process.cwd(), 'pcode');

/**
 * Replace a script in a SWF using P-Code
 * @param baseFilePath Absolute path to the SWF to modify
 * @param outputFilePath Absolute path to save the modified SWF
 * @param scriptName Name of the script inside the SWF (can check name using dumpAS2/dumpAS3 in FFDEC)
 * @param pcode Content of the P-Code
 */
export const replacePcode = async (baseFilePath: string, outputFilePath: string, scriptName: string, pcode: string) => {
  if (!fs.existsSync(PCODE_DIR)) {
    fs.mkdirSync(PCODE_DIR);
  }

  const tempfile = path.join(PCODE_DIR, String(Date.now()) + '.pcode');
  fs.writeFileSync(tempfile, pcode);
  
  await new Promise<void>((resolve, reject) => {
    exec(`"${FFDEC_PATH}" -replace "${baseFilePath}" "${outputFilePath}" "${scriptName}" "${tempfile}"`, (err, stdout, stder) => {
      if (err === null) {
        resolve();
      } else {
        reject(err);
      }
    });
  });

  fs.unlinkSync(tempfile);
}