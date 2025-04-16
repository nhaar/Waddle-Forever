/**
 * This script is used for generating global_crumbs.swf
 * 
 * If you want to create or edit a crumb file, what you want to
 * change is `CRUMBS_TIMELINE`
 */

import path from 'path'
import { extractPcode, replacePcode } from '../src/common/ffdec/ffdec';
import { DEFAULT_DIRECTORY } from '../src/common/utils'
import { PARTIES } from '../src/server/game/parties'
import { STAGE_PLAYS, STAGE_TIMELINE } from '../src/server/game/stage-plays'
import { ITEMS } from '../src/server/game/items'
import { Version, isEqual, isGreaterOrEqual, isLower } from '../src/server/routes/versions';
import { MusicUpdate, PathsUpdate, PricesUpdate } from '../src/server/game/crumbs';

const BASE_GLOBAL_CRUMBS = path.join(__dirname, 'base_global_crumbs.swf');

async function loadBaseCrumbs(): Promise<string> {
  return await extractPcode(BASE_GLOBAL_CRUMBS, 'frame_1/DoAction.pcode');
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

type Modifications = {
  music?: MusicUpdate,
  prices?: Record<number, number>,
  globalPaths?: PathsUpdate
}

function applyChanges(crumbs: string, changes: Modifications): string {
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

type SeasonalCrumbsChange = {
  type: 'seasonal',
  /** Valid version string */
  version: string
  changes: Modifications
};
type PartyCrumbsChange = {
  type: 'party',
  /** Path to event eg 2010/music_jam */
  event: string
  changes: Modifications
  start: Version
  end: Version
};

type CrumbsUpdate = SeasonalCrumbsChange | PartyCrumbsChange

type SimpleSeasonalCrumbsUpdate = Omit<SeasonalCrumbsChange, 'type'>;

type TimelineMap = Map<Version, SimpleSeasonalCrumbsUpdate>;

type CrumbsTimeline = Array<SimpleSeasonalCrumbsUpdate>;

/** Timeline with all manual updates to global_crumbs, must be included in CHRONOLOGICAL ORDER! */
const CRUMBS_TIMELINE: CrumbsTimeline = [];

function getTimelineMap(timeline: CrumbsTimeline): TimelineMap {
  const map = new Map<string, SimpleSeasonalCrumbsUpdate>();
  timeline.forEach((value) => {
    map.set(value.version, value);
  });
  return map;
}

function getCrumbsTimelineFromMap(map: TimelineMap): CrumbsTimeline {
  const timeline: CrumbsTimeline = [];
  map.forEach((value) => {
    timeline.push(value);
  });

  const sorted = timeline.sort((a, b) => {
    const aVersion = a.version;
    const bVersion = b.version;
    if (isLower(aVersion, bVersion)) {
      return -1;
    } else if (isEqual(aVersion, bVersion)) {
      return 0;
    } else {
      return 1;
    }
  });

  return sorted;
}

function addParties(timeline: CrumbsTimeline): CrumbsUpdate[] {
  let currentPartyIndex = 0;
  const crumbsUpdates: CrumbsUpdate[] = [];
  // go through each update in the timeline to and see if a party comes after or before it
  for (let timelineIndex = 0; timelineIndex < timeline.length; timelineIndex++) {
    const seasonal = timeline[timelineIndex];
    // start at the first party we haven't done yet
    // the `true` is no problem since we are breaking eventually
    for (let partyIndex = currentPartyIndex; true; partyIndex++) {
      const party = PARTIES[partyIndex];
      // party comes after the version, we can push this seasonal update and check next version
      // also, if partyIndex > PARTIES.length, we just add every new update
      // we use start >= version so that if they start on the same day, the seasonal one comes first
      if (partyIndex >= PARTIES.length || isGreaterOrEqual(party.start, seasonal.version)) {
        crumbsUpdates.push({
          type: 'seasonal',
          ...seasonal
        });
        // exit the party index without incrementing, return to timeline loop
        break;
      } else {
        const mainPath = typeof party.paths === 'string' ? party.paths : party.paths[0];
        let end = party.end;
        if (end === null) {
          end = PARTIES[partyIndex + 1].start;
        }

        // check if crumbs actually changes in the day
        const hasChanges = [party.music, party.globalPaths].some((value) => value !== undefined);
        if (hasChanges) {
          crumbsUpdates.push({
            type: 'party',
            changes: {
              music: party.music,
              globalPaths: party.globalPaths
            },
            event: mainPath,
            start: party.start,
            end
          });
        }
        // increment so we never have to do this party again
        currentPartyIndex++;
      }
    }
  }
  return crumbsUpdates;
}

function addStagePlays(map: TimelineMap): TimelineMap {
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
    });
  })

  return map;
}

function addToTimelineMap(map: TimelineMap, update: SimpleSeasonalCrumbsUpdate): void {
  const previousValue = map.get(update.version);
  if (previousValue === undefined) {
    map.set(update.version, update);
  } else {
    map.set(update.version, {
      version: update.version,
      changes: {
        music: { ...previousValue.changes.music, ...update.changes.music },
        globalPaths: { ...previousValue.changes.globalPaths, ...update.changes.globalPaths },
        prices: { ...previousValue.changes.prices, ...update.changes.prices }
      }
    });
  }
}

function addPriceChanges(map: TimelineMap): TimelineMap {
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
    });
  }

  return map;
}

function getFullTimeline(): CrumbsUpdate[] {
  let map = getTimelineMap(CRUMBS_TIMELINE);
  map = addPriceChanges(map);
  map == addStagePlays(map);
  const updates = addParties(getCrumbsTimelineFromMap(map));
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
  console.log('Beginning exporting');
  // when we are in a party, we keep it in paralel the changes with and without party
  let nonPartyCrumbs = await loadBaseCrumbs();
  let inPartyCrumbs = '';
  // when null, no party is currently happening
  let currentPartyEndDate: string | null = null;

  // saving what the crumbs were before, so that we can prevent duplicating crumbs 
  // this more specifically stores the file name, not just the date (eg multiple dates can be here)
  let lastNonPartySeasonalDate = '';

  // maps: start date -> end date
  // every entry in this map, we will delete the end date file
  // and add it to the start date
  // const merges = new Map<string, string>();
  const seasonalCrumbs = new Map<string, string>();

  currentPartyEndDate = null;
  inPartyCrumbs = '';

  // function to be run when a party ends, which handles adding a crumb to the end of the last party
  const partyEnded = () => {
    // if it's null, then there is nothing to be done here as the party end was handled already
    if (currentPartyEndDate === null) {
      return;
    }
    // if the party ended, we update our info
    // and we add a seasonal crumb for the party ending
    // we do this to preserve all information update
    // in the party

    const beforePartyCrumbs = seasonalCrumbs.get(lastNonPartySeasonalDate);
    // if the crumbs didn't change during the party, we don't add it
    // and we will rename what we added earlier
    // aditionally, if beforePartyCrumbs is undefined it means that this entry was deleted
    // so we can't rename what was added
    if (nonPartyCrumbs === beforePartyCrumbs) {
      // "rename"
      seasonalCrumbs.delete(lastNonPartySeasonalDate);
      lastNonPartySeasonalDate = `${lastNonPartySeasonalDate},${currentPartyEndDate}`;
      seasonalCrumbs.set(lastNonPartySeasonalDate, beforePartyCrumbs);
    } else {
      seasonalCrumbs.set(currentPartyEndDate, nonPartyCrumbs);
    }
  }

  const crumbsUpdates = getFullTimeline();
  for (const update of crumbsUpdates) {
    if (update.type === 'seasonal') {
      console.log(`Exporting changes for day ${update.version}`);
      // check if in-party
      if (currentPartyEndDate !== null) {
        // check if the party ended
        if (isGreaterOrEqual(update.version, currentPartyEndDate)) {
          partyEnded();
        } else {
          // if still in party, just update the party crumbs
          inPartyCrumbs = applyChanges(inPartyCrumbs, update.changes);
        }
      } else {
        // if not in party, we save this date for reference
        lastNonPartySeasonalDate = update.version;
      }
      // we always update the non-party, but
      // we only server it if not in a party
      nonPartyCrumbs = applyChanges(nonPartyCrumbs, update.changes);

      // these files need to be waited so that we can potentially rename them
      seasonalCrumbs.set(update.version, currentPartyEndDate === null ? nonPartyCrumbs : inPartyCrumbs);
    } else {
      partyEnded();
      console.log(`Exporting changes for event "${update.event}"`);

      // if there is a seasonal which started on this day, delete its entry since it will be overwritten
      seasonalCrumbs.delete(update.start);

      currentPartyEndDate = update.end;
      inPartyCrumbs = applyChanges(nonPartyCrumbs, update.changes);
      createSeasonalCrumb(inPartyCrumbs, update.start);
    }
  }

  seasonalCrumbs.forEach((crumbContent, fileName) => {
    createSeasonalCrumb(crumbContent, fileName);
  })
})();
