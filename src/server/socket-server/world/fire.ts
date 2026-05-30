import { modulo, randomInt } from "@common/utils";
import { WaddleGame } from "./waddle-game";
import { WorldPenguin } from "./world-penguin";

export const STARTER_ENERGY = 6;
const BOARD_TILE_COUNT = 16;

export const BOARD = [
  'b', 's', 'w', 'f',
  'c', 's', 'f', 'w',
  'b', 's', 'w', 'f',
  'c', 'w', 's', 'f'
] as const;

export const getRandomSpin = (): number => randomInt(1, 6);
export const getClockwise = (base: number, spin: number): number => modulo(base - spin, BOARD_TILE_COUNT);
export const getCounterClockwise = (base: number, spin: number): number => modulo(base + spin, BOARD_TILE_COUNT);

type Spin = [number, number, number];

export class FireGame extends WaddleGame {
  private _spin: Spin = [0, 0, 0];
  private _positions: number[];
  
  public roomId = 997;

  public constructor(players: WorldPenguin[]) {
    super(players);

    this._positions = [12, 4, 0, 8].slice(0, players.length);

    this.newSpin(this._positions[0]);
  }

  public get spin(): Spin {
    return [...this._spin];
  }

  public newSpin(base: number): void {
    const spin = getRandomSpin();
    this._spin = [spin, getClockwise(base, spin), getCounterClockwise(base, spin)];
  }

  public get positions(): number[] {
    return [...this._positions];
  }

  public updatePosition(index: number, tile: number) {
    this._positions[index] = tile;
  }
}

export const getAllPlayers = (players: WorldPenguin[]): number[] => players.map((_, i) => i);
