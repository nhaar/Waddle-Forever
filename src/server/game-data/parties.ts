import { Version } from "../routes/versions";
import { MigratorVisit, ComplexTemporaryUpdateTimeline } from ".";
import { FileRef } from "./files";
import { RoomName } from "./rooms";
import { Update } from "./updates";
import { WaddleRoomInfo } from "../game-logic/waddles";

// room name -> file Id
export type RoomChanges = Partial<Record<RoomName, FileRef>>;

export type GlobalHuntCrumbs = {
  member: boolean;
  reward: number;
}

type Startscreens = Array<FileRef | [string, FileRef]>;

export type LocalHuntCrumbs = {
  en: {
    loading: string;
    title: string;
    start: string;
    itemsFound: string;
    itemsFoundPlural: string;
    claim: string;
    continue: string;
    clues: [ string, string, string, string, string, string, string, string ];
  }
}


export type HuntCrumbs = {
  global: GlobalHuntCrumbs;
  lang: LocalHuntCrumbs;
  icon: FileRef;
};

type Language = 'en';

export type LocalChanges = Record<string, Partial<Record<Language, FileRef | CrumbIndicator>>>;

/** First element is file id used, then a list of all the crumbs that point to this path */
export type CrumbIndicator = [FileRef, ...string[]];

export type IslandChanges = {
  roomChanges?: RoomChanges;
  // a map of a path inside play/v2/content/local eg en/catalogues/party.swf mapping to a file
  // inside a map of each language
  localChanges?: LocalChanges;
  // maps route inside play/v2/global to either file Id or tuple [global_path name, file Id]
  globalChanges?: Record<string, FileRef | CrumbIndicator>

  roomFrames?: Partial<Record<RoomName, number>>;

  // route -> fileId
  generalChanges?: Record<string, FileRef>;

  roomComment?: string;

  map?: FileRef;

  music?: Partial<Record<RoomName, number>>;

  /** Price updates */
  prices?: Partial<Record<number, number>>;
  furniturePrices?: Partial<Record<number, number>>;

  roomMemberStatus?: Partial<Record<RoomName, boolean>>;

  activeMigrator?: MigratorVisit;

  /** A list of all backgrounds used for the startscreen. Each element bust be either a file, or a file and the exact name the startscreen uses for it */
  startscreens?: Startscreens;

  /** Scavenger Hunt icon is loaded by the dependency, must be specified */
  scavengerHunt2010?: {
    iconFileId: FileRef;
    // if not supplied, will use a placeholder one
    iconFilePath?: string;
  };

  scavengerHunt2011?: HuntCrumbs

  // TODO maybe also supplying the ID if we know
  // otherwise default egg id to 1
  /**
   * For a scavenger hunt in the 2007-2008 client,
   * writing what the file number of the egg file is
   * */
  scavengerHunt2007?: FileRef;

  /** If used the CPIP fair icon and its info */
  fairCpip?: {
    // exact ID
    iconFileId: FileRef;
    // UI id might be required in the future if we find different ones
    infoFile: FileRef;
  };

  mapNote?: FileRef;

  /** For pre-cpip, if updates the version of the igloo SWF */
  iglooVersion?: number;

  newWaddleRooms?: WaddleRoomInfo[];

  construction?: Construction;
}

export type Party = IslandChanges & {
  name?: string;
  /** If true, then this will not be labeled a party in the timeline */
  event?: true;

  // Overriding the default placeholder message for a party start
  // with a custom one
  startComment?: string;
  endComment?: string;

  updates?: Array<{
    comment?: string;
    date: string;
  } & IslandChanges>;
};

type Construction = {
  date: string;
  changes: RoomChanges;
  startscreens?: Startscreens;

  localChanges?: LocalChanges;

  comment?: string;

  updates?: Array<{
    date: Version;
    changes: RoomChanges;
    comment: string;
  }>;
};

export const PARTIES: ComplexTemporaryUpdateTimeline<Party> = [
  {
    name: 'New Year\'s Day 2010',
    startComment: 'New Year\'s Fireworks appear on the island',
    endComment: 'The New Year\'s celebration ends',
    date: Update.NEW_YEARS_2010_UPDATE,
    end: '2010-01-04',
    roomChanges: {
      mtn: 'archives:2010newyearfireworksskihill.swf',
      berg: 'archives:2010newyearfireworksiceberg.swf'
    }
  },
  {
    name: 'Cave Expedition',
    date: '2010-01-22',
    end: Update.CAVE_EXPEDITION_END,
    endComment: 'The Cave Expedition ends and the cave mine is temporarily closed',
    roomChanges: {
      'mine': 'archives:RoomsMine-CaveExpedition.swf',
      'party1': 'archives:RoomsParty1-CaveExpedition.swf',
      'party2': 'archives:RoomsParty2-CaveExpedition.swf',
      'party3': 'archives:RoomsParty3-CaveExpedition.swf'
    },
    'localChanges': {
      'catalogues/party.swf': {
        'en': 'archives:ENCataloguesParty1-CaveExpedition.swf'
      },
      'close_ups/digposter.swf': {
        'en': 'archives:PlayV2ContentEnClose_upsDigposter.swf'
      },
      'close_ups/digposter2.swf': {
        'en': 'archives:ENCloseUpsDigPoster2-Jan2010.swf'
      },
      'close_ups/treasurepin1.swf': {
        'en': 'archives:ENCloseUpsTreasurePin1.swf'
      },
      'close_ups/treasurepin2.swf': {
        'en': 'archives:ENCloseUpsTreasurePin2.swf'
      },
      'close_ups/treasurepin3.swf': {
        'en': 'archives:ENCloseUpsTreasurePin3.swf'
      },
      'close_ups/treasurepin4.swf': {
        'en': 'archives:ENCloseUpsTreasurePin4.swf'
      }
    },
    consequences: {
      roomChanges: {
        mine: 'archives:RoomsMine-PostCaveExpedition.swf'
      }
    }
  },
  {
    name: 'Puffle Party 2010',
    date: '2010-02-18',
    end: '2010-02-25',
    roomChanges: {
      'beach': 'archives:RoomsBeach-PuffleParty2010.swf',
      'beacon': 'archives:RoomsBeacon-PuffleParty2010.swf',
      'berg': 'archives:RoomsBerg-PuffleParty2010.swf',
      'boxdimension': 'archives:RoomsBoxdimension-PuffleParty2010.swf',
      'cave': 'archives:RoomsCave-PuffleParty2010.swf',
      'cove': 'archives:RoomsCove-PuffleParty2010.swf',
      'dance': 'archives:RoomsDance-PuffleParty2010.swf',
      'dock': 'archives:RoomsDock-PuffleParty2010.swf',
      'forest': 'archives:RoomsForest-PuffleParty2010.swf',
      'forts': 'archives:RoomsForts-PuffleParty2010.swf',
      'light': 'archives:RoomsLight-PuffleParty2010.swf',
      'lodge': 'archives:RoomsSkiLodgeOrangePuffle.swf',
      'mine': 'archives:RoomsMine-PuffleParty2010.swf',
      'party1': 'archives:RoomsParty1-PuffleParty2010.swf',
      'party2': 'archives:RoomsParty2-PuffleParty2010.swf',
      'pet': 'archives:RoomsPet-PuffleParty2010.swf',
      'town': 'archives:RoomsTown-PuffleParty2010.swf',
      'village': 'archives:RoomsVillage-PuffleParty2010.swf',
      plaza: 'archives:RoomsPlaza-PuffleParty2010.swf'
    },
    music: {
      'beach': 282,
      'beacon': 282,
      'berg': 282,
      'cave': 260,
      'cove': 282,
      'dance': 282,
      'dock': 282,
      'forest': 282,
      'forts': 282,
      'light': 282,
      'mine': 260,
      'pet': 282,
      'plaza': 282,
      'town': 282,
      'village': 282,
      'party1': 261,
      'party2': 261
    },
    construction: {
      date: Update.PUFFLE_PARTY_10_CONST_START,
      changes: {
        'beacon': 'archives:RoomsBeacon-PuffleParty2010Const.swf',
        'berg': 'archives:RoomsBerg-PuffleParty2010Const.swf',
        'cave': 'archives:PuffleParty2010ConstCave.swf',
        'dance': 'archives:RoomsDance-PuffleParty2010Const.swf',
        'forest': 'archives:RoomsForest-PuffleParty2010Const.swf',
        'light': 'archives:RoomsLight-PuffleParty2010Const.swf',
        'mine': 'archives:RoomsMine-PuffleParty2010Const.swf'
      }
    },
    startscreens: ['archives:StartscreenPuffle_party1-PuffleParty2010.swf', 'archives:StartscreenPuffle_party2-PuffleParty2010.swf', 'archives:StartscreenPuffle_party3-PuffleParty2010.swf']
  },
  {
    name: 'Penguin Play Awards 2010',
    date: '2010-03-18',
    end: Update.PPA_10_END,
    music: {
      'pizza': 283,
      'plaza': 40,
      'stage': 40,
      'party': 40
    },
    roomChanges: {
      'dock': 'archives:RoomsDock-PenguinPlayAwards2010.swf',
      'mtn': 'archives:RoomsMtn-PenguinPlayAwards2010.swf',
      'party': 'archives:RoomsParty-PenguinPlayAwards2010.swf',
      'pizza': 'archives:RoomsPizza-PenguinPlayAwards2010.swf',
      'plaza': 'archives:RoomsPlaza-PenguinPlayAwards2010.swf',
      'stage': 'archives:RoomsStage-PenguinPlayAwards2010.swf',
      'town': 'archives:RoomsTown-PenguinPlayAwards2010.swf'
    },
    globalChanges: {
      'content/shorts/fairyFables.swf': 'archives:ContentShortsfairyFables.swf',
      'content/shorts/goldenPuffle.swf': 'archives:ContentShortsgoldenPuffle.swf',
      'content/shorts/ruby.swf': 'archives:ContentShortsRuby.swf',
      'content/shorts/squidzoid.swf': 'archives:ContentShortssquidzoid.swf',
      'content/shorts/underwater.swf': ['archives:ContentShortsunderwater.swf', 'underwaterShort'],
      'content/winners.swf': ['archives:ContentWinnersPPA2010.swf', 'voting_booth']
    },
    localChanges: {
      'catalogues/costume.swf': {
        'en': 'archives:March2010Costume.swf'
      }
    },
    startscreens: ['archives:StartscreenPpa-PenguinPlayAwards2010.swf']
  },
  {
    name: 'April Fools\' Party 2010',
    date: '2010-03-31',
    end: Update.APRIL_FOOLS_10_END,
    roomChanges: {
      'dock': 'archives:RoomsDock-AprilFoolsParty2010.swf',
      'forest': 'archives:RoomsForest-AprilFoolsParty2010.swf',
      'shop': 'archives:AprilFoolsParty2010GiftShop.swf',
      'berg': 'archives:RoomsBerg-AprilFoolsParty2010.swf',
      'light': 'archives:AprilFools\'Party2011Light.swf',
      'dance': 'archives:AprilFools\'Party2011Dance.swf',
      'mine': 'archives:RoomsMine-AprilFoolsParty2010.swf',
      'shack': 'archives:RoomsShack-AprilFoolsParty2010.swf',
      'pizza': 'archives:RoomsPizza-AprilFoolsParty2010.swf',
      'lodge': 'archives:RoomsLodge-AprilFoolsParty2010.swf',
      'village': 'archives:RoomsVillage-AprilFoolsParty2010.swf',
      'forts': 'archives:RoomsForts-AprilFoolsParty2010.swf',
      'town': 'archives:RoomsTown-AprilFoolsParty2010.swf',
      'party': 'archives:RoomsParty-AprilFoolsParty2010.swf',
      beach: 'archives:RoomsBeach-AprilFoolsParty2010.swf',
      coffee: 'archives:RoomsCoffeeAprilFools2010.swf',
      cave: 'archives:RoomsCave-AprilFoolsParty2010.swf',
      beacon: 'archives:AprilFools\'Party2011Beacon.swf',
      boiler: 'archives:RoomsBoiler-AprilFoolsParty2010.swf'
    },
    music: {
      'shop': 201,
      'beach': 232,
      'berg': 232,
      'boiler': 201,
      'cave': 201,
      'coffee': 201,
      'cove': 232,
      'dance': 231,
      'dock': 232,
      'forest': 232,
      'forts': 232,
      'light': 201,
      'lodge': 201,
      'mine': 201,
      'plaza': 232,
      'pizza': 201,
      'town': 232,
      'village': 232,
      'party': 261
    },
    roomMemberStatus: {
      party: true
    },
    localChanges: {
      'membership/oops_april_fools.swf': {
        'en': ['archives:AprilFoolsParty2010MembershipOopsAprilFools.swf', 'oops_party_room']
      }
    }
  },
  {
    name: 'Earth Day 2010',
    date: Update.EARTH_DAY_2010_START,
    end: Update.EARTH_DAY_2010_END,
    roomChanges: {
      'town': 'archives:RoomsTown-EarthDay2010.swf',
      'coffee': 'archives:RoomsCoffeeEarthDay2010.swf',
      'book': 'archives:RoomsBook-EarthDay2010.swf',
      'plaza': 'archives:RoomsPlaza-EarthDay2010.swf',
      'pet': 'archives:RoomsPet-EarthDay2010.swf',
      'mtn': 'archives:RoomsMtn-EarthDay2010.swf',
      'village': 'archives:RoomsVillage-EarthDay2010.swf',
      'forest': 'archives:RoomsForest-EarthDay2010.swf',
      'cove': 'archives:RoomsCove-EarthDay2010.swf',
      'shack': 'archives:RoomsShack-EarthDay2010.swf',
      'dojoext': 'archives:RoomsDojoext-EarthDay2010.swf'
    },
    music: {
      'town': 219,
      'plaza': 219
    },
    globalChanges: {
      'scavenger_hunt/recycle.swf': ['archives:Scavenger_hunt-EarthDay2010.swf', 'easter_egg_hunt', 'recycle_hunt']
    },
    scavengerHunt2010: {
      // file to this one was potentially named recycle_icon.swf, this info will be lost here though
      iconFileId: 'archives:Scavenger_hunt_icon-EarthDay2010.swf',
      iconFilePath: 'scavenger_hunt/recycle_icon.swf'
    },
    construction: {
      date: '2010-04-15',
      changes: {
        'shack': 'archives:RoomsShack-EarthDay2010Const.swf'
      }
    },
    permanentChanges: {
      roomChanges: {
        forest: 'archives:RoomsForest_2.swf'
      }
    },
    consequences: {
      roomChanges: {
        shack: 'recreation:shack_apr10.swf'
      }
    },
    startscreens: ['archives:Startscreen-EarthDay2010.swf']
  },
  {
    name: 'Medieval Party 2010',
    date: '2010-05-07',
    end: '2010-05-16',
    roomChanges: {
      'town': 'archives:RoomsTown-MedievalParty2010.swf',
      'coffee': 'archives:RoomsCoffee-MedievalParty2010.swf',
      'book': 'archives:RoomsBook-MedievalParty2010.swf',
      'dance': 'archives:RoomsDance-MedievalParty2010.swf',
      'lounge': 'archives:RoomsLounge-MedievalParty2010.swf',
      'shop': 'archives:RoomsShop-MedievalParty2010.swf',
      'forts': 'archives:RoomsForts-MedievalParty2010.swf',
      'plaza': 'archives:RoomsPlaza-MedievalParty2010.swf',
      'pet': 'archives:RoomsPet-MedievalParty2010.swf',
      'pizza': 'archives:RoomsPizza-MedievalParty2010.swf',
      'boiler': 'archives:RoomsBoiler-MedievalParty2010.swf',
      'cave': 'archives:RoomsCave-MedievalParty2010.swf',
      'forest': 'archives:RoomsForest-MedievalParty2010.swf',
      'cove': 'archives:RoomsCove-MedievalParty2010.swf',
      'dock': 'archives:MedievalParty2011Dock.swf',
      'beach': 'archives:Rooms0508Beach.swf',
      'light': 'archives:RoomsLight-MedievalParty2010.swf',
      'beacon': 'archives:MedievalParty2011Beacon.swf',
      'village': 'archives:RoomsVillage-MedievalParty2010.swf',
      'lodge': 'archives:Rooms0508Lodge.swf',
      'attic': 'archives:MedievalParty2011Attic.swf',
      'mtn': 'archives:MedievalParty2011Mtn.swf',
      'rink': 'archives:Rooms0508Rink.swf',
      'mine': 'archives:MedievalParty2011Mine.swf',

      // seemingly from 2009, unknown if accurate
      party1: 'archives:Rooms0508Party1.swf',
      party2: 'archives:Rooms0508Party2.swf',
      party3: 'archives:Rooms0508Party3.swf',
      party4: 'archives:Rooms0508Party4.swf',
      party5: 'archives:Rooms0508Party5.swf',
      party6: 'archives:Rooms0508Party6.swf',
      party7: 'archives:Rooms0508Party7.swf',
      party8: 'archives:Rooms0508Party8.swf',
      party9: 'archives:Rooms0508Party9.swf',
      party10: 'archives:Rooms0508Party10.swf',
      party11: 'archives:Rooms0508Party11.swf',
      party12: 'archives:Rooms0508Party12.swf',
      party13: 'archives:Rooms0508Party13.swf',

      // from 2011, missing party 16 which is visibly different from 2011
      party14: 'archives:MedievalParty2011Party14.swf',
      party15: 'archives:MedievalParty2011Party15.swf',
      party16: 'archives:RoomsParty16-MedievalParty2010.swf',
      'party17': 'archives:MedievalParty2011Party17.swf',
      'party18': 'archives:MedievalParty2011Party18.swf',
    },
    music: {
      'beach': 233,
      'beacon': 233,
      'boiler': 233,
      'book': 233,
      'cave': 237,
      'coffee': 233,
      'cove': 235,
      'dance': 233,
      'dock': 233,
      'forest': 235,
      'forts': 236,
      'light': 233,
      'lodge': 233,
      'lounge': 233,
      'mine': 236,
      'mtn': 233,
      'pet': 233,
      'pizza': 233,
      'plaza': 233,
      'rink': 236,
      'shop': 234,
      'town': 233,
      'village': 233,
      'party1': 235,
      'party2': 266,
      'party3': 266,
      'party4': 266,
      'party5': 266,
      'party6': 266,
      'party7': 266,
      'party8': 266,
      'party9': 266,
      'party10': 266,
      'party11': 266,
      'party12': 266,
      'party13': 265,
      'party14': 286,
      'party15': 286,
      'party16': 287,
      'party17': 288,
      'party18': 265
    },
    construction: {
      date: '2010-04-29',
      changes: {
        'beach': 'archives:MedievalParty2011ConstBeach.swf',
        'cave': 'archives:RoomsCave-MedievalParty2010Const.swf',
        'forts': 'archives:RoomsForts-MedievalParty2010Const.swf',
        'plaza': 'archives:RoomsPlaza-MedievalParty2010Const.swf',
        'town': 'archives:RoomsTown-MedievalParty2010Pre.swf',
        'village': 'archives:RoomsVillage-MedievalParty2010Const.swf'
      }
    }
  },
  {
    name: 'Popcorn Explosion',
    date: '2010-05-18',
    end: Update.EPF_RELEASE,
    roomChanges: {
      'agent': 'archives:RoomsAgent-PopcornExplosion.swf',
      'village': 'archives:RoomsVillage-PopcornExplosion.swf',
      'sport': 'archives:RoomsSport-PopcornExplosion.swf'
    },
    updates: [
      {
        comment: 'Sports Shop closed for reconstruction',
        date: '2010-05-25',
        roomChanges: {
          'agent': 'archives:RoomsAgent-PopcornExplosion_2.swf',
          'village': 'archives:RoomsVillage-PopcornExplosion_2.swf'
        }
      }
    ]
  },
  {
    name: 'Island Adventure Party 2010',
    date: '2010-06-18',
    end: '2010-06-28',
    roomChanges: {
      'town': 'archives:RoomsTown-IslandAdventureParty2010.swf',
      'dance': 'archives:RoomsDance-IslandAdventureParty2010.swf',
      'forts': 'archives:RoomsForts-IslandAdventureParty2010.swf',
      'plaza': 'archives:RoomsPlaza-IslandAdventureParty2010.swf',
      'forest': 'archives:RoomsForest-IslandAdventureParty2010.swf',
      'lake': 'archives:RoomsLake-IslandAdventureParty2010.swf',
      'cove': 'archives:RoomsCove-IslandAdventureParty2010.swf',
      'dock': 'archives:RoomsDock-IslandAdventureParty2010.swf',
      'beach': 'archives:RoomsBeach-IslandAdventureParty2010.swf',
      'village': 'archives:RoomsVillage-IslandAdventureParty2010.swf',
      'berg': 'archives:RoomsBerg-IslandAdventureParty2010.swf',
      'party': 'archives:RoomsParty-IslandAdventureParty2010.swf',
      'party2': 'archives:RoomsParty2-IslandAdventureParty2010.swf'
    },
    music: {
      'beach': 41,
      'cove': 291,
      'dance': 269,
      'dock': 41,
      'forest': 290,
      'forts': 291,
      'plaza': 291,
      'town': 268,
      'village': 291,
      'party': 267,
      'party2': 289
    },
    construction: {
      date: '2010-06-10',
      changes: {
        'beach': 'archives:RoomsBeach-IslandAdventureParty2010Const.swf',
        'cove': 'archives:IslandAdventureParty2011ConstCove.swf',
        'plaza': 'archives:RoomsPlaza-IslandAdventureParty2010Const.swf',
        'town': 'archives:RoomsTown-IslandAdventureParty2010Pre.swf'
      }
    },
    startscreens: ['archives:StartscreenIsland_adventure-IslandAdventureParty2010.swf', 'archives:StartscreenIsland_adventure_2-IslandAdventureParty2010.swf']
  },
  {
    name: 'Music Jam 2010',
    date: Update.MUSIC_JAM_2010_START,
    end: '2010-07-19',
    roomChanges: {
      'party3': 'archives:RoomsParty3-MusicJam2010.swf',
      'beach': 'archives:RoomsBeach-MusicJam2010.swf',
      'party4': 'archives:RoomsParty4-MusicJam2010.swf',
      'cave': 'archives:RoomsCave-MusicJam2010.swf',
      'coffee': 'archives:RoomsCoffee-MusicJam2010.swf',
      'cove': 'archives:RoomsCove-MusicJam2010.swf',
      'lounge': 'archives:RoomsLounge-MusicJam2010.swf',
      'dock': 'archives:RoomsDock-MusicJam2010.swf',
      'forest': 'archives:RoomsForest-MusicJam2010.swf',
      'berg': 'archives:RoomsBerg-MusicJam2010.swf',
      'light': 'archives:RoomsLight-MusicJam2010.swf',
      'mine': 'archives:RoomsMine-MusicJam2010.swf',
      'party': 'archives:RoomsParty-MusicJam2010.swf',
      'dance': 'archives:RoomsDance-MusicJam2010.swf',
      'party2': 'archives:RoomsParty2-MusicJam2010.swf',
      'pizza': 'archives:RoomsPizza-MusicJam2010.swf',
      'plaza': 'archives:RoomsPlaza-MusicJam2010.swf',
      'forts': 'archives:RoomsForts-MusicJam2010.swf',
      'rink': 'archives:RoomsRink-MusicJam2010.swf',
      'village': 'archives:RoomsVillage-MusicJam2010.swf',
      'town': 'archives:RoomsTown-MusicJam2010.swf'
    },
    music: {
      'lounge': 271,
      'berg': 244,
      'mine': 247,
      'dance': 242,
      'pizza': 271,
      'plaza': 271,
      'forts': 271,
      'rink': 240,
      'village': 292,
      'town': 271,
      'party3': 293,
      'coffee': 0
    },
    localChanges: {
      'catalogues/merch.swf': {
        'en': 'archives:MusicJam2010Merch.swf'
      },
      'close_ups/poster.swf': {
        'en': 'archives:MusicJam2010TownPoster.swf'
      },
      'close_ups/music.swf': {
        'en': 'approximation:music_jam_start_instruments.swf'
      }
    },
    updates: [
      {
        date: '2010-07-14',
        comment: 'The Penguin Band is taking a break',
        roomChanges: {
          berg: 'recreation:mjam_10_berg_no_pb.swf'
        }
      },
      {
        date: '2010-07-15',
        comment: 'New instruments are available in the Catalog',
        roomChanges: {},
        localChanges: {
          'catalogues/music.swf': {
            'en': 'archives:MusicJam2010UpdateInstruments.swf'
          }
        }
      }
    ],
    construction: {
      date: Update.MUSIC_JAM_2010_CONST_START,
      changes: {
        'beach': 'archives:RoomsBeach-MusicJam2010Pre.swf',
        'coffee': 'archives:RoomsCoffee-MusicJam2010Pre.swf',
        'cove': 'archives:RoomsCove-MusicJam2010Pre.swf',
        'dock': 'archives:RoomsDock-MusicJam2010Pre.swf',
        'forest': 'archives:RoomsForest-MusicJam2010Pre.swf',
        'berg': 'archives:RoomsBerg-MusicJam2010Pre.swf',
        'light': 'archives:RoomsLight-MusicJam2010Pre.swf',
        'village': 'archives:RoomsVillage-MusicJam2010Pre.swf',
        'forts': 'archives:RoomsForts-MusicJam2010Pre.swf'
      }
    },
    startscreens: ['archives:LoginMusicJam2010(1).swf', 'archives:LoginMusicJam2010(2).swf'],
    consequences: {
      roomChanges: {
        light: 'archives:LightCurrent.swf'
      }
    }
  },
  {
    name: 'Mountain Expedition',
    date: Update.MOUNTAIN_EXPEDITION,
    end: '2010-08-19',
    roomChanges: {
      'party3': 'archives:RoomsParty3-MtnExpedition.swf',
      'party6': 'archives:RoomsParty6-MtnExpedition.swf',
      'party2': 'archives:RoomsParty2-MtnExpedition.swf',
      'party4': 'archives:RoomsParty4-MtnExpedition.swf',
      'plaza': 'archives:RoomsPlaza-MtnExpedition.swf',
      'village': 'archives:RoomsVillage-MtnExpedition.swf',
      'party1': 'archives:RoomsParty1-MtnExpedition.swf',
      'party5': 'archives:RoomsParty5-MtnExpedition.swf',
      'town': 'archives:RoomsTown-MtnExpedition.swf'
    },
    localChanges: {
      'catalogues/merch.swf': {
        'en': 'archives:LocalEnCataloguesMerchAugust2010.swf'
      },
      'close_ups/poster.swf': {
        'en': 'recreation:mountain_expedition_poster.swf'
      },
      'membership/party3.swf': {
        'en': ['archives:MountainExpeditionMembershipOopsExpedition.swf', 'oops_party3_room']
      }
    },
    roomMemberStatus: {
      party3: true
    },
    music: {
      'party2': 294,
      'party3': 295,
      'party4': 295,
      'party6': 256
    },
    construction: {
      date: '2010-08-05',
      changes: {
        'village': 'archives:RoomsVillage-MtnExpeditionPre.swf'
      }
    },
    startscreens: ['archives:ENMtnExpeditionLogin.swf']
  },
  {
    name: 'The Fair 2010',
    date: Update.FAIR_2010_START,
    end: Update.FAIR_2010_END,
    roomChanges: {
      'town': 'archives:RoomsTown-TheFair2010.swf',
      'coffee': 'archives:RoomsCoffeeTheFair2009.swf',
      'dance': 'archives:RoomsDance-Fair2010.swf',
      'lounge': 'archives:RoomsLounge-Fair2009.swf',
      'forts': 'archives:RoomsForts-Fair2010.swf',
      'plaza': 'archives:RoomsPlaza-Fair2010.swf',
      'forest': 'archives:RoomsForest-Fair2010.swf',
      'cove': 'archives:RoomsCove-Fair2010.swf',
      'berg': 'archives:RoomsBerg-Fair2010.swf',
      'dock': 'archives:RoomsDock-Fair2010.swf',
      'beach': 'archives:RoomsBeach-Fair2010.swf',
      'beacon': 'archives:RoomsBeacon-Fair2010.swf',
      'village': 'archives:RoomsVillage-Fair2010.swf',
      'mtn': 'archives:RoomsMtn-Fair2010.swf',
      'party': 'archives:RoomsParty-Fair2010.swf',
      'party2': 'archives:RoomsParty2-Fair2010.swf',
      'party3': 'archives:RoomsParty3-Fair2010.swf'
    },
    music: {
      'town': 297,
      'coffee': 221,
      'dance': 243,
      'lounge': 243,
      'plaza': 297,
      'village': 297,
      'mtn': 297,
      'forts': 297,
      'dock': 297,
      'beach': 297,
      'beacon': 221,
      'forest': 297,
      'berg': 297,
      'cove': 297,
      'party': 221,
      'party1': 221,
      'party2': 221,
      'party3': 221
    },
    fairCpip: {
      iconFileId: 'archives:Ticket_icon-TheFair2010.swf',
      infoFile: 'archives:Tickets-TheFair2009.swf'
    },
    localChanges: {
      'catalogues/prizebooth.swf': {
        'en': 'archives:TheFair2010PrizeBooth.swf'
      },
      'catalogues/prizeboothmember.swf': {
        'en': 'archives:TheFair2010PrizeBoothMember.swf'
      },
      'close_ups/poster.swf': {
        'en': 'archives:Fair2010Poster.swf'
      }
    },
    construction: {
      date: '2010-08-26',
      changes: {
        'beach': 'archives:RoomsBeach-PreFair2010.swf'
      }
    },
    updates: [
      {
        comment: 'New items were added to the prize booths',
        date: '2010-09-10',
        roomChanges: {},
        localChanges: {
          'catalogues/prizebooth.swf': {
            'en': 'archives:TheFair2010PrizeBooth2.swf'
          },
          'catalogues/prizeboothmember.swf': {
            'en': 'archives:TheFair2010PrizeBoothMember2.swf'
          }
        }
      }
    ],
    startscreens: ['archives:LoginFairParty2010.swf', 'archives:StartscreenFairMember10.swf']
  },
  {
    name: '5th Anniversary Party',
    date: Update.ANNIVERSARY_5_START,
    end: '2010-10-25',
    roomChanges: {
      'book': 'archives:5thAnniversaryPartyBook.swf',
      'coffee': 'archives:5thAnniversaryPartyCoffee.swf',
      'town': 'archives:RoomsTown-5thAnniversaryParty.swf'
    },
    music: {
      'town': 218,
      'coffee': 218,
      'book': 218
    }
  },
  {
    name: 'Halloween Party 2010',
    date: Update.HALLOWEEN_2010_START,
    end: Update.HALLOWEEN_2010_END,
    roomChanges: {
      'beach': 'archives:HalloweenParty2010Beach.swf',
      'light': 'archives:HalloweenParty2010Lighthouse.swf',
      'beacon': 'archives:HalloweenParty2010Beacon.swf',
      'berg': 'archives:HalloweenParty2010Berg.swf',
      'book': 'archives:HalloweenParty2010Book.swf',
      'cave': 'archives:HalloweenParty2010Cave.swf',
      'forts': 'archives:HalloweenParty2010SnowForts.swf',
      'rink': 'archives:HalloweenParty2010Stadium.swf',
      'village': 'archives:HalloweenParty2010SkiVIllage.swf',
      'mtn': 'archives:HalloweenParty2010SkiHill.swf',
      'lodge': 'archives:HalloweenParty2010Lodge.swf',
      'attic': 'archives:HalloweenParty2010Attic.swf',
      'cove': 'archives:HalloweenParty2010Cove.swf',
      'party4': 'archives:HalloweenParty2010Party4.swf',
      'party3': 'archives:HalloweenParty2010Party3.swf',
      'dock': 'archives:HalloweenParty2010Dock.swf',
      'dojo': 'archives:HalloweenParty2010Dojo.swf',
      'dojoext': 'archives:HalloweenParty2010DojoExt.swf',
      'dojofire': 'archives:HalloweenParty2010DojoFire.swf',
      'plaza': 'archives:HalloweenParty2010Plaza.swf',
      'pet': 'archives:HalloweenParty2010PetShop.swf',
      'pizza': 'archives:HalloweenParty2010PizzaParlor.swf',
      'shack': 'archives:HalloweenParty2010Shack.swf',
      'forest': 'archives:HalloweenParty2010Forest.swf',
      'party2': 'archives:HalloweenParty2010Party2.swf',
      'party1': 'archives:HalloweenParty2010Party1.swf',
      'party5': 'archives:HalloweenParty2010Party5.swf',
      'town': 'archives:RoomsTown-HalloweenParty2010.swf',
      'dance': 'archives:HalloweenParty2010Dance.swf',
      'lounge': 'archives:HalloweenParty2010Lounge.swf',
      'shop': 'archives:HalloweenParty2010GiftShop.swf',
      'dojohide': 'archives:HalloweenParty2010DojoHide.swf',
      coffee: 'archives:HalloweenParty2010Coffee.swf'
    },
    map: 'archives:HalloweenParty2010Map.swf',
    globalChanges: {
      'scavenger_hunt/hunt_ui.swf': ['recreation:halloween_hunt_2010.swf', 'hunt_ui', 'halloween_hunt'],
      'binoculars/empty.swf': 'archives:ContentBinoculars-HalloweenParty2007.swf', // from 2007 party
      'igloo/assets/igloo_background.swf': 'archives:Igloo_background_nightstorm.swf', // from 2011 party
      'rooms/NOTLS3EN.swf': 'unknown:NOTLS3EN',
      'telescope/empty.swf': 'unknown:halloween_telescope.swf'
    },
    localChanges: {
      'catalogues/party.swf': {
        'en': 'archives:CataloguesENParty-HalloweenParty2010.swf'
      },
      'close_ups/halloweenposter.swf': {
        'en': 'archives:HalloweenParty2010Poster.swf'
      },
      'membership/party3.swf': {
        'en': ['archives:HalloweenParty2010MembershipParty3.swf', 'oops_party3_room']
      }
    },
    roomMemberStatus: {
      party3: true
    },
    music: {
      'town': 251,
      'coffee': 252,
      'book': 252,
      'dance': 223,
      'lounge': 223,
      'shop': 252,
      'plaza': 251,
      'pet': 252,
      'pizza': 253,
      'village': 251,
      'lodge': 252,
      'attic': 252,
      'mtn': 251,
      'forts': 251,
      'rink': 251,
      'dock': 251,
      'beach': 251,
      'light': 252,
      'beacon': 251,
      'forest': 251,
      'berg': 251,
      'cove': 251,
      'cave': 252,
      'shack': 251,
      'dojo': 252,
      'dojoext': 251,
      'dojohide': 252,
      'party1': 251,
      'party2': 253,
      'party3': 299,
      'party4': 300,
      'party5': 298
    },
    scavengerHunt2010: {
      iconFileId: 'approximation:halloween_hunt_icon.swf'
    },
    startscreens: ['archives:Halloween2010LoginScreen1.swf', 'archives:Halloween2010LoginScreen2.swf', 'archives:Halloween2010LoginScreen3.swf']
  },
  {
    name: 'The Great Storm of 2010',
    date: '2010-11-04',
    end: '2010-11-16',
    startComment: 'The storm remains in the island, making it cloudy',
    endComment: 'The storm ends',
    roomChanges: {
      beach: 'archives:StormBeach.swf',
      beacon: 'archives:StormBeacon.swf',
      cove: 'archives:StormCove.swf',
      dock: 'archives:StormDock.swf',
      dojoext: 'archives:StormDojoext.swf',
      dojofire: 'archives:StormDojoFire.swf',
      forest: 'archives:StormForest.swf',
      berg: 'archives:StormBerg.swf',
      shack: 'archives:StormShack.swf',
      dojohide: 'archives:StormDojohide.swf',
      plaza: 'archives:StormPlaza.swf',
      mtn: 'archives:StormMtn.swf',
      village: 'archives:StormVillage.swf',
      forts: 'archives:StormForts.swf',
      rink: 'archives:StormRink.swf',
      town: 'archives:RoomsTown-Storm2010Pre.swf',
      pet: 'recreation:storm_2010_pet.swf',
      pizza: 'recreation:storm_2010_pizza.swf'
    },
    globalChanges: {
      'igloo/assets/igloo_background.swf': 'archives:StormIglooBackground.swf',
      'binoculars/empty.swf': 'archives:StormBinoculars.swf',
      'telescope/empty.swf': 'archives:StormTelescope.swf'
    },
    updates: [
      {
        comment: 'Rain starts around the island',
        date: '2010-11-11',
        roomChanges: {
          beach: 'archives:RainBeach.swf',
          beacon: 'archives:RainBeacon.swf',
          coffee: 'archives:RainCoffee.swf',
          cove: 'archives:RainCove.swf',
          dock: 'archives:RainDock.swf',
          dojo: 'archives:RainDojo.swf',
          agentlobbysolo: 'archives:RainAgentlobbysolo.swf',
          agentlobbymulti: 'archives:RainAgentlobbymulti.swf',
          dojofire: 'archives:RainDojofire.swf',
          forest: 'archives:RainForest.swf',
          shop: 'archives:RainShop.swf',
          dojoext: 'archives:RainDojoext.swf',
          berg: 'archives:RainBerg.swf',
          light: 'archives:RainLight.swf',
          dojohide: 'archives:RainDojohide.swf',
          shack: 'archives:RainShack.swf',
          pet: 'archives:RainPet.swf',
          pizza: 'archives:RainPizza.swf',
          plaza: 'archives:RainPlaza.swf',
          mtn: 'archives:RainMtn.swf',
          lodge: 'archives:RainLodge.swf',
          village: 'archives:RainVillage.swf',
          forts: 'archives:RainForts.swf',
          rink: 'archives:RainRink.swf',
          town: 'archives:RoomsTown-Storm2010.swf'
        },
        globalChanges: {
          'binoculars/empty.swf': 'archives:RainBinoculars.swf',
          'telescope/empty.swf': 'archives:RainTelescope.swf'
        }
      }
    ]
  },
  {
    name: 'Sensei\'s Water Scavenger Hunt',
    date: Update.WATER_HUNT_START,
    end: Update.WATER_HUNT_END,
    roomChanges: {
      'boiler': 'archives:WaterHuntBoiler.swf',
      'book': 'archives:WaterHuntBook.swf',
      'cave': 'archives:WaterHuntCave.swf',
      'cavemine': 'archives:WaterHuntCavemine.swf',
      'coffee': 'archives:WaterHuntCoffee.swf',
      'cove': 'archives:WaterHuntCove.swf',
      'lounge': 'archives:WaterHuntLounge.swf',
      'dock': 'archives:WaterHuntDock.swf',
      'dojoext': 'archives:WaterHuntDojoext.swf',
      'forest': 'archives:WaterHuntForest.swf',
      'lake': 'archives:WaterHuntLake.swf',
      'mine': 'archives:WaterHuntMine.swf',
      'dojohide': 'archives:WaterHuntDojohide.swf',
      'plaza': 'archives:WaterHuntPlaza.swf',
      'pet': 'archives:WaterHuntPet.swf',
      'rink': 'archives:WaterHuntRink.swf',
      'forts': 'archives:WaterHuntForts.swf',
      'town': 'archives:RoomsTown-WaterScavengerHunt.swf',
      'dojowater': 'archives:WaterDojoConstruction.swf'
    },
    globalChanges: {
      'scavenger_hunt/hunt_ui.swf': ['archives:Sensei_Water_Scavenger_Hunt_closeup.swf', 'easter_egg_hunt', 'scavenger_hunt']
    },
    updates: [
      {
        date: Update.PLANET_Y_2010,
        roomChanges: {
          'plaza': 'recreation:water_hunt_planet_y.swf',
          beach: 'recreation:water_hunt_beach_no_pin.swf'
        }
      }
    ],
    scavengerHunt2010: {
      iconFileId: 'archives:Sensei_Water_Scavenger_Hunt_icon.swf.swf'
    }
  },
  {
    name: 'Celebration of Water',
    date: Update.WATER_HUNT_END,
    end: Update.WATER_CELEBRATION_END,
    roomChanges: {
      'dojoext': 'archives:WaterCelebrationDojoext.swf',
      'dojohide': 'archives:WaterCelebrationDojohide.swf',
      'dojowater': 'archives:WaterCelebrationDojowater.swf'
    },
    consequences: {
      roomComment: 'A video about Card-Jitsu Water is now on display at the Dojo Courtyard',
      roomChanges: {
        dojoext: 'archives:RoomsDojoext_3.swf'
      }
    }
  },
  {
    name: 'Holiday Party 2010',
    date: '2010-12-16',
    end: '2010-12-28',
    roomChanges: {
      'party99': 'archives:HolidayParty2010Party99.swf',
      'beach': 'archives:HolidayParty2010Beach.swf',
      'beacon': 'archives:HolidayParty2010Beacon.swf',
      'book': 'archives:HolidayParty2010Book.swf',
      'shipquarters': 'archives:HolidayParty2010ShipQuarters.swf',
      'coffee': 'archives:HolidayParty2010Coffee.swf',
      'cove': 'archives:HolidayParty2010Cove.swf',
      'shipnest': 'archives:HolidayParty2010ShipNest.swf',
      'lounge': 'archives:HolidayParty2010Lounge.swf',
      'dock': 'archives:HolidayParty2010Dock.swf',
      'dojo': 'archives:HolidayParty2010Dojo.swf',
      'dojoext': 'archives:HolidayParty2010DojoExt.swf',
      'dojofire': 'archives:HolidayParty2010DojoFire.swf',
      'forest': 'archives:HolidayParty2010Forest.swf',
      'shop': 'archives:HolidayParty2010Shop.swf',
      'berg': 'archives:HolidayParty2010Berg.swf',
      'light': 'archives:HolidayParty2010Light.swf',
      'attic': 'archives:HolidayParty2010Attic.swf',
      'party': 'archives:HolidayParty2010Party.swf',
      'ship': 'archives:HolidayParty2010Ship.swf',
      'shack': 'archives:HolidayParty2010Shack.swf',
      'dance': 'archives:HolidayParty2010Dance.swf',
      'dojohide': 'archives:HolidayParty2010DojoHide.swf',
      'pizza': 'archives:HolidayParty2010Pizza.swf',
      'plaza': 'archives:HolidayParty2010Plaza.swf',
      'shiphold': 'archives:HolidayParty2010ShipHold.swf',
      'mtn': 'archives:HolidayParty2010Mtn.swf',
      'lodge': 'archives:HolidayParty2010Lodge.swf',
      'village': 'archives:HolidayParty2010Village.swf',
      'forts': 'archives:HolidayParty2010Forts(1).swf',
      'rink': 'archives:HolidayParty2010Rink(1).swf',
      'town': 'archives:RoomsTown-HolidayParty2010.swf'
    },
    map: 'archives:HolidayParty2010Map-StadiumGames.swf',
    localChanges: {
      'close_ups/christmasposter.swf': {
        'en': 'archives:HolidayParty2010ChristmasPoster.swf'
      },
      'close_ups/poster.swf': {
        'en': 'archives:2010coinsforchangeposter.swf'
      },
      'forms/coins_for_change.swf': {
        'en': 'archives:2010coinsforchangedonate.swf'
      }
    },
    music: {
      'attic': 255,
      'beach': 254,
      'beacon': 254,
      'berg': 227,
      'book': 255,
      'coffee': 255,
      'cove': 254,
      'dance': 400,
      'dock': 254,
      'forest': 254,
      'forts': 254,
      'lodge': 255,
      'lounge': 226,
      'mtn': 254,
      'pizza': 255,
      'plaza': 254,
      'rink': 254,
      'shack': 254,
      'shop': 255,
      'village': 254,
      'town': 254,
      'party': 281,
      'party99': 254
    },
    activeMigrator: true,
    updates: [
      {
        date: Update.STADIUM_GAMES_END,
        roomChanges: {
          'forts': 'archives:HolidayParty2010Forts(2).swf',
          'rink': 'archives:HolidayParty2010Rink(2).swf',
          'town': 'archives:RoomsTown-HolidayParty2010_2.swf'
        },
        map: 'archives:HolidayParty2010Map.swf'
      }
    ],
    startscreens: [
      'archives:LoginHolidayParty2010.swf',
      'archives:CFC2010LoginScreen.SWF',
      'archives:LoginDec2010Membership.swf',
      'archives:StartscreenENCoins_for_change_2-HolidayParty2010.swf'],
    construction: {
      date: '2010-12-09',
      changes: {
        beach: 'archives:HolidayParty2011ConsBeach.swf',
        lounge: 'archives:RoomsLounge-HolidayParty2009Pre.swf',
        dance: 'archives:RoomsDance-HolidayParty2009Pre.swf',
      },
      localChanges: {
        'close_ups/poster.swf': {
          en: ['recreation:holiday_beach_poster.swf', 'poster']
        }
      }
    }
  },
  {
    name: 'Wilderness Expedition',
    date: Update.WILDERNESS_EXPEDITION_START,
    end: Update.WILDERNESS_EXPEDITION_END,
    roomChanges: {
      town: 'archives:RoomsTown-WildernessExpedition.swf',
      plaza: 'archives:WildernessExpeditionPlaza.swf',
      dock: 'archives:RoomsDock-WildernessExpedition.swf',
      cove: 'archives:RoomsCove-WildernessExpedition.swf',
      party1: 'archives:WildernessExpeditionParty1.swf',
      party2: 'archives:WildernessExpeditionParty2.swf',
      party3: 'archives:WildernessExpeditionParty3.swf',
      party4: 'archives:WildernessExpeditionParty4.swf',
      party5: 'archives:WildernessExpeditionParty5.swf',
      party6: 'archives:WildernessExpeditionParty6.swf',
      party7: 'archives:WildernessExpeditionParty7.swf',
      party8: 'archives:WildernessExpeditionParty8.swf',
      party9: 'archives:WildernessExpeditionParty9.swf',
      party10: 'archives:WildernessExpeditionParty10.swf',
      party11: 'archives:WildernessExpeditionParty11.swf',
      party12: 'archives:WildernessExpeditionParty12.swf',
      party13: 'archives:WildernessExpeditionParty13.swf'
    },
    music: {
      party1: 304,
      party2: 303,
      party3: 303,
      party4: 303,
      party5: 303,
      party6: 303,
      party7: 303,
      party8: 303,
      party9: 303,
      party10: 302,
      party11: 306,
      party12: 304,
      party13: 305
    },
    furniturePrices: {
      665: 0
    },
    localChanges: {
      'close_ups/poster.swf': {
        'en': 'archives:WildernessExpeditionPoster.swf'
      },
      'close_ups/party_note01.swf': {
        'en': 'archives:WildernessExpeditionPartyNote01.swf'
      },
      'close_ups/party_note02.swf': {
        'en': 'archives:WildernessExpeditionPartyNote02.swf'
      },
      'close_ups/party_note03.swf': {
        'en': 'archives:WildernessExpeditionPartyNote03.swf'
      },
      'close_ups/party_note04.swf': {
        'en': 'archives:WildernessExpeditionPartyNote04.swf'
      },
      'close_ups/party_note05.swf': {
        'en': 'archives:WildernessExpeditionPartyNote05.swf'
      },
      'catalogues/party.swf': {
        'en': ['archives:PartyCatalogWildernessExpedition.swf', 'party_purchase']
      },
      'membership/party1.swf': {
        'en': 'archives:WildernessExpeditionMembershipParty1.swf'
      },
      'membership/party2.swf': {
        'en': 'archives:WildernessExpeditionMembershipParty2.swf'
      }
    },
    // workaround shell and interface
    generalChanges: {
      'play/v2/client/interface.swf': 'approximation:wilderness_expedition/interface.swf',
      'play/v2/client/shell.swf': 'approximation:wilderness_expedition/shell.swf'
    },
    startscreens: [
      'archives:LoginWildernessExpedition.swf',
      'archives:LoginWildernessExpedition2.swf'
    ],
    updates: [
      {
        date: '2011-01-24',
        comment: 'Brown Puffles Houses are available for free',
        roomChanges: {
          party13: 'archives:RoomsParty13-WildernessExpedition.swf'
        }
      }
    ],
    consequences: {
      localChanges: {
        'catalogues/adopt.swf': {
          'en': 'archives:Feb2011Adopt.swf'
        },
      }
    }
  },
  {
    name: 'Puffle Party',
    date: Update.PUFFLE_PARTY_11_START,
    end: Update.PUFFLE_PARTY_11_END,
    roomChanges: {
      'town': 'archives:RoomsTown-PuffleParty2011.swf',
      'beach': 'archives:PuffleParty2011Beach.swf',
      'berg': 'archives:PuffleParty2011Berg.swf',
      'dock': 'archives:PuffleParty2011Dock.swf',
      'forest': 'archives:PuffleParty2011Forest.swf',
      'pet': 'archives:PuffleParty2011Pet.swf',
      'plaza': 'archives:PuffleParty2011Plaza(1).swf',
      'village': 'archives:PuffleParty2011Village.swf',
      'forts': 'archives:PuffleParty2011Forts.swf',
      'party1': 'archives:PuffleParty2011Party1.swf',
      'party2': 'archives:PuffleParty2011Party2.swf',
      'party3': 'archives:PuffleParty2011Party3.swf',
      'dance': 'archives:PuffleParty2011Dance.swf',
      'mine': 'archives:PuffleParty2011Mine.swf',
      'light': 'archives:PuffleParty2011Light.swf',
      'beacon': 'archives:PuffleParty2011Beacon.swf',
      'cove': 'archives:PuffleParty2011Cove.swf',
      'cave': 'archives:PuffleParty2011Cave.swf',
      'boxdimension': 'archives:PuffleParty2011BoxDimension.swf',
      'lounge': 'archives:PuffleParty2011Lounge.swf'
    },
    music: {
      'town': 261,
      'beach': 261,
      'dock': 261,
      'forts': 261,
      'forest': 261,
      'village': 261,
      'light': 31,
      'berg': 213,
      'pet': 282,
      'plaza': 261,
      'party1': 261,
      'party2': 282,
      'dance': 260,
      'lounge': 260,
      'cove': 290,
      'beacon': 261,
      'mine': 256,
      'cave': 36
    },
    roomMemberStatus: {
      party2: true,
      party3: true
    },
    localChanges: {
      'close_ups/poster.swf': {
        'en': 'archives:PuffleParty2011Poster.swf'
      },
      'membership/party2.swf': {
        'en': ['archives:PuffleParty2011MembershipParty2.swf', 'oops_party2_room']
      },
      'membership/party3.swf': {
        'en': ['archives:PuffleParty2011MembershipParty3.swf', 'oops_party3_room']
      }
    },
    startscreens: [
      'archives:LoginPuffleParty2011(1).swf',
      'archives:LoginPuffleParty2011(2).swf'
    ],
    construction: {
      date: Update.PUFFLE_PARTY_11_CONST_START,
      changes: {
        'boxdimension': 'archives:PuffleParty2011ConstBoxDimension.swf',
        'dance': 'archives:PuffleParty2011ConstDance.swf',
        'mine': 'archives:PuffleParty2011ConstMine.swf',
        'berg': 'archives:PuffleParty2011ConstBerg.swf',
        'light': 'archives:PuffleParty2011ConstLight.swf',
        'forest': 'archives:PuffleParty2011ConstForest.swf',
        'lounge': 'archives:PuffleParty2011ConstLounge.swf',
        'beacon': 'archives:PuffleParty2011ConstBeacon.swf',
        'cave': 'archives:PuffleParty2010ConstCave.swf'
      }
    },
    updates: [
      {
        date: Update.STAGE_FEB_11,
        roomChanges: {
          'plaza': 'archives:PuffleParty2011Plaza(2).swf'
        }
      }
    ]
  },
  {
    name: 'April Fools',
    date: Update.APRIL_FOOLS_11_START,
    end: Update.APRIL_FOOLS_11_END,
    globalChanges: {
      'scavenger_hunt/hunt_ui.swf': ['archives:AprilFoolsParty2011Scavenger_hunt.swf', 'april_fools_hunt', 'scavenger_hunt']
    },
    startscreens: [
      'archives:LoginAprilfools2.swf',
      'archives:LoginAprilFools2011.swf'
    ],
    localChanges: {
      'close_ups/poster.swf': {
        'en': 'archives:AprilFoolsParty2011Poster.swf'
      },
      'catalogues/party.swf': {
        'en': 'archives:AprilFoolsParty2011PartyCatalog.swf'
      },
      'membership/party.swf': {
        'en': [
          'archives:AprilFoolsParty2011MembershipParty2.swf',
          'oops_party1_room',
          'oops_party2_room',
          'oops_party3_room',
          'oops_party4_room',
          'oops_party5_room',
          'oops_party6_room',
          'oops_party7_room',
        ]
      }
    },
    roomChanges: {
      'party1': 'archives:AprilFools\'Party2011Party1.swf',
      'party2': 'archives:AprilFools\'Party2011Party2.swf',
      'party3': 'archives:AprilFools\'Party2011Party3.swf',
      'party4': 'archives:AprilFools\'Party2011Party4.swf',
      'party5': 'archives:AprilFools\'Party2011Party5.swf',
      'party6': 'archives:AprilFools\'Party2011Party6.swf',
      'party7': 'archives:AprilFools\'Party2011Party7.swf',
      'party8': 'archives:AprilFools\'Party2011Party8.swf',
      'beach': 'archives:AprilFools\'Party2011Beach.swf',
      'town': 'archives:RoomsTown-AprilFoolsParty2011.swf',
      'shop': 'archives:AprilFools\'Party2011Shop.swf',
      'eco': 'archives:AprilFools\'Party2011Eco.swf',
      'forts': 'archives:AprilFools\'Party2011Forts.swf',
      'beacon': 'archives:AprilFools\'Party2011Beacon.swf',
      'berg': 'archives:AprilFools\'Party2011Berg.swf',
      'boiler': 'archives:AprilFools\'Party2011Boiler.swf',
      'cove': 'archives:AprilFools\'Party2011Cove.swf',
      'dance': 'archives:AprilFools\'Party2011Dance.swf',
      'mine': 'archives:AprilFools\'Party2011Mine.swf',
      'lodge': 'archives:AprilFools\'Party2011Lodge.swf',
      'dock': 'archives:AprilFools\'Party2011Dock.swf',
      'boxdimension': 'archives:AprilFools\'Party2011Boxdimension.swf',
      'village': 'archives:AprilFools\'Party2011Village.swf',
      'pizza': 'archives:AprilFools\'Party2011Pizza.swf',
      'coffee': 'archives:AprilFools\'Party2011Coffee.swf',
      'cave': 'archives:AprilFools\'Party2011Cave.swf',
      'light': 'archives:AprilFools\'Party2011Light.swf'
    },
    construction: {
      date: '2011-03-21',
      changes: {
        'beach': 'archives:BeachConstructionAprilFoolsParty2011.swf',
        'dock': 'archives:DockCostructionAprilFoolsParty2011.swf',
        'berg': 'archives:IceBergConstructionAprilFoolsParty2011.swf',
        'village': 'archives:SkiVillageCostructionAprilFoolsParty2011.swf',
        'forts': 'archives:SnowFortsContructionAprilFoolsParty2011.swf',
        'boxdimension': 'archives:BoxDimensionConstructionAprilFoolsParty2011.swf'
      }
    },
    music: {
      'party1': 229,
      'party2': 307,
      'party3': 265,
      'party4': 215,
      'party5': 208,
      'party6': 209,
      'party7': 220,
      'party8': 11,
      'town': 232,
      'shop': 201,
      'dance': 231,
      'light': 201,
      'lodge': 201,
      'eco': 201,
      'cove': 232,
      'beacon': 232,
      'forts': 232,
      'pizza': 201,
      'dock': 232,
      'berg': 232,
      'mine': 201,
      'boiler': 201,
      'coffee': 201,
      'cave': 201,
      'beach': 232,
      'village': 232
    },
    roomMemberStatus: {
      party1: true,
      party2: true,
      party3: true,
      party4: true,
      party5: true,
      'party6': true,
      party7: true
    },
    permanentChanges: {
      generalChanges: {
        // interface that has scavenger hunt functions
        'play/v2/client/interface.swf': 'archives:ClientInterface20110830.swf'
      }
    },
    scavengerHunt2011: {
      icon: 'archives:AprilFoolsParty2011Scavenger_hunt_icon.swf',
      global: {
        member: true,
        reward: 4339,
      },
      lang: {
        en: {
          loading: 'Loading Scavenger Hunt',
          title: 'SILLY SCAVENGER HUNT',
          start: 'You have found',
          itemsFound: 'You have found %num% piece',
          itemsFoundPlural: 'You have found %num% pieces',
          claim: 'Claim Prize',
          continue: 'Continue',
          clues: [
            "Start where,\\norange puffles go,\\n\\nIn a room with\\na purple glow.\\n",
            "Continue the search,\\namong the sand,\\n\\nWhere red mountains,\\nframe the land.\\n",
            "This blank page\\nholds much potential\\n\\nYour imagination\\nis essential!\\n",
            "If you find yourself\\nnext to Mars...\\n\\n...find something hidden\\nin the stars \\n",
            "The stage is\\njust the thing\\n\\nTo find a clue\\nfit for a king\\n",
            "Finding this one\\nwill turn you around\\n\\nIn a room\\nwhere up is down\\n",
            "To free this piece:\\nyou\\'ll need a clue:\\n\\nFind your way\\nthrough bright pink brew \\n",
            "This Scavenger Hunt\\nis extreme!\\n\\nFind this piece\\nby a chocolate stream\\n"
          ]
        }
      }
    }
  },
  {
    name: 'Earth Day',
    date: Update.EARTH_DAY_2011_START,
    end: '2011-04-26',
    roomChanges: {
      dock: 'archives:EarthDay2011Dock.swf',
      forest: 'archives:EarthDay2011Forest.swf',
      plaza: 'archives:EarthDay2011Plaza.swf',
      forts: 'archives:EarthDay2011Forts.swf',
      town: 'archives:RoomsTown-March2011.swf',
      cave: 'archives:EasterEggHunt2011Cave.swf',
      dojo: 'archives:EasterEggHunt2011Dojo.swf',
      attic: 'archives:EasterEggHunt2011Attic.swf',
      shack: 'archives:EasterEggHunt2011Shack.swf',
      mtn: 'archives:EasterEggHunt2011Mtn.swf'
    },
    scavengerHunt2011: {
      icon: 'archives:EasterEggHunt2011Scavenger_hunt_icon.swf',
      global: {
        reward: 9098,
        member: false
      },
      lang: {
        en: {
          loading: 'Loading Scavenger Hunt',
          title: 'SCAVENGER HUNT',
          claim: 'Claim Prize',
          continue: 'Continue',
          clues: [
            'The first egg is\\nhidden way up high.\\nStart your search\\nnear a small bonsai',
            'This clue requires\\na very short note:\\nFind this egg near\\na floating boat.',
            'The next clue\\nis a total breeze.\\nLook for this egg\\naround some trees.',
            'Go to where\\nthe lighting is dim.\\nThink of where\\nyou most like to swim.',
            'You grasped the clues,\\nyou followed the signs...\\n...now find the polar bear\\nwrapped in vines!',
            'You\'re almost done\\nso stay the course.\\nFind the room\\nwith a rocking horse.',
            'Wrap up warm,\\nor you\'ll feel a chill.\\nSpot this egg\\non top of a hill.',
            'With this last clue,\\nyou\'re good to go.\\nStart a machine\\nand make it snow.'
          ],
          'itemsFound': '',
          itemsFoundPlural: '',
          start: ''
        }
      }
    },
    globalChanges: {
      'content/scavenger_hunt.swf': [ 'archives:EasterEggHunt2011Scavenger_hunt.swf', 'scavenger_hunt' ]
    },
    localChanges: {
      'close_ups/poster.swf': {
        'en': ['archives:EarthDay2011Poster.swf', 'party_poster']
      },
      'catalogues/party.swf': {
        'en': ['archives:EarthDay2011CatalogParty.swf', 'party_catalogue']
      },
      'catalogues/party2.swf': {
        'en': [ 'archives:EarthDay2011CatalogParty2.swf', 'party_catalogue2']
      },
      'earth_day_video.swf': {
        'en': [ 'archives:EarthDay2011Earth_day_video.swf', 'earth_day_video']
      }
    },
    music: {
      dock: 269,
      forts: 295
    },
    prices: {
      4345: 50,
      4344: 50
    },
    startscreens: [ 'archives:LoginEarth_day1.swf' ]
  },
  {
    name: 'Medieval Party',
    date: Update.MEDIEVAL_11_START,
    end: Update.MEDIEVAL_11_END,
    construction: {
      date: '2011-05-17',
      changes: {
        'town': 'archives:RoomsTown-MedievalParty2010Pre.swf',
        'forts': 'archives:MedievalParty2011ConstForts.swf',
        'village': 'archives:MedievalParty2011ConstVillage.swf',
        'plaza': 'archives:MedievalParty2011ConstPlaza.swf',
        'cave': 'archives:MedievalParty2011ConstCave.swf',
        'beach': 'archives:MedievalParty2011ConstBeach.swf'
      }
    },
    localChanges: {
      'catalogues/party.swf': {
        'en': 'archives:MedievalParty2011CatalogParty.swf'
      },
      'membership/party.swf': {
        'en': ['archives:MedievalParty2011MembershipParty2.swf', 'oops_party14_room', 'oops_party19_room']
      },
      'close_ups/InstructionsScroll.swf': {
        en: ['svanilla:media/play/v2/content/local/en/close_ups/InstructionsScroll.swf', 'instructions_quest']
      }
    },
    roomMemberStatus: {
      'party14': true,
      'party19': true
    },
    startscreens: [
      'archives:LoginMedievalparty.swf'
    ],
    roomChanges: {
      'book': 'archives:MedievalParty2011Book.swf',
      'beach': 'archives:Rooms0508Beach.swf',
      'beacon': 'archives:MedievalParty2011Beacon.swf',
      'boiler': 'archives:MedievalParty2011Boiler.swf',
      'cave': 'archives:MedievalParty2011Cave.swf',
      'cove': 'archives:MedievalParty2011Cove.swf',
      'coffee': 'archives:MedievalParty2011Coffee.swf',
      'lounge': 'archives:MedievalParty2011Lounge.swf',
      'light': 'archives:MedievalParty2011Light.swf',
      'shop': 'archives:MedievalParty2011Shop.swf',
      'dock': 'archives:MedievalParty2011Dock.swf',
      'forest': 'archives:MedievalParty2011Forest.swf',
      'dance': 'archives:MedievalParty2011Dance.swf',
      'mine': 'archives:MedievalParty2011Mine.swf',
      'shack': 'archives:MedievalParty2011Shack.swf',
      'attic': 'archives:MedievalParty2011Attic.swf',
      'pizza': 'archives:MedievalParty2011Pizza.swf',
      'plaza': 'archives:MedievalParty2011Plaza.swf',
      'eco': 'archives:MedievalParty2011Eco.swf',
      'mtn': 'archives:MedievalParty2011Mtn.swf',
      'rink': 'archives:MedievalParty2011Rink.swf',
      'town': 'archives:RoomsTown-MedievalParty2011.swf',
      'forts': 'archives:MedievalParty2011Forts.swf',
      'village': 'archives:MedievalParty2011Village.swf',
      'lodge': 'archives:Rooms0508Lodge.swf',
      'party1': 'archives:MedievalParty2011Party1.swf',
      'party2': 'archives:MedievalParty2011Party2.swf',
      'party3': 'archives:MedievalParty2011Party3.swf',
      'party4': 'archives:MedievalParty2011Party4.swf',
      'party5': 'archives:MedievalParty2011Party5.swf',
      'party6': 'archives:MedievalParty2011Party6.swf',
      'party7': 'archives:MedievalParty2011Party7.swf',
      'party8': 'archives:MedievalParty2011Party8.swf',
      'party9': 'archives:MedievalParty2011Party9.swf',
      'party10': 'archives:MedievalParty2011Party10.swf',
      'party11': 'archives:MedievalParty2011Party11.swf',
      'party12': 'archives:MedievalParty2011Party12.swf',
      'party13': 'archives:MedievalParty2011Party13.swf',
      'party14': 'archives:MedievalParty2011Party14.swf',
      'party15': 'archives:MedievalParty2011Party15.swf',
      'party16': 'archives:MedievalParty2011Party16.swf',
      'party17': 'archives:MedievalParty2011Party17.swf',
      'party18': 'archives:MedievalParty2011Party18.swf',
      'party19': 'archives:MedievalParty2011Party19.swf',
      'party20': 'archives:MedievalParty2011Party20.swf',
      'party21': 'archives:MedievalParty2011Party21.swf',
      'party22': 'archives:MedievalParty2011Party22.swf',
      'party23': 'archives:MedievalParty2011Party23.swf'
    },
    music: {
      'town': 233,
      'plaza': 233,
      'village': 233,
      'beach': 233,
      'rink': 233,
      'shack': 233,
      'dock': 233,
      'beacon': 233,
      'mtn': 233,
      'lounge': 31,
      'coffee': 234,
      'book': 234,
      'dance': 234,
      'light': 234,
      'shop': 234,
      'eco': 234,
      'pizza': 234,
      'forest': 235,
      'forts': 235,
      'lodge': 235,
      'attic': 235,
      'cove': 235,
      'mine': 236,
      'cave': 236,
      'boiler': 236,
      'party1': 235,
      'party2': 266,
      'party3': 266,
      'party4': 266,
      'party5': 266,
      'party6': 266,
      'party7': 266,
      'party8': 266,
      'party9': 266,
      'party10': 266,
      'party11': 266,
      'party12': 266,
      'party13': 265,
      'party14': 286,
      'party15': 286,
      'party16': 287,
      'party17': 288,
      'party18': 265,
      'party19': 310,
      'party20': 310,
      'party21': 309,
      'party22': 308,
      'party23': 41
    },
    updates: [
      {
        date: '2011-05-26',
        comment: 'The party catalogue is updated',
        localChanges: {
          'catalogues/party.swf': {
            'en': 'archives:MedievalParty2011CatalogParty2.swf'
          },
        }
      }
    ]
  },
  {
    name: 'Music Jam',
    date: '2011-06-16',
    end: '2011-07-05',
    roomChanges: {
      'town': 'archives:RoomsTown-MusicJam2011.swf',
      'rink': 'archives:MusicJam2011Rink.swf',
      'forts': 'archives:MusicJam2011Forts.swf',
      'village': 'archives:MusicJam2011Village.swf',
      'plaza': 'archives:MusicJam2011Plaza.swf',
      'pizza': 'archives:MusicJam2011Pizza.swf',
      'dance': 'archives:MusicJam2011Dance.swf',
      'mine': 'archives:MusicJam2011Mine.swf',
      'light': 'archives:MusicJam2011Light.swf',
      'beach': 'archives:MusicJam2011Beach.swf',
      'forest': 'archives:MusicJam2011Forest.swf',
      'dock': 'archives:MusicJam2011Dock.swf',
      'lounge': 'archives:MusicJam2011Lounge.swf',
      'coffee': 'archives:MusicJam2011Coffee.swf',
      'cave': 'archives:MusicJam2011Cave.swf',
      'berg': 'archives:MusicJam2011Berg.swf',
      'cove': 'archives:MusicJam2011Cove.swf',
      'party': 'archives:MusicJam2011Party.swf',
      'party2': 'archives:MusicJam2011Party2.swf',
      'party3': 'archives:MusicJam2011Party3.swf',
      'party4': 'archives:MusicJam2011Party4.swf'
    },
    music: {
      'town': 271,
      coffee: 0,
      'plaza': 271,
      'pizza': 271,
      'forts': 271,
      'party3': 271,
      'dance': 242,
      'rink': 240,
      'mine': 247,
      village: 292
    },
    startscreens: [
      'archives:MusicJam2011BillboardMusic_jam2.swf'
    ],
    localChanges: {
      'close_ups/poster.swf': {
        'en': ['archives:MusicJam2011Poster.swf', 'party_poster']
      },
      'catalogues/party.swf': {
        'en': [ 'archives:MusicJam2011CatalogParty.swf', 'party_catalogue' ]
      },
      'catalogues/party2.swf': {
        'en': [ 'archives:MusicJam2011CatalogParty2.swf', 'party2_catalogue' ]
      },
      'catalogues/party3.swf': {
        'en': [ 'archives:MusicJam2011CatalogParty3.swf', 'party3_catalogue' ]
      },
      'membership/party2.swf': {
        'en': [ 'archives:MusicJam2011MembershipParty2.swf', 'oops_party2_room', 'oops_party3_room', 'oops_party4_room' ]
      }
    },
    roomMemberStatus: {
      'party2': true,
      'party3': true,
      'party4': true
    },
      construction: {
      date: '2011-06-09',
      changes: {
        'beach': 'archives:RoomsBeach-MusicJam2010Pre.swf',
        'coffee': 'archives:RoomsCoffee-MusicJam2010Pre.swf',
        'cove': 'archives:RoomsCove-MusicJam2010Pre.swf',
        'dock': 'archives:RoomsDock-MusicJam2010Pre.swf',
        'forest': 'archives:RoomsForest-MusicJam2010Pre.swf',
        'berg': 'archives:RoomsBerg-MusicJam2010Pre.swf',
        'village': 'recreation:mjam_11_const/village.swf',
        'forts': 'archives:RoomsForts-MusicJam2010Pre.swf'
      }
    }
  },
  {
    name: 'Island Adventure Party',
    date: Update.ISLAND_ADVENTURE_11_START,
    end: '2011-08-04',
    construction: {
      date: '2011-07-14',
      changes: {
        'town': 'archives:RoomsTown-IslandAdventureParty2010Pre.swf',
        'beach': 'archives:IslandAdventureParty2011ConstBeach.swf',
        'plaza': 'archives:IslandAdventureParty2011ConstPlaza.swf',
        'cove': 'archives:IslandAdventureParty2011ConstCove.swf'
      }
    },
    roomChanges: {
      'town': 'archives:RoomsTown-IslandAdventureParty2011.swf',
      'plaza': 'archives:IslandAdventureParty2011Plaza.swf',
      'forts': 'archives:IslandAdventureParty2011Forts.swf',
      'forest': 'archives:IslandAdventureParty2011Forest.swf',
      'village': 'archives:IslandAdventureParty2011Village.swf',
      'dock': 'archives:IslandAdventureParty2011Dock.swf',
      'pizza': 'archives:IslandAdventureParty2011Pizza.swf',
      'cove': 'archives:IslandAdventureParty2011Cove.swf',
      'berg': 'archives:IslandAdventureParty2011Berg.swf',
      'beach': 'archives:IslandAdventureParty2011Beach.swf',
      'dance': 'archives:IslandAdventureParty2011Dance.swf',
      'lake': 'archives:IslandAdventureParty2011Lake.swf',
      'shiphold': 'archives:IslandAdventureParty2011Shiphold.swf',
      'party': 'archives:IslandAdventureParty2011Party.swf',
      'party2': 'archives:IslandAdventureParty2011Party2.swf'
    },
    music: {
      'forest': 290,
      'beach': 41,
      'dock': 41,
      'town': 268,
      'dance': 269,
      'party': 267,
      'party2': 289,
      'forts': 291,
      'shiphold': 291,
      'plaza': 291,
      'pizza': 291,
      'cove': 291,
      'lake': 291,
      'village': 291,
      'berg': 291
    },
    activeMigrator: 'archives:Jul2011Pirate.swf',
    mapNote: 'archives:IslandAdventureParty2011Party_map_note.swf',
    localChanges: {
      'close_ups/poster.swf': {
        'en': [ 'archives:IslandAdventureParty2011Party_poster.swf', 'party_poster' ]
      },
      'close_ups/christmasposter.swf': {
        'en': [ 'archives:IslandAdventureParty2011Party_poster2.swf', 'party_poster2' ]
      },
      'close_ups/poster3.swf': {
        'en': [ 'archives:IslandAdventureParty2011Party_poster3.swf', 'party_poster3' ]
      },
      'membership/party1.swf': {
        'en': [ 'archives:IslandAdventureParty2011MembershipParty1.swf', 'oops_party1_catalog' ]
      },
      'membership/party2.swf': {
        'en': [ 'archives:IslandAdventureParty2011MembershipParty2.swf', 'oops_party2_room' ]
      },
      'catalogues/party.swf': {
        'en': ['archives:IslandAdventureParty2011CatalogParty.swf', 'party_catalogue']
      },
      'close_ups/party_note01.swf': {
        'en': 'archives:IslandAdventureParty2011Party_note01.swf'
      },
      'close_ups/party_note02.swf': {
        'en': 'archives:IslandAdventureParty2011Party_note02.swf'
      },
      'close_ups/party_note03.swf': {
        'en': 'archives:IslandAdventureParty2011Party_note03.swf'
      },
      'close_ups/party_note04.swf': {
        'en': 'archives:IslandAdventureParty2011Party_note04.swf'
      },
      'close_ups/party_note05.swf': {
        'en': 'archives:IslandAdventureParty2011Party_note05.swf'
      },
      'close_ups/party_note06.swf': {
        'en': ['archives:IslandAdventureParty2011Party_note06.swf', 'party_note06']
      }
    },
    roomMemberStatus: {
      'party2': true
    },
    startscreens: [
      'archives:LoginIslandAdventureParty2011.swf'
    ]
  },
  {
    name: 'Battle of Doom',
    date: Update.BATTLE_DOOM_START,
    end: Update.BATTLE_DOOM_END,
    roomChanges: {
      village: 'archives:BattleofDoomVillage.swf',
      agentlobbysolo: 'archives:BattleofDoomAgentlobbysolo.swf',
      agentlobbymulti: 'archives:BattleofDoomAgentlobbymulti.swf',
      party: 'archives:BattleofDoomParty.swf'
    },
    localChanges: {
      'herbert_taunt.swf': {
        en: [ 'archives:ENBattleofDoomHerbertTaunt.swf', 'herbert_taunt' ]
      },
      'herbert_taunt2.swf': {
        en: [ 'archives:ENBattleofDoomHerbertTaunt2.swf', 'herbert_taunt_defeated' ]
      },
      'close_ups/party_op_medals_earned.swf': {
        en: [ 'svanilla:media/play/v2/content/local/en/close_ups/party_op_medals_earned.swf', 'party_op_medals_earned' ]
      }
    },
    updates: [
      {
        date: '2011-06-06',
        comment: 'The Battle of Doom is no longer playable',
        roomChanges: {
          party: 'archives:BattleofDoomParty2.swf'
        },
        music: {
          party: 0
        }
      }
    ],
    music: {
      party: 125
    }
  },
  { name: 'Great Snow Race', 
    date: Update.GREAT_SNOW_RACE_START, 
    end: Update.GREAT_SNOW_RACE_END, 
    construction: { 
      date: '2011-08-18', 
      changes: { 
        village: 
        'archives:TheGreatSnowRaceConstVillage.swf' 
      } 
    }, 
    roomChanges: 
    { 'town': 'archives:RoomsTown-GreatSnowRace.swf', 
      'plaza': 'archives:TheGreatSnowRacePlaza.swf', 
      'village': 'archives:TheGreatSnowRaceVillage.swf', 
      'party1': 'archives:TheGreatSnowRaceParty1.swf', 
      'party2': 'archives:TheGreatSnowRaceParty2.swf', 
      'party3': 'archives:TheGreatSnowRaceParty3.swf', 
      'party4': 'archives:TheGreatSnowRaceParty4.swf', 
      'party5': 'archives:TheGreatSnowRaceParty5.swf', 
      'party6': 'archives:TheGreatSnowRaceParty6.swf', 
      'party7': 'archives:TheGreatSnowRaceParty7.swf', 
      'party8': 'archives:TheGreatSnowRaceParty8.swf', 
      'party9': 'archives:TheGreatSnowRaceParty9.swf', 
      'party10': 'archives:TheGreatSnowRaceParty10.swf' 
    }, 
    music: { 
      'party2': 294, 
      'party3': 295, 
      'party4': 295, 
      'party5': 295, 
      'party6': 256 
    }, 
    localChanges: { 
      'close_ups/poster.swf': { 
        'en': ['archives:TheGreatSnowRacePoster.swf', 'poster'] 
      }, 
      'catalogues/party.swf': { 
        'en': ['archives:TheGreatSnowRaceCatalogParty.swf', 'party_catalogue'] 
      },
      'close_ups/party_note02.swf': {
        'en': 'recreation:great_snow_race/party_note02.swf'
      },
      'close_ups/party_note03.swf': {
        'en': 'recreation:great_snow_race/party_note03.swf'
      },
      'close_ups/party_note04.swf': {
        'en': 'recreation:great_snow_race/party_note04.swf'
      },
      'close_ups/party_note05.swf': {
        'en': 'recreation:great_snow_race/party_note05.swf'
      }
    },
    mapNote: 'archives:TheGreatSnowRaceParty_map_note.swf',
    permanentChanges: {
      // placeholder, this is the first instance of the modern sled racing being necessary
      generalChanges: {
        'play/v2/games/sled/SledRacer.swf': 'svanilla:media/play/v2/games/sled/SledRacer.swf'
      }
    },
    newWaddleRooms: [
      {
        waddleId: 104,
        roomId: 855,
        seats: 4,
        game: 'sled'
      }
    ]
  },
  {
    name: 'The Fair',
    date: '2011-09-22',
    end: '2011-10-05',
    roomChanges: {
      beach: 'archives:TheFair2011Beach.swf',
      beacon: 'archives:TheFair2011Beacon.swf',
      party: 'archives:TheFair2011Party.swf',
      coffee: 'archives:TheFair2011Coffee.swf',
      cove: 'archives:TheFair2011Cove.swf',
      dock: 'archives:TheFair2011Dock.swf',
      forest: 'archives:TheFair2011Forest.swf',
      party2: 'archives:TheFair2011Party2.swf',
      party3: 'archives:TheFair2011Party3.swf',
      berg: 'archives:TheFair2011Berg.swf',
      dance: 'archives:TheFair2011Dance.swf',
      pizza: 'archives:TheFair2011Pizza.swf',
      plaza: 'archives:TheFair2011Plaza.swf',
      mtn: 'archives:TheFair2011Mtn.swf',
      village: 'archives:TheFair2011Village.swf',
      forts: 'archives:TheFair2011Forts.swf',
      rink: 'archives:TheFair2011Rink.swf',
      town: 'archives:RoomsTown-TheFair2011.swf',
    },
    music: {
      town: 297,
      dock: 297,
      village: 297,
      forest: 297,
      party3: 221,
      coffee: 221,
      pizza: 221,
      party: 221,
      beach: 297,
      beacon: 297,
      cove: 297,
      berg: 297,
      dance: 243,
      plaza: 297,
      mtn: 297,
      forts: 297,
      rink: 311
    },
    localChanges: {
      'catalogues/prizebooth.swf': {
        en: 'archives:TheFair2011Prizebooth.swf'
      },
      'catalogues/prizeboothmember.swf': {
        en: 'archives:TheFair2011Prizeboothmember.swf'
      },
      'membership/party2.swf': {
        en: ['archives:TheFair2011MembershipParty2.swf', 'oops_party3_room']
      },
      'close_ups/poster.swf': {
        en: ['archives:Fair2010Poster.swf', 'poster']
      }
    },
    roomMemberStatus: {
      party3: true
    },
    startscreens: [ 'archives:TheFair2011StartBillboards.swf' ],
    updates: [
      {
        comment: 'The prize booths are updated',
        date: '2011-09-29',
        localChanges: {
          'catalogues/prizebooth.swf': {
            en: 'archives:TheFair2011Prizebooth2.swf'
          },
          'catalogues/prizeboothmember.swf': {
            en: 'archives:TheFair2011Prizeboothmember2.swf'
          }
        }
      }
    ],
    fairCpip: {
      iconFileId: 'archives:Ticket_icon-TheFair2010.swf',
      infoFile: 'archives:Tickets-TheFair2009.swf'
    },
    mapNote: 'archives:TheFair2011Party_map_note.swf',
  },
  {
    name: 'Halloween Party',
    date: Update.HALLOWEEN_2011_START,
    end: '2011-11-03',
    roomChanges: {
      beach: 'archives:HalloweenParty2011Beach.swf',
      beacon: 'archives:HalloweenParty2011Beacon.swf',
      book: 'archives:HalloweenParty2011Book.swf',
      cave: 'archives:HalloweenParty2011Cave.swf',
      coffee: 'archives:HalloweenParty2011Coffee.swf',
      cove: 'archives:HalloweenParty2011Cove.swf',
      lounge: 'archives:HalloweenParty2011Lounge.swf',
      dock: 'archives:HalloweenParty2011Dock.swf',
      dojo: 'archives:HalloweenParty2011Dojo.swf',
      dojoext: 'archives:HalloweenParty2011Dojoext.swf',
      dojofire: 'archives:HalloweenParty2011Dojofire.swf',
      forest: 'archives:HalloweenParty2011Forest.swf',
      shop: 'archives:HalloweenParty2011Shop.swf',
      berg: 'archives:HalloweenParty2011Berg.swf',
      light: 'archives:HalloweenParty2011Light.swf',
      attic: 'archives:HalloweenParty2011Attic.swf',
      shack: 'archives:HalloweenParty2011Shack.swf',
      dance: 'archives:HalloweenParty2011Dance.swf',
      dojohide: 'archives:HalloweenParty2011Dojohide.swf',
      pet: 'archives:HalloweenParty2011Pet.swf',
      pizza: 'archives:HalloweenParty2011Pizza.swf',
      plaza: 'archives:HalloweenParty2011Plaza.swf',
      mtn: 'archives:HalloweenParty2011Mtn.swf',
      lodge: 'archives:HalloweenParty2011Lodge.swf',
      village: 'archives:HalloweenParty2011Village.swf',
      forts: 'archives:HalloweenParty2011Forts.swf',
      rink: 'archives:HalloweenParty2011Rink.swf',
      town: 'archives:RoomsTown-HalloweenParty2011.swf',
      party1: 'archives:HalloweenParty2011Party1.swf',
      party2: 'archives:HalloweenParty2011Party2.swf',
      party3: 'archives:HalloweenParty2011Party3.swf',
      party4: 'archives:HalloweenParty2011Party4.swf',
      party5: 'archives:HalloweenParty2011Party5.swf',
      party6: 'archives:HalloweenParty2011Party6.swf',
      party7: 'archives:HalloweenParty2011Party7.swf'
    },
    localChanges: {
      'close_ups/party_poster.swf': {
        'en': ['archives:HalloweenParty2011Poster.swf', 'party_poster']
      },
      'catalog/party.swf': {
        en: [ 'archives:HalloweenParty2011CatalogParty.swf', 'party_catalogue' ]
      },
      'membership/party3.swf': {
        'en': ['archives:HalloweenParty2011NoticeParty3.swf', 'oops_party3_room']
      }
    },
    roomMemberStatus: {
      party3: true
    },
    globalChanges: {
      'scavenger_hunt/scavenger_hunt.swf': 'archives:CandyGhostScavengerHuntScavenger_hunt.swf',
      'rooms/NOTLS3EN.swf': 'archives:RoomsNOTLS3EN-HalloweenParty2009.swf'
    },
    startscreens: [ 'archives:HalloweenParty2011PreStartBillboards.swf', 'archives:HalloweenParty2011StartBillboards.swf' ],
    scavengerHunt2011: {
      icon: 'archives:CandyGhostScavengerHuntScavenger_hunt_icon.swf',
      global: {
        member: false,
        reward: 9114
      },
      lang: {
        en: {
          loading: 'Loading Scavenger Hunt',
          title: 'CATCH THE CANDY GHOSTS',
          start: '',
          itemsFound: '%num% GHOST CAUGHT',
          itemsFoundPlural: '%num% GHOSTS CAUGHT',
          claim: 'Claim Prize',
          continue: 'Continue',
          clues: [
            'SEARCH NEAR SAND AND SURF.',
            'HEAD TO A SPOOKY HOUSE.',
            'MAKE YOUR WAY TO A WOODEN SHACK.',
            'FIND A POPULAR SPOT FOR TOUR GUIDES.',
            'SEEK OUT A SNOWY SLOPE',
            'WANDER INTO THE WOODS',
            'LOOK TOWARD A TOWER OF LIGHT.',
            'BE ON THE LOOKOUT FOR A BOAT.'
          ]
        }
      }
    },
    music: {
      town: 251,
      coffee: 252,
      book: 252,
      dance: 223,
      lounge: 223,
      shop: 252,
      forts: 251,
      rink: 251,
      plaza: 251,
      pet: 252,
      pizza: 253,
      forest: 251,
      party3: 299,
      party4: 300,
      party7: 300,
      party5: 298,
      party2: 312,
      party1: 251,
      party6: 253,
      cove: 251,
      dock: 251,
      beach: 251,
      light: 252,
      beacon: 251,
      dojoext: 251,
      dojo: 252,
      dojohide: 251,
      berg: 251,
      cave: 252,
      dojofire: 251,
      mtn: 251,
      lodge: 252,
      village: 251,
      attic: 252,
      shack: 251
    }
  },
  {
    name: '6th Anniversary Party',
    date: '2011-10-23',
    end: '2011-10-28',
    roomChanges: {
      town: 'archives:RoomsTown-6thAnniversaryParty.swf',
      coffee: 'archives:6thAnniversaryPartyCoffee.swf',
      book: 'archives:6thAnniversaryPartyBook.swf'
    },
    startscreens: [ 'archives:6AnniversaryPStartBillboards.swf' ]
  },
  {
    name: 'Card-Jitsu Party',
    date: '2011-11-24',
    end: '2011-12-08',
    startscreens: [ 'archives:CardJitsuPartyPreStartBillboards.swf', 'archives:BillboardsCard-jitsu-party.swf' ],
    mapNote: 'archives:Card-JitsuPartyParty_map_note.swf',
    roomChanges: {
      beach: 'archives:Card-JitsuPartyBeach.swf',
      coffee: 'archives:Card-JitsuPartyCoffee.swf',
      cove: 'archives:Card-JitsuPartyCove.swf',
      lounge: 'archives:Card-JitsuPartyLounge.swf',
      dock: 'archives:Card-JitsuPartyDock.swf',
      forest: 'archives:Card-JitsuPartyForest.swf',
      dance: 'archives:Card-JitsuPartyDance.swf',
      party1: 'archives:Card-JitsuPartyParty1.swf',
      pizza: 'archives:Card-JitsuPartyPizza.swf',
      plaza: 'archives:Card-JitsuPartyPlaza.swf',
      forts: 'archives:Card-JitsuPartyForts.swf',
      rink: 'archives:Card-JitsuPartyRink.swf',
      stage: 'archives:11242011Stage.swf',
      town: 'archives:RoomsTown-CardJitsuParty.swf'
    },
    music: {
      rink: 116,
      beach: 313,
      coffee: 314,
      cove: 313,
      lounge: 314,
      dock: 313,
      forest: 313,
      dance: 314,
      party1: 314,
      pizza: 314,
      plaza: 313,
      forts: 313,
      stage: 313,
      town: 313
    },
    localChanges: {
      'prompts/cardjitsu_duringparty.swf': {
        en: 'archives:Card-JitsuPartyCardjitsu_duringparty.swf'
      }
    },
    construction: {
      date: '2011-11-17',
      changes: {
        plaza: 'archives:Card-JitsuPartyConsPlaza.swf',
        rink: 'archives:Card-JitsuPartyConsRink.swf',
        town: 'archives:RoomsTown-CardJitsuPartyPre.swf'
      },
      startscreens: ['archives:StartBillboardsCardJitsuPartyPre.swf']
    },
    newWaddleRooms: [
      {
        waddleId: 200,
        roomId: 801,
        seats: 2,
        game: 'card'
      },
      {
        waddleId: 201,
        roomId: 801,
        seats: 2,
        game: 'card'
      },
      {
        waddleId: 202,
        roomId: 801,
        seats: 2,
        game: 'card'
      }
    ],
    consequences: {
      roomChanges: {
        dock: 'archives:RoomsDock.swf',
        beach: 'archives:RoomsBeach.swf',
        beacon: 'archives:RoomsBeacon3.swf',
        village: 'archives:RoomsVillage_3.swf',
        forest: 'archives:RoomsForest_4.swf',
        cove: 'archives:RoomsCove_2.swf',
        berg: 'archives:RoomsBerg-Dec2011.swf',
        shack: 'archives:RoomsShack-September2010.swf',
        dojoext: 'archives:RoomsDojoext_4.swf',
        dojofire: 'archives:RoomsFireDojo_2.swf',
        dojohide: 'archives:RoomsDojohide_4.swf'
      }
    }
  },
  {
    name: 'Holiday Party',
    date: Update.HOLIDAY_11_START,
    end: '2011-12-29',
    roomChanges: {
      party2: 'archives:HolidayParty2011Party2.swf',
      beach: 'archives:HolidayParty2011Beach.swf',
      beacon: 'archives:HolidayParty2011Beacon1.swf',
      book: 'archives:HolidayParty2011Book.swf',
      shipquarters: 'archives:HolidayParty2011ShipQuarters.swf',
      coffee: 'archives:HolidayParty2011Coffee.swf',
      cove: 'archives:HolidayParty2011Cove.swf',
      shipnest: 'archives:HolidayParty2011ShipNest.swf',
      lounge: 'archives:HolidayParty2011Lounge.swf',
      dock: 'archives:HolidayParty2011Dock.swf',
      dojo: 'archives:HolidayParty2011Dojo.swf',
      dojoext: 'archives:HolidayParty2011DojoExt.swf',
      dojofire: 'archives:HolidayParty2011DojoFire.swf',
      forest: 'archives:HolidayParty2011Forest.swf',
      shop: 'archives:HolidayParty2011Shop.swf',
      berg: 'archives:HolidayParty2011Berg.swf',
      light: 'archives:HolidayParty2011Light1.swf',
      attic: 'archives:HolidayParty2011Attic.swf',
      party: 'archives:HolidayParty2011Party.swf',
      shack: 'archives:HolidayParty2011Shack.swf',
      dance: 'archives:HolidayParty2011Dance.swf',
      dojohide: 'archives:HolidayParty2011DojoHide.swf',
      ship: 'archives:HolidayParty2011Ship.swf',
      pizza: 'archives:HolidayParty2011Pizza.swf',
      plaza: 'archives:HolidayParty2011Plaza.swf',
      shiphold: 'archives:HolidayParty2011ShipHold.swf',
      mtn: 'archives:HolidayParty2011Mtn.swf',
      lodge: 'archives:HolidayParty2011Lodge.swf',
      village: 'archives:HolidayParty2011Village.swf',
      forts: 'archives:HolidayParty2011Forts.swf',
      rink: 'archives:HolidayParty2011Rink.swf',
      town: 'archives:RoomsTown-HolidayParty2011.swf'
    },
    startscreens: [ 'archives:HolidayParty2011PreStartBillboards.swf', 'archives:HolidayParty2011StartBillboards.swf' ],
    localChanges: {
      'close_ups/party_poster.swf': {
        en: ['archives:HolidayParty2011MagicSleighRide.swf', 'party_poster']
      },
      'close_ups/party_poster2.swf': {
        en: ['archives:HolidayParty2011Bakery.swf', 'party_poster2']
      },
      'close_ups/donation.swf': {
        en: ['archives:CFC2011Donation.swf', 'coins_for_change']
      },
      'close_ups/advent_note_dec15.swf': {
        en: 'archives:HolidayParty2011AdventNoteDec15.swf'
      },
      'close_ups/advent_note_dec16.swf': {
        en: 'archives:HolidayParty2011AdventNoteDec16.swf'
      },
      'close_ups/advent_note_dec17.swf': {
        en: 'archives:HolidayParty2011AdventNoteDec17.swf'
      },
      'close_ups/advent_note_dec18.swf': {
        en: 'archives:HolidayParty2011AdventNoteDec18.swf'
      },
      'close_ups/advent_note_dec19.swf': {
        en: 'archives:HolidayParty2011AdventNoteDec19.swf'
      },
      'close_ups/advent_note_dec20.swf': {
        en: 'archives:HolidayParty2011AdventNoteDec20.swf'
      },
      'close_ups/advent_note_dec21.swf': {
        en: 'archives:HolidayParty2011AdventNoteDec21.swf'
      },
      'close_ups/advent_note_dec22.swf': {
        en: 'archives:HolidayParty2011AdventNoteDec22.swf'
      },
      'close_ups/advent_note_dec23.swf': {
        en: 'archives:HolidayParty2011AdventNoteDec23.swf'
      },
      'close_ups/advent_note_dec24.swf': {
        en: 'archives:HolidayParty2011AdventNoteDec24.swf'
      },
      'close_ups/advent_note_dec25.swf': {
        en: 'archives:HolidayParty2011AdventNoteDec25.swf'
      },
      'membership/party2.swf': {
        en: ['archives:HolidayParty2011Membership2.swf', 'oops_party2_room']
      }
    },
    updates: [
      {
        date: '2011-12-16',
        comment: 'A new item of the Advent Calendar is available'
      },
      {
        date: '2011-12-17',
        comment: 'A new item of the Advent Calendar is available'
      },
      {
        date: '2011-12-18',
        comment: 'A new item of the Advent Calendar is available'
      },
      {
        date: '2011-12-19',
        comment: 'A new item of the Advent Calendar is available'
      },
      {
        date: '2011-12-20',
        comment: 'A new item of the Advent Calendar is available'
      },
      {
        date: '2011-12-21',
        comment: 'A new item of the Advent Calendar is available'
      },
      {
        date: '2011-12-22',
        comment: 'A new item of the Advent Calendar is available'
      },
      {
        date: '2011-12-23',
        comment: 'A new item of the Advent Calendar is available'
      },
      {
        date: '2011-12-24',
        comment: 'A new item of the Advent Calendar is available'
      },
      {
        date: '2011-12-25',
        comment: 'A new item of the Advent Calendar is available'
      },
    ],
    mapNote: 'archives:HolidayParty2011Party_map_note.swf',
    music: {
      party2: 315,
      beach: 254,
      beacon: 254,
      book: 227,
      shipquarters: 255,
      coffee: 227,
      cove: 254,
      shipnest: 254,
      lounge: 255,
      dock: 254,
      dojo: 254,
      dojoext: 254,
      dojofire: 254,
      forest: 254,
      shop: 255,
      pet: 255,
      berg: 227,
      attic: 254,
      party: 281,
      shack: 254,
      dance: 255,
      dojohide: 254,
      ship: 254,
      pizza: 255,
      plaza: 254,
      shiphold: 255,
      mtn: 254,
      lodge: 255,
      village: 254,
      forts: 254,
      rink: 254,
      town: 254
    },
    activeMigrator: 'archives:Dec2011Pirate.swf',
    construction: {
      date: '2011-12-08',
      changes: {
        beach: 'archives:HolidayParty2011ConsBeach.swf',
        town: 'archives:RoomsTown-HolidayParty2011Pre.swf'
      }
    }
  }
];