import { COLS, GameData, ROWS } from "@server/timelines/game-data";
import { IglooList, ListSong } from "../updates";

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
export function getIglooMusicXml(d: GameData): string {
  const list = d.getIglooList();
  if (list === null) {
    return '';
  }
  return getListXml(list);
}