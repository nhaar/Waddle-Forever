import path from 'path'

import { BrowserWindow, ipcMain } from "electron";
import { PARTIES, PartyStage } from '../server/game/parties';
import { isEqual, isLower, Version } from '../server/routes/versions';
import { FAN_ISSUE, OLD_NEWSPAPERS } from '../server/game/newspapers';
import { OLD_CATALOGUES } from '../server/game/catalogues';
import { STAGE_TIMELINE } from '../server/game/stage-plays';
import { IGLOO_LISTS } from '../server/game/igloo-lists';

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
        date: '2005-08-22',
        events: {
          other: 'Beta release',
        }
      },
      {
        date: '2005-09-12',
        events: {
          roomOpen: 'Snow Forts'
        }
      },
      {
        date: '2005-11-03',
        events: {
          roomOpen: 'Sport Shop',
        }
      },
      {
        date: '2005-11-18',
        events: {
          roomOpen: 'Mountain'
        }
      },
      {
        date: '2005-12-14',
        events: {
          minigameRelease: 'Puffle Roundup'
        }
      },
      {
        date: '2005-12-22',
        events: {
          roomOpen: 'Ski Lodge',
        }
      },
      {
        date: '2006-02-24',
        events: {
          roomOpen: 'Plaza, Pizza Parlor'
        }
      },
      {
        date: '2006-03-17',
        events: {
          roomOpen: 'Pet Shop'
        }
      },
      {
        date: '2006-03-29',
        events: {
          roomOpen: 'Iceberg'
        }
      },
      {
        date: '2010-01-08',
        events: {
          other: 'A rockslide happened in the Mine'
        }
      },
      {
        date: '2010-01-15',
        events: {
          other: 'The rockslide in the mine progressed'
        }
      },
      {
        date: '2010-09-24',
        events: {
          partyStart: 'Stadium Games'
        }
      },
      {
        date: '2010-12-18',
        events: {
          partyUpdate: 'The lighthouse has more money (2)'
        }
      },
      {
        date: '2010-12-20',
        events: {
          other: 'Stadium Games party ends during the Holiday Party',
          partyUpdate: 'The lighthouse has more money (3)'
        }
      },
      {
        date: '2010-12-22',
        events: {
          partyUpdate: 'The lighthouse has more money (4)'
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
  /** Name of stage play that is debuting today if any */
  stagePlay?: string;
  /** If a music list was released this day */
  musicList?: true;
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

function addStagePlays(map: DayMap): void {
  STAGE_TIMELINE.forEach((update) => {
    addEvents(map, update.date, { stagePlay: update.name });
  });
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

function addIglooMusicLists(map: DayMap): void {
  IGLOO_LISTS.forEach((list) => {
    addEvents(map, list.date, { musicList: true });
  })
}

function updateTimeline(days: Day[]): Day[] {
  let map = getDayMap(days);
  map = addParties(map);
  map = addNewspapers(map);
  map = addCatalogues(map);
  addIglooMusicLists(map);
  addStagePlays(map);
  return getDaysFromMap(map);
}