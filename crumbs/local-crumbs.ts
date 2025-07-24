import path from "path";
import { extractPcode, replacePcode } from "../src/common/ffdec/ffdec";
import { generateCrumbFiles } from "./base-crumbs";
import { getLocalCrumbsOutput, LOCAL_CRUMBS_PATH, LocalCrumbContent } from "../src/server/timelines/crumbs";

const BASE_LOCAL_CRUMBS = path.join(__dirname, 'base_local_crumbs.swf');

async function loadBaseCrumbs(): Promise<string> {
  return await extractPcode(BASE_LOCAL_CRUMBS, 'frame_1/DoAction.pcode');
}

function addLocalPath(crumbs: string, pathName: string, path: string): string {
  const lines = crumbs.split('\n');
  let insertIndex: number | undefined = undefined;
  for (let i = 0; i < lines.length; i++) {
    // find local paths variable declaration
    if (lines[i].startsWith('Push "local_paths", 0, "Object"')) {
      insertIndex = i + 3;
    }
  }
  if (insertIndex !== undefined) {
    lines.splice(insertIndex, 0,
      'Push "local_paths"',
      'GetVariable',
      `Push "${pathName}", "${path}"`,
      'SetMember'
    );
  }
  return lines.join('\n');
}

function applyChanges(crumbs: string, changes: Partial<LocalCrumbContent>): string {
  let newCrumbs = crumbs

  if (changes.paths !== undefined) {
    for (const path in changes.paths) {
      const pathName = changes.paths[path];
      if (pathName !== undefined) {
        newCrumbs = addLocalPath(newCrumbs, path, pathName);
      }
    }
  }

  return newCrumbs;
}

async function createCrumbs(outputPath: string, crumbsContent: string): Promise<void> {
  await replacePcode(BASE_LOCAL_CRUMBS, outputPath, '\\frame 1\\DoAction', crumbsContent);
}

export async function generateLocalCrumbs() {
  await generateCrumbFiles(loadBaseCrumbs, getLocalCrumbsOutput, applyChanges, createCrumbs, LOCAL_CRUMBS_PATH);
}

if (require.main === module) {
  generateLocalCrumbs();
}
