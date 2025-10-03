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

export const ROOM_UPDATES: RoomMap<RoomUpdate[]> = {
  town: [
    {
      fileRef: 'svanilla:media/play/v2/content/global/rooms/town.swf',
      date: Update.MODERN_AS3
    },
    {
      // first vectorized version of the Town, possibly from 2007
      // unknown how to document it
      fileRef: 'archives:ArtworkRoomsTown40.swf',
      date: Update.PRE_CPIP_REWRITE_DATE
    },
  ],
  rink: [
    {
      fileRef: 'svanilla:media/play/v2/content/global/rooms/rink.swf',
      date: Update.MODERN_AS3
    },
    {
      // unknown date, you can now walk to the audience in the rink
      // only evidence is after april fools party
      // the file is also seemingly a debug file
      date: '2006-04-01',
      fileRef: 'fix:ArtworkRoomsRink12.swf'
    },
    {
      date: '2006-08-11',
      fileRef: 'archives:ArtworkRoomsRink22.swf',
      comment: 'The Ice Rink now has score signs'
    },
  ],
  village: [
    {
      fileRef: 'archives:RoomsVillage_2.swf',
      date: Update.EPF_RELEASE
    },
    {
      date: Update.ROOM_REDRAWS,
      fileRef: 'archives:ArtworkRoomsVillage40.swf',
      comment: 'The Ski Village is redrawn'
    },
  ],
  forts: [
    {
      fileRef: 'svanilla:media/play/v2/content/global/rooms/forts.swf',
      date: Update.MODERN_AS3
    },
    {
      date: Update.ROOM_REDRAWS,
      fileRef: 'archives:ArtworkRoomsForts40.swf',
      comment: 'The Snow Forts is redrawn'
    }
  ],
  plaza: [
    {
      fileRef: 'svanilla:media/play/v2/content/global/rooms/plaza.swf',
      date: Update.MODERN_AS3
    },
    {
      // date of vectorization is unknown
      date: Update.PRE_CPIP_REWRITE_DATE,
      fileRef: 'archives:ArtworkRoomsPlaza40.swf'
    },
    {
      date: '2007-01-26',
      fileRef: 'archives:ArtworkRoomsPlaza44.swf',
      comment: 'Tours are now present in the Plaza'
    }
  ],
  book: [
    {
      date: '2006-##-##',
      fileRef: 'archives:ArtworkRoomsBook11.swf',
      // comment: 'The book room was updated to have a new Mancala board'
    },
    {
      // room with UGC art
      fileRef: 'archives:BookWithPenguinArt.swf',
      date: '2010-10-23',
      comment: 'The Book Room now contains Penguin Art'
    }
  ],
  mtn: [
    {
      // it is unknown when the mountain was renovated to have ski animations
      fileRef: 'mammoth:artwork/rooms/mtn10.swf',
      date: '2006-01-01'
    },
    {
      fileRef: 'archives:RoomsMtn-January2010.swf',
      date: Update.GAME_UPGRADES
    },
    {
      date: Update.ROOM_REDRAWS,
      fileRef: 'archives:ArtworkRoomsMtn40.swf',
      comment: 'The Ski Hill is redrawn'
    },
  ],
  berg: [
    {
      // another september 22 redraw
      date: Update.ROOM_REDRAWS,
      fileRef: 'archives:ArtworkRoomsBerg40.swf',
      comment: 'The Iceberg is redrawn'
    },
    {
      date: '2008-02-08',
      fileRef: 'archives:Berg401.swf',
      comment: 'Construction of a new invention begins in the Iceberg'
    },
    {
      date: '2008-02-15',
      comment: 'A poll is added to the Iceberg',
      fileRef: 'archives:Rooms0215Berg40.swf'
    },
    {
      date: Update.AQUAGRABBER_RELEASE,
      fileRef: 'archives:RoomsBerg-Feb2008.swf',
      comment: 'The Aqua Grabber\'s construction is finished'
    }
  ],
  beacon: [
    {
      date: Update.JPA_RELEASE,
      fileRef: 'archives:ArtworkRoomsBeacon41.swf',
      comment: 'The launchpad construction in the Beacon is finished'
    }
  ],
  boxdimension: [
    {
      fileRef: 'slegacy:media/play/v2/content/global/rooms/boxdimension.swf',
      date: '2010-02-11',
      comment: 'The plants disappear from the Box Dimension'
    }
  ],
  cove: [
    {
      fileRef: 'archives:RoomsCove.swf',
      date: Update.GAME_UPGRADES
    },
    {
      // placeholder AS3 room
      fileRef: 'svanilla:media/play/v2/content/global/rooms/cove.swf',
      date: Update.MODERN_AS3
    },
  ],
  dance: [
    {
      // placeholder vectorized room, unknown date
      fileRef: 'archives:ArtworkRoomsDance50.swf',
      date: Update.PRE_CPIP_REWRITE_DATE
    },
    {
      fileRef: 'recreation:dance_cpip_postmusicjam2.swf',
      date: '2008-08-15',
      comment: 'DJ3K is redesigned in the Dance Club'
    },
    {
      fileRef: 'archives:Dance.swf',
      date: '2010-01-29',
      comment: 'The Dance Club now changes colors if a lot of monochrome penguins are present'
    }
  ],
  dock: [
    {
      fileRef: 'archives:RoomsDock_1.swf',
      date: Update.GAME_UPGRADES
    },
    {
      // placeholder AS3 room
      fileRef: 'svanilla:media/play/v2/content/global/rooms/dock.swf',
      date: Update.MODERN_AS3
    },
    {
      date: Update.ROOM_REDRAWS,
      fileRef: 'archives:ArtworkRoomsDock40.swf',
      comment: 'The Dock is redrawn'
    }
  ],
  light: [
    {
      date: '2007-04-13',
      fileRef: 'archives:Lighthouse2007.swf',
      comment: 'A stage is now built in the Lighthouse'
    },
  ],
  lodge: [
    {
      fileRef: 'archives:RoomsLodge.swf',
      date: Update.GAME_UPGRADES  
    },
    {
      fileRef: 'archives:ArtworkRoomsLodge14.swf',
      date: Update.FIND_FOUR_RELEASE,
      comment: 'Find Four tables are added to the Ski Lodge'
    }
  ],
  pet: [
    {
      // white puffle release
      fileRef: 'archives:RoomsPet_4.swf',
      date: '2009-03-06',
      comment: 'White puffles are available in the Pet Shop'
    },
    {
      // purple puffles release
      date: '2006-08-25',
      fileRef: 'archives:ArtworkRoomsPet12.swf',
      comment: 'Purple Puffles are now in the Pet Shop'
    },
    {
      // the wiki mentions it as this date, seems like the date most rooms were redrawn?
      // dont know the source
      date: Update.ROOM_REDRAWS,
      fileRef: 'archives:ArtworkRoomsPet40.swf',
      comment: 'The Pet Shop is redrawn'
    },
    {
      date: '2006-12-08',
      fileRef: 'archives:ArtworkRoomsPet43.swf',
      comment: 'Red Puffles are now in the Pet Shop'
    },
    {
      // NOTE: this date is a PLACEHOLDER! we don't know the exact date...
      date: '2007-02-28',
      fileRef: 'archives:ArtworkRoomsPet44.swf',
      comment: 'The Pet Shop now has animations'
    },
    {
      date: '2010-02-25',
      fileRef: 'archives:RoomsPet-Early2011.swf',
      comment: 'White Puffles are now in the Pet Shop'
    },
  ],
  shop: [
    {
      // unknown date, vectorized 07 rooms
      date: Update.PRE_CPIP_REWRITE_DATE,
      fileRef: 'archives:ArtworkRoomsShop40.swf'
    }
  ],
  coffee: [
    {
      // an unknown update which removed the ability to click on the couch
      fileRef: 'mammoth:artwork/rooms/coffee11.swf',
      date: '2005-12-01'
    }
  ],
  attic: [
    {
      // placeholder start room
      fileRef: 'archives:ArtworkRoomsAttic12.swf',
      date: Update.BETA_RELEASE
    },
  ],
  sport: [
    {
      fileRef: 'archives:RoomsSport.swf',
      date: Update.SNOW_SPORT_RELEASE,
      comment: 'The Snow and Sports catalog is now available in the Sport Shop'
    }
  ],
  dojo: [
    {
      fileRef: 'slegacy:media/play/v2/content/global/rooms/dojo.swf',
      date: Update.CARD_JITSU_RELEASE
    },
    {
      date: Update.ROOM_REDRAWS,
      fileRef: 'archives:ArtworkRoomsDojo41.swf',
      comment: 'Many rooms are redrawn'
    },
    {
      date: Update.CARD_JITSU_RELEASE,
      fileRef: 'archives:RoomsDojo.swf',
      comment: 'The dojo now has the Card-Jitsu game'
    }
  ],
  dojohide: [
    {
      // placeholder CPIP room
      fileRef: 'archives:RoomsDojohide-1.swf',
      date: Update.CARD_JITSU_RELEASE
    },
    {
      fileRef: 'archives:RoomsDojohide_2.swf',
      date: Update.FIRE_CELEBRATION_START
    },
    {
      fileRef: 'archives:RoomsDojohide_3.swf',
      date: Update.WATER_HUNT_END
    }
  ],
  dojowater: [
    {
      // placeholder CPIP room
      fileRef: 'slegacy:media/play/v2/content/global/rooms/dojowater.swf',
      date: Update.WATER_HUNT_END
    }
  ],
  agent: [
    // first time stadium was added, seemingly
    {
      fileRef: 'recreation:agent_2008_nov.swf',
      date: '2008-11-18'
    },
    {
      // mancala was added at some random point I dont know
      fileRef: 'fix:ArtworkRoomsAgent3.swf',
      date: '2005-11-01'
    },
    {
      fileRef: 'archives:ArtworkRoomsAgent10.swf',
      date: '2006-02-11',
      comment: 'Mancala is removed from the HQ'
    },
    {
      fileRef: 'archives:ArtworkRoomsAgent11.swf',
      date: Update.HQ_REDESIGN,
      comment: 'The HQ is redesigned'
    },
    {
      // placeholder HQ update for the PSA missions
      fileRef: 'archives:ArtworkRoomsAgent40.swf',
      date: Update.MISSION_1_RELEASE
    },
    {
      fileRef: 'recreation:agent_2008_apr_pre_cpip.swf',
      date: '2008-04-21'
    }
  ],
  agentcom: [
    {
      date: Update.EPF_RELEASE,
      fileRef: 'archives:RoomsAgentcom-May2010.swf',
      comment: 'The EPF Command Room is under construction'
    },
    {
      date: '2010-06-03',
      fileRef: 'recreation:agentcom_nofieldops1.swf',
      comment: 'Only the VR Room remains under construction'
    },
    {
      date: '2010-06-10',
      fileRef: 'recreation:agentcom_nofieldops2.swf',
      comment: 'The VR Room\'s construction is finished'
    },
    {
      date: '2010-06-15',
      fileRef: 'archives:RoomsAgentcom-June2010_3.swf',
      comment: 'Field Ops are made available'
    }
  ],
  mine: [
    {
      fileRef: 'archives:RoomsMine-Rockslide1.swf',
      date: '2010-01-08'
    },
    {
      fileRef: 'archives:RoomsMine-Rockslide2.swf',
      date: '2010-01-15'
    },
    {
      fileRef: 'archives:RoomsMine_2.swf',
      date: '2010-03-15'
    }
  ],
  shack: [
    {
      fileRef: 'archives:RoomsShack-July2010.swf',
      date: '2010-07-29'
    },
    {
      fileRef: 'archives:RoomsShack-LateAugust2010.swf',
      date: '2010-08-26'
    },
    {
      fileRef: 'archives:RoomsShack-Early2011.swf',
      date: '2010-09-30'
    },
    {
      fileRef: 'svanilla:media/play/v2/content/global/rooms/shack.swf',
      date: Update.MODERN_AS3
    }
  ],
  forest: [
    {
      fileRef: 'archives:RoomsForest_3.swf',
      date: '2010-06-17'
    },
    {
      fileRef: 'archives:RoomsForest-CoveOpeningPartyPre_2.swf',
      date: '2007-05-29',
      comment: 'As the Cove Opening party ends, the whistles remain in the Forest'
    },
    {
      fileRef: 'slippers07:media/artwork/rooms/forest.swf',
      date: '2007-06-01',
      comment: 'The whistles are removed from the Forest'
    },
    {
      fileRef: 'svanilla:media/play/v2/content/global/rooms/forest.swf',
      date: Update.MODERN_AS3
    }
  ],
  dojoext: [
    {
      fileRef: 'archives:RoomsDojoext_2.swf',
      date: '2009-11-27',
      comment: 'A video about Card-Jitsu fire is now on display at the Dojo Courtyard'
    },
    {
      fileRef: 'svanilla:media/play/v2/content/global/rooms/dojoext.swf',
      date: Update.MODERN_AS3
    },
    {
      // this file we have has the white puffle, which I believe is only from the puffle party 2009
      date: Update.CARD_JITSU_RELEASE,
      fileRef: 'archives:RoomsDojoext2008.swf'
    },
  ]
};

export const ROOM_OPENINGS: RoomOpening[] = [
  {
    room: 'forts',
    fileRef: 'approximation:forts_release.swf',
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
    date: Update.CAVE_OPENING_END
  },
  {
    room: 'beach',
    fileRef: 'archives:ArtworkRoomsBeach12.swf',
    date: Update.SUMMER_PARTY_START
  },
  {
    room: 'forest',
    fileRef: 'archives:RoomsForest-CoveOpeningPartyPre_1.swf',
    // this is the construction, it is technically from May 15 but we dont have
    // the map hunt that allows you to get to the forest otherwise
    date: Update.COVE_OPENING_START
  },
  {
    // from april fools 08, unfortunately it is the only
    // pre cpip cove SWF that we have
    room: 'cove',
    fileRef: 'recreation:cove_after_cove_opening.swf',
    date: Update.COVE_OPENING_START
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
    date: Update.FIRST_STAGE_PLAY
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
    }
  ],
  'lodge': [
    {
      date: Update.CHRISTMAS_2008_END,
      end: Update.GINGERBREAD_PIN,
      fileRef: 'recreation:lodge_present_pin.swf'
    }
  ]
}