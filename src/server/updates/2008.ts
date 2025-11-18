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
      },
      'party': {
        partyName: 'Winter Fiesta',
        rooms: {
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
      }
    }
  },
  {
    date: '2008-01-21',
    end: ['party']
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
    date: '2008-02-15',
    temp: {
      party: {
        partyName: 'Sub-Marine Party',
        rooms: {
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
      }
    }
  },
  {
    date: '2008-02-22',
    end: ['party']
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
    date: '2008-03-14',
    temp: {
      party: {
        partyName: 'St. Patrick\'s Day Party',
        rooms: {
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
      }
    }
  },
  {
    date: '2008-03-18',
    end: ['party']
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
    date: '2008-03-21',
    temp: {
      party: {
        partyName: 'Easter Egg Hunt',
        rooms: {
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
      }
    }
  },
  {
    date: '2008-03-24',
    end: ['party']
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
    date: '2008-03-28',
    temp: {
      party: {
        partyName: 'April Fools\' Party',
        rooms: {
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
        fileChanges: {
          'games/thinice/game.swf': 'archives:Thinicetrobarrier.swf',
          'artwork/tools/binoculars1.swf': 'archives:Binoculars-AprilFools2008.swf',
          'artwork/tools/telescope0.swf': 'archives:Telescope-AprilFools2008.swf'
        }
      }
    }
  },
  {
    date: '2008-04-02',
    end: ['party']
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
    end: ['migrator-reconstruction'],
    temp: {
      party: {
        partyName: 'Rockhopper & Yarr\'s Arr-ival Parr-ty',
        rooms: {
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
        migrator: true
      }
    }
  },
  {
    date: '2008-04-28',
    end: ['party']
  },
  {
    date: '2008-05-02',
    clothingCatalog: 'archives:May2008.swf'
  },
  {
    date: '2008-05-16',
    temp: {
      party: {
        partyName: 'Medieval Party',
        rooms: {
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
      }
    }
  },
  {
    date: '2008-05-25',
    end: ['party']
  },
  {
    date: '2008-06-06',
    clothingCatalog: 'archives:Jun2008.swf'
  },
  {
    date: '2008-06-13',
    temp: {
      party: {
        partyName: 'Water Party',
        rooms: {
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
      }
    }
  },
  {
    date: '2008-06-17',
    end: ['party']
  },
  {
    date: '2008-06-20',
    furnitureCatalog: 'archives:Jun-Jul2008Furniture.swf',
    miscComments: ['An earthquake hits the island'],
    temp: {
      'earthquake': {
          rooms: {
          dance: 'archives:RoomsDance-Earthquake2008.swf'
        }
      }
    }
  },
  {
    date: '2008-06-24',
    miscComments: ['The earthquake ends'],
    end: ['earthquake']
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
    ],
    temp: {
      const: {
        rooms: {
          dance: 'recreation:mjam_08_const/dance.swf'
        }
      }
    }
  },
  {
    date: '2008-07-25',
    temp: {
      party: {
        partyName: 'Music Jam',
        rooms: {
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
        }
      }
    }
  },
  {
    date: '2008-08-01',
    clothingCatalog: 'archives:PSAug2008.swf',
    temp: {
      party: {
        rooms: {
          dance: 'recreation:dance_record_pin_mjam.swf',
          cave: 'recreation:cave_mjam08_no_pin.swf'
        }
      }
    }
  },
  {
    date: '2008-08-05',
    roomComment: 'The Dance Club is updated post Music Jam',
    rooms: {
      dance: 'recreation:dance_record_pin.swf'
    },
    end: ['party']
  },
  {
    date: '2008-08-08',
    temp: {
      party: {
        partyName: 'Paper Boat Scavenger Hunt',
        rooms: {
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
        migrator: 'archives:RockhopperRareItemsAug2008.swf'
      }
    }
  },
  {
    date: '2008-08-15',
    iglooCatalog: 'archives:August2008Igloo.swf'
  },
  {
    date: '2008-08-18',
    end: ['party']
  },
  {
    date: '2008-08-22',
    temp: {
      party: {
        partyStart: 'The Penguin Games party begins',
        partyEnd: 'The Penguin Games party ends',
        rooms: {
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
      }
    }
  },
  {
    date: '2008-08-26',
    end: ['party']
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
    date: '2008-09-26',
    temp: {
      party: {
        partyName: 'Fall Fair',
        rooms: {
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
        }
      }
    }
  },
  {
    date: '2008-09-30',
    temp: {
      party: {
        update: 'The plaza was decorated',
        rooms: {
          plaza: 'recreation:fair_2008_plaza_decorated.swf'
        },
        music: {
          plaza: 221
        }
      }
    }
  },
  {
    date: '2008-10-03',
    clothingCatalog: 'archives:CatOct2008.swf'
  },
  {
    date: '2008-10-06',
    end: ['party']
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
    startscreens: [ 'recreation:startscreen/unlock_items_logo.swf' ],
    temp: {
      party: {
        partyName: '3rd Anniversary Party',
        rooms: {
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
      }
    }
  },
  {
    date: '2008-10-27',
    migrator: false,
    end: ['party']
  },
  {
    date: '2008-10-28',
    temp: {
      party: {
        partyName: 'Halloween Party',
        rooms: {
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
      }
    }
  },
  {
    date: '2008-11-02',
    end: ['party']
  },
  {
    date: '2008-11-03',
    temp: {
      party: {
        partyStart: 'The Dig Out the Dojo event begins',
        partyEnd: 'The Dig Out the Dojo event ends',
        rooms: {
          dojo: 'archives:DojoConstruction2008.swf',
          dojoext: 'archives:DojoExtConstruction2008.swf'
        }
      }
    }
  },
  {
    date: '2008-11-07',
    clothingCatalog: 'archives:CatNov2008.swf'
  },
  {
    date: '2008-11-10',
    temp: {
      party: {
        update: 'The excavation progresses, and less snow covers the Dojo',
        rooms: {
          dojo: 'archives:DojoConstruction22008.swf',
          dojoext: 'archives:DojoExtConstruction22008.swf'
        }
      }
    }
  },
  {
    date: '2008-11-14',
    end: ['party'],
    roomComment: 'The dojo has a great reopening',
    rooms : {
      dojo: 'archives:DojoGrandOpening2008.swf'
    },
    map: 'archives:Map2008-2011Stadium.swf'
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
    date: '2008-12-19',
    temp: {
      party: {
        partyName: 'Christmas Party',
        rooms: {
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
      }
    }
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
    end: ['party'],
    miscComments: ['Mission 10: Waddle Squad is added'],
    localChanges: {
      'forms/missions.swf': {
        en: 'recreation:forms_missions/m10.swf'
      }
    }
  }
];