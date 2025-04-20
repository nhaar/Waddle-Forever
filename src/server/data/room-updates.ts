import { RoomName } from "./rooms";
import { CPIP_UPDATE, ICEBERG_RELEASE, MTN_RELEASE, PET_SHOP_RELEASE, PIZZA_PARLOR_OPENING_END, PIZZA_PARLOR_OPENING_START, PUFFLE_ROUNDUP_RELEASE, SNOW_FORTS_RELEASE, SPORT_SHOP_RELEASE } from "./updates";

type RoomOpening = {
  room: RoomName;
  fileId: number;
  date: string;
};

type RoomUpdate = {
  room: RoomName;
  // file used in the update
  fileId: number;
  date: string;
  /** If not supplied, this won't be in the timeline as an update */
  comment?: string;
};

export const ROOM_UPDATES: RoomUpdate[] = [
  {
    room: 'town',
    fileId: 28,
    date: SNOW_FORTS_RELEASE
  },
  {
    room: 'rink',
    fileId: 32,
    date: SNOW_FORTS_RELEASE
  },
  {
    room: 'village',
    fileId: 82,
    date: SPORT_SHOP_RELEASE
  },
  {
    room: 'village',
    fileId: 83,
    date: MTN_RELEASE
  },
  {
    room: 'forts',
    fileId: 87,
    date: PUFFLE_ROUNDUP_RELEASE
  },
  {
    room: 'plaza',
    date: PET_SHOP_RELEASE,
    fileId: 102
  },
  {
    room: 'forts',
    date: PIZZA_PARLOR_OPENING_END,
    fileId: 36
  },
  {
    room: 'book',
    date: '2006-##-##',
    fileId: 2264,
    // comment: 'The book room was updated to have a new Mancala board'
  },
  {
    // placeholder CPIP room
    room: 'mtn',
    fileId: 260,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'berg',
    fileId: 2335,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'beach',
    fileId: 240,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'beacon',
    fileId: 241,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'boxdimension',
    fileId: 244,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'cave',
    fileId: 245,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'cove',
    fileId: 2336,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'dance',
    fileId: 248,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'dock',
    fileId: 2337,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'light',
    fileId: 256,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'lodge',
    fileId: 258,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'pet',
    fileId: 261,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'pizza',
    fileId: 262,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'shop',
    fileId: 267,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'coffee',
    fileId: 247,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'book',
    fileId: 243,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'lounge',
    fileId: 259,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'boiler',
    fileId: 242,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'attic',
    fileId: 239,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'sport',
    fileId: 286,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'sport',
    fileId: 255,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'cavemine',
    fileId: 246,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'dojo',
    fileId: 250,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'dojofire',
    fileId: 251,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'dojohide',
    fileId: 252,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'dojowater',
    fileId: 253,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'shiphold',
    fileId: 264,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'shipnest',
    fileId: 265,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'shipquarters',
    fileId: 266,
    date: CPIP_UPDATE
  }
];

export const ROOM_OPENINGS: RoomOpening[] = [
  {
    room: 'forts',
    fileId: 37,
    date: SNOW_FORTS_RELEASE
  },
  {
    room: 'sport',
    fileId: 17,
    date: SPORT_SHOP_RELEASE
  },
  {
    room: 'mtn',
    fileId: 13,
    date: MTN_RELEASE
  },
  {
    room: 'lodge',
    fileId: 11,
    date: '2005-12-22'
  },
  {
    room: 'pizza',
    fileId: 100,
    date: PIZZA_PARLOR_OPENING_START
  },
  {
    room: 'plaza',
    fileId: 103,
    date: PIZZA_PARLOR_OPENING_START
  },
  {
    room: 'pet',
    fileId: 14,
    date: PET_SHOP_RELEASE
  },
  {
    room: 'berg',
    fileId: 6,
    date: ICEBERG_RELEASE
  }
];