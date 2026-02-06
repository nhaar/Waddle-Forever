import { Client, Server } from "@server/client";

/** Represents a table in a table game eg find four */
export abstract class Table {
  private _id: number;
  private _roomId: number;
  private _seats: Array<Client | null>;
  private _joined: [boolean, boolean];
  private _server: Server;
  private _started: boolean;
  private _ended: boolean;
  protected _turn: number;
  private _spectators: Set<Client>;

  static TABLE_SPECTATOR_SEAT = 99;
  static SEAT_LENGTH = 2;

  constructor(id: number, roomId: number, server: Server) {
    this._id = id;
    this._roomId = roomId;
    this._seats = [null, null];
    this._started = false;
    this._ended = false;
    this._turn = 0;
    this._server = server;
    this._spectators = new Set<Client>();
    this._joined = [false, false];
    this.createBoard();
  }

  updateRoom(room: number): void {
    this._roomId = room;
  }

  reset() {
    this.createBoard();
    this._started = false;
    this._ended = false;
    this._turn = 0;
    this._spectators = new Set<Client>();
  }

  broadcastUpdate() {
    const room = this._server.getRoom(this._roomId);
    room.players.forEach((player) => {
      player.sendXt('ut', this._id, this.count);
    });
  }

  get count(): number {
    return this._seats.filter((seat) => seat !== null).length;
  }

  forEach(callback: (player: Client) => void) {
    [...this._seats.filter((value): value is Client => {
      return value !== null;
    }), ...this._spectators].forEach(callback);
  }

  sendPacket(handler: string, ...args: Array<number | string>) {
    this.forEach(client => client.sendXt(handler, ...args));
  }

  sendSeatRoaster(handler: string, target: Client) {
    this._seats.forEach((seat, index) => {
      const name = seat?.penguin.name ?? '';
        target.sendXt(handler, index, name);
    });
  }

  sendUpdate(seatId: number, name: string) {
    this.sendPacket('uz', seatId, name);
  }

  clear(quitterName: string) {
    this.forEach((player) => {
      if (player !== null) {
        player.exitTable();
        player.sendXt('cz', quitterName);
      }
    });
    

    this._seats = [null, null];
    this.reset();
    this.broadcastUpdate();
  }

  get id() {
    return this._id;
  }

  awardCoins(scores: [number, number]) {
    this._seats.forEach((player, index) => {
      if (player !== null && (index == 0 || index == 1)) {
        const score = scores[index];
        if (score > 0) {
          player.penguin.addCoins(score);
          player.update();
        }
      }
    });
  }

  resetRound() {
    this.reset();
    this._seats = [null, null];
    this._joined = [false, false];
    this.broadcastUpdate();
  }

  get spectators() {
    return this._spectators;
  }

  getSeatIndex(client: Client): number | undefined {
    const seatIndex = this._seats.findIndex((seat) => seat?.penguin.id === client.penguin.id);
    return seatIndex === -1 ? undefined : seatIndex;
  }

  assignSeatIndex(client: Client): number {
    const existingSeat = this.getSeatIndex(client);
    if (existingSeat !== undefined) {
      return existingSeat;
    }
    const openSeat = this._seats.findIndex((seat) => seat === null);
    if (openSeat === -1) {
      this._spectators.add(client);
      return Table.TABLE_SPECTATOR_SEAT;
    }
    this._seats[openSeat] = client;
    return openSeat;
  }

  emptySeat(index: number) {
    this._seats[index] = null;
  }

  getName(seat: number): string {
    const player = this._seats[seat];
    if (player === null) {
      return '';
    }
    return player.name;
  }

  get started() {
    return this._started;
  }

  get turn() {
    return this._turn;
  }

  get ended() {
    return this._ended;
  }

  getSeat(index: number) {
    return this._seats[index];
  }

  setSeat(client: Client, index: number) {
    this._seats[index] = client;
  }

  get seats() {
    return this._seats;
  }

  setStarted() {
    this._started = true;
    this._turn = 0;
  }

  setEnded() {
    this._ended = true;
  }

  changeTurn() {
    this._turn = this._turn === 0 ? 1 : 0;
  }

  removeSpectator(client: Client) {
    this._spectators.delete(client);
  }

  hasJoined(index: number) {
    return this._joined[index];
  }

  setJoined(index: number) {
    this._joined[index] = true;
  }

  hasEveryoneJoined() {
    return this._joined.every(value => value);
  }

  abstract createBoard(): void;

  abstract serializeBoard(): string;

  abstract moveLength: number;

  abstract automaticTurnChange: boolean;

  abstract sendMove(moves: number[]): boolean;

  endGame(...args: number[]) {
    this.setEnded();
    this._spectators.forEach(spectator => {
      this._server.addSpectator(spectator.penguin.id);
    });
    this.sendPacket('zo', ...args);
  }
}