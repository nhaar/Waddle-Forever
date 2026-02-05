import { Update } from ".";

export const UPDATES_2006: Update[] = [
  {
    date: '2006-01-01',
    clothingCatalog: 'archives:Clothing_0601.swf',
    end: ['party'],
    indexHtml: 'old-precpip',
    websiteFolder: 'old',
    rooms: {
      // it is unknown when the mountain was renovated to have ski animations
      mtn: 'mammoth:artwork/rooms/mtn10.swf'
    }
  },
  {
    date: '2006-01-15',
    iglooVersion: 15,
    furnitureCatalog: 'archives:Furniture_0601.swf',
  },
  {
    date: '2006-01-27',
    temp: {
      party: {
        partyName: 'Winter Luau',
        rooms: {
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
      }
    }
  },
  {
    date: '2006-01-29',
    end: ['party']
  },
  {
    date: '2006-02-03',
    clothingCatalog: 'archives:Clothing_0602.swf'
  },
  {
    roomComment: 'Mancala is removed from the HQ',
    date: '2006-02-11',
    rooms: {
      agent: 'archives:ArtworkRoomsAgent10.swf'
    }
  },
  {
    date: '2006-02-14',
    temp: {
      party: {
        partyName: "Valentine's Day Celebration",
        rooms: {
          'dance': 'archives:ArtworkRooms0214Dance.swf',
          'lounge': 'archives:ArtworkRooms0214Lounge.swf'
        }
      }
    }
  },
  {
    date: '2006-02-15',
    end: ['party']
  },
  {
    date: '2006-02-17',
    furnitureCatalog: 'archives:Furniture_0602.swf',
  },
  {
    date: '2006-02-24',
    temp: {
      party: {
        partyName: 'Pizza Parlor Opening Party',
        rooms: {
          'forts': 'archives:ArtworkRoomsForts11.swf',
          'pizza': 'archives:ArtworkRoomsPizza10.swf',
          'town': 'archives:ArtworkRoomsTown13.swf'
        },
        music: {
          'plaza': 2
        },
        frames: {
          'town': 2
        }
      }
    },
    rooms: {
      pizza: 'archives:ArtworkRoomsPizza12.swf',
      plaza: 'archives:ArtworkRoomsPlaza10.swf'
    }
  },
  {
    date: '2006-02-28',
    rooms: {
      // now has path to the plaza
      forts: 'archives:ArtworkRoomsForts12.swf'
    },
    map: 'approximation:map_plaza_no_berg.swf',
    end: ['party']
  },
  {
    date: '2006-03-03',
    clothingCatalog: 'archives:Clothing_0603.swf'
  },
  {
    date: '2006-03-10',
    gameRelease: 'Ice Fishing',
    rooms: {
      lodge: 'mammoth:artwork/rooms/lodge11.swf'
    }
  },
  {
    date: '2006-03-17',
    furnitureCatalog: 'archives:Furniture_0603.swf',
    pin: 'start',
    roomComment: ['The Pet Shop is inaugurated'],
    temp: {
      party: {
        partyStart: 'A celebration for St. Patrick\'s Day and Puffles starts',
        partyEnd: 'The St. Patrick\'s Day and Puffle party ends',
        rooms: {
          'village': 'archives:ArtworkRooms0401Village.swf',
          'plaza': 'archives:ArtworkRoomsPlaza11.swf',
          'town': 'archives:ArtworkRoomsTown12.swf'
        },
        frames: {
          'village': 2
        }
      }
    },
    rooms: {
      plaza: 'archives:ArtworkRoomsPlaza12.swf',
      pet: 'mammoth:artwork/rooms/pet11.swf'
    }
  },
  {
    date: '2006-03-20',
    end: ['party']
  },
  {
    date: '2006-03-23',
    roomComment: 'The Dance Club music is updated',
    music: {
      // switching to crossing over, unknown the exact date, it's around this time though
      dance: 5,
      lounge: 6
    }
  },
  {
    date: '2006-03-29',
    roomComment: ['The HQ is redesigned', 'A new secret room opens'],
    rooms: {
      agent: 'archives:ArtworkRoomsAgent11.swf',
      berg: 'mammoth:artwork/rooms/berg10.swf'
    },
    music: {
      agent: 7
    },
    map: 'archives:ArtworkMapsIsland5.swf'
  },
  {
    date: '2006-03-31',
    temp: {
      party: {
        partyName: 'April Fools\' Party',
        rooms: {
          'dojo': 'archives:ArtworkRooms0401Dojo.swf',
          'rink': 'archives:ArtworkRooms0401Rink.swf',
          'dance': 'archives:ArtworkRooms0401Dance.swf',
          'plaza': 'archives:ArtworkRoomsPlaza13.swf',
          'lodge': 'archives:ArtworkRooms0401Lodge.swf',
          'village': 'archives:ArtworkRooms0401Village.swf',
          'forts': 'archives:ArtworkRooms0401Forts.swf',
          'town': 'archives:ArtworkRooms0401Town.swf'
        },
        fileChanges: {
          'chat291.swf': 'unknown:chat291.swf'
        },
        music: {
          'dance': 201,
          'forts': 201,
          'rink': 201,
          'town': 201,
          'plaza': 201
        },
        frames: {
          'plaza': 3
        }
      }
    }
  },
  {
    date: '2006-04-01',
    dateReference: 'old-rink',
    rooms: {
      // unknown date, you can now walk to the audience in the rink
      // only evidence is after april fools party
      // the date referene here is used to signal the old ice rink changed which influences the puck functionality
      // the file is also seemingly a debug file
      rink: 'fix:ArtworkRoomsRink12.swf'
    }
  },
  {
    date: '2006-04-03',
    end: ['party']
  },
  {
    date: '2006-04-07',
    clothingCatalog: 'archives:Clothing_0604.swf'
  },
  {
    date: '2006-04-14',
    iglooCatalog: 'archives:April2006Igloo.swf',
    temp: {
      party: {
        partyName: 'Easter Egg Hunt',
        decorated: false,
        rooms: {
          'book': 'archives:ArtworkRooms0416Book10.swf',
          'berg': 'archives:ArtworkRooms0416Berg10.swf',
          'dance': 'archives:ArtworkRooms0416Dance10.swf',
          'pet': 'archives:ArtworkRooms0416Pet11.swf',
          'mtn': 'archives:ArtworkRooms0416Mtn10.swf',
          'lodge': 'archives:ArtworkRooms0416Lodge11.swf',
          'village': 'archives:ArtworkRooms0416Village12.swf',
          'forts': 'archives:ArtworkRooms0416Forts12.swf'
        }
      }
    },
    chatVersion: 299,
    clientFiles: [
      427,
      224,
      236,
      362,
      552,
      553
    ],
    removeClientFiles: [104]
  },
  {
    date: '2006-04-16',
    end: ['party'],
    map: 'approximation:map_chat339.swf',
    chatVersion: 339,
    clientFiles: [
      409,
      429,
      457,
      302,
      194,
      193,
      215,
      267,
      269,
      270,
      272,
      273,
      274,
      323,
      325,
      433,
      434,
      192,
      217,
      275,
      327,
      368,
      329,
      435,
      436,
      488,
      461,
      462,
      463,
      254,
      255,
      277,
      278,
      525,
      526,
      527,
      528,
      529,
      530,
      554,
      555,
      556,
      557,
      558,
      559,
      560,
      561,
      901,
      902,
      903,
      904,
      905,
      906,
      907,
      908,
      909,
      910,
      911,
      912,
      913,
      914,
      915,
      916,
      917,
      918,
      919,
      920,
      921
    ]
  },
  {
    date: '2006-04-21',
    iglooVersion: 19,
    furnitureCatalog: 'archives:Furniture_0604.swf',
  },
  {
    date: '2006-04-27',
    roomComment: 'Find Four tables are added to the Ski Lodge',
    rooms: {
      lodge: 'archives:ArtworkRoomsLodge14.swf'
    }
  },
  {
    date: '2006-05-05',
    clothingCatalog: 'archives:Clothing_0605.swf'
  },
  {
    date: '2006-05-12',
    iglooCatalog: 'archives:May2006Igloo.swf'
  },
  {
    date: '2006-05-19',
    iglooVersion: 20,
    furnitureCatalog: 'archives:Furniture_0605.swf',
    dateReference: 'igloo-music',
    iglooList: 'Penguins can now add music to their igloo'
  },
  {
    date: '2006-05-26',
    temp: {
      party: {
        partyName: 'Underground Opening Party',
        rooms: {
          'mine': 'archives:ArtworkRoomsMine10.swf',
          boiler: 'recreation:cave_opening/boiler.swf',
          cave: 'recreation:cave_opening/cave.swf',
          plaza: 'recreation:cave_opening/plaza.swf',
          dance: 'archives:ArtworkRoomsDance12.swf'
        },
        frames: {
          mine: 2,
          dance: 2
        },
        music: {
          'boiler': 203,
          'cave': 202,
          'mine': 203,
          'plaza': 203
        }
      }
    },
    rooms: {
      // manhole path
      plaza: 'archives:ArtworkRoomsPlaza17.swf',
      // green puffle + boiler room trigger
      dance: 'archives:ArtworkRoomsDance14.swf',
      // 2006 client boiler, the party vesion isn't archived
      boiler: 'archives:ArtworkRoomsBoiler11.swf',
      mine: 'archives:ArtworkRoomsMine13.swf'
    }
  },
  {
    date: '2006-05-29',
    end: ['party'],
    rooms: {
      cave: 'archives:ArtworkRoomsCave13.swf',
      shack: 'archives:ArtworkRoomsShack10.swf'
    },
    map: 'approximation:map_shack.swf'
  },
  {
    date: '2006-06-02',
    clothingCatalog: 'archives:Clothing_0606.swf'
  },
  {
    date: '2006-06-06',
    gameRelease: 'Cart Surfer'
  },
  {
    date: '2006-06-09',
    iglooVersion: 21,
    iglooCatalog: 'archives:June2006Igloo.swf',
    postcardCatalog: 'archives:ArtworkCatalogueCards_0606.swf'
  },
  {
    date: '2006-06-16',
    iglooVersion: 31,
    furnitureCatalog:'archives:Furniture_0606.swf',
    temp: {
      party: {
        partyName: 'Summer Party',
        rooms: {
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
        }
      }
    },
    roomComment: ['More rooms are visible from the HQ', 'A new room opens near the Dock'],
    rooms: {
      // now these have a path to the beach
      village: 'archives:ArtworkRoomsVillage13.swf',
      dock: 'archives:ArtworkRoomsDock13.swf',
      agent: 'archives:ArtworkRoomsAgent13.swf',

      beach: 'archives:ArtworkRoomsBeach12.swf'
    },
    // beach opens
    map: 'archives:ArtworkMapsIsland10.swf'
  },
  {
    date: '2006-06-21',
    temp: {
      party: {
        update: 'Two new items are available for the Summer Party',
        rooms: {
          'beach': 'archives:ArtworkRooms0615Beach11.swf',
          'plaza': 'archives:ArtworkRooms0615Plaza19.swf'
        }
      }
    }
  },
  {
    date: '2006-06-25',
    end: ['party']
  },
  {
    date: '2006-07-07',
    clothingCatalog: 'archives:Clothing_0607.swf'
  },
  {
    date: '2006-07-14',
    iglooCatalog: 'archives:July2006Igloo.swf',
    postcardCatalog: 'archives:ArtworkCatalogueCards_0607.swf',
    temp: {
      party: {
        partyName: 'Western Party',
        rooms: {
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
        frames: {
          plaza: 2,
          forts: 2,
          dance: 2,
          town: 2
        }
      }
    }
  },
  {
    date: '2006-07-17',
    end: ['party']
  },
  {
    date: '2006-07-21',
    furnitureCatalog: 'archives:Furniture_0607.swf',
    temp: {
      party: {
        partyName: 'Band Scavenger Hunt',
        decorated: false,
        rooms: {
          'boiler': 'archives:ArtworkRoomsBoiler11.swf',
          'cave': 'archives:ArtworkRooms0721Cave13.swf',
          'dock': 'archives:ArtworkRooms0721Dock13.swf',
          'mtn': 'archives:ArtworkRooms0721Mtn10.swf',
          'lodge': 'archives:ArtworkRooms0721Lodge14.swf',
          'village': 'archives:ArtworkRooms0721Village12.swf',
          'pet': 'archives:ArtworkRooms0721Pet11.swf',
          'pizza': 'archives:ArtworkRooms0721Pizza13.swf'
        },
        fileChanges: {
          'chat339.swf': 'recreation:chat339_instrument_hunt.swf'
        }
      }
    }
  },
  {
    date: '2006-07-23',
    end: ['party']
  },
  {
    date: '2006-08-04',
    clothingCatalog: 'archives:Clothing_0608.swf'
  },
  {
    date: '2006-08-11',
    iglooCatalog: 'archives:August2006Igloo.swf',
    postcardCatalog: 'archives:ArtworkCatalogueCards_0608.swf',
    temp: {
      party: {
        partyName: 'Sports Party',
        rooms: {
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
        frames: {
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
        }
      }
    },
    roomComment: 'The Ice Rink now has score signs',
    rooms: {
      rink: 'archives:ArtworkRoomsRink22.swf'
    },
    fileChanges: {
      'chat339.swf': 'recreation:chat339_with_added_items.swf'
    },
    clientFiles: [
      133,
      134,
      369,
      561,
      290,
      291,
      292,
      293,
      294,
      295,
      296,
      297,
      298,
      299,
      300,
      301,
      562,
      113,
      114,
      182,
      202,
      206,
      256,
      279,
      280,
      282,
      306,
      307,
      353,
      922,
      923,
      924,
      925,
      282,
      563,
      167,
      168,
      270,
      271,
      272,
      273,
      274,
      275,
      926,
      440
    ]
  },
  {
    date: '2006-08-18',
    iglooVersion: 33,
    furnitureCatalog: 'archives:Furniture_0608.swf',
    temp: {
      party: {
        update: 'A new item is in the Snow Forts for the Sports Party',
        rooms: {
          forts: 'archives:ArtworkRoomsForts17.swf'
        },
        frames: {
          forts: 3
        }
      }
    },
    miscComments: ['The first secret agent mission is released'],
    rooms: {
      // placeholder HQ update for the PSA missions
      agent: 'archives:ArtworkRoomsAgent40.swf'
    },
    fileChanges: {
      'artwork/tools/missions.swf': 'archives:ArtworkToolsMissions1.swf'
    }
  },
  {
    date: '2006-08-21',
    roomComment: 'The pool becomes a part of the undeground after the Sports Party ends',
    rooms: {
      cave: 'archives:ArtworkRoomsCave40.swf',
    },
    end: ['party']
  },
  {
    date: '2006-08-25',
    roomComment: 'Purple Puffles are now in the Pet Shop',
    rooms: {
      pet: 'archives:ArtworkRoomsPet12.swf'
    }
  },
  {
    date: '2006-09-01',
    clothingCatalog: 'archives:September06Style.swf'
  },
  {
    date: '2006-09-07',
    constructionComment: 'Construction begins at the Beach',
    temp: {
      event: {
        rooms: {
          beach: 'archives:ArtworkRoomsBeach14.swf'
        }
      }
    }
  },
  {
    date: '2006-09-08',
    iglooVersion: 40,
    iglooCatalog: 'archives:September2006Igloo.swf',
    postcardCatalog: 'archives:ArtworkCatalogueCards_0609.swf'
  },
  {
    date: '2006-09-15',
    miscComments: ['The Lightbulb Hunt begins'],
    furnitureCatalog: 'archives:Furniture_0609.swf',
    temp: {
      event: {
        rooms: {
          attic: 'recreation:lightbulb/attic.swf',
          boiler: 'recreation:lightbulb/boiler.swf',
          dance: 'recreation:lightbulb/dance.swf',
          mine: 'recreation:lightbulb/mine.swf',
          plaza: 'recreation:lightbulb/plaza.swf'
        },
        fileChanges: {
          'chat339.swf': 'recreation:lightbulb/chat339.swf'
        }
      }
    }
  },
  {
    date: '2006-09-21',
    chatVersion: 506,
    fileChanges: {
      'interface.swf': 'recreation:old_interface/old_toolbar.swf'
    },
    map: 'approximation:map_beach_changed_id.swf',
    miscComments: ['The Lightbulb Hunt ends'],
    end: ['event'],
    temp: {
      party: {
        partyName: 'Lighthouse Party',
        rooms: {
          light: 'recreation:lighthouse_party_2006/light.swf',
          beacon: 'recreation:lighthouse_party_2006/beacon.swf',
          beach: 'recreation:lighthouse_party_2006/beach.swf'
        },
        frames: {
          'light': 2,
          'beacon': 2
        },
        music: {
          light: 55556,
          beacon: 55556,
          beach: 55557
        }
      }
    },
    roomComment: 'A new building opens at the Beach',
    rooms: {
      // first room archived with the lighthouse open
      // used for the party since the SWF for the beach in
      // the party is also lost
      beach: 'archives:ArtworkRoomsBeach41.swf',

      // first vectorized version of the Town, possibly from 2007
      // unknown how to document it
      town: 'archives:ArtworkRoomsTown40.swf',

      // date of vectorization is unknown
      plaza: 'archives:ArtworkRoomsPlaza40.swf',

      // placeholder vectorized room, unknown date
      dance: 'archives:ArtworkRoomsDance50.swf',

      // unknown vectorized
      shop: 'archives:ArtworkRoomsShop40.swf',

      // boiler room for the 2007 client
      boiler: 'archives:ArtworkRoomsBoiler40.swf',

      beacon: 'archives:ArtworkRoomsBeacon40.swf',
      light: 'archives:ArtworkRoomsLight40.swf'
    },
    clientFiles: [
      13,
      411,
      415,
      426,
      428,
      430,
      431,
      432,
      437,
      438,
      439,
      440,
      441,
      443,
      444,
      445,
      446,
      447,
      448,
      449,
      450,
      454,
      455,
      458,
      460,
      464,
      465,
      466,
      467,
      468,
      469,
      470,
      471,
      472,
      473,
      474,
      475,
      476,
      477,
      478,
      479,
      480,
      482,
      483,
      485,
      486,
      487,
      489,
      490,
      491,
      492,
      493,
      494,
      495,
      496,
      497,
      498,
      499,
      650,
      651,
      652,
      653,
      654,
      655,
      656,
      657,
      658,
      659,
      660,
      661,
      662,
      663,
      664,
      105,
      111,
      112,
      113,
      114,
      116,
      117,
      118,
      119,
      120,
      121,
      122,
      123,
      124,
      130,
      132,
      133,
      134,
      135,
      136,
      137,
      138,
      162,
      166,
      167,
      168,
      169,
      170,
      179,
      180,
      182,
      183,
      184,
      185,
      186,
      191,
      195,
      303,
      304,
      305,
      306,
      307,
      308,
      309,
      310,
      312,
      313,
      314,
      315,
      202,
      203,
      204,
      205,
      206,
      207,
      208,
      209,
      210,
      211,
      213,
      223,
      225,
      226,
      227,
      228,
      229,
      230,
      231,
      232,
      239,
      241,
      242,
      243,
      245,
      246,
      247,
      248,
      249,
      250,
      251,
      256,
      257,
      259,
      258,
      260,
      264,
      265,
      266,
      268,
      271,
      276,
      279,
      280,
      281,
      282,
      283,
      284,
      285,
      286,
      287,
      288,
      289,
      290,
      291,
      292,
      293,
      294,
      295,
      296,
      297,
      298,
      299,
      760,
      761,
      762,
      763,
      764,
      765,
      766,
      767,
      768,
      769,
      770,
      771,
      772,
      773,
      774,
      775,
      778,
      780,
      781,
      782,
      321,
      322,
      324,
      326,
      328,
      330,
      331,
      332,
      333,
      334,
      335,
      336,
      337,
      338,
      339,
      340,
      341,
      342,
      343,
      344,
      345,
      346,
      347,
      348,
      349,
      350,
      353,
      354,
      355,
      357,
      358,
      359,
      360,
      361,
      364,
      365,
      367,
      369,
      370,
      371,
      372,
      373,
      374,
      375,
      376,
      377,
      378,
      379,
      380,
      531,
      532,
      533,
      534,
      562,
      563,
      564,
      565,
      566,
      567,
      568,
      569,
      570,
      571,
      572,
      573,
      574,
      575,
      576,
      577,
      578,
      579,
      580,
      581,
      582,
      583,
      584,
      585,
      586,
      587,
      588,
      589,
      590,
      591,
      592,
      593,
      594,
      595,
      596,
      597,
      598,
      599,
      600,
      601,
      602,
      603,
      604,
      605,
      606,
      701,
      702,
      703,
      711,
      712,
      720,
      721,
      722,
      750,
      751,
      752,
      753,
      754,
      755,
      756,
      801,
      802,
      803,
      804,
      805,
      806,
      807,
      808,
      809,
      810,
      811,
      812,
      813,
      814,
      922,
      923,
      924,
      925,
      926,
      927,
      928,
      929,
      930,
      931,
      932,
      933,
      934,
      935,
      936,
      937,
      938,
      939,
      940,
      941,
      942,
      943,
      944,
      945,
      946,
      947,
      948,
      949,
      950,
      951,
      952,
      953,
      954,
      955,
      956,
      957,
      958,
      959,
      960,
      961,
      962,
      963,
      964,
      965,
      966,
      967,
      968,
      969,
      970,
      971,
      972,
      973,
      974,
      975,
      976,
      977,
      978,
      979,
      980,
      981,
      982,
      983,
      984,
      125,
      126,
      127,
      128,
      139,
      178,
      187,
      188,
      189,
      190,
      196,
      197,
      198,
      316,
      713,
      783,
      784,
      381,
      382,
      383,
      384,
      385,
      386,
      387,
      388,
      665,
      666,
      667,
      668,
      669,
      670,
      671,
      672,
      673,
      674,
      675,
      676,
      677,
      678,
      715,
      716,
      717,
      718,
      719,
      723,
      724,
      725,
      726,
      727,
      728,
      730,
      731,
      732,
      785,
      786,
      787,
      788,
      789,
      790,
      791,
      792,
      793,
      794,
      795,
      796,
      797,
      798,
      799,
      830,
      831,
      832,
      834,
      835,
      836,
      837,
      838,
      839,
      840,
      841,
      842,
      843,
      844,
      845,
      846,
      985,
      986,
      987,
      988,
      989,
      990,
      991,
      992,
      993,
      994,
      995,
      607,
      608,
      609,
      610,
      611,
      612,
      613,
      614,
      815,
      816,
      817,
      818
    ]
  },
  {
    date: '2006-09-22',
    roomComment: 'Many rooms are vectorized',
    rooms: {
      village: 'archives:ArtworkRoomsVillage40.swf',
      forts: 'archives:ArtworkRoomsForts40.swf',
      mtn: 'archives:ArtworkRoomsMtn40.swf',
      berg: 'archives:ArtworkRoomsBerg40.swf',
      dock: 'archives:ArtworkRoomsDock40.swf',
      pet: 'archives:ArtworkRoomsPet40.swf',
      dojo: 'archives:ArtworkRoomsDojo41.swf',
      shack: 'archives:ArtworkRoomsShack40.swf'
    }
  },
  {
    date: '2006-09-24',
    end: ['party']
  },
  {
    date: '2006-09-28',
    constructionComment: 'A construction begins at the Town',
    temp: {
      'town-launchpad': {
        rooms: {
          town: 'archives:RoomsTown-LaunchPadConstruction.swf'
        }
      }
    }
  },
  {
    date: '2006-10-05',
    constructionComment: 'A construction begins at the Plaza',
    end: ['town-launchpad'],
    temp: {
      'launchpad-construction': {
        rooms: {
          plaza: 'archives:Plaza31.swf'
        },
        frames: {
          plaza: 2
        }
      }
    }
  },
  {
    date: '2006-10-06',
    clothingCatalog: 'archives:October06Style.swf'
  },
  {
    date: '2006-10-13',
    end: ['launchpad-construction'],
    rooms: {
      // Rockhopper arrival, TBA
      dock: 'archives:Dock40.swf'
    }
  },
  {
    date: '2006-10-20',
    furnitureCatalog: 'archives:Furniture_0610.swf',
  },
  {
    date: '2006-10-21',
    roomComment: 'The Ice Rink is vectorized',
    rooms: {
      rink: 'recreation:rink_vector_precpip.swf'
    }
  },
  {
    date: '2006-10-24',
    roomComment: 'The Snow Forts sign breaks',
    temp: {
      party: {
        partyName: '1st Anniversary',
        rooms: {
          coffee: 'recreation:1st_anniversary_coffee.swf'
        }
      },
      'forts-sign': {
        rooms: {
          forts: 'recreation:forts_broken_sign.swf'
        }
      }
    }
  },
  {
    date: '2006-10-25',
    end: ['party']
  },
  {
    date: '2006-10-27',
    clothingCatalog: 'archives:October06Style_2.swf',
    temp: {
      party: {
        partyName: 'Halloween Party',
        partyIcon: 'halloween',
        rooms: {
          attic: 'recreation:halloween_2006/attic.swf',
          pizza: 'recreation:halloween_2006/pizza.swf',
          rink: 'recreation:halloween_2006/rink.swf',
          mtn: 'recreation:halloween_2006/mtn.swf',
          shack: 'recreation:halloween_2006/shack.swf',
          village: 'recreation:halloween_2006/village.swf',
          'berg': 'archives:RoomsBerg-HalloweenParty2007.swf',
          plaza: 'recreation:halloween_2006/plaza.swf',
          lodge: 'recreation:halloween_2006/lodge.swf',
          dance: 'recreation:halloween_2006/dance.swf',
          forts: 'recreation:halloween_2006/forts.swf',
          coffee: 'recreation:halloween_2006/coffee.swf',
          town: 'recreation:halloween_2006/town.swf'
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
          'dance': 205,
          'forts': 205,
          coffee: 205
        }
      }
    }
  },
  {
    date: '2006-11-01',
    end: ['party']
  },
  {
    date: '2006-11-03',
    clothingCatalog: 'archives:Nov06Style.swf'
  },
  {
    date: '2006-11-06',
    roomComment: 'The launchpad construction in the Beacon is finished',
    rooms: {
      beacon: 'archives:ArtworkRoomsBeacon41.swf'
    }
  },
  {
    date: '2006-11-17',
    iglooVersion: 43,
    furnitureCatalog: 'archives:Furniture_0611.swf',
    iglooCatalog: 'archives:November2006Igloo.swf'
  },
  {
    date: '2006-11-24',
    temp: {
      party: {
        partyName: 'Color Party',
        rooms: {
          dojo: 'recreation:color_party_2006/dojo.swf'
        },
        music: {
          dojo: 201
        }
      }
    }
  },
  {
    date: '2006-11-27',
    end: ['party'],
    miscComments: ['The second secret agent mission is released'],
    fileChanges: {
      'artwork/tools/missions.swf': 'archives:ArtworkToolsMissions2.swf'
    }
  },
  {
    date: '2006-11-28',
    roomComment: 'The Coffee Shop is vectorized',
    rooms: {
      coffee: 'recreation:coffee_vector.swf'
    }
  },
  {
    date: '2006-12-01',
    clothingCatalog: 'archives:Dec06Style.swf'
  },
  {
    date: '2006-12-08',
    iglooList: true,
    iglooVersion: 44,
    roomComment: 'Red Puffles are now in the Pet Shop',
    rooms: {
      pet: 'archives:ArtworkRoomsPet43.swf'
    }
  },
  {
    date: '2006-12-15',
    miscComments: ['A tree is available to be decorated for Christmas'],
    temp: {
      event: {
        rooms: {
          plaza: 'archives:ArtworkRoomsPlaza42.swf'
        }
      }
    },
    furnitureCatalog: 'archives:Furniture_0612.swf',
    iglooCatalog: 'recreation:igloo_catalog_dec06_v1.swf'
  },
  {
    date: '2006-12-16',
    iglooCatalog: 'archives:December2006Igloo.swf'
  },
  {
    date: '2006-12-19',
    gameRelease: 'Thin Ice',
    rooms: {
      lounge: 'archives:ArtworkRoomsLounge40.swf'
    }
  },
  {
    date: '2006-12-21',
    end: ['event']
  },
  {
    date: '2006-12-22',
    roomComment: 'The Attic is vectorized',
    rooms: {
      attic: 'recreation:attic_dec2006.swf'
    },
    temp: {
      party2: {
        partyName: 'Christmas Party',
        rooms: {
          beacon: 'recreation:christmas_06/beacon.swf',
          coffee: 'recreation:christmas_06/coffee.swf',
          dance: 'recreation:christmas_06/dance.swf',
          dock: 'recreation:christmas_06/dock.swf',
          forts: 'recreation:christmas_06/forts.swf',
          lodge: 'recreation:christmas_06/lodge.swf',
          town: 'recreation:christmas_06/town.swf',
          beach: 'recreation:christmas_06/beach.swf'
        },
        music: {
          beacon: 200,
          dance: 400,
          dock: 200,
          lodge: 400,
          town: 200,
          forts: 200,
          beach: 200
        }
      }
    }
  },
  {
    date: '2006-12-31',
    temp: {
      party: {
        partyStart: 'A New Year\'s celebration is held at the Iceberg',
        partyEnd: 'The fireworks celebration ends',
        decorated: false,
        rooms: {
          berg: 'recreation:fireworks_2006/berg.swf'
        }
      },
    }
  }
];