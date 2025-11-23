import path from 'path'

import { BrowserWindow, ipcMain } from "electron";
import { isEqual, isLower, processVersion, Version } from '../server/routes/versions';
import { PIN_TIMELINE } from '../server/timelines/pins';
import { UPDATES } from '../server/updates/updates';
import { NEWSPAPER_TIMELINE } from '../server/timelines/newspapers';

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
    timelinePicker.webContents.send('get-timeline', getConsumedTimeline(getTimeline()));
  });
}


// this type is duplicated in the timeline-static file, it should be the same type
/** Representation of a day in the Club Penguin timeline */
type Day = {
  date: Version
  events: Event[]
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
function addEvent(map: Map<Version, Day>, date: string, text: string, image: string, party?: 'start' | 'end'): void {
  const day = map.get(date);
  const event = { text, image, party };
  if (day === undefined) {
    map.set(date, { date, events: [event] });
  } else {
    map.set(date, { date, events: [ ...day.events, event ] });
  }
}

function getTimeline(): Day[] {
  let map = new Map<string, Day>();
  const premieres = new Set<string>();

  UPDATES.forEach(update => {
    if (update.update.gameRelease !== undefined) {

      addEvent(map, update.date, `${update.update.gameRelease} releases`, 'game');
    }
    if (update.update.clothingCatalog !== undefined) {
      addEvent(map, update.date, 'A new edition of the Penguin Style is out', 'clothing');
    }

    if (update.update.hairCatalog !== undefined) {
      addEvent(map, update.date, 'A new Big Wigs catalog is available', 'other');
    }
    if (update.update.furnitureCatalog !== undefined) {
      addEvent(map, update.date, 'New furniture catalog available', 'furniture');
    }
    if (update.update.newspaper === 'fan') {
      addEvent(map, update.date, 'Fan issue of the newspaper released', 'news');
    }
    if (update.update.miscComments !== undefined) {
      update.update.miscComments.forEach(comment => {
        addEvent(map, update.date, comment, 'other');
      }) 
    }
    if (
      update.update.iglooList !== undefined) {
        if (typeof update.update.iglooList !== 'string') {
          if (
            update.update.iglooList === true || !('hidden' in update.update.iglooList && update.update.iglooList.hidden === true)
          )
          addEvent(map, update.date, 'New music is available for igloos', 'music');
        } else {
          addEvent(map, update.date, update.update.iglooList, 'music');
        }
    }
    if (update.update.migrator !== false && update.update.migrator !== undefined) {
      addEvent(map, update.date, 'The migrator visits the island', 'migrator');
    }
    if (update.end !== undefined) {
      const icon = ('partyIcon' in update.update && update.update.partyIcon !== undefined) ? update.update.partyIcon : 'party';
      if ('partyName' in update.update) {
        addEvent(map, update.date, `The ${update.update.partyName} starts`, icon, update.update.decorated === false ? undefined : 'start');
        addEvent(map, update.end, `The ${update.update.partyName} ends`, 'party', update.update.decorated === false ? undefined :'end');
      } else if ('partyStart' in update.update) {
        addEvent(map, update.date, update.update.partyStart, icon, update.update.decorated === false ? undefined :'start');
        addEvent(map, update.end, update.update.partyEnd, 'party', update.update.decorated === false ? undefined :'end');
      } else if ('update' in update.update) {
        addEvent(map, update.date, update.update.update, 'party');
      }
    }
    if (update.update.roomComment !== undefined) {
      if (typeof update.update.roomComment === 'string') {
        addEvent(map, update.date, update.update.roomComment, 'room');
      } else {
        update.update.roomComment.forEach(comment => {
          addEvent(map, update.date, comment, 'room');
        })
      }
    }
    if (update.update.constructionComment !== undefined) {
      addEvent(map, update.date, update.update.constructionComment, 'const');
    }
    if (update.update.partyComment !== undefined) {
      addEvent(map, update.date, update.update.partyComment, 'party');
    }

    if (update.update.stagePlay !== undefined) {
      // pre-emptively adding premieres that aren't archived
      if (update.update.stagePlay.notPremiere) {
        premieres.add(update.update.stagePlay.name);
      }
      if (update.update.stagePlay.hide !== true) {
        const stagePlay = premieres.has(update.update.stagePlay.name)
          ? `${update.update.stagePlay.name} returns to The Stage`
          : `${update.update.stagePlay.name} premieres at the Stage`;
        addEvent(map, update.date, stagePlay, 'stage');
      }
      premieres.add(update.update.stagePlay.name);
    }
    if (update.update.stampUpdates !== undefined) {
      addEvent(map, update.date, 'New stamps are available', 'other');
    }
  });

  NEWSPAPER_TIMELINE.forEach((update, i) => {
    addEvent(map, update.date, `Issue #${i + 1} of the newspaper releases`, 'news');
  });

  PIN_TIMELINE.forEach((pin) => {
    if (!('hidden' in pin && pin.hidden === true)) {
      addEvent(map, pin.date, `The ${pin.name} is now hidden in the island`, 'pin');
    }
  });

  return getDaysFromMap(map);
}

type Event = { text: string; image: string; party?: 'start' | 'end'; };

function getConsumedTimeline(days: Day[]): Array<{
  year: number;
  day: number;
  month: number;
  events: Array<Event>;
  party?: 'start' | 'end';
}> {
  return days.map((day) => {

    const [year, month, monthDay] = processVersion(day.date);

    return {
      year,
      month,
      day: monthDay,
      events: day.events
    }
  });
}