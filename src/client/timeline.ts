import path from 'path'

import { BrowserWindow, ipcMain } from "electron";
import { PARTIES } from '../server/data/parties';
import { isEqual, isLower, processVersion, Version } from '../server/routes/versions';
import { FAN_ISSUE_DATE, AS2_NEWSPAPERS, PRE_BOILER_ROOM_PAPERS, AS3_NEWSPAPERS } from '../server/data/newspapers';
import { PRE_CPIP_CATALOGS, FURNITURE_CATALOGS, CPIP_CATALOGS } from '../server/data/catalogues';
import { STAGE_TIMELINE } from '../server/game/stage-plays';
import { IGLOO_LISTS } from '../server/game/igloo-lists';
import { ROOM_MUSIC_TIMELINE, ROOM_OPENINGS, ROOM_UPDATES } from '../server/data/room-updates';
import { PINS } from '../server/data/pins';
import { CHRISTMAS_2006_DECORATION } from '../server/data/updates';
import { STANDALONE_TEMPORARY_CHANGE } from '../server/data/standalone-changes';
import { STADIUM_UPDATES } from '../server/data/stadium-updates';
import { ROOMS } from '../server/data/rooms';

export function createTimelinePicker (mainWindow: BrowserWindow) {
  const timelinePicker = new BrowserWindow({
    show: false,
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
    timelinePicker.maximize();
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
        date: '2005-12-14',
        events: {
          minigameRelease: 'Puffle Roundup'
        }
      },
      {
        date: '2010-01-08',
        events: {
          other: 'A rockslide appears in the Mine'
        }
      },
      {
        date: '2010-01-15',
        events: {
          other: 'The rockslide in the Mine progresses'
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
      },
      {
        date: '2016-01-01',
        events: {
          other: 'test'
        }
      }
    ]
    timeline = updateTimeline(timeline);
    timelinePicker.webContents.send('get-timeline', getConsumedTimeline(timeline));
  });
}

/** All things that can happen in a single day */
type Events = {
  /** Info is either the name of the party (placeholder message) or custom message with comment: true */
  partyStart?: string;
  /** Name of a party that ended this day */
  partyEnd?: string
  /** Description of something that changed in a party today */
  partyUpdate?: string
  /** Uncategorized thing that happened this day */
  other?: string
  /** Number (or name) of new CPT issues that released this day */
  newIssue?: number | string
  /** Name of a room that opened this day */
  roomOpen?: string[];
  /** Description of how a room was updated this day */
  roomUpdate?: string;
  /** Name of a minigame that released this day */
  minigameRelease?: string
  pin?: string;
  /** If a clothing catalogue was released this day */
  newClothing?: boolean
  /** Name of stage play that is debuting today if any */
  stagePlay?: string;
  /** If a music list was released this day */
  musicList?: true;
  newFurnitureCatalog?: true;
  partyConstruction?: string;
  stadiumUpdate?: 'stadium' | 'rink' | string;
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
  const premieres = new Set<string>();
  STAGE_TIMELINE.forEach((update) => {
    // unused for now, later will be readded
    const stagePlay = premieres.has(update.name)
      ? `${update.name} returns to The Stage`
      : `${update.name} premieres at the Stage`;
    premieres.add(update.name);
    addEvents(map, update.date, { stagePlay: `${update.name} returns to The Stage` });
  });
}

/** Adds all the parties to a timeline */
function addParties(map: DayMap): DayMap {
  for (let i = 0; i < PARTIES.length; i++) {
    const party = PARTIES[i];
    const partyStart = party.startComment === undefined
      ? `The ${party.name} starts`
      : party.startComment;
    addEvents(map, party.startDate, { partyStart });

    const partyEnd = party.endComment === undefined
      ? `The ${party.name} ends`
      : party.endComment;
    addEvents(map, party.endDate, { partyEnd });

    if (party.construction !== undefined) {
        const partyStart = `Construction for the ${party.name} starts`;
      
        addEvents(map, party.construction.date, { partyConstruction: partyStart });
    }

    if (party.updates !== undefined) {
      for (const update of party.updates) {
        if (update.comment !== undefined) {
          addEvents(map, update.date, { partyUpdate: update.comment });
        }
      }
    }
  }

  return map;
}

function addNewspapers(map: DayMap): DayMap {
  // fan issue, a CPT issue which didn't have a proper number
  addEvents(map, FAN_ISSUE_DATE, { newIssue: 'Fan issue of the newspaper released '});

  PRE_BOILER_ROOM_PAPERS.forEach((date, index) => {
    const issue = index + 1;
    addEvents(map, date, { newIssue: issue });
  });

  const preBoilerPapers = PRE_BOILER_ROOM_PAPERS.length;

  [...AS2_NEWSPAPERS, ...AS3_NEWSPAPERS].forEach((news, index) => {
    const issue = preBoilerPapers + index + 1;
    addEvents(map, news.date, { newIssue: issue });
  })

  return map;
}

function addCatalogues(map: DayMap): DayMap {
  PRE_CPIP_CATALOGS.forEach((date) => {
    addEvents(map, date, { newClothing: true });
  });
  Object.keys(CPIP_CATALOGS).forEach((date) => {
    addEvents(map, date, { newClothing: true });
  });
  Object.keys(FURNITURE_CATALOGS).forEach((date) => {
    addEvents(map, date, { newFurnitureCatalog: true });
  })
  return map;
}

function addIglooMusicLists(map: DayMap): void {
  IGLOO_LISTS.forEach((list) => {
    addEvents(map, list.date, { musicList: true });
  })
}

function addRoomUpdates(map: DayMap): void {
  const roomOpenings: Record<string, string[]> = {};

  ROOM_OPENINGS.forEach((update) => {
    if (roomOpenings[update.date] === undefined) {
      roomOpenings[update.date] = [];
    }
    roomOpenings[update.date].push(ROOMS[update.room].name);
  })

  Object.entries(roomOpenings).forEach((pair) => {
    const [date, rooms] = pair;
    addEvents(map, date, {
      roomOpen: rooms
    })
  })

  ROOM_UPDATES.forEach((update) => {
    if (update.comment !== undefined) {
      addEvents(map, update.date, { roomUpdate: update.comment });
    }
  })

  // add music room updates
  Object.entries(ROOM_MUSIC_TIMELINE).forEach((pair) => {
    const [_, timeline] = pair;
    const [__, ...otherSongs] = timeline;

    otherSongs.forEach((update) => {
      if (update.comment !== undefined) {
        addEvents(map, update.date, { roomUpdate: update.comment });
      }
    });
  });

  STADIUM_UPDATES.forEach((update) => {
    if (update.type !== undefined || update.comment !== undefined) {
      addEvents(map, update.date, { stadiumUpdate: update.comment ?? update.type });
    }
  })
}

function addPinUpdates(map: DayMap): void {
  PINS.forEach((pin) => {
    addEvents(map, pin.date, { pin: pin.name });
  })
}

function addStandalone(map: DayMap): void {
  Object.values(STANDALONE_TEMPORARY_CHANGE).forEach((updates) => {
    updates.forEach(update => {
      if (update.comment !== undefined) {
        addEvents(map, update.startDate, { other: update.comment });
      }
    })
  })
}

function updateTimeline(days: Day[]): Day[] {
  let map = getDayMap(days);
  map = addParties(map);
  map = addNewspapers(map);
  map = addCatalogues(map);
  addIglooMusicLists(map);
  addRoomUpdates(map);
  addStagePlays(map);
  addPinUpdates(map);
  addStandalone(map);
  return getDaysFromMap(map);
}

enum EventType {
  PartyStart,
  PartyEnd,
  PartyUpdate,
  Newspaper,
  Room,
  Construction,
  PenguinStyle,
  FurnitureCatalog,
  MusicList,
  Stage,
  Game,
  Pin,
  Other
};

type Event = {
  text: string;
  type: EventType;
};

function getConsumedTimeline(days: Day[]): Array<{
  year: number;
  day: number;
  month: number;
  events: Array<Event>
}> {
  return days.map((day) => {
    const events: Event[] = [];

    const pushText = (text: string) => {
      events.push({ text, type: EventType.Other });
    }

    if (day.events.partyStart !== undefined) {
      events.push({
        type: EventType.PartyStart,
        text: day.events.partyStart
      });
    }
    if (day.events.partyEnd !== undefined) {
      events.push({
        type: EventType.PartyEnd,
        text: day.events.partyEnd
      });
    }
    if (day.events.partyUpdate !== undefined) {
      events.push({
        text: day.events.partyUpdate,
        type: EventType.PartyUpdate
      })
    }
    if (day.events.partyConstruction !== undefined) {
      events.push({ text: day.events.partyConstruction, type: EventType.Construction });
    }
    if (day.events.other !== undefined) {
      pushText(day.events.other);
    }
    if (day.events.roomOpen !== undefined) {
      let text = day.events.roomOpen.length === 1 ? (
        `Room "${day.events.roomOpen[0]}" opens`
      ) : (
        `Rooms "${day.events.roomOpen.join(', ')}" open`
      );
      events.push({ text, type: EventType.Room });
    }
    if (day.events.minigameRelease !== undefined) {
      events.push({ text : `New minigame: ${day.events.minigameRelease}`, type: EventType.Game });
    }
    if (day.events.newClothing === true) {
      events.push({ text: 'A new edition of the Penguin Style is out', type: EventType.PenguinStyle });
      // pushText('A new edition of the Penguin Style is out');
    }
    if (day.events.newIssue !== undefined) {
      const text = typeof day.events.newIssue === 'number' ? (
        `Issue #${day.events.newIssue} of the newspaper releases`
      ) : day.events.newIssue;
      
      if (day.events.newIssue)
      events.push({
        type: EventType.Newspaper,
        text
      });
    }
    if (day.events.roomUpdate !== undefined) {
      events.push({
        text: day.events.roomUpdate,
        type: EventType.Room
      })
    }
    if (day.events.stadiumUpdate !== undefined) {
      let text = '';
      if (day.events.stadiumUpdate === 'rink') {
        text = 'The Ice Rink shows up for the season';
      } else if (day.events.stadiumUpdate === 'stadium') {
        text = 'The Soccer Pitch shows up for the season';
      } else {
        text = day.events.stadiumUpdate;
      }
      events.push({
          text,
          type: EventType.Room
      });
    }
    if (day.events.stagePlay !== undefined) {
      events.push({ text: day.events.stagePlay, type: EventType.Stage });
    }
    if (day.events.musicList === true) {
      events.push({ text: 'New music is available for igloos', type: EventType.MusicList });
    }
    if (day.events.newFurnitureCatalog === true) {
      events.push({ text: 'New furniture catalog available', type: EventType.FurnitureCatalog });
    }
    if (day.events.pin !== undefined) {
      events.push({ text: `The ${day.events.pin} is now hidden in the island`, type: EventType.Pin });
    }

    const [year, month, monthDay] = processVersion(day.date);

    return {
      year,
      month,
      day: monthDay,
      events
    }
  });
}