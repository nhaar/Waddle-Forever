import { Version } from "../routes/versions";
import { RoomName, RoomMap } from "./rooms";
import { AGENTCOM_RELEASE, AQUAGRABBER_RELEASE, BETA_RELEASE, CARD_JITSU_RELEASE, CAVE_EXPEDITION_END, CAVE_OPENING_END, CAVE_OPENING_START, CHRISTMAS_2005_ENDS, COVE_OPENING_START, CPIP_UPDATE, DIG_OUT_DOJO_END, EARTH_DAY_2010_END, EARTH_DAY_2010_START, EARTHQUAKE, EPF_RELEASE, FIND_FOUR_RELEASE, FIRE_CELEBRATION_START, FIRST_STAGE_PLAY, GAME_UPGRADES, HQ_REDESIGN, ICE_FISHING_RELEASE, ICEBERG_RELEASE, JPA_RELEASE, LIGHTHOUSE_PARTY_START, MISSION_1_RELEASE, MODERN_AS3, MTN_RELEASE, MUSIC_JAM_08_START, PET_SHOP_RELEASE, PIZZA_PARLOR_OPENING_END, PIZZA_PARLOR_OPENING_START, PLAZA_LAUNCHPAD_START, PRE_CPIP_REWRITE_DATE, PUFFLE_ROUNDUP_RELEASE, ROCKHOPPER_ARRIVAL_END, ROOM_REDRAWS, SNOW_SPORT_RELEASE, SPORT_PARTY_END, SPORT_SHOP_RELEASE, SUMMER_PARTY_START, THIN_ICE_RELEASE, WATER_CELEBRATION_END, WATER_HUNT_END } from "./updates";

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
      date: MODERN_AS3
    },
    {
      // first vectorized version of the Town, possibly from 2007
      // unknown how to document it
      fileRef: 'archives:ArtworkRoomsTown40.swf',
      date: PRE_CPIP_REWRITE_DATE
    },
    {
      // placeholder CPIP room
      date: CPIP_UPDATE,
      fileRef: 'archives:RoomsTown.swf'
    }
  ],
  rink: [
    {
      fileRef: 'svanilla:media/play/v2/content/global/rooms/rink.swf',
      date: MODERN_AS3
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
    {
      // placeholder CPIP room
      date: CPIP_UPDATE,
      fileRef: 'archives:RoomsRink.swf'
    }
  ],
  village: [
    {
      fileRef: 'archives:RoomsVillage.swf',
      date: CPIP_UPDATE
    },
    {
      fileRef: 'archives:RoomsVillage_2.swf',
      date: EPF_RELEASE
    },
    {
      date: ROOM_REDRAWS,
      fileRef: 'archives:ArtworkRoomsVillage40.swf',
      comment: 'The Ski Village is redrawn'
    },
  ],
  forts: [
    {
      fileRef: 'fix:ArtworkRoomsForts3.swf',
      date: PUFFLE_ROUNDUP_RELEASE
    },
    {
      fileRef: 'svanilla:media/play/v2/content/global/rooms/forts.swf',
      date: MODERN_AS3
    },
    {
      date: ROOM_REDRAWS,
      fileRef: 'archives:ArtworkRoomsForts40.swf',
      comment: 'The Snow Forts is redrawn'
    },
    {
      // placeholder CPIP room
      date: CPIP_UPDATE,
      fileRef: 'archives:FortsWithIceRinkStadium.swf'
    }
  ],
  pizza: [
    {
      // placeholder CPIP room
      // the only SWF we have of CPIP before renovation
      fileRef: 'archives:RoomsPizza-January2010.swf',
      date: CPIP_UPDATE
    }
  ],
  plaza: [
    {
      fileRef: 'recreation:plaza_squidzoid_sign.swf',
      date: CPIP_UPDATE
    },
    {
      fileRef: 'svanilla:media/play/v2/content/global/rooms/plaza.swf',
      date: MODERN_AS3
    },
    {
      // date of vectorization is unknown
      date: PRE_CPIP_REWRITE_DATE,
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
      // placeholder CPIP room
      fileRef: 'archives:BookPrePenguinArt.swf',
      date: CPIP_UPDATE
    },
    {
      // room with UGC art
      fileRef: 'archives:BookWithPenguinArt.swf',
      date: '2010-10-23',
      comment: 'The Book Room now contains Penguin Art'
    }
  ],
  beach: [
    {
      fileRef: 'archives:RoomsBeach-2.swf',
      date: CPIP_UPDATE
    },
    {
      fileRef: 'archives:Beach45afterrockycrash.swf',
      comment: 'Rockhopper lands in Club Penguin with a rowboat',
      date: '2008-01-23'
    },
    {
      date: '2008-02-01',
      fileRef: 'archives:0403beach45.swf',
      comment: 'Save The Migrator Project is set up at the Beach'
    },
    {
      date: '2008-02-23',
      fileRef: 'archives:0223beach45.swf',
      comment: 'Pieces of The Migrator show up at the Beach'
    },
    {
      date: '2008-02-29',
      fileRef: 'archives:0229beach45.swf',
      comment: 'More pieces show up at the Beach'
    },
    {
      date: '2008-03-07',
      fileRef: 'archives:0307beach45.swf',
      comment: 'Reconstruction of The Migrator begins'
    },
    {
      // this date is a conjecture, don't know when it actually happened
      date: '2008-03-20',
      fileRef: 'archives:0320beach45.swf',
      comment: 'Reconstruction of The Migrator progresses'
    },
    {
      date: '2008-03-27',
      fileRef: 'archives:0327beach45.swf',
      comment: 'Reconstruction of The Migrator progresses'
    },
    {
      date: '2008-04-10',
      fileRef: 'archives:0410beach45.swf',
      comment: 'The Migrator is cleaned up and a new device is at the Beach'
    }
  ],
  mtn: [
    {
      // it is unknown when the mountain was renovated to have ski animations
      fileRef: 'mammoth:artwork/rooms/mtn10.swf',
      date: '2006-01-01'
    },
    {
      // placeholder CPIP room
      fileRef: 'recreation:mtn_cpip_start.swf',
      date: CPIP_UPDATE
    },
    {
      fileRef: 'archives:RoomsMtn-January2010.swf',
      date: GAME_UPGRADES
    },
    {
      date: ROOM_REDRAWS,
      fileRef: 'archives:ArtworkRoomsMtn40.swf',
      comment: 'The Ski Hill is redrawn'
    },
  ],
  berg: [
    {
      // placeholder CPIP room
      fileRef: 'archives:RoomsBerg.swf',
      date: CPIP_UPDATE
    },
    {
      // another september 22 redraw
      date: ROOM_REDRAWS,
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
      date: AQUAGRABBER_RELEASE,
      fileRef: 'archives:RoomsBerg-Feb2008.swf',
      comment: 'The Aqua Grabber\'s construction is finished'
    }
  ],
  beacon: [
    {
      // placeholder CPIP room
      fileRef: 'archives:PreAugust2011Beacon.swf',
      date: CPIP_UPDATE
    },
    {
      date: JPA_RELEASE,
      fileRef: 'archives:ArtworkRoomsBeacon41.swf',
      comment: 'The launchpad construction in the Beacon is finished'
    }
  ],
  boxdimension: [
    {
      // placeholder CPIP room
      // post island adventure update
      fileRef: 'archives:RoomsBoxdimension-January2010.swf',
      date: CPIP_UPDATE
    },
    {
      fileRef: 'slegacy:media/play/v2/content/global/rooms/boxdimension.swf',
      date: '2010-02-11',
      comment: 'The plants disappear from the Box Dimension'
    }
  ],
  cave: [
    {
      // placeholder CPIP room
      fileRef: 'archives:RoomsCave.swf',
      date: CPIP_UPDATE
    }
  ],
  cove: [
    {
      // recreation of proper cove room here
      fileRef: 'recreation:cpip_cove_precatalog.swf',
      date: CPIP_UPDATE
    },
    {
      fileRef: 'archives:RoomsCove.swf',
      date: GAME_UPGRADES
    },
    {
      // placeholder AS3 room
      fileRef: 'svanilla:media/play/v2/content/global/rooms/cove.swf',
      date: MODERN_AS3
    },
  ],
  dance: [
    {
      fileRef: 'recreation:dance_cpip_premusicjam.swf',
      date: CPIP_UPDATE
    },
    {
      // placeholder vectorized room, unknown date
      fileRef: 'archives:ArtworkRoomsDance50.swf',
      date: PRE_CPIP_REWRITE_DATE
    },
    {
      fileRef: 'archives:Dance.swf',
      date: '2010-01-29',
      comment: 'The Dance Club now changes colors if a lot of monochrome penguins are present'
    }
  ],
  dock: [
    {
      // pre catalog
      fileRef: 'recreation:dock_cpip_precatalog.swf',
      date: CPIP_UPDATE
    },
    {
      fileRef: 'archives:RoomsDock_1.swf',
      date: GAME_UPGRADES
    },
    {
      // placeholder AS3 room
      fileRef: 'svanilla:media/play/v2/content/global/rooms/dock.swf',
      date: MODERN_AS3
    },
    {
      date: ROOM_REDRAWS,
      fileRef: 'archives:ArtworkRoomsDock40.swf',
      comment: 'The Dock is redrawn'
    }
  ],
  light: [
    {
      fileRef: 'recreation:light_cpip_start.swf',
      date: CPIP_UPDATE
    },
    {
      date: '2007-04-13',
      fileRef: 'archives:Lighthouse2007.swf',
      comment: 'A stage is now built in the Lighthouse'
    },
  ],
  stage: [
    {
      fileRef: 'archives:RoomsStage-October2009.swf',
      date: CPIP_UPDATE
    }
  ],
  lodge: [
    {
      // placeholder CPIP room
      fileRef: 'recreation:lodge_cpip_start.swf',
      date: CPIP_UPDATE
    },
    {
      fileRef: 'archives:RoomsLodge.swf',
      date: GAME_UPGRADES  
    },
    {
      fileRef: 'mammoth:artwork/rooms/lodge11.swf',
      date: ICE_FISHING_RELEASE,
      comment: 'A door for Ice Fishing is added in the Ski Lodge'
    },
    {
      fileRef: 'archives:ArtworkRoomsLodge14.swf',
      date: FIND_FOUR_RELEASE,
      comment: 'Find Four tables are added to the Ski Lodge'
    }
  ],
  pet: [
    {
      fileRef: 'recreation:pet_pre_white.swf',
      date: CPIP_UPDATE
    },
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
      date: ROOM_REDRAWS,
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
      // placeholder CPIP room
      fileRef: 'archives:RoomsShop.swf',
      date: CPIP_UPDATE
    },
    {
      // unknown date, vectorized 07 rooms
      date: PRE_CPIP_REWRITE_DATE,
      fileRef: 'archives:ArtworkRoomsShop40.swf'
    }
  ],
  coffee: [
    {
      // the first CPIP room we have
      fileRef: 'archives:RoomsCoffee1.swf',
      date: CPIP_UPDATE
    },
    {
      // an unknown update which removed the ability to click on the couch
      fileRef: 'mammoth:artwork/rooms/coffee11.swf',
      date: '2005-12-01'
    }
  ],
  lounge: [
    {
      // placeholder CPIP room
      fileRef: 'archives:RoomsLounge.swf',
      date: CPIP_UPDATE
    },
    {
      date: THIN_ICE_RELEASE,
      comment: 'A new cabinet is in the Dance Lounge',
      fileRef: 'archives:ArtworkRoomsLounge40.swf'
    }
  ],
  boiler: [
    {
      // placeholder CPIP room
      fileRef: 'archives:RoomsBoiler-January2010.swf',
      date: CPIP_UPDATE
    }
  ],
  attic: [
    {
      // placeholder start room
      fileRef: 'archives:ArtworkRoomsAttic12.swf',
      date: BETA_RELEASE
    },
    {
      // placeholder CPIP room
      fileRef: 'slegacy:media/play/v2/content/global/rooms/attic.swf',
      date: CPIP_UPDATE
    }
  ],
  sport: [
    {
      // placeholder CPIP room
      fileRef: 'archives:RoomsSport_2.swf',
      date: CPIP_UPDATE
    },
    {
      fileRef: 'archives:RoomsSport.swf',
      date: SNOW_SPORT_RELEASE,
      comment: 'The Snow and Sports catalog is now available in the Sport Shop'
    }
  ],
  lake: [
    {
      // placeholder CPIP room
      fileRef: 'slegacy:media/play/v2/content/global/rooms/lake.swf',
      date: CPIP_UPDATE
    }
  ],
  cavemine: [
    {
      // placeholder CPIP room
      fileRef: 'slegacy:media/play/v2/content/global/rooms/cavemine.swf',
      date: CPIP_UPDATE
    }
  ],
  dojo: [
    {
      fileRef: 'recreation:dojo_cpip_start.swf',
      date: CPIP_UPDATE
    },
    {
      fileRef: 'slegacy:media/play/v2/content/global/rooms/dojo.swf',
      date: CARD_JITSU_RELEASE
    },
    {
      date: ROOM_REDRAWS,
      fileRef: 'archives:ArtworkRoomsDojo41.swf',
      comment: 'Many rooms are redrawn'
    },
    {
      date: CARD_JITSU_RELEASE,
      fileRef: 'archives:RoomsDojo.swf',
      comment: 'The dojo now has the Card-Jitsu game'
    }
  ],
  dojofire: [
    {
      // placeholder CPIP room
      fileRef: 'slegacy:media/play/v2/content/global/rooms/dojofire.swf',
      date: CPIP_UPDATE
    },
  ],
  dojohide: [
    {
      // placeholder CPIP room
      fileRef: 'archives:RoomsDojohide-1.swf',
      date: CPIP_UPDATE
    },
    {
      fileRef: 'archives:RoomsDojohide_2.swf',
      date: FIRE_CELEBRATION_START
    },
    {
      fileRef: 'archives:RoomsDojohide_3.swf',
      date: WATER_HUNT_END
    }
  ],
  dojowater: [
    {
      // placeholder CPIP room
      fileRef: 'slegacy:media/play/v2/content/global/rooms/dojowater.swf',
      date: CPIP_UPDATE
    }
  ],
  shiphold: [
    {
      // placeholder CPIP room
      fileRef: 'slegacy:media/play/v2/content/global/rooms/shiphold.swf',
      date: CPIP_UPDATE
    }
  ],
  shipnest: [
    {
      // placeholder CPIP room
      fileRef: 'slegacy:media/play/v2/content/global/rooms/shipnest.swf',
      date: CPIP_UPDATE
    }
  ],
  shipquarters: [
    {
      // placeholder CPIP room
      fileRef: 'slegacy:media/play/v2/content/global/rooms/shipquarters.swf',
      date: CPIP_UPDATE
    }
  ],
  agent: [
    {
      // proper recreation of what it was like when CPIP dropped
      fileRef: 'recreation:agent_2008_apr_cpip.swf',
      date: CPIP_UPDATE
    },
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
      date: HQ_REDESIGN,
      comment: 'The HQ is redesigned'
    },
    {
      // placeholder HQ update for the PSA missions
      fileRef: 'archives:ArtworkRoomsAgent40.swf',
      date: MISSION_1_RELEASE
    },
    {
      fileRef: 'recreation:agent_2008_apr_pre_cpip.swf',
      date: '2008-04-21'
    }
  ],
  agentcom: [
    {
      date: EPF_RELEASE,
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
      fileRef: 'archives:RoomsMine_1.swf',
      date: CPIP_UPDATE
    },
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
      fileRef: 'archives:RoomsShack.swf',
      date: CPIP_UPDATE
    },
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
      date: MODERN_AS3
    }
  ],
  forest: [
    {
      fileRef: 'archives:RoomsForest.swf',
      date: CPIP_UPDATE
    },
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
      date: MODERN_AS3
    }
  ],
  ship: [
    {
      fileRef: 'archives:RoomsShip.swf',
      date: CPIP_UPDATE
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
      date: MODERN_AS3
    },
    {
      // this file we have has the white puffle, which I believe is only from the puffle party 2009
      date: CARD_JITSU_RELEASE,
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
    date: SPORT_SHOP_RELEASE,
    otherRooms: {
      village: 'approximation:village_sport.swf'
    }
  },
  {
    room: 'mtn',
    fileRef: 'fix:Mtn1.swf',
    date: MTN_RELEASE,
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
    date: PIZZA_PARLOR_OPENING_START
  },
  {
    room: 'plaza',
    fileRef: 'archives:ArtworkRoomsPlaza10.swf',
    date: PIZZA_PARLOR_OPENING_START
  },
  {
    room: 'pet',
    fileRef: 'mammoth:artwork/rooms/pet11.swf',
    date: PET_SHOP_RELEASE,
    otherRooms: {
      plaza: 'archives:ArtworkRoomsPlaza12.swf'
    }
  },
  {
    room: 'berg',
    fileRef: 'mammoth:artwork/rooms/berg10.swf',
    date: ICEBERG_RELEASE,
    map: 'archives:ArtworkMapsIsland5.swf'
  },
  {
    // 2006 client boiler, the party vesion isn't archived
    room: 'boiler',
    fileRef: 'archives:ArtworkRoomsBoiler11.swf',
    date: CAVE_OPENING_START
  },
  {
    room: 'boiler',
    fileRef: 'archives:ArtworkRoomsBoiler40.swf',
    // boiler room for the 2007 client
    date: PRE_CPIP_REWRITE_DATE
  },
  {
    room: 'cave',
    fileRef: 'archives:ArtworkRoomsCave13.swf',
    date: CAVE_OPENING_START
  },
  {
    room: 'mine',
    fileRef: 'archives:ArtworkRoomsMine13.swf',
    date: CAVE_OPENING_START
  },
  {
    room: 'shack',
    fileRef: 'archives:ArtworkRoomsShack10.swf',
    date: CAVE_OPENING_END
  },
  {
    room: 'beach',
    fileRef: 'archives:ArtworkRoomsBeach12.swf',
    date: SUMMER_PARTY_START
  },
  {
    room: 'forest',
    fileRef: 'archives:RoomsForest-CoveOpeningPartyPre_1.swf',
    // this is the construction, it is technically from May 15 but we dont have
    // the map hunt that allows you to get to the forest otherwise
    date: COVE_OPENING_START
  },
  {
    // from april fools 08, unfortunately it is the only
    // pre cpip cove SWF that we have
    room: 'cove',
    fileRef: 'archives:ArtworkRooms0328Cove43.swf',
    date: COVE_OPENING_START
  },
  {
    room: 'dojoext',
    fileRef: 'archives:DojoExtGrandOpening2008.swf',
    // not actual date, but we dont have a map for before the dojo was out yet, and
    // the dojo is inaccessible otherwise for the game CPIP-Dojo release
    date: DIG_OUT_DOJO_END
  },
  {
    room: 'stage',
    fileRef: null,
    date: FIRST_STAGE_PLAY
  },
  {
    room: 'agentcom',
    fileRef: 'archives:RoomsAgentcomFormer.swf',
    date: AGENTCOM_RELEASE,
    otherRooms: {
      // placeholder CPIP room
      agent: 'archives:RoomsAgent.swf'
    }
  },
  {
    room: 'beacon',
    fileRef: 'archives:ArtworkRoomsBeacon40.swf',
    date: LIGHTHOUSE_PARTY_START
  }
];

type MusicTimeline = [number, ...Array<{ date: Version; musicId: number; comment?: string; }>];

export const ROOM_MUSIC_TIMELINE: Partial<Record<RoomName, MusicTimeline>> = {
  'coffee': [1],
  'book': [1],
  'pizza': [20],
  'lounge': [0, {
    // no idea on the date
    date: CPIP_UPDATE,
    musicId: 6
  }],
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
    0,
    // TODO moving as a consequence?
    { date: DIG_OUT_DOJO_END, musicId: 21 },
    { date: CARD_JITSU_RELEASE, musicId: 0}
  ],
  dojowater: [24],
  boiler: [6],
  stage: [
    0,
    // placeholder CPIP play
    { date: CPIP_UPDATE, musicId: 32 }
  ]
};

type TemporaryRoomUpdate = Array<{
  date: Version,
  end: Version,
  fileRef: string;
  comment?: string;
  frame?: number;
}>;

export const TEMPORARY_ROOM_UPDATES: Partial<Record<RoomName, TemporaryRoomUpdate>> = {
  'dance': [
    {
      date: EARTHQUAKE,
      // no ide when this ended
      end: '2008-06-24',
      fileRef: 'archives:RoomsDance-Earthquake2008.swf'
    }
  ],
  'plaza': [
    {
      date: PLAZA_LAUNCHPAD_START,
      end: '2006-10-13',
      fileRef: 'archives:Plaza31.swf',
      comment: 'A construction begins at the Plaza',
      frame: 2
    }
  ],
  'town': [
    {
      date: '2006-09-28',
      end: PLAZA_LAUNCHPAD_START,
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
  ]
}