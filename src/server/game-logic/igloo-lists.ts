import { isGreater, Version } from "../routes/versions"

type Row = [FullListSong, FullListSong];


type IglooList = [Row, Row, Row, Row, Row, Row, Row];

type FullList = {
  list: IglooList,
  date: string;
  fileRef?: string;
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
  date: string;
  fileRef?: string;
}

export const IGLOO_LISTS: [FullList, ...Array<FullList | ListUpdate>] = [
  // {
  //   date: '2008-07-18',
  //   list: [
  //     [{ display: 'Fiesta', id: 229, new: true }, { display: 'Jazz', id: 211 }],
  //     [{ display: 'Aqua Grabber', id: 114, new: true }, { display: 'Ocean Voyage', id: 212 }],
  //     [{ display: 'Medieval Town', id: 233, new: true }, { display: 'Cool Surf', id: 214 }],
  //     [{ display: 'Pizza Parlor', id: 20 }, { display: 'Coffee Shop', id: 1 }],
  //     [{ display: 'Superhero', id: 32 }, { display: 'Dance Mix 1', id: 2 }],
  //     [{ display: 'Fall Fair', id: 215 }, { display: 'Dance Mix 2', id: 5 }],
  //     [{ display: 'Folk Guitar', id: 209 }, { display: 'Water Party', id: 217 }]
  //   ]
  // },
  {
    date: '2008-10-17',
    list: [
      [{ display: 'Halloween', id: 223, new: true }, { display: 'Pizza Parlor', id: 20 }],
      [{ display: 'Halloween Dance', id: 224, new: true }, { display: 'Ocean Voyage', id: 212 }],
      [{ display: 'Epic Battle', id: 236, new: true }, { display: 'Cool Surf', id: 214 }],
      [{ display: 'Aqua Grabber', id: 114 }, { display: 'Coffee Shop', id: 1 }],
      [{ display: 'Medieval Town', id: 233 }, { display: 'Superhero', id: 32 }],
      [{ display: 'Fiesta', id: 229 }, { display: 'Dance Mix', id: 5 }],
      [{ display: 'Fall Fair', id: 221 }, { display: 'Water Party', id: 217 }]
    ]
  },
  {
    date: '2008-12-12',
    list: [
      [{ display: 'Snowy Holiday', id: 227, new: true }, { display: 'Cool Surf', id: 214 }],
      [{ display: 'Christmas Piano Medley', id: 255, new: true }, { display: 'Ocean Voyage', id: 212 }],
      [{ display: 'Anniversary Party', id: 250, new: true }, { display: 'Medieval Town', id: 233 }],
      [{ display: 'Pop Song', id: 243 }, { display: 'Epic Battle', id: 236 }],
      [{ display: 'Team Blue 2', id: 36 }, { display: 'Superhero', id: 32 }],
      [{ display: 'Fiesta', id: 229 }, { display: 'Aqua Grabber', id: 114 }],
      [{ display: 'Fall Fair', id: 221 }, { display: 'Water Party', id: 217 }]
    ]
  },
  {
    date: '2009-03-22',
    songs: [
      { display: 'Noir Noises', id: 37, pos: [1, 1] },
      { display: 'Egyptian Wrap', id: 34, pos: [2, 1] },
      { display: 'For Great Justice', id: 32, pos: [5, 2] },
      { display: 'Twice upon a Time', id: 39, pos: [6, 2] },
      { display: 'Pterodactyl Ptune', id: 35, pos: [7, 2] }
    ]
  },
  {
    date: '2009-05-29',
    songs: [
      { display: 'Flipper Stomper', id: 244, pos: [3, 1] },
      { display: 'Coconut', id: 215, pos: [5, 1] },
      { display: 'Catchin\' Waves Theme', id: 113, pos: [6, 1] },
      { display: 'Puffle Ragtime', id: 261, pos: [7, 1] },
      { display: 'Summer Song', id: 216, pos: [1, 2] },
      { display: 'Mix Maestro', id: 242, pos: [6, 2] },
      { display: 'Water Kongo', id: 217, pos: [7, 2] }
    ]
  },
  {
    date: '2009-06-26',
    songs: [
      { display: 'Viking Opera', id: 41, pos: [1, 1] },
      { display: 'Mountain Dojo', id: 21, pos: [2, 1] },
      { display: 'Silly to Funky', id: 258, pos: [5, 1] },
      { display: 'Planet Y', id: 38, pos: [5, 2] }
    ]
  },
  {
    date: '2009-07-31',
    songs: [
      { display: 'Keytar Jam', id: 275, pos: [1, 1] },
      { display: 'Rocksteady', id: 276, pos: [1, 2] },
      { display: 'All-Access Pass', id: 272, pos: [3, 2] },
      { display: 'Rocking Pizza', id: 271, pos: [5, 2] }
    ]
  },
  {
    date: '2009-09-21',
    songs: [
      { display: 'Campfire Song', id: 220, pos: [2, 1] },
      { display: 'Extra Anchovies', id: 270, pos: [7, 1] },
      { display: 'All the Fun of The Fair', id: 221, pos: [2, 2] },
      { display: 'Spicy Salsa', id: 229, pos: [6, 2] }
    ]
  },
  {
    date: '2009-10-16',
    songs: [
      { display: 'Team Power', id: 33, pos: [1, 1] },
      { display: 'Ruby\'s Theme', id: 37, pos: [5, 1] },
      { display: 'Haunted Disco', id: 223, pos: [3, 2] },
      { display: 'Zero Gravity', id: 279, pos: [4, 2] }
    ]
  },
  // date for november's is unknown
  {
    date: '2009-12-25',
    list: [
      [{ display: 'Twelfth Fish Theme', id: 31, new: true }, { display: 'Rocksteady', id: 276 }],
      [{ display: 'Campfire Song', id: 220 }, { display: 'The Volcano', id: 22 }],
      [{ display: 'DJ Christmas', id: 226, new: true }, { display: 'Underwater', id: 121, new: true }],
      [{ display: 'Norman Swarm', id: 42 }, { display: 'Zero Gravity', id: 279 }],
      [{ display: 'Ninja Training', id: 116 }, { display: 'Santa\'s Mix', id: 254, new: true }],
      [{ display: 'Coconut', id: 215 }, { display: 'Twice Upon a Time', id: 39 }],
      [{ display: 'Extra Anchovies', id: 270 }, { display: 'Water Kongo', id: 217 }]
    ]
  },
  {
    date: '2010-01-29',
    songs: [
      { display: 'Puffle Party', id: 282, pos: [3, 1] },
      { display: 'Float in the Clouds', id: 277, pos: [4, 2] },
      { display: 'Planet Y', id: 38, pos: [5, 2] },
      { display: 'Orca Straw', id: 245, pos: [6, 1] }
    ]
  },
  {
    date: '2010-02-26',
    songs: [
      { display: 'Jungle Quest', id: 269, pos: [2, 1] },
      { display: 'Flipper Jig', id: 262, pos: [7, 1] },
      { display: 'The Bamboo Forest', id: 43, pos: [3, 2] },
      { display: 'Bonus Level', id: 275, pos: [7, 2] }
    ]
  },
  {
    date: '2010-03-26',
    songs: [
      { display: 'Puffle Rescue: Ice Flow', id: 119, pos: [1, 1] },
      { display: 'Recycle!', id: 285, pos: [6, 1] },
      { display: 'Anchovy Jazz', id: 283, pos: [4, 2] },
    ]
  },
  {
    date: '2010-04-30',
    songs: [
      { display: 'Quest for the Golden Puffle', id: 34, pos: [4, 1] },
      { display: 'In the Tower', id: 235, pos: [7, 1] },
      { display: 'Puffle Rescue: In the Cave', id: 120, pos: [6, 2] }
    ]
  },
  {
    date: '2010-05-28',
    songs: [
      { display: 'Knight\'s Challenge', id: 286, pos: [2, 2] },
      { display: 'The Quest', id: 266, pos: [5, 2] },
      { display: 'Jungle Jangles', id: 267, pos: [7, 2] }
    ]
  },
  {
    date: '2010-06-25',
    songs: [
      { display: 'The Viking Opera', id: 41, pos: [3, 1] },
      { display: 'Island Adventure', id: 291, pos: [5, 1] },
      { display: 'Ruby and the Ruby', id: 37, pos: [1, 2] }
    ]
  },
  {
    date: '2010-08-20',
    songs: [
      { display: 'You Rock!', id: 293, pos: [2, 1] },
      { display: 'The Ringmaster', id: 297, pos: [2, 2] },
      { display: 'For Great Justice', id: 32, pos: [7, 2] }
    ]
  },
  {
    date: '2010-11-11',
    songs: [
      { display: 'Planet Y', id: 38, pos: [3, 1] },
      { display: 'Norman Swarm', id: 42, pos: [1, 2] },
      { display: 'Master the Elements', id: 301, pos: [4, 2] },
      { display: 'The Way of Sensei', id: 24, pos: [5, 2] }
    ]
  },
  {
    date: '2010-12-09',
    songs: [
      { display: 'Candy Cane March', id: 228, pos: [1, 1] },
      { display: 'Santa\'s Mix', id: 254, pos: [6, 1] },
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


  let list = JSON.parse(JSON.stringify(fullList.list)) as IglooList;

  for (const update of updates) {
    // end on the first update that wasn't released
    if (isGreater(update.date, date)) {
      break;
    }

    if ('songs' in update) {
      updateList(list, update);
    } else {
      list = JSON.parse(JSON.stringify(update.list)) as IglooList;
    }
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