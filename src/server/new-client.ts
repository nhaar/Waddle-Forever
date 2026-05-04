import { choose, iterateEntries, randomInt, Vector } from "@common/utils";
import { EQUIP_SLOT_MAPPINGS } from "./client";
import { Igloo, IglooFurniture, JsonDatabase } from "./database";
import { Card, CardColor, CardElement, CARDS } from "./game-logic/cards";
import { isFlag } from "./game-logic/flags";
import { ItemType } from "./game-logic/items";
import { CardJitsuProgress } from "./game-logic/ninja-progress";
import { PUFFLES } from "./game-logic/puffle";
import { isLiteralScoreGame, Room } from "./game-logic/rooms";
import { WaddleName, WADDLE_ROOMS } from "./game-logic/waddles";
import { logverbose } from "./logger";
import { Penguin, PenguinEquipmentSlot } from "./penguin";
import { SettingsManager } from "./settings";
import { ClientSocket, getXtMessage } from "./socket-server";
import { GameData } from "./timelines/game-data";

type RoomState = { x: number; y: number; frame: number; };


export class WorldClient implements ClientSocket {
  constructor(private socket: ClientSocket) {

  }

  async write(data: string): Promise<void> {
    await this.socket.write(data);
  }

  end(data?: string | undefined): void {
    this.socket.end(data);
  }

  async sendXt(handler: string, ...args: Array<number | string>): Promise<void> {
    logverbose('\x1b[32mSending XT:\x1b[0m ', handler, args);
    await this.write(getXtMessage(false, handler, ...args));
  }
}

export class WorldPenguin {
  private _avatar = 0;
  private _walkingPuffle: number | null = null;
  private _sessionStamps: number[] = [];
  private _sessionStart = Date.now();
  private agentPending = false;

  constructor(private client: WorldClient, private penguin: Penguin, private gameData: GameData, private settings: SettingsManager) {

  }

  public async sendXt(message: string, ...args: Array<string | number>) {
    await this.client.sendXt(message, ...args);
  }

  public getAge() {
    // difference converted into days
    return Math.floor((this.settings.getVirtualDate(0).getTime() - this.penguin.virtualRegistration) / 1000 / 86400);
  }

  public getString(state: RoomState): string {
    if (this.gameData.isPreCpip()) {
      return this.penguin.getEngine1Crumb(state);
    } else {
      // meant to be approval, but always approved (1), TODO: non approved names in the future
      const approval = this.gameData.isNewShell2009() ? [1] : []

      return [
        this.penguin.id,
        this.penguin.name,
        ...approval, 
        this.penguin.color,
        this.penguin.head,
        this.penguin.face,
        this.penguin.neck,
        this.penguin.body,
        this.penguin.hand,
        this.penguin.feet,
        this.penguin.pin,
        this.penguin.background,
        state.x,
        state.y,
        state.frame,
        this.penguin.isMember ? 1 : 0,
        this.getAge(), // TODO member age
        this._avatar,
        0, // TODO figure out what penguin state is
        0, // TODO figure out what party state is
        0, // TODO figure out what puffle state is
        '', // TODO figure out what empty strings are for (and if are necessary)
        '',
        '',
        ''
      ].join('|');
    }
  }

  public getClient() {
    return this.client;
  }

  public get id() {
    return this.penguin.id;
  }

  public sendInfo(state: RoomState) {
    const virtualDate = this.settings.getVirtualDate(0);
    
    this.client.sendXt(
      'lp',
      this.getString(state),
      String(this.penguin.coins),
      this.penguin.isSafeChat ? 1 : 0, 1440,
      virtualDate.getTime(),
      this.getAge(),
      0,
      this.penguin.minutesPlayed,
      -1, 7, 1, 4, 3
    );
  }

  public unequipPuffle(): void {
    if (this.penguin.hand >= 750 && this.penguin.hand <= 759) {
      this.penguin.hand = 0;
    }
  }

  private getItemsFiltered() {
    // pre-cpip engines have limited items, after
    // that global_crumbs allow having all the items

    let items = this.penguin.getItems();

    if (this.gameData.isPreCpip()) {
      const itemSet = this.gameData.getClientItems();
      items = items.filter((value) => itemSet.has(value));
    }

    // if (this.settings.inventory_accuracy) {
    //   return items.filter(id => {
    //     const entry = ITEM_RELEASES.get(id);
    //     if (entry === undefined) {
    //       return false;
    //     } else {
    //       return isGreaterOrEqual(this.settings.version, entry);
    //     }
    //   });
    // }
    return items;
  }

  public sendInventory(): void {
    this.sendXt('gi', this.getItemsFiltered().join('%'));
  }

  get info() {
    return this.penguin;
  }

  static getFurnitureString(furniture: IglooFurniture): string {
    return furniture.map((furniture) => {
      return [
        furniture.id,
        furniture.x,
        furniture.y,
        furniture.rotation,
        furniture.frame
      ].join('|')
    }).join(',');
  }

  static getModernIglooString(igloo: Igloo, index: number): string {
    // TODO like stuff
    const likeCount = 0;
    const furnitureString = WorldPenguin.getFurnitureString(igloo.furniture);
    return [
      igloo.id,
      index,
      0, // TODO don't know what this is
      igloo.locked ? 1 : 0,
      igloo.music,
      igloo.flooring,
      igloo.location,
      igloo.type,
      likeCount,
      furnitureString
    ].join(':');
  }

  getIglooString(igloo: Igloo): string {
    if (!this.gameData.isVanillaEngine()) {
      const furnitureString = WorldPenguin.getFurnitureString(igloo.furniture);
      return [
        igloo.type,
        igloo.music,
        igloo.flooring,
        furnitureString
      ].join('%');
    } else {
      // This is Engine 3
      return WorldPenguin.getModernIglooString(igloo, 1);
    }
  }

  getOwnIglooString (): string {
    return this.getIglooString(this.penguin.activeIgloo);
  }

  public get walkingPuffle() {
    return this._walkingPuffle;
  }

  giveStamp(stampId: number, params: { notify?: boolean } = {}): void {
    const notify = params.notify ?? true;
    if (this.gameData.isStampAvailable(stampId)) {
      if (!this.penguin.hasStamp(stampId)) {
        this.penguin.addStamp(stampId);
        this.penguin.stampbook.recent_stamps.push(stampId);
        this._sessionStamps.push(stampId);
      }
      if (notify) {
        this.sendXt('aabs', stampId);
      }
    }
  }

  getEndgameStampsInformation(game: number): [string, number, number, number] {
    const info: [string, number, number, number] = ['', 0, 0, 0];

    const stamps = this.gameData.getGameStamps(game);

    const gameSessionStamps: number[] = [];
    this._sessionStamps.forEach((stamp) => {
      if (stamps.has(stamp)) {
        gameSessionStamps.push(stamp);
      }
    });
    // string of recently collected stamps
    info[0] = gameSessionStamps.join('|');
    // total number of stamps collected in this game
    info[1] = [...stamps].filter((stamp) => this.penguin.hasStamp(stamp)).length;
    // total number of stamps the game has
    info[2] = stamps.size;

    // TODO check what this is used for
    info[3] = 0;

    this._sessionStamps = [];

    return info;
  }

  public addItem(id: number, params: { free?: boolean, notify?: boolean } = {}): void {
    this.penguin.addItem(id);
    let cost: number;
    if (params.free === true) {
      cost = 0;
    } else {
      const item = this.gameData.getItem(id);
      cost = item.cost;
    }
    const notify = params.notify ?? true;
    this.penguin.removeCoins(cost);
    if (notify) {
      this.sendXt('ai', id, this.penguin.coins);
    }
  }

  public addFurniture(furnitureId: number, params: { cost?: number, notify?: boolean } = {}): void {
    const cost = params.cost ?? 0;
    const notify = params.notify ?? true;
    const canAdd = this.penguin.addFurniture(furnitureId, 1);
    if (!canAdd) {
      // 99 items limit
      this.sendError(10006);
    } else {
      this.penguin.removeCoins(cost);
    }
    if (notify) {
      this.sendXt('af', furnitureId, this.penguin.coins);
    }
  }

  public sendError(err: number): void {
    this.sendXt('e', err);
  }

  public async sendStamps() {
    await this.sendXt('gps', this.penguin.id, this.penguin.getStamps().join('|'));
  }

  public sendPuffles(): void {
    const puffles = this.penguin.getPuffles().map((puffle) => {
      return [puffle.id, puffle.name, puffle.type, puffle.clean, puffle.food, puffle.rest, 100, 100, 100].join('|')
    })
    this.sendXt('pgu', ...puffles);
  }

  public sendCoinsForChange() {
    if (this.gameData.hasCoinsForChange()) {
      // placeholder donation values

      const values = this.gameData.getCoinsForChangeDonations();
      if (values !== null) {
        this.sendXt('gcfct', values.map((amount, i) => `${i}|${amount}`).join(','));
      }
    }
  }

  public get sessionStart() {
    return this._sessionStart;
  }

  public isAgent(): boolean {
    return this.penguin.hasItem(800);
  }

  public getBuddyProtocol() {
    if (this.gameData.isPreCpip()) {
      const chat = this.gameData.getChatVersion();
      return chat >= 506 ? 'b' : 's';
    } else {
      // buddies for post-cpip not yet defined
      return undefined;
    }
  }

  public sendXtEmptyLast(handler: string, ...args: Array<number | string>): void {
    this.client.write(getXtMessage(true, handler, ...args));
  }

  public sendCoinsOld() {
    this.sendXt('ac', this.penguin.coins);
  }

  public setAgentPending() {
    return this.agentPending = true;
  }

  public isAgentPending() {
    return this.agentPending;
  }

  public getFurnitureString(): string {
    return this.penguin.getAllFurniture().map((pair) => {
      return pair.join('|');
    }).join('%');
  }

  public addPostcard (postcard: number, info: {
    senderId?: number
    senderName?: string
    details?: string    
  } = {}): void {
    const mail = this.penguin.receivePostcard(postcard, info);
    this.sendXt('mr', mail.sender.name, mail.sender.id, postcard, mail.postcard.details, mail.postcard.timestamp, mail.postcard.uid);
  }

  /** Add a "puffle care item" to the inventory */
  public buyPuffleItem(itemId: number, cost: number, amount: number) {
    const owned = this.penguin.addPuffleItem(itemId, amount);
    this.penguin.removeCoins(cost);
    this.sendXt('papi', this.penguin.coins, itemId, owned);
  }

  // gold nugget stuff in a diff class?
  private _isGoldNuggetState = false;

  activateGoldNuggetState(): void {
    this._isGoldNuggetState = true;
  }

  resetGoldNuggetState(): void {
    this._isGoldNuggetState = false;
  }

  public isGoldNuggetState() {
    return this._isGoldNuggetState;
  }

  // TODO this should be a Penguin method
  public swapPuffleFromIglooAndBackyard(playerPuffleId: number, goingToBackyard: boolean) {
    if (goingToBackyard) {
      this.penguin.addToBackyard(playerPuffleId);
    } else {
      this.penguin.removeFromBackyard(playerPuffleId);
    }
  }

  public walkPuffle (puffle: number) {
    this._walkingPuffle = puffle;
  }

  public unwalkPuffle() {
    this._walkingPuffle = null;
  }

  // TODO class to track this?

  private _puffleColorsDug = new Set<number>();

  /** Set a puffle color has having been dug */
  public addDugPuffleColor(puffleType: number): void {
    const puffle = PUFFLES.get(puffleType);
    // filter invalid IDs and only ones we want are 0-11
    if (puffle !== undefined && puffleType < 12) {
      this._puffleColorsDug.add(puffleType);
    }
  }

  public getTotalColorsDug(): number {
    return Array.from(this._puffleColorsDug.values()).length;
  }

  // TODO move probably
  public getPinString(): string {
    const pins = this.penguin.getItems().filter((item) => {
      const id = Number(item)
      return this.gameData.getItem(id)?.type === ItemType.Pin && !isFlag(id);
    }).map((pin) => {
      const item = this.gameData.getItem(Number(pin));
      if (item === undefined) {
        throw new Error(`Pin ${pin} in inventory doesn't exist`);
      }
      return [item.id, (new Date(`${item.releaseDate}T12:00:00`)).getTime() / 1000, item.isMember ? 1 : 0].join('|');
    })

    return pins.join('%');
  }

  // TODO move probably
  public getStampbookCoverString (): string {
    const cover = [
      this.penguin.stampbook.color,
      this.penguin.stampbook.highlight,
      this.penguin.stampbook.pattern,
      this.penguin.stampbook.icon
    ].map((n) => String(n));

    this.penguin.stampbook.stamps.forEach((info) => {
      cover.push([
        0, info.stamp, info.x, info.y, info.rotation, info.depth
      ].join('|'));
    });

    return cover.join('%');
  }

  // move probably
  public getRecentStampsString (): string {
    const recentStamps = this.penguin.stampbook.recent_stamps.join('|');
    this.penguin.stampbook.recent_stamps = [];
    return recentStamps;
  }

  /** Send stamp info at the end of a card-jitsu game */
  // TODO move?
  public sendCardJitsuStampInfo() {
    this.sendXt('cjsi', ...this.getEndgameStampsInformation(Room.CardJitsu));
  }

  public ninjaRankUp(previousRank: number) {
    for (let i = previousRank + 1; i <= this.penguin.ninjaProgress.rank; i++) {
      this.penguin.addItem(CardJitsuProgress.ITEM_AWARDS[i - 1]);
      const postcard = CardJitsuProgress.POSTCARD_AWARDS[i];
      if (postcard !== undefined) {
        this.addPostcard(postcard);
      }
      const stamp = CardJitsuProgress.STAMP_AWARDS[i];
      if (stamp !== undefined) {
        this.giveStamp(stamp);
      }
    }
    this.sendXt('cza', this.penguin.ninjaProgress.rank);
    this.penguin.update();

  }



  // TODO move probs
  public gainNinjaProgress(won: boolean): void {
    this.penguin.addCardJitsuWin();

    if (this.penguin.ninjaProgress.rank < CardJitsuProgress.MAX_RANK) {
      const exp = won ? 5 : 1;
      const previousRank = this.penguin.ninjaProgress.rank;
      this.penguin.ninjaProgress.earnXP(exp);
  
      if (this.penguin.ninjaProgress.rank > previousRank) {
        this.ninjaRankUp(previousRank);
      }
    }

    this.penguin.update();
  }

  public becomeNinja(): void {
    const previousRank = this.penguin.ninjaProgress.rank;
    this.penguin.ninjaProgress.becomeNinja();
    this.ninjaRankUp(previousRank);
  }
}

type ContextAdder<T> = (client: WorldClient, entity: T) => void;
type ContextRemover = (client: WorldClient) => void;

abstract class WorldEntity {
  constructor(private onAdd: ContextAdder<WorldEntity>, private onRemove: ContextRemover) {

  }
  
  protected addClient(client: WorldClient) {
    this.onAdd(client, this);
  }

  protected removeClient(client: WorldClient) {
    this.onRemove(client);
  }
}

export class WaddleRoom {
  private players: Array<WorldPenguin | null>;
  private seatIndex = 0;

  constructor(private id: number, private seats: number, private game: WaddleName) {
    this.players = new Array(seats).fill(null);
  }

  public getId() {
    return this.id;
  }

  public getSeats() {
    return [...this.players];
  }

  public addPenguin(penguin: WorldPenguin): number {
    this.players[this.seatIndex] = penguin;
    const seat = this.seatIndex;
    this.seatIndex++;
    return seat;
  }

  public isFull() {
    return this.seatIndex === this.players.length;
  }

  public getGame() {
    return this.game;
  }

  public reset() {
    this.players = new Array(this.seats).fill(null);
    return this.seatIndex = 0;
  }
}

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

class FindFourTable extends WorldTable {
  static FIND_FOUR_WIDTH = 7;
  static FIND_FOUR_HEIGHT = 6;
  private _board: number[][] | undefined;

  override createBoard(): void {
    this._board = Array.from({ length: FindFourTable.FIND_FOUR_WIDTH }, () => Array(FindFourTable.FIND_FOUR_HEIGHT).fill(0));
  }

  override getAutomaticTurnChange(): boolean {
    return true;
  }

  override getMoveLength(): number {
    return 2;
  }

  override sendMove(moves: number[]): boolean {
    if (this._board === undefined) {
      return false;
    }
    const column = moves[0];
    const dropRow = moves[1];
    this._board[column][dropRow] = this.turn + 1;
    this.sendXt('zm', this.turn, column, dropRow);
    const win = this.findFourWin(column, dropRow);
    if (win !== undefined) {
      this.awardFindFourCoins(win.winner - 1);
      this.endGame(win.x, win.y, win.direction);
      return true;
    } else if (this.isFindFourBoardFull()) {
      this.awardFindFourCoins();
      this.endGame(-10, -10, 1);
      return true;
    }
    return false;
  }

  isFindFourBoardFull(): boolean {
    if (this._board !== undefined) {
      for (let x = 0; x < FindFourTable.FIND_FOUR_WIDTH; x++) {
        for (let y = 0; y < FindFourTable.FIND_FOUR_HEIGHT; y++) {
          if (this._board[x]?.[y] === 0) {
            return false;
          }
        }
      }
    }
    return true;
  }

  awardFindFourCoins(winnerSeat?: number): void {
    const rewards: [number, number] = [5, 5];
    if (winnerSeat === 0 || winnerSeat === 1) {
      rewards[winnerSeat] = 10;
    }
    this.awardCoins(rewards);
  }

  override serializeBoard(): string {
    const values: number[] = [];
    if (this._board !== undefined) {
      for (let x = 0; x < FindFourTable.FIND_FOUR_WIDTH; x++) {
        for (let y = 0; y < FindFourTable.FIND_FOUR_HEIGHT; y++) {
          values.push(this._board[x]?.[y] ?? 0);
        }
      }
    }
    return values.join(',');
  }

  findFourWin(
    lastX: number,
    lastY: number
  ): { x: number; y: number; direction: number; winner: number } | undefined {
    if (this._board === undefined) {
      return undefined;
    }
    const value = this._board[lastX]?.[lastY] ?? 0;
    if (value <= 0) {
      return undefined;
    }

    const inBounds = (x: number, y: number): boolean =>
      x >= 0 && x < FindFourTable.FIND_FOUR_WIDTH && y >= 0 && y < FindFourTable.FIND_FOUR_HEIGHT;

    const countInDirection = (dx: number, dy: number): number => {
      let count = 0;
      if (this._board !== undefined) {
        let x = lastX + dx;
        let y = lastY + dy;
        while (inBounds(x, y) && this._board[x]?.[y] === value) {
          count += 1;
          x += dx;
          y += dy;
        }
      }
      return count;
    };

    const directions = [
      { dx: 1, dy: 0, direction: 2 },
      { dx: 0, dy: 1, direction: 1 },
      { dx: 1, dy: 1, direction: 3 },
      { dx: 1, dy: -1, direction: 4 }
    ];

    let best:
      | { x: number; y: number; direction: number; winner: number; dist: number }
      | undefined;

    for (const { dx, dy, direction } of directions) {
      const back = countInDirection(-dx, -dy);
      const forward = countInDirection(dx, dy);
      const total = back + 1 + forward;
      if (total < 4) {
        continue;
      }
      const lineStartX = lastX - dx * back;
      const lineStartY = lastY - dy * back;
      const startMin = Math.max(0, back - 3);
      const startMax = Math.min(back, total - 4);

      for (let startIndex = startMin; startIndex <= startMax; startIndex++) {
        const startX = lineStartX + dx * startIndex;
        const startY = lineStartY + dy * startIndex;
        const positions = [
          { x: startX, y: startY },
          { x: startX + dx, y: startY + dy },
          { x: startX + dx * 2, y: startY + dy * 2 },
          { x: startX + dx * 3, y: startY + dy * 3 }
        ];
        const anchorY = Math.min(...positions.map((pos) => pos.y));
        const anchorX =
          direction === 4
            ? Math.max(...positions.map((pos) => pos.x))
            : Math.min(...positions.map((pos) => pos.x));
        const centerX = startX + dx * 1.5;
        const centerY = startY + dy * 1.5;
        const dist = (centerX - lastX) ** 2 + (centerY - lastY) ** 2;
        if (best === undefined || dist < best.dist) {
          best = { x: anchorX, y: anchorY, direction, winner: value, dist };
        }
      }
    }

    if (best !== undefined) {
      return { x: best.x, y: best.y, direction: best.direction, winner: best.winner };
    }

    return undefined;
  }
}

class MancalaTable extends WorldTable {
  private _board: number[] | undefined;

  override createBoard(): void {
    this._board = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
  }

  override serializeBoard(): string {
    if (this._board == undefined) {
      return '';
    }
    return this._board.join(',');
  }

  override getMoveLength() {
    return 1;
  }

  override getAutomaticTurnChange() {
    return false;
  }

  isMancalaCupForPlayer(player: number, cup: number): boolean {
    return player === 0 ? cup >= 0 && cup <= 5 : cup >= 7 && cup <= 12;
  }

  applyMancalaMove(board: number[], player: number, cup: number): { command: string; nextTurn: number; gameOver: boolean } {
    let stones = board[cup];
    board[cup] = 0;

    const opponentMancala = player === 0 ? 13 : 6;
    let index = cup;
    while (stones > 0) {
      index = (index + 1) % 14;
      if (index === opponentMancala) {
        index = (index + 1) % 14;
      }
      board[index] += 1;
      stones -= 1;
    }

    const playerMancala = player === 0 ? 6 : 13;
    const lastCup = index;
    let command = '';
    let nextTurn = player === 0 ? 1 : 0;

    if (lastCup === playerMancala) {
      command = 'f';
      nextTurn = player;
    } else if (this.isMancalaCupForPlayer(player, lastCup) && board[lastCup] === 1) {
      const oppositeCup = 12 - lastCup;
      if (board[oppositeCup] > 0) {
        command = 'c';
        board[playerMancala] += board[oppositeCup] + board[lastCup];
        board[oppositeCup] = 0;
        board[lastCup] = 0;
      }
    }

    const gameOver = this.isMancalaSideEmpty(0) || this.isMancalaSideEmpty(1);
    return { command, nextTurn, gameOver };
  }

  isMancalaSideEmpty(player: number): boolean {
    if (this._board === undefined) {
      return true;
    }
    const start = player === 0 ? 0 : 7;
    const end = player === 0 ? 5 : 12;
    for (let i = start; i <= end; i++) {
      if (this._board[i] > 0) {
        return false;
      }
    }
    return true;
  }

  override sendMove(moves: number[]): boolean {
    const cup = moves[0];
    if (!this.isMancalaCupForPlayer(this.turn, cup)) {
      return false;
    }
    if (this._board === undefined || this._board[cup] <= 0) {
      return false;
    }

    const { command, nextTurn, gameOver } = this.applyMancalaMove(this._board, this.turn, cup);
    const zmArgs: Array<number | string> = [this.turn, cup];
    if (command !== '') {
      zmArgs.push(command);
    }
    this.sendXt('zm', ...zmArgs);
    this.turn = nextTurn;
    if (gameOver) {
      this.awardMancalaCoins();
      this.endGame();
      return true;
    }
    return false;
  }

  awardMancalaCoins(): void {
    this.awardCoins([this.getMancalaScore(0), this.getMancalaScore(1)])
  }

  getMancalaScore(player: number): number {
    let total = 0;
    if (this._board !== undefined) {
      const start = player === 0 ? 0 : 7;
      const end = player === 0 ? 6 : 13;
      for (let i = start; i <= end; i++) {
        total += this._board[i];
      }
    }
    return total;
  }
}

export class WorldRoom extends WorldEntity {
  private penguins = new Map<WorldPenguin, RoomState>();
  private waddles = new Map<number, WaddleRoom>();
  private tables = new Map<number, WorldTable>();

  constructor(onAdd: ContextAdder<WorldEntity>, onRemove: ContextRemover, private id: number) {
    super(onAdd, onRemove);
  }

  public getPlayers(): string[] {
    return [...this.penguins.entries()].map(([penguin, info]) => {
      return penguin.getString(info);
    });
  }

  public getPlayerStates() {
    return this.penguins.entries();
  }

  public addPenguin(penguin: WorldPenguin, x: number, y: number): void {
    this.addClient(penguin.getClient());
    const state = { x, y, frame: 1 };
    this.penguins.set(penguin, state);

    const string = penguin.getString(state);
    penguin.getClient().sendXt('jr', this.id, ...this.getPlayers());
    this.sendXt('ap', string);
    // it seems that the new x, y position of players must be sent via a new set position packet
    this.move(penguin, x, y);
  }

  public getState(penguin: WorldPenguin) {
    const state = this.penguins.get(penguin);
    if (state === undefined) {
      throw new Error("Penguin not found");
    }
    return state;
  }

  public move(penguin: WorldPenguin, x: number, y: number): void {
    this.penguins.set(penguin, { x, y, frame: 1 });
    this.sendXt('sp', penguin.id, x, y);
  }

  public teleport(penguin: WorldPenguin, x: number, y: number, frame: number): void {
    this.penguins.set(penguin, { x, y, frame });
    this.sendXt('st', penguin.id, x, y, frame);
  }

  public removePenguin(penguin: WorldPenguin): void {
    this.removeClient(penguin.getClient());
    this.penguins.delete(penguin);

    const players = this.getPlayers();
    // because minigames get the player from their previous room, you can't
    // send the remove player packet to the player leaving otherwise it won't
    // find itself and minigame features (the penguin color) won't work
    this.sendXt('rp', penguin.id, ...players);
  }

  public sendXt(message: string, ...args:Array<string | number>): void {
    [...this.penguins.keys()].forEach(p => p.getClient().sendXt(message, ...args));
  }

  public throwSnowball(penguin: WorldPenguin, x: string, y: string): void {
    this.sendXt('sb', penguin.id, x, y);
  }

  public addWaddle(id: number, waddle: WaddleRoom): void {
    this.waddles.set(id, waddle);
  }

  public getWaddleRooms() {
    return [...this.waddles.values()];
  }

  public getWaddleRoom(id: number): WaddleRoom | undefined {
    return this.waddles.get(id);
  }

  public enterWaddleRoom(waddle: WaddleRoom, penguin: WorldPenguin): void {
    const seat = waddle.addPenguin(penguin)
    penguin.sendXt('jw', seat);
    this.sendXt('uw', waddle.getId(), seat, penguin.info.name, penguin.id);
  }

  public getTable(id: number) {
    let table = this.tables.get(id);
    if (table === undefined) {
      if (WorldTable.FIND_FOUR_TABLE_IDS.has(id)) {
        table = new FindFourTable(id);
      } else if (WorldTable.MANCALA_TABLE_IDS.has(id)) {
        table = new MancalaTable(id);
      } else {
        throw new Error('Unknown table id');
      }

      this.tables.set(id, table);
    }
    return table;
  }

  public getPenguinTable(penguin: WorldPenguin): WorldTable | null {
    for (const table of this.tables.values()) {
      if (table.hasPlayer(penguin)) {
        return table;
      }
    }

    return null;
  }

  public sendTableState(table: WorldTable) {
    this.sendXt('ut', table.getId(), table.getCount());
  }

  public getId() {
    return this.id;
  }

  public setFrame(penguin: WorldPenguin, frame: number) {
    const info = this.penguins.get(penguin);
    if (info !== undefined) {
      info.frame = frame;
    }
  }

  public updateEquipment(penguin: WorldPenguin, slot: PenguinEquipmentSlot, id: number): void {
    penguin.info[slot] = id;
    this.sendXt(`up${EQUIP_SLOT_MAPPINGS[slot]}`, penguin.id, id);
  }
}

// track which buddy packet namespace a client uses: chat291-339 "s" vs chat506 "b"
type BuddyProtocol = 's' | 'b';

type BakeryState = 'IngredientsStation' | 'CheerStation' | 'MultiplierStation' | 'ResetStation';
type BakeryMultiplier = 'Small' | 'Medium' | 'Large';
type Ingredient = 'Candy' | 'Eggs' | 'Flour' | 'Milk' | 'Tire' | 'Hay';

class Bakery {
  private _state: BakeryState = 'IngredientsStation';
  
  static MAGIC_INGREDIENTS: Ingredient[] = ['Hay', 'Tire', 'Candy'];
  private _ingredients: Ingredient[] = [];
  private _currentIngredient: number = 0;

  private _currentEmote: number = 1;
  static CHEER_CAPACITY = 7;
  private _cheerCount: number = 0;

  private _multiplierPenguins: Set<number> = new Set();
  private _multiplierCount: number = 0;
  private _countInterval: NodeJS.Timeout | null = null;

  private _room: WorldRoom;

  constructor(room: WorldRoom) {
    this._room = room;
    this.startIngredients();
  }

  get room() {
    return this._room;
  }
  
  get emote() {
    return this._currentEmote;
  }

  get cheerCount() {
    return this._cheerCount;
  }

  incrementCheer() {
    this._cheerCount++;
    this.sendBakeryState();
  
    // only if exact, in order to only start the timeout once
    if (this._cheerCount === Bakery.CHEER_CAPACITY) {
      // takes about 3 seconds to proceed
      setTimeout(() => {
        this.startMultiplier();
      }, 3000);
    }
  }

  updateMultiplierPenguins(): void {
    for (const [p, state] of this.room.getPlayerStates()) {
      if (state.x >= 610) {
        this._multiplierPenguins.add(p.id);
      } else {
        this._multiplierPenguins.delete(p.id);
      }
    }
  }

  startIngredients() {
    this._state = 'IngredientsStation';
    this._currentIngredient = 0;
    const magicIngredient = choose(Bakery.MAGIC_INGREDIENTS);
    const ingredients: Ingredient[] = [];
    const possibleIngredients: Ingredient[] = [magicIngredient, 'Milk', 'Eggs', 'Flour'];
    while (possibleIngredients.length > 0) {
      const i = randomInt(0, possibleIngredients.length - 1);
      ingredients.push(...possibleIngredients.splice(i, 1));
    }
    this._ingredients = ingredients;
    this.sendBakeryState();
  }

  startCheer() {
    this._state = 'CheerStation';
    this._cheerCount = 0;
    this._currentEmote = choose([1, 2, 7]);
    this.sendBakeryState();
  }

  startMultiplier() {
    this._state = 'MultiplierStation';
    this._multiplierCount = 9;
    this.updateMultiplierPenguins();
    this.sendBakeryState();

    this._countInterval = setInterval(() => {
      this._multiplierCount--;

      // use < 0 to give a full second before switching to next station
      if (this._multiplierCount < 0 && this._countInterval !== null) {
        clearInterval(this._countInterval);
        this.startReset();
      } else {
        this.updateMultiplierPenguins();
        this.sendBakeryState();
      }
    }, 1000);
  }

  startReset(): void {
    this._state = 'ResetStation';
    this.sendBakeryState();

    // estimate based on videos
    setTimeout(() => {
      this.startIngredients();
    }, 6000);
  }

  get currentIngredient() {
    return this._ingredients[this._currentIngredient];
  }

  nextIngredient() {
    this._currentIngredient++;
    this.sendBakeryState();
    if (this._currentIngredient >= this._ingredients.length) {
      this.startCheer();
    }
  }

  getMultiplier(): BakeryMultiplier {
    // none of these are confirmed values
    if (this._multiplierPenguins.size >= 10) {
      return 'Large';
    }
    if (this._multiplierPenguins.size >= 5) {
      return 'Medium';
    }
    return 'Small';
  }

  get bakeryState() {
    return JSON.stringify({
      CurrentStation: this._state,
      IngredientsStation: this._ingredients.map((ingredient, i) => {
        return {
          IngredientType: ingredient,
          // unknown if this total ever changed
          TotalRequired: 1,
          CurrentCount: this._currentIngredient > i ? 1 : 0
        }
      }),
      CheerStation: {
        CheerCapacity: Bakery.CHEER_CAPACITY,
        CurrentCheerCount: this.cheerCount,
        Emote: this.emote
      },
      MultiplierStation: {
        Counter: this._multiplierCount,
        Multiplier: this.getMultiplier()
      }
    })
  }

  sendBakeryState() {
    this.room.sendXt('barsu', this.bakeryState);
  }
}

export class WorldGame {
  constructor(private onAdd: ContextAdder<WorldGame>, private onRemove: ContextRemover, private id: number) {

  }

  public addPenguin(penguin: WorldPenguin) {
    this.onAdd(penguin.getClient(), this);
  }

  public removePenguin(penguin: WorldPenguin) {
    this.onRemove(penguin.getClient());
  }

  public getId() {
    return this.id;
  }

  public getCoinsFromScore(score: number): number {
    return isLiteralScoreGame(this.id) ? (
      Number(score)
    ) : (
      Math.floor(Number(score) / 10)
    );
  }

}

export abstract class WaddleGame {
  public abstract roomId: number;

  constructor(protected players: Array<WorldPenguin>, onAdd: ContextAdder<WaddleGame>, private onRemove: ContextRemover) {
    players.forEach(p => onAdd(p.getClient(), this));
  }

  public removePlayer(penguin: WorldPenguin): void {
    const index = this.players.indexOf(penguin);
    if (index !== -1) {
      this.players.splice(index, 1);
    }
    this.onRemove(penguin.getClient());
  }

  public getPlayerCount() {
    return this.players.length;
  }

  public getPlayers() {
    return [...this.players];
  }

  public sendXt(message: string, ...args: Array<string | number>): void {
    this.players.forEach(p => p.sendXt(message, ...args));
  }

  getSeatId(penguin: WorldPenguin): number {
    return this.players.indexOf(penguin);
  }
}

export class CardJitsuFire extends WaddleGame {
  public roomId = Room.CardJitsuFire;
}

export class SledRace extends WaddleGame {
 public roomId: number = 999;
}

export class Hand {
  private _canDrawCards: number[];
  private _cantDrawCards: number[];
  
  constructor(cards: number[]) {
    this._canDrawCards = [...cards];
    this._cantDrawCards = [];
  }

  draw(): number {
    const index = randomInt(0, this._canDrawCards.length - 1);
    const card = this._canDrawCards.splice(index, 1)[0];
    this._cantDrawCards.push(card);
    if (this._canDrawCards.length === 0) {
      this._canDrawCards = this._cantDrawCards;
      this._cantDrawCards = [];
    }
    return card;
  }
}

abstract class Ninja {
  /** Card currently chosen, using session ID */
  private _chosen: number | undefined;

  /** For all elements, map all the card's session IDs */
  private _scores: Record<CardElement, number[]>;

  private _seat: number;

  /** Reference to opponent ninja */
  private _opponent: Ninja | undefined;

  protected _game: CardJitsu;

  protected _cardsOnHand: number[];

  private _flawless: boolean;

  protected _blockedElement: CardElement | undefined;

  constructor(seat: number, game: CardJitsu) {
    this._seat = seat;
    this._scores = {
      'f': [],
      'w': [],
      's': []
    };

    this._game = game;
    this._cardsOnHand = [];
    this._flawless = true;
  }

  /**
   * Function to implement that handles what to do when drawing a new card
   * Receiving ID is Session ID of card, must return ID of the card-jitsu card
   */
  abstract onDraw(id: number): number;

  draw(id: number): number {
    this._cardsOnHand.push(id);
    return this.onDraw(id);
  }

  choose(id: number): void {
    this._chosen = id;
    this._cardsOnHand = this._cardsOnHand.filter(id => id !== id);
    this._game.sendXt('zm', CardJitsu.PICK_ACTION, this.seat, id);
  }

  unchoose(): void {
    this._chosen = undefined;
  }

  hasChosen(): boolean {
    return this._chosen !== undefined;
  }

  get chosen(): number {
    if (this._chosen === undefined) {
      throw new Error('Accessing chosen card but none are chosen!');
    }
    return this._chosen;
  }

  get scores(): Record<CardElement, number[]> {
    return this._scores;
  }

  get seat(): number {
    return this._seat;
  }

  set opponent(ninja: Ninja) {
    this._opponent = ninja;
  }

  get opponent(): Ninja {
    if (this._opponent === undefined) {
      throw new Error('Accessing opponent before it is initialized');
    }
    return this._opponent;
  }

  get otherSeat(): number {
    return this.opponent.seat;
  }

  score(element: CardElement, id: number): void {
    this._scores[element].push(id);
  }

  removeCards(cards: number[]): void {
    const toDiscard = new Set(cards);
    iterateEntries(this._scores, (element, cards) => {
      this._scores[element] = cards.filter((id) => !toDiscard.has(id));
    });
  }

  deal(amount: number) {
    const cards: string[] = [];
    for (let i = 0; i < amount; i++) {
      cards.push(this._game.draw(this));
    }

    this._game.sendXt('zm', CardJitsu.DEAL_ACTION, this.seat, ...cards);
  }

  get cards(): number[] {
    return this._cardsOnHand;
  }

  removeFlawless() {
    this._flawless = false;
  }

  get isFlawless() {
    return this._flawless;
  }

  blockElement(element: CardElement) {
    this._blockedElement = element;
  }

  unblockElement() {
    this._blockedElement = undefined;
  }

  hasCardsToPlay(): boolean {
    // the only condition for not being able to play is an element being blocked
    if (this._blockedElement === undefined) {
      return true;
    }
    for (const card of this._cardsOnHand) {
      const info = this._game.getCard(card);
      if (info.element !== this._blockedElement) {
        return true;
      }
    }

    return false;
  }
}

export class NinjaPlayer extends Ninja {
  private _player: WorldPenguin;

  private _hand: Hand;

  constructor(player: WorldPenguin, seat: number, game: CardJitsu) {
    super(seat, game);

    this._hand = new Hand(player.info.getDeck());
    this._player = player;
  }

  get player(): WorldPenguin {
    return this._player;
  }

  onDraw(id: number): number {
    return this._hand.draw();
  }
}

export class Sensei extends Ninja {
  private _unbeatable: boolean;

  /**
   * A map that takes session ID of cards from the opponent and session ID of cards Sensei has
   * indicating that when the opponent plays that card, Sensei must use this card to beat it
   * (only used in unbeatable mode)
   * */
  private _cardsToUse: Map<number, number>;

  constructor(game: CardJitsu, unbeatable: boolean) {
    super(0, game);
    this._unbeatable = unbeatable;
    this._cardsToUse = new Map<number, number>;
  }

  pickCard() {
    if (this._unbeatable) {
      // it's cheating time

      // NOTE: this is an unbeatable algorithm. But the original sensei seems to lose sometimes
      // even if he is unbeatable

      const cardToTuse = this._cardsToUse.get(this.opponent.chosen);
      if (cardToTuse === undefined) {
        throw new Error('Logic error: Sensei hasn\'t registered what card to use');
      }
      this.choose(cardToTuse);
    } else {
      // no criteria
      const canPlayCards = this._cardsOnHand.filter(id => {
        if (this._blockedElement) {
          return true;
        }
        const card = this._game.getCard(id);
        return card.element !== this._blockedElement;
      });
      this.choose(choose(canPlayCards));
    }
  }

  onDraw(id: number): number {
    if (this._unbeatable) {
      let unbeatableCard: number;

      const cardsWithoutCounter = this.opponent.cards.filter(id => {
        return !this._cardsToUse.has(id);
      });
      if (cardsWithoutCounter.length === 0) {
        // sensei must always draw after the opponent
        throw new Error('Logic error: Sensei is drawing a new card, but the opponent has no new card');
      }
      const cardToCounterId = cardsWithoutCounter[0]
      const cardToCounter = this._game.getCard(cardToCounterId);
      // finding a card that can beat this card.
      // if a cheater card, for now we will use the same card to make tie
      // otherwise, pick any card of opposite element
      if (cardToCounter.powerId in CardJitsu.REPLACEMENT_POWER_CARDS) {
        unbeatableCard = cardToCounter.id;
      } else {
        const winningElement = CardJitsu.RULES[CardJitsu.RULES[cardToCounter.element]];
        const card = choose(CARDS.rows.filter(card => card.element === winningElement));
        unbeatableCard = card.id;
      }
      this._cardsToUse.set(cardToCounterId, id);
      return unbeatableCard
    } else {
      return choose(CARDS.rows).id;
    }
  }
}

export class CardJitsu extends WaddleGame {
  public roomId = Room.CardJitsu;

  public name: WaddleName = 'card';

  private _cardId: number;

  private _ninjaSeats: [Ninja, Ninja];

  private _ninjas: Map<Client, NinjaPlayer>;

  private _cards: Map<number, Card>;

  /** If in Sensei fight */
  private _sensei: boolean;

  static DEAL_ACTION = 'deal';

  static PICK_ACTION = 'pick';

  static RULES: Record<CardElement, CardElement> = {
    'f': 's',
    'w': 'f',
    's': 'w'
  };

  static ON_PLAYED_POWER_CARDS = new Set([1, 16, 17, 18]);
  static SELF_EFFECT_POWER_CARDS = new Set([2]);
  static ELEMENT_BLOCK_POWER_CARDS: Record<number, CardElement | undefined> = {
    13: 's',
    14: 'f',
    15: 'w'
  };

  static REPLACEMENT_POWER_CARDS: Record<number, [CardElement, CardElement] | undefined> = {
    16: ['w', 'f'],
    17: ['s', 'w'],
    18: ['f', 's']
  };
  static COLOR_DISCARD_POWER_CARDS: Record<number, CardColor | undefined> = {
    7: 'r',
    8: 'b',
    9: 'g',
    10: 'y',
    11: 'o',
    12: 'p'
  };
  static ELEMENT_DISCARD_POWER_CARDS: Record<number, CardElement | undefined> = {
    4: 's',
    5: 'w',
    6: 'f'
  };

  /** Whether or not lowest value wins this round */
  private _swapValue: boolean = false;

  /** Number modifiers to apply in next score */
  private _valueModifier: [number, number] = [0, 0];

  constructor(players: WorldPenguin[], onAdd: ContextAdder<WaddleGame>, onRemove: ContextRemover) {    
    super(players, onAdd, onRemove);

    this._sensei = players.length === 1;
    this._ninjas = new Map<Client, NinjaPlayer>;

    const ninjas: Ninja[] = [];

    if (this._sensei) {
      const player = players[0];
      // 5 is estimate from research
      ninjas.push(new Sensei(this, player.info.ninjaProgress.senseiAttempts < 5));
    }

    players.forEach((p, i) => {
      const seat = this._sensei ? i + 1 : i;
      const ninja = new NinjaPlayer(p, seat, this);
      ninjas.push(ninja);
      this._ninjas.set(p, ninja);
    });

    // initializing
    ninjas.forEach((ninja, i) => {
      ninja.opponent = ninjas[(i + 1) % 2];
    });

    this._ninjaSeats = ninjas as [Ninja, Ninja];

    this._cardId = 0;
    this._cards = new Map<number, Card>();
  }

  get sensei() {
    return this._sensei;
  }

  /** Starts a match that is being started from matchmaking */
  startMatch() {
    const waddleRoom = new WaddleRoom(1000 + this.players[0].id, this.players.length, 'card');
    // const gameRoom = this.server.getRoom(this.roomId);
    
    const playerInfo = this.players.map(p => `${p.info.name}|${p.info.color}`);
    
    // gameRoom.waddles.set(waddleRoom.id, waddleRoom);
    
    this.players.forEach((p) => {
      // don't know what the 0 : 10 thing is for, and what the difference is
      p.sendXt('scard', this.roomId, waddleRoom.getId(), this._sensei ? 1 : this.players.length, this._sensei ? 0 : 10, ...playerInfo);
    });
  }

  draw(ninja: Ninja): string {
    this._cardId++;
    const card = ninja.draw(this._cardId) ?? -1;
    const cardInfo = CARDS.getStrict(card);
    this._cards.set(this._cardId, cardInfo);
    return `${this._cardId}|${[
      cardInfo.id,
      cardInfo.element,
      cardInfo.value,
      cardInfo.color,
      cardInfo.powerId
    ].join('|')}`;
  }

  chooseCard(ninja: NinjaPlayer, id: number): void {
    ninja.choose(id);
  }

  getNinja(player: Client): NinjaPlayer {
    const ninja = this._ninjas.get(player);
    if (ninja === undefined) {
      throw new Error('Client doesn\'t have a ninja');
    }
    return ninja
  }

  get swapEffect() {
    return this._swapValue;
  }

  /** Get card using session ID */
  getCard(id: number): Card {
    const card = this._cards.get(id);
    if (card === undefined) {
      throw new Error('Invalid card id');
    }
    return card;
  }

  private removeColorDuplicates(cards: number[]) {
    const colors = new Set<CardColor>();
    const noDuplicates: number[] = [];
    cards.forEach(card => {
      const color = this.getCard(card).color;
      if (!colors.has(color)) {
        noDuplicates.push(card);
        colors.add(color);
      }
    })
    return noDuplicates;
  }

  getWinningHand(): {
    seat: number;
    cards: number[];
    oneElement: boolean;
  } | undefined {
    let i = 0;
    for (const ninja of this._ninjaSeats) {

      // check for elemental win
      for (const [_, cards] of Object.entries(ninja.scores)) {
        const noDupe = this.removeColorDuplicates(cards);
        if (noDupe.length >= 3) {
          return {
            seat: i,
            cards: noDupe.slice(0, 3),
            oneElement: true
          }
        }
      }
  
      // check for all elements win
      const combos = Array.from(Object.values(ninja.scores).map(set => [...set])).reduce<number[][]>((acc, current) => {
        return acc.flatMap(a => current.map(b => [...a, b]));
      }, [[]]);
  
      for (const combo of combos) {
        const noDupes = this.removeColorDuplicates(combo);
        if (noDupes.length >= 3) {
          return {
            seat: i,
            cards: noDupes.slice(0, 3),
            oneElement: false
          }
        }
      }
  
      
      i++;
    }
    return undefined;
  }

  static getWinner(firstElement: CardElement, secondElement: CardElement, firstValue: number, secondValue: number) {
    if (firstElement === secondElement) {
      if (firstValue === secondValue) {
        return -1;
      } else {
        if (firstValue > secondValue) {
          return 0;
        } else {
          return 1;
        }
      }
    } else if (CardJitsu.RULES[firstElement] === secondElement) {
      return 0;
    } else {
      return 1;
    }
  }

  judgeWinner(): number {
    const cards = this._ninjaSeats.map((n) => n.chosen);
    const cardInfo = cards.map(id => this.getCard(id));
    const elements = cardInfo.map((c) => c.element);

    // applying element replacement from powercards
    cardInfo.forEach((card, i) => {
      const replacement = CardJitsu.REPLACEMENT_POWER_CARDS[card.powerId];
      if (replacement !== undefined) {
        const [original, target] = replacement;
        const other = (i + 1) % 2;
        if (elements[other] === original) {
          elements[other] = target;
        }
      }
    });
    const [firstElement, secondElement] = elements;

    // adding modifier from power cards
    let [firstValue, secondValue] = cardInfo.map((card, i) => card.value + this._valueModifier[i]);
    this._valueModifier = [0, 0];
    if (this._swapValue) {
      [firstValue, secondValue] = [secondValue, firstValue];
    }

    const winIndex = CardJitsu.getWinner(firstElement, secondElement, firstValue, secondValue);

    if (winIndex !== -1) {
      this._ninjaSeats[winIndex].score(cardInfo[winIndex].element, cards[winIndex]);
    }

    // resetting effects
    if (this._swapValue) {
      this._swapValue = false;
    }
    this._ninjaSeats.forEach(n => n.unblockElement());

    return winIndex;
  }

  setValueSwap() {
    this._swapValue = true;
  }

  alterModifier(seat: number, delta: number) {
    this._valueModifier[seat] += delta;
  }

  getNinjaBySeatIndex(index: number): Ninja {
    return this._ninjaSeats[index];
  }

  removePlayer(penguin: WorldPenguin) {
    // for when the player got stamps in older versions
    for (let i = 0; i <= penguin.info.ninjaProgress.rank; i++) {
      const stamp = CardJitsuProgress.STAMP_AWARDS[i];
      if (stamp !== undefined) {
        penguin.giveStamp(stamp);
      }
    }

    penguin.sendCardJitsuStampInfo();
    // client.leaveWaddleRoom();
  }

  setWinner(winnerSeat: number, ...winningCards: number[]) {
    // players are removed so that they don't get the "player quit" popup even though the game ended normally
    this.players.forEach(p => {
      this.removePlayer(p)
    });
    this.sendXt('czo', 0, winnerSeat, ...winningCards);
  }
}

type MatchedCallback = (players: WorldPenguin[]) => void;

type TickCallback = (players: WorldPenguin[], time: number) => void;

/**
 * Handles a room that will be used for making a match  of games that have queueing
 * */
class MatchmakingRoom {
  private _matchmaker: MatchMaker;
  private _players: WorldPenguin[];
  private _time = 0;
  private _timer: NodeJS.Timeout;

  constructor(matchmaker: MatchMaker) {
    this._matchmaker = matchmaker;
    this._players = [];
    this.resetTime();
    this._timer = setInterval(() => {
      this._matchmaker.onTick(this._players, this._time);
      this._time--;
      if (this._time < 0) {
        if (this._players.length >= 2) {
          this._matchmaker.onMatched(this._players);
          clearInterval(this._timer);
        } else {
          this.resetTime();
        }
      }
    }, 1000);
  }

  private resetTime() {
    this._time = 10;
  }

  addPlayer(player: WorldPenguin) {
    this._players.push(player);
  }

  get full() {
    return this._players.length === this._matchmaker.capacity;
  }
}

export class MatchMaker {
  /** Max number of players each match supports */
  private _maxPlayers: number;
  /** All rooms available */
  private _rooms: MatchmakingRoom[];
  /** Callback to run when a match is found */
  private _onMatched: MatchedCallback;
  /** Callback to run each second that ticks while matchmaking */
  private _onTick: TickCallback;

  constructor(max: number, onMatched: MatchedCallback, onTick: TickCallback) {
    this._maxPlayers = max;
    this._rooms = [];
    this._onMatched = onMatched;
    this._onTick = onTick;
  }

  get capacity() {
    return this._maxPlayers;
  }

  /** Add a player to matchmaking with others in the server */
  addPlayer(player: WorldPenguin) {
    const availableIndex = this._rooms.findIndex(room => !room.full);
    if (availableIndex === -1) {
      const room = new MatchmakingRoom(this);
      room.addPlayer(player);
      this._rooms.push(room);
    } else {
      const firstOnQueue = this._rooms[availableIndex];
      firstOnQueue.addPlayer(player);
    }
  }

  get onMatched() {
    return this._onMatched;
  }

  get onTick() {
    return this._onTick;
  }
}

export class World {
  private clients = new Map<WorldClient, ValidCtxObj<WorldContext>>();
  private penguins = new Map<number, WorldPenguin>();
  private rooms = new Map<number, WorldRoom>();
  private games = new Map<number, WorldGame>();
  private spectators = new Set<WorldPenguin>();
  private igloos = new Set<WorldPenguin>();
  private bakery = new Bakery(this.getRoom(853));
  
  // take this ugly thing away from my face at some point
  private matchmaker = new MatchMaker(2, (players) => {
    const game = this.getWaddleGame('card', players) as CardJitsu;
    game.startMatch();
  }, (players, time) => {
    const nicknames = players.map(p => p.info.name);
    players.forEach(p => p.sendXt('tmm', time, ...nicknames));
  });

  public get cardMatchmaker() {
    return this.matchmaker;
  }

  // create class responsible for the puck
  private _puckPosition = new Vector(0, 0);
  private _puckPositionParty = new Vector(0, 0);

  constructor(private gameData: GameData, private settings: SettingsManager, private db: JsonDatabase) {
    this.init();
  }

  public get data() {
    return this.gameData;
  }

  public getSettings() {
    return this.settings;
  }

  public getDb() {
    return this.db;
  }

  public getRoom(id: number): WorldRoom {
    let room = this.rooms.get(id);
    if (room === undefined) {
      room = new WorldRoom((c, e) => this.addContext(c, 'room', e as WorldRoom), (c) => this.removeContext(c, 'room'), id);
      this.rooms.set(id, room);
    }
    return room;
  }

  public addPenguin(penguin: WorldPenguin): void {
    this.penguins.set(penguin.id, penguin);
    this.addContext(penguin.getClient(), 'penguin', penguin);
  }

  public getContext(client: WorldClient): ValidCtxObj<WorldContext> | null {
    return this.clients.get(client) ?? null;
  }

  private addContext<T extends keyof WorldContext & string>(client: WorldClient, name: T, entity: WorldContext[T]) {
    let ctx = this.clients.get(client);
    if (ctx === undefined) {
      ctx = {};
      this.clients.set(client, ctx);
    }
    ctx[name] = entity;
  }

  private removeContext<T extends keyof WorldContext & string>(client: WorldClient, name: T) {
    const ctx = this.clients.get(client);
    if (ctx !== undefined) {
      ctx[name] = undefined;
    }
  }

  public getPenguin(id: number): WorldPenguin | undefined {
    return this.penguins.get(id);
  }

  public getGame(id: number): WorldGame {
    let game = this.games.get(id);
    if (game === undefined) {
      game = new WorldGame((c, e) => this.addContext(c, 'game', e), (c) => this.removeContext(c, 'game'), id);
      this.games.set(id, game);
    }
    return game;
  }

  public disconnect(client: WorldClient): void {



    const context = this.getContext(client) ?? {};
    const { room, penguin } = context;
    if (room !== undefined && penguin !== undefined) {
      room.removePenguin(penguin);
    }
    if (penguin !== undefined) {
      if (penguin.isAgentPending()) {
        penguin.addItem(800);
      }
      if (room !== undefined) {
        const table = room.getPenguinTable(penguin);
        if (table !== null) {
          const seat = table.getSeatIndex(penguin);
          if (seat !== WorldTable.TABLE_SPECTATOR_SEAT && seat !== undefined) {
            if (table.hasStarted() && table.hasJoined(seat)) {
              table.sendXt('cz', penguin.info.name);
              table.resetRound();
              room.sendTableState(table);
            } else {
              table.removePlayer(penguin);
              const count = table.getCount();
              room.sendTableState(table);
              if (count === 0) {
                table.reset();
              }
            }
          }
          
        }
      }
  
    penguin.info.getBuddies().forEach((buddyId) => {
      const buddyClient = this.getPenguin(buddyId);
      if (buddyClient !== undefined) {
        this.sendBuddyOnlineList(buddyClient, penguin.id);
      }
    });

      const delta = Date.now() - penguin.sessionStart;
      const minutesDelta = delta / 1000 / 60;
      penguin.info.incrementPlayTime(minutesDelta);
      penguin.info.update();
      this.penguins.delete(penguin.id);
    }

    this.clients.delete(client);
    client.end();
  }

  public init() {
    const extraWaddleRooms = this.gameData.getExtraWaddleRooms();
    [...WADDLE_ROOMS, ...extraWaddleRooms].forEach((waddle) => {
      const room = this.getRoom(waddle.roomId);
      room.addWaddle(waddle.waddleId, new WaddleRoom(waddle.waddleId, waddle.seats, waddle.game));
    });

    // TODO this
    this._puckPosition = new Vector(0, 0);
    this._puckPositionParty = new Vector(0, 0);
  }

  public getWaddleGame(name: WaddleName, players: WorldPenguin[]): WaddleGame {
    let game: WaddleGame;

    switch (name) {
      case 'card':
        game = new CardJitsu(players, (c, e) => this.addContext(c, 'card', e as CardJitsu), (c) => this.removeContext(c, 'card'));
        break;
      case 'fire':
        game = new CardJitsuFire(players, (c, e) => this.addContext(c, 'fire', e as CardJitsuFire), (c) => this.removeContext(c, 'fire'));
        break;
      case 'sled':
        game = new SledRace(players, (c, e) => this.addContext(c, 'sled', e as SledRace), (c) => this.removeContext(c, 'sled'));
        break;
      default:
        throw new Error('No waddle game constructor set');
    }

    return game;
  }

  public formatBuddyEntry(id: number, includeOnlineFlag: boolean): string {
    const name = Penguin.getById(id)?.name ?? this.penguins.get(id)?.info.name ?? 'Unknown';
    if (!includeOnlineFlag) {
      return `${id}|${name}`;
    }
    const online = this.penguins.get(id) !== undefined;
    return online ? `${id}|${name}|1` : `${id}|${name}`;
  }

  public handleGetBuddies(penguin: WorldPenguin) {
    // TODO currently pre-cpip only
    if (!this.gameData.isPreCpip()) {
      return;
    }
    const buddies = penguin.info.getBuddies()
      .map((id) => this.formatBuddyEntry(id, true));
    if (buddies.length === 0) {
      penguin.sendXtEmptyLast('gb');
      return;
    }
    penguin.sendXt('gb', ...buddies);
  }

  public removeSpectator(penguin: WorldPenguin) {
    return this.spectators.delete(penguin);
  }

  public handleGetBuddyOnlineList(penguin: WorldPenguin) {
    if (!this.gameData.isPreCpip()) {
      return;
    }
    const onlineIds = penguin.info.getBuddies().filter((id) => this.penguins.get(id) !== undefined);
    if (onlineIds.length === 0) {
      penguin.sendXtEmptyLast('go');
      return;
    }
    penguin.sendXt('go', ...onlineIds);
  };

  public sendBuddyOnlineList(penguin: WorldPenguin, excludeId?: number): void {
    const onlineIds = penguin.info.getBuddies().filter((id) => {
      if (excludeId !== undefined && id === excludeId) {
        return false;
      }
      return this.penguins.get(id) !== undefined;
    });
    penguin.sendXt('go', ...onlineIds);
  }

  // maybe a class for managing open igloos 
  public openIgloo(penguin: WorldPenguin) {
    this.igloos.add(penguin);
  }

  public closeIgloo(penguin: WorldPenguin) {
    this.igloos.delete(penguin);
  }

  public getOpenIglooPlayers() {
    return [...this.igloos.values()];
  }

  public getBakery() {
    return this.bakery;
  }

  public getPuckPosition() {
    return this._puckPosition.vector;
  }

  public getPuckPositionParty() {
    return this._puckPositionParty.vector;
  }
}

export class WorldContext {
  'world': World;
  'penguin': WorldPenguin;
  'room': WorldRoom;
  'game': WorldGame;
  'card': CardJitsu;
  'fire': CardJitsuFire;
  'sled': SledRace;
}