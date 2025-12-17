import { Update } from ".";

export const UPDATES_2005: Update[] = [
  {
    date: '2005-08-22',
    map: "recreation:map_release.swf",
    miscComments: ['Beta release'],
    iglooVersion: 0,
    chatVersion: 291,
    indexHtml: 'beta',
    websiteFolder: 'beta',
    fileChanges: {
      'chat291.swf': 'approximation:chat291_no_news.swf' // newspapers-less precpip client
    },
    rooms: {
      'town': 'approximation:town_release.swf',
      'coffee': 'fix:ArtworkRoomsCoffee2.swf',
      'book': 'archives:Beta-book.swf',
      'dance': 'mammoth:artwork/rooms/dance10.swf',
      'lounge': 'approximation:lounge_no_astro.swf',
      'shop': 'mammoth:artwork/rooms/shop10.swf',
      'dock': 'mammoth:artwork/rooms/dock11.swf',
      'village': 'fix:ArtworkRoomsSkihill.swf',
      'rink': 'approximation:rink_release.swf',
      'dojo': 'mammoth:artwork/rooms/dojo10.swf',
      'agent': 'archives:ArtworkRoomsAgent10.swf', // placeholder, not accessable
      attic: 'archives:ArtworkRoomsAttic12.swf'
    },
    music: {
      coffee: 1,
      book: 1,
      pizza: 20,
      lounge: 0,
      dance: 2,
      agent: 0,
      agentcom: 7,
      dojo: 0,
      boxdimension: 264,
      dojofire: 22,
      dojohide: 21,
      dojoext: 0,
      dojowater: 24,
      boiler: 6,
      stage: 0
    },
    clientFiles: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      401,
      403,
      408,
      422,
      451,
      452,
      404,
      481,
      405,
      412,
      410,
      413,
      484,
      417,
      453,
      418,
      402,
      414,
      420,
      406,
      421,
      456,
      419,
      424,
      425,
      407,
      423,
      101,
      102,
      103,
      106,
      107,
      108,
      109,
      110,
      131,
      171,
      172,
      173,
      174,
      175,
      214,
      216,
      176,
      177,
      181,
      201,
      212,
      219,
      222,
      221,
      244,
      252,
      301,
      235,
      237,
      238,
      240,
      263,
      262,
      218,
      253,
      261,
      220,
      233,
      234,
      351,
      352,
      363,
      366,
      500,
      501,
      502,
      503,
      504,
      505,
      506,
      507,
      508,
      509,
      510,
      511,
      512,
      513,
      514,
      515,
      516,
      517,
      518,
      519,
      520,
      521,
      522,
      523,
      524,
      550,
      551,
      800,
      104
    ]
  },
  {
    date: '2005-09-12',
    roomComment: 'A new room is opened near the Town',
    rooms: {
      forts: 'fix:ArtworkRoomsForts.swf',
      town: 'archives:ArtworkRoomsTown10.swf',
      rink: 'archives:ArtworkRoomsRink10.swf'
    },
    map: 'archives:ArtworkMapsIsland3.swf'
  },
  {
    date: '2005-09-13',
    gameRelease: 'Astro Barrier',
    rooms: {
      lounge: 'mammoth:artwork/rooms/lounge10.swf'
    },
    iglooVersion: 1,
  },
  {
    date: '2005-09-21',
    clothingCatalog: 'recreation:style_september_05.swf',
    furnitureCatalog: 'recreation:furniture_sep05.swf',
    temp: {
      party: {
        partyName: 'Beta Test Party',
        rooms: {
          'town': 'fix:Town-party.swf'
        },
        music: {
          town: 2
        }
      }
    } 
  },
  {
    date: '2005-09-22',
    end: ['party'],
    websiteFolder: '2005-10-26',
    indexHtml: '2005-10-26'
  },
  {
    date: '2005-10-20',
    roomComment: 'A banner is added to the Ski Village',
    rooms: {
      village: 'approximation:village_release.swf'
    }
  },
  {
    date: '2005-10-24',
    iglooVersion: 3,
    clothingCatalog: 'archives:Clothing_0510.swf',
    furnitureCatalog: 'archives:Furniture_0510.swf',
    newspaper: 'irregular',
    fileChanges: {
      // precpip client with newspapers
      'chat291.swf': 'approximation:chat291_no_april.swf',
      'artwork/characters/penguin.swf': 'mammoth:artwork/characters/penguin.swf'
    },
    miscComments: ['Club Penguin releases']
  },
  {
    date: '2005-10-27',
    temp: {
      party: {
        partyName: 'Halloween Party',
        partyIcon: 'halloween',
        rooms: {
          'book': 'fix:Book2_03_halloween.swf',
          'dance': 'fix:Dance1b_halloween.swf',
          'lounge': 'fix:Lounge1_halloween.swf',
          'dojo': 'fix:Dojo_halloween.swf',
          'rink': 'fix:Icerink_halloween.swf',
          'town': 'fix:Town_halloween.swf'
        }
      }
    },
    roomComment: 'The book room was updated to have a new Mancala board',
    rooms: {
      book: 'archives:ArtworkRoomsBook11.swf'
    }
  },
  {
    date: '2005-10-28',
    newspaper: 'fan'
  },
  {
    date: '2005-11-01',
    clothingCatalog: 'archives:Clothing_0511.swf',
    end: ['party'],
    rooms: {
      // mancala was added at some random point I dont know
      agent: 'fix:ArtworkRoomsAgent3.swf'
    }
  },
  {
    date: '2005-11-03',
    newspaper: 'irregular',
    roomComment: 'A new shop opens at the ski area',
    rooms: {
      sport: 'mammoth:artwork/rooms/sport11.swf',
      village: 'approximation:village_sport.swf'
    }
  },
  {
    date: '2005-11-08',
    newspaper: 'irregular'
  },
  {
    date: '2005-11-11',
    newspaper: 'irregular'
  },
  {
    date: '2005-11-15',
    temp: {
      party: {
        partyName: 'The Great Puffle Discovery',
        decorated: false,
        rooms: {
          'dance': 'fix:Dance1b_pet.swf',
          'forts': 'fix:Forts_pet.swf',
          'rink': 'fix:Icerink_pet.swf'
        }
      }
    }
  },
  {
    date: '2005-11-16',
    newspaper: 'irregular'
  },
  {
    date: '2005-11-18',
    roomComment: 'Penguins can now access the mountain at the ski area',
    rooms: {
      village: 'approximation:village_no_lodge.swf',
      mtn: 'fix:Mtn1.swf'
    }
  },
  {
    date: '2005-11-21',
    newspaper: 'irregular'
  },
  {
    date: '2005-11-22',
    iglooVersion: 6,
    iglooCatalog: 'archives:February2006Igloo.swf'
  },
  {
    date: '2005-11-24',
    indexHtml: '2005-11-24',
    websiteFolder: '2005-11-24'
  },
  {
    date: '2005-12-01',
    clothingCatalog: 'archives:Clothing_0512.swf',
    newspaper: 'period-start',

    // an unknown update which removed the ability to click on the couch
    rooms: {
      coffee: 'mammoth:artwork/rooms/coffee11.swf'
    }
  },
  {
    date: '2005-12-05',
    end: ['party']
  },
  {
    date: '2005-12-14',
    gameRelease: 'Puffle Roundup',
    rooms: {
      forts: 'fix:ArtworkRoomsForts3.swf'
    }
  },
  {
    date: '2005-12-22',
    roomComment: 'The lodge in the ski area is now open',
    rooms: {
      village: 'archives:ArtworkRoomsVillage11.swf',
      lodge: 'archives:ArtworkRoomsLodge10.swf'
    },
    temp: {
    party: {
        partyName: 'Christmas Party',
        rooms: {
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
        }
      }
    }
  },
  {
    date: '2005-12-26',
    end: ['party']
  },
  {
    date: '2005-12-31',
    temp: {
      party: {
        partyStart: 'A new years celebration is held at the Town',
        partyEnd: 'The fireworks end',
        decorated: false,
        rooms: {
          town: 'recreation:town_newyear.swf'
        }
      }
    }
  }
];