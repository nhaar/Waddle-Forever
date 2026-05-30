import { modulo, randomInt } from "@common/utils";
import { WaddleGame } from "./waddle-game";
import { WorldPenguin } from "./world-penguin";

export const STARTER_ENERGY = 6;
const BOARD_TILE_COUNT = 16;

export type BattleType = 'b' | 'f' | 'w' | 's';

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

class Hand {
  private _canDrawCards: number[];
  private _cantDrawCards: number[];
  private _hand: number[];
  
  constructor(cards: number[]) {
    this._canDrawCards = [...cards];
    this._cantDrawCards = [];
    this._hand = [];
  }

  public get cards(): number[] {
    return [...this._hand];
  }

  draw(index?: number): number {
    const useIndex = randomInt(0, this._canDrawCards.length - 1);
    const card = this._canDrawCards.splice(useIndex, 1)[0];
    this._cantDrawCards.push(card);
    if (index === undefined) {
      this._hand.push(card);
    } else {
      this._hand[index] = card;
    }
    if (this._canDrawCards.length === 0) {
      this._canDrawCards = this._cantDrawCards;
      this._cantDrawCards = [];

      this._hand.forEach(card => {
        const index = this._canDrawCards.findIndex(c => c === card);
        if (index !== -1) {
          this._canDrawCards.splice(index, 1);
          this._cantDrawCards.push(card);
        }
      });
    }
    return card;
  }
}

class FireRound {
  private _battleIndexes: number[];
  private _roundCards: Array<number | null>;
  private _battleType: BattleType;
  
  constructor(type: BattleType, players: number[]) {
    this._battleIndexes = [...players];
    this._battleType = type;
    this._roundCards = new Array(players.length).fill(null);
  }

  public setCard(seatIndex: number, card: number): void {
    this._roundCards[this._battleIndexes[seatIndex]] = card;
  }

  public get cards() {
    return [...this._roundCards];
  }

  public get players() {
    return [...this._battleIndexes];
  }

  public get type() {
    return this._battleType;
  }
}

export class FireGame extends WaddleGame {
  private _spin: Spin = [0, 0, 0];
  private _positions: number[];
  private _hands: Array<Hand>;
  private _energies: number[];
  private _round: FireRound;
  
  public roomId = 997;

  public constructor(players: WorldPenguin[]) {
    super(players);

    this._positions = [12, 4, 0, 8].slice(0, players.length);
    this._energies = new Array(players.length).fill(STARTER_ENERGY);
    this._hands = players.map(p => {
      const hand = new Hand(p.ninja.getDeck());
      for (let i = 0; i < 5; i++) {
        hand.draw();
      }
      return hand;
    })

    this.newSpin(this._positions[0]);
    this._round = new FireRound('b', []);
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

  public getHand(seatId: number): number[] {
    return this._hands[seatId].cards;
  }

  public updateHand(seatId: number, cardIndex: number): void {
    this._hands[seatId].draw(cardIndex);
  }

  public createRound(players: number[], type: BattleType): void {
    this._round = new FireRound(type, players);
  }

  public get round() {
    return this._round;
  }

  public get energies() {
    return [...this._energies];
  }

  public addEnergy(seatId: number) {
    this._energies[seatId]++;
  }

  public removeEnergy(seatId: number) {
    this._energies[seatId]--;
  }
}

export const getAllPlayers = (players: WorldPenguin[]): number[] => players.map((_, i) => i);
