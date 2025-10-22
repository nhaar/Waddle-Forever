import { PermanentUpdateTimeline, ComplexTemporaryUpdateTimeline } from ".";
import { PRE_BOILER_ROOM_PAPERS } from "./newspapers";
import { PartyChanges } from "./parties";
import { Update } from "./updates";

type StandaloneChange = {
  route: string;
  fileId: number;
  date: string;
  comment?: string;
};

type StandaloneTemporaryChange = {
  startDate: string;
  endDate: string;
  fileRef: string;
  comment?: string;
  endComment?: string;
  updates?: Array<{
    date: string;
    fileRef: string;
    comment?: string;
  }>
}

type PermanentUpdate = PartyChanges & {
  comment?: string;
}

export const STANDALONE_UPDATES: PermanentUpdateTimeline<PermanentUpdate> = [
  {
    date: Update.BETA_RELEASE,
    map: "recreation:map_release.swf"
  },
  {
    date: Update.PRE_CPIP_REWRITE_DATE,
    map: 'approximation:map_beach_changed_id.swf'
  },
  {
    date: '2007-01-15', // rough estimate date
    map: 'recreation:map_vector_original.swf',
    comment: 'The map is vectorized'
  },
  {
    date: Update.CPIP_UPDATE,
    roomChanges: {
      town: 'archives:RoomsTown.swf',
      rink: 'archives:RoomsRink.swf',
      village: 'archives:RoomsVillage.swf',
      forts: 'archives:FortsWithIceRinkStadium.swf',
      // the only SWF we have of CPIP before renovation
      pizza: 'archives:RoomsPizza-January2010.swf',
      plaza: 'recreation:plaza_squidzoid_sign.swf',
      book: 'archives:BookPrePenguinArt.swf',
      beach: 'archives:RoomsBeach-2.swf',
      mtn: 'recreation:mtn_cpip_start.swf',
      berg: 'archives:RoomsBerg.swf',
      beacon: 'archives:PreAugust2011Beacon.swf',
      // post island adventure update
      boxdimension: 'archives:RoomsBoxdimension-January2010.swf',
      cave: 'archives:RoomsCave.swf',
      // recreation of proper cove room here
      cove: 'recreation:cpip_cove_precatalog.swf',
      dance: 'recreation:dance_cpip_premusicjam.swf',
      dock: 'recreation:dock_cpip_precatalog.swf',
      light: 'recreation:light_cpip_start.swf',
      stage: 'archives:RoomsStage2008-07-15-Squidzoid.swf',
      lodge: 'recreation:lodge_cpip_start.swf',
      pet: 'recreation:pet_pre_white.swf',
      shop: 'archives:RoomsShop.swf',
      coffee: 'archives:RoomsCoffee1.swf',
      lounge: 'archives:RoomsLounge.swf',
      boiler: 'archives:RoomsBoiler-January2010.swf',
      attic: 'slegacy:media/play/v2/content/global/rooms/attic.swf',
      sport: 'archives:RoomsSport_2.swf',
      lake: 'slegacy:media/play/v2/content/global/rooms/lake.swf',
      cavemine: 'slegacy:media/play/v2/content/global/rooms/cavemine.swf',
      dojo: 'recreation:dojo_cpip_start.swf',
      shiphold: 'slegacy:media/play/v2/content/global/rooms/shiphold.swf',
      shipnest: 'slegacy:media/play/v2/content/global/rooms/shipnest.swf',
      shipquarters: 'slegacy:media/play/v2/content/global/rooms/shipquarters.swf',
      agent: 'recreation:agent_2008_apr_cpip.swf',
      mine: 'archives:RoomsMine_1.swf',
      shack: 'archives:RoomsShack.swf',
      forest: 'archives:RoomsForest.swf',
      ship: 'archives:RoomsShip.swf'
    },
    generalChanges: {
      'play/v2/client/startscreen.swf': 'recreation:startscreen/cpip.swf',
      'play/v2/content/local/en/login/backgrounds/anniversary.swf': 'recreation:startscreen/cpip_logo.swf'
    },
    startscreens: ['anniversary.swf'], // the name "anniversary" is dummy, it's just the byproduct of how the recreation was made
    localChanges: {
      'forms/moderator.swf': {
        'en': 'recreation:pre_epf_moderator_form.swf'
      }
    },
    music: {
      // placeholder play
      stage: 32,
      // no idea on this one's date, adding it here
      lounge: 6
    },
    map: 'unknown:cpip_map_no_dojoext.swf'
  },
  {
    date: '2008-10-24',
    comment: 'The start screen is updated with the introduction of Unlock Items Online',
    generalChanges: {
      'play/v2/client/startscreen.swf': 'recreation:startscreen/unlock_items.swf',
      'play/v2/content/local/en/login/backgrounds/anniversary.swf': 'recreation:startscreen/unlock_items_logo.swf'
    }
  },
  {
    date: '2008-12-23',
    comment: 'The start screen is updated',
    generalChanges: {
      'play/v2/client/startscreen.swf': 'slegacy:media/play/v2/client/startscreen.swf',
    },
    startscreens: ['access_more.swf', 'celebrate_more.swf', 'create_more.swf', 'explore_more.swf'],
  },
  {
    date: Update.EPF_RELEASE,
    localChanges: {
      'forms/moderator.swf': {
        'en': 'slegacy:media/play/v2/content/local/en/forms/moderator.swf'
      }
    }
  }
];

type TemporaryGroupUpdate = PartyChanges & {
  comment?: string;
  endComment?: string;
};

export const STANDALONE_TEMPORARY_UPDATES: ComplexTemporaryUpdateTimeline<TemporaryGroupUpdate> = [
  {
    date: '2008-01-16',
    end: Update.ROCKHOPPER_ARRIVAL_PARTY_START,
    updates: [
      {
        // according to newspaper
        // unsure if in the original game the animation replayed each time
        // unless they had some interesting serverside code or the client in this day was different
        // it probably just replayed each time

        comment: 'Something happening with The Migrator can be viewed from the telescope',
        generalChanges: {
          // TODO telescope abstraction
          'artwork/tools/telescope0.swf': 'archives:BeaconTelescopeCrash.swf'
        }
      },
      {
          // we know on 17th it was still the previous one
          // this date below here is mostly an assumption, but it should be this at most
          // by the 23rd
          date: '2008-01-18',
          generalChanges: {
            'artwork/tools/telescope0.swf': 'archives:TelescopeCrash2.swf'
          },
          comment: 'The aftermath of The Migrator crash remains in the telescope'
      },
      {
        comment: 'Rockhopper lands in Club Penguin with a rowboat',
        date: '2008-01-23',
        roomChanges: {
          beach: 'archives:Beach45afterrockycrash.swf'
        }
      },
      {
        date: '2008-01-30',
        comment: 'The Migrator\'s remains sink further',
        generalChanges: {
          'artwork/tools/telescope0.swf': 'archives:TelescopeCrash3.swf'
        }
      },
      {
        date: '2008-02-01',
        end: '2008-02-06',
        comment: 'Rockhopper is seen leaving Club Penguin from the telescope',
        endComment: 'The Migrator is completely sunk',
        generalChanges: {
          'artwork/tools/telescope0.swf': 'archives:TelescopeCrash4.swf'
        }
      },
      {
        date: '2008-02-01',
        comment: 'Save the Migrator is setup at the Beach',
        roomChanges: {
          beach: 'archives:0403beach45.swf'
        },
      },
      {
        date: '2008-02-23',
        comment: 'Pieces of The Migrator show up at the Beach',
        roomChanges: {
          beach: 'archives:0223beach45.swf'
        }
      },
      {
        date: '2008-02-29',
        comment: 'More pieces show up at the Beach',
        roomChanges: {
          beach: 'archives:0229beach45.swf'
        }
      },
      {
        date: '2008-03-07',
        comment: 'Reconstruction of The Migrator begins',
        roomChanges: {
          beach: 'archives:0307beach45.swf'
        }
      },
      {
        // this date is a conjecture, don't know when it actually happened
        date: '2008-03-20',
        comment: 'Reconstruction of The Migrator progresses',
        roomChanges: {
          beach: 'archives:0320beach45.swf'
        }
      },
      {
        date: '2008-03-27',
        comment: 'Reconstruction of The Migrator progresses',
        roomChanges: {
          beach: 'archives:0327beach45.swf'
        }
      },
      {
        date: '2008-04-10',
        comment: 'The Migrator is cleaned up and a new device is at the Beach',
        roomChanges: {
          beach: 'archives:0410beach45.swf'
        },
        activeMigrator: true,
        end: null
      },
      {
        date: '2008-04-17',
        end: null,
        comment: 'Rockhopper is spotted through the telescope',
        generalChanges: {
          'artwork/tools/telescope0.swf': 'archives:Telescope0417.swf'
        }
      }
    ]
  },
  {
    // placeholder for the CPIP music list update, needs to be refactored somewhat depending on how future igloo lists are handled
    date: Update.CPIP_UPDATE,
    end: '2008-07-18',
    globalChanges: {
      'content/igloo_music.swf': 'recreation:igloo_music/cpip_start.swf'
    }
  },
  {
    date: '2007-02-02',
    end: '2007-02-09',
    generalChanges: {
      'artwork/tools/telescope0.swf': 'archives:Telescope5.swf'
    },
    comment: 'Rockhopper is seen from the telescope',
    updates: [
      {
        date: '2007-02-07',
        generalChanges: {
          'artwork/tools/telescope0.swf': 'archives:Telescope6.swf'
        },
        comment: 'Rockhopper is seen closer from the telescope'
      }
    ]
  }
]

export const STANDALONE_CHANGE: Record<string, Array<{ fileRef: string; date: string; comment?: string }>> = {
  'chat291.swf': [
    {
      // newspapers-less precpip client
      fileRef: 'approximation:chat291_no_news.swf',
      date: Update.BETA_RELEASE
    },
    {
      // precpip client with newspapers
      fileRef: 'unknown:chat291.swf',
      date: PRE_BOILER_ROOM_PAPERS[0]
    }
  ],
  'play/v2/client/shell.swf': [
    {
      fileRef: 'slegacy:media/play/v2/client/shell.swf',
      date: Update.CPIP_UPDATE
    },
    {
      fileRef: 'svanilla:media/play/v2/client/shell.swf',
      date: Update.MODERN_AS3
    }
  ],
  'play/v2/client/engine.swf': [
    {
      fileRef: 'unknown:engine_2009.swf',
      date: Update.CPIP_UPDATE
    },
    {
      // engine that has EPF and stuff
      fileRef: 'slegacy:media/play/v2/client/engine.swf',
      date: Update.EPF_RELEASE
    },
    {
      fileRef: 'svanilla:media/play/v2/client/engine.swf',
      date: Update.MODERN_AS3
    }
  ],
  'play/v2/client/interface.swf': [
    {
      fileRef: 'recreation:interfaces/2008_july.swf',
      date: Update.CPIP_UPDATE
    },
    {
      fileRef: 'recreation:interfaces/2009_jan.swf',
      date: '2009-01-20',
      comment: 'A membership badge is added to the player card'
    },
    {
      // interface with EPF phone
      fileRef: 'recreation:interfaces/2010_may.swf',
      date: Update.EPF_RELEASE
    },
    {
      fileRef: 'recreation:interfaces/2010_july.swf',
      date: Update.STAMPS_RELEASE
    },
    {
      fileRef: 'unknown:interface_stamps.swf',
      date: Update.OWNED_IGLOOS,
      comment: 'The owned igloos list is added'
    }
  ],
  'play/v2/client/club_penguin.swf': [
    {
      // this file is from Dec 2010, but will be using it as a placeholder
      // one from november 2010 exists in archives, and should be included if they are different
      fileRef: 'archives:Dec2010club_penguin.swf',
      date: Update.AS3_UPDATE
    }
  ],
  'play/v2/client/igloo.swf': [
    {
      fileRef: 'recreation:client_igloo_cpip.swf',
      date: Update.CPIP_UPDATE
    },
    {
      fileRef: 'slegacy:media/play/v2/client/igloo.swf',
      date: Update.OWNED_IGLOOS
    }
  ],
  'play/v2/client/Newspaper.swf': [
    {
      fileRef: 'archives:Dec2010ClientNewspaper.swf',
      date: Update.AS3_UPDATE
    }
  ],
  'play/v2/games/paddle/paddle.swf': [
    {
      fileRef: 'slegacy:media/play/v2/games/paddle/paddle.swf',
      date: Update.FAIR_2011_START
    },
    {
      fileRef: 'recreation:paddle_no_brown.swf',
      date: Update.FAIR_2010_START
    }
  ],
  'play/v2/content/local/en/close_ups/digposter2.swf': [
    {
      // permanent dig poster after cave expedition
      date: Update.CAVE_EXPEDITION_END,
      fileRef: 'slegacy:media/play/v2/content/local/en/close_ups/digposter2.swf' 
    }
  ],
  'play/v2/client/dependencies.json': [
    {
      // have no better place to put the default dependencies.json
      date: Update.BETA_RELEASE,
      fileRef: 'slegacy:media/play/v2/client/dependencies.json' 
    }
  ],
  'play/v2/content/global/binoculars/empty.swf': [
    {
      // placeholder binoculars
      date: Update.CPIP_UPDATE,
      fileRef: 'slegacy:media/play/v2/content/global/binoculars/empty.swf'
    }
  ],
  'play/v2/content/global/telescope/empty.swf': [
    {
      // placeholder telescope
      date: Update.CPIP_UPDATE,
      fileRef: 'slegacy:media/play/v2/content/global/telescope/empty.swf'
    }
  ],
  'play/v2/content/global/igloo/assets/igloo_background.swf': [
    {
      // placeholder igloo background
      date: Update.CPIP_UPDATE,
      fileRef: 'slegacy:media/play/v2/content/global/igloo/assets/igloo_background.swf'
    }
  ],
  'play/v2/content/local/en/catalogues/ninja.swf': [
    {
      fileRef: 'archives:November09Ninja2.swf',
      comment: 'The amulet is added to the Martial Artworks',
      date: '2009-11-13',
    }
  ],
  'play/v2/content/local/en/catalogues/pets.swf': [
    {
      date: '2010-03-19',
      fileRef: 'archives:Mar2010Pets.swf'
    }
  ],
  'play/v2/content/local/en/forms/library.swf': [
    {
      date: '2009-10-24',
      fileRef: 'recreation:library_2009.swf'
    },
    {
      date: Update.ANNIVERSARY_5_START,
      fileRef: 'archives:ENFormsLibrary-2010.swf'
    }
  ],
  'play/v2/content/local/en/postcards/111.swf': [
    {
      date: '2010-02-25',
      fileRef: 'recreation:postcard_orange_puffle.swf'
    },
    {
      date: '2011-02-17',
      fileRef: 'archives:Enm111.swf'
    }
  ],
  'play/v2/games/roundup/PuffleRoundup.swf': [
    {
      // orange puffle version, must add white puffle version too later
      date: Update.CPIP_UPDATE,
      fileRef: 'recreation:puffle_roundup_orange.swf'
    }
  ],
  'play/v2/content/local/en/catalogues/costume.swf': [
    {
      // placeholder CPIP stage
      date: Update.CPIP_UPDATE,
      fileRef: 'archives:January2009Costume.swf'
    }
  ]
};

export const STANDALONE_TEMPORARY_CHANGE: Record<string, StandaloneTemporaryChange[]> = {
  'play/v2/content/global/rooms/mtn.swf': [
    {
      startDate: Update.MUSIC_JAM_2010_CONST_START,
      endDate: Update.JULY_4_2010_END,
      fileRef: 'archives:2010newyearfireworksskihill.swf' // same as new years day
    }
  ],
  'play/v2/content/global/rooms/berg.swf': [
    {
      // removing fireworks in music jam construction for the iceberg
      startDate: Update.JULY_4_2010_END,
      endDate: Update.MUSIC_JAM_2010_START,
      fileRef: 'recreation:iceberg_mjamconst_no_fireworks.swf'
    }
  ],
  'play/v2/content/global/binoculars/empty.swf': [
    {
      startDate: '2010-10-21',
      endDate: Update.HALLOWEEN_2010_START,
      fileRef: 'archives:Storm_on_horizon.swf',
      comment: 'A storm is approaching and visible from the Cove'
    }
  ],
  'artwork/rooms/plaza.swf': [
    {
      startDate: Update.CHRISTMAS_2006_DECORATION,
      endDate: '2006-12-21',
      fileRef: 'archives:ArtworkRoomsPlaza42.swf',
      comment: 'A tree is available to be decorated for Christmas'
    },
    {
      startDate: '2007-12-14',
      endDate: Update.CHRISTMAS_2007_START,
      fileRef: 'archives:RoomsPlaza-ChristmasParty2007Pre.swf',
      comment: 'The Coins For Change event begins'
    }
  ]
}