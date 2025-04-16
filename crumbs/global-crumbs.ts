/**
 * This script is used for generating global_crumbs.swf
 * 
 * If you want to create or edit a crumb file, what you want to
 * change is `CRUMBS_TIMELINE`
 */

import path from 'path'
import { extractPcode, replacePcode } from '../src/common/ffdec/ffdec';
import { DEFAULT_DIRECTORY } from '../src/common/utils'
import { PARTIES, Party } from '../src/server/game/parties'
import { STAGE_PLAYS, STAGE_TIMELINE } from '../src/server/game/stage-plays'
import { ITEMS } from '../src/server/game/items'
import { Version, isGreaterOrEqual } from '../src/server/routes/versions';
import { MusicUpdate, PathsUpdate, PricesUpdate } from '../src/server/game/crumbs';
import { CrumbsUpdate, TimelineMap, CrumbsTimeline, generateCrumbFiles, getTimelineMap, getCrumbsTimelineFromMap, addToTimelineMap, addParties } from './base-crumbs';

const BASE_GLOBAL_CRUMBS = path.join(__dirname, 'base_global_crumbs.swf');

async function loadBaseCrumbs(): Promise<string> {
  return await extractPcode(BASE_GLOBAL_CRUMBS, 'frame_1/DoAction.pcode');
}

type GlobalModifications = {
  music?: MusicUpdate,
  prices?: Record<number, number>,
  globalPaths?: PathsUpdate
}

function changeRoomMusic(crumbs: string, roomName: string, newMusicId: number): string {
  const lines = crumbs.split('\n')
  for (let i = 0; i < lines.length; i++) {
    // search for room_crumbs instructions
    if (lines[i].startsWith('Push "room_crumbs"')) {
      i += 2
      // check that it is the same room we want
      if (lines[i].startsWith(`Push "${roomName}"`)) {
        // find the original ID
        const musicMatch = lines[i].match(/"music_id", \d+/)
        if (musicMatch !== null) {
          // replacing the old ID
          lines[i] = lines[i].replace(musicMatch[0], `"music_id", ${newMusicId}`)
        }

        // there will be no other room of interest
        break;
      }
    }
  }
  return lines.join('\n')
}

function changeItemCost(crumbs: string, itemId: number, newCost: number): string {
  const lines = crumbs.split('\n');
  for (let i = 0; i < lines.length; i++) {
    // search for paper_crumbs instruction
    if (lines[i].startsWith('Push "paper_crumbs"')) {
      // skip to line with ID
      i += 2
      if (lines[i].startsWith(`Push ${itemId}`)) {
        // skip to line with cost
        i += 2
        const costMatch = lines[i].match(/Push "cost", \d+/)
        if (costMatch !== null) {
          lines[i] = lines[i].replace(costMatch[0], `Push "cost", ${newCost}`)
        }

        // there will be no other item of interest
        break;
      }
    }
  }

  return lines.join('\n');
}

function addGlobalPath(crumbs: string, pathName: string, path: string): string {
  const lines = crumbs.split('\n');
  let insertIndex: number | undefined = undefined;
  for (let i = 0; i < lines.length; i++) {
    // find global paths variable declaration
    if (lines[i].startsWith('Push "global_path", 0, "Object"')) {
      insertIndex = i + 3;
    }
  }
  if (insertIndex !== undefined) {
    lines.splice(insertIndex, 0,
      'Push "global_path"',
      'GetVariable',
      `Push "${pathName}", "${path}"`,
      'SetMember'
    );
  }
  return lines.join('\n');
}

function applyChanges(crumbs: string, changes: GlobalModifications): string {
  let newCrumbs = crumbs;
  if (changes.music !== undefined) {
    Object.entries(changes.music).forEach((pair) => {
      const [room, music] = pair;
      newCrumbs = changeRoomMusic(newCrumbs, room, music);
    });
  }

  if (changes.prices !== undefined) {
    for (const item in changes.prices) {
      newCrumbs = changeItemCost(newCrumbs, Number(item), changes.prices[item]);
    }
  }

  if (changes.globalPaths !== undefined) {
    for (const path in changes.globalPaths) {
      newCrumbs = addGlobalPath(newCrumbs, path, changes.globalPaths[path]);
    }
  }

  return newCrumbs;
}

type GlobalCrumbsUpdate = CrumbsUpdate<GlobalModifications>;

type GlobalTimelineMap = TimelineMap<GlobalModifications>;

type GlobalCrumbsTimeline = CrumbsTimeline<GlobalModifications>;

/** Timeline with all manual updates to global_crumbs, must be included in CHRONOLOGICAL ORDER! */
const GLOBAL_CRUMBS_TIMELINE: GlobalCrumbsTimeline = [];

function addStagePlays(map: GlobalTimelineMap): GlobalTimelineMap {
  // name -> music id
  const stageMap = new Map<string, number>();
  STAGE_PLAYS.forEach((play) => {
    stageMap.set(play.name, play.musicId);
  })

  STAGE_TIMELINE.forEach((update) => {
    const song = stageMap.get(update.name);
    if (song === undefined) {
      throw new Error(`Play has no music: ${update.name}`);
    }
    addToTimelineMap(map, {
      version: update.date,
      changes: {
        music: {
          'stage': song
        }
      }
    }, mergerFunction);
  })

  return map;
}

function mergerFunction(change1: GlobalModifications, change2: GlobalModifications): GlobalModifications {
  return {
    music: { ...change1.music, ...change2.music },
    globalPaths: { ...change1.globalPaths, ...change2.globalPaths },
    prices: { ...change1.prices, ...change2.prices }
  };
}

function addPriceChanges(map: GlobalTimelineMap): GlobalTimelineMap {
  const itemRows = ITEMS.rows;
  const priceChanges: Record<Version, PricesUpdate> = {};
  itemRows.forEach((item) => {
    const cost = item.cost;
    if (typeof cost !== 'number') {
      const [_, ...updates] = cost;
      updates.forEach((update) => {
        const [version, cost] = update;
        if (priceChanges[version] === undefined) {
          priceChanges[version] = {};
        }
        priceChanges[version][item.id] = cost;
      })
    }
  });
  for (const date in priceChanges) {
    addToTimelineMap(map, {
      version: date,
      changes: {
        prices: priceChanges[date]
      }
    }, mergerFunction);
  }

  return map;
}

function detectChanges(party: Party): boolean {
  return [party.music, party.globalPaths].some((value) => value !== undefined);
}

function extractPartyChanges(party: Party): GlobalModifications {
  return {
    music: party.music,
    globalPaths: party.globalPaths
  }
}

function getFullTimeline(): GlobalCrumbsUpdate[] {
  let map = getTimelineMap<GlobalModifications>(GLOBAL_CRUMBS_TIMELINE);
  map = addPriceChanges(map);
  map == addStagePlays(map);
  const updates = addParties(getCrumbsTimelineFromMap<GlobalModifications>(map), detectChanges, extractPartyChanges);
  return updates;
}

const SEASONAL_CRUMBS_PATH = path.join(DEFAULT_DIRECTORY, 'seasonal/play/v2/content/global/crumbs/global_crumbs.swf');

/**
 * Creates a new global_crumbs.swf file
 * @param outputPath Path the SWF will be saved in
 * @param crumbsContent The P-Code code content of the file
 */
async function createCrumbs(outputPath: string, crumbsContent: string): Promise<void> {
  await replacePcode(BASE_GLOBAL_CRUMBS, outputPath, '\\frame 1\\DoAction', crumbsContent);
}

async function createSeasonalCrumb(content: string, date: Version): Promise<void> {
  const filePath = path.join(SEASONAL_CRUMBS_PATH, date + '.swf');
  await createCrumbs(filePath, content);
}

(async () => {
  await generateCrumbFiles<GlobalModifications>(
    loadBaseCrumbs,
    applyChanges,
    getFullTimeline,
    createSeasonalCrumb
  );
})();
