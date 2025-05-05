/** Module handles information of all the files stored in the media folder */

import path from "path";
import { IS_DEV } from "../../common/constants";
import { APPROXIMATION, enforceDocumentationCorrectness, FIX, MOD, RECREATION, TOOL, UNKNOWN } from "./file-documentation";
import { PACKAGE_INFO } from "./package-info";
import { PackageName } from "./packages";

/**
 * File reference is a term used in this code base to refer a string in the format
 * subdirectory:path
 * Where subdirectory is one of a few values which categorize what type of file it is
 * and the path is the path of the file inside the subdirectories
 * */
export type FileRef = string;

/** All possible values for a subdirectory in a file reference */
const SUBDIRECTORES = new Set([
  APPROXIMATION,
  FIX,
  MOD,
  RECREATION,
  TOOL,
  UNKNOWN,
  'archives',
  'slegacy',
  'svanilla',
  'mammoth',
  'slippers07'
]);

if (IS_DEV) {
  // check this in dev to enforce new files are being tracked
  enforceDocumentationCorrectness();
}

/** Check if a file path represents a file reference or just a normal file path */
export function isPathAReference(path: string): boolean {
  // file paths can't have ':', while references use that as a separator
  return path.includes(':');
}

/** Get the path to a file given its reference */
export function getMediaFilePath(fileReference: string): string {
  const fileMatch = fileReference.match(/(\w+)\:(.*)/);
  if (fileMatch === null) {
    throw new Error(`Incorrect file reference: ${fileReference}`);
  }
  const subdirectory = fileMatch[1];
  const filePath = fileMatch[2];

  if (!SUBDIRECTORES.has(subdirectory)) {
    throw new Error(`Invalid file reference subdirectory: ${subdirectory}`)
  }

  const pkgPath = path.join(subdirectory, filePath);

  let pkgName = 'default';
  for (const pkg in PACKAGE_INFO) {
    if (PACKAGE_INFO[pkg as PackageName].has(pkgPath)) {
      pkgName = pkg;
      break;
    }
  }

  return path.join(pkgName, pkgPath);
}
