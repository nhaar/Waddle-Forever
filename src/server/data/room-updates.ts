import { Version } from "../routes/versions";
import { RoomName, RoomMap } from "./rooms";
import { AGENTCOM_RELEASE, AQUAGRABBER_RELEASE, BETA_RELEASE, CARD_JITSU_RELEASE, CAVE_EXPEDITION_END, CAVE_OPENING_END, CAVE_OPENING_START, CHRISTMAS_2005_ENDS, COVE_OPENING_START, CPIP_UPDATE, DIG_OUT_DOJO_END, EARTH_DAY_2010_END, EARTH_DAY_2010_START, EARTHQUAKE, EPF_RELEASE, FIND_FOUR_RELEASE, FIRE_CELEBRATION_START, FIRST_STAGE_PLAY, GAME_UPGRADES, HQ_REDESIGN, ICE_FISHING_RELEASE, ICEBERG_RELEASE, JPA_RELEASE, LIGHTHOUSE_PARTY_START, MISSION_1_RELEASE, MODERN_AS3, MTN_RELEASE, MUSIC_JAM_08_START, PET_SHOP_RELEASE, PIZZA_PARLOR_OPENING_END, PIZZA_PARLOR_OPENING_START, PLAZA_LAUNCHPAD_START, PRE_CPIP_REWRITE_DATE, PUFFLE_ROUNDUP_RELEASE, ROCKHOPPER_ARRIVAL_END, ROOM_REDRAWS, SNOW_SPORT_RELEASE, SPORT_PARTY_END, SPORT_SHOP_RELEASE, SUMMER_PARTY_START, THIN_ICE_RELEASE, WATER_CELEBRATION_END, WATER_HUNT_END } from "./updates";

type RoomOpening = {
  room: RoomName;
  fileId: number | null;
  date: string;
  // file id of other rooms that are changing concurrently
  otherRooms?: RoomMap<number>;
  map?: number;
};

type RoomUpdate = {
  // file used in the update
  fileId: number;
  date: string;
  /** If not supplied, this won't be in the timeline as an update */
  comment?: string;
};

export const ROOM_UPDATES: RoomMap<RoomUpdate[]> = {
  town: [
    {
      fileId: 2675,
      date: MODERN_AS3
    },
    {
      // first vectorized version of the Town, possibly from 2007
      // unknown how to document it
      fileId: 4854,
      date: PRE_CPIP_REWRITE_DATE
    },
    {
      // placeholder CPIP room
      date: CPIP_UPDATE,
      fileId: 2642
    }
  ],
  rink: [
    {
      fileId: 2667,
      date: MODERN_AS3
    },
    {
      // unknown date, you can now walk to the audience in the rink
      // only evidence is after april fools party
      date: '2006-04-01',
      fileId: 4867
    },
    {
      date: '2006-08-11',
      fileId: 4868,
      comment: 'The Ice Rink now has score signs'
    },
    {
      // placeholder CPIP room
      date: CPIP_UPDATE,
      fileId: 2645
    }
  ],
  village: [
    {
      fileId: 2676,
      date: CPIP_UPDATE
    },
    {
      fileId: 2677,
      date: EPF_RELEASE
    },
    {
      date: ROOM_REDRAWS,
      fileId: 4925,
      comment: 'The Ski Village is redrawn'
    },
  ],
  forts: [
    {
      fileId: 87,
      date: PUFFLE_ROUNDUP_RELEASE
    },
    {
      fileId: 2661,
      date: MODERN_AS3
    },
    {
      date: ROOM_REDRAWS,
      fileId: 4866,
      comment: 'The Snow Forts is redrawn'
    },
    {
      // placeholder CPIP room
      date: CPIP_UPDATE,
      fileId: 2643
    }
  ],
  pizza: [
    {
      // placeholder CPIP room
      // the only SWF we have of CPIP before renovation
      fileId: 4908,
      date: CPIP_UPDATE
    }
  ],
  plaza: [
    {
      // placeholder because the stage play is missing
      fileId: 2289,
      date: CPIP_UPDATE
    },
    {
      fileId: 2666,
      date: MODERN_AS3
    },
    {
      // date of vectorization is unknown
      date: PRE_CPIP_REWRITE_DATE,
      fileId: 4872
    },
    {
      date: '2007-01-26',
      fileId: 4873,
      comment: 'Tours are now present in the Plaza'
    }
  ],
  book: [
    {
      date: '2006-##-##',
      fileId: 2264,
      // comment: 'The book room was updated to have a new Mancala board'
    },
    {
      // placeholder CPIP room
      fileId: 4858,
      date: CPIP_UPDATE
    },
    {
      // room with UGC art
      fileId: 4857,
      date: '2010-10-23',
      comment: 'The Book Room now contains Penguin Art'
    }
  ],
  beach: [
    {
      fileId: 4913,
      date: CPIP_UPDATE
    },
    {
      fileId: 4942,
      comment: 'Rockhopper lands in Club Penguin with a rowboat',
      date: '2008-01-23'
    },
    {
      date: '2008-02-01',
      fileId: 4946,
      comment: 'Save The Migrator Project is set up at the Beach'
    },
    {
      date: '2008-02-23',
      fileId: 4949,
      comment: 'Pieces of The Migrator show up at the Beach'
    },
    {
      date: '2008-02-29',
      fileId: 4948,
      comment: 'More pieces show up at the Beach'
    },
    {
      date: '2008-03-07',
      fileId: 4950,
      comment: 'Reconstruction of The Migrator begins'
    },
    {
      // this date is a conjecture, don't know when it actually happened
      date: '2008-03-20',
      fileId: 4951,
      comment: 'Reconstruction of The Migrator progresses'
    },
    {
      date: '2008-03-27',
      fileId: 4952,
      comment: 'Reconstruction of The Migrator progresses'
    },
    {
      date: '2008-04-10',
      fileId: 4953,
      comment: 'The Migrator is cleaned up and a new device is at the Beach'
    }
  ],
  mtn: [
    {
      // placeholder CPIP room
      fileId: 5079,
      date: CPIP_UPDATE
    },
    {
      fileId: 4923,
      date: GAME_UPGRADES
    },
    {
      date: ROOM_REDRAWS,
      fileId: 4922,
      comment: 'The Ski Hill is redrawn'
    },
  ],
  berg: [
    {
      // placeholder CPIP room
      fileId: 2335,
      date: CPIP_UPDATE
    },
    {
      // another september 22 redraw
      date: ROOM_REDRAWS,
      fileId: 4909,
      comment: 'The Iceberg is redrawn'
    },
    {
      date: '2008-02-08',
      fileId: 4947,
      comment: 'Construction of a new invention begins in the Iceberg'
    },
    {
      date: '2008-02-15',
      comment: 'A poll is added to the Iceberg',
      fileId: 3955
    },
    {
      date: AQUAGRABBER_RELEASE,
      fileId: 4910,
      comment: 'The Aqua Grabber\'s construction is finished'
    }
  ],
  beacon: [
    {
      // placeholder CPIP room
      fileId: 5014,
      date: CPIP_UPDATE
    },
    {
      date: JPA_RELEASE,
      fileId: 5009,
      comment: 'The launchpad construction in the Beacon is finished'
    }
  ],
  boxdimension: [
    {
      // placeholder CPIP room
      // post island adventure update
      fileId: 3757,
      date: CPIP_UPDATE
    },
    {
      fileId: 244,
      date: '2010-02-11',
      comment: 'The plants disappear from the Box Dimension'
    }
  ],
  cave: [
    {
      // placeholder CPIP room
      fileId: 4917,
      date: CPIP_UPDATE
    }
  ],
  cove: [
    {
      // recreation of proper cove room here
      fileId: 5074,
      date: CPIP_UPDATE
    },
    {
      fileId: 2336,
      date: GAME_UPGRADES
    },
    {
      // placeholder AS3 room
      fileId: 2652,
      date: MODERN_AS3
    },
  ],
  dance: [
    {
      fileId: 5073,
      date: CPIP_UPDATE
    },
    {
      // placeholder vectorized room, unknown date
      fileId: 4859,
      date: PRE_CPIP_REWRITE_DATE
    },
    {
      fileId: 4861,
      date: '2010-01-29',
      comment: 'The Dance Club now changes colors if a lot of monochrome penguins are present'
    }
  ],
  dock: [
    {
      // pre catalog
      fileId: 5075,
      date: CPIP_UPDATE
    },
    {
      fileId: 2337,
      date: GAME_UPGRADES
    },
    {
      // placeholder AS3 room
      fileId: 2653,
      date: MODERN_AS3
    },
    {
      date: ROOM_REDRAWS,
      fileId: 4911,
      comment: 'The Dock is redrawn'
    }
  ],
  light: [
    {
      fileId: 5077,
      date: CPIP_UPDATE
    },
    {
      date: '2007-04-13',
      fileId: 4914,
      comment: 'A stage is now built in the Lighthouse'
    },
  ],
  lodge: [
    {
      // placeholder CPIP room
      fileId: 5078,
      date: CPIP_UPDATE
    },
    {
      fileId: 4928,
      date: GAME_UPGRADES  
    },
    {
      fileId: 11,
      date: ICE_FISHING_RELEASE,
      comment: 'A door for Ice Fishing is added in the Ski Lodge'
    },
    {
      fileId: 4927,
      date: FIND_FOUR_RELEASE,
      comment: 'Find Four tables are added to the Ski Lodge'
    }
  ],
  pet: [
    {
      fileId: 5080,
      date: CPIP_UPDATE
    },
    {
      // white puffle release
      fileId: 4906,
      date: '2009-03-06',
      comment: 'White puffles are available in the Pet Shop'
    },
    {
      // purple puffles release
      date: '2006-08-25',
      fileId: 4902,
      comment: 'Purple Puffles are now in the Pet Shop'
    },
    {
      // the wiki mentions it as this date, seems like the date most rooms were redrawn?
      // dont know the source
      date: ROOM_REDRAWS,
      fileId: 4903,
      comment: 'The Pet Shop is redrawn'
    },
    {
      date: '2006-12-08',
      fileId: 4904,
      comment: 'Red Puffles are now in the Pet Shop'
    },
    {
      // NOTE: this date is a PLACEHOLDER! we don't know the exact date...
      date: '2007-02-28',
      fileId: 4905,
      comment: 'The Pet Shop now has animations'
    },
    {
      date: '2010-02-25',
      fileId: 4907,
      comment: 'White Puffles are now in the Pet Shop'
    },
  ],
  shop: [
    {
      // placeholder CPIP room
      fileId: 4865,
      date: CPIP_UPDATE
    },
    {
      // unknown date, vectorized 07 rooms
      date: PRE_CPIP_REWRITE_DATE,
      fileId: 5071
    }
  ],
  coffee: [
    {
      // the first CPIP room we have
      fileId: 4856,
      date: CPIP_UPDATE
    },
    {
      // an unknown update which removed the ability to click on the couch
      fileId: 7,
      date: '2005-12-01'
    }
  ],
  lounge: [
    {
      // placeholder CPIP room
      fileId: 4863,
      date: CPIP_UPDATE
    },
    {
      date: THIN_ICE_RELEASE,
      comment: 'A new cabinet is in the Dance Lounge',
      fileId: 4862
    }
  ],
  boiler: [
    {
      // placeholder CPIP room
      fileId: 4918,
      date: CPIP_UPDATE
    }
  ],
  attic: [
    {
      // placeholder start room
      fileId: 5090,
      date: BETA_RELEASE
    },
    {
      // placeholder CPIP room
      fileId: 239,
      date: CPIP_UPDATE
    }
  ],
  sport: [
    {
      // placeholder CPIP room
      fileId: 4929,
      date: CPIP_UPDATE
    },
    {
      fileId: 4864,
      date: SNOW_SPORT_RELEASE,
      comment: 'The Snow and Sports catalog is now available in the Sport Shop'
    }
  ],
  lake: [
    {
      // placeholder CPIP room
      fileId: 255,
      date: CPIP_UPDATE
    }
  ],
  cavemine: [
    {
      // placeholder CPIP room
      fileId: 246,
      date: CPIP_UPDATE
    }
  ],
  dojo: [
    {
      fileId: 5076,
      date: CPIP_UPDATE
    },
    {
      fileId: 250,
      date: CARD_JITSU_RELEASE
    },
    {
      date: ROOM_REDRAWS,
      fileId: 4920,
      comment: 'The dojo is redrawn'
    },
    {
      date: CARD_JITSU_RELEASE,
      fileId: 4921,
      comment: 'The dojo now has the Card-Jitsu game'
    }
  ],
  dojofire: [
    {
      // placeholder CPIP room
      fileId: 251,
      date: CPIP_UPDATE
    },
  ],
  dojohide: [
    {
      // placeholder CPIP room
      fileId: 5091,
      date: CPIP_UPDATE
    },
    {
      fileId: 5092,
      date: FIRE_CELEBRATION_START
    },
    {
      fileId: 5093,
      date: WATER_HUNT_END
    }
  ],
  dojowater: [
    {
      // placeholder CPIP room
      fileId: 253,
      date: CPIP_UPDATE
    }
  ],
  shiphold: [
    {
      // placeholder CPIP room
      fileId: 264,
      date: CPIP_UPDATE
    }
  ],
  shipnest: [
    {
      // placeholder CPIP room
      fileId: 265,
      date: CPIP_UPDATE
    }
  ],
  shipquarters: [
    {
      // placeholder CPIP room
      fileId: 266,
      date: CPIP_UPDATE
    }
  ],
  agent: [
    {
      // proper recreation of what it was like when CPIP dropped
      fileId: 5072,
      date: CPIP_UPDATE
    },
    {
      // mancala was added at some random point I dont know
      fileId: 4931,
      date: '2005-11-01'
    },
    {
      fileId: 4930,
      date: '2006-02-11',
      comment: 'Mancala is removed from the HQ'
    },
    {
      fileId: 4932,
      date: HQ_REDESIGN,
      comment: 'The HQ is redesigned'
    },
    {
      // placeholder HQ update for the PSA missions
      fileId: 4934,
      date: MISSION_1_RELEASE
    }
  ],
  agentcom: [
    {
      date: EPF_RELEASE,
      fileId: 5085,
      comment: 'The EPF Command Room is under construction'
    },
    {
      date: '2010-06-03',
      fileId: 5083,
      comment: 'Only the VR Room remains under construction'
    },
    {
      date: '2010-06-10',
      fileId: 5084,
      comment: 'The VR Room\'s construction is finished'
    },
    {
      date: '2010-06-15',
      fileId: 5086,
      comment: 'Field Ops are made available'
    }
  ],
  mine: [
    {
      fileId: 2662,
      date: CPIP_UPDATE
    },
    {
      fileId: 2663,
      date: '2010-01-08'
    },
    {
      fileId: 2664,
      date: '2010-01-15'
    },
    {
      fileId: 2662,
      date: '2010-03-15'
    },
    {
      date: ROOM_REDRAWS,
      fileId: 4919,
      comment: 'The mine is redrawn'
    }
  ],
  shack: [
    {
      fileId: 2668,
      date: CPIP_UPDATE
    },
    {
      fileId: 2670,
      date: '2010-07-29'
    },
    {
      fileId: 2671,
      date: '2010-08-26'
    },
    {
      fileId: 2672,
      date: '2010-09-30'
    },
    {
      fileId: 2673,
      date: MODERN_AS3
    }
  ],
  forest: [
    {
      fileId: 2657,
      date: CPIP_UPDATE
    },
    {
      fileId: 2659,
      date: '2010-06-17'
    },
    {
      fileId: 3843,
      date: '2007-05-29',
      comment: 'As the Cove Opening party ends, the whistles remain in the Forest'
    },
    {
      fileId: 3845,
      date: '2007-06-01',
      comment: 'The whistles are removed from the Forest'
    },
    {
      fileId: 2660,
      date: MODERN_AS3
    }
  ],
  ship: [
    {
      fileId: 2674,
      date: CPIP_UPDATE
    }
  ],
  dojoext: [
    {
      fileId: 2654,
      date: '2009-11-27',
      comment: 'A video about Card-Jitsu fire is now on display at the Dojo Courtyard'
    },
    {
      fileId: 2656,
      date: MODERN_AS3
    },
    {
      // this file we have has the white puffle, which I believe is only from the puffle party 2009
      date: CARD_JITSU_RELEASE,
      fileId: 4097
    },
  ]
};

export const ROOM_OPENINGS: RoomOpening[] = [
  {
    room: 'forts',
    fileId: 37,
    date: '2005-09-12',
    otherRooms: {
      town: 28,
      rink: 32,
    },
    map: 35
  },
  {
    room: 'sport',
    fileId: 17,
    date: SPORT_SHOP_RELEASE,
    otherRooms: {
      village: 82
    }
  },
  {
    room: 'mtn',
    fileId: 13,
    date: MTN_RELEASE,
    otherRooms: {
      village: 83
    }
  },
  {
    room: 'lodge',
    fileId: 4926,
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
    date: PET_SHOP_RELEASE,
    otherRooms: {
      plaza: 102
    }
  },
  {
    room: 'berg',
    fileId: 6,
    date: ICEBERG_RELEASE,
    map: 104
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
  },
  {
    room: 'dojoext',
    fileId: 4179,
    // not actual date, but we dont have a map for before the dojo was out yet, and
    // the dojo is inaccessible otherwise for the game CPIP-Dojo release
    date: DIG_OUT_DOJO_END
  },
  {
    room: 'stage',
    fileId: null,
    date: FIRST_STAGE_PLAY
  },
  {
    room: 'agentcom',
    fileId: 4936,
    date: AGENTCOM_RELEASE,
    otherRooms: {
      // placeholder CPIP room
      agent: 2651
    }
  },
  {
    room: 'beacon',
    fileId: 5010,
    date: LIGHTHOUSE_PARTY_START
  }
];

type MusicTimeline = [number, ...Array<{ date: Version; musicId: number; comment?: string; }>];

export const ROOM_MUSIC_TIMELINE: Partial<Record<RoomName, MusicTimeline>> = {
  'coffee': [1],
  'book': [1],
  'pizza': [20],
  'lounge': [6],
  'dance': [
    2,
    // switching to crossing over, unknown the exact date, it's around this time though
    { 
      date: '2006-03-23', 
      musicId: 5,
      comment: 'The Dance Club music is updated'
    }
  ],
  'agent': [
    0,
    { date: HQ_REDESIGN, musicId: 7 }
  ],
  'agentcom': [
    7,
    { date: EPF_RELEASE, musicId: 23 }
  ],
  'dojo': [
    0,
    { date: DIG_OUT_DOJO_END, musicId: 21 }
  ],
  boxdimension: [264],
  'dojofire': [22],
  dojohide: [21],
  dojoext: [
    21,
    { date: CARD_JITSU_RELEASE, musicId: 0}
  ],
  dojowater: [24],
  boiler: [6]
};

type TemporaryRoomUpdate = Array<{
  date: Version,
  end: Version,
  fileId: number;
  comment?: string;
  frame?: number;
}>;

export const TEMPORARY_ROOM_UPDATES: Partial<Record<RoomName, TemporaryRoomUpdate>> = {
  'dance': [
    {
      date: EARTHQUAKE,
      // no ide when this ended
      end: '2008-06-24',
      fileId: 4963
    }
  ],
  'plaza': [
    {
      date: PLAZA_LAUNCHPAD_START,
      end: '2006-10-13',
      fileId: 5011,
      comment: 'A construction begins at the Plaza',
      frame: 2
    }
  ],
  'town': [
    {
      date: '2006-09-28',
      end: PLAZA_LAUNCHPAD_START,
      fileId: 5012,
      comment: 'A construction begins at the Town'
    }
  ],
  'forts': [
    {
      // unknown end date
      date: '2008-04-17',
      end: '2008-04-21',
      fileId: 5013,
      comment: 'The Snow Forts clock breaks'
    }
  ]
}