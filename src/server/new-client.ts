import { Igloo, IglooFurniture, JsonDatabase } from "./database";
import { isLiteralScoreGame } from "./game-logic/rooms";
import { logverbose } from "./logger";
import { Penguin } from "./penguin";
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

  constructor(private client: WorldClient, private penguin: Penguin, private gameData: GameData, private settings: SettingsManager) {

  }

  public sendXt(message: string, ...args: Array<string | number>): void {
    this.client.sendXt(message, ...args);
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

export class WorldRoom extends WorldEntity {
  private penguins = new Map<WorldPenguin, RoomState>();

  constructor(onAdd: ContextAdder<WorldEntity>, onRemove: ContextRemover, private id: number) {
    super(onAdd, onRemove);
  }

  public getPlayers(): string[] {
    return [...this.penguins.entries()].map(([penguin, info]) => {
      return penguin.getString(info);
    });
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

export class World {
  private clients = new Map<WorldClient, ValidCtxObj<WorldContext>>();
  private penguins = new Map<number, WorldPenguin>();
  private rooms = new Map<number, WorldRoom>();
  private games = new Map<number, WorldGame>();

  constructor(private gameData: GameData, private settings: SettingsManager, private db: JsonDatabase) {}

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
}

export class WorldContext {
  'world': World;
  'penguin': WorldPenguin;
  'room': WorldRoom;
  'game': WorldGame;
}