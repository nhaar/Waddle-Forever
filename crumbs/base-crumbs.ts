import { PARTIES, Party } from "../src/server/game/parties";
import { isEqual, isGreaterOrEqual, isLower, Version } from "../src/server/routes/versions";

export type SeasonalCrumbsChange<Modifications> = {
  type: 'seasonal',
  /** Valid version string */
  version: string
  changes: Modifications
};

export type PartyCrumbsChange<Modifications> = {
  type: 'party',
  /** Path to event eg 2010/music_jam */
  event: string
  changes: Modifications
  start: Version
  end: Version
};

export type CrumbsUpdate<Modifications> = SeasonalCrumbsChange<Modifications> | PartyCrumbsChange<Modifications>;

export type SimpleSeasonalCrumbsUpdate<Modifications> = Omit<SeasonalCrumbsChange<Modifications>, 'type'>;

export type TimelineMap<Modifications> = Map<Version, SimpleSeasonalCrumbsUpdate<Modifications>>;

export type CrumbsTimeline<Modifications> = Array<SimpleSeasonalCrumbsUpdate<Modifications>>;

export function getTimelineMap<Modifications>(timeline: CrumbsTimeline<Modifications>): TimelineMap<Modifications> {
  const map = new Map<string, SimpleSeasonalCrumbsUpdate<Modifications>>();
  timeline.forEach((value) => {
    map.set(value.version, value);
  });
  return map;
}

export function getCrumbsTimelineFromMap<Modifications>(map: TimelineMap<Modifications>): CrumbsTimeline<Modifications> {
  const timeline: CrumbsTimeline<Modifications> = [];
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

export function addParties<Modifications>(
  timeline: CrumbsTimeline<Modifications>,
  detectChanges: (party: Party) => boolean,
  extractPartyChanges: (party: Party) => Modifications
): CrumbsUpdate<Modifications>[] {
  let currentPartyIndex = 0;
  const crumbsUpdates: CrumbsUpdate<Modifications>[] = [];
  // go through each update in the timeline to and see if a party comes after or before it
  // we keep looping until BOTH the current timeline and party arrays are swept,
  // this way we can still do this even if timeline is empty at first
  for (let timelineIndex = 0; (timelineIndex < timeline.length || currentPartyIndex < PARTIES.length); timelineIndex++) {
    const seasonal = timeline[timelineIndex];
    // start at the first party we haven't done yet
    // we also need to loop this until both are swept
    for (let partyIndex = currentPartyIndex; (timelineIndex < timeline.length || partyIndex < PARTIES.length); partyIndex++) {
      const party = PARTIES[partyIndex];
      // this means both indexes overflowed, we can break to terminate the loop
      if (party === undefined && seasonal === undefined) {
        break;
      }
      // if party is undefined, then we only need to add seasonals
      // if it is defined, we check if this seasonal is on time to be added
      // start >= versions so that if they start on the same day, the seasonal one comes first
      // if party is defined and seasonal is undefined then we also have to skip which is what seasonal !== undefined
      // accomplishes 
      if (party === undefined || (seasonal !== undefined && isGreaterOrEqual(party.start, seasonal.version))) {
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
        const hasChanges =  detectChanges(party);
        if (hasChanges) {
          crumbsUpdates.push({
            type: 'party',
            changes: extractPartyChanges(party),
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

export function addToTimelineMap<Modifications>(
  map: TimelineMap<Modifications>,
  update: SimpleSeasonalCrumbsUpdate<Modifications>,
  mergerFunction: (change1: Modifications, change2: Modifications) => Modifications
): void {
  const previousValue = map.get(update.version);
  if (previousValue === undefined) {
    map.set(update.version, update);
  } else {
    map.set(update.version, {
      version: update.version,
      changes: mergerFunction(previousValue.changes, update.changes)
    });
  }
}

/**
 * This function handles putting every other module together to generate all the crumb files
 * @param loadBaseCrumbs This must be a function that extracts the P-Code as a string
 * @param applyChanges This is a function that must take the P-Code and a modification object, and generate new P-Code
 * @param getFullTimeline This is a function that must get the full timeline of updates of the crumbs
 * @param createSeasonalCrumb This is a function that has to take the P-Code and date and generate the seasonal SWF file
 */
export async function generateCrumbFiles<Modifications>(
  loadBaseCrumbs: () => Promise<string>,
  applyChanges: (content: string, changes: Modifications) =>string,
  getFullTimeline: () => CrumbsUpdate<Modifications>[],
  createSeasonalCrumb: (content: string, date: Version) => Promise<void>
): Promise<void> {
  console.log('Beginning exporting');
  
  // early placeholder that will take the base SWF
  const PLACEHOLDER = '2009-##-##';
  
  // when we are in a party, we keep it in paralel the changes with and without party
  let nonPartyCrumbs = await loadBaseCrumbs();

  createSeasonalCrumb(nonPartyCrumbs, PLACEHOLDER);

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
}