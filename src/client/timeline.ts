import path from 'path'

import { BrowserWindow, ipcMain } from "electron";
import { PARTIES } from '../server/game-data/parties';
import { isEqual, isLower, processVersion, Version } from '../server/routes/versions';
import { FAN_ISSUE_DATE, AS2_NEWSPAPERS, PRE_BOILER_ROOM_PAPERS, AS3_NEWSPAPERS } from '../server/game-data/newspapers';
import { STAGE_TIMELINE } from '../server/game-data/stage-plays';
import { IGLOO_LISTS, PRE_CPIP_IGLOO_LISTS } from '../server/game-data/igloo-lists';
import { ROOM_MUSIC_TIMELINE, ROOM_OPENINGS, ROOM_UPDATES, TEMPORARY_ROOM_UPDATES } from '../server/game-data/room-updates';
import { STANDALONE_CHANGE, STANDALONE_TEMPORARY_CHANGE, STANDALONE_TEMPORARY_UPDATES, STANDALONE_UPDATES } from '../server/game-data/standalone-changes';
import { STADIUM_UPDATES } from '../server/game-data/stadium-updates';
import { ROOMS } from '../server/game-data/rooms';
import { PRE_CPIP_GAME_UPDATES } from '../server/game-data/games';
import { STANDALONE_MIGRATOR_VISITS } from '../server/game-data/migrator-visits';
import { iterateEntries } from '../common/utils';
import { STAMP_TIMELINE } from '../server/game-data/stamps';
import { PIN_TIMELINE } from '../server/timelines/pins';
import { CLOTHING_TIMELINE } from '../server/timelines/clothing';
import { FURNITURE_TIMELINE } from '../server/timelines/furniture';

export function createTimelinePicker (mainWindow: BrowserWindow) {
  const timelinePicker = new BrowserWindow({
    show: false,
    title: "Timeline",
    webPreferences: {
      preload: path.join(__dirname, 'preload/timeline-preload.js')
    }
  });

  timelinePicker.setMenu(null);

  timelinePicker.loadFile(path.join(__dirname, 'views/timeline.html'));

  ipcMain.on('update-version', () => {
    mainWindow.webContents.reloadIgnoringCache();
  });

  timelinePicker.webContents.on('did-finish-load', () => {
    timelinePicker.maximize();
    timelinePicker.show();
    // TODO this array is currently hardcoded because of the previous system
    // it should become dynamic in the next updates
    let timeline: Day[] = [
      {
        date: '2005-08-22',
        events: {
          other: ['Beta release'],
        }
      },
      {
        date: '2010-01-08',
        events: {
          other: ['A rockslide appears in the Mine']
        }
      },
      {
        date: '2010-01-15',
        events: {
          other: ['The rockslide in the Mine progresses']
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
          other: ['Stadium Games party ends during the Holiday Party'],
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
          other: ['test']
        }
      }
    ]
    timeline = updateTimeline(timeline);
    timelinePicker.webContents.send('get-timeline', getConsumedTimeline(timeline));
  });
}

type BaseEvents = {
  /** Info is either the name of the party (placeholder message) or custom message with comment: true */
  partyStart: string[];
  /** Name of a party that ended this day */
  partyEnd: string[]
  /** Description of something that changed in a party today */
  partyUpdate: string
  /** Uncategorized thing that happened this day */
  other: string[]
  /** Number (or name) of new CPT issues that released this day */
  newIssue: number | string
  /** Name of a room that opened this day */
  roomOpen: string[];
  /** Description of how a room was updated this day */
  roomUpdate: string;
  /** Name of a minigame that released this day */
  minigameRelease: string
  pin: string;
  /** If a clothing catalogue was released this day */
  newClothing: boolean
  /** Name of stage play that is debuting today if any */
  stagePlay: string;
  /** If a music list was released this day */
  musicList: true;
  newFurnitureCatalog: true;
  partyConstruction: string;
  stadiumUpdate: 'stadium' | 'rink' | string;
  migrator: true;
};

/** All things that can happen in a single day */
type Events = Partial<BaseEvents>;

// some typescript witcher to get property that points to an array in T
type ArrayProperties<T> = {
  [K in keyof T]: T[K] extends any[] ? K : never
}[keyof T];

type EventsArrayProperty = ArrayProperties<BaseEvents>;

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

/** Add a new event to an array property */
function addArrayEvents<Prop extends EventsArrayProperty>(map: Map<Version, Day>, prop: EventsArrayProperty, date: string, value: BaseEvents[Prop][number]) {
  const day = map.get(date);
  if (day === undefined) {
    map.set(date, { date, events: { [prop]: [value] }});
  } else {
    const previousValue = day.events[prop];
    if (previousValue === undefined) {
      map.set(date, { date, events: { ...day.events, [prop]: [value] }});
    } else {
      map.set(date, { date, events: { ...day.events, [prop]: [...previousValue, value] }});
    }
  }
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
    // pre-emptively adding premieres that aren't archived
    if (update.notPremiere) {
      premieres.add(update.name);
    }
    if (update.hide !== true) {
      const stagePlay = premieres.has(update.name)
        ? `${update.name} returns to The Stage`
        : `${update.name} premieres at the Stage`;
      addEvents(map, update.date, { stagePlay });
    }
    premieres.add(update.name);
  });
}

/** Adds all the parties to a timeline */
function addParties(map: DayMap): DayMap {
  for (let i = 0; i < PARTIES.length; i++) {
    const party = PARTIES[i];

    const partyStartProp = party.event === true ? 'other' : 'partyStart'

    const partyStart = party.startComment === undefined
      ? `The ${party.name} starts`
      : party.startComment;
    addArrayEvents(map, partyStartProp, party.date, partyStart );

    const partyEndProp = party.event === true ? 'other' : 'partyEnd'

    const partyEnd = party.endComment === undefined
      ? `The ${party.name} ends`
      : party.endComment;
    addArrayEvents(map, partyEndProp, party.end, partyEnd);

    if (party.construction !== undefined) {
        const partyStart = party.construction.comment === undefined ?
          `Construction for the ${party.name} starts` :
          party.construction.comment;
      
        addEvents(map, party.construction.date, { partyConstruction: partyStart });

        if (party.construction.updates !== undefined) {
          party.construction.updates.forEach((update) => {
            addEvents(map, update.date, { partyConstruction: update.comment });
          })
        }
    }

    if (party.updates !== undefined) {
      for (const update of party.updates) {
        if (update.comment !== undefined) {
          addEvents(map, update.date, { partyUpdate: update.comment });
        }
      }
    }

    if (party.permanentChanges?.roomComment !== undefined) {
      addEvents(map, party.date, { roomUpdate: party.permanentChanges.roomComment });
    }
    if (party.consequences?.roomComment !== undefined) {
      addEvents(map, party.end, { roomUpdate: party.consequences.roomComment });
    }
  }

  return map;
}

function addGames(map: DayMap): void {
  Object.entries(PRE_CPIP_GAME_UPDATES).forEach((pair) => {
    const [game, updates] = pair;
    const [release] = updates;
    if (release.date !== undefined) {
      addEvents(map, release.date, { minigameRelease: `${game} releases`});
    }
  })
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
  CLOTHING_TIMELINE.forEach(update => {
    addEvents(map, update.date, { newClothing: true });
  });
  FURNITURE_TIMELINE.forEach(update => {
    addEvents(map, update.date, { newFurnitureCatalog: true });
  });
  return map;
}

function addIglooMusicLists(map: DayMap): void {
  PRE_CPIP_IGLOO_LISTS.forEach((list) => {
    addEvents(map, list.date, { musicList: true });
  });
  
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

  Object.values(ROOM_UPDATES).forEach((updates) => {
    updates.forEach((update) => {
      if (update.comment !== undefined) {
        addEvents(map, update.date, { roomUpdate: update.comment });
      }
    })
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
  });

  Object.values(TEMPORARY_ROOM_UPDATES).forEach((updates) => {
    updates.forEach((update) => {
      if (update.comment !== undefined) {
        addEvents(map, update.date, { roomUpdate: update.comment });
      }
    })
  })
}

function addPinUpdates(map: DayMap): void {
  PIN_TIMELINE.forEach((pin) => {
    if (!('hidden' in pin && pin.hidden === true)) {
      addEvents(map, pin.date, { pin: pin.name });
    }
  });
}

function addStandalone(map: DayMap): void {
  Object.values(STANDALONE_TEMPORARY_CHANGE).forEach((updates) => {
    updates.forEach(update => {
      if (update.comment !== undefined) {
        addArrayEvents(map, 'other', update.startDate, update.comment);
      }
      if (update.endComment !== undefined) {
        addArrayEvents(map, 'other', update.endDate, update.endComment);
      }
      if (update.updates !== undefined) {
        update.updates.forEach((newUpdate) => {
          if (newUpdate.comment !== undefined) {
            addArrayEvents(map, 'other', update.endDate, newUpdate.comment);
          }
        })
      }
    })
  })

  STANDALONE_TEMPORARY_UPDATES.forEach((update) => {
    if (update.comment !== undefined) {
      addArrayEvents(map, 'other', update.date, update.comment);
    }
    if (update.updates !== undefined) {
      update.updates.forEach(subUpdate => {
        if (subUpdate.comment !== undefined) {
          addArrayEvents(map, 'other', subUpdate.date ?? update.date, subUpdate.comment);
        }
        if (subUpdate.endComment !== undefined && typeof subUpdate.end === 'string') {
          addArrayEvents(map, 'other', subUpdate.end, subUpdate.endComment);
        }
      })
    }
  });

  STANDALONE_UPDATES.forEach(update => {
    if (update.comment !== undefined) {
      addArrayEvents(map, 'other', update.date, update.comment);
    }
  });

  iterateEntries(STANDALONE_CHANGE, (_, updates) => {
    updates.forEach(update => {
      if (update.comment !== undefined) {
        addArrayEvents(map, 'other', update.date, update.comment);
      }
    });
  })
}

function addMigratorVisits(map: DayMap): void {
  STANDALONE_MIGRATOR_VISITS.forEach(visit => {
    addEvents(map, visit.date, { migrator: true });
  });

  PARTIES.forEach(party => {
    if (party.activeMigrator !== undefined) {
      addEvents(map, party.date, { migrator: true });
    }
  });
}

function addStamps(map: DayMap): void {
  STAMP_TIMELINE.forEach(update => {
    addArrayEvents(map, 'other', update.date, 'New stamps are available');
  });
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
  addGames(map);
  addMigratorVisits(map);
  addStamps(map);
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
  Migrator,
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
  let iglooMusicReleased = false;

  return days.map((day) => {
    const events: Event[] = [];

    const pushText = (text: string) => {
      events.push({ text, type: EventType.Other });
    }

    if (day.events.partyStart !== undefined) {
      day.events.partyStart.forEach((partyStart) => {
        events.push({
          type: EventType.PartyStart,
          text: partyStart
        });
      })
    }
    if (day.events.partyEnd !== undefined) {
      day.events.partyEnd.forEach((partyEnd) => {
        events.push({
          type: EventType.PartyEnd,
          text: partyEnd
        });
      })
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
      day.events.other.forEach((other) => {
        pushText(other);
      })
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
      events.push({ text : day.events.minigameRelease, type: EventType.Game });
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
      let text;
      if (iglooMusicReleased) {
        text = 'New music is available for igloos';
      } else {
        iglooMusicReleased = true;
        text = 'Penguins can now add music to their igloo';
      }
      events.push({ text, type: EventType.MusicList });
    }
    if (day.events.newFurnitureCatalog === true) {
      events.push({ text: 'New furniture catalog available', type: EventType.FurnitureCatalog });
    }
    if (day.events.pin !== undefined) {
      events.push({ text: `The ${day.events.pin} is now hidden in the island`, type: EventType.Pin });
    }
    if (day.events.migrator === true) {
      events.push({ text: 'The Migrator visits the island', type: EventType.Migrator });
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