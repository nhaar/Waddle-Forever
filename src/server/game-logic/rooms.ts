import { Version } from "../routes/versions";

export enum Room {
  Town = 100,
  GiftShop = 130,
  VRRoom = 213,
  PizzaParlor = 330,
  AstroBarrier = 900,
  BeanCounters = 901,
  PuffleRoundup = 902,
  HydroHopper = 903,
  IceFishing = 904,
  CartSurfer = 905,
  JetPackAdventure = 906,
  Mission1 = 907,
  Mission2 = 908,
  ThinIce = 909,
  Pizzatron = 910,
  Mission3 = 911,
  CatchinWaves = 912,
  Mission4 = 913,
  Mission5 = 914,
  Mission6 = 915,
  AquaGrabber = 916,
  MyPuffle = 917,
  BurntOutBulbs = 918,
  LimeGreenDojoClean = 919,
  Mission7 = 920,
  Mission8 = 921,
  Mission9 = 922,
  Mission10 = 923,
  DJ3K = 926,
  Mission11 = 927,
  PuffleSoaker = 941,
  BalloonPop = 942,
  RingTheBell = 943,
  FeedAPuffle = 944,
  MemoryCardGame = 945,
  PufflePaddle = 946,
  PuffleShuffle = 947,
  PuffleRescue = 949,
  SystemDefender = 950,
  DanceContest = 952,
  PuffleLaunch = 955,
  PuffleScape = 957,
  CardJitsu = 998
}

/** If the game's score is converted to coins exactly */
export const isLiteralScoreGame = (room: Room): boolean => {
  return [
    Room.IceFishing,
    Room.CartSurfer,
    Room.JetPackAdventure,
    Room.CatchinWaves,
    Room.AquaGrabber,
    Room.DanceContest,
    Room.MyPuffle,
    Room.BurntOutBulbs,
    Room.LimeGreenDojoClean
  ].includes(room);
}

export const isGameRoom = (room: Room): boolean => {
  // from what I know, 900 and forward is only minigames
  // 1000 and above however is reserved for igloos
  return room >= 900 && room < 1000;
};

type RoomName = 'Town' |
  'Snow Forts' |
  'Sport Shop' |
  'Mountain' |
  'Ski Lodge' |
  'Plaza' |
  'Pizza Parlor' |
  'Pet Shop' |
  'Iceberg' |
  'Ski Village' |
  'Everyday Phoning Facility';

type RoomOpening = {
  date: Version;
  rooms: RoomName | RoomName[];
  type: 'open'
};

type RoomUpdate = {
  date: Version;
  type: 'update';
  descriptions: string[];
}

type RoomEvent = RoomOpening | RoomUpdate;


export const ROOM_TIMELINE: RoomEvent[] = [
  { date: '2005-09-12', rooms: 'Snow Forts', type: 'open' },
  { date: '2005-11-03', rooms: 'Sport Shop', type: 'open' },
  { date: '2005-11-18', rooms: 'Mountain', type: 'open' },
  { date: '2005-12-22', rooms: 'Ski Lodge', type: 'open' },
  { date: '2006-02-24', rooms: ['Plaza', 'Pizza Parlor'], type: 'open' },
  { date: '2006-03-17', rooms: 'Pet Shop', type: 'open' },
  { date: '2006-03-29', rooms: 'Iceberg', type: 'open' },
  {
    date: '2010-04-21',
    descriptions: [
      'The Forest now has a path to the Mine Shack'
    ],
    type: 'update'
  },
  { date: '2010-05-27', rooms: 'Everyday Phoning Facility', type: 'open' },
  {
    date: '2010-05-27',
    descriptions: [
      'The Sport Shop is replaced with the Everyday Phoning Facility',
      'The Ice Rink was changed into the Stadium'
    ],
    type: 'update'
  },
  {
    date: '2010-06-17',
    descriptions: [
      'The Forest now has a path to the Hidden Lake'
    ],
    type: 'update'
  },
  {
    date: '2010-07-29',
    descriptions: [
      'Grass grew on the patch near the mine shack'
    ],
    type: 'update'
  },
  {
    date: '2010-08-26',
    descriptions: [
      'The tree near the mine shack grew longer'
    ],
    type: 'update'
  },
  {
    date: '2010-09-30',
    descriptions: [
      'The tree near the mine shack grew longer'
    ],
    type: 'update'
  },
  {
    date: '2010-12-20',
    descriptions: [
      'The Ice Rink showed up for the season'
    ],
    type: 'update'
  }
];