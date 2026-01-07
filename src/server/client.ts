import net from 'net';

import db, { Databases, Igloo, IglooFurniture, PenguinData } from './database';
import { Settings, SettingsManager } from './settings';
import { DefaultPenguinParams, Penguin, PenguinEquipmentSlot } from './penguin';
import { isGreaterOrEqual, isLower, processVersion, Version } from './routes/versions';
import { getCost, Item, ITEMS, ItemType } from './game-logic/items';
import { isFlag } from './game-logic/flags';
import PuffleLaunchGameSet from './game-logic/pufflelaunch';
import { isGameRoom, isLiteralScoreGame, Room } from './game-logic/rooms';
import { PUFFLES } from './game-logic/puffle';
import { findInVersion, findInVersionStrict } from './game-data';
import { WaddleName, WADDLE_ROOMS } from './game-logic/waddles';
import { choose, randomInt, Vector } from '../common/utils';
import { logverbose } from './logger';
import { CardJitsuProgress } from './game-logic/ninja-progress';
import { getExtraWaddleRooms } from './timelines/waddle-room';
import { VERSIONS_TIMELINE } from './routes/version.txt';
import { GAME_STAMPS_TIMELINE, STAMP_DATES } from './timelines/stamps';
import { CPIP_UPDATE, isEngine1, isEngine2, isEngine3, STAMPS_RELEASE } from './timelines/dates';
import { CLIENT_ITEMS_TIMELINE } from './timelines/client-items';
import { CFC_VALUES_TIMELINE, COINS_FOR_CHANGE_TIMELINE } from './timelines/cfc';
import { MASCOTS } from './game-data/mascots';
import { Table } from './handlers/play/table';
import { FindFourTable } from './handlers/play/find-four';
import { MancalaTable } from './handlers/play/mancala';

type ServerType = 'Login' | 'World';

/** Maps the slot name to what it's called in the packets */
export const EQUIP_SLOT_MAPPINGS: Record<PenguinEquipmentSlot, string> = {
  color: 'c',
  head: 'h',
  face: 'f',
  neck: 'n',
  body: 'b',
  hand: 'a',
  feet: 'e',
  pin: 'l',
  background: 'p'
}

/** Manages the players waiting to join a Waddle Game */
export class WaddleRoom {
  /** Number of players the game supports */
  private _seats: number;
  /** Array with all the players sitting, or null if empty slot */
  private _players: Array<Client | null>;
  /** Id in the server */
  private _id: number;
  /** Identify the type of game logic that handles this game */
  private _game: WaddleName;

  constructor(id: number, seats: number, game: WaddleName) {
    this._id = id;
    this._seats = seats;
    this._players = this.getEmptyPlayers();
    this._game = game;
  }

  /** Get array with empty players */
  private getEmptyPlayers(): null[] {
    const players: null[] = [];
    for (let i = 0; i < this._seats; i++) {
      players.push(null);
    }
    return players;
  }

  addPlayer(client: Client): number {
    let seatIndex: number | undefined = undefined;
    for (let i = 0; i < this._seats; i++) {
      if (this._players[i] === null) {
        this._players[i] = client;
        seatIndex = i;
        break;
      }
    }
    if (seatIndex === undefined) {
      throw new Error('Tried adding a player to a waddle room, but thre were no slots left');
    }
    return seatIndex;
  }

  removePlayer(client: Client): void {
    for (let i = 0; i < this._seats; i++) {
      if (this._players[i] === client) {
        this._players[i] = null;
        break;
      }
    }
  }

  resetWaddle(): void {
    this._players = this.getEmptyPlayers();
  }

  get players(): Client[] {
    return this._players.filter((p): p is Client => p !== null);
  }

  /** Array of the players in each seat */
  get seats(): Array<Client | null> {
    return [...this._players];
  }

  /** Number of players */
  get size(): number {
    return this._players.length;
  }
  
  get id(): number {
    return this._id;
  }

  get game() {
    return this._game;
  }
}

type MatchedCallback = (players: Client[]) => void;

type TickCallback = (players: Client[], time: number) => void;

/**
 * Handles a room that will be used for making a match  of games that have queueing
 * */
class MatchmakingRoom {
  private _matchmaker: MatchMaker;
  private _players: Client[];
  private _time = 0;
  private _timer: NodeJS.Timer

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

  addPlayer(player: Client) {
    this._players.push(player);
  }

  get full() {
    return this._players.length === this._matchmaker.capacity;
  }
}

/** Handles matchmaking in a server */
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
  addPlayer(player: Client) {
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

/** Interface for a multiplayer "waddle" game */
export abstract class WaddleGame {
  /** Room used for the game */
  public abstract roomId: number;
  
  /** Identify what type of game it is */
  public abstract name: WaddleName;

  private _players: Client[]

  constructor(players: Client[]) {
    this._players = players;
  }

  start() {
    this._players.forEach((p) => p.joinRoom(this.roomId));
  }

  get seats(): number {
    return this._players.length;
  }

  get players(): Client[] {
    return this._players;
  }

  getSeatId(client: Client): number {
    return this._players.indexOf(client);
  }

  /** Send XT message to every player in the game */
  sendXt(code: string, ...args: Array<number | string>) {
    this._players.forEach(p => p.sendXt(code, ...args));
  }

  removePlayer(client: Client): void {
    const index = this._players.indexOf(client);
    if (index !== -1) {
      this._players.splice(index, 1);
    }
  }
}

/** Information of a player that only persists during a room */
type PlayerRoomInfo = {
  x: number;
  y: number;
  frame: number;
};

/** Represents a room of a server */
class GameRoom {
  private _players: Map<Client, PlayerRoomInfo>;
  private _id: number;
  private _bots: BotGroup;
  /** Waddle rooms hosted inside this room */
  private _waddles: Map<number, WaddleRoom>;

  constructor(id: number, server: Server) {
    this._players = new Map<Client, PlayerRoomInfo>();
    this._id = id;
    this._bots = new BotGroup(server);
    this._waddles = new Map<number, WaddleRoom>();
  }

  /** Get info of player */
  getPlayer(client: Client): PlayerRoomInfo | undefined {
    return this._players.get(client);
  }

  /** Add a player to the room */
  addPlayer(player: Client) {
    this._players.set(player, {
      x: 0,
      y: 0,
      frame: 1
    });
  }

  /** Remove player from room */
  removePlayer(player: Client) {
    this._players.delete(player);
  }

  /** Get players in room */
  get players(): Client[] {
    return Array.from(this._players.keys());
  }

  get id(): number {
    return this._id;
  }

  get botGroup(): BotGroup {
    return this._bots;
  }

  get waddles() {
    return this._waddles;
  }

  getWaddleRoom(id: number) {
    const room = this._waddles.get(id);
    if (room === undefined) {
      throw new Error('Trying to get waddle room that doesn\'t exist');
    }
    return room;
  }

  getWaddleRooms() {
    return Array.from(this._waddles.values());
  }

  sendXt(handler: string, ...args: Array<string | number>) {
    this.players.forEach((client) => client.sendXt(handler, ...args));
  }
}

/** Map of the waddle games and their constructors */
type WaddleConstructors = Record<WaddleName, new (players: Client[]) => WaddleGame>;

// track which buddy packet namespace a client uses: chat291-339 "s" vs chat506 "b"
type BuddyProtocol = 's' | 'b';

type BakeryState = 'IngredientsStation' | 'CheerStation' | 'MultiplierStation' | 'ResetStation';
type BakeryMultiplier = 'Small' | 'Medium' | 'Large';
type Ingredient = 'Candy' | 'Eggs' | 'Flour' | 'Milk' | 'Tire' | 'Hay';

/** Controls the holiday party 2012 bakery room */
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
  private _countInterval: NodeJS.Timer | null = null;

  private _server: Server;

  constructor(server: Server) {
    this._server = server;
    this.startIngredients();
  }

  get room() {
    return this._server.getRoom(853);
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
    this.room.players.forEach((client) => {
      // rough estimate, not sure how the original did it
      if (client.x >= 610) {
        this._multiplierPenguins.add(client.penguin.id);
      } else {
        this._multiplierPenguins.delete(client.penguin.id);
      }
    });
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

/** Manages a gameplayer server */
export class Server {
  /** All multiplayer rooms */
  private _rooms: Map<number, GameRoom>

  private _cardMatchmaking: MatchMaker | undefined;

  /** Map of all open igloos, penguin ID to their igloo */
  private _igloos: Map<number, Igloo>;

  /** All clients mapped out by their penguin's ID */
  private _playersById: Map<number, Client>;

  /** Server's settings */
  private _settingsManager: SettingsManager;

  private _botId = 0;

  private _followers: Map<Client, Bot[]>;

  private _waddleConstructors: WaddleConstructors | undefined;

  private _buddyProtocol: BuddyProtocol | undefined;

  private _bakery: Bakery;

  private _tables: Map<number, Table>;
  
  static MANCALA_TABLE_IDS = new Set([100, 101, 102, 103, 104]);
  static FIND_FOUR_TABLE_IDS = new Set([200, 201, 202, 203, 204, 205, 206, 207]);

  constructor(settings: SettingsManager) {
    this._settingsManager = settings;
    this._rooms = new Map<number, GameRoom>();
    this._igloos = new Map<number, Igloo>();
    this._playersById = new Map<number, Client>();
    this._followers = new Map<Client, Bot[]>();
    this._bakery = new Bakery(this);
    this._tables = new Map<number, Table>();
    this.createMascots();
    this.init();
  }

  private init() {
    const extraWaddleRooms = getExtraWaddleRooms(this.settings.version) ?? [];
    [...WADDLE_ROOMS, ...extraWaddleRooms].forEach((waddle) => {
      const room = this.getRoom(waddle.roomId);
      room.waddles.set(waddle.waddleId, new WaddleRoom(waddle.waddleId, waddle.seats, waddle.game));
    });
    this.setBuddyProtocol();
  }

  setBuddyProtocol() {
    if (isEngine1(this._settingsManager.settings.version)) {
      const chat = findInVersionStrict(this._settingsManager.settings.version, VERSIONS_TIMELINE);
      this._buddyProtocol = chat >= 506 ? 'b' : 's';
    } else {
      // buddies for post-cpip not yet defined
      this._buddyProtocol = undefined;
    }
  }

  get buddyProtocol() {
    return this._buddyProtocol;
  }

  get cardMatchmaking(): MatchMaker {
    if (this._cardMatchmaking === undefined) {
      throw new Error('Attempting to get card match making before it was initialized');
    }
    return this._cardMatchmaking;
  }

  get settings(): Settings {
    return this._settingsManager.settings;
  }

  reset(): void {
    for (const player of this._playersById.values()) {
      player.disconnect();
    }
    this._rooms = new Map<number, GameRoom>();
    this._igloos = new Map<number, Igloo>();
    this._playersById = new Map<number, Client>();
    this._followers = new Map<Client, Bot[]>();
    this.init();
  }

  setCardMatchmaker(matchMaker: MatchMaker) {
    this._cardMatchmaking = matchMaker;
  }

  setWaddleGame(waddleRoom: WaddleRoom, game: WaddleGame): void {
    const players = waddleRoom.players;
    players.forEach(p => p.setWaddleGame(game));
  }

  /** Assign client object to a penguin ID */
  trackPlayer(id: number, client: Client): void {
    this._playersById.set(id, client);
  }

  /** Retrieve an online player by penguin ID */
  getPlayerById(id: number): Client | undefined {
    return this._playersById.get(id);
  }

  /** Remove a player from the online map */
  untrackPlayer(id: number): void {
    this._playersById.delete(id);
  }
  getPenguinFromName (name: string): Penguin {
    let data = db.get<PenguinData>(Databases.Penguins, 'name', name);
    const date = this.getVirtualDate(0).getTime();

    if (data === undefined) {
      data = Client.create(capitalizeName(name), {
        is_member: true,
        virtualRegistrationTimestamp: date
      });
    }

    
    const [penguinData, id] = data;
    
    // fixing time traveling backwards
    if (date < penguinData.virtualRegistrationTimestamp) {
      penguinData.virtualRegistrationTimestamp = date;
    }
    return new Penguin(id, penguinData);
  }

  /** Make an igloo open */
  openIgloo(id: number, igloo: Igloo): void {
    this._igloos.set(id, igloo);
  }

  /** Close an igloo */
  closeIgloo(id: number): void {
    this._igloos.delete(id);
  }

  /** Get igloo from someone's ID */
  getIgloo(id: number): Igloo {
    const igloo = this._igloos.get(id);
    if (igloo === undefined) {
      throw new Error(`Invalid penguin id for igloo: ${id}`);
    }
    return igloo;
  }

  /** Get all players with an open igloo */
  getOpenIglooPlayers(): Client[] {
    const players: Client[] = [];
    Array.from(this._igloos.keys()).forEach((id) => {
      const client = this._playersById.get(id);
      if (client !== undefined) {
        players.push(client);
      }
    });

    return players;
  }

  getNewBotId(): number {
    this._botId++;
    return this._botId;
  }

  getRoom(roomId: number): GameRoom {
    let room = this._rooms.get(roomId);
    if (room === undefined) {
      room = new GameRoom(roomId, this);
      this._rooms.set(roomId, room);
    }
    return room;
  }

  getTable(tableId: number, roomId: number): Table {
    let table = this._tables.get(tableId);
    if (table === undefined) {
      if (Server.FIND_FOUR_TABLE_IDS.has(tableId)) {
        table = new FindFourTable(tableId, roomId, this);
      } else if (Server.MANCALA_TABLE_IDS.has(tableId)) {
        table = new MancalaTable(tableId, roomId, this);
      } else {
        throw new Error('Unknown table id');
      }

      this._tables.set(tableId, table);
    } else {
      table.updateRoom(roomId);
    }
    return table;
  }

  getTableIfExists(tableId: number): Table | undefined {
    return this._tables.get(tableId);
  }

  getTables() {
    return this._tables.entries();
  }

  addFollower(bot: Bot, following: Client) {
    let prev = this._followers.get(following);
    if (prev === undefined) {
      prev = [];
    }
    prev.push(bot);
    this._followers.set(following, prev);
  }

  getFollowers(player: Client): Bot[] {
    return this._followers.get(player) ?? [];
  }

  getVirtualDate(offset: number): Date {
    const [year, month, day] = processVersion(this.settings.version);
    // simulating PST time for the current day
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    // date generates this time thinking in the same timezone as the user
    // an arbitrary offset may be applied depending on how each client behaves
    return new Date(year, month - 1, day, hour + offset, minute, second);
  }


  get waddleConstructors() {
    if (this._waddleConstructors === undefined) {
      throw new Error('Have not initialized Waddle Games');
    }
    return this._waddleConstructors;
  }

  set waddleConstructors(value: WaddleConstructors) {
    this._waddleConstructors = value;
  }

  getItemsFiltered(items: number[]) {
    // pre-cpip engines have limited items, after
    // that global_crumbs allow having all the items
    if (isLower(this.settings.version, CPIP_UPDATE)) {
      const itemSet = findInVersionStrict(this.settings.version, CLIENT_ITEMS_TIMELINE)
      return items.filter((value) => itemSet.has(value));
    } else {
      return items;
    }
  }

  getAllPlayersInfo() {
    const players: Array<{ name: string; id: number; }> = [];
    this._playersById.forEach((client, id) => {
      players.push({
        id,
        name: client.penguin.name
      });
    });

    return players;
  }

  get bakery() {
    return this._bakery;
  }

  createMascots() {
    MASCOTS.forEach(mascot => {
      let penguin = Penguin.getById(mascot.id);
      if (penguin === undefined) {
        penguin = Penguin.add(mascot.id, Penguin.getDefaultData(mascot.name));
      }
      mascot.starterItems.forEach(i => {
        penguin?.addItem(i);
      });
    })
  }
}

function capitalizeName(name: string): string {
  return name.split(' ').map((name => {
    return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
  })).join(' ');
}

export class Client {
  private _socket: net.Socket | undefined;
  /** Reference to the server */
  private _server: Server;
  protected _penguin: Penguin | undefined;

  /** Instance of waddle game, if playing, or null otherwise */
  private _waddleGame: WaddleGame | null;

  /** Current Waddle Room, if it exists */
  private _currentWaddleRoom: WaddleRoom | undefined;

  /** Reference to the room the player is in */
  private _currentRoom: GameRoom | undefined;
  /** Reference to the player's information stored in the room */
  private _roomInfo: PlayerRoomInfo | undefined;
  private _avatar: number = 0;

  private _tableState: { id: number; seat: number } | undefined;

  sessionStart: number;
  serverType: ServerType
  handledXts: Map<string, boolean>

  /**
   * Map XT names to the timestamp of the next time you're allowed to call them
   * 
   * This is used to enforce cooldown on packets
   */
  xtTimestamps: Map<string, number>

  /**
   * Temporary variable to keep track of stamps collected used to know
   * which ones someone collected when ending a game
   */
  sessionStamps: number[];

  /** ID of puffle that player is walking */
  walkingPuffle: number;

  /** Keep track of all the puffle colors used to dig in this session */
  private _puffleColorsDug = new Set<number>();

  // when digging gold nuggets for golden puffle
  private _isGoldNuggetState = false;

  private _specialName: string | null = null;

  constructor (server: Server, socket: net.Socket | undefined, type: ServerType) {
    this._server = server;
    this._socket = socket;
    this.serverType = type;
    this._waddleGame = null;
    this.sessionStart = Date.now();
    
    this.sessionStamps = [];
    this.walkingPuffle = NaN;

    // For "only once" listeners
    this.handledXts = new Map<string, boolean>();

    this.xtTimestamps = new Map<string, number>();
  }

  public get version(): Version {
    return this.server.settings.version;
  }

  get settings(): Settings {
    return this.server.settings;
  }

  hasPenguin(): boolean {
    return this._penguin !== undefined;
  }

  get penguin(): Penguin {
    return this._penguin ?? (() => { throw new Error('Getting penguin before initializing'); })();
  }

  get socket(): net.Socket {
    return this._socket ?? (() => { throw new Error('Getting socket before initializing'); })();
  }

  get isBot(): boolean {
    return this._socket === undefined;
  }

  async send (message: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._socket?.write(message + '\0', (err) => {
        if (err !== undefined) {
          reject(err);
        }
        resolve();
      });
    });
  }

  private getXtMessage(emptyLast: boolean, handler: string, ...args: Array<number | string>): string {
    return `%xt%${handler}%-1%` + args.join('%') + (emptyLast ? '' : '%');
  }

  /** Send message but the last XT arg is not empty. Some handlers need this apparently */
  sendXtEmptyLast(handler: string, ...args: Array<number | string>): void {
    this.send(this.getXtMessage(true, handler, ...args));
  }

  async sendXt (handler: string, ...args: Array<number | string>): Promise<void> {
    logverbose('\x1b[32mSending XT:\x1b[0m ', handler, args);
    await this.send(this.getXtMessage(false, handler, ...args));
  }

  static engine1Crumb (penguin: Penguin, roomInfo: {
    x: number,
    y: number,
    frame: number
  } = { x: 0, y: 0, frame: 0 }): string {
    const { x, y, frame } = roomInfo;
    return [
      penguin.id,
      penguin.name,
      penguin.color,
      penguin.head,
      penguin.face,
      penguin.neck,
      penguin.body,
      penguin.hand,
      penguin.feet,
      penguin.pin,
      penguin.background,
      x, // X
      y, // y
      frame, // TODO frame
      penguin.isMember ? 1 : 0
    ].join('|')
  }

  get x(): number {
    return this._roomInfo?.x ?? 0;
  }

  private updateRoomInfo(info: Partial<PlayerRoomInfo>) {
    if (this._roomInfo !== undefined) {
      for (const [key, value] of Object.entries(info)) {
        this._roomInfo[key as keyof PlayerRoomInfo] = value;
      }
    }
  }

  get y(): number {
    return this._roomInfo?.y ?? 0;
  }

  get frame(): number {
    return this._roomInfo?.frame ?? 1;
  }

  get penguinString (): string {
    if (isEngine1(this.version)) {
      return Client.engine1Crumb(this.penguin, { x: this.x, y: this.y, frame: this.frame });
    } else {
      return [
        this.penguin.id,
        this.name,
        1, // meant to be approval, but always approved, TODO: non approved names in the future
        this.penguin.color,
        this.penguin.head,
        this.penguin.face,
        this.penguin.neck,
        this.penguin.body,
        this.penguin.hand,
        this.penguin.feet,
        this.penguin.pin,
        this.penguin.background,
        this.x,
        this.y,
        this.frame,
        this.penguin.isMember ? 1 : 0,
        this.memberAge,
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

  get server(): Server {
    return this._server;
  }

  get age (): number {
    // difference converted into days
    return Math.floor((this.server.getVirtualDate(0).getTime() - this.penguin.virtualRegistration) / 1000 / 86400);
  }

  get memberAge (): number {
    // TODO implement proper for this, if ever needed
    return this.age;
  }

  get room(): GameRoom {
    if (this._currentRoom === undefined) {
      throw new Error('Player is not in a room');
    }
    return this._currentRoom;
  }

  get followers(): Bot[] {
    return this.server.getFollowers(this);
  }

  setPosition(x: number, y: number) {
    this.updateRoomInfo({ x, y, frame: 1 });
    this.sendRoomXt('sp', this.penguin.id, x, y);

    this.followers.forEach(bot => bot.followPosition(x, y));
  }

  setFrame(frame: number) {
    this.updateRoomInfo({ frame });
    this.sendRoomXt('sf', this.penguin.id, frame);

    this.followers.forEach(bot => bot.setFrame(frame));
  }

  /** Send a XT message to all players in a room */
  sendRoomXt(handler: string, ...args: Array<string | number>) {
    this.room.sendXt(handler, ...args);
  }

  /** Check if playing a waddle game */
  isInWaddleGame(): boolean {
    return this._waddleGame !== null;
  }

  /** Send a XT message to all players in waddle game */
  sendWaddleXt(handler: string, ...args: Array<string | number>) {
    const players = this.waddleGame.players;
    players.forEach((p) => p.sendXt(handler, ...args));
  }

  leaveRoom(): void {
    const players = this.room.players.filter((p) => p.penguin.id !== this.penguin.id);
    // because minigames get the player from their previous room, you can't
    // send the remove player packet to the player leaving otherwise it won't
    // find itself and minigame features (the penguin color) won't work
    this.room.removePlayer(this);
    this.sendRoomXt('rp', this.penguin.id, ...players.map((p) => p.penguinString));
  }

  joinRoom (room: number, x?: number, y?: number): void {
    // leaving previous room
    if (this._currentRoom !== undefined) {
      this.leaveRoom();
    }
    this._currentRoom = this._server.getRoom(room);
    if (isGameRoom(room)) {
      this._roomInfo = undefined;
      this.sendXt('jg', room);
    } else {
      this.room.addPlayer(this);
      this._roomInfo = this.room.getPlayer(this);
      const xx = x ?? 0;
      const yy = y ?? 0;
      this.updateRoomInfo({ x: xx, y: yy });
      const string = this.penguinString;
      this.sendXt('jr', room, ...this.room.players.map((client) => client.penguinString));
      this.sendRoomXt('ap', string);
      // it seems that the new x, y position of players must be sent via a new set position packet
      this.setPosition(xx, yy);

      this.followers.forEach(bot => {
        bot.joinRoom(room, x, y)
        bot.followPosition(xx, yy);
      });
    }
  }

  update (): void {
    if (!this.isBot) {
      this.penguin.update()
    }
  }

  private checkSpecialName() {
    if (this._penguin !== undefined) {
      const mascot = MASCOTS.find(m => this._penguin?.id === m.id);
      if (mascot?.display !== undefined) {
        this._specialName = mascot.display;
      }
    }
  }

  setPenguinFromName (name: string): void {
    this._penguin = this.server.getPenguinFromName(name)
    this.checkSpecialName();

    this._server.trackPlayer(this.penguin.id, this);
  }

  setPenguinFromId (id: number): void {
    const data = db.getById<PenguinData>(Databases.Penguins, id);
    const penguin = data;
    if (penguin === undefined) {
      throw new Error(`Could not find penguin of ID ${id}`);
    }
    this._penguin = new Penguin(id, penguin);
    this.checkSpecialName();
    this._server.trackPlayer(id, this);
  }

  static create (name: string, params: DefaultPenguinParams = {}): [PenguinData, number] {
    const defaultPenguin = Penguin.getDefault(0, name, params).serialize();
    return db.add<PenguinData>(Databases.Penguins, {
      ...defaultPenguin,
      name,
      mascot: 0
    });
  }

  canBuy (item: number): boolean {
    // TODO
    return true;
  }

  getCost(item: Item) {
    return getCost(item, this.version);
  }

  /**
   * Add a new item to a player
   * @param itemId
   * @param params.free If it should be free (default false)
   * @param params.notify Whether or not to notify the client (default false)
   */
  buyItem (itemId: number, params: { free?: boolean, notify?: boolean } = {}): void {
    this.penguin.addItem(itemId);
    let cost: number;
    if (params.free === true) {
      cost = 0;
    } else {
      const item = ITEMS.getStrict(itemId);
      cost = item.cost;
    }
    const notify = params.notify ?? true;
    this.penguin.removeCoins(cost);
    if (notify) {
      this.sendXt('ai', itemId, this.penguin.coins);
    }
  }

  sendInventory(): void {
    const items = this.server.getItemsFiltered(this.penguin.getItems())
    
    this.sendXt('gi', items.join('%'));
  }

  addItems (items: number[]): void {
    for (const item of items) {
      this.penguin.addItem(item);
    }

    this.sendInventory();
    this.sendPenguinInfo();
  }

  get waddleRoom() {
    if (this._currentWaddleRoom === undefined) {
      throw new Error('Trying to access Waddle Room, but it\'s not in a waddle room');
    }
    return this._currentWaddleRoom;
  }

  hasWaddleRoom() {
    return this._currentRoom !== undefined;
  }

  get name() {
    return this._specialName ?? this.penguin.name;
  }

  joinWaddleRoom(waddleRoom: WaddleRoom): void {
    this._currentWaddleRoom = waddleRoom;
    const seatId = waddleRoom.addPlayer(this);

    this.sendXt('jw', seatId);
    this.sendRoomXt('uw', waddleRoom.id, seatId, this.name, this.penguin.id);
    const players = waddleRoom.players;
    // starts the game if all players have entered
    if (players.length === waddleRoom.size) {
      const Constructor = this.server.waddleConstructors[waddleRoom.game];
      const waddleGame = new Constructor(players);
      this.server.setWaddleGame(waddleRoom, waddleGame);
      waddleRoom.resetWaddle();
      // 2006 sled race notification for starting the game
      if (waddleGame.name === 'sled' && players.every((player) => player.isEngine1)) {
        players.forEach((player) => {
          player.sendXt('sw', waddleRoom.id, waddleGame.roomId, waddleRoom.size);
        });
        return;
      }
      waddleGame.start();
    }
  }

  joinGameRoomOld(room: number, xtCode: string): void {
    if (this._currentRoom !== undefined) {
      this.leaveRoom();
    }
    this._currentRoom = this._server.getRoom(room);
    this._roomInfo = undefined;
    this.sendXt(xtCode, room);
  }

  leaveWaddleRoom(): void {
    this.waddleRoom.removePlayer(this);
    this._currentWaddleRoom = undefined;
  }

  get waddleGame(): WaddleGame {
    if (this._waddleGame === null) {
      throw new Error('No waddle available');
    }
    return this._waddleGame;
  }

  setWaddleGame(waddleGame: WaddleGame): void {
    this._waddleGame = waddleGame;
  }

  clearWaddleGame(): void {
    this._waddleGame = null;
  }

  async sendStamps (): Promise<void> {
    // TODO this is actually not just for one's penguin, TODO multiplayer logic
    await this.sendXt('gps', this.penguin.id, this.penguin.getStamps().join('|'));
  }

  getPinString (): string {
    const pins = this.penguin.getItems().filter((item) => {
      const id = Number(item)
      return ITEMS.get(id)?.type === ItemType.Pin && !isFlag(id);
    }).map((pin) => {
      const item = ITEMS.get(Number(pin));
      if (item === undefined) {
        throw new Error(`Pin ${pin} in inventory doesn't exist`);
      }
      return [item.id, (new Date(`${item.releaseDate}T12:00:00`)).getTime() / 1000, item.isMember ? 1 : 0].join('|');
    })

    return pins.join('%');
  }

  getStampbookCoverString (): string {
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

  getRecentStampsString (): string {
    const recentStamps = this.penguin.stampbook.recent_stamps.join('|');
    this.penguin.stampbook.recent_stamps = [];
    return recentStamps;
  }

  getEndgameStampsInformation (): [string, number, number, number] {
    const info: [string, number, number, number] = ['', 0, 0, 0];

    const gameRoom = GAME_STAMPS_TIMELINE.get(this.room.id);

    if (gameRoom !== undefined) {
      const stamps = isLower(this.version, STAMPS_RELEASE) ? [] : (findInVersion(this.version, gameRoom) ?? []);

      const gameSessionStamps: number[] = [];
      this.sessionStamps.forEach((stamp) => {
        if (stamps.includes(stamp)) {
          gameSessionStamps.push(stamp);
        }
      });
      // string of recently collected stamps
      info[0] = gameSessionStamps.join('|');
      // total number of stamps collected in this game
      info[1] = stamps.filter((stamp) => this.penguin.hasStamp(stamp)).length;
      // total number of stamps the game has
      info[2] = stamps.length;

      // TODO check what this is used for
      info[3] = 0;
    }

    this.sessionStamps = [];

    return info;
  }

  /** Send stamp info at the end of a card-jitsu game */
  sendCardJitsuStampInfo() {
    this.sendXt('cjsi', ...this.getEndgameStampsInformation());
  }

  /**
   * Give a stamp to a player
   * @param stampId 
   * @param params.notify Default `true` - Whether to notify the client or not
   */
  giveStamp(stampId: number, params: { notify?: boolean } = {}): void {
    const notify = params.notify ?? true;
    const releaseDate = STAMP_DATES[stampId];
    if (releaseDate === undefined) {
      throw new Error(`Stamp is never released: ${stampId}`);
    }
    if (isGreaterOrEqual(this.version, releaseDate)) {
      if (!this.penguin.hasStamp(stampId)) {
        this.penguin.addStamp(stampId);
        this.penguin.stampbook.recent_stamps.push(stampId);
        this.sessionStamps.push(stampId);
      }
      if (notify) {
        this.sendXt('aabs', stampId);
      }
    }
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

  static getEngine3IglooString(igloo: Igloo, index: number): string {
    // TODO like stuff
    const likeCount = 0;
    const furnitureString = Client.getFurnitureString(igloo.furniture);
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
    if (this.isEngine2) {
      const furnitureString = Client.getFurnitureString(igloo.furniture);
      return [
        igloo.type,
        igloo.music,
        igloo.flooring,
        furnitureString
      ].join('%');
    } else {
      // This is Engine 3
      return Client.getEngine3IglooString(igloo, 1);
    }
  }

  getOwnIglooString (): string {
    return this.getIglooString(this.penguin.activeIgloo);
  }

  walkPuffle (puffle: number) {
    this.walkingPuffle = puffle;
  }

  unwalkPuffle() {
    this.walkingPuffle = NaN;
  }

  swapPuffleFromIglooAndBackyard(playerPuffleId: number, goingToBackyard: boolean) {
    if (goingToBackyard) {
      this.penguin.addToBackyard(playerPuffleId);
    } else {
      this.penguin.removeFromBackyard(playerPuffleId);
    }
  }

  sendPuffles (): void {
    const puffles = this.penguin.getPuffles().map((puffle) => {
      return [puffle.id, puffle.name, puffle.type, puffle.clean, puffle.food, puffle.rest, 100, 100, 100].join('|')
    })
    this.sendXt('pgu', ...puffles);
  }

  addPostcard (postcard: number, info: {
    senderId?: number
    senderName?: string
    details?: string    
  } = {}): void {
    const mail = this.penguin.receivePostcard(postcard, info);
    this.sendXt('mr', mail.sender.name, mail.sender.id, postcard, mail.postcard.details, mail.postcard.timestamp, mail.postcard.uid);
  }

  unequipPuffle(): void {
    const puffles = [
      750, 751, 752, 753, 754, 755, 756, 757, 758, 759
    ];
    if (puffles.includes(this.penguin.hand)) {
      this.penguin.hand = 0;
    }
  }

  sendPenguinInfo(): void {
    /*
    TODO safe chat (after coins) will ever be required?
    TODO after safechat, what is that variable
    TODO after age, what is it?
    TODO how to implement penguin time zone?
    TODO what is last?
    TODO -1: membership days remain is useful?
    TODO 7: how to handle offset
    TODO 1: how to handle opened played cards
    TODO 4: map category how to handle
    TODO 3: how to handle status field
    */

    const virtualDate = this.server.getVirtualDate(0);
    
    this.sendXt('lp', this.penguinString, String(this.penguin.coins), 0, 1440, virtualDate.getTime(), this.age, 0, this.penguin.minutesPlayed, -1, 7, 1, 4, 3);
  }

  getFurnitureString(): string {
    return this.penguin.getAllFurniture().map((pair) => {
      return pair.join('|');
    }).join('%');
  }

  /**
   * Add a furniture item to the inventory
   * @param furnitureId 
   * @param params.cost Default `0` - Cost of furniture
   * @param params.notify Default `true` - Whether to notify the client or not
   */
  buyFurniture(furnitureId: number, params: { cost?: number, notify?: boolean } = {}): void {
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

  sendError(error: number, ...args: string[]): void {
    this.sendXt('e', error, ...args)
  }

  disconnect(): void {
    if (this._currentRoom !== undefined) {
      this.leaveRoom();
    }
    const delta = Date.now() - this.sessionStart;
    const minutesDelta = delta / 1000 / 60;
    this._penguin?.incrementPlayTime(minutesDelta);
    if (this._penguin !== undefined) {
      this.update();
      this.server.untrackPlayer(this._penguin.id);
    }
    this._socket?.end();
  }

  getCoinsFromScore(score: number): number {
    return isLiteralScoreGame(this.room.id) ? (
      Number(score)
    ) : (
      Math.floor(Number(score) / 10)
    );
  }

  sendEngine1Coins(): void {
    this.sendXt('ac', this.penguin.coins);
  }

  private setPuffleLaunchGameData(data: PuffleLaunchGameSet): void {
    this.penguin.setGameData(data.get());
  }

  /** Set game data with all Puffle Launch levels unlocked */
  unlockPuffleLaunchLevels() {
    this.setPuffleLaunchGameData(new PuffleLaunchGameSet((new Array<number>(36)).fill(0x1), [], []));
  }

  /** Set game data with the Puffle Launch time attack mode unlocked (all levels have max puffle o's) */
  unlockPuffleLaunchTimeAttack(times: number[] = [], turboStatuses: boolean[] = []) {
    this.setPuffleLaunchGameData(new PuffleLaunchGameSet([
      34, 46, 99, 90, 115, 39,
      84, 42, 120, 123, 183, 54,
      59, 75, 243, 88, 203, 135,
      113, 284, 122, 153, 172, 69,
      44, 48, 103, 97, 86, 144,
      318, 165, 219, 87, 277, 33
    ], times, turboStatuses));
  }

  /** Set game data with Puffle Launch turbo mode unlocked (all times will be 1 second) */
  unlockTurboMode(turboStatuses: boolean[] = []) {
    this.unlockPuffleLaunchTimeAttack((new Array<number>(36)).fill(1), turboStatuses);
  }

  /** Set game data with Puffle Launch slow mode unlocked (all times will be 1 second) */
  unlockSlowMode() {
    this.unlockTurboMode((new Array<boolean>(36)).fill(true));
  }

  /** Add a "puffle care item" to the inventory */
  buyPuffleItem(itemId: number, cost: number, amount: number) {
    const owned = this.penguin.addPuffleItem(itemId, amount);
    this.penguin.removeCoins(cost);
    this.sendXt('papi', this.penguin.coins, itemId, owned);
  }

  /** Set a puffle color has having been dug */
  addDugPuffleColor(puffleType: number): void {
    const puffle = PUFFLES.get(puffleType);
    // filter invalid IDs and only ones we want are 0-11
    if (puffle !== undefined && puffleType < 12) {
      this._puffleColorsDug.add(puffleType);
    }
  }

  getTotalColorsDug(): number {
    return Array.from(this._puffleColorsDug.values()).length;
  }

  /** Checks if the client is from the original engine (Pre-CPIP) */
  get isEngine1(): boolean {
    return isEngine1(this.version);
  }

  /** Checks if the client is from the second engine (Post-CPIP) */
  get isEngine2(): boolean {
    return isEngine2(this.version);
  }

  /** Checks if the client is from the latest engine */
  get isEngine3(): boolean {
    return isEngine3(this.version);
  }

  get isGoldNuggetState(): boolean {
    return this._isGoldNuggetState;
  }

  activateGoldNuggetState(): void {
    this._isGoldNuggetState = true;
  }

  resetGoldNuggetState(): void {
    this._isGoldNuggetState = false;
  }

  sendMessage(message: string) {
    this.sendRoomXt('sm', this.penguin.id, message);

    this.followers.forEach(bot => bot.sendMessage(message));
  }

  sendEmote(emote: string) {
    this.sendRoomXt('se', this.penguin.id, emote);

    this.followers.forEach(bot => bot.sendEmote(emote));
  }

  throwSnowball(x: string, y: string) {
    this.sendRoomXt('sb', this.penguin.id, x, y);

    this.followers.forEach(bot => bot.throwSnowball(x, y));
  }

  sendAction(id: string) {
    this.sendRoomXt('sa', this.penguin.id, id);
  }

  sendJoke(id: string) {
    this.sendRoomXt('sj', this.penguin.id, id);
  }

  sendSafeMessage(id: string) {
    this.sendRoomXt('ss', this.penguin.id, id);
  }

  updateEquipment(slot: PenguinEquipmentSlot, id: number): void {
    this.penguin[slot] = id;
    this.sendRoomXt(`up${EQUIP_SLOT_MAPPINGS[slot]}`, this.penguin.id, id);

    this.followers.forEach(bot => bot.updateEquipment(slot, id));
  }

  equip(itemId: number): void {
    const item = ITEMS.getStrict(itemId);
    const slots: Partial<Record<ItemType, PenguinEquipmentSlot>> = {
      [ItemType.Background]: 'background',
      [ItemType.Body]: 'body',
      [ItemType.Color]: 'color',
      [ItemType.Face]: 'face',
      [ItemType.Feet]: 'feet',
      [ItemType.Hand]: 'hand',
      [ItemType.Head]: 'head',
      [ItemType.Neck]: 'neck'
    };
    const slot = slots[item.type];
    if (slot !== undefined) {
      this.updateEquipment(slot, itemId);
    }
  }

  get botGroup(): BotGroup {
    return this.room.botGroup;
  }

  ninjaRankUp(previousRank: number) {
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
    this.update();

  }

  becomeNinja(): void {
    const previousRank = this.penguin.ninjaProgress.rank;
    this.penguin.ninjaProgress.becomeNinja();
    this.ninjaRankUp(previousRank);
  }

  gainNinjaProgress(won: boolean): void {
    this.penguin.addCardJitsuWin();

    if (this.penguin.ninjaProgress.rank < CardJitsuProgress.MAX_RANK) {
      const exp = won ? 5 : 1;
      const previousRank = this.penguin.ninjaProgress.rank;
      this.penguin.ninjaProgress.earnXP(exp);
  
      if (this.penguin.ninjaProgress.rank > previousRank) {
        this.ninjaRankUp(previousRank);
      }
    }

    this.update();
  }

  setAvatar(id: number) {
    this._avatar = id;
  }

  get avatar() {
    return this._avatar;
  }

  sendCoinsForChange() {
    if (findInVersionStrict(this.version, COINS_FOR_CHANGE_TIMELINE)) {
      // placeholder donation values
      const values = findInVersionStrict(this.version, CFC_VALUES_TIMELINE);
      this.sendXt('gcfct', values.map((amount, i) => `${i}|${amount}`).join(','));
    }
  }

  get buddyProtocol(): BuddyProtocol | undefined {
    return this._server.buddyProtocol
  }

  enterTable(tableId: number, seat: number): void {
    this._tableState = { id: tableId, seat };
  }

  getTable() {
    return this._tableState;
  }

  exitTable() {
    this._tableState = undefined;
  }
}

type FollowInfo = {
  relativePosition: Vector;
};

class Bot extends Client {
  private _followInfo: FollowInfo | undefined;

  constructor(server: Server, name: string) {
    super(server, undefined, 'World');
    this._penguin = Penguin.getDefault(10000 + server.getNewBotId(), name);
  }

  get followInfo(): FollowInfo {
    return this._followInfo ?? (() => { throw new Error('Follow info has not been initialized') })();
  }

  followPosition(x: number, y: number): void {
    const targetPos = this.followInfo.relativePosition.add(new Vector(x, y)).vector;
    this.setPosition(...targetPos);
  }

  followPlayer(player: Client, relativePosition: Vector) {
    this._followInfo = {
      relativePosition
    };
    this.server.addFollower(this, player);
    this.followPosition(player.x, player.y);
  }
};

type Shape = Vector[];

export class BotGroup {
  private _bots: Map<string, Bot>;
  private _server: Server;

  constructor(server: Server) {
    this._bots = new Map<string, Bot>;
    this._server = server;
  }

  addBot(bot: Bot) {
    this._bots.set(bot.penguin.name, bot);
  }

  merge(other: BotGroup): void {
    const group = this;
    other.bots.forEach((bot) => group.addBot(bot));
  }

  get bots(): Bot[] {
    return Array.from(this._bots.values());
  }

  private callBotAction(target: string | undefined, action: (bot: Bot) => void) {
    let bots: Bot[] = [];
    if (target === undefined) {
      bots = Array.from(this._bots.values());
    } else {
      const bot = this._bots.get(target);
      if (bot !== undefined) {
        bots = [bot];
      }
    }
    bots.forEach(action);
  }

  follow(player: Client, shape: Shape) {
    this.bots.forEach((bot, i) => bot.followPlayer(player, shape[i]));
  }

  spawnBot(name: string, startRoom: number = Room.Town): Bot {
    const bot = new Bot(this._server, name);
    this._bots.set(name, bot);
    bot.joinRoom(startRoom);
    return bot;
  }

  say(message: string, target?: string): void {
    this.callBotAction(target, (b) => b.sendMessage(message));
  }

  goTo(x: number, y: number, target?: string): void {
    this.callBotAction(target, b => b.setPosition(x, y));
  }

  setFrame(frame: number, target?: string): void {
    this.callBotAction(target, b => b.setFrame(frame));
  }

  dance(target?: string): void {
    this.callBotAction(target, b => b.setFrame(26));
  }

  wear(itemId: number, target?: string): void {
    this.callBotAction(target, b => b.equip(itemId));
  }

  makeShape(shape: Shape, origin?: Vector): void {
    const pos = origin ?? new Vector(this.bots[0].x, this.bots[0].y);
    this.bots.forEach((bot, i) => {
      const targetPos = pos.add(shape[i]).vector;
      bot.setPosition(...targetPos);
    })
  }

  makeRectangle(width: number, xSeparation: number, ySeparation: number, x?: number, y?: number) {
    const shape: Shape = [];
    const amount = this.bots.length;
    for (let i = 0; i < amount; i++) {
      shape.push(new Vector((i % width) * xSeparation, (Math.floor(i / width)) * ySeparation));
    }
    this.makeShape(shape, new Vector(x ?? 0, y ?? 0));
  }

  spawnNumberedGroup(baseName: string, amount: number, room?: number): void {
    for (let i = 0; i < amount; i++) {
      this.spawnBot(`${baseName}${i + 1}`, room);
    }
  }
}