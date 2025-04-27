import { Version } from "../routes/versions";
import { RoomName } from "./rooms";
import { AGENTCOM_RELEASE, AQUAGRABBER_RELEASE, CARD_JITSU_RELEASE, CAVE_EXPEDITION_END, CAVE_OPENING_END, CAVE_OPENING_START, CHRISTMAS_2005_ENDS, COVE_OPENING_START, CPIP_UPDATE, DIG_OUT_DOJO_END, EARTH_DAY_2010_END, EARTH_DAY_2010_START, EARTHQUAKE, EPF_RELEASE, FIND_FOUR_RELEASE, FIRST_STAGE_PLAY, HQ_REDESIGN, ICE_FISHING_RELEASE, ICEBERG_RELEASE, JPA_RELEASE, LIGHTHOUSE_PARTY_START, MISSION_1_RELEASE, MODERN_AS3, MTN_RELEASE, PET_SHOP_RELEASE, PIZZA_PARLOR_OPENING_END, PIZZA_PARLOR_OPENING_START, PLAZA_LAUNCHPAD_START, PRE_CPIP_REWRITE_DATE, PUFFLE_ROUNDUP_RELEASE, ROCKHOPPER_ARRIVAL_END, ROOM_REDRAWS, SNOW_FORTS_RELEASE, SNOW_SPORT_RELEASE, SPORT_PARTY_END, SPORT_SHOP_RELEASE, SUMMER_PARTY_START, THIN_ICE_RELEASE, WATER_CELEBRATION_END } from "./updates";

type RoomOpening = {
  room: RoomName;
  fileId: number | null;
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
    fileId: 4923,
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
    // earliest beach we have archived
    room: 'beach',
    fileId: 4913,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'beacon',
    fileId: 5014,
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
    fileId: 4917,
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
    // this is from june 26, when dj3k disks are added
    // other SWFs in-between are lost
    room: 'dance',
    fileId: 4860,
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
    fileId: 4915,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'lodge',
    fileId: 4928,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'pet',
    // this room seems to be from march 2009, but... tough luck we don't have that SWF
    fileId: 4906,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    // the only SWF we have of CPIP before renovation
    room: 'pizza',
    fileId: 4908,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'shop',
    fileId: 4865,
    date: CPIP_UPDATE
  },
  {
    // the first CPIP room we have
    room: 'coffee',
    fileId: 4856,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'book',
    fileId: 4858,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'lounge',
    fileId: 4863,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'boiler',
    fileId: 4918,
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
    fileId: 4929,
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
    // proper recreation of what it was like when CPIP dropped
    room: 'agent',
    fileId: 5072,
    date: CPIP_UPDATE
  },
  {
    // placeholder CPIP room
    room: 'agent',
    fileId: 2651,
    date: AGENTCOM_RELEASE
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
    date: '2009-11-27',
    comment: 'A video about Card-Jitsu fire is now on display at the Dojo Courtyard'
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
    date: WATER_CELEBRATION_END,
    comment: 'A video about Card-Jitsu Water is now on display at the Dojo Courtyard'
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
    // green puffle + boiler room trigger
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
  },
  {
    room: 'dojo',
    fileId: 4180,
    date: DIG_OUT_DOJO_END,
    comment: 'The dojo has a great reopening'
  },
  {
    // first vectorized version of the Town, possibly from 2007
    // unknown how to document it
    room: 'town',
    fileId: 4854,
    date: PRE_CPIP_REWRITE_DATE
  },
  {
    // an unknown update which removed the ability to click on the couch
    room: 'coffee',
    fileId: 7,
    date: '2005-12-01'
  },
  {
    // room with UGC art
    room: 'book',
    fileId: 4857,
    date: '2010-10-23',
    comment: 'The Book Room now contains Penguin Art'
  },
  {
    // placeholder vectorized room, unknown date
    room: 'dance',
    fileId: 4859,
    date: PRE_CPIP_REWRITE_DATE
  },
  {
    room: 'dance',
    fileId: 4861,
    date: '2010-01-29',
    comment: 'The Dance Club now changes colors if a lot of monochrome penguins are present'
  },
  {
    room: 'lounge',
    date: THIN_ICE_RELEASE,
    comment: 'A new cabinet is in the Dance Lounge',
    fileId: 4862
  },
  {
    // unknown date, vectorized 07 rooms
    room: 'shop',
    date: PRE_CPIP_REWRITE_DATE,
    fileId: 5071
  },
  {
    room: 'forts',
    date: ROOM_REDRAWS,
    fileId: 4866,
    comment: 'The Snow Forts is redrawn'
  },
  {
    // unknown date, you can now walk to the audience in the rink
    // only evidence is after april fools party
    room: 'rink',
    date: '2006-04-01',
    fileId: 4867
  },
  {
    room: 'rink',
    date: '2006-08-11',
    fileId: 4868,
    comment: 'The Ice Rink now has score signs'
  },
  {
    // placeholder CPIP room
    room: 'town',
    date: CPIP_UPDATE,
    fileId: 2642
  },
  {
    // placeholder CPIP room
    room: 'forts',
    date: CPIP_UPDATE,
    fileId: 2643
  },
  {
    // placeholder CPIP room
    room: 'rink',
    date: CPIP_UPDATE,
    fileId: 2645
  },
  {
    // date of vectorization is unknown
    room: 'plaza',
    date: PRE_CPIP_REWRITE_DATE,
    fileId: 4872
  },
  {
    room: 'plaza',
    date: '2007-01-26',
    fileId: 4873,
    comment: 'Tours are now present in the Plaza'
  },
  {
    // purple puffles release
    room: 'pet',
    date: '2006-08-25',
    fileId: 4902,
    comment: 'Purple Puffles are now in the Pet Shop'
  },
  {
    // the wiki mentions it as this date, seems like the date most rooms were redrawn?
    // dont know the source
    room: 'pet',
    date: ROOM_REDRAWS,
    fileId: 4903,
    comment: 'The Pet Shop is redrawn'
  },
  {
    room: 'pet',
    date: '2006-12-08',
    fileId: 4904,
    comment: 'Red Puffles are now in the Pet Shop'
  },
  {
    // NOTE: this date is a PLACEHOLDER! we don't know the exact date...
    room: 'pet',
    date: '2007-02-28',
    fileId: 4905,
    comment: 'The Pet Shop now has animations'
  },
  {
    room: 'pet',
    date: '2010-02-25',
    fileId: 4907,
    comment: 'White Puffles are now in the Pet Shop'
  },
  {
    // another september 22 redraw
    room: 'berg',
    date: ROOM_REDRAWS,
    fileId: 4909,
    comment: 'The Iceberg is redrawn'
  },
  {
    room: 'berg',
    date: '2008-02-08',
    fileId: 4947,
    comment: 'Construction of a new invention begins in the Iceberg'
  },
  {
    room: 'berg',
    date: '2008-02-15',
    comment: 'A poll is added to the Iceberg',
    fileId: 3955
  },
  {
    room: 'berg',
    date: AQUAGRABBER_RELEASE,
    fileId: 4910,
    comment: 'The Aqua Grabber\'s construction is finished'
  },
  {
    room: 'dock',
    date: ROOM_REDRAWS,
    fileId: 4911,
    comment: 'The Dock is redrawn'
  },
  {
    room: 'light',
    date: '2007-04-13',
    fileId: 4914,
    comment: 'A stage is now built in the Lighthouse'
  },
  {
    room: 'cave',
    date: SPORT_PARTY_END,
    fileId: 4916,
    comment: 'The pool becomes a part of the undeground after the Sports Party ends'
  },
  {
    room: 'mine',
    date: ROOM_REDRAWS,
    fileId: 4919,
    comment: 'The mine is redrawn'
  },
  {
    room: 'dojo',
    date: ROOM_REDRAWS,
    fileId: 4920,
    comment: 'The dojo is redrawn'
  },
  {
    room: 'dojo',
    date: CARD_JITSU_RELEASE,
    fileId: 4921,
    comment: 'The dojo now has the Card-Jitsu game'
  },
  {
    // this file we have has the white puffle, which I believe is only from the puffle party 2009
    room: 'dojoext',
    date: CARD_JITSU_RELEASE,
    fileId: 4097
  },
  {
    room: 'mtn',
    date: ROOM_REDRAWS,
    fileId: 4922,
    comment: 'The Ski Hill is redrawn'
  },
  {
    // ski village has the path to the beach now here
    room: 'village',
    date: SUMMER_PARTY_START,
    fileId: 4924
  },
  {
    room: 'village',
    date: ROOM_REDRAWS,
    fileId: 4925,
    comment: 'The Ski Village is redrawn'
  },
  {
    // ski lodge is accessible
    room: 'village',
    date: CHRISTMAS_2005_ENDS,
    fileId: 30
  },
  {
    room: 'lodge',
    fileId: 11,
    date: ICE_FISHING_RELEASE,
    comment: 'A door for Ice Fishing is added in the Ski Lodge'
  },
  {
    room: 'lodge',
    fileId: 4927,
    date: FIND_FOUR_RELEASE,
    comment: 'Find Four tables are added to the Ski Lodge'
  },
  {
    room: 'sport',
    fileId: 4864,
    date: SNOW_SPORT_RELEASE,
    comment: 'The Snow and Sports catalog is now available in the Sport Shop'
  },
  {
    // mancala was added at some random point I dont know
    room: 'agent',
    fileId: 4931,
    date: '2005-11-01'
  },
  {
    room: 'agent',
    fileId: 4930,
    date: '2006-02-11',
    comment: 'Mancala is removed from the HQ'
  },
  {
    room: 'agent',
    fileId: 4932,
    date: HQ_REDESIGN,
    comment: 'The HQ is redesigned'
  },
  {
    room: 'agent',
    fileId: 4933,
    date: SUMMER_PARTY_START,
    comment: 'More rooms are visible from the HQ'
  },
  {
    // placeholder HQ update for the PSA missions
    room: 'agent',
    fileId: 4934,
    date: MISSION_1_RELEASE
  },
  {
    room: 'beach',
    fileId: 4942,
    comment: 'Rockhopper lands in Club Penguin with a rowboat',
    date: '2008-01-23'
  },
  {
    room: 'beach',
    date: '2008-02-01',
    fileId: 4946,
    comment: 'Save The Migrator Project is set up at the Beach'
  },
  {
    room: 'beach',
    date: '2008-02-23',
    fileId: 4949,
    comment: 'Pieces of The Migrator show up at the Beach'
  },
  {
    room: 'beach',
    date: '2008-02-29',
    fileId: 4948,
    comment: 'More pieces show up at the Beach'
  },
  {
    room: 'beach',
    date: '2008-03-07',
    fileId: 4950,
    comment: 'Reconstruction of The Migrator begins'
  },
  {
    room: 'beach',
    // this date is a conjecture, don't know when it actually happened
    date: '2008-03-20',
    fileId: 4951,
    comment: 'Reconstruction of The Migrator progresses'
  },
  {
    room: 'beach',
    date: '2008-03-27',
    fileId: 4952,
    comment: 'Reconstruction of The Migrator progresses'
  },
  {
    room: 'beach',
    date: '2008-04-10',
    fileId: 4953,
    comment: 'The Migrator is cleaned up and a new device is at the Beach'
  },
  {
    // returning to normality
    room: 'beach',
    date: ROCKHOPPER_ARRIVAL_END,
    fileId: 3835
  },
  {
    room: 'beacon',
    date: JPA_RELEASE,
    fileId: 5009,
    comment: 'The launchpad construction in the Beacon is finished'
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
  },
  {
    room: 'dojoext',
    fileId: 4179,
    // not actual date, but we dont have a map for before the dojo was out yet, and
    // the dojo is inaccessible otherwise for the game CPIP-Dojo release
    date: CPIP_UPDATE
  },
  {
    room: 'stage',
    fileId: null,
    date: FIRST_STAGE_PLAY
  },
  {
    room: 'agentcom',
    fileId: 4936,
    date: AGENTCOM_RELEASE
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
    { date: CARD_JITSU_RELEASE, musicId: 21 }
  ]
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