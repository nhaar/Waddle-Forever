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
  }
];