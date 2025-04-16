import { isGreater, Version } from "../routes/versions"

type Row = [FullListSong, FullListSong];


type IglooList = [Row, Row, Row, Row, Row, Row, Row];

type FullList = {
  list: IglooList,
  date: Version
};

type ListSong = {
  id: number;
  display: string;
}

type UpdateListSong = ListSong & {
  /** Row, column, starting at 1 */
  pos: [number, number];
}

type FullListSong = ListSong & {
  new?: true;
};

type ListUpdate = {
  songs: UpdateListSong[];
  date: Version;
}

const IGLOO_LISTS: [FullList, ...ListUpdate[]] = [
  {
    date: '2009-12-25',
    list: [
      [{ display: 'Twelfth Fish Theme', id: 31, new: true }, { display: 'Rocksteady', id: 276 }],
      [{ display: 'Campfire Song', id: 220 }, { display: 'The Volcano', id: 22 }],
      [{ display: 'DJ Christmas', id: 226, new: true }, { display: 'Underwater', id: 121, new: true }],
      [{ display: 'Norman Swarm', id: 42 }, { display: 'Zero Gravity', id: 279 }],
      [{ display: 'Ninja Training', id: 116 }, { display: 'Santa\'s Mix', id: 254, new: true }],
      [{ display: 'Coconut', id: 215 }, { display: 'Twice Upon a Time', id: 39 }],
      [{ display: 'Extra Anchovies', id: 0 }, { display: 'Water Kongo', id: 0 }]
    ]
  },
  {
    date: '2010-01-29',
    songs: [
      { display: 'Puffle Party', id: 0, pos: [3, 1] },
      { display: 'Float in the Clouds', id: 0, pos: [4, 2] },
      { display: 'Planet Y', id: 0, pos: [5, 2] },
      { display: 'Orca Straw', id: 0, pos: [6, 1] }
    ]
  },
  {
    date: '2010-02-26',
    songs: [
      { display: 'Jungle Quest', id: 0, pos: [2, 1] },
      { display: 'Flipper Jig', id: 0, pos: [7, 1] },
      { display: 'The Bamboo Forest', id: 0, pos: [3, 2] },
      { display: 'Bonus Level', id:0, pos: [7, 2] }
    ]
  },
  {
    date: '2010-03-26',
    songs: [
      { display: 'Puffle Rescue: Ice Flow', id: 0, pos: [1, 1] },
      { display: 'Recycle!', id: 0, pos: [6, 1] },
      { display: 'Anchovy Jazz', id: 0, pos: [4, 2] },
    ]
  },
  {
    date: '2010-04-30',
    songs: [
      { display: 'Quest for the Golden Puffle', id: 0, pos: [4, 1] },
      { display: 'In the Tower', id: 0, pos: [7, 1] },
      { display: 'Puffle Rescue: In the Cave', id: 0, pos: [6, 2] }
    ]
  },
  {
    date: '2010-05-28',
    songs: [
      { display: 'Knight\'s Challenge', id: 0, pos: [2, 2] },
      { display: 'The Quest', id: 0, pos: [5, 2] },
      { display: 'Jungle Jangles', id: 0, pos: [7, 2] }
    ]
  },
  {
    date: '2010-06-25',
    songs: [
      { display: 'The Viking Opera', id: 0, pos: [3, 1] },
      { display: 'Island Adventure', id: 0, pos: [5, 1] },
      { display: 'Ruby and the Ruby', id: 0, pos: [1, 2] }
    ]
  }
];

const ROWS = 7;
const COLS = 2;

function updateList(list: IglooList, update: ListUpdate): void {
  // clear all previous "news"
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      list[i][j].new = undefined;
    }
  }
  update.songs.forEach((song) => {
    const [row, col] = song.pos;
    list[row - 1][col - 1] = { id: song.id, display: song.display, new: true };
  });
}

function getIglooList(date: Version): IglooList {
  const [fullList, ...updates] = IGLOO_LISTS;

  const list = fullList.list;

  for (const update of updates) {
    // end on the first update that wasn't released
    if (isGreater(update.date, date)) {
      break;
    }

    updateList(list, update);
  }

  return list;
}

function getListXml(list: IglooList): string {
  const flattened: FullListSong[] = [];
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

export function getDynamicMusicListData(date: Version): string {
  const list = getIglooList(date);
  return getListXml(list);
}