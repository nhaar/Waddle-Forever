import { modulo, randomInt } from "@common/utils";
import { WaddleGame } from "./waddle-game";

export const STARTER_ENERGY = 6;
const BOARD_TILE_COUNT = 16;

export const getRandomSpin = (): number => randomInt(1, 6);
export const getClockwise = (base: number, spin: number): number => modulo(base - spin, BOARD_TILE_COUNT);
export const getCounterClockwise = (base: number, spin: number): number => modulo(base + spin, BOARD_TILE_COUNT);

export class FireGame extends WaddleGame {
  public roomId = 997;
}