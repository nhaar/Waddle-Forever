import { WorldPenguin } from "./world-penguin";

export abstract class WorldTable {
  private seats: Array<WorldPenguin | null> = [null, null];
  private joined: Array<boolean> = [false, false];
  private spectators = new Set<WorldPenguin>();
  static TABLE_SPECTATOR_SEAT = 99;
  private started = false;
  private ended = false;
  protected turn = 0;

  constructor(private id: number) {

  }

  static MANCALA_TABLE_IDS = new Set([100, 101, 102, 103, 104]);
  static FIND_FOUR_TABLE_IDS = new Set([200, 201, 202, 203, 204, 205, 206, 207]);

  public getCount() {
    return this.seats.filter(p => p !== null).length;
  }

  public getId() {
    return this.id;
  }

  getSeatIndex(penguin: WorldPenguin): number | undefined {
    if (this.spectators.has(penguin)) {
      return WorldTable.TABLE_SPECTATOR_SEAT;
    }

    const seatIndex = this.seats.findIndex((seat) => seat?.id === penguin.id);
    return seatIndex === -1 ? undefined : seatIndex;
  }

  assignSeatIndex(penguin: WorldPenguin): number {
    const existingSeat = this.getSeatIndex(penguin);
    if (existingSeat !== undefined) {
      return existingSeat;
    }
    const openSeat = this.seats.findIndex((seat) => seat === null);
    if (openSeat === -1) {
      this.spectators.add(penguin);
      return WorldTable.TABLE_SPECTATOR_SEAT;
    }
    this.seats[openSeat] = penguin;
    return openSeat;
  }

  abstract createBoard(): void;

  abstract serializeBoard(): string;

  reset() {
    this.createBoard();
    this.started = false;
    this.ended = false;
    this.turn = 0;
    this.spectators = new Set<WorldPenguin>();
  }

  resetRound() {
    this.reset();
    this.seats = [null, null];
    this.joined = [false, false];
  }

  public hasPlayer(penguin: WorldPenguin) {
    return this.getSeatIndex(penguin) !== -1;
  }

  public removePlayer(penguin: WorldPenguin) {
    const seat = this.getSeatIndex(penguin);
    if (seat !== undefined) {
      this.seats[seat] = null;
    }
  }

  public removeSpectator(penguin: WorldPenguin) {
    this.spectators.delete(penguin);
  }

  public addSpectator(penguin: WorldPenguin) {
    this.spectators.add(penguin);
  }

  public getNames() {
    return this.seats.map(p => p?.info.name ?? '');
  }

  public setJoined(seat: number) {
    this.joined[seat] = true;
  }

  sendSeatRoaster(handler: string, target: WorldPenguin) {
    this.seats.forEach((seat, index) => {
      const name = seat?.info.name ?? '';
      target.sendXt(handler, index, name);
    });
  }

  forEach(callback: (player: WorldPenguin) => void) {
    [...this.seats.filter((value): value is WorldPenguin => {
      return value !== null;
    }), ...this.spectators].forEach(callback);
  }

  sendXt(handler: string, ...args: Array<number | string>) {
    this.forEach(client => client.sendXt(handler, ...args));
  }

  sendUpdate(seatId: number, name: string) {
    this.sendXt('uz', seatId, name);
  }

  public hasStarted() {
    return this.started;
  }

  public hasJoined(seat: number) {
    return this.joined[seat];
  }

  public hasEveryoneJoined() {
    return this.joined.every(joined => joined);
  }

  public setStarted() {
    this.started = true;
    this.turn = 0;
  }

  public getTurn() {
    return this.turn;
  }

  public hasEnded() {
    return this.ended;
  }

  abstract getMoveLength(): number;

  abstract sendMove(moves: number[]): boolean;

  abstract getAutomaticTurnChange(): boolean;

  public changeTurn() {
    this.turn = (this.turn + 1) % 2;
  }

  protected endGame(...args: number[]) {
    this.ended = true;
    //  idk what this is doing
    // this.spectators.forEach(spectator => {
    //   this._server.addSpectator(spectator.penguin.id);
    // });
    this.sendXt('zo', ...args);
  }

  protected awardCoins(scores: [number, number]) {
    this.seats.forEach((player, index) => {
      if (player !== null && (index == 0 || index == 1)) {
        const score = scores[index];
        if (score > 0) {
          player.info.addCoins(score);
          player.info.update();
        }
      }
    });
  }
}