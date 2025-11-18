import { Update } from ".";

export const UPDATES_2008: Update[] = [
  {
    date: '2008-01-02',
    end: ['party']
  },
  {
    date: '2008-01-04',
    clothingCatalog: 'archives:Clothing_0801.swf'
  },
  {
    date: '2008-01-16',
    // according to newspaper
    // unsure if in the original game the animation replayed each time
    // unless they had some interesting serverside code or the client in this day was different
    // it probably just replayed each time
    miscComments: ['Something happening with The Migrator can be viewed from the telescope'],
    temp: {
      'migrator-crash': {
        fileChanges: {
          'artwork/tools/telescope0.swf': 'archives:BeaconTelescopeCrash.swf'
        }
      }
    }
  },
  {
    date: '2008-01-18',
    // we know on 17th it was still the previous one
    // this date below here is mostly an assumption, but it should be this at most
    // by the 23rd
    miscComments: ['The aftermath of The Migrator crash remains in the telescope'],
    temp: {
      'migrator-crash': {
        fileChanges: {
          'artwork/tools/telescope0.swf': 'archives:TelescopeCrash2.swf'
        }
      }
    }
  },
  {
    date: '2008-01-23',
    miscComments: ['Rockhopper lands in Club Penguin with a rowboat'],
    temp: {
      'migrator-reconstruction': {
        rooms: {
          beach: 'archives:Beach45afterrockycrash.swf'
        }
      }
    }
  },
  {
    date: '2008-01-30',
    miscComments: ['The Migrator\'s remains sink further'],
    temp: {
      'migrator-crash': {
        fileChanges: {
          'artwork/tools/telescope0.swf': 'archives:TelescopeCrash3.swf'
        }
      }
    }
  },
  {
    date: '2008-02-01',
    miscComments: [
      'Rockhopper is seen leaving Club Penguin from the telescope',
      'Save the Migrator is setup at the Beach'
    ],
    clothingCatalog: 'archives:Feb2008.swf',
    temp: {
      'migrator-crash': {
        fileChanges: {
          'artwork/tools/telescope0.swf': 'archives:TelescopeCrash4.swf'
        }
      },
      'migrator-reconstruction': {
        rooms: {
          beach: 'archives:0403beach45.swf'
        }
      }
    }
  },
  {
    date: '2008-02-06',
    miscComments: ['The Migrator is completely sunk'],
    end: ['migrator-crash']
  },
  {
    date: '2008-02-23',
    miscComments: ['Pieces of The Migrator show up at the Beach'],
    temp: {
      'migrator-reconstruction': {
        rooms: {
          beach: 'archives:0223beach45.swf'
        }
      }
    }
  },
  {
    date: '2008-02-29',
    miscComments: ['More pieces show up at the Beach'],
    temp: {
      'migrator-reconstruction': {
        rooms: {
          beach: 'archives:0229beach45.swf'
        }
      }
    }
  },
  {
    date: '2008-03-07',
    miscComments: ['Reconstruction of The Migrator begins'],
    temp: {
      'migrator-reconstruction': {
        rooms: {
          beach: 'archives:0307beach45.swf'
        }
      }
    },
    clothingCatalog: 'archives:PenguinStyleMar2008.swf'
  },
  {
    date: '2008-03-20',
    miscComments: [
      // the date for this is a conjecture, don't know when it actually happened
      'Reconstruction of The Migrator progresses'
    ],
    temp: {
      'migrator-reconstruction': {
        rooms: {
          beach: 'archives:0320beach45.swf'
        }
      }
    }
  },
  {
    date: '2008-03-27',
    miscComments: ['Reconstruction of The Migrator progresses'],
    temp: {
      'migrator-reconstruction': {
        rooms: {
          beach: 'archives:0327beach45.swf'
        }
      }
    }
  },
  {
    date: '2008-04-04',
    clothingCatalog: 'archives:Apr2008.swf'
  },
  {
    date: '2008-04-10',
    miscComments: ['The Migrator is cleaned up and a new device is at the Beach'],
    temp: {
      'migrator-reconstruction': {
        rooms: {
          beach: 'archives:0410beach45.swf'
        },
        migrator: true
      }
    }
  },
  {
    date: '2008-04-17',
    miscComments: ['Rockhopper is spotted through the telescope'],
    temp: {
      'migrator-reconstruction': {
        fileChanges: {
          'artwork/tools/telescope0.swf': 'archives:Telescope0417.swf'
        }
      }
    }
  },
  {
    date: '2008-04-25',
    end: ['migrator-reconstruction']
  },
  {
    date: '2008-05-02',
    clothingCatalog: 'archives:May2008.swf'
  },
  {
    date: '2008-06-06',
    clothingCatalog: 'archives:Jun2008.swf'
  },
  {
    date: '2008-06-20',
    furnitureCatalog: 'archives:Jun-Jul2008Furniture.swf'
  },
  {
    date: '2008-07-04',
    clothingCatalog: 'archives:July08Style.swf'
  },
  {
    date: '2008-07-15',
    miscComments: ['The Club Penguin Improvement Project is implemented'],
    rooms: {
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
      beacon: 'recreation:beacon_nolight.swf',
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
      shop: 'recreation:shop_cpip.swf',
      coffee: 'archives:RoomsCoffee-January2010.swf',
      lounge: 'archives:RoomsLounge.swf',
      boiler: 'archives:RoomsBoiler-January2010.swf',
      attic: 'archives:RoomsAttic.swf',
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
    music: {
      // no idea on this one's date, adding it here
      lounge: 6
    },
    memberRooms: {
      dojofire: true,
      dojowater: true,
    },
    fileChanges: {
      'play/v2/client/startscreen.swf': 'recreation:startscreen/cpip.swf',
      'play/v2/client/shell.swf': 'approximation:shell.swf',
      'play/v2/client/engine.swf': 'unknown:engine_2009.swf',
      'play/v2/client/interface.swf': 'recreation:interfaces/2008_july.swf',
      'play/v2/client/login.swf': 'recreation:login_cpip.swf',
      'play/v2/client/igloo.swf': 'recreation:client_igloo_cpip.swf',
      'play/v2/content/global/binoculars/empty.swf': 'slegacy:media/play/v2/content/global/binoculars/empty.swf',
      'play/v2/content/global/telescope/empty.swf': 'slegacy:media/play/v2/content/global/telescope/empty.swf',
      'play/v2/content/global/igloo/assets/igloo_background.swf': 'slegacy:media/play/v2/content/global/igloo/assets/igloo_background.swf',
      // this puffle roundup is a placeholder, TODO needs to be updated
      'play/v2/games/roundup/PuffleRoundup.swf': 'fix:PuffleRoundupWhitePuffle.swf'
    },
    startscreens: [ 'recreation:startscreen/cpip_logo.swf' ],
    localChanges: {
      'forms/moderator.swf': {
        'en': 'recreation:pre_epf_moderator_form.swf'
      },
      'forms/library.swf': {
        'en': 'recreation:library/cpip.swf'
      },
      'forms/missions.swf': {
        'en': 'recreation:forms_missions/cpip.swf'
      },
      'catalogues/clothing.swf': {
        'en': 'recreation:catalog/clothing_cpip.swf'
      },
      'catalogues/furniture.swf': {
        'en': 'recreation:catalog/furniture_cpip.swf'
      },
      'catalogues/adopt.swf': {
        'en': 'recreation:catalog/adopt_cpip.swf'
      },
      'catalogues/costume.swf': {
        'en': 'recreation:catalog/costume_cpip.swf'
      },
      'catalogues/hair.swf': {
        'en': 'recreation:catalog/hair_cpip.swf'
      },
      'catalogues/igloo.swf': {
        'en': 'recreation:catalog/igloo_cpip.swf'
      },
      'catalogues/sport.swf': {
        'en': 'recreation:catalog/sport_cpip.swf'
      },
      'catalogues/fish.swf': {
        'en': 'archives:TheFish2009.swf'
      },
      'catalogues/pets.swf': {
        en: 'archives:May2008LoveYourPet.swf'
      }
    },
    map: 'unknown:cpip_map_no_dojoext.swf',
    iglooList: {
      file: 'recreation:igloo_music/cpip_start.swf',
      hidden: true
    }
  },
  {
    date: '2008-07-18',
    furnitureCatalog: 'archives:FurnJul2008.swf',
    iglooList: [
      [{ display: 'Fiesta', id: 229, new: true }, { display: 'Jazz', id: 211 }],
      [{ display: 'Aqua Grabber', id: 114, new: true }, { display: 'Ocean Voyage', id: 212 }],
      [{ display: 'Medieval Town', id: 233, new: true }, { display: 'Cool Surf', id: 214 }],
      [{ display: 'Pizza Parlor', id: 20 }, { display: 'Coffee Shop', id: 1 }],
      [{ display: 'Superhero', id: 32 }, { display: 'Dance Mix 1', id: 2 }],
      [{ display: 'Fall Fair', id: 221 }, { display: 'Dance Mix 2', id: 5 }],
      [{ display: 'Folk Guitar', id: 209 }, { display: 'Water Party', id: 217 }]
    ]
  },
  {
    date: '2008-08-01',
    clothingCatalog: 'archives:PSAug2008.swf'
  },
  {
    date: '2008-08-15',
    iglooCatalog: 'archives:August2008Igloo.swf'
  },
  {
    date: '2008-08-29',
    furnitureCatalog: 'archives:FurnAug2008.swf'
  },
  {
    date: '2008-09-05',
    clothingCatalog: 'archives:Sep2008.swf'
  },
  {
    date: '2008-09-19',
    furnitureCatalog: 'archives:FurnSep2008.swf'
  },
  {
    date: '2008-10-03',
    clothingCatalog: 'archives:CatOct2008.swf'
  },
  {
    date: '2008-10-07',
    miscComments: ['Mission 9: Operation: Spy & Seek is added'],
    localChanges: {
      'forms/missions.swf': {
        en: 'recreation:forms_missions/m9.swf'
      }
    }
  },
  {
    date: '2008-10-17',
    furnitureCatalog: 'archives:FurnOct2008.swf',
    iglooList: [
      [{ display: 'Halloween', id: 223, new: true }, { display: 'Pizza Parlor', id: 20 }],
      [{ display: 'Halloween Dance', id: 224, new: true }, { display: 'Ocean Voyage', id: 212 }],
      [{ display: 'Epic Battle', id: 236, new: true }, { display: 'Cool Surf', id: 214 }],
      [{ display: 'Aqua Grabber', id: 114 }, { display: 'Coffee Shop', id: 1 }],
      [{ display: 'Medieval Town', id: 233 }, { display: 'Superhero', id: 32 }],
      [{ display: 'Fiesta', id: 229 }, { display: 'Dance Mix', id: 5 }],
      [{ display: 'Fall Fair', id: 221 }, { display: 'Water Party', id: 217 }]
    ],
    migrator: 'archives:RHRIOct2008.swf'
  },
  {
    date: '2008-10-24',
    miscComments: ['The start screen is updated with the introduction of Unlock Items Online'],
    fileChanges: {
      'play/v2/client/startscreen.swf': 'recreation:startscreen/unlock_items.swf',
      'play/v2/client/login.swf': 'archives:ClientLogin2008.swf'
    },
    localChanges: {
      'forms/library.swf': {
        en: 'recreation:library/yearbook_08.swf'
      }
    },
    startscreens: [ 'recreation:startscreen/unlock_items_logo.swf' ]
  },
  {
    date: '2008-10-27',
    migrator: false
  },
  {
    date: '2008-11-07',
    clothingCatalog: 'archives:CatNov2008.swf'
  },
  {
    date: '2008-12-05',
    clothingCatalog: 'archives:December08Style.swf'
  },
  {
    date: '2008-12-12',
    furnitureCatalog: 'archives:FurnDec2008.swf',
    iglooList: [
      [{ display: 'Snowy Holiday', id: 227, new: true }, { display: 'Cool Surf', id: 214 }],
      [{ display: 'Christmas Piano Medley', id: 255, new: true }, { display: 'Ocean Voyage', id: 212 }],
      [{ display: 'Anniversary Party', id: 250, new: true }, { display: 'Medieval Town', id: 233 }],
      [{ display: 'Pop Song', id: 243 }, { display: 'Epic Battle', id: 236 }],
      [{ display: 'Team Blue 2', id: 36 }, { display: 'Superhero', id: 32 }],
      [{ display: 'Fiesta', id: 229 }, { display: 'Aqua Grabber', id: 114 }],
      [{ display: 'Fall Fair', id: 221 }, { display: 'Water Party', id: 217 }]
    ],
    migrator: 'recreation:pirate_catalog/08_12.swf'
  },
  {
    date: '2008-12-22',
    migrator: false
  },
  {
    date: '2008-12-23',
    miscComments: ['The start screen is updated'],
    fileChanges: {
      'play/v2/client/startscreen.swf': 'slegacy:media/play/v2/client/startscreen.swf',
    },
    startscreens: [
      ['access_more.swf', 'slegacy:media/play/v2/content/local/en/login/backgrounds/access_more.swf'],
      ['celebrate_more.swf', 'slegacy:media/play/v2/content/local/en/login/backgrounds/celebrate_more.swf'],
      ['create_more.swf', 'slegacy:media/play/v2/content/local/en/login/backgrounds/create_more.swf'],
      ['explore_more.swf', 'slegacy:media/play/v2/content/local/en/login/backgrounds/explore_more.swf']
    ]
  },
  {
    date: '2008-12-29',
    miscComments: ['Mission 10: Waddle Squad is added'],
    localChanges: {
      'forms/missions.swf': {
        en: 'recreation:forms_missions/m10.swf'
      }
    }
  }
];