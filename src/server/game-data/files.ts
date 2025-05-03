import path from "path";
import fs from 'fs';
import { IS_DEV } from "../../common/constants";
import { getFilesInDirectory, iterateEntries, MEDIA_DIRECTORY } from "../../common/utils";
import { APPROXIMATION, enforceDocumentationCorrectness, FIX, MOD, RECREATION, TOOL, UNKNOWN } from "./file-documentation";

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

/** Name of all packages that aren't default */
type PackageName = 'clothing';

/** Structure of the package info.json file */
type PackageInfoJson = Record<PackageName, string[]>;

/** Map of all extra packages and their files */
type PackageInfo = Record<PackageName, Set<string>>;

// included in default because everyone gets this media folder
const PACKAGE_INFO_PATH = path.join(MEDIA_DIRECTORY, 'default', 'info.json');

/**
 * Outputs the file with the package information inside the default folder
 */
export function writePackageInfo(): void {
  const packageInfo: PackageInfoJson = {
    'clothing': []
  };
  iterateEntries(packageInfo, (pkgName) => {
    packageInfo[pkgName] = getFilesInDirectory(path.join(MEDIA_DIRECTORY, pkgName));
  });

  fs.writeFileSync(PACKAGE_INFO_PATH, JSON.stringify(packageInfo));
}

function getPackageInfo(): PackageInfo {
  const json = JSON.parse(fs.readFileSync(PACKAGE_INFO_PATH, { encoding: 'utf-8'} )) as PackageInfoJson;
  const packageInfo: Record<PackageName, Set<string>> = {
    'clothing': new Set()
  };

  iterateEntries(json, (pkgName, pkgFiles) => {
    packageInfo[pkgName] = new Set(pkgFiles);
  });

  return packageInfo;
}

if (IS_DEV) {
  // check this in dev to enforce new files are being tracked
  enforceDocumentationCorrectness();
  
  // in dev we want to constantly update this
  // in production we may not even have all packages, so that information
  // is passed down via the package info file cached inside default
  writePackageInfo();
}

/** Information of every package (directories inside media) and the files they should contain */
const PACKAGE_INFO = getPackageInfo();

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
