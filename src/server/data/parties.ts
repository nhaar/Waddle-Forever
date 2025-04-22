import { RoomName } from "./rooms";
import { ANNIVERSARY_5_START, CAVE_EXPEDITION_END, CAVE_OPENING_END, CAVE_OPENING_START, EARTH_DAY_2010_END, EARTH_DAY_2010_START, EGG_HUNT_2006_START, EPF_RELEASE, FAIR_2010_START, HALLOWEEN_2010_START, LIGHTHOUSE_PARTY_START, MUSIC_JAM_2010_CONST_START, MUSIC_JAM_2010_START, NEW_YEARS_2010_UPDATE, PET_SHOP_RELEASE, PIZZA_PARLOR_OPENING_END, PIZZA_PARLOR_OPENING_START, PLANET_Y_2010, PUFFLE_PARTY_10_CONST_START, STADIUM_GAMES_END, SUMMER_PARTY_START, WATER_CELEBRATION_END, WATER_HUNT_END } from "./updates";

// room name -> file Id
export type RoomChanges = Partial<Record<RoomName, number>>;

type Language = 'en';

/** First element is file id used, then a list of all the crumbs that point to this path */
export type CrumbIndicator = [number, ...string[]];

export type PartyChanges = {
  roomChanges: RoomChanges;
  // a map of a path inside play/v2/content/local eg en/catalogues/party.swf mapping to a file
  // inside a map of each language
  localChanges?: Record<string, Partial<Record<Language, number | CrumbIndicator>>>;
  // maps route inside play/v2/global to either file Id or tuple [global_path name, file Id]
  globalChanges?: Record<string, number | CrumbIndicator>

  roomFrames?: Partial<Record<RoomName, number>>;
}

export type Party = PartyChanges & {
  name: string;
  startDate: string;
  endDate: string;

  // Overriding the default placeholder message for a party start
  // with a custom one
  startComment?: string;
  endComment?: string;

  music?: Partial<Record<RoomName, number>>;
  construction?: Construction;
  scavengerHunt2010?: true;

  updates?: Array<{
    comment?: string;
    date: string;
  } & PartyChanges>;

  // route -> fileId
  generalChanges?: Record<string, number>;

  activeMigrator?: true;
};

type Construction = {
  date: string;
  changes: RoomChanges;
};

export const PARTIES: Party[] = [
  {
    name: 'Beta Test Party',
    startDate: '2005-09-21',
    endDate: '2005-09-22',
    roomChanges: {
      'town': 38
    }
  },
  {
    name: 'Halloween Party 2005',
    startDate: '2005-10-27',
    endDate: '2005-11-01',
    roomChanges: {
      'book': 76,
      'dance': 77,
      'lounge': 78,
      'dojo': 79,
      'rink': 80,
      'town': 81
    }
  },
  {
    name: 'The Great Puffle Discovery',
    startDate: '2005-11-15',
    endDate: '2005-12-05',
    roomChanges: {
      'dance': 84,
      'forts': 85,
      'rink': 86
    }
  },
  {
    name: 'Christmas Party 2005',
    startDate: '2005-12-22',
    endDate: '2005-12-26',
    roomChanges: {
      'coffee': 88,
      'dance': 89,
      'lodge': 90,
      'rink': 91,
      'shop': 92,
      'town': 93,
      'village': 94
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
  },
  {
    name: 'Valentine\'s Day Celebration',
    startDate: '2006-02-14',
    endDate: '2006-02-15',
    roomChanges: {
      'dance': 98,
      'lounge': 97
    }
  },
  {
    name: 'Pizza Parlor Opening Party',
    startDate: PIZZA_PARLOR_OPENING_START,
    endDate: PIZZA_PARLOR_OPENING_END,
    roomChanges: {
      'forts': 99,
      'pizza': 100,
      'town': 101
    },
    roomFrames: {
      'town': 2
    }
  },
  {
    name: 'St. Patrick\'s Day Party',
    startDate: PET_SHOP_RELEASE,
    endDate: '2006-03-20',
    roomChanges: {
      'village': 110,
    },
    roomFrames: {
      'village': 2
    }
  },
  {
    name: 'April Fools Party 2006',
    startDate: '2006-03-31',
    endDate: '2006-04-03',
    roomChanges: {
      'dojo': 105,
      'rink': 106,
      'dance': 107,
      'plaza': 108,
      'lodge': 109,
      'village': 110,
      'forts': 111,
      'town': 112
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
    startDate: EGG_HUNT_2006_START,
    endDate: '2006-04-16',
    roomChanges: {
      'book': 3759,
      'berg': 3760,
      'dance': 3761,
      'pet': 3762,
      'mtn': 3763,
      'lodge': 3764,
      'village': 3765,
      'forts': 3766
    }
  },
  {
    name: 'Underground Opening Party',
    startDate: CAVE_OPENING_START,
    endDate: CAVE_OPENING_END,
    roomChanges: {
      'mine': 3783
    },
    music: {
      'boiler': 203,
      'cave': 202,
      'mine': 203,
      'plaza': 203
    }
  },
  {
    name: 'Summer Party',
    startDate: SUMMER_PARTY_START,
    endDate: '2006-06-25',
    roomChanges: {
      'beach': 3796,
      'boiler': 3797,
      'dock': 3798,
      'dojo': 3799,
      'berg': 3800,
      'shack': 3801,
      'dance': 3802,
      'plaza': 3803,
      'mtn': 3804,
      'village': 3805,
      'forts': 3806,
      'town': 3807
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
          'beach': 3831,
          'plaza': 3832
        }
      }
    ]
  },
  {
    name: 'Western Party',
    startDate: '2006-07-14',
    endDate: '2006-07-17',
    roomChanges: {
      plaza: 3814,
      forts: 3815,
      dance: 3813,
      town: 3816
    },
    roomFrames: {
      plaza: 2,
      forts: 2,
      dance: 2,
      town: 2
    }
  },
  {
    name: 'Sports Party',
    startDate: '2006-08-11',
    endDate: '2006-08-21',
    roomChanges: {
      'beach': 3818,
      'cave': 3819,
      'coffee': 3820,
      'dock': 3821,
      'rink': 3822,
      'pizza': 3823,
      'plaza': 3824,
      'mtn': 3825,
      'village': 3826,
      'forts': 3827,
      'town': 3828
    },
    music: {
      // Just put the music everywhere, but the village
      'beach': 213,
      'cave': 213,
      'coffee': 213,
      'dock': 213,
      'rink': 213,
      'pizza': 213,
      'plaza': 213,
      'mtn': 213,
      'forts': 213,
      'town': 213
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
      'village': 2,
      'forts': 2,
      'town': 2
    },
    updates: [
      {
        date: '2006-08-18',
        comment: 'A new item is in the Snow Forts for the Sport Party',
        roomChanges: {
          forts: 3830
        },
        roomFrames: {
          forts: 3
        }
      }
    ]
  },
  {
    name: 'Lighthouse Party',
    startDate: LIGHTHOUSE_PARTY_START,
    endDate: '2006-09-24',
    roomChanges: {
      'beacon': 3833,
      'light': 3834
    },
    roomFrames: {
      'light': 2,
      'beacon': 2
    }
  },
  {
    name: 'Winter Fiesta',
    startDate: '2007-01-19',
    endDate: '2007-01-22',
    roomChanges: {
      'village': 3837
    },
    music: {
      'village': 206
    }
  },
  {
    name: 'Pirate Party',
    startDate: '2007-04-27',
    endDate: '2007-05-04',
    roomChanges: {
      'town': 3840,
      'dock': 3839
    },
    music: {
      'town': 212,
      'dock': 212
    }
  },
  {
    name: 'Water Party',
    startDate: '2007-07-13',
    endDate: '2007-07-23',
    roomChanges: {
      'dojo': 3847
    },
    music: {
      'dojo': 217
    }
  },
  {
    name: 'Camp Penguin',
    startDate: '2007-08-24',
    endDate: '2007-08-27',
    startComment: 'Camp Penguin party begins',
    endComment: 'Camp Penguin party ends',
    roomChanges: {
      'village': 3849
    }
  },
  {
    name: 'Fall Fair',
    startDate: '2007-09-21',
    endDate: '2007-10-01',
    roomChanges: {
      'beach': 3850,
      'beacon': 3851,
      'cove': 3852,
      'lounge': 3853,
      'dock': 3854,
      'forest': 3855,
      'rink': 3856,
      'light': 3857,
      'mine': 3858,
      'dance': 3859,
      'pizza': 3860,
      'plaza': 3861,
      'mtn': 3862,
      'village': 3863,
      'forts': 3864,
      'town': 3865
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
      'media/artwork/rooms/0926/PrizeBooth2.swf': 3867
    }
  },
  {
    name: 'New Year\'s Day 2010',
    startComment: 'New Year\'s Fireworks appear on the island',
    endComment: 'The New Year\'s celebration ends',
    startDate: NEW_YEARS_2010_UPDATE,
    endDate: '2010-01-04',
    roomChanges: {
      mtn: 2295,
      berg: 2296
    }
  },
  {
    name: 'Cave Expedition',
    startDate: '2010-01-22',
    endDate: CAVE_EXPEDITION_END,
    endComment: 'The Cave Expedition ends and the cave mine is temporarily closed',
    roomChanges: {
      'mine': 2297,
      'party1': 2298,
      'party2': 2299,
      'party3': 2300
    },
    'localChanges': {
      'catalogues/party.swf': {
        'en': 2301
      },
      'close_ups/digposter.swf': {
        'en': 2307
      },
      'close_ups/digposter2.swf': {
        'en': 2302
      },
      'close_ups/treasurepin1.swf': {
        'en': 2303
      },
      'close_ups/treasurepin2.swf': {
        'en': 2304
      },
      'close_ups/treasurepin3.swf': {
        'en': 2305
      },
      'close_ups/treasurepin4.swf': {
        'en': 2306
      }
    }
  },
  {
    name: 'Puffle Party 2010',
    startDate: '2010-02-18',
    endDate: '2010-02-25',
    roomChanges: {
      'beach': 2308,
      'beacon': 2309,
      'berg': 2310,
      'boxdimension': 2311,
      'cave': 2312,
      'cove': 2313,
      'dance': 2314,
      'dock': 2315,
      'forest': 2316,
      'forts': 2317,
      'light': 2318,
      'lodge': 2319,
      'mine': 2320,
      'party1': 2321,
      'party2': 2322,
      'pet': 2323,
      'town': 2325,
      'village': 2326
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
      date: PUFFLE_PARTY_10_CONST_START,
      changes: {
        'beacon': 2327,
        'berg': 2328,
        'cave': 2329,
        'dance': 2320,
        'forest': 2331,
        'light': 2332,
        'mine': 2333
      }
    }
  },
  {
    name: 'Penguin Play Awards 2010',
    startDate: '2010-03-18',
    endDate: '2010-03-29',
    music: {
      'pizza': 283,
      'plaza': 40,
      'stage': 40,
      'party': 40
    },
    roomChanges: {
      'dock': 2344,
      'mtn': 2345,
      'party': 2346,
      'pizza': 2347,
      'plaza': 2348,
      'stage': 2349,
      'town': 2350
    },
    globalChanges: {
      'content/shorts/fairyFables.swf': 2338,
      'content/shorts/goldenPuffle.swf': 2339,
      'content/shorts/ruby.swf': 2340,
      'content/shorts/squidzoid.swf': 2341,
      'content/shorts/underwater.swf': [2342, 'underwaterShort'],
      'content/winners.swf': [2343, 'voting_booth']
    },
    localChanges: {
      'catalogues/costume.swf': {
        'en': 2678
      }
    }
  },
  {
    name: 'April Fools\' Party 2010',
    startDate: '2010-03-31',
    endDate: '2010-04-05',
    roomChanges: {
      'dock': 2358,
      'forest': 2359,
      'shop': 2360,
      'berg': 2361,
      'light': 2362,
      'dance': 2363,
      'mine': 2364,
      'shack': 2365,
      'pizza': 2366,
      'lodge': 2367,
      'village': 2368,
      'forts': 2369,
      'town': 2370,
      'party': 2351
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
    localChanges: {
      'membership/oops_april_fools.swf': {
        'en': [2371, 'oops_party_room']
      }
    }
  },
  {
    name: 'Earth Day 2010',
    startDate: EARTH_DAY_2010_START,
    endDate: EARTH_DAY_2010_END,
    roomChanges: {
      'town': 2372,
      'coffee': 2373,
      'book': 2374,
      'plaza': 2375,
      'pet': 2376,
      'mtn': 2377,
      'village': 2378,
      'forest': 2379,
      'cove': 2380,
      'shack': 2381,
      'dojoext': 2382
    },
    music: {
      'town': 219,
      'plaza': 219
    },
    globalChanges: {
      'scavenger_hunt/recycle_icon.swf': [2386, 'scavenger_hunt_icon'],
      'scavenger_hunt/recycle.swf': [2385, 'easter_egg_hunt', 'recycle_hunt']
    },
    scavengerHunt2010: true,
    construction: {
      date: '2010-04-15',
      changes: {
        'shack': 2387
      }
    }
  },
  {
    name: 'Medieval Party 2010',
    startDate: '2010-05-07',
    endDate: '2010-05-16',
    roomChanges: {
      'town': 2388,
      'coffee': 2389,
      'book': 2390,
      'dance': 2391,
      'lounge': 2392,
      'shop': 2393,
      'forts': 2394,
      'plaza': 2395,
      'pet': 2396,
      'pizza': 2397,
      'boiler': 2398,
      'cave': 2399,
      'forest': 2400,
      'cove': 2401,
      'dock': 2402,
      'beach': 2403,
      'light': 2404,
      'beacon': 2405,
      'village': 2406,
      'lodge': 2407,
      'attic': 2408,
      'mtn': 2409,
      'rink': 2410
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
        'beach': 2411,
        'cave': 2412,
        'forts': 2413,
        'plaza': 2414,
        'town': 2415,
        'village': 2416
      }
    }
  },
  {
    name: 'Popcorn Explosion',
    startDate: '2010-05-18',
    endDate: EPF_RELEASE,
    roomChanges: {
      'agent': 2417,
      'village': 2418,
      'sport': 2419
    },
    updates: [
      {
        comment: 'Sports Shop closed for reconstruction',
        date: '2010-05-25',
        roomChanges: {
          'agent': 2420,
          'village': 2421
        }
      }
    ]
  },
  {
    name: 'Island Adventure Party 2010',
    startDate: '2010-06-18',
    endDate: '2010-06-28',
    roomChanges: {
      'town': 2426,
      'dance': 2427,
      'forts': 2428,
      'plaza': 2429,
      'forest': 2430,
      'lake': 2431,
      'cove': 2432,
      'dock': 2433,
      'beach': 2434,
      'village': 2435,
      'berg': 2436,
      'party': 2437,
      'party2': 2438
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
        'beach': 2422,
        'cove': 2423,
        'plaza': 2424,
        'town': 2425
      }
    }
  },
  {
    name: 'Music Jam 2010',
    startDate: MUSIC_JAM_2010_START,
    endDate: '2010-07-19',
    roomChanges: {
      'party3': 2439,
      'beach': 2440,
      'party4': 2441,
      'cave': 2442,
      'coffee' :2443,
      'cove': 2444,
      'lounge': 2445,
      'dock': 2446,
      'forest': 2447,
      'berg': 2448,
      'light': 2449,
      'mine': 2450,
      'party': 2451,
      'dance': 2452,
      'party2': 2453,
      'pizza': 2454,
      'plaza': 2455,
      'forts': 2456,
      'rink': 2457,
      'village': 2458,
      'town': 2459
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
        'en': 2460
      },
      'close_ups/poster.swf': {
        'en': 2461
      },
      'close_ups/music.swf': {
        'en': 2463
      }
    },
    updates: [
      {
        date: '2010-07-15',
        comment: 'New instruments are available in the Catalog',
        roomChanges: {},
        localChanges: {
          'catalogues/music.swf': {
            'en': 2462
          }
        }
      }
    ],
    construction: {
      date: MUSIC_JAM_2010_CONST_START,
      changes: {
        'beach': 2464,
        'coffee': 2466,
        'cove': 2467,
        'dock': 2468,
        'forest': 2469,
        'berg': 2470,
        'light': 2471,
        'village': 2472,
        'forts': 2473
      }
    }
  },
  {
    name: 'Mountain Expedition',
    startDate: '2010-08-12',
    endDate: '2010-08-19',
    roomChanges: {
      'party3': 2475,
      'party6': 2476,
      'party2': 2477,
      'party4': 2478,
      'plaza': 2479,
      'village': 2480,
      'party1': 2481,
      'party5': 2482,
      'town': 2483
    },
    localChanges: {
      'catalogues/merch.swf': {
        'en': 2485
      },
      'close_ups/poster.swf': {
        'en': 2487
      },
      'membership/party3.swf': {
        'en': 2486
      }
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
        'village': 2484
      }
    }
  },
  {
    name: 'The Fair 2010',
    startDate: FAIR_2010_START,
    endDate: '2010-09-13',
    roomChanges: {
      'town': 2489,
      'coffee': 2490,
      'dance': 2491,
      'lounge': 2492,
      'forts': 2493,
      'plaza': 2494,
      'forest': 2495,
      'cove': 2496,
      'berg': 2497,
      'dock': 2498,
      'beach': 2499,
      'beacon': 2500,
      'village': 2501,
      'mtn': 2502,
      'party': 2503,
      'party2': 2504,
      'party3': 2505
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
    globalChanges: {
      'tickets.swf': [2506, 'tickets'],
      'ticket_icon.swf': [2507, 'ticket_icon']
    },
    generalChanges: {
      'play/v2/client/fair.swf': 2513,
      'play/v2/client/dependencies.json': 2514,
      'web_service/worldachievements.xml': 2515
    },
    localChanges: {
      'catalogues/prizebooth.swf': {
        'en': 2509
      },
      'catalogues/prizeboothmember.swf': {
        'en': 2510
      },
      'close_ups/poster.swf': {
        'en': 2508
      }
    },
    construction: {
      date: '2010-08-26',
      changes: {
        'beach': 2488
      }
    },
    updates: [
      {
        comment: 'New items were added to the prize booths',
        date: '2010-09-10',
        roomChanges: {},
        localChanges: {
          'catalogues/prizebooth.swf': {
            'en': 2511
          },
          'catalogues/prizeboothmember.swf': {
            'en': 2512
          }
        }
      }
    ]
  },
  {
    name: '5th Anniversary Party',
    startDate: ANNIVERSARY_5_START,
    endDate: '2010-10-25',
    roomChanges: {
      'book': 2521,
      'coffee': 2522,
      'town': 2523
    },
    music: {
      'town': 218,
      'coffee': 218,
      'book': 218
    }
  },
  {
    name: 'Halloween Party 2010',
    startDate: HALLOWEEN_2010_START,
    endDate: '2010-11-04',
    roomChanges: {
      'beach': 2524,
      'light': 2525,
      'beacon': 2526,
      'berg': 2527,
      'book': 2528,
      'cave': 2529,
      'forts': 2530,
      'rink': 2531,
      'village': 2532,
      'mtn': 2533,
      'lodge': 2534,
      'attic': 2535,
      'cove': 2536,
      'party4': 2537,
      'party3': 2538,
      'dock': 2539,
      'dojo': 2540,
      'dojoext': 2541,
      'dojofire': 2542,
      'plaza': 2543,
      'pet': 2544,
      'pizza': 2545,
      'shack': 2546,
      'forest': 2547,
      'party2': 2548,
      'party1': 2549,
      'party5': 2550,
      'town': 2551,
      'dance': 2553,
      'lounge': 2554,
      'shop': 2555,
      'dojohide': 2556
    },
    globalChanges: {
      'content/map.swf': 2560,
      'scavenger_hunt/scavenger_hunt_icon.swf': [2561, 'scavenger_hunt_icon'],
      'scavenger_hunt/hunt_ui.swf': [2562, 'hunt_ui', 'halloween_hunt'],
      'binoculars/empty.swf': 2563, // from 2007 party
      'igloo/assets/igloo_background.swf': 2564, // from 2011 party
      'rooms/NOTLS3EN.swf': 2565,
      'telescope/empty.swf': 2566
    },
    localChanges: {
      'catalogues/party.swf': {
        'en': 2558
      },
      'close_ups/halloweenposter.swf': {
        'en': 2557
      },
      'membership/membership_party3.swf': {
        'en': 2558
      }
    },
    generalChanges: {
      'web_service/worldachievements.xml': 2567
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
      'party1': 251,
      'party2': 253,
      'party3': 299,
      'party4': 300,
      'party5': 298
    },
    scavengerHunt2010: true
  },
  {
    name: 'Sensei\'s Water Scavenger Hunt',
    startDate: '2010-11-16',
    endDate: WATER_HUNT_END,
    roomChanges: {
      'beach': 2568,
      'boiler': 2569,
      'book': 2570,
      'cave': 2571,
      'cavemine': 2572,
      'coffee': 2573,
      'cove': 2574,
      'lounge': 2575,
      'dock': 2576,
      'dojoext': 2577,
      'forest': 2578,
      'lake': 2579,
      'mine': 2580,
      'dojohide': 2581,
      'plaza': 2582,
      'pet': 2583,
      'rink': 2584,
      'forts': 2585,
      'town': 2586,
      'dojowater': 2587
    },
    globalChanges: {
      'scavenger_hunt/scavenger_hunt_icon.swf': [2589, 'scavenger_hunt_icon'],
      'scavenger_hunt/hunt_ui.swf': [2588, 'hunt_ui', 'easter_egg_hunt', 'scavenger_hunt']
    },
    updates: [
      {
        date: PLANET_Y_2010,
        roomChanges: {
          'plaza': 2590
        }
      }
    ],
    scavengerHunt2010: true
  },
  {
    name: 'Celebration of Water',
    startDate: WATER_HUNT_END,
    endDate: WATER_CELEBRATION_END,
    roomChanges: {
      'dojoext': 2591,
      'dojohide': 2592,
      'dojowater': 2593
    }
  },
  {
    name: 'Holiday Party 2010',
    startDate: '2010-12-16',
    endDate: '2010-12-28',
    roomChanges: {
      'party99': 2594,
      'beach': 2595,
      'beacon': 2596,
      'book': 2597,
      'shipquarters': 2598,
      'coffee': 2599,
      'cove': 2600,
      'shipnest': 2601,
      'lounge': 2602,
      'dock': 2603,
      'dojo': 2604,
      'dojoext': 2605,
      'dojofire': 2606,
      'forest': 2607,
      'shop': 2608,
      'berg': 2609,
      'light': 2610,
      'attic': 2611,
      'party': 2612,
      'ship': 2613,
      'shack': 2614,
      'dance': 2615,
      'dojohide': 2616,
      'pizza': 2617,
      'plaza': 2618,
      'shiphold': 2619,
      'mtn': 2620,
      'lodge': 2621,
      'village': 2622,
      'forts': 2623,
      'rink': 2625,
      'town': 2627
    },
    globalChanges: {
      'content/map.swf': 2633
    },
    localChanges: {
      'close_ups/christmasposter.swf': {
        'en': 2629
      },
      'close_ups/poster.swf': {
        'en': 2630
      },
      'forms/coins_for_change.swf': {
        'en': 2631
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
        date: STADIUM_GAMES_END,
        roomChanges: {
          'forts': 2624,
          'rink': 2626,
          'town': 2628
        },
        globalChanges: {
          'content/map.swf': 2632
        }
      }
    ]
  }
];