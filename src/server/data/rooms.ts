type Room = {
  id: number;
  name: string;
  preCpipFileNumber: number | null;
  preCpipName: string| null;
  preCpipSong?: number;
};

export type RoomName = 'town' |
  'coffee' |
  'book' |
  'cave' |
  'cavemine' |
  'cove' |
  'dance' |
  'lounge' |
  'light' |
  'forest' |
  'lake' |
  'shop' |
  'dock' |
  'village' |
  'rink' |
  'dojo' |
  'boiler' |
  'dojoext' |
  'dojofire' |
  'dojowater' |
  'dojohide' |
  'forts' |
  'agent' |
  'sport' |
  'mtn' |
  'shack' |
  'lodge' |
  'attic' |
  'pizza' |
  'plaza' |
  'pet' |
  'berg' |
  'mine' |
  'beach' |
  'beacon' |
  'stage' |
  'boxdimension' |
  'shipquarters' |
  'shipnest' |
  'ship' |
  'shiphold' |
  'party' |
  'party1' |
  'party2' |
  'party3' |
  'party4' |
  'party5' |
  'party6' |
  'party7' |
  'party8' |
  'party9' |
  'party10' |
  'party11' |
  'party12' |
  'party13' |
  'party14' |
  'party15' |
  'party16' |
  'party17' |
  'party18' |
  'party99';

export const ROOMS: Record<RoomName, Room> = {
  'town': {
    id: 100,
    name: 'Town',
    preCpipFileNumber: 10,
    preCpipName: 'Town'
  },
  'coffee': {
    id: 110,
    name: 'Coffee Shop',
    preCpipFileNumber: 11,
    preCpipName: 'Coffee',
    preCpipSong: 1
  },
  'book': {
    id: 111,
    name: 'Book Room',
    preCpipFileNumber: 11,
    preCpipName: 'Book'
  },
  'cave': {
    id: 806,
    name: 'Cave',
    preCpipFileNumber: 13,
    preCpipName: 'Cave'
  },
  'cavemine': {
    id: 813,
    name: 'cavemine',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'cove': {
    id: 810,
    name: 'Cove',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'dance': {
    id: 120,
    name: 'Dance Club',
    preCpipFileNumber: 10,
    preCpipName: 'Dance',
    preCpipSong: 2
  },
  
  'lounge': {
    id: 121,
    name: 'Dance Lounge',
    preCpipFileNumber: 10,
    preCpipName: 'Lounge'
  },
  'boiler': {
    id: 804,
    name: 'Boiler Room',
    preCpipFileNumber: 11,
    preCpipName: 'Boiler'
  },
  'light': {
    id: 410,
    name: 'Lighthouse',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'shop': {
    id: 130,
    name: 'Gift Shop',
    preCpipFileNumber: 10,
    preCpipName: 'Shop'
  },
  'dock': {
    id: 800,
    name: 'Dock',
    preCpipFileNumber: 11,
    preCpipName: 'Dock'
  },
  'village': {
    id: 200,
    name: 'Ski Village',
    preCpipFileNumber: 11,
    preCpipName: 'Village'
  },
  'rink': {
    id: 802,
    name: 'Stadium',
    preCpipFileNumber: 10,
    preCpipName: 'Rink'
  },
  'dojo': {
    id: 320,
    name: 'Dojo',
    preCpipFileNumber: 10,
    preCpipName: 'Dojo'
  },
  'dojoext': {
    id: 321,
    name: 'Dojo Courtyard',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'dojofire': {
    id: 812,
    name: 'Fire Dojo',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'dojohide': {
    id: 322,
    name: 'Ninja Hideout',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'dojowater': {
    id: 816,
    name: 'Water Dojo',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'agent': {
    id: 803,
    name: 'PSA HQ',
    preCpipFileNumber: 11,
    preCpipName: 'Agent',
    preCpipSong: 7
  },
  'forts': {
    id: 801,
    name: 'Snow Forts',
    preCpipFileNumber: 12,
    preCpipName: 'Forts'
  },
  'forest': {
    id: 809,
    name: 'Forest',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'lake': {
    id: 814,
    name: 'Hidden Lake',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'sport': {
    id: 210,
    name: 'Sport Shop',
    preCpipFileNumber: 11,
    preCpipName: 'Sport'
  },
  'mtn': {
    id: 230,
    name: 'Ski Hill',
    preCpipFileNumber: 10,
    preCpipName: 'Mtn'
  },
  'lodge': {
    id: 220,
    name: 'Ski Lodge',
    preCpipFileNumber: 11,
    preCpipName: 'Lodge'
  },
  'attic': {
    id: 221,
    name: 'Lodge Attic',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'pizza': {
    id: 330,
    name: 'Pizza Parlor',
    preCpipFileNumber: 12,
    preCpipName: 'Pizza'
  },
  'plaza': {
    id: 300,
    name: 'Plaza',
    preCpipFileNumber: 12,
    preCpipName: 'Plaza'
  },
  'pet': {
    id: 310,
    name: 'Pet Shop',
    preCpipFileNumber: 11,
    preCpipName: 'Pet'
  },
  'berg': {
    id: 805,
    name: 'Iceberg',
    preCpipFileNumber: 10,
    preCpipName: 'Berg'
  },
  'mine': {
    id: 808,
    name: 'Mine',
    preCpipFileNumber: 13,
    preCpipName: 'Mine'
  },
  'shack': {
    id: 807,
    name: 'Mine Shack',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'beach': {
    id: 400,
    name: 'Beach',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'beacon': {
    id: 411,
    name: 'Beacon',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'boxdimension': {
    id: 811,
    name: 'Box Dimension',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'stage': {
    id: 340,
    name: 'Stage',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'ship': {
    id: 420,
    name: 'Migrator',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'shipnest': {
    id: 423,
    name: 'Crow\'s Nest',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'shiphold': {
    id: 421,
    name: 'Ship Hold',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'shipquarters': {
    id: 422,
    name: 'Captain\s Quaters',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party': {
    id: 850,
    name: 'Party',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party1': {
    id: 851,
    name: 'Party 1',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party2': {
    id: 852,
    name: 'Party 2',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party3': {
    id: 853,
    name: 'Party 3',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party4': {
    id: 854,
    name: 'Party 4',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party5': {
    id: 855,
    name: 'Party 5',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party6': {
    id: 856,
    name: 'Party 6',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party7': {
    id: 857,
    name: 'Party 7',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party8': {
    id: 858,
    name: 'Party 8',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party9': {
    id: 859,
    name: 'Party 9',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party10': {
    id: 860,
    name: 'Party 10',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party11': {
    id: 861,
    name: 'Party 11',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party12': {
    id: 862,
    name: 'Party 12',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party13': {
    id: 863,
    name: 'Party 13',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party14': {
    id: 864,
    name: 'Party 14',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party15': {
    id: 865,
    name: 'Party 15',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party16': {
    id: 866,
    name: 'Party 16',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party17': {
    id: 867,
    name: 'Party 17',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party18': {
    id: 868,
    name: 'Party 18',
    preCpipFileNumber: null,
    preCpipName: null
  },
  'party99': {
    id: 899,
    name: 'Party 99',
    preCpipFileNumber: null,
    preCpipName: null
  }
};
