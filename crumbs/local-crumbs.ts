import path from "path";
import { extractPcode, replacePcode } from "../src/common/ffdec/ffdec";
import { generateCrumbFiles } from "./base-crumbs";
import { getLocalCrumbsOutput, LOCAL_CRUMBS_PATH, LocalCrumbContent } from "../src/server/timelines/crumbs";
import { LocalHuntCrumbs } from "../src/server/updates";
import { StageScript } from "../src/server/game-data/stage-plays";

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

function addStageScript(crumbs: string, script: StageScript): string {
  return `${crumbs}
Push "script_messages"
${[...script].reverse().map(msg => {
  if ('note' in msg) {
    return `Push "note"
Push "${msg.note}"
Push 1
InitObject`;
  } else {
    return `Push "name"
Push "${msg.name}"
Push "message"
Push "${msg.message}"
Push 2
InitObject`;
  }
}).join('\n')}
Push ${script.length}
Push "Array"
NewObject
DefineLocal`;
}

function addScavengerHunt(crumbs: string, hunt: LocalHuntCrumbs): string {
  return `${crumbs}
Push "lang"
GetVariable
Push "scavenger_hunt", "${hunt.en.loading}"
SetMember
Push "lang"
GetVariable
Push "title", "${hunt.en.title}"
SetMember
Push "lang"
GetVariable
Push "start_string", "${hunt.en.start}"
SetMember
Push "lang"
GetVariable
Push "scavenger_items_found", "${hunt.en.itemsFound}"
SetMember
Push "lang"
GetVariable
Push "scavenger_items_found_plural", "${hunt.en.itemsFoundPlural}"
SetMember
Push "lang"
GetVariable
Push "claim_prize", "${hunt.en.claim}"
SetMember
Push "lang"
GetVariable
Push "continue", "${hunt.en.continue}"
SetMember
Push "lang"
GetVariable
Push "clue0", "${hunt.en.clues[0]}"
SetMember
Push "lang"
GetVariable
Push "clue1", "${hunt.en.clues[1]}"
SetMember
Push "lang"
GetVariable
Push "clue2", "${hunt.en.clues[2]}"
SetMember
Push "lang"
GetVariable
Push "clue3", "${hunt.en.clues[3]}"
SetMember
Push "lang"
GetVariable
Push "clue4", "${hunt.en.clues[4]}"
SetMember
Push "lang"
GetVariable
Push "clue5", "${hunt.en.clues[5]}"
SetMember
Push "lang"
GetVariable
Push "clue6", "${hunt.en.clues[6]}"
SetMember
Push "lang"
GetVariable
Push "clue7", "${hunt.en.clues[7]}"
SetMember
`;
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

  if (changes.hunt !== undefined) {
    newCrumbs = addScavengerHunt(newCrumbs, changes.hunt);
  }

  newCrumbs = addStageScript(newCrumbs, changes.stageScript ?? []);

  return newCrumbs;
}

async function createCrumbs(outputPath: string, crumbsContent: string): Promise<void> {
  await replacePcode(BASE_LOCAL_CRUMBS, outputPath, path.join('/frame_1', 'DoAction'), crumbsContent);
}

export async function generateLocalCrumbs() {
  await generateCrumbFiles(loadBaseCrumbs, getLocalCrumbsOutput, applyChanges, createCrumbs, LOCAL_CRUMBS_PATH);
}

if (require.main === module) {
  generateLocalCrumbs();
}
