/** Identifies the type of game */
export type WaddleName = 'sled' | 'card' | 'fire';

type WaddleRoomInfo = {
  waddleId: number;
  roomId: number;
  seats: number;
  game: WaddleName;
}

export const WADDLE_ROOMS: WaddleRoomInfo[] = [
  {
    waddleId: 100,
    roomId: 230,
    seats: 4,
    game: 'sled'
  },
  {
    waddleId: 101,
    roomId: 230,
    seats: 3,
    game: 'sled'
  },
  {
    waddleId: 102,
    roomId: 230,
    seats: 2,
    game: 'sled'
  },
  {
    waddleId: 103,
    roomId: 230,
    seats: 2,
    game: 'sled'
  },
  {
    waddleId: 104,
    roomId: 855,
    seats: 4,
    game: 'sled'
  },
  {
    waddleId: 200,
    roomId: 320,
    seats: 2,
    game: 'card'
  },
  {
    waddleId: 201,
    roomId: 320,
    seats: 2,
    game: 'card'
  },
  {
    waddleId: 202,
    roomId: 320,
    seats: 2,
    game: 'card'
  },
  {
    waddleId: 203,
    roomId: 320,
    seats: 2,
    game: 'card'
  },
  {
    waddleId: 200,
    roomId: 322,
    seats: 2,
    game: 'card'
  },
  {
    waddleId: 201,
    roomId: 322,
    seats: 2,
    game: 'card'
  },
  {
    waddleId: 202,
    roomId: 322,
    seats: 2,
    game: 'card'
  },
  {
    waddleId: 203,
    roomId: 322,
    seats: 2,
    game: 'card'
  },
  {
    waddleId: 300,
    roomId: 812,
    seats: 2,
    game: 'fire'
  },
  {
    waddleId: 301,
    roomId: 812,
    seats: 2,
    game: 'fire'
  },
  {
    waddleId: 302,
    roomId: 812,
    seats: 3,
    game: 'fire'
  },
  {
    waddleId: 303,
    roomId: 812,
    seats: 4,
    game: 'fire'
  }
];