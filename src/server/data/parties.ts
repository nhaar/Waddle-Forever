import { RoomName } from "./rooms";

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
}

type Party = PartyChanges & {
  name: string;
  startUpdateId: number;
  endUpdateId: number;

  music?: Partial<Record<RoomName, number>>;
  construction?: Construction;
  scavengerHunt2010?: true;

  updates?: Array<{
    comment?: string;
    updateId: number;
  } & PartyChanges>;

  // route -> fileId
  generalChanges?: Record<string, number>;
};

type Construction = {
  updateId: number;
  changes: RoomChanges;
};

export const PARTIES: Party[] = [
  {
    name: 'Beta Test Party',
    startUpdateId: 3,
    endUpdateId: 4,
    roomChanges: {
      'town': 38
    }
  },
  {
    name: 'Halloween Party 2005',
    startUpdateId: 7,
    endUpdateId: 8,
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
    startUpdateId: 11,
    endUpdateId: 12,
    roomChanges: {
      'dance': 84,
      'forts': 85,
      'rink': 86
    }
  },
  {
    name: 'Christmas Party 2005',
    startUpdateId: 14,
    endUpdateId: 15,
    roomChanges: {
      'coffee': 88,
      'dance': 89,
      'lodge': 90,
      'rink': 91,
      'shop': 92,
      'town': 93,
      'village': 94
    }
  },
  {
    name: 'Valentine\'s Day Celebration',
    startUpdateId: 17,
    endUpdateId: 18,
    roomChanges: {
      'dance': 98,
      'lounge': 97
    }
  },
  {
    name: 'Pizza Parlor Opening Party',
    startUpdateId: 19,
    endUpdateId: 20,
    roomChanges: {
      'forts': 99,
      'pizza': 100,
      'town': 101
    }
  },
  {
    name: 'April Fools Party 2006',
    startUpdateId: 23,
    endUpdateId: 24,
    roomChanges: {
      'dojo': 105,
      'rink': 106,
      'dance': 107,
      'plaza': 108,
      'lodge': 109,
      'village': 110,
      'forts': 111,
      'town': 112
    }
  },
  {
    name: 'New Year\'s Day 2010',
    startUpdateId: 51,
    endUpdateId: 52,
    roomChanges: {
      mtn: 2295,
      berg: 2296
    }
  },
  {
    name: 'Cave Expedition',
    startUpdateId: 53,
    endUpdateId: 54,
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
    startUpdateId: 55,
    endUpdateId: 56,
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
      updateId: 57,
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
    startUpdateId: 58,
    endUpdateId: 59,
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
  },
  {
    name: 'April Fools\' Party 2010',
    startUpdateId: 60,
    endUpdateId: 61,
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
      'town': 2370
    },
    localChanges: {
      'membership/oops_april_fools.swf': {
        'en': [2371, 'oops_party_room']
      }
    }
  },
  {
    name: 'Earth Day 2010',
    startUpdateId: 62,
    endUpdateId: 63,
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
      updateId: 64,
      changes: {
        'shack': 2387
      }
    }
  },
  {
    name: 'Medieval Party 2010',
    startUpdateId: 66,
    endUpdateId: 67,
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
      updateId: 65,
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
    startUpdateId: 67,
    endUpdateId: 25,
    roomChanges: {
      'agent': 2417,
      'village': 2418,
      'sport': 2419
    },
    updates: [
      {
        comment: 'Sports Shop closed for reconstruction',
        updateId: 69,
        roomChanges: {
          'agent': 2420,
          'village': 2421
        }
      }
    ]
  },
  {
    name: 'Island Adventure Party 2010',
    startUpdateId: 71,
    endUpdateId: 72,
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
    construction: {
      updateId: 70,
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
    startUpdateId: 75,
    endUpdateId: 76,
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
        updateId: 77,
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
      updateId: 73,
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
    startUpdateId: 78,
    endUpdateId: 79,
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
      updateId: 80,
      changes: {
        'village': 2484
      }
    }
  },
  {
    name: 'The Fair 2010',
    startUpdateId: 82,
    endUpdateId: 83,
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
      updateId: 81,
      changes: {
        'beach': 2488
      }
    },
    updates: [
      {
        comment: 'New items were added to the prize booths',
        updateId: 84,
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
  }
];