import path from "path";
import fs from 'fs';
import { StaticDataTable } from "../../common/static-table";
import { STATIC_SERVERS } from "./static-servers";
import { IS_DEV } from "../../common/constants";
import { getFilesInDirectory, iterateEntries, MEDIA_DIRECTORY } from "../../common/utils";
import { APPROXIMATION, enforceDocumentationCorrectness, FIX, MOD, RECREATION, TOOL, UNKNOWN } from "./file-documentation";

export type FileRef = string;

/** Name of all packages that aren't default */
type PackageName = 'clothing';

/** Structure of the package info json file */
type PackageInfoJson = Record<PackageName, string[]>;

/** Map of all extra packages and their files */
type PackageInfo = Record<PackageName, Set<string>>;

// included in default because everyone gets this file
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
const PACKAGE_INFO = getPackageInfo();

export enum FileCategory {
  Archives,
  Fix,
  Approximation,
  Recreation,
  Mod,
  Tool,
  StaticServer,
  Unknown
};

type File = {
  id: number;
  path: string;
  packageId: number;
  category: FileCategory;
  // if category is StaticServer, other null
  staticId: null | number;
  // if is recreated from another file in here
  baseFile: null | number;
};

export function isPathAReference(path: string): boolean {
  // file paths can't have ':', while references use that as a separator
  return path.includes(':');
}

/** Get the path to a file */
export function getMediaFilePath(fileReference: string): string {
  const fileMatch = fileReference.match(/(\w+)\:(.*)/);
  if (fileMatch === null) {
    throw new Error(`Incorrect file reference: ${fileReference}`);
  }
  const subdirectory = fileMatch[1];
  const filePath = fileMatch[2];

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
