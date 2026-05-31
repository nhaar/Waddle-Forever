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

const START_POSITIONS = [12, 4, 8, 0];

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

export class FireNinja {
  private _tile: number;
  private _energy = STARTER_ENERGY;
  private _hand: Hand;
  private _ready = false;
  private _penguin: WorldPenguin;
  private _seatId: number;

  public constructor(tile: number, p: WorldPenguin, seat: number) {
    this._tile = tile;
    this._hand = new Hand(p.ninja.getDeck());
    for (let i = 0; i < 5; i++) {
      this._hand.draw();
    }
    this._penguin = p;
    this._seatId = seat;
  }

  public get penguin(): WorldPenguin {
    return this._penguin;
  }

  public get seat(): number {
    return this._seatId;
  }

  public get tile(): number {
    return this._tile;
  }

  public updateTile(tile: number): void {
    this._tile = tile;
  }

  public get hand(): number[] {
    return this._hand.cards;
  }

  public drawCard(index: number): void {
    this._hand.draw(index);
  }

  public get energy(): number {
    return this._energy;
  }

  public addEnergy(): void {
    this._energy++;
  }

  public removeEnergy(): void {
    this._energy--;
  }

  public get ready(): boolean {
    return this._ready;
  }

  public setReady(): void {
    this._ready = true;
  }

  public unready(): void {
    this._ready = false;
  }
}

class BattleNinja {
  private _chosenIndex: number | null = null;
  private _ninja: FireNinja;

  public constructor(ninja: FireNinja) {
    this._ninja = ninja;
  }

  public setCard(index: number): void {
    this._chosenIndex = index;
  }

  public get chosen(): number | null {
    return this._chosenIndex;
  }

  public get ninja(): FireNinja {
    return this._ninja;
  }
}

class FireRound {
  private _seats: BattleNinja[];
  private _players: Map<WorldPenguin, BattleNinja>;
  private _battleType: BattleType;
  
  constructor(type: BattleType, players: FireNinja[]) {
    this._players = new Map(players.map(n => [n.penguin, new BattleNinja(n)]));
    this._seats = [...this._players.values()];
    this._battleType = type;
  }

  public fromPenguin(p: WorldPenguin): BattleNinja | undefined {
    return this._players.get(p);
  }

  public get cards() {
    return this._seats.map(b => b.chosen);
  }

  public get players() {
    return [...this._seats];
  }

  public get type() {
    return this._battleType;
  }
}

export class FireGame extends WaddleGame {
  private _spin: Spin = [0, 0, 0];
  private _round: FireRound;
  private _seats: FireNinja[];
  private _activePlayer: FireNinja;
  private _playing: FireNinja[];
  private _standing = new Map<FireNinja, number>();
  private _penguins: Map<WorldPenguin, FireNinja>;

  private _boardTimeout: NodeJS.Timeout | null = null;
  
  public roomId = 997;

  public constructor(players: WorldPenguin[]) {
    super(players);

    this._seats = players.map((p, i) => new FireNinja(START_POSITIONS[i], p, i));
    this._penguins = new Map(this._seats.map(n => [n.penguin, n]));
    this._playing = [...this._seats];
    this._activePlayer = this._playing[0];
    this.newSpin();
    this._round = new FireRound('b', []);
  }

  public get spin(): Spin {
    return [...this._spin];
  }

  public newSpin(): void {
    const tile = this._activePlayer.tile;
    const spin = getRandomSpin();
    this._spin = [spin, getClockwise(tile, spin), getCounterClockwise(tile, spin)];
  }

  public nextPlayer(): void {
    const index = this._playing.findIndex(p => p === this._activePlayer)
    this._activePlayer = this._playing[(index + 1) % this._playing.length];
  }

  public get positions(): number[] {
    return this._seats.map(n => n.tile);
  }

  public createRound(players: FireNinja[], type: BattleType): void {
    this._round = new FireRound(type, players);
  }

  public get round() {
    return this._round;
  }

  public get energies() {
    return this._seats.map(n => n.energy);
  }

  public everyoneReady(): boolean {
    const ready = this._playing.every(n => n.ready);
    if (ready) {
      this._playing.forEach(n => n.unready());
    }
    return ready;
  }

  public get activePlayer(): FireNinja {
    return this._activePlayer;
  }

  public get activePlayers(): FireNinja[] {
    return [...this._playing];
  }

  public get standings() {
    return this._seats.map((n) => this._standing.get(n) ?? 1);
  }

  public playerEntersPodium(ninja: FireNinja) {
    this._playing = this._playing.filter(n => n !== ninja);
    this._standing.set(ninja, this._seats.length - this._standing.size);
  }

  public fromPenguin(p: WorldPenguin): FireNinja | undefined {
    return this._penguins.get(p);
  }

  public fromSeat(seat: number): FireNinja {
    return this._seats[seat];
  }

  public isPlaying(ninja: FireNinja): boolean {
    return this._standing.get(ninja) === undefined;
  }

  public setBoardTimeout(callback: () => void) {
    this._boardTimeout = setTimeout(() => {
      callback();
      this._boardTimeout = null;
    }, 23000);
  }

  public clearBoardTimeout(): void {
    if (this._boardTimeout !== null) {
      clearTimeout(this._boardTimeout);
      this._boardTimeout = null;
    }
  }

  public isChoosing(): boolean {
    return this._boardTimeout !== null;
  }
}