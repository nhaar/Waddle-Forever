import { RoomName } from "./rooms";

// room name -> file Id
export type RoomChanges = Partial<Record<RoomName, number>>;

type Language = 'en';

/** First element is file id used, then a list of all the crumbs that point to this path */
export type CrumbIndicator = [number, ...string[]];

type Party = {
  name: string;
  startUpdateId: number;
  endUpdateId: number;
  roomChanges: RoomChanges;
  // a map of a path inside play/v2/content/local eg en/catalogues/party.swf mapping to a file
  // inside a map of each language
  localChanges?: Record<string, Partial<Record<Language, number | CrumbIndicator>>>;
  // maps route inside play/v2/global to either file Id or tuple [global_path name, file Id]
  globalChanges?: Record<string, number | CrumbIndicator>
  music?: Partial<Record<RoomName, number>>;
  construction?: Construction;
  scavengerHunt2010?: true;
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
    scavengerHunt2010: true
  },
];