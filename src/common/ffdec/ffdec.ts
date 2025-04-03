import path from 'path';
import fs from 'fs';
import { FFDEC_PATH } from "./ffdec-path";
import { runCommand } from "../utils";

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
  
  await runCommand(`"${FFDEC_PATH}" -replace "${baseFilePath}" "${outputFilePath}" "${scriptName}" "${tempfile}"`);

  fs.unlinkSync(tempfile);
}

/**
 * Extract the P-Code from a script in a SWF
 * @param filePath Absolute path to the SWF
 * @param scriptPath Path to the script once extracted (eg if it generates in the path scripts/frame_1/DoAction, you must pass 'frame_1/DoAction', you can try exporting the scripts first to see what path will be generated relative to the scripts folder)
 * @returns P-Code content
 */
export const extractPcode = async (filePath: string, scriptPath: string) => {
  if (!fs.existsSync(PCODE_DIR)) {
    fs.mkdirSync(PCODE_DIR);
  }

  const tempdir = path.join(PCODE_DIR, String(Date.now()));

  await runCommand(`"${FFDEC_PATH}" -format script:pcode -export script "${tempdir}" "${filePath}"`);

  const code = fs.readFileSync(path.join(tempdir, 'scripts', scriptPath), { encoding: 'utf-8' });

  fs.rmSync(tempdir, { recursive: true });

  return code;
}