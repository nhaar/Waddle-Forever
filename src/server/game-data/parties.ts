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
    name: 'Beta Test Party',
    date: Update.BETA_PARTY,
    end: '2005-09-22',
    roomChanges: {
      'town': 'fix:Town-party.swf'
    },
    music: {
      town: 2
    }
  },
  {
    name: 'Halloween Party 2005',
    date: '2005-10-27',
    end: '2005-11-01',
    roomChanges: {
      'book': 'fix:Book2_03_halloween.swf',
      'dance': 'fix:Dance1b_halloween.swf',
      'lounge': 'fix:Lounge1_halloween.swf',
      'dojo': 'fix:Dojo_halloween.swf',
      'rink': 'fix:Icerink_halloween.swf',
      'town': 'fix:Town_halloween.swf'
    }
  },
  {
    name: 'The Great Puffle Discovery',
    date: '2005-11-15',
    end: '2005-12-05',
    roomChanges: {
      'dance': 'fix:Dance1b_pet.swf',
      'forts': 'fix:Forts_pet.swf',
      'rink': 'fix:Icerink_pet.swf'
    }
  },
  {
    name: 'Christmas Party 2005',
    date: '2005-12-22',
    end: Update.CHRISTMAS_2005_ENDS,
    roomChanges: {
      'coffee': 'fix:CP05Coffee.swf',
      'dance': 'fix:CP05Dance.swf',
      'lodge': 'fix:CP05Lodge.swf',
      'rink': 'fix:CP05Rink.swf',
      'shop': 'fix:CP05Shop.swf',
      'town': 'fix:CP05Town.swf',
      'village': 'fix:CP05Village.swf'
    },
    music: {
      'town': 200,
      'coffee': 200,
      'dance': 200,
      'shop': 200,
      'village': 200,
      'lodge': 200,
      'rink': 200
    },
    permanentChanges: {
      roomChanges: {
        // lodge is now accessible
        village: 'archives:ArtworkRoomsVillage11.swf'
      }
    }
  },
  {
    startComment: 'A new years celebration is held at the Town',
    date: '2005-12-31',
    end: '2006-01-01',
    roomChanges: {
      town: 'fix:ArtworkRoomsTown-newyears.swf'
    }
  },
  {
    name: 'Valentine\'s Day Celebration',
    date: '2006-02-14',
    end: '2006-02-15',
    roomChanges: {
      'dance': 'archives:ArtworkRooms0214Dance.swf',
      'lounge': 'archives:ArtworkRooms0214Lounge.swf'
    }
  },
  {
    name: 'Winter Luau',
    date: '2006-01-27',
    end: '2006-01-29',
    roomChanges: {
      dance: 'recreation:winter_luau/dance.swf',
      dock: 'recreation:winter_luau/dock.swf',
      forts: 'recreation:winter_luau/forts.swf',
      town: 'recreation:winter_luau/town.swf'
    },
    music: {
      dock: 11,
      forts: 11,
      town: 11,
      dance: 10
    }
  },
  {
    name: 'Pizza Parlor Opening Party',
    date: Update.PIZZA_PARLOR_OPENING_START,
    end: Update.PIZZA_PARLOR_OPENING_END,
    roomChanges: {
      'forts': 'archives:ArtworkRoomsForts11.swf',
      'pizza': 'archives:ArtworkRoomsPizza10.swf',
      'town': 'archives:ArtworkRoomsTown13.swf'
    },
    music: {
      'plaza': 2
    },
    roomFrames: {
      'town': 2
    },
    consequences: {
      roomChanges: {
        // now has path to the plaza
        forts: 'archives:ArtworkRoomsForts12.swf'
      },
      map: 'approximation:map_plaza_no_berg.swf'
    }
  },
  {
    name: 'St. Patrick\'s Day Party',
    date: Update.PET_SHOP_RELEASE,
    startComment: 'A celebration for St. Patrick\'s Day and Puffles starts',
    endComment: 'The St. Patrick\'s Day and Puffle party ends',
    end: '2006-03-20',
    roomChanges: {
      'village': 'archives:ArtworkRooms0401Village.swf',
      'plaza': 'archives:ArtworkRoomsPlaza11.swf',
      'town': 'archives:ArtworkRoomsTown12.swf'
    },
    roomFrames: {
      'village': 2
    }
  },
  {
    name: 'April Fools Party 2006',
    date: '2006-03-31',
    end: '2006-04-03',
    roomChanges: {
      'dojo': 'archives:ArtworkRooms0401Dojo.swf',
      'rink': 'archives:ArtworkRooms0401Rink.swf',
      'dance': 'archives:ArtworkRooms0401Dance.swf',
      'plaza': 'archives:ArtworkRoomsPlaza13.swf',
      'lodge': 'archives:ArtworkRooms0401Lodge.swf',
      'village': 'archives:ArtworkRooms0401Village.swf',
      'forts': 'archives:ArtworkRooms0401Forts.swf',
      'town': 'archives:ArtworkRooms0401Town.swf'
    },
    generalChanges: {
      'chat291.swf': 'unknown:chat291.swf'
    },
    music: {
      'dance': 201,
      'forts': 201,
      'rink': 201,
      'town': 201,
      'plaza': 201
    },
    roomFrames: {
      'plaza': 3
    }
  },
  {
    name: 'Easter Egg Hunt 2006',
    date: Update.EGG_HUNT_2006_START,
    end: Update.EGG_HUNT_2006_END,
    roomChanges: {
      'book': 'archives:ArtworkRooms0416Book10.swf',
      'berg': 'archives:ArtworkRooms0416Berg10.swf',
      'dance': 'archives:ArtworkRooms0416Dance10.swf',
      'pet': 'archives:ArtworkRooms0416Pet11.swf',
      'mtn': 'archives:ArtworkRooms0416Mtn10.swf',
      'lodge': 'archives:ArtworkRooms0416Lodge11.swf',
      'village': 'archives:ArtworkRooms0416Village12.swf',
      'forts': 'archives:ArtworkRooms0416Forts12.swf'
    }
  },
  {
    name: 'Underground Opening Party',
    date: Update.CAVE_OPENING_START,
    end: Update.CAVE_OPENING_END,
    roomChanges: {
      'mine': 'archives:ArtworkRoomsMine10.swf',
      boiler: 'recreation:cave_opening/boiler.swf',
      cave: 'recreation:cave_opening/cave.swf',
      plaza: 'recreation:cave_opening/plaza.swf',
      dance: 'recreation:cave_opening/dance.swf'
    },
    roomFrames: {
      mine: 2
    },
    music: {
      'boiler': 203,
      'cave': 202,
      'mine': 203,
      'plaza': 203
    },
    permanentChanges: {
      roomChanges: {
        // manhole path
        plaza: 'archives:ArtworkRoomsPlaza17.swf',
        // green puffle + boiler room trigger
        dance: 'archives:ArtworkRoomsDance14.swf'
      }
    }
  },
  {
    name: 'Summer Party',
    date: Update.SUMMER_PARTY_START,
    end: Update.SUMMER_PARTY_END,
    roomChanges: {
      'beach': 'archives:ArtworkRooms0615Beach10.swf',
      'boiler': 'archives:ArtworkRooms0615Boiler12.swf',
      'dock': 'archives:ArtworkRooms0615Dock12.swf',
      'dojo': 'archives:ArtworkRooms0615Dojo11.swf',
      'berg': 'archives:ArtworkRooms0615Berg11.swf',
      'shack': 'archives:ArtworkRooms0615Shack10.swf',
      'dance': 'archives:ArtworkRooms0615Dance15.swf',
      'plaza': 'archives:ArtworkRooms0615Plaza18.swf',
      'mtn': 'archives:ArtworkRooms0516Mtn11.swf',
      'village': 'archives:ArtworkRooms0615Village12.swf',
      'forts': 'archives:ArtworkRooms0615Forts13.swf',
      'town': 'archives:ArtworkRooms0615Town12.swf'
    },
    music: {
      'beach': 204,
      'boiler': 204,
      'dock': 204,
      'dojo': 204,
      'berg': 204,
      'shack': 204,
      'dance': 204,
      'plaza': 204,
      'mtn': 204,
      'village': 204,
      'forts': 204,
      'town': 204
    },
    updates: [
      {
        date: '2006-06-21',
        comment: 'Two new items are available for the Summer Party',
        roomChanges: {
          'beach': 'archives:ArtworkRooms0615Beach11.swf',
          'plaza': 'archives:ArtworkRooms0615Plaza19.swf'
        }
      }
    ],
    permanentChanges: {
      roomComment: 'More rooms are visible from the HQ',
      roomChanges: {
        // now this has a path to the beach
        village: 'archives:ArtworkRoomsVillage13.swf',
        agent: 'archives:ArtworkRoomsAgent13.swf'
      },
      // beach opens
      map: 'archives:ArtworkMapsIsland10.swf'
    }
  },
  {
    name: 'Western Party',
    date: '2006-07-14',
    end: '2006-07-17',
    roomChanges: {
      plaza: 'archives:ArtworkRoomsPlaza20.swf',
      forts: 'archives:ArtworkRoomsForts14.swf',
      dance: 'archives:ArtworkRoomsDance15.swf',
      town: 'archives:ArtworkRoomsTown14.swf'
    },
    music: {
      // we dont know the exact origins of this but,
      // we know it played, so I assume in every party
      plaza: 55555,
      forts: 55555,
      dance: 55555,
      town: 55555
    },
    roomFrames: {
      plaza: 2,
      forts: 2,
      dance: 2,
      town: 2
    }
  },
  {
    name: 'Band Scavenger Hunt',
    date: '2006-07-21',
    end: '2006-07-23',
    roomChanges: {
      'boiler': 'archives:ArtworkRoomsBoiler11.swf',
      'cave': 'archives:ArtworkRooms0721Cave13.swf',
      'dock': 'archives:ArtworkRooms0721Dock10.swf',
      'mtn': 'archives:ArtworkRooms0721Mtn10.swf',
      'lodge': 'archives:ArtworkRooms0721Lodge14.swf',
      'village': 'archives:ArtworkRooms0721Village12.swf',
      'pet': 'archives:ArtworkRooms0721Pet11.swf',
      'pizza': 'archives:ArtworkRooms0721Pizza13.swf'
    }
  },
  {
    name: 'Sports Party',
    date: Update.SPORT_PARTY_START,
    end: Update.SPORT_PARTY_END,
    roomChanges: {
      'beach': 'archives:ArtworkRoomsBeach13.swf',
      'cave': 'archives:ArtworkRoomsCave14.swf',
      'coffee': 'archives:ArtworkRoomsCoffee12.swf',
      'dock': 'archives:ArtworkRoomsDock14.swf',
      'rink': 'archives:ArtworkRoomsRink20.swf',
      'pizza': 'archives:ArtworkRoomsPizza14.swf',
      'plaza': 'archives:ArtworkRoomsPlaza21.swf',
      'mtn': 'archives:ArtworkRoomsMtn12.swf',
      'village': 'archives:ArtworkRoomsVillage15.swf',
      'forts': 'archives:ArtworkRoomsForts16.swf',
      'town': 'archives:ArtworkRoomsTown15.swf'
    },
    music: {
      'beach': 213,
      'cave': 213,
      'coffee': 213,
      'dock': 213,
      'rink': 213,
      'pizza': 213,
      'plaza': 213,
      'mtn': 213,
      'forts': 213,
      'town': 213,
      'village': 213
    },
    roomFrames: {
      'beach': 2,
      'cave': 2,
      'coffee': 2,
      'dock': 2,
      'rink': 2,
      'pizza': 2,
      'plaza': 2,
      'mtn': 2,
      'village': 3,
      'forts': 2,
      'town': 2
    },
    updates: [
      {
        date: '2006-08-18',
        comment: 'A new item is in the Snow Forts for the Sports Party',
        roomChanges: {
          forts: 'archives:ArtworkRoomsForts17.swf'
        },
        roomFrames: {
          forts: 3
        }
      }
    ],
    consequences: {
      roomComment: 'The pool becomes a part of the undeground after the Sports Party ends',
      roomChanges: {
        cave: 'archives:ArtworkRoomsCave40.swf',
      }
    }
  },
  {
    name: 'Lighthouse Party',
    date: Update.LIGHTHOUSE_PARTY_START,
    end: '2006-09-24',
    roomChanges: {
      light: 'recreation:lighthouse_party_2006/light.swf',
      beacon: 'recreation:lighthouse_party_2006/beacon.swf',
      beach: 'recreation:lighthouse_party_2006/beach.swf'
    },
    roomFrames: {
      'light': 2,
      'beacon': 2
    },
    music: {
      light: 55556,
      beacon: 55556,
      beach: 55557
    },
    permanentChanges: {
      roomChanges: {
        // first room archived with the lighthouse open
        // used for the party since the SWF for the beach in
        // the party is also lost
        beach: 'archives:ArtworkRoomsBeach41.swf'
      }
    }
  },
  {
    name: '1st Anniversary',
    date: '2006-10-24',
    end: '2006-10-25',
    roomChanges: {
      coffee: 'recreation:1st_anniversary_coffee.swf'
    }
  },
  {
    name: 'Halloween Party',
    date: '2006-10-27',
    end: '2006-11-01',
    roomChanges: {
      attic: 'recreation:halloween_2006/attic.swf',
      pizza: 'recreation:halloween_2006/pizza.swf',
      rink: 'recreation:halloween_2006/rink.swf',
      mtn: 'recreation:halloween_2006/mtn.swf',
      shack: 'recreation:halloween_2006/shack.swf',
      village: 'recreation:halloween_2006/village.swf',
      'berg': 'archives:RoomsBerg-HalloweenParty2007.swf',
      plaza: 'recreation:halloween_2006/plaza.swf',
      lodge: 'recreation:halloween_2006/lodge.swf',
      dance: 'recreation:halloween_2006/dance.swf'
    },
    music: {
      'town': 205,
      'rink': 205,
      'mtn': 205,
      'shack': 205,
      'village': 205,
      berg: 205,
      'plaza': 205,
      'lodge': 205,
      'dance': 205
    }
  },
  {
    name: 'Color Party',
    date: '2006-11-24',
    end: '2006-11-27',
    roomChanges: {
      dojo: 'recreation:color_party_2006/dojo.swf'
    },
    music: {
      dojo: 201
    }
  },
  {
    name: 'Winter Fiesta',
    date: '2007-01-19',
    end: '2007-01-22',
    roomChanges: {
      'village': 'archives:Village40.swf'
    },
    music: {
      'village': 206
    }
  },
  {
    name: 'Festival of Snow',
    date: '2007-02-09',
    end: '2007-02-19',
    roomChanges: {
      shack: 'recreation:festival_of_snow/shack.swf',
      berg: 'recreation:festival_of_snow/berg.swf',
      forts: 'recreation:festival_of_snow/forts.swf',
      mtn: 'recreation:festival_of_snow/mtn.swf',
      dance: 'recreation:festival_of_snow/dance.swf',
      beach: 'recreation:festival_of_snow/beach_1.swf',
      plaza: 'recreation:festival_of_snow/plaza.swf',
      dock: 'recreation:festival_of_snow/dock.swf',
      village: 'recreation:festival_of_snow/village.swf',
      light: 'recreation:festival_of_snow/light.swf',
      dojo: 'recreation:festival_of_snow/dojo.swf',
      town: 'recreation:festival_of_snow/town.swf'
    },
    music: {
      dock: 207,
      dojo: 207,
      berg: 207,
      shack: 207,
      plaza: 207,
      forts: 207,
      town: 207,
      beach: 204,
      light: 204,
      mtn: 204,
      village: 204
    },
    updates: [
      {
        date: '2007-02-15',
        comment: 'The Migrator is updated',
        roomChanges: {
          beach: 'recreation:festival_of_snow/beach_2.swf',
        }
      },
      {
        date: Update.ICE_BLOCK_PIN,
        comment: 'The Migrator is gone',
        roomChanges: {
          beach: 'recreation:festival_of_snow/beach_3.swf',
          berg: 'recreation:festival_of_snow/berg_pin.swf'
        }
      }
    ]
  },
  {
    name: 'April Fools\' Party',
    date: '2007-03-30',
    end: '2007-04-02',
    roomChanges: {
      shack: 'recreation:april_fools_2007/shack.swf',
      berg: 'recreation:april_fools_2007/berg.swf',
      mine: 'recreation:april_fools_2007/mine.swf',
      beach: 'recreation:april_fools_2007/beach.swf',
      pizza: 'recreation:april_fools_2007/pizza.swf',
      coffee: 'recreation:april_fools_2007/coffee.swf'
    },
    music: {
      'shack': 201,
      'berg': 201,
      'mine': 201,
      'beach': 201,
      pizza: 201,
      coffee: 201
    }
  },
  {
    name: 'Pirate Party',
    date: '2007-04-27',
    end: '2007-05-04',
    roomChanges: {
      'town': 'archives:RoomsTown-PirateParty2007.swf',
      'dock': 'archives:RoomsDock-PirateParty2007.swf',
      coffee: 'recreation:pirate_party/coffee.swf'
    },
    music: {
      'town': 212,
      'dock': 212
    }
  },
  {
    name: 'Lost Map Hunt',
    date: '2007-05-18',
    end: '2007-05-25',
    roomChanges: {
      mtn: 'recreation:lost_map_hunt/mtn.swf',
      village: 'recreation:lost_map_hunt/village.swf',
      dock: 'recreation:lost_map_hunt/dock.swf',
      town: 'recreation:lost_map_hunt/town.swf',
      forts: 'recreation:lost_map_hunt/forts.swf'
    },
    permanentChanges: {
      roomChanges: {
        plaza: 'archives:ArtworkRoomsPlaza45.swf',
        forest: 'archives:RoomsForest-CoveOpeningPartyPre_1.swf'
      }
    },
    consequences: {
      roomChanges: {
        village: 'recreation:village_precpip_tour.swf'
      }
    },
    scavengerHunt2007: 'recreation:lost_map_hunt/handler.swf',
    generalChanges: {
      'chat506.swf': 'recreation:lost_map_hunt/chat506_edit.swf'
    }
  },
  {
    name: 'Cove Opening Party',
    date: '2007-05-25',
    end: '2007-05-29',
    roomChanges: {
      plaza: 'recreation:cove_opening/plaza.swf',
      forest: 'recreation:cove_opening/forest.swf',
      cove: 'recreation:cove_opening/cove.swf'
    },
    permanentChanges: {
      map: 'archives:ArtworkMaps15.swf',
      roomChanges: {
        cove: 'recreation:cove_after_cove_opening_pre_cpip.swf'
      }
    },
    consequences: {
      roomChanges: {
        plaza: 'recreation:plaza_may07.swf'
      }
    },
    music: {
      'forest': 214,
      'cove': 214
    }
  },
  {
    name: 'Summer Kickoff',
    date: Update.SUMMER_KICKOFF_START,
    end: Update.SUMMER_KICKOFF_END,
    roomChanges: {
      dock: 'recreation:summer_kickoff_2007/dock.swf',
      town: 'recreation:summer_kickoff_2007/town.swf',
      beach: 'recreation:summer_kickoff_2007/beach.swf',
      beacon: 'recreation:summer_kickoff_2007/beacon.swf',
      dojo: 'recreation:summer_kickoff_2007/dojo.swf',
      mtn: 'recreation:summer_kickoff_2007/mtn.swf'
    },
    music: {
      'town': 204,
      'mtn': 204,
      'light': 215,
      'beacon': 215,
      'dojo': 215,
      'beach': 216,
      'dock': 216,
      'berg': 216
    },
    updates: [
      {
        date: Update.SUMMER_KICKOFF_UPDATE,
        comment: 'The beach gets updated for the Summer Kickoff Party',
        roomChanges: {
          beach: 'recreation:summer_kickoff_2007/beach_update.swf'
        }
      }
    ]
  },
  {
    name: 'Water Party',
    date: '2007-07-13',
    end: '2007-07-23',
    roomChanges: {
      dance: 'recreation:water_party_07_dance.swf',
      town: 'recreation:water_party_2007/town.swf',
      forest: 'recreation:water_party_2007/forest.swf',
      mtn: 'recreation:water_party_2007/mtn.swf',
      dojo: 'recreation:water_party_2007/dojo.swf'
    },
    music: {
      dojo: 217,
      town: 218,
      forest: 218,
      mtn: 218
    }
  },
  {
    name: 'Camp Penguin',
    date: '2007-08-24',
    end: '2007-08-27',
    startComment: 'Camp Penguin party begins',
    endComment: 'Camp Penguin party ends',
    roomChanges: {
      'village': 'archives:RoomsVillage-CampPenguin.swf',
      town: 'recreation:camp_penguin/town.swf',
      cove: 'recreation:camp_penguin/cove.swf',
      dock: 'recreation:camp_penguin/dock.swf'
    },
    music: {
      'town': 219,
      'dock': 219,
      'cove': 220,
      'village': 219,
    }
  },
  {
    name: 'Fall Fair',
    date: '2007-09-21',
    end: '2007-10-01',
    roomChanges: {
      'beach': 'archives:RoomsBeach-FallFair2007.swf',
      'beacon': 'archives:RoomsBeacon-FallFair2007.swf',
      'cove': 'archives:RoomsCove-FallFair2007.swf',
      'lounge': 'archives:RoomsLounge-FallFair2007.swf',
      'dock': 'archives:RoomsDock-FallFair2007.swf',
      'forest': 'archives:RoomsForest-FallFair2007.swf',
      'rink': 'archives:RoomsRink-FallFair2007.swf',
      'light': 'archives:RoomsLight-FallFair2007.swf',
      'mine': 'archives:RoomsMine-FallFair2007.swf',
      'dance': 'archives:RoomsDance-FallFair2007.swf',
      'pizza': 'archives:RoomsPizza-FallFair2007.swf',
      'plaza': 'archives:RoomsPlaza-FallFair2007.swf',
      'mtn': 'archives:RoomsMtn-FallFair2007.swf',
      'village': 'archives:RoomsVillage-FallFair2007.swf',
      'forts': 'archives:RoomsForts-FallFair2007.swf',
      'town': 'archives:RoomsTown-FallFair2007.swf'
    },
    music: {
      // music wiki backed
      'town': 221,
      'dance': 221,
      'lounge': 221,
      'forts': 221,
      'plaza': 221,
      'pizza': 221,
      'forest': 221,
      'cove': 221,
      'dock': 221,
      'beach': 221,
      'light': 221,
      'beacon': 221,
      'village': 221,
      'mtn': 221
    },
    generalChanges: {
      'artwork/rooms/0926/PrizeBooth2.swf': 'archives:CataloguesPrizebooth-FallFair2007.swf'
    },
    scavengerHunt2007: 'archives:ContentParty_icon-FallFair2007.swf'
  },
  {
    name: '2nd Anniversary Party',
    date: '2007-10-24',
    end: '2007-10-25',
    roomChanges: {
      'book': 'archives:RoomsBook-2ndAnniversary.swf',
      'coffee': 'archives:RoomsCoffee-2ndAnniversary.swf'
    },
    music: {
      'coffee': 100,
      'book': 100
    }
  },
  {
    name: 'Halloween Party',
    date: '2007-10-26',
    end: '2007-11-01',
    roomChanges: {
      'beach': 'archives:RoomsBeach-HalloweenParty2007.swf',
      'beacon': 'archives:RoomsBeacon-HalloweenParty2007.swf',
      'cave': 'archives:RoomsCave-HalloweenParty2007.swf',
      'coffee': 'archives:RoomsCoffee-HalloweenParty2007.swf',
      'cove': 'archives:RoomsCove-HalloweenParty2007.swf',
      'dock': 'archives:RoomsDock-HalloweenParty2007.swf',
      'forest': 'archives:RoomsForest-HalloweenParty2007.swf',
      'berg': 'archives:RoomsBerg-HalloweenParty2007.swf',
      'light': 'archives:RoomsLight-HalloweenParty2007.swf',
      'attic': 'archives:RoomsAttic-HalloweenParty2007.swf',
      'shack': 'archives:RoomsShack-HalloweenParty2007.swf',
      'dance': 'archives:RoomsDance-HalloweenParty2007.swf',
      'pizza': 'archives:RoomsPizza-HalloweenParty2007.swf',
      'plaza': 'archives:RoomsPlaza-HalloweenParty2007.swf',
      'forts': 'archives:RoomsForts-HalloweenParty2007.swf',
      'rink': 'archives:RoomsRink-HalloweenParty2007.swf',
      'mtn': 'archives:RoomsMtn-HalloweenParty2007.swf',
      'lodge': 'archives:RoomsLodge-HalloweenParty2007.swf',
      'village': 'archives:RoomsVillage-HalloweenParty2007.swf',
      'town': 'archives:RoomsTown-HalloweenParty2007.swf'
    },
    music: {
      // mix of archives + music wiki
      'beach': 223,
      'coffee': 205,
      'cove': 223,
      'dock': 223,
      'forest': 223,
      'berg': 223,
      'shack': 223,
      'dance': 224,
      'pizza': 223,
      'forts': 223,
      'mtn': 223,
      'lodge': 205,
      'village': 223,
      'town': 223,
      'plaza': 223,
      'beacon': 205
    },
    generalChanges: {
      'artwork/tools/binoculars1.swf': 'archives:ContentBinoculars-HalloweenParty2007.swf'
    },
    scavengerHunt2007: 'archives:ContentParty_icon-HalloweenParty2007.swf'
  },
  {
    name: 'Surprise Party',
    date: '2007-11-23',
    end: '2007-11-26',
    roomChanges: {
      'cove': 'archives:RoomsCove-SurpriseParty.swf',
      'dock': 'archives:RoomsDock-SurpriseParty.swf',
      'forest': 'archives:RoomsForest-SurpriseParty.swf',
      'dance': 'archives:RoomsDance-SurpriseParty.swf',
      'plaza': 'archives:RoomsPlaza-SurpriseParty.swf',
      'forts': 'archives:RoomsForts-SurpriseParty.swf',
      'town': 'archives:RoomsTown-SurpriseParty.swf'
    },
    music: {
      // just put music in every room
      'cove': 55555,
      'dock': 55555,
      'forest': 55555,
      'dance': 55555,
      'plaza': 55555,
      'forts': 55555,
      'town': 55555
    }
  },
  {
    name: 'Christmas Party',
    date: Update.CHRISTMAS_2007_START,
    end: '2008-01-02',
    roomChanges: {
      'beach': 'archives:RoomsBeach-ChristmasParty2007.swf',
      'beacon': 'archives:RoomsBeacon-ChristmasParty2007.swf',
      'book': 'archives:RoomsBook-ChristmasParty2007.swf',
      'cove': 'archives:RoomsCove-ChristmasParty2007.swf',
      'dock': 'archives:RoomsDock-ChristmasParty2007.swf',
      'forest': 'archives:RoomsForest-ChristmasParty2007.swf',
      'berg': 'archives:RoomsBerg-ChristmasParty2007.swf',
      'attic': 'archives:RoomsAttic-ChristmasParty2007.swf',
      'dance': 'archives:RoomsDance-ChristmasParty2007.swf',
      'plaza': 'archives:RoomsPlaza-ChristmasParty2007.swf',
      'mtn': 'archives:RoomsMtn-ChristmasParty2007.swf',
      'lodge': 'archives:RoomsLodge-ChristmasParty2007.swf',
      'village': 'archives:RoomsVillage-ChristmasParty2007.swf',
      'forts': 'archives:RoomsForts-ChristmasParty2007.swf',
      'town': 'archives:RoomsTown-ChristmasParty2007.swf'
    },
    music: {
      'beach': 200,
      'beacon': 227,
      'book': 227,
      'cove': 200,
      'dock': 200,
      'forest': 228,
      'berg': 227,
      'attic': 228,
      'dance': 226,
      'plaza': 227,
      'mtn': 228,
      'lodge': 228,
      'village': 228,
      'forts': 227,
      'town': 227
    },
    updates: [
      {
        date: '2007-12-24',
        comment: 'Scarves are now available at the Ski Village',
        roomFrames: {
          village: 2
        }
      }
    ]
  },
  {
    name: 'Winter Fiesta',
    date: Update.WINTER_FIESTA_08_START,
    end: '2008-01-21',
    roomChanges: {
      'coffee': 'archives:RoomsCoffee-WinterFiesta2008.swf',
      'village': 'archives:RoomsVillage-WinterFiesta2008.swf',
      'forts': 'archives:RoomsForts-WinterFiesta2008.swf',
      'town': 'archives:RoomsTown-WinterFiesta2008.swf',
      dance: 'recreation:winter_fiesta_2008/dance.swf',
      dock: 'recreation:winter_fiesta_2008/dock.swf',
      plaza: 'recreation:winter_fiesta_2008/plaza.swf',
    },
    music: {
      'beach': 229,
      'coffee': 229,
      'cove': 229,
      'dock': 229,
      'forest': 229,
      'dance': 229,
      'pizza': 229,
      'plaza': 229,
      'village': 229,
      'forts': 229,
      'town': 229
    }
  },
  {
    name: 'Sub-Marine Party',
    date: '2008-02-15',
    end: '2008-02-22',
    roomChanges: {
      'beach': 'archives:RoomsBeach-SubMarine.swf',
      'beacon': 'archives:RoomsBeacon-SubMarine.swf',
      'book': 'archives:RoomsBook-SubMarine.swf',
      'coffee': 'archives:RoomsCoffee-SubMarine.swf',
      'cove': 'archives:RoomsCove-SubMarine.swf',
      'lounge': 'archives:RoomsLounge-SubMarine.swf',
      'dock': 'archives:RoomsDock-SubMarine.swf',
      forest: 'archives:RoomsForest-SubMarine.swf',
      dance: 'archives:RoomsDance-SubMarine.swf',
      pizza: 'archives:RoomsPizza-SubMarine.swf',
      plaza: 'archives:SubMarinePlaza.swf',
      village: 'archives:RoomsVillage-SubMarine.swf',
      forts: 'archives:RoomsForts-SubMarine.swf',
      town: 'archives:RoomsTown-SubMarine.swf'
    },
    music : {
      town: 230,
      plaza: 230,
      coffee: 230,
      book: 230,
      forts: 230,
      forest: 230,
      cove: 230,
      village: 230,
      beach: 230,
      light: 230,
      beacon: 230,
      dock: 230,
      pizza: 212,
      dance: 202
    }
  },
  {
    name: 'St. Patrick\'s Day Party',
    date: '2008-03-14',
    end: '2008-03-18',
    roomChanges: {
      coffee: 'archives:ArtworkRooms0314Coffee42.swf',
      dock: 'archives:ArtworkRooms0314Dock43.swf',
      forest: 'archives:ArtworkRooms0314Forest42.swf',
      dance: 'archives:ArtworkRooms0314Dance43.swf',
      plaza: 'archives:ArtworkRooms0314Plaza47.swf',
      village: 'archives:ArtworkRooms0314Village43.swf',
      forts: 'archives:ArtworkRooms0314Forts41.swf',
      town: 'archives:ArtworkRooms0314Town40.swf'
    },
    music: {
      coffee: 208,
      dock: 208,
      forest: 208,
      dance: 208,
      plaza: 208,
      village: 208,
      forts: 208,
      town: 208
    }
  },
  {
    name: 'Easter Egg Hunt',
    date: '2008-03-21',
    end: '2008-03-24',
    roomChanges: {
      book: 'archives:RoomsBook-EasterEggHunt2008.swf',
      dock: 'archives:RoomsDock-EasterEggHunt2008.swf',
      dojo: 'archives:RoomsDojo-EasterEggHunt2008.swf',
      shop: 'archives:RoomsShop-EasterEggHunt2008.swf',
      attic: 'archives:RoomsAttic-EasterEggHunt2008.swf',
      mine: 'archives:RoomsMine-EasterEggHunt2008.swf',
      pet: 'archives:RoomsPet-EasterEggHunt2008.swf',
      plaza: 'archives:RoomsPlaza-EasterEggHunt2008.swf'
    },
    scavengerHunt2007: 'archives:Eggs-EasterEggHunt2008.swf'
  },
  {
    name: 'April Fools\' Party',
    date: '2008-03-28',
    end: '2008-04-02',
    roomChanges: {
      beach: 'archives:ArtworkRooms0328Beach46.swf',
      beacon: 'archives:ArtworkRooms0328Beacon42.swf',
      boiler: 'archives:ArtworkRooms0328Boiler43.swf',
      book: 'archives:ArtworkRooms0328Book43.swf',
      coffee: 'archives:ArtworkRooms0328Coffee42.swf',
      lounge: 'archives:ArtworkRooms0328Lounge44.swf',
      dock: 'archives:ArtworkRooms0328Dock43.swf',
      dojo: 'archives:ArtworkRooms0328Dojo41.swf',
      forest: 'archives:ArtworkRooms0328Forest42.swf',
      shop: 'archives:ArtworkRooms0328Shop46.swf',
      berg: 'archives:ArtworkRooms0328Berg42.swf',
      light: 'archives:ArtworkRooms0328Light46.swf',
      attic: 'archives:ArtworkRooms0328Attic42.swf',
      shack: 'archives:ArtworkRooms0328Shack40.swf',
      dance: 'archives:ArtworkRooms0328Dance43.swf',
      pet: 'archives:ArtworkRooms0328Pet45.swf',
      pizza: 'archives:ArtworkRooms0328Pizza45.swf',
      plaza: 'archives:ArtworkRooms0328Plaza47.swf',
      lodge: 'archives:ArtworkRooms0328Lodge46.swf',
      village: 'archives:ArtworkRooms0328Village43.swf',
      forts: 'archives:ArtworkRooms0328Forts41.swf',
      town: 'archives:ArtworkRooms0328Town40.swf',
      cove: 'archives:ArtworkRooms0328Cove43.swf'
    },
    music: {
      pet: 201,
      shop: 201,
      coffee: 201,
      book: 201,
      light: 201,
      beacon: 201,
      sport: 201,
      lodge: 201,
      attic: 201,
      dojo: 201,
      dance: 231,
      lounge: 231,
      town: 232,
      plaza: 232,
      forts: 232,
      forest: 232,
      cove: 232,
      dock: 232,
      beach: 232,
      village: 232,
      shack: 232,
      berg: 232
    },
    generalChanges: {
      'games/thinice/game.swf': 'archives:Thinicetrobarrier.swf',
      'artwork/tools/binoculars1.swf': 'archives:Binoculars-AprilFools2008.swf',
      'artwork/tools/telescope0.swf': 'archives:Telescope-AprilFools2008.swf'
    }
  },
  {
    name: 'Rockhopper & Yarr\'s Arr-ival Parr-ty',
    date: Update.ROCKHOPPER_ARRIVAL_PARTY_START,
    end: Update.ROCKHOPPER_ARRIVAL_END,
    roomChanges: {
      beach: 'archives:ArtworkRooms0425Beach50.swf',
      dock: 'archives:ArtworkRooms0425Dock50.swf',
      coffee: 'archives:ArtworkRooms0425Coffee51.swf',
      dance: 'archives:ArtworkRooms0425Dance50.swf',
      plaza: 'archives:ArtworkRooms0425Plaza50.swf',
      ship: 'archives:ArtworkRooms0425Ship50.swf',
      shiphold: 'archives:ArtworkRooms0425Shiphold50.swf',
      village: 'archives:ArtworkRooms0425Village50.swf',
      forts: 'archives:ArtworkRooms0425Forts50.swf',
      town: 'archives:ArtworkRooms0425Town50.swf'
    },
    music: {
      town: 212,
      forts: 212,
      plaza: 212,
      village: 212,
      beach: 212,
      dock: 212,
      coffee: 212,
      dance: 212
    },
    activeMigrator: true,
    consequences: {
      roomChanges: {
        // returning to normality
        beach: 'archives:ArtworkRoomsBeach41.swf'
      }
    }
  },
  {
    name: 'Medieval Party',
    date: '2008-05-16',
    end: '2008-05-25',
    roomChanges: {
      beach: 'archives:Rooms0516Beach50.swf',
      beacon: 'archives:Rooms0516Beacon50.swf',
      boiler: 'archives:Rooms0516Boiler50.swf',
      cave: 'archives:Rooms0516Cave50.swf',
      coffee: 'archives:Rooms0516Coffee51.swf',
      cove: 'archives:Rooms0516Cove50.swf',
      lounge: 'archives:Rooms0516Lounge50.swf',
      dock: 'archives:Rooms0516Dock50.swf',
      forest: 'archives:Rooms0516Forest50.swf',
      light: 'archives:Rooms0516Light50.swf',
      attic: 'archives:Rooms0516Attic50.swf',
      mine: 'archives:Rooms0516Mine50.swf',
      shack: 'archives:Rooms0516Shack50.swf',
      dance: 'archives:Rooms0516Dance50.swf',
      pet: 'archives:Rooms0516Pet50.swf',
      pizza: 'archives:Rooms0516Pizza50.swf',
      plaza: 'archives:Rooms0516Plaza50.swf',
      rink: 'archives:Rooms0516Rink51.swf',
      mtn: 'archives:Rooms0516Mtn50.swf',
      lodge: 'archives:Rooms0516Lodge50.swf',
      village: 'archives:Rooms0516Village50.swf',
      forts: 'archives:Rooms0516Forts51.swf',
      town: 'archives:ArtworkRooms0516Town51.swf',

      // this is technically room "party"
      // but we have an issue with the id of that room
      // changing... (if want to preserve the internal URLs will need refactoring, so not doing it rn)
      party99: 'archives:Rooms0516Party50.swf'
    },
    music: {
      beach: 235,
      beacon: 235,
      boiler: 236,
      cave: 236,
      coffee: 234,
      cove: 235,
      lounge: 234,
      dock: 233,
      forest: 235,
      light: 235,
      attic: 234,
      mine: 236,
      shack: 233,
      dance: 234,
      pet: 234,
      pizza: 234,
      plaza: 233,
      rink: 233,
      mtn: 234,
      lodge: 234,
      village: 233,
      forts: 233,
      town: 233,
      party99: 235
    }
  },
  {
    name: 'Water Party',
    date: '2008-06-13',
    end: '2008-06-17',
    roomChanges: {
      beach: 'archives:WPBeach.swf',
      beacon: 'archives:WPBeacon.swf',
      boiler: 'archives:WPBoilerRoom.swf',
      cave: 'archives:WPCave.swf',
      coffee: 'archives:WPCoffeeShop.swf',
      cove: 'archives:WPCove.swf',
      dance: 'archives:WPDanceClub.swf',
      lounge: 'archives:RoomsLounge-Water2008.swf',
      dock: 'archives:WPDock.swf',
      dojo: 'archives:WPDojo.swf',
      forest: 'archives:WPForest.swf',
      forts: 'archives:WPForts.swf',
      berg: 'archives:WPIceBerg.swf',
      rink: 'archives:WPIceRink.swf',
      light: 'archives:WPLightHouse.swf',
      attic: 'archives:WPLodgeAttic.swf',
      mine: 'archives:WPMine.swf',
      shack: 'archives:WPMineShack.swf',
      // technically it was party.swf
      party99: 'archives:WPParty.swf',
      pizza: 'archives:WPPizzaParlor.swf',
      plaza: 'archives:WPPlaza.swf',
      mtn: 'archives:WPSkiHill.swf',
      lodge: 'archives:WPSkiLodge.swf',
      village: 'archives:WPSkiVillage.swf',
      town: 'archives:WPTown.swf'
    },
    music: {
      beach: 218,
      beacon: 218,
      boiler: 217,
      cave: 217,
      coffee: 218,
      cove: 217,
      dance: 217,
      dock: 218,
      dojo: 218,
      forest: 217,
      forts: 217,
      rink: 217,
      light: 217,
      mine: 218,
      shack: 218,
      party99: 218,
      plaza: 217,
      mtn: 218,
      village: 218,
      town: 218
    }
  },
  {
    name: 'Earthquake',
    event: true,
    date: Update.EARTHQUAKE,
    // no ide when this ended
    end: '2008-06-24',
    startComment: 'An earthquake hits the island',
    endComment: 'The earthquake ends',
    roomChanges: {
      dance: 'archives:RoomsDance-Earthquake2008.swf'
    }
  },
  {
    name: 'Music Jam',
    date: Update.MUSIC_JAM_08_START,
    end: '2008-08-05',
    roomChanges: {
      party: 'archives:RoomsParty1-MusicJam2008.swf',
      beach: 'archives:MJ2008Beach.swf',
      cave: 'archives:RoomsCave-MusicJam2008.swf',
      coffee: 'archives:RoomsCoffee-MusicJam2008.swf',
      cove: 'archives:RoomsCove-MusicJam2008.swf',
      lounge: 'archives:RoomsLounge-MusicJam2008.swf',
      dock: 'archives:MJDock1.swf',
      dojo: 'archives:RoomsDojo-MusicJam2008.swf',
      forest: 'archives:RoomsForest-MusicJam2008.swf',
      berg: 'archives:RoomsBerg-MusicJam2008.swf',
      rink: 'archives:MJ2008IceRink.swf',
      light: 'archives:RoomsLight-MusicJam2008.swf',
      mine: 'archives:RoomsMine-MusicJam2008.swf',
      dance: 'archives:RoomsDance-MusicJam2008.swf',
      pizza: 'archives:RoomsPizza-MusicJam2008.swf',
      village: 'archives:RoomsVillage-MusicJam2008.swf',
      town: 'archives:RoomsTown-MusicJam2008.swf',
      forts: 'archives:MJSnowForts.swf',
      plaza: 'fix:RoomsPlaza-MusicJam2008.swf'
    },
    music: {
      party: 243,
      coffee: 211,
      berg: 244,
      mine: 247,
      pizza: 210,
      plaza: 242,
      forts: 240,
      town: 242,
      dance: 242,
      lounge: 242
    },
    localChanges: {
      'catalogues/merch.swf': {
        'en': 'archives:MJ2008MerchCatalog.swf'
      },
      'close_ups/backstage_allaccesspass.swf': {
        'en': 'archives:MJ2008VIP.swf'
      },
      'catalogues/music.swf': {
        'en': 'archives:MJ2008MusicCatalog.swf'
      }
    },
    updates: [
      {
        date: Update.RECORD_PIN,
        roomChanges: {
          dance: 'recreation:dance_record_pin_mjam.swf',
          cave: 'recreation:cave_mjam08_no_pin.swf'
        }
      }
    ],
    consequences: {
      roomChanges: {
        dance: 'recreation:dance_record_pin.swf'
      },
      roomComment: 'The Dance Club is updated post Music Jam'
    },
    construction: {
      date: '2008-07-18',
      changes: {
        dance: 'recreation:mjam_08_const/dance.swf'
      }
    }
  },
  {
    name: 'Paper Boat Scavenger Hunt',
    date: '2008-08-08',
    end: '2008-08-18',
    roomChanges: {
      beach: 'archives:RoomsBeach-PaperBoatScavengerHunt2008.swf',
      cave: 'archives:RoomsCave-PaperBoatScavengerHunt2008.swf',
      coffee: 'archives:RoomsCoffee-PaperBoatScavengerHunt2008.swf',
      cove: 'archives:RoomsCove-PaperBoatScavengerHunt2008.swf',
      dock: 'archives:RoomsDock-PaperBoatScavengerHunt2008.swf',
      berg: 'archives:RoomsBerg-PaperBoatScavengerHunt2008.swf',
      shack: 'archives:RoomsShack-PaperBoatScavengerHunt2008.swf',
      pet: 'archives:RoomsPet-PaperBoatScavengerHunt2008.swf'
    },
    globalChanges: {
      'scavenger_hunt/hunt_ui.swf': ['archives:Boats-PaperBoatScavengerHunt2008.swf', 'scavenger_hunt_boat', 'easter_hunt'],
    },
    scavengerHunt2010: {
      iconFileId: 'archives:BoatIcon-PaperBoatScavengerHunt2008.swf'
    },
    activeMigrator: 'archives:RockhopperRareItemsAug2008.swf'
  },
  {
    name: 'Penguin Games',
    date: '2008-08-22',
    end: '2008-08-26',
    startComment: 'The Penguin Games party begins',
    endComment: 'The Penguin Games party ends',
    roomChanges: {
      'beach': 'archives:PGBeach.swf',
      book: 'archives:RoomsBook-PenguinGames.swf',
      cave: 'archives:RoomsCave-PenguinGames.swf',
      coffee: 'archives:RoomsCoffee-PenguinGames.swf',
      cove: 'archives:RoomsCove-PenguinGames.swf',
      dock: 'archives:RoomsDock-PenguinGames.swf',
      forest: 'archives:RoomsForest-PenguinGames.swf',
      berg: 'archives:RoomsBerg-PenguinGames.swf',
      rink: 'archives:PGIceRink.swf',
      attic: 'archives:PGLodgeAttic.swf',
      pizza: 'archives:RoomsPizza-PenguinGames.swf',
      plaza: 'archives:PGPlaza.swf',
      mtn: 'archives:PGSkiHill.swf',
      lodge: 'archives:PGSkiLodge.swf',
      village: 'archives:PGSkiVillage.swf',
      forts: 'archives:RoomsForts-PenguinGames.swf',
      sport: 'archives:PGSportShop.swf',
      town: 'archives:RoomsTown-PenguinGames.swf'
    },
    music: {
      beach: 213,
      book: 240,
      cave: 249,
      coffee: 240,
      cove: 213,
      dock: 213,
      forest: 213,
      berg: 249,
      rink: 240,
      attic: 248,
      pizza: 240,
      plaza: 213,
      mtn: 240,
      lodge: 248,
      village: 213,
      forts: 213,
      sport: 249,
      town: 213
    }
  },
  {
    name: 'Fall Fair',
    date: '2008-09-26',
    end: '2008-10-06',
    roomChanges: {
      beach: 'archives:FFBeach.swf',
      beacon: 'archives:FFBeacon.swf',
      cave: 'archives:FFCave.swf',
      coffee: 'archives:FFCoffeeShop.swf',
      cove: 'archives:FFCove.swf',
      dance: 'archives:FFDanceClub.swf',
      lounge: 'archives:RoomsLounge-FallFair2008.swf',
      dock: 'archives:FFDock.swf',
      forest: 'archives:FFForest.swf',
      berg: 'archives:FFIceBerg.swf',
      mine: 'archives:FFMine.swf',
      party: 'archives:FFParty.swf',
      pizza: 'archives:FFPizzaParlor.swf',
      mtn: 'archives:FFSkiHill.swf',
      village: 'archives:FFSkiVillage.swf',
      forts: 'archives:FFSnowForts.swf',
      town: 'archives:FFTown.swf'
    },
    music: {
      beach: 221,
      beacon: 221,
      cave: 221,
      coffee: 221,
      cove: 221,
      dance: 221,
      lounge: 221,
      dock: 221,
      forest: 221,
      berg: 221,
      mine: 221,
      party: 221,
      pizza: 221,
      mtn: 221,
      village: 221,
      forts: 221,
      town: 221
    },
    fairCpip: {
      iconFileId: 'archives:Ticket_icon-TheFair2009.swf',
      infoFile: 'recreation:fair_08_ticket_info.swf'
    },
    updates: [
      {
        date: '2008-09-30',
        comment: 'The plaza was decorated',
        roomChanges: {
          plaza: 'recreation:fair_2008_plaza_decorated.swf'
        },
        music: {
          plaza: 221
        }
      }
    ]
  },
  {
    name: '3rd Anniversary Party',
    date: '2008-10-24',
    end: '2008-10-27',
    roomChanges: {
      book: 'archives:3rdAnniversaryPartyBook.swf',
      coffee: 'archives:3rdAnniversaryPartyCoffee.swf',
      dance: 'archives:3rdAnniversaryPartyDance.swf',
      town: 'archives:3rdAnniversaryPartyTown.swf'
    },
    music: {
      book: 250,
      coffee: 250,
      dance: 250,
      town: 250
    }
  },
  {
    name: 'Halloween Party',
    date: '2008-10-28',
    end: '2008-11-02',
    roomChanges: {
      beach: 'archives:HPBeach.swf',
      beacon: 'archives:HPBeacon.swf',
      book: 'archives:HPBookRoom.swf',
      cave: 'archives:HPCave.swf',
      coffee: 'archives:HPCoffeeShop.swf',
      cove: 'archives:HPCove.swf',
      dance: 'archives:HPDanceClub.swf',
      lounge: 'archives:RoomsLounge-Halloween2008.swf',
      dock: 'archives:HPDock.swf',
      dojo: 'archives:HPDojo.swf',
      forest: 'archives:HPForest.swf',
      shop: 'archives:HPGiftShop.swf',
      berg: 'archives:HPIceBerg.swf',
      light: 'archives:HPLightHouse.swf',
      attic: 'archives:HPLodgeAttic.swf',
      rink: 'archives:HPIceRink.swf',
      shack: 'archives:HPMineShack.swf',
      pet: 'archives:HPPetShop.swf',
      pizza: 'archives:HPPizzaParlor.swf',
      plaza: 'archives:HPPlaza.swf',
      party: 'archives:RoomsLab-HalloweenParty2008.swf',
      mtn: 'archives:HPSkiHill.swf',
      lodge: 'archives:HPSkiLodge.swf',
      village: 'archives:HPSkiVillage.swf',
      forts: 'archives:HPSnowForts.swf',
      sport: 'archives:HPSportShop.swf',
      town: 'archives:HPTown.swf'
    },
    music: {
      beach: 251,
      beacon: 251,
      book: 252,
      cave: 252,
      coffee: 252,
      cove: 251,
      dance: 224,
      lounge: 224,
      dock: 251,
      dojo: 252,
      forest: 251,
      shop: 252,
      berg: 251,
      light: 252,
      attic: 252,
      rink: 251,
      shack: 251,
      pet: 252,
      pizza: 252,
      plaza: 251,
      party: 253,
      mtn: 251,
      lodge: 252,
      village: 251,
      forts: 251,
      sport: 252,
      town: 251
    },
    globalChanges: {
      'igloo/assets/igloo_background.swf': 'recreation:halloween_2008/igloo_background.swf'
    }
  },
  {
    name: 'Dig Out the Dojo',
    date: '2008-11-03',
    end: Update.DIG_OUT_DOJO_END,
    startComment: 'The Dig Out the Dojo event begins',
    endComment: 'The Dig Out the Dojo event ends',
    roomChanges: {
      dojo: 'archives:DojoConstruction2008.swf',
      dojoext: 'archives:DojoExtConstruction2008.swf'
    },
    updates: [
      {
        comment: 'The excavation progresses, and less snow covers the Dojo',
        date: '2008-11-10',
        roomChanges: {
          dojo: 'archives:DojoConstruction22008.swf',
          dojoext: 'archives:DojoExtConstruction22008.swf'
        }
      }
    ],
    consequences: {
      roomComment: 'The dojo has a great reopening',
      roomChanges : {
        dojo: 'archives:DojoGrandOpening2008.swf'
      },
      map: 'archives:Map2008-2011Stadium.swf'
    }
  },
  {
    name: 'Christmas Party',
    date: '2008-12-19',
    end: Update.CHRISTMAS_2008_END,
    roomChanges: {
      beach: 'archives:RoomsBeach-ChristmasParty2008.swf',
      beacon: 'archives:RoomsBeacon-ChristmasParty2008.swf',
      boiler: 'archives:RoomsBoiler-ChristmasParty2008.swf',
      book: 'archives:RoomsBook-ChristmasParty2008.swf',
      shipquarters: 'archives:RoomsShipquarters-ChristmasParty2008.swf',
      cave: 'archives:RoomsCave-ChristmasParty2008.swf',
      coffee: 'archives:RoomsCoffee-ChristmasParty2008.swf',
      agentcom: 'archives:RoomsAgentcom-ChristmasParty2008.swf',
      cove: 'archives:RoomsCove-ChristmasParty2008.swf',
      shipnest: 'archives:RoomsShipnest-ChristmasParty2008.swf',
      lounge: 'archives:RoomsLounge-ChristmasParty2008.swf',
      dock: 'archives:RoomsDock-ChristmasParty2008.swf',
      dojo: 'archives:RoomsDojo-ChristmasParty2008.swf',
      dojoext: 'archives:RoomsDojoext-ChristmasParty2008.swf',
      forest: 'archives:RoomsForest-ChristmasParty2008.swf',
      agent: 'archives:RoomsAgent-ChristmasParty2008.swf',
      rink: 'archives:RoomsRink-ChristmasParty2008.swf',
      berg: 'archives:RoomsBerg-ChristmasParty2008.swf',
      mine: 'archives:RoomsMine-ChristmasParty2008.swf',
      shack: 'archives:RoomsShack-ChristmasParty2008.swf',
      dance: 'archives:RoomsDance-ChristmasParty2008.swf',
      dojohide: 'archives:RoomsDojohide-ChristmasParty2008.swf',
      ship: 'archives:RoomsShip-ChristmasParty2008.swf',
      pizza: 'archives:RoomsPizza-ChristmasParty2008.swf',
      plaza: 'archives:RoomsPlaza-ChristmasParty2008.swf',
      shiphold: 'archives:RoomsShiphold-ChristmasParty2008.swf',
      mtn: 'archives:RoomsMtn-ChristmasParty2008.swf',
      lodge: 'archives:RoomsLodge-ChristmasParty2008.swf',
      village: 'archives:RoomsVillage-ChristmasParty2008.swf',
      forts: 'archives:RoomsForts-ChristmasParty2008.swf',
      town: 'archives:RoomsTown-ChristmasParty2008.swf'
    },
    music: {
      beach: 254,
      beacon: 254,
      boiler: 256,
      book: 255,
      shipquarters: 254,
      cave: 256,
      coffee: 255,
      cove: 254,
      shipnest: 254,
      lounge: 226,
      dock: 254,
      dojo: 256,
      dojoext: 254,
      forest: 254,
      rink: 254,
      berg: 254,
      mine: 256,
      shack: 255,
      dance: 226,
      dojohide: 256,
      ship: 254,
      pizza: 256,
      plaza: 254,
      shiphold: 254,
      mtn: 254,
      lodge: 254,
      village: 254,
      forts: 254,
      town: 254,
      light: 254
    }
  },
  {
    name: 'Dance-A-Thon',
    date: '2009-01-15',
    end: '2009-01-20',
    roomChanges: {
      boiler: 'archives:RoomsBoiler-DanceAThon.swf',
      lounge: 'archives:RoomsLounge-DanceAThon.swf',
      dance: 'archives:RoomsDance-DanceAThon.swf',
      party: 'archives:RoomsParty-DanceAThon.swf',
      town: 'archives:RoomsTown-DanceAThon.swf'
    },
    music: {
      dance: 258,
      party: 257,
      lounge: 0
    },
    consequences: {
      roomChanges: {
        // this is from june 26, when dj3k disks are added
        // other SWFs in-between are lost
        dance: 'archives:RoomsDance_2.swf'
      }
    }
  },
  {
    name: 'Winter Fiesta',
    date: '2009-01-23',
    end: '2009-01-25',
    roomChanges: {
      beach: 'archives:WinterFiesta2009Beach.swf',
      coffee: 'archives:WinterFiesta2009Coffee.swf',
      cove: 'archives:WinterFiesta2009Cove.swf',
      dock: 'archives:WinterFiesta2009Dock.swf',
      forest: 'archives:WinterFiesta2009Forest.swf',
      dance: 'archives:WinterFiesta2009Dance.swf',
      pizza: 'archives:WinterFiesta2009Pizza.swf',
      plaza: 'archives:WinterFiesta2009Plaza.swf',
      village: 'archives:WinterFiesta2009Village.swf',
      forts: 'archives:WinterFiesta2009Forts.swf',
      town: 'archives:WinterFiesta2009Town.swf'
    },
    music: {
      beach: 229,
      coffee: 229,
      cove: 206,
      dock: 229,
      forest: 206,
      dance: 206,
      pizza: 206,
      plaza: 206,
      lodge: 229,
      village: 229,
      forts: 206,
      town: 206
    }
  },
  {
    name: 'Puffle Party',
    date: '2009-02-20',
    end: '2009-02-24',
    roomChanges: {
      beach: 'archives:RoomsBeach-PuffleParty2009.swf',
      beacon: 'archives:RoomsBeacon-PuffleParty2009.swf',
      cave: 'archives:RoomsCave-PuffleParty2009.swf',
      cove: 'archives:RoomsCove-PuffleParty2009.swf',
      dance: 'archives:RoomsDance-PuffleParty2009.swf',
      dock: 'archives:RoomsDock-PuffleParty2009.swf',
      dojo: 'archives:RoomsDojoext2008.swf',
      forest: 'archives:RoomsForest-PuffleParty2009.swf',
      berg: 'archives:RoomsBerg-PuffleParty2009.swf',
      light: 'archives:RoomsLight-PuffleParty2009.swf',
      mtn: 'archives:RoomsMtn-PuffleParty2009.swf',
      pet: 'archives:PuffleParty2009-0220pet.swf',
      plaza: 'archives:RoomsPlaza-PuffleParty2009.swf',
      party: 'archives:RoomsParty-PuffleParty2009.swf',
      attic: 'archives:RoomsAttic-PuffleParty2009.swf',
      village: 'archives:RoomsVillage-PuffleParty2009.swf',
      forts: 'archives:2009pufflepartysnowforts.swf',
      town: 'archives:Rooms0220Town.swf',
    },
    music: {
      town: 260,
      beach: 260,
      dock: 260,
      pet: 261,
      plaza: 259,
      forest: 259,
      cove: 259,
      berg: 259,
      beacon: 261,
      light: 31,
      cave: 240,
      dance: 243,
      forts: 260,
      party: 259,
      village: 260
    },
    construction: {
      date: '2009-02-13',
      changes: {
        beacon: 'archives:RoomsBeacon-PuffleParty2009Pre.swf',
        cave: 'archives:RoomsCave-PuffleParty2009Pre.swf',
        cove: 'archives:RoomsCove-PuffleParty2009Pre.swf',
        forest: 'archives:RoomsForest-PuffleParty2009Pre.swf',
        berg: 'archives:RoomsBerg-PuffleParty2009Pre.swf',
        light: 'archives:RoomsLight-PuffleParty2009Pre.swf',
        dance: 'archives:RoomsDance-PuffleParty2009Pre.swf',
        plaza: 'archives:RoomsPlaza-PuffleParty2009Pre.swf',
        village: 'archives:RoomsVillage-PuffleParty2009Pre.swf',
        town: 'archives:RoomsTown-PuffleParty2009Pre.swf'
      }
    }
  },
  {
    name: 'St. Patrick\'s Day Party',
    date: '2009-03-13',
    end: '2009-03-17',
    roomChanges: {
      town: 'archives:Rooms0313Town.swf',
      coffee: 'archives:RoomsCoffeeStPatricksDay2009.swf',
      dance: 'archives:RoomsDance-StPatrickParty2009.swf',
      forts: 'archives:RoomsForts-StPatrickParty2009.swf',
      plaza: 'archives:StPatricksDayParty2009-Plaza.swf',
      stage: 'archives:StPatricksDayParty2009-Stage.swf',
      forest: 'archives:RoomsForest-StPatrickParty2009.swf',
      party: 'archives:RoomsParty-StPatrickParty2009.swf',
      dock: 'archives:RoomsDock-StPatrickParty2009.swf',
      berg: 'archives:RoomsBerg-StPatrickParty2009.swf',
      mtn: 'archives:RoomsMtn-StPatrickParty2009.swf',
      village: 'archives:RoomsVillage-StPatrickParty2009.swf'
    },
    music: {
      town: 262,
      dance: 263,
      forts: 262,
      plaza: 262,
      stage: 0,
      forest: 208,
      dock: 262,
      mtn: 262,
      village: 262,
      party: 208,
      coffee: 262
    },
    construction: {
      date: '2009-03-06',
      changes: {
        cove: 'archives:RoomsCove-StPatricksDay2009Pre.swf',
        forest: 'archives:RoomsForest-StPatricksDay2009Pre.swf',
        village: 'archives:RoomsVillage-StPatricksDay2009Pre.swf'
      }
    }
  },
  {
    name: 'Snow Sculpture Showcase',
    date: Update.SNOW_SCULPTURE_09_START,
    end: '2009-04-09',
    roomChanges: {
      beach: 'archives:RoomsBeach-PenguinPlayAwards2009.swf',
      beacon: 'archives:RoomsBeacon-PenguinPlayAwards2009.swf',
      dock: 'archives:RoomsDock-PenguinPlayAwards2009.swf',
      light: 'archives:RoomsLight-PenguinPlayAwards2009.swf',
      mtn: 'archives:RoomsMtn-PenguinPlayAwards2009.swf',
      village: 'archives:RoomsVillage-PenguinPlayAwards2009.swf'
    },
    updates: [
      {
        // pin was removed mid-party
        date: '2009-03-27',
        roomChanges: {
          mtn: 'recreation:snow_sculpture_mtn_no_pin.swf'
        }
      }
    ]
  },
  {
    name: 'Penguin Play Awards',
    date: '2009-03-20',
    end: '2009-04-09',
    roomChanges: {
      party: 'archives:RoomsParty-PenguinPlayAwards2009.swf',
      plaza: 'archives:RoomsPlaza-PenguinPlayAwards2009.swf',
      stage: 'archives:RoomsStage-PenguinPlayAwards2009.swf'
    },
    music: {
      party: 40,
      plaza: 40,
      stage: 40
    },
    globalChanges: {
      'content/shorts/penguinsTime.swf': 'archives:ContentShortspenguinsTime.swf'
    },
    construction: {
      date: '2009-03-17',
      changes: {
        plaza: 'recreation:penguin_play_awards_09_plaza_const.swf'
      }
    }
  },
  {
    name: 'April Fools\' Party',
    date: '2009-04-01',
    end: '2009-04-06',
    roomChanges: {
      beach: 'archives:RoomsBeach-AprilFoolsParty2009.swf',
      beacon: 'archives:RoomsBeacon-AprilFoolsParty2009.swf',
      boiler: 'archives:RoomsBoiler-AprilFoolsParty2009.swf',
      boxdimension: 'archives:RoomsParty2-AprilFoolsParty2009.swf',
      party3: 'archives:RoomsParty3-AprilFoolsParty2009.swf',
      cave: 'archives:RoomsCave-AprilFoolsParty2009.swf',
      coffee: 'archives:RoomsCoffee-AprilFoolsParty2009.swf',
      cove: 'archives:RoomsCove-AprilFoolsParty2009.swf',
      dock: 'archives:RoomsDock-AprilFoolsParty2009.swf',
      dojo: 'archives:RoomsDojo-AprilFoolsParty2009.swf',
      dojoext: 'archives:RoomsDojoext-AprilFoolsParty2009.swf',
      forest: 'archives:RoomsForest-AprilFoolsParty2009.swf',
      berg: 'archives:RoomsBerg-AprilFoolsParty2009.swf',
      light: 'archives:RoomsLight-AprilFoolsParty2009.swf',
      mine: 'archives:RoomsMine-AprilFoolsParty2009.swf',
      shack: 'archives:RoomsShack-AprilFoolsParty2009.swf',
      dance: 'archives:RoomsDance-AprilFoolsParty2009.swf',
      dojohide: 'archives:RoomsDojohide-AprilFoolsParty2009.swf',
      pizza: 'archives:RoomsPizza-AprilFoolsParty2009.swf',
      plaza: 'archives:RoomsPlaza-AprilFoolsParty2009.swf',
      lodge: 'archives:RoomsLodge-AprilFoolsParty2009.swf',
      village: 'archives:RoomsVillage-AprilFoolsParty2009.swf',
      forts: 'archives:RoomsForts-AprilFoolsParty2009.swf',
      town: 'archives:RoomsTown-AprilFoolsParty2009.swf'
    },
    music: {
      beach: 232,
      beacon: 201,
      boiler: 201,
      cave: 201,
      coffee: 201,
      cove: 232,
      dock: 232,
      forest: 232,
      berg: 232,
      light: 201,
      mine: 201,
      shack: 232,
      dance: 201,
      pizza: 201,
      plaza: 232,
      lodge: 201,
      village: 232,
      forts: 232,
      town: 232,
      party3: 264
    },
    localChanges: {
      'catalogues/party.swf': {
        'en': 'archives:BoxCatalog.swf'
      },
      'membership/party3.swf': {
        'en': ['archives:AprilFoolMembership.swf', 'oops_party3_room']
      }
    },
    roomMemberStatus: {
      party3: true
    },
    startscreens: ['archives:LoginScreenAprilFools2009.swf']
  },
  {
    name: 'Easter Egg Hunt',
    date: '2009-04-10',
    end: '2009-04-13',
    roomChanges: {
      beacon: 'archives:RoomsBeacon-EasterEggHunt2009.swf',
      cove: 'archives:RoomsCove-EasterEggHunt2009.swf',
      dojoext: 'archives:RoomsDojoext-EasterEggHunt2009.swf',
      shop: 'archives:RoomsShop-EasterEggHunt2009.swf',
      mtn: 'archives:RoomsMtn-EasterEggHunt2009.swf',
      lodge: 'archives:RoomsLodge-EasterEggHunt2009.swf',
      town: 'archives:RoomsTown-Easter2009.swf'
    },
    globalChanges: {
      'scavenger_hunt/hunt_ui.swf': ['archives:Eggs-EasterEggHunt2009.swf', 'easter_egg_hunt', 'easter_hunt'],
    },
    scavengerHunt2010: {
      'iconFileId': 'archives:EggIcon-EasterEggHunt2009.swf'
    }
  },
  {
    name: 'Medieval Party',
    date: '2009-05-08',
    end: '2009-05-17',
    roomChanges: {
      beach: 'archives:Rooms0508Beach.swf',
      rink: 'archives:Rooms0508Rink.swf',
      lodge: 'archives:Rooms0508Lodge.swf',
      beacon: 'archives:Rooms0508Beacon.swf',
      boiler: 'archives:Rooms0508Boiler.swf',
      book: 'archives:Rooms0508Book.swf',
      cave: 'archives:Rooms0508Cave.swf',
      coffee: 'archives:Rooms0508Coffee.swf',
      cove: 'archives:Rooms0508Cove.swf',
      lounge: 'archives:Rooms0508Lounge.swf',
      dock: 'archives:Rooms0508Dock.swf',
      forest: 'archives:Rooms0508Forest.swf',
      shop: 'archives:Rooms0508Shop.swf',
      light: 'archives:Rooms0508Light.swf',
      attic: 'archives:Rooms0508Attic.swf',
      shack: 'archives:Rooms0508Shack.swf',
      dance: 'archives:Rooms0508Dance.swf',
      pet: 'archives:Rooms0508Pet.swf',
      pizza: 'archives:Rooms0508Pizza.swf',
      plaza: 'archives:Rooms0508Plaza.swf',
      mtn: 'archives:Rooms0508Mtn.swf',
      village: 'archives:Rooms0508Village.swf',
      forts: 'archives:Rooms0508Forts.swf',
      town: 'archives:Rooms0508Town.swf',
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
      party13: 'archives:Rooms0508Party13.swf'
    },
    music: {
      beach: 233,
      beacon: 235,
      boiler: 236,
      book: 234,
      cave: 236,
      coffee: 234,
      cove: 235,
      lounge: 235,
      dock: 233,
      forest: 235,
      shop: 234,
      rink: 236,
      light: 235,
      attic: 235,
      shack: 237,
      pet: 234,
      pizza: 234,
      plaza: 233,
      mtn: 236,
      lodge: 235,
      forts: 236,
      town: 233,
      party1: 235,
      party2: 266,
      party3: 266,
      party4: 266,
      party5: 266,
      party6: 266,
      party7: 266,
      party8: 266,
      party9: 266,
      party10: 266,
      party11: 266,
      party12: 266,
      party13: 265,
      village: 235
    },
    localChanges: {
      'catalogues/party.swf': {
        'en': 'archives:ENCataloguesParty-MedievalParty2009.swf'
      }
    },
    construction: {
      date: '2009-05-01',
      changes: {
        cave: 'recreation:medieval_09_const_cave.swf'
      }
    }
  },
  {
    name: 'Adventure Party',
    date: '2009-06-12',
    end: '2009-06-16',
    roomChanges: {
      beach: 'archives:RoomsBeach-AdventureParty2009.swf',
      cave: 'archives:RoomsCave-AdventureParty2009.swf',
      cove: 'archives:RoomsCove-AdventureParty2009.swf',
      dock: 'archives:RoomsDock-AdventureParty2009.swf',
      forest: 'archives:RoomsForest-AdventureParty2009.swf',
      berg: 'archives:RoomsBerg-AdventureParty2009.swf',
      mine: 'archives:RoomsMine-AdventureParty2009.swf',
      dance: 'archives:RoomsDance-AdventureParty2009.swf',
      plaza: 'archives:RoomsPlaza-AdventureParty2009.swf',
      forts: 'archives:RoomsForts-AdventureParty2009.swf',
      rink: 'archives:RoomsRink-AdventureParty2009.swf',
      town: 'archives:RoomsTown-AdventureParty2009.swf',
      party: 'archives:TreeForts-AdventureParty2009.swf'
    },
    music: {
      beach: 267,
      cave: 268,
      cove: 267,
      dock: 267,
      forest: 267,
      berg: 268,
      mine: 268,
      dance: 269,
      plaza: 267,
      forts: 267,
      rink: 267,
      town: 267,
      party: 267
    },
    construction: {
      date: '2009-06-05',
      changes: {
        beach: 'archives:RoomsBeach-AdventureParty2009Const.swf',
        shipnest: 'archives:RoomsNest-AdventureParty2009Const.swf',
        cove: 'archives:RoomsCove-AdventureParty2009Const.swf',
        dock: 'archives:RoomsDock-AdventureParty2009Const.swf',
        forest: 'archives:RoomsForest-AdventureParty2009Const.swf',
        ship: 'archives:RoomsShip-AdventureParty2009Const.swf',
        plaza: 'archives:RoomsPlaza-AdventureParty2009Const.swf',
        shiphold: 'archives:RoomsHold-AdventureParty2009Const.swf',
        forts: 'archives:RoomsForts-AdventureParty2009Const.swf',
        town: 'archives:RoomsTown-AdventureParty2009Const.swf'
      }
    },
    startscreens: ['archives:AdventureParty2009ENLoginScreen1.swf', 'archives:AdventureParty2009ENLoginScreen2.swf']
  },
  {
    name: 'Music Jam',
    date: '2009-07-17',
    end: '2009-07-26',
    roomChanges: {
      party: 'archives:RoomsParty-MusicJam2010.swf',
      party3: 'archives:RoomsParty3-MusicJam2009.swf',
      beach: 'archives:RoomsBeach-MusicJam2009.swf',
      cave: 'archives:RoomsCave-MusicJam2009.swf',
      coffee: 'archives:RoomsCoffeeMusicJam2009.swf',
      cove: 'archives:RoomsCove-MusicJam2009.swf',
      lounge: 'archives:RoomsLounge-MusicJam2009.swf',
      dock: 'archives:RoomsDock-MusicJam2009.swf',
      forest: 'archives:RoomsForest-MusicJam2009.swf',
      berg: 'archives:RoomsBerg-MusicJam2009.swf',
      light: 'archives:RoomsLight-MusicJam2009.swf',
      dance: 'archives:RoomsDance-MusicJam2009.swf',
      party2: 'archives:RoomsParty2-MusicJam2009.swf',
      pizza: 'archives:RoomsPizza-MusicJam2009.swf',
      plaza: 'archives:RoomsPlaza-MusicJam2009.swf',
      mtn: 'archives:RoomsMtn-MusicJam2009.swf',
      village: 'archives:RoomsVillage-MusicJam2009.swf',
      forts: 'archives:RoomsForts-MusicJam2009.swf',
      rink: 'archives:RoomsRink-MusicJam2009.swf',
      town: 'archives:RoomsTown-MusicJam2009.swf'
    },
    music: {
      dance: 242,
      forts: 240,
      lounge: 242,
      mtn: 232,
      pizza: 210,
      plaza: 271,
      town: 271,
      party3: 272,
      coffee: 0
    },
    localChanges: {
      'catalogues/merch.swf': {
        'en': 'approximation:mj2009_merch.swf'
      },
    },
    construction: {
      date: '2009-07-10',
      changes: {
        beach: 'archives:RoomsBeach-MusicJam2010Pre.swf',
        coffee: 'archives:RoomsCoffee-MusicJam2010Pre.swf',
        cove: 'archives:RoomsCove-MusicJam2010Pre.swf',
        dock: 'archives:RoomsDock-MusicJam2010Pre.swf',
        forest: 'archives:RoomsForest-MusicJam2010Pre.swf',
        berg: 'archives:RoomsBerg-MusicJam2010Pre.swf',
        light: 'archives:RoomsLight-MusicJam2010Pre.swf',
        village: 'archives:RoomsVillage-MusicJam2010Pre.swf',
        forts: 'archives:RoomsForts-MusicJam2010Pre.swf',
        rink: 'archives:RoomsRink-MusicJam2009Const.swf'
      }
    },
    startscreens: ['archives:LoginMusicJam2009.swf']
  },
  {
    name: 'Festival of Flight',
    date: '2009-08-14',
    end: '2009-08-20',
    roomChanges: {
      beach: 'archives:FestivalOfFlightBeach.swf',
      beacon: 'archives:FestivalOfFlightBeacon.swf',
      cave: 'archives:FestivalOfFlightCave.swf',
      cove: 'archives:FestivalOfFlightCove.swf',
      dock: 'archives:FestivalOfFlightDock.swf',
      forest: 'archives:FestivalOfFlightForest.swf',
      party: 'archives:FestivalOfFlightParty.swf',
      berg: 'archives:FestivalOfFlightBerg.swf',
      dance: 'archives:FestivalOfFlightDance.swf',
      plaza: 'archives:FestivalOfFlightPlaza.swf',
      mtn: 'archives:FestivalOfFlightMtn.swf',
      village: 'archives:FestivalOfFlightVillage.swf',
      forts: 'archives:FestivalOfFlightForts.swf',
      party2: 'archives:FestivalOfFlightParty2.swf',
      town: 'archives:RoomsTown-FestivalofFlight.swf'
    },
    music: {
      beach: 277,
      beacon: 277,
      cave: 277,
      cove: 277,
      dance: 279,
      dock: 277,
      forest: 277,
      forts: 277,
      mtn: 277,
      plaza: 277,
      village: 277,
      town: 277,
      party: 278,
      party2: 278
    },
    construction: {
      date: '2009-08-07',
      changes: {
        beach: 'archives:FestivalOfFlightConstBeach.swf',
        beacon: 'archives:FestivalOfFlightConstBeacon.swf',
        dock: 'archives:FestivalOfFlightConstDock.swf',
        forest: 'archives:FestivalOfFlightConstForest.swf',
        plaza: 'archives:FestivalOfFlightConstPlaza.swf',
        forts: 'archives:FestivalOfFlightConstForts.swf',
        town: 'archives:RoomsTown-FestivalofFlightPre.swf'
      }
    }
  },
  {
    name: 'The Fair',
    date: '2009-09-04',
    end: '2009-09-14',
    roomChanges: {
      coffee: 'archives:RoomsCoffeeTheFair2009.swf',
      lounge: 'archives:RoomsLounge-Fair2009.swf',
      beach: 'archives:RoomsBeach-TheFair2009.swf',
      beacon: 'archives:RoomsBeacon-TheFair2009.swf',
      party: 'archives:RoomsParty-TheFair2009.swf',
      cave: 'archives:RoomsCave-TheFair2009.swf',
      cove: 'archives:RoomsCove-TheFair2009.swf',
      dock: 'archives:RoomsDock-TheFair2009.swf',
      forest: 'archives:RoomsForest-TheFair2009.swf',
      party3: 'archives:RoomsParty3-TheFair2009.swf',
      party2: 'archives:RoomsParty2-TheFair2009.swf',
      berg: 'archives:RoomsBerg-TheFair2009.swf',
      dance: 'archives:RoomsDance-TheFair2009.swf',
      pizza: 'archives:RoomsPizza-TheFair2009.swf',
      plaza: 'archives:RoomsPlaza-TheFair2009.swf',
      mtn: 'archives:RoomsMtn-TheFair2009.swf',
      village: 'archives:RoomsVillage-TheFair2009.swf',
      forts: 'archives:RoomsForts-TheFair2009.swf',
      town: 'archives:RoomsTown-TheFair2009.swf'
    },
    music: {
      coffee: 221,
      lounge: 221,
      beach: 221,
      beacon: 221,
      party: 221,
      cave: 221,
      cove: 221,
      dock: 221,
      forest: 221,
      party3: 221,
      party2: 221,
      berg: 221,
      dance: 221,
      pizza: 221,
      plaza: 221,
      mtn: 221,
      village: 221,
      forts: 221,
      town: 221
    },
    localChanges: {
      'catalogues/prizebooth.swf': {
        'en': 'archives:Prizebooth-TheFair2009.swf'
      },
      'catalogues/prizeboothmember.swf': {
        'en': 'archives:Prizeboothmember-TheFair2009.swf'
      }
    },
    fairCpip: {
      iconFileId: 'archives:Ticket_icon-TheFair2009.swf',
      infoFile: 'archives:Tickets-TheFair2009.swf'
    },
    updates: [
      {
        date: Update.DAYS_OF_FUN_PIN,
        roomChanges: {
          cove: 'recreation:fair_09_cove_no_pin.swf',
          pizza: 'recreation:pizza_101_days_of_fun_pin_fair.swf',
          'plaza': 'recreation:fair_09_penguins_time_forgot.swf'
        }
      }
    ],
  },
  {
    name: 'Sensei\'s Fire Scavenger Hunt',
    date: '2009-09-14',
    end: '2009-09-28',
    roomChanges: {
      beach: 'archives:Sensei_Fire_Hunt_beach.swf',
      beacon: 'archives:Sensei_Fire_Hunt_beacon.swf',
      cave: 'archives:Sensei_Fire_Hunt_cave.swf',
      coffee: 'archives:Sensei_Fire_Hunt_coffee.swf',
      cove: 'archives:Sensei_Fire_Hunt_cove.swf',
      dock: 'archives:Sensei_Fire_Hunt_dock.swf',
      dojo: 'archives:Sensei_Fire_Hunt_dojo.swf',
      dojoext: 'archives:Sensei_Fire_Hunt_dojoext.swf',
      shop: 'archives:Sensei_Fire_Hunt_shop.swf',
      agent: 'archives:Sensei_Fire_Hunt_agent.swf',
      berg: 'archives:Sensei_Fire_Hunt_berg.swf',
      attic: 'archives:Sensei_Fire_Hunt_attic.swf',
      forest: 'archives:Sensei_Fire_Hunt_forest.swf',
      shack: 'archives:Sensei_Fire_Hunt_shack.swf',
      dojohide: 'archives:Sensei_Fire_Hunt_dojohide.swf',
      pizza: 'archives:Sensei_Fire_Hunt_pizza.swf',
      plaza: 'archives:Sensei_Fire_Hunt_plaza.swf',
      pet: 'archives:Sensei_Fire_Hunt_pet.swf',
      mtn: 'archives:Sensei_Fire_Hunt_mtn.swf',
      lodge: 'archives:Sensei_Fire_Hunt_lodge.swf',
      village: 'archives:Sensei_Fire_Hunt_village.swf',
      forts: 'archives:Sensei_Fire_Hunt_forts.swf',
      sport: 'archives:Sensei_Fire_Hunt_sport.swf',
      rink: 'archives:Sensei_Fire_Hunt_rink.swf',
      town: 'archives:RoomsTown-FireScavengerHunt.swf'
    },
    globalChanges: {
      'scavenger_hunt/hunt_ui.swf': ['archives:Sensei_Fire_Hunt_hunt_closeup.swf', 'easter_egg_hunt', 'easter_hunt'],
    },
    scavengerHunt2010: {
      iconFileId: 'archives:Sensei_Fire_Hunt_hunt_icon.swf'
    },
    consequences: {
      roomComment: 'Construction in the Ninja Hideout continues',
      roomChanges: {
        dojohide: 'archives:RoomsDojohide-FireCelebratePre.swf'
      }
    },
    updates: [
      {
        date: Update.PADLOCK_PIN,
        roomChanges: {
          pizza: 'recreation:fire_hunt_pizza_no_pin.swf'
        }
      }
    ]
  },
  {
    name: 'The Great Storm of 2009',
    event: true,
    date: '2009-10-11',
    end: '2009-11-02',
    roomChanges: {
      dojoext: 'archives:2009_Storm_dojoext.swf',
      shack: 'archives:2009_Storm_shack.swf',
      dojohide: 'archives:2009_Storm_dojohide.swf',
      mtn: 'archives:2009_Storm_mtn.swf',
      village: 'archives:2009_Storm_village.swf',
      beach: 'recreation:2009_storm/beach.swf',
      berg: 'recreation:2009_storm/berg.swf',
      dock: 'recreation:2009_storm/dock.swf',
      dojo: 'recreation:2009_storm/dojo.swf',
      forts: 'recreation:2009_storm/forts.swf',
      plaza: 'recreation:2009_storm/plaza.swf',
      town: 'recreation:2009_storm/town.swf'
    }
  },
  {
    name: '4th Anniversary Party',
    date: '2009-10-24',
    end: '2009-10-26',
    roomChanges: {
      book: 'archives:RoomsBook-4thAnniversary.swf',
      coffee: 'archives:RoomsCoffee-4thAnniversary.swf',
      town: 'archives:RoomsTown-4thAnniversaryParty.swf'
    },
    music: {
      book: 250,
      coffee: 250,
      town: 250
    },
    startscreens: ['archives:EN4thAnniversaryLoginScreen.swf']
  },
  {
    name: 'Halloween Party',
    date: '2009-10-26',
    end: '2009-11-01',
    roomChanges: {
      mtn: 'archives:HalloweenParty2010SkiHill.swf',
      beach: 'archives:HalloweenParty2009RoomsBeach.swf',
      beacon: 'archives:HalloweenParty2009RoomsBeacon.swf',
      book: 'archives:HalloweenParty2009RoomsBook.swf',
      cave: 'archives:HalloweenParty2009RoomsCave.swf',
      coffee: 'archives:RoomsCoffeeHalloweenParty2009.swf',
      cove: 'archives:HalloweenParty2009RoomsCove.swf',
      lounge: 'archives:RoomsLounge-HalloweenParty2009.swf',
      dock: 'archives:HalloweenParty2009RoomsDock.swf',
      dojo: 'archives:HalloweenParty2009RoomsDojo.swf',
      dojoext: 'archives:HalloweenParty2009RoomsDojoext.swf',
      forest: 'archives:HalloweenParty2009RoomsForest.swf',
      shop: 'archives:RoomsShop-HalloweenParty2009.swf',
      berg: 'archives:HalloweenParty2009RoomsBerg.swf',
      party2: 'archives:HalloweenParty2009RoomsParty2.swf',
      light: 'archives:HalloweenParty2009RoomsLight.swf',
      attic: 'archives:HalloweenParty2009RoomsAttic.swf',
      mine: 'archives:RoomsMine-HalloweenParty2009.swf',
      shack: 'archives:RoomsShack-HalloweenParty2009.swf',
      dance: 'archives:HalloweenParty2009RoomsDance.swf',
      dojohide: 'archives:HalloweenParty2009RoomsDojohide.swf',
      pet: 'archives:HalloweenParty2009RoomsPet.swf',
      pizza: 'archives:RoomsPizza-HalloweenParty2009.swf',
      plaza: 'archives:RoomsPlaza-HalloweenParty2009.swf',
      party: 'archives:HalloweenParty2009RoomsParty.swf',
      lodge: 'archives:HalloweenParty2009RoomsLodge.swf',
      village: 'archives:RoomsVillage-HalloweenParty2009.swf',
      forts: 'archives:HalloweenParty2009RoomsForts.swf',
      rink: 'archives:RoomsRink-HalloweenParty2009.swf',
      sport: 'archives:RoomsSport-HalloweenParty2009.swf',
      town: 'archives:RoomsTown-HalloweenParty2009.swf'
    },
    music: {
      beach: 251,
      beacon: 251,
      book: 252,
      cave: 252,
      coffee: 252,
      cove: 251,
      lounge: 224,
      dock: 251,
      forest: 251,
      shop: 252,
      berg: 251,
      light: 252,
      attic: 252,
      mine: 252,
      shack: 274,
      dance: 224,
      pet: 252,
      pizza: 253,
      plaza: 251,
      mtn: 251,
      lodge: 252,
      village: 251,
      forts: 251,
      rink: 251,
      sport: 252,
      town: 251,
      party: 253,
      party2: 252
    },
    globalChanges: {
      'rooms/NOTLS3EN.swf': 'archives:RoomsNOTLS3EN-HalloweenParty2009.swf'
    }
  },
  {
    name: 'Celebration of Fire',
    date: Update.FIRE_CELEBRATION_START,
    end: '2009-11-27',
    roomChanges: {
      // I actually don't know if this dojo exterior
      // is from this date, archives lists it as being from later one
      dojoext: 'archives:RoomsDojoext-FireCelebrate.swf',
      dojohide: 'archives:RoomsDojohide-FireCelebratePre2.swf',
      dojofire: 'archives:RoomsDojofire-FireCelebratePre2.swf'
    },
    construction: {
      date: '2009-11-05',
      comment: 'Construction for Amulets begins in the Dojo Courtyard',
      changes: {
        dojoext: 'archives:RoomsDojoext-FireCelebratePre.swf'
      },
      updates: [
        {
          comment: 'Construction for the Fire Dojo begins',
          date: Update.FIRE_CONST_START,
          changes: {
            dojofire: 'archives:RoomsDojofire-FireCelebratePre.swf',
            // reverting back to normality
            dojohide: 'archives:RoomsDojohide_2.swf'
          }
        }
      ]
    },
    updates: [
      {
        date: '2009-11-23',
        comment: 'Card-Jitsu Fire is now available',
        roomChanges: {
          dojohide: 'archives:RoomsDojohide-FireCelebrate.swf',
          dojofire: 'archives:RoomsDojofire-FireCelebrate.swf'
        }
      }
    ],
    startscreens: ['archives:ENLoginBackgroundsCard_jitsu_fire-FireCelebrate.swf']
  },
  {
    name: 'Winter Party',
    date: '2009-11-27',
    end: '2009-11-30',
    roomChanges: {
      mtn: 'archives:RoomsMtn-WinterParty.swf',
      village: 'archives:RoomsVillage-WinterParty.swf',
      rink: 'archives:RoomsRink-WinterParty.swf',
      party: 'archives:RoomsParty-WinterParty.swf',
      party2: 'archives:RoomsParty2-WinterParty.swf',
      party3: 'fix:RoomsParty3-WinterParty.swf',
      party4: 'fix:RoomsParty4-WinterParty.swf',
      party5: 'fix:RoomsParty5-WinterParty.swf',
      party6: 'fix:RoomsParty6-WinterParty.swf',
      party7: 'archives:RoomsParty7-WinterParty.swf',
      party8: 'archives:RoomsParty8-WinterParty.swf',
      party9: 'archives:RoomsParty9-WinterParty.swf',
      party10: 'fix:RoomsParty10-WinterParty.swf',
      party11: 'archives:RoomsParty11-WinterParty.swf'
    },
    music: {
      rink: 280,
      village: 280,
      mtn: 280,
      party: 280,
      party2: 280,
      party3: 280,
      party4: 280,
      party5: 280,
      party6: 280,
      party7: 280,
      party8: 280,
      party9: 280,
      party10: 280,
      party11: 247
    },
    localChanges: {
      'close_ups/maze_map.swf': {
        'en': 'archives:ENClose_upsMaze_map-WinterParty.swf'
      }
    }
  },
  {
    name: 'Holiday Party',
    date: '2009-12-18',
    end: '2009-12-29',
    roomChanges: {
      ship: 'archives:HolidayParty2010Ship.swf',
      shipnest: 'archives:HolidayParty2010ShipNest.swf',
      shipquarters: 'archives:HolidayParty2010ShipQuarters.swf',
      shiphold: 'archives:HolidayParty2010ShipHold.swf',
      beach: 'archives:RoomsBeach-HolidayParty2009.swf',
      cove: 'archives:RoomsCove-HolidayParty2009.swf',
      dojofire: 'archives:RoomsDojofire-HolidayParty2009.swf',
      light: 'archives:RoomsLight-HolidayParty2009.swf',
      village: 'archives:RoomsVillage-HolidayParty2009.swf',
      beacon: 'archives:RoomsBeacon-HolidayParty2009.swf',
      forest: 'archives:RoomsForest-HolidayParty2009.swf',
      attic: 'archives:RoomsAttic-HolidayParty2009.swf',
      pizza: 'archives:RoomsPizza-HolidayParty2009.swf',
      forts: 'archives:RoomsForts-HolidayParty2009.swf',
      book: 'archives:RoomsBook-HolidayParty2009.swf',
      lounge: 'archives:RoomsLounge-HolidayParty2009.swf',
      shop: 'archives:RoomsShop-HolidayParty2009.swf',
      party: 'archives:RoomsParty-HolidayParty2009.swf',
      plaza: 'archives:RoomsPlaza-HolidayParty2009.swf',
      town: 'archives:RoomsTown-HolidayParty2009.swf',
      dock: 'archives:RoomsDock-HolidayParty2009.swf',
      agent: 'archives:HolidayParty2009AgentHQ.swf',
      shack: 'archives:RoomsShack-HolidayParty2009.swf',
      coffee: 'archives:RoomsCoffeeHolidayParty2009.swf',
      dojo: 'archives:RoomsDojo-HolidayParty2009.swf',
      berg: 'archives:RoomsBerg-HolidayParty2009.swf',
      dance: 'archives:RoomsDance-HolidayParty2009.swf',
      mtn: 'archives:RoomsMtn-HolidayParty2009.swf',
      agentcom: 'archives:RoomsAgentcom-HolidayParty2009.swf',
      dojoext: 'archives:RoomsDojoext-HolidayParty2009.swf',
      rink: 'archives:RoomsRink-HolidayParty2009.swf',
      dojohide: 'archives:RoomsDojohide-HolidayParty2009.swf',
      lodge: 'archives:RoomsLodge-HolidayParty2009.swf'
    },
    music: {
      attic: 255,
      beach: 254,
      beacon: 254,
      berg: 227,
      book: 255,
      coffee: 255,
      cove: 254,
      dance: 400,
      dock: 254,
      forest: 254,
      forts: 254,
      lodge: 255,
      lounge: 226,
      mtn: 254,
      pizza: 255,
      plaza: 254,
      rink: 254,
      shack: 254,
      town: 254,
      village: 254,
      party: 281
    },
    activeMigrator: true,
    construction: {
      date: '2009-12-11',
      changes: {
        beach: 'archives:RoomsBeach-HolidayParty2009Pre.swf',
        shipquarters: 'archives:RoomsShipquarters-HolidayParty2009Pre.swf',
        shipnest: 'archives:RoomsShipnest-HolidayParty2009Pre.swf',
        lounge: 'archives:RoomsLounge-HolidayParty2009Pre.swf',
        dance: 'archives:RoomsDance-HolidayParty2009Pre.swf',
        ship: 'archives:RoomsShip-HolidayParty2009Pre.swf',
        plaza: 'archives:RoomsPlaza-HolidayParty2009Pre.swf',
        shiphold: 'archives:RoomsShiphold-HolidayParty2009Pre.swf',
        village: 'archives:RoomsVillage-HolidayParty2009Pre.swf',
        town: 'archives:RoomsTown-HolidayParty2009Construction.swf'
      }
    },
    updates: [
      {
        date: Update.QUEST_GOLD_PUFFLE_CHRISTMAS_2009,
        roomChanges: {
          plaza: 'recreation:holiday_09_plaza_quest_golden_puffle.swf'
        }
      }
    ],
    startscreens: ['archives:StartscreenChristmas-HolidayParty2009.swf']
  },
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
      party15: 'archives:MedievalParty2011Party15.swf'
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
          'plaza': 'recreation:water_hunt_planet_y.swf'
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
      'party2': 236,
      'party3': 236,
      'party4': 236,
      'party5': 236,
      'party6': 236,
      'party7': 236,
      'party8': 236,
      'party9': 236,
      'party10': 236,
      'party11': 236,
      'party12': 236,
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
        'en': 'archives:MusicJam2011Poster.swf'
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
    activeMigrator: true,
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
        'en': 'archives:TheGreatSnowRacePoster.swf' 
      }, 
      'catalogues/party.swf': { 
        'en': 'archives:TheGreatSnowRaceCatalogParty.swf' 
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
    generalChanges: {
      'play/v2/content/global/content/interface.swf': 'approximation:interface_fair_11.swf'
    }
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
    activeMigrator: true,
    construction: {
      date: '2011-12-08',
      changes: {
        beach: 'archives:HolidayParty2011ConsBeach.swf',
        town: 'archives:RoomsTown-HolidayParty2011Pre.swf'
      }
    }
  }
];