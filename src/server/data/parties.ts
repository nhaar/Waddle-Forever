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
  }
];