import { RoomName } from "./rooms";

// room name -> file Id
export type RoomChanges = Partial<Record<RoomName, number>>;

type Party = {
  name: string;
  startUpdateId: number;
  endUpdateId: number;
  roomChanges: RoomChanges;
  // a map of a path inside play/v2/content/local eg en/catalogues/party.swf mapping to a file
  localChanges?: Record<string, number>;
  // maps route inside play/v2/global to either file Id or tuple [global_path name, file Id]
  globalChanges?: Record<string, number | [string, number]>
  music?: Partial<Record<RoomName, number>>;
  construction?: Construction;
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
    localChanges: {
      'en/catalogues/party.swf': 2301,
      'en/close_ups/digposter.swf': 2307,
      'en/close_ups/digposter2.swf': 2302,
      'en/close_ups/treasurepin1.swf': 2303,
      'en/close_ups/treasurepin2.swf': 2304,
      'en/close_ups/treasurepin3.swf': 2305,
      'en/close_ups/treasurepin4.swf': 2306
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
      'content/shorts/underwater.swf': ['underwaterShort', 2342],
      'content/winners.swf': ['voting_booth', 2343]
    },
  },
];