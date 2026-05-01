import { JsonDatabase } from "./database";
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

  constructor(private client: WorldClient, private penguin: Penguin, private gameData: GameData, private settings: SettingsManager) {

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
    // this.sendXt('jr', room, ...this.room.players.map((client) => client.penguinString));
    this.sendXt('ap', string);
    // this.sendRoomXt('ap', string);
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
}

export class World {
  private clients = new Map<WorldClient, ValidCtxObj<WorldContext>>();

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

  private rooms = new Map<number, WorldRoom>();
  
  public getRoom(id: number): WorldRoom {
    let room = this.rooms.get(id);
    if (room === undefined) {
      room = new WorldRoom((c, e) => this.addContext(c, 'room', e as WorldRoom), (c) => this.removeContext(c, 'room'), id);
      this.rooms.set(id, room);
    }
    return room;
  }

  public addPenguin(penguin: WorldPenguin): void {
    console.log('Yep!, time to add the penguin ', penguin.id);
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
}

export class WorldContext {
  'world': World;
  'penguin': WorldPenguin;
  'room': WorldRoom;
}