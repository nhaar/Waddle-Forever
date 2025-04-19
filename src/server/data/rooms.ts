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
  'cove' |
  'dance' |
  'lounge' |
  'light' |
  'forest' |
  'shop' |
  'dock' |
  'village' |
  'rink' |
  'dojo' |
  'dojoext' |
  'forts' |
  'agent' |
  'sport' |
  'mtn' |
  'shack' |
  'lodge' |
  'pizza' |
  'plaza' |
  'pet' |
  'berg' |
  'mine' |
  'beach' |
  'beacon' |
  'stage' |
  'boxdimension' |
  'party' |
  'party1' |
  'party2' |
  'party3';

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
    preCpipFileNumber: null,
    preCpipName: null
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
  }
};
