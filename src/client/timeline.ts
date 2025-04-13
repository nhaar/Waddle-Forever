import path from 'path'

import { BrowserWindow, ipcMain } from "electron";
import { PARTIES, PartyStage } from '../server/game/parties';
import { isEqual, isLower, Version } from '../server/routes/versions';
import { FAN_ISSUE, OLD_NEWSPAPERS } from '../server/game/newspapers';
import { OLD_CATALOGUES } from '../server/game/catalogues';

export function createTimelinePicker (mainWindow: BrowserWindow) {
  const timelinePicker = new BrowserWindow({
    width: 500,
    height: 500,
    title: "Timeline Picker",
    webPreferences: {
      preload: path.join(__dirname, 'preload/timeline-preload.js')
    }
  });
  timelinePicker.loadFile(path.join(__dirname, 'views/timeline.html'));

  ipcMain.on('update-version', () => {
    mainWindow.webContents.reloadIgnoringCache();
  });

  timelinePicker.webContents.on('did-finish-load', () => {
    // TODO this array is currently hardcoded because of the previous system
    // it should become dynamic in the next updates
    let timeline: Day[] = [
      {
        date: '2005-Aug-22',
        events: {
          other: 'Beta release',
        }
      },
      {
        date: '2005-Sep-12',
        events: {
          roomOpen: 'Snow Forts'
        }
      },
      {
        date: '2005-Oct-28',
        events: {
          newIssue: 'fan'
        }
      },
      {
        date: '2005-Nov-03',
        events: {
          roomOpen: 'Sport Shop',
        }
      },
      {
        date: '2005-Nov-18',
        events: {
          roomOpen: 'Mountain'
        }
      },
      {
        date: '2005-Dec-14',
        events: {
          minigameRelease: 'Puffle Roundup'
        }
      },
      {
        date: '2005-Dec-22',
        events: {
          roomOpen: 'Ski Lodge',
        }
      },
      {
        date: '2006-Feb-24',
        events: {
          roomOpen: 'Plaza, Pizza Parlor'
        }
      },
      {
        date: '2006-Mar-17',
        events: {
          roomOpen: 'Pet Shop'
        }
      },
      {
        date: '2006-Mar-29',
        events: {
          roomOpen: 'Iceberg'
        }
      },
      {
        date: '2010-Sep-24',
        events: {
          partyStart: 'Stadium Games'
        }
      },
      {
        date: '2010-Nov-24',
        events: {
          partyEnd: 'Sensei\'s Water Scavenger Hunt'
        }
      }
    ]
    timeline = updateTimeline(timeline);
    timelinePicker.webContents.send('get-timeline', timeline);
  });
}

/** All things that can happen in a single day */
type Events = {
  /** Name of a party that started this day */
  partyStart?: string
  /** Name of a party that ended this day */
  partyEnd?: string
  /** Description of something that changed in a party today */
  partyUpdate?: string
  /** Uncategorized thing that happened this day */
  other?: string
  /** Number (or name) of new CPT issues that released this day */
  newIssue?: number | string
  /** Name of a room that opened this day */
  roomOpen?: string
  /** Name of a minigame that released this day */
  minigameRelease?: string
  /** If a clothing catalogue was released this day */
  newClothing?: boolean
};

// this type is duplicated in the timeline-static file, it should be the same type
/** Representation of a day in the Club Penguin timeline */
type Day = {
  date: Version
  events: Events
}

type DayMap = Map<Version, Day>;

/** Create a map of a day's date to their data */
function getDayMap(days: Day[]): Map<Version, Day> {
  const map = new Map<Version, Day>();
  for (const version of days) {
    map.set(version.date, version);
  }

  return map;
}

/** Obtain an array of days in chronological order from a map */
function getDaysFromMap(map: Map<Version, Day>) {
  const days: Day[] = [];
  map.forEach((version) => days.push(version));
  // sorting chronologically
  return days.sort((a, b) => {
    const aVersion = a.date;
    const bVersion = b.date;
    if (isLower(aVersion, bVersion)) {
      return -1;
    } else if (isEqual(aVersion, bVersion)) {
      return 0;
    } else {
      return 1;
    }
  });
}

/** Add new events to a day inside a day map */
function addEvents(map: Map<Version, Day>, date: string, events: Events): void {
  const day = map.get(date);
  if (day === undefined) {
    map.set(date, { date, events });
  } else {
    map.set(date, { date, events: { ...day.events, ...events } });
  }
}

/** Adds all the parties to a timeline */
function addParties(map: DayMap): DayMap {
  for (let i = 0; i < PARTIES.length; i++) {
    const party = PARTIES[i];
    addEvents(map, party.start, { partyStart: party.name });
    if (party.hideEnd !== true) {
      addEvents(map, party.end ?? PARTIES[i + 1].start , { partyEnd: party.name });
    }

    if (party.updates !== undefined) {
      for (const update of party.updates) {
        if (update.update !== null) {
          addEvents(map, update.update.date, { partyUpdate: update.update.description });
        }
      }
    }
  }

  return map;
}

function addNewspapers(map: DayMap): DayMap {
  // fan issue, a CPT issue which didn't have a proper number
  addEvents(map, FAN_ISSUE.date, { newIssue: FAN_ISSUE.name });

  OLD_NEWSPAPERS.forEach((date, index) => {
    const issue = index + 1;
    addEvents(map, date, { newIssue: issue });
  })

  return map;
}

function addCatalogues(map: DayMap): DayMap {
  OLD_CATALOGUES.forEach((date) => {
    addEvents(map, date, { newClothing: true });
  });
  return map;
}

function updateTimeline(days: Day[]): Day[] {
  let map = getDayMap(days);
  map = addParties(map);
  map = addNewspapers(map);
  map = addCatalogues(map);
  return getDaysFromMap(map);
}