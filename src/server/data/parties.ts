import { RoomName } from "./rooms";

type Party = {
  name: string;
  startUpdateId: number;
  endUpdateId: number;
  // room name -> file Id
  roomChanges: Partial<Record<RoomName, number>>
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
  }
];