import { StaticDataTable } from "../../common/static-table";

type Room = {
  id: number;
  name: string;
  preCpipPath: number;
  preCpipName: string;
  preCpipSong: number | null;
};

export const ROOMS = new StaticDataTable<Room, ['id', 'name', 'preCpipPath', 'preCpipName', 'preCpipSong']>(
  ['id', 'name', 'preCpipPath', 'preCpipName', 'preCpipSong'],
  [
    [100, 'Town', 6, 'Town', null],
    [110, 'Coffee Shop', 9, 'Coffee', 1],
    [111, 'Book Room', 18, 'Book', null],
    [120, 'Dance Club', 10, 'Dance', 2],
    [121, 'Dance Lounge', 11, 'Lounge', null],
    [130, 'Gift Shop', 17, 'Shop', null],
    [800, 'Dock', 15, 'Dock', null],
    [200, 'Ski Village', 16, 'Village', null],
    [802, 'Stadium', 14, 'Rink', null],
    [320, 'Dojo', 27, 'Dojo', null],
    [803, 'PSA HQ', 26, 'Agent', null]
  ]
);