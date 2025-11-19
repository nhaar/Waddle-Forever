import { Version } from "../routes/versions";
import { RoomName, RoomMap } from "./rooms";
import { Update } from "./updates";

type RoomOpening = {
  room: RoomName;
  fileRef: string | null;
  date: string;
  // file id of other rooms that are changing concurrently
  otherRooms?: RoomMap<string>;
  map?: string;
};

type RoomUpdate = {
  // file used in the update
  fileRef: string;
  date: string;
  /** If not supplied, this won't be in the timeline as an update */
  comment?: string;
};

export const ROOM_OPENINGS: RoomOpening[] = [
  {
    room: 'forts',
    fileRef: 'fix:ArtworkRoomsForts.swf',
    date: '2005-09-12',
    otherRooms: {
      town: 'archives:ArtworkRoomsTown10.swf',
      rink: 'archives:ArtworkRoomsRink10.swf',
    },
    map: 'archives:ArtworkMapsIsland3.swf'
  },
  {
    room: 'sport',
    fileRef: 'mammoth:artwork/rooms/sport11.swf',
    date: Update.SPORT_SHOP_RELEASE,
    otherRooms: {
      village: 'approximation:village_sport.swf'
    }
  },
  {
    room: 'mtn',
    fileRef: 'fix:Mtn1.swf',
    date: Update.MTN_RELEASE,
    otherRooms: {
      village: 'approximation:village_no_lodge.swf'
    }
  },
  {
    room: 'lodge',
    fileRef: 'archives:ArtworkRoomsLodge10.swf',
    date: '2005-12-22'
  },
  {
    room: 'pizza',
    fileRef: 'archives:ArtworkRoomsPizza12.swf',
    date: Update.PIZZA_PARLOR_OPENING_START
  },
  {
    room: 'plaza',
    fileRef: 'archives:ArtworkRoomsPlaza10.swf',
    date: Update.PIZZA_PARLOR_OPENING_START
  },
  {
    room: 'pet',
    fileRef: 'mammoth:artwork/rooms/pet11.swf',
    date: Update.PET_SHOP_RELEASE,
    otherRooms: {
      plaza: 'archives:ArtworkRoomsPlaza12.swf'
    }
  },
  {
    room: 'berg',
    fileRef: 'mammoth:artwork/rooms/berg10.swf',
    date: Update.ICEBERG_RELEASE,
    map: 'archives:ArtworkMapsIsland5.swf'
  },
  {
    // 2006 client boiler, the party vesion isn't archived
    room: 'boiler',
    fileRef: 'archives:ArtworkRoomsBoiler11.swf',
    date: Update.CAVE_OPENING_START
  },
  {
    room: 'boiler',
    fileRef: 'archives:ArtworkRoomsBoiler40.swf',
    // boiler room for the 2007 client
    date: Update.PRE_CPIP_REWRITE_DATE
  },
  {
    room: 'cave',
    fileRef: 'archives:ArtworkRoomsCave13.swf',
    date: Update.CAVE_OPENING_START
  },
  {
    room: 'mine',
    fileRef: 'archives:ArtworkRoomsMine13.swf',
    date: Update.CAVE_OPENING_START
  },
  {
    room: 'shack',
    fileRef: 'archives:ArtworkRoomsShack10.swf',
    date: Update.CAVE_OPENING_END,
    map: 'approximation:map_shack.swf'
  },
  {
    room: 'beach',
    fileRef: 'archives:ArtworkRoomsBeach12.swf',
    date: Update.SUMMER_PARTY_START
  },
  {
    room: 'dojoext',
    fileRef: 'archives:DojoExtGrandOpening2008.swf',
    // not actual date, but we dont have a map for before the dojo was out yet, and
    // the dojo is inaccessible otherwise for the game CPIP-Dojo release
    date: Update.DIG_OUT_DOJO_END
  },
  {
    room: 'stage',
    fileRef: null,
    date: Update.FIRST_STAGE_PLAY,
    map: 'archives:Map2007Plaza.swf'
  },
  {
    room: 'agentcom',
    fileRef: 'archives:RoomsAgentcomFormer.swf',
    date: Update.AGENTCOM_RELEASE,
    otherRooms: {
      // placeholder CPIP room
      agent: 'archives:RoomsAgent.swf'
    }
  },
  {
    room: 'beacon',
    fileRef: 'archives:ArtworkRoomsBeacon40.swf',
    date: Update.LIGHTHOUSE_PARTY_START
  },
  {
    room: 'light',
    fileRef: 'archives:ArtworkRoomsLight40.swf',
    date: Update.LIGHTHOUSE_PARTY_START
  },
  {
    room: 'dojofire',
    fileRef: 'slegacy:media/play/v2/content/global/rooms/dojofire.swf',
    date: Update.FIRE_CONST_START
  }
];

type MusicTimeline = [number, ...Array<{ date: Version; musicId: number; comment?: string; }>];

export const ROOM_MUSIC_TIMELINE: Partial<Record<RoomName, MusicTimeline>> = {
  'coffee': [1],
  'book': [1],
  'pizza': [20],
  'lounge': [0],
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
    { date: Update.HQ_REDESIGN, musicId: 7 }
  ],
  'agentcom': [
    7,
    { date: Update.EPF_RELEASE, musicId: 23 }
  ],
  'dojo': [
    0,
    { date: Update.DIG_OUT_DOJO_END, musicId: 21 }
  ],
  boxdimension: [264],
  'dojofire': [22],
  dojohide: [21],
  dojoext: [
    0,
    // TODO moving as a consequence?
    { date: Update.DIG_OUT_DOJO_END, musicId: 21 },
    { date: Update.CARD_JITSU_RELEASE, musicId: 0}
  ],
  dojowater: [24],
  boiler: [6],
  stage: [0]
};

type TemporaryRoomUpdate = Array<{
  date: Version,
  end: Version,
  fileRef: string;
  comment?: string;
  frame?: number;
}>;

export const TEMPORARY_ROOM_UPDATES: Partial<Record<RoomName, TemporaryRoomUpdate>> = {
  'plaza': [
    {
      date: Update.PLAZA_LAUNCHPAD_START,
      end: '2006-10-13',
      fileRef: 'archives:Plaza31.swf',
      comment: 'A construction begins at the Plaza',
      frame: 2
    },
    {
      date: '2008-09-05',
      end: Update.RUBY_DEBUT,
      fileRef: 'recreation:plaza_ruby_construction.swf',
      comment: 'A construction begins at the Plaza for the Stage'
    },
    {
      date: Update.PPA_10_END,
      end: Update.APRIL_FOOLS_10_END,
      fileRef: 'recreation:aprilfools2010_plaza.swf'
    }
  ],
  'town': [
    {
      date: '2006-09-28',
      end: Update.PLAZA_LAUNCHPAD_START,
      fileRef: 'archives:RoomsTown-LaunchPadConstruction.swf',
      comment: 'A construction begins at the Town'
    }
  ],
  'forts': [
    {
      // unknown end date
      date: '2008-04-17',
      end: '2008-04-21',
      fileRef: 'archives:ArtworkRoomsForts50.swf',
      comment: 'The Snow Forts clock breaks'
    },
    {
      // unknown start date
      date: '2006-10-24',
      end: '2006-10-27',
      fileRef: 'recreation:forts_broken_sign.swf',
      comment: 'The Snow Forts sign breaks'
    }
  ],
  'lodge': [
    {
      date: Update.CHRISTMAS_2008_END,
      end: Update.GINGERBREAD_PIN,
      fileRef: 'recreation:lodge_present_pin.swf'
    }
  ],
  'cove': [
    {
      date: Update.CPIP_UPDATE,
      end: '2008-07-18',
      fileRef: 'recreation:cove_cpip_firework_rocket_pin.swf'
    }
  ],
  'attic': [
    {
      date: Update.CHRISTMAS_2008_END,
      end: Update.GINGERBREAD_PIN,
      fileRef: 'recreation:attic_dec08.swf',
      comment: 'Snow is stored in the Attic'
    },
    {
      date: Update.TACO_PIN,
      end: Update.SNOW_SCULPTURE_09_START,
      fileRef: 'archives:WinterFiesta2009SkiLodge.swf',
      comment: 'The sign in the Attic is now bold'
    }
  ],
  'boiler': [
    {
      date: '2007-09-13',
      end: '2007-09-20',
      fileRef: 'recreation:boiler_100_newspapers.swf',
      comment: 'The Boiler Room is updated for the 100th newspaper'
    }
  ]
}
