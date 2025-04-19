import { RoomName } from "./rooms";

type RoomOpening = {
  room: RoomName;
  fileId: number;
  updateId: number;
};

type RoomUpdate = {
  room: RoomName;
  // file used in the update
  fileId: number;
  updateId: number;
  /** If not supplied, this won't be in the timeline as an update */
  comment?: string;
};

export const ROOM_UPDATES: RoomUpdate[] = [
  {
    room: 'town',
    fileId: 28,
    updateId: 2
  },
  {
    room: 'rink',
    fileId: 32,
    updateId: 2
  },
  {
    room: 'village',
    fileId: 82,
    updateId: 9
  },
  {
    room: 'village',
    fileId: 83,
    updateId: 10
  },
  {
    room: 'forts',
    fileId: 87,
    updateId: 13
  },
  {
    room: 'plaza',
    updateId: 21,
    fileId: 102
  },
  {
    room: 'forts',
    updateId: 20,
    fileId: 36
  },
  {
    room: 'book',
    updateId: 28,
    fileId: 2264,
    // comment: 'The book room was updated to have a new Mancala board'
  },
  {
    // placeholder CPIP room
    room: 'mtn',
    fileId: 260,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'berg',
    fileId: 2335,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'beach',
    fileId: 240,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'beacon',
    fileId: 241,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'boxdimension',
    fileId: 244,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'cave',
    fileId: 245,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'cove',
    fileId: 2336,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'dance',
    fileId: 248,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'dock',
    fileId: 2337,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'light',
    fileId: 256,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'lodge',
    fileId: 258,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'pet',
    fileId: 261,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'pizza',
    fileId: 262,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'shop',
    fileId: 267,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'coffee',
    fileId: 247,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'book',
    fileId: 243,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'lounge',
    fileId: 259,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'boiler',
    fileId: 242,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'attic',
    fileId: 239,
    updateId: 27
  },
  {
    // placeholder CPIP room
    room: 'sport',
    fileId: 286,
    updateId: 27
  }
];

export const ROOM_OPENINGS: RoomOpening[] = [
  {
    room: 'forts',
    fileId: 37,
    updateId: 2
  },
  {
    room: 'sport',
    fileId: 17,
    updateId: 9
  },
  {
    room: 'mtn',
    fileId: 13,
    updateId: 10
  },
  {
    room: 'lodge',
    fileId: 11,
    updateId: 16
  },
  {
    room: 'pizza',
    fileId: 100,
    updateId: 19
  },
  {
    room: 'plaza',
    fileId: 103,
    updateId: 19
  },
  {
    room: 'pet',
    fileId: 14,
    updateId: 21
  },
  {
    room: 'berg',
    fileId: 6,
    updateId: 22
  }
];