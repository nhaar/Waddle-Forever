import path from 'path'

import { BrowserWindow, ipcMain } from "electron";
import { PARTIES, PartyStage } from '../server/game/parties';
import { isEqual, isLower, Version } from '../server/routes/versions';

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
          newClothing: true
        }
      },
      {
        date: '2005-Sep-12',
        events: {
          roomOpen: 'Snow Forts'
        }
      },
      {
        date: '2005-Sep-21',
        events: {
          newClothing: true
        }
      },
      {
        date: '2005-Oct-24',
        events: {
          newIssue: 1,
          newClothing: true
        }
      },
      {
        date: '2005-Oct-28',
        events: {
          newIssue: 'fan'
        }
      },
      {
        date: '2005-Nov-01',
        events: {
          newClothing: true
        }
      },
      {
        date: '2005-Nov-03',
        events: {
          roomOpen: 'Sport Shop',
          newIssue: 2
        }
      },
      {
        date: '2005-Nov-08',
        events: {
          newIssue: 3
        }
      },
      {
        date: '2005-Nov-11',
        events: {
          newIssue: 4
        }
      },
      {
        date: '2005-Nov-16',
        events: {
          newIssue: 5
        }
      },
      {
        date: '2005-Nov-18',
        events: {
          roomOpen: 'Mountain'
        }
      },
      {
        date: '2005-Nov-21',
        events: {
          newIssue: 6
        }
      },
      {
        date: '2005-Dec-01',
        events: {
          newIssue: 7,
          newClothing: true
        }
      },
      {
        date: '2005-Dec-08',
        events: {
          newIssue: 8
        }
      },
      {
        date: '2005-Dec-14',
        events: {
          minigameRelease: 'Puffle Roundup'
        }
      },
      {
        date: '2005-Dec-15',
        events: {
          newIssue: 9
        }
      },
      {
        date: '2005-Dec-22',
        events: {
          roomOpen: 'Ski Lodge',
          newIssue: 10
        }
      },
      {
        date: '2005-Dec-29',
        events: {
          newIssue: 11
        }
      },
      {
        date: '2006-Jan-01',
        events: {
          newClothing: true
        }
      },
      {
        date: '2006-Jan-05',
        events: {
          newIssue: 12
        }
      },
      {
        date: '2006-Jan-12',
        events: {
          newIssue: 13
        }
      },
      {
        date: '2006-Jan-19',
        events: {
          newIssue: 14
        }
      },
      {
        date: '2006-Jan-26',
        events: {
          newIssue: 15
        }
      },
      {
        date: '2006-Feb-02',
        events: {
          newIssue: 16
        }
      },
      {
        date: '2006-Feb-03',
        events: {
          newClothing: true
        }
      },
      {
        date: '2006-Feb-09',
        events: {
          newIssue: 17
        }
      },
      {
        date: '2006-Feb-16',
        events: {
          newIssue: 18
        }
      },
      {
        date: '2006-Feb-23',
        events: {
          newIssue: 19
        }
      },
      {
        date: '2006-Feb-24',
        events: {
          roomOpen: 'Plaza, Pizza Parlor'
        }
      },
      {
        date: '2006-Mar-02',
        events: {
          newIssue: 20
        }
      },
      {
        date: '2006-Mar-03',
        events: {
          newClothing: true
        }
      },
      {
        date: '2006-Mar-09',
        events: {
          newIssue: 21
        }
      },
      {
        date: '2006-Mar-16',
        events: {
          newIssue: 22
        }
      },
      {
        date: '2006-Mar-17',
        events: {
          roomOpen: 'Pet Shop'
        }
      },
      {
        date: '2006-Mar-23',
        events: {
          newIssue: 23
        }
      },
      {
        date: '2006-Mar-29',
        events: {
          roomOpen: 'Iceberg'
        }
      },
      {
        date: '2006-Mar-30',
        events: {
          newIssue: 24
        }
      },
      {
        date: '2006-Apr-06',
        events: {
          newIssue: 25
        }
      },
      {
        date: '2006-Apr-07',
        events: {
          newClothing: true
        }
      },
      {
        date: '2006-Apr-13',
        events: {
          newIssue: 26
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
    timeline = addParties(timeline);
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
function addParties(days: Day[]): Day[] {
  const map = getDayMap(days);
  
  for (let i = 0; i < PARTIES.length; i++) {
    const party = PARTIES[i];
    addEvents(map, party.start, { partyStart: party.name });
    addEvents(map, party.end ?? PARTIES[i + 1].start , { partyEnd: party.name });

    if (party.updates !== undefined) {
      for (const update of party.updates) {
        if (update.update !== null) {
          addEvents(map, update.update.date, { partyUpdate: update.update.description });
        }
      }
    }
  }

  return getDaysFromMap(map);
}