import { findInVersion, VersionsTimeline } from "../game-data";
import { Version } from "../routes/versions";
import { IglooList, ListSong, ListSongPatch } from "../updates";
import { UPDATES } from "../updates/updates";

const timeline = new VersionsTimeline<IglooList>();

/** Number of rows in a 2D music list */
const ROWS = 7;
/** Number of columns in a 2D music list */
const COLS = 2;

/** Applies a patch to a music list */
function applyPatch(list: IglooList, songs: ListSongPatch[]): void {
  // clear all previous "news"
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      list[i][j].new = undefined;
    }
  }
  songs.forEach((song) => {
    const [row, col] = song.pos;
    list[row - 1][col - 1] = { id: song.id, display: song.display, new: true };
  });
}

function isMusicList(arr: IglooList | ListSongPatch[]): arr is IglooList {
  return !('pos' in arr[0]);
}

let currentList: IglooList | undefined = undefined;

UPDATES.forEach(update => {
  const list = update.update.iglooList;
  if (list !== undefined && list !== true && !('file' in list)) {
    if (isMusicList(list)) {
      currentList = list;
    } else {
      if (currentList === undefined) {
        throw new Error('Patch came before a list');
      }
      applyPatch(currentList, list);
    }
    timeline.add({
      date: update.date,
      info: JSON.parse(JSON.stringify(currentList)) as IglooList
    });
  }
});

const IGLOO_LIST_TIMELINE = timeline.getVersions();

/** Get the XML used by the dynamic igloo list tool for a given list */
function getListXml(list: IglooList): string {
  const flattened: ListSong[] = [];
  // it is read from top to bottom, then left to right, so each column first
  for (let j = 0; j < COLS; j++) {
    for (let i = 0; i < ROWS; i++) {
      flattened.push(list[i][j]);
    }
  }

  return `<?xml version="1.0" encoding="utf-8"?>
<music>
  ${flattened.map((song) => {
    return `<song name="${song.display}" id="${song.id}" ${song.new ? 'bold="true"' : ''} />`;
  }).join('')}
</music>`;
}

/** Get the raw data for the dynamic music list in a given day */
export function getDynamicMusicListData(date: Version): string {
  const list = findInVersion(date, IGLOO_LIST_TIMELINE);
  if (list === undefined) {
    throw new Error('Music list not found');
  }
  return getListXml(list);
}