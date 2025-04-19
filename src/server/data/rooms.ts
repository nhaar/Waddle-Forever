type Room = {
  id: number;
  name: string;
  preCpipFileNumber: number;
  preCpipName: string;
  preCpipSong?: number;
};

export type RoomName = 'town' |
  'coffee' |
  'book' |
  'dance' |
  'lounge' |
  'shop' |
  'dock' |
  'village' |
  'rink' |
  'dojo' |
  'forts' |
  'agent' |
  'sport' |
  'mtn' |
  'lodge' |
  'pizza' |
  'plaza' |
  'pet' |
  'berg';

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
  }
};
