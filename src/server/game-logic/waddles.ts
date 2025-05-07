import { StaticDataTable } from "../../common/static-table";

/** Identifies the type of game */
export type WaddleName = 'sled' | 'card';

type WaddleRoomInfo = {
  id: number;
  roomId: number;
  seats: number;
  game: WaddleName;
}

export const WADDLE_ROOMS = new StaticDataTable<WaddleRoomInfo, ['id', 'roomId', 'seats', 'game']>([
  'id',
  'roomId',
  'seats',
  'game'
], [
  [100, 230, 4, 'sled'],
  [101, 230, 3, 'sled'],
  [102, 230, 2, 'sled'],
  [103, 230, 2, 'sled'],
  [200, 320, 2, 'card'],
  [201, 320, 2, 'card'],
  [202, 320, 2, 'card'],
  [203, 320, 2, 'card'],
]);