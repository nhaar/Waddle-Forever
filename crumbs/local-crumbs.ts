import path from "path";
import { extractPcode, replacePcode } from "../src/common/ffdec/ffdec";
import { addParties, CrumbsUpdate, generateCrumbFiles, getCrumbsTimelineFromMap, getTimelineMap } from "./base-crumbs";
import { PathsUpdate } from "../src/server/game/crumbs";
import { Party } from "../src/server/game/parties";
import { DEFAULT_DIRECTORY } from "../src/common/utils";
import { Version } from "../src/server/routes/versions";

const BASE_LOCAL_CRUMBS = path.join(__dirname, 'base_local_crumbs.swf');

async function loadBaseCrumbs(): Promise<string> {
  return await extractPcode(BASE_LOCAL_CRUMBS, 'frame_1/DoAction.pcode');
}

type LocalModifications = {
  localPaths?: PathsUpdate
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

function applyChanges(crumbs: string, changes: LocalModifications): string {
  let newCrumbs = crumbs

  if (changes.localPaths !== undefined) {
    for (const path in changes.localPaths) {
      newCrumbs = addLocalPath(newCrumbs, path, changes.localPaths[path]);
    }
  }

  return newCrumbs;
}

type LocalCrumbsUpdate = CrumbsUpdate<LocalModifications>;

function detectChanges(party: Party): boolean {
  return party.localPaths !== undefined;
}

function extractPartyChanges(party: Party): LocalModifications {
  return {
    localPaths: party.localPaths
  };
}

function getFullTimeline(): LocalCrumbsUpdate[] {
  let map = getTimelineMap<LocalModifications>([]);
  const updates = addParties(getCrumbsTimelineFromMap<LocalModifications>(map), detectChanges, extractPartyChanges);
  return updates;
}

function getMediaPath(file: string): string {
  return path.join('default/seasonal/play/v2/content/local/en/crumbs/local_crumbs.swf', file + '.swf');
}

async function createSeasonalCrumb(content: string, date: Version): Promise<void> {
  const filePath = path.join(__dirname, '..', 'media', getMediaPath(date));
  await replacePcode(BASE_LOCAL_CRUMBS, filePath, '\\frame 1\\DoAction', content);
}

(async () => {
  await generateCrumbFiles<LocalModifications>(
    loadBaseCrumbs,
    applyChanges,
    getFullTimeline,
    createSeasonalCrumb,
    getMediaPath,
    'Local Crumbs'
  );
})();