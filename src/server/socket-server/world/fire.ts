import { modulo, randomInt } from "@common/utils";
import { WaddleGame } from "./waddle-game";
import { WorldPenguin } from "./world-penguin";
import { MIN_SENSEI_RANK } from "@server/game-logic/ninja-progress";

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

export abstract class FireNinja {
  private _tile: number;
  private _energy = STARTER_ENERGY;
  private _seatId: number;
  private _energyGains = 0;
  private _lostEnergy = false;

  protected constructor(tile: number, seat: number) {
    this._tile = tile;
    this._seatId = seat;
  }

  public get tile(): number {
    return this._tile;
  }

  public updateTile(tile: number): void {
    this._tile = tile;
  }

  public get energy(): number {
    return this._energy;
  }

  public get energyGains(): number {
    return this._energyGains;
  }

  public get lostEnergy() {
    return this._lostEnergy;
  }

  public addEnergy(): void {
    this._energy++;
    this._energyGains++;
  }

  public removeEnergy(): void {
    this._energy--;
    this._lostEnergy = true;
  }

  public get seat(): number {
    return this._seatId;
  }
}

export class FirePlayer extends FireNinja {
  private _hand: Hand;
  private _ready = false;
  private _penguin: WorldPenguin;

  public constructor(tile: number, p: WorldPenguin, seat: number) {
    super(tile, seat);
    this._hand = new Hand(p.ninja.getDeck());
    for (let i = 0; i < 5; i++) {
      this._hand.draw();
    }
    this._penguin = p;
  }

  public get penguin(): WorldPenguin {
    return this._penguin;
  }

  public get hand(): number[] {
    return this._hand.cards;
  }

  public drawCard(index: number): void {
    this._hand.draw(index);
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

export class FireSensei extends FireNinja {
  private _beatable: boolean;

  public constructor(tile: number, beatable: boolean, seat: number) {
    super(tile, seat);
    this._beatable = beatable;
  }

  public get beatable(): boolean {
    return this._beatable;
  }
}

export class BattlePlayer {
  private _chosenIndex: number | null = null;
  private _ninja: FirePlayer;
  private _cardTimeout: NodeJS.Timeout | null = null;
  private _pendingCallback: (() => Promise<void>) | null = null;

  public constructor(ninja: FirePlayer) {
    this._ninja = ninja;
  }

  public setCard(index: number): void {
    this._chosenIndex = index;
  }

  public get chosen(): number | null {
    return this._chosenIndex;
  }

  public get ninja(): FirePlayer {
    return this._ninja;
  }

  public setCardTimeout(callback: () => void): void {
    this._cardTimeout = setTimeout(() => {
      callback();
      this._cardTimeout = null;
    }, 23000);
  }

  public clearTimeout(): void {
    if (this._cardTimeout !== null) {
      clearTimeout(this._cardTimeout)
      this._cardTimeout = null;
    }
  }

  public setPending(callback: () => Promise<void>): void {
    this._pendingCallback = async () => {
      await callback();
      this._pendingCallback = null;
    };
  }

  public isPending(): boolean {
    return this._pendingCallback !== null;
  }

  public async callPending(): Promise<void> {
    if (this._pendingCallback !== null) {
      await this._pendingCallback();
    }
  }
}

class FireRound {
  private _seats: BattlePlayer[];
  private _ninjas: FireNinja[];
  private _players: Map<WorldPenguin, BattlePlayer>;
  private _battleType: BattleType;
  
  constructor(type: BattleType, players: FireNinja[]) {
    this._ninjas = [...players];
    this._players = new Map(players.filter(n => n instanceof FirePlayer).map(n => [n.penguin, new BattlePlayer(n)]));
    this._seats = [...this._players.values()];
    this._battleType = type;
  }

  public fromPenguin(p: WorldPenguin): BattlePlayer | undefined {
    return this._players.get(p);
  }

  public get cards() {
    return this._seats.map(b => b.chosen);
  }

  public get players() {
    return [...this._seats];
  }

  public get ninjas() {
    return [...this._ninjas];
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
  private _penguins: Map<WorldPenguin, FirePlayer>;
  private _sensei: FireSensei | null = null;

  private _boardTimeout: NodeJS.Timeout | null = null;
  
  public roomId = 997;

  public constructor(players: WorldPenguin[]) {
    super(players);

    const isSensei = players.length === 1;

    this._seats = [...players, ...(isSensei ? [null] : [])].map((p, i) => {
      const tile = START_POSITIONS[i];
      if (p === null) {
        const sensei = new FireSensei(tile, players[0].ninja.fireProgress.getRank() >= MIN_SENSEI_RANK, i);
        this._sensei = sensei;
        return sensei;
      } else {
        return new FirePlayer(START_POSITIONS[i], p, i);
      }
    });
    this._penguins = new Map(this._seats.filter((n): n is FirePlayer => n instanceof FirePlayer).map(n => [n.penguin, n]));
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
    const ready = this._playing.every(n => !(n instanceof FirePlayer) || n.ready);
    if (ready) {
      this._playing.forEach(n => {
        if (n instanceof FirePlayer) {
          n.unready();
        }
      });
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

  public getPosition(n: FirePlayer): number {
    return this._standing.get(n) ?? 1;
  }

  public get matchPlayerCount(): number {
    return this._seats.length;
  }

  public fromPenguin(p: WorldPenguin): FirePlayer | undefined {
    return this._penguins.get(p);
  }

  public fromSeat(seat: number): FireNinja {
    return this._seats[seat];
  }

  public isPlaying(ninja: FirePlayer): boolean {
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

  public get ninjas(): FireNinja[] {
    return [...this._seats];
  }

  public get sensei(): FireSensei | null {
    return this._sensei;
  }
}