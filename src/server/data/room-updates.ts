import { RoomName } from "./rooms";
import { CAVE_EXPEDITION_END, CAVE_OPENING_END, CAVE_OPENING_START, COVE_OPENING_START, CPIP_UPDATE, EARTH_DAY_2010_END, EARTH_DAY_2010_START, EPF_RELEASE, ICEBERG_RELEASE, LIGHTHOUSE_PARTY_START, MODERN_AS3, MTN_RELEASE, PET_SHOP_RELEASE, PIZZA_PARLOR_OPENING_END, PIZZA_PARLOR_OPENING_START, PRE_CPIP_REWRITE_DATE, PUFFLE_ROUNDUP_RELEASE, SNOW_FORTS_RELEASE, SPORT_SHOP_RELEASE, SUMMER_PARTY_START, WATER_CELEBRATION_END } from "./updates";

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
    // first room archived with the lighthouse open
    // used for the party since the SWF for the beach in
    // the party is also lost
    room: 'beach',
    date: LIGHTHOUSE_PARTY_START,
    fileId: 3835
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
    // post island adventure update
    room: 'boxdimension',
    fileId: 3757,
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
    fileId: 268,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'lake',
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
  },
  {
    // placeholder CPIP room
    room: 'agent',
    fileId: 2651,
    date: CPIP_UPDATE
  },
  {
    room: 'mine',
    fileId: 2662,
    date: CPIP_UPDATE
  },
  {
    room: 'shack',
    fileId: 2668,
    date: CPIP_UPDATE
  },
  {
    room: 'forest',
    fileId: 2657,
    date: CPIP_UPDATE
  },
  {
    room: 'ship',
    fileId: 2674,
    date: CPIP_UPDATE
  },
  {
    room: 'village',
    fileId: 2676,
    date: CPIP_UPDATE
  },
  {
    room: 'dojoext',
    fileId: 2654,
    date: '2009-11-27'
  },
  {
    room: 'mine',
    fileId: 2663,
    date: '2010-01-08'
  },
  {
    room: 'mine',
    fileId: 2664,
    date: '2010-01-15'
  },
  {
    room: 'mine',
    fileId: 2665,
    date: CAVE_EXPEDITION_END
  },
  {
    room: 'boxdimension',
    fileId: 244,
    date: '2010-02-11',
    comment: 'The plants disappear from the Box Dimension'
  },
  {
    room: 'mine',
    fileId: 2662,
    date: '2010-03-15'
  },
  {
    room: 'forest',
    fileId: 2658,
    date: EARTH_DAY_2010_START
  },
  {
    room: 'shack',
    // this file is from June, but it is being placed here as a placeholder for the file from april which is missing
    fileId: 2669,
    date: EARTH_DAY_2010_END
  },
  {
    room: 'village',
    fileId: 2677,
    date: EPF_RELEASE
  },
  {
    room: 'forest',
    fileId: 2659,
    date: '2010-06-17'
  },
  {
    room: 'shack',
    fileId: 2670,
    date: '2010-07-29'
  },
  {
    room: 'shack',
    fileId: 2671,
    date: '2010-08-26'
  },
  {
    room: 'shack',
    fileId: 2672,
    date: '2010-09-30'
  },
  {
    room: 'dojoext',
    fileId: 2655,
    date: WATER_CELEBRATION_END
  },
  {
    // placeholder AS3 room
    room: 'cove',
    fileId: 2652,
    date: MODERN_AS3
  },
  {
    // placeholder AS3 room
    room: 'dock',
    fileId: 2653,
    date: MODERN_AS3
  },
  {
    room: 'dojoext',
    fileId: 2656,
    date: MODERN_AS3
  },
  {
    room: 'forest',
    fileId: 2660,
    date: MODERN_AS3
  },
  {
    room: 'forts',
    fileId: 2661,
    date: MODERN_AS3
  },
  {
    room: 'plaza',
    fileId: 2666,
    date: MODERN_AS3
  },
  {
    room: 'rink',
    fileId: 2667,
    date: MODERN_AS3
  },
  {
    room: 'shack',
    fileId: 2673,
    date: MODERN_AS3
  },
  {
    room: 'town',
    fileId: 2675,
    date: MODERN_AS3
  },
  {
    room: 'dance',
    fileId: 3779,
    date: CAVE_OPENING_START
  },
  {
    room: 'plaza',
    fileId: 3780,
    date: CAVE_OPENING_START
  },
  {
    room: 'forest',
    fileId: 3843,
    date: '2007-05-29',
    comment: 'As the Cove Opening party ends, the whistles remain in the Forest'
  },
  {
    room: 'forest',
    fileId: 3845,
    date: '2007-06-01',
    comment: 'The whistles are removed from the Forest'
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
    fileId: 3810,
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
  },
  {
    // 2006 client boiler, the party vesion isn't archived
    room: 'boiler',
    fileId: 3939,
    date: CAVE_OPENING_START
  },
  {
    room: 'boiler',
    fileId: 3778,
    // boiler room for the 2007 client
    date: PRE_CPIP_REWRITE_DATE
  },
  {
    room: 'cave',
    fileId: 3781,
    date: CAVE_OPENING_START
  },
  {
    room: 'mine',
    fileId: 3782,
    date: CAVE_OPENING_START
  },
  {
    room: 'shack',
    fileId: 3812,
    date: CAVE_OPENING_END
  },
  {
    room: 'beach',
    fileId: 3811,
    date: SUMMER_PARTY_START
  },
  {
    room: 'forest',
    fileId: 3842,
    // this is the construction, it is technically from May 15 but we dont have
    // the map hunt that allows you to get to the forest otherwise
    date: COVE_OPENING_START
  },
  {
    // from april fools 08, unfortunately it is the only
    // pre cpip cove SWF that we have
    room: 'cove',
    fileId: 3846,
    date: COVE_OPENING_START
  }
];