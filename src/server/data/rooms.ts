type Room = {
  id: number;
  name: string;
  preCpipPath: number;
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
  'agent';

export const ROOMS: Record<RoomName, Room> = {
  'town': {
    id: 100,
    name: 'Town',
    preCpipPath: 6,
    preCpipName: 'Town'
  },
  'coffee': {
    id: 110,
    name: 'Coffee Shop',
    preCpipPath: 9,
    preCpipName: 'Coffee',
    preCpipSong: 1
  },
  'book': {
    id: 111,
    name: 'Book Room',
    preCpipPath: 18,
    preCpipName: 'Book'
  },
  'dance': {
    id: 120,
    name: 'Dance Club',
    preCpipPath: 10,
    preCpipName: 'Dance',
    preCpipSong: 2
  },
  'lounge': {
    id: 121,
    name: 'Dance Lounge',
    preCpipPath: 11,
    preCpipName: 'Lounge'
  },
  'shop': {
    id: 130,
    name: 'Gift Shop',
    preCpipPath: 17,
    preCpipName: 'Shop'
  },
  'dock': {
    id: 800,
    name: 'Dock',
    preCpipPath: 15,
    preCpipName: 'Dock'
  },
  'village': {
    id: 200,
    name: 'Ski Village',
    preCpipPath: 16,
    preCpipName: 'Village'
  },
  'rink': {
    id: 802,
    name: 'Stadium',
    preCpipPath: 14,
    preCpipName: 'Rink'
  },
  'dojo': {
    id: 320,
    name: 'Dojo',
    preCpipPath: 27,
    preCpipName: 'Dojo'
  },
  'agent': {
    id: 803,
    name: 'PSA HQ',
    preCpipPath: 26,
    preCpipName: 'Agent',
    preCpipSong: 7
  },
  'forts': {
    id: 801,
    name: 'Snow Forts',
    preCpipPath: 30,
    preCpipName: 'Forts'
  }
};
