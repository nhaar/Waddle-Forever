import net from 'net';

import { isGameRoom, isLiteralScoreGame, Room, roomStamps } from './game/rooms';
import db, { PenguinData, Databases, PlayerPuffle, IglooFurniture, Stampbook, RainbowPuffleStage, Mail, Igloo, parseJsonSet, parseJsonRows, parseJsonMap, dumpJsonSet, dumpJsonRows, dumpJsonMap, isRainbowStage } from './database';
import { GameVersion } from './settings';
import { Stamp } from './game/stamps';
import { isAs1, isAs2, isGreaterOrEqual, isLower } from './routes/versions';
import { ITEMS, ItemType } from './game/items';
import { isFlag } from './game/flags';
import PuffleLaunchGameSet from './game/pufflelaunch';
import { PUFFLE_ITEMS } from './game/puffle-item';

type ServerType = 'Login' | 'World';

const STAMP_RELEASE_VERSION : string = '2010-Jul-26'

class Penguin {
  private _id: number;
  private _name: string;
  private _isMember: boolean;
  private _isAgent: boolean;
  private _mascot: number;
  private _equipped: {
    color: number
    head: number
    face: number
    neck: number
    body: number
    hand: number
    feet: number
    pin: number
    background: number  
  };
  private _coins: number;
  private _registrationTimestamp: number;
  private _minutesPlayed: number;
  private _inventory: Set<number>;
  private _stamps: Set<number>;
  private _stampbook: Stampbook;
  private _puffleSeq: number;
  private _puffles: Map<number, PlayerPuffle>;
  private _backyard: Set<number>;
  private _puffleItems: Map<number, number>;
  private _hasDug: boolean;
  private _treasureFinds: number[];
  private _rainbow: {
    adoptability: boolean;
    currentTask: number;
    latestTaskCompletionTime?: number;
    coinsCollected: Set<RainbowPuffleStage>;
  }
  private _furnitureInventory: Map<number, number>;
  private _iglooTypes: Set<number>;
  private _iglooLocations: Set<number>;
  private _iglooFloorings: Set<number>;
  private _mailSeq: number;
  private _puffleLaunchGameData: Buffer;
  private _mail: Array<Mail>;
  private _igloo: Igloo;

  constructor(id: number, data: PenguinData) {
    this._id = id;
    this._name = data.name;
    this._isMember = data.is_member;
    this._isAgent = data.is_agent;
    this._mascot = data.mascot;
    this._equipped = {
      color: data.color,
      head: data.head,
      face: data.face,
      neck: data.neck,
      body: data.body,
      hand: data.hand,
      feet: data.feet,
      pin: data.pin,
      background: data.background
    };
    this._coins = data.coins;
    this._registrationTimestamp = data.registration_date;
    this._minutesPlayed = data.minutes_played;
    this._inventory = parseJsonSet(data.inventory);
    this._stamps = parseJsonSet(data.stamps);
    this._stampbook = data.stampbook;
    this._puffleSeq = data.puffleSeq;
    this._puffles = parseJsonRows(data.puffles);
    this._backyard = parseJsonSet(data.backyard);
    this._puffleItems = parseJsonMap(data.puffleItems);
    this._hasDug = data.hasDug;
    this._treasureFinds = data.treasureFinds;
    this._rainbow = {
      adoptability: data.rainbow.adoptability,
      currentTask: data.rainbow.currentTask,
      latestTaskCompletionTime: data.rainbow.latestTaskCompletionTime,
      coinsCollected: parseJsonSet(data.rainbow.coinsCollected.filter<RainbowPuffleStage>(((value): value is RainbowPuffleStage => {
        return isRainbowStage(value);
      })))
    },
    this._furnitureInventory = parseJsonMap(data.furniture);
    this._iglooTypes = parseJsonSet(data.iglooTypes);
    this._iglooLocations = parseJsonSet(data.iglooLocations);
    this._iglooFloorings = parseJsonSet(data.iglooFloorings);
    this._mailSeq = data.mailSeq;
    this._puffleLaunchGameData = Buffer.from(data.puffleLaunchGameData ?? '', 'base64');
    this._mail = data.mail;
    this._igloo = data.igloo;
  }

  serialize(): PenguinData {
    return {
      name: this._name,
      is_member: this._isMember,
      is_agent: this._isAgent,
      mascot: this._mascot,
      color: this._equipped.color,
      head: this._equipped.head,
      face: this._equipped.face,
      neck: this._equipped.neck,
      body: this._equipped.body,
      hand: this._equipped.hand,
      feet: this._equipped.feet,
      pin: this._equipped.pin,
      background: this._equipped.background,
      coins: this._coins,
      registration_date: this._registrationTimestamp,
      minutes_played: this._minutesPlayed,
      inventory: dumpJsonSet(this._inventory),
      stamps: dumpJsonSet(this._stamps),
      stampbook: this._stampbook,
      puffleSeq: this._puffleSeq,
      puffles: dumpJsonRows(this._puffles),
      backyard: dumpJsonSet(this._backyard),
      puffleItems: dumpJsonMap(this._puffleItems),
      hasDug: this._hasDug,
      treasureFinds: this._treasureFinds,
      rainbow: {
        adoptability: this._rainbow.adoptability,
        currentTask: this._rainbow.currentTask,
        latestTaskCompletionTime: this._rainbow.latestTaskCompletionTime,
        coinsCollected: dumpJsonSet(this._rainbow.coinsCollected)
      },
      furniture: dumpJsonMap(this._furnitureInventory),
      iglooFloorings: dumpJsonSet(this._iglooFloorings),
      iglooLocations: dumpJsonSet(this._iglooLocations),
      iglooTypes: dumpJsonSet(this._iglooTypes),
      mailSeq: this._mailSeq,
      puffleLaunchGameData: this._puffleLaunchGameData.toString('base64'),
      igloo: this._igloo,
      mail: this._mail
    }
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get color() {
    return this._equipped.color;
  }

  get head() {
    return this._equipped.head;
  }

  get face() {
    return this._equipped.face;
  }

  get neck() {
    return this._equipped.neck;
  }

  get body() {
    return this._equipped.body;
  }

  get hand() {
    return this._equipped.hand;
  }

  get feet() {
    return this._equipped.feet;
  }

  get pin() {
    return this._equipped.pin;
  }

  get background() {
    return this._equipped.background;
  }

  get isMember() {
    return this._isMember;
  }

  get registrationTimestamp() {
    return this._registrationTimestamp;
  }

  get coins() {
    return this._coins;
  }

  set color(id: number) {
    this._equipped.color = id;
  }

  set head(id: number) {
    this._equipped.head = id;
  }

  set face(id: number) {
    this._equipped.face = id;
  }

  set neck(id: number) {
    this._equipped.neck = id;
  }

  set body(id: number) {
    this._equipped.body = id;
  }

  set hand(id: number) {
    this._equipped.hand = id;
  }

  set feet(id: number) {
    this._equipped.feet = id;
  }

  set pin(id: number) {
    this._equipped.pin = id;
  }

  set background(id: number) {
    this._equipped.background = id;
  }

  get stampbook() {
    return this._stampbook;
  }

  get igloo() {
    return this._igloo;
  }

  get mascot() {
    return this._mascot;
  }

  get isAgent() {
    return this._isAgent;
  }

  get hasDug() {
    return this._hasDug;
  }

  get rainbowQuestInfo() {
    return this._rainbow;
  }

  changeName(name: string): void {
    this._name = name;
  }

  swapMember(): void {
    this._isMember = !this._isMember;
  }

  setAge(days: number): void {
    this._registrationTimestamp = Date.now() - days * 3600 * 24 * 1000;
  }

  getItems(): number[] {
    return Array.from(this._inventory.values());
  }

  getStamps(): number[] {
    return Array.from(this._stamps.values());
  }

  hasStamp(stamp: number): boolean {
    return this._stamps.has(stamp);
  }

  addStamp(stamp: number): void {
    this._stamps.add(stamp);
  }

  addItem(item: number): void {
    this._inventory.add(item);
  }

  hasItem(item: number): boolean {
    return this._inventory.has(item);
  }

  addCoins (amount: number): void {
    this._coins += amount;
  }

  addIgloo(type: number): void {
    this._iglooTypes.add(type);
  }

  removeCoins (amount: number): void {
    this._coins -= amount
  }

  addPuffle(name: string, puffleType: number): PlayerPuffle {
    this._puffleSeq += 1;
    const id = this._puffleSeq;
    const puffle = {
      id,
      name,
      type: puffleType,
      clean: 100,
      rest: 100,
      food: 100
    }
    this._puffles.set(id, puffle);

    return puffle;
  }

  addToBackyard(puffle: number) {
    this._backyard.add(puffle);
  }

  removeFromBackyard(puffle: number) {
    this._backyard.delete(puffle);
  }

  isInBackyard(puffle: number): boolean {
    return this._backyard.has(puffle);
  }

  makeAgent (): void {
    this._isAgent = true;
  }

  getPuffles(): PlayerPuffle[] {
    return Array.from(this._puffles.values());
  }

  get minutesPlayed() {
    return this._minutesPlayed;
  }

  receivePostcard(postcard: number, info: {
    senderId?: number
    senderName?: string
    details?: string    
  }): Mail {
    this._mailSeq += 1;
    const uid = this._mailSeq;
    const senderName = info.senderName ?? 'sys';
    const senderId = info.senderId ?? 0;
    const details = info.details ?? '';
    const timestamp = Date.now();
    const mail = {
      sender: {
        name: senderName,
        id: senderId
      },
      postcard: {
        postcardId: postcard,
        uid,
        details,
        timestamp,
        read: false
      }
    };
    this._mail.push(mail);
    return mail;
  }

  setAllMailAsRead(): void {
    this._mail = this._mail.map((mail) => {
      const postcard = { ...mail.postcard, read: true };
      return { ...mail, postcard: postcard }
    })
  }

  getUnreadMailTotal(): number {
    return this._mail.filter((mail) => !mail.postcard.read).length;
  }

  getMailTotal(): number {
    return this._mail.length;
  }

  getAllMail(): Mail[] {
    return this._mail;
  }

  addFurniture(furniture: number, amount: number): boolean {
    if (amount < 0 || isNaN(amount) || !Number.isInteger(amount)) {
      throw new Error(`Invalid amount of furniture being added: ${amount}`);
    }
    let amountOwned = this._furnitureInventory.get(furniture);
    if (amountOwned === undefined) {
      amountOwned = 0;
    }

    const newAmount = amountOwned + amount;
    if (newAmount > 99) {
      return false;
    } 

    this._furnitureInventory.set(furniture, newAmount);
    return true;
  }

  getAllFurniture(): Array<[number, number]> {
    return Array.from(this._furnitureInventory.entries());
  }

  getFurnitureOwnedAmount(furniture: number): number {
    return this._furnitureInventory.get(furniture) ?? 0;
  }

  getIglooFloorings(): number[] {
    return Array.from(this._iglooFloorings.values());
  }

  getIglooTypes(): number[] {
    return Array.from(this._iglooTypes.values());
  }

  getIglooLocations(): number[] {
    return Array.from(this._iglooLocations.values());
  }

  incrementPlayTime(minutes: number) {
    if (minutes < 0) {
      throw new Error(`Invalid play time increment: ${minutes} minutes`);
    }

    this._minutesPlayed += minutes;
  }

  getGameData(): Buffer {
    return this._puffleLaunchGameData;
  }

  setGameData(data: Buffer): void {
    this._puffleLaunchGameData = data;
  }

  addPuffleItem(itemId: number, amount: number): number {
    const item = PUFFLE_ITEMS.get(itemId);
    if (item === undefined) {
      throw new Error(`Tried to add puffle item that doesn't exist: ${itemId}`);
    }
    const parentItem = PUFFLE_ITEMS.get(item.parentId);
    if (parentItem === undefined) {
      throw new Error(`Puffle item ${item} doesn't have a valid parent ID (${item.parentId})`);
    }
    
    if (amount < 0 || !Number.isInteger(amount)) {
      throw new Error(`Invalid amount of puffle items added: ${amount}`);
    }

    const totalAmount = amount * item.quantity;

    const ownedAmount = this._puffleItems.get(parentItem.id) ?? 0;
    const newAmount = ownedAmount + totalAmount;
    this._puffleItems.set(parentItem.id, newAmount);

    return newAmount;
  }

  addTreasureFind(): void {
    const now = Date.now();
    this._treasureFinds.push(now);
    // only track times you found a treasure in the last 24 hrs
    this._treasureFinds = this._treasureFinds.filter((timestamp) => {
      return now - timestamp < 24 * 60 * 60 * 1000;
    })
  }

  getTreasureFindsInLastDay(): number {
    return this._treasureFinds.length;
  }

  clearTreasureFinds(): void {
    this._treasureFinds = [];
  }

  setHaveDug(): void {
    this._hasDug = true;
  }

  getPuffleItemOwnedAmount(itemId: number): number {
    return this._puffleItems.get(itemId) ?? 0;
  }

  getAllPuffleItems(): Array<[number, number]> {
    return Array.from(this._puffleItems.entries());
  }

  static getDefault(id: number, name: string, isMember: boolean): Penguin {
    return new Penguin(id, {
      name,
      is_member: isMember,
      is_agent: false,
      mascot: 0,
      color: 1,
      head: 0,
      face: 0,
      neck: 0,
      body: 0,
      hand: 0,
      feet: 0,
      pin: 0,
      background: 0,
      coins: 500,
      registration_date: Date.now(),
      minutes_played: 0,
      inventory: [1],
      stamps: [],
      stampbook: { // TODO: enums for the options
        color: 1,
        highlight: 1,
        pattern: 0,
        icon: 1,
        stamps: [],
        recent_stamps: []
      },
      puffleSeq: 0,
      puffles: [],
      backyard: [],
      puffleItems: {},
      hasDug: false,
      treasureFinds: [],
      rainbow: {
        adoptability: false,
        currentTask: 0,
        coinsCollected: []
      },
      igloo: {
        type: 0,
        music: 0,
        flooring: 0, // in the past, you could have only one flooring active
        furniture: []
      },
      furniture: {},
      iglooFloorings: [], // floorings inventory is a modern feature
      iglooTypes: [1],
      iglooLocations: [1],
      mail: [],
      mailSeq: 0
    })
  }
}

export class Client {
  socket: net.Socket;
  penguin: Penguin;
  x: number;
  y: number;
  currentRoom: number;
  version: GameVersion;
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

  constructor (socket: net.Socket, version: GameVersion, member: boolean, type: ServerType) {
    this.currentRoom = -1;
    
    this.socket = socket;
    this.version = version;
    this.serverType = type;
    this.penguin = Penguin.getDefault(-1, '', member);
    /* TODO, x and y random generation at the start? */
    this.x = 100;
    this.y = 100;
    this.sessionStart = Date.now();
    
    this.sessionStamps = [];
    this.walkingPuffle = NaN;

    // For "only once" listeners
    this.handledXts = new Map<string, boolean>();

    this.xtTimestamps = new Map<string, number>();
  }

  send (message: string): void {
    this.socket.write(message + '\0');
  }

  sendXt (handler: string, ...args: Array<number | string>): void {
    console.log('\x1b[32mSending XT:\x1b[0m ', handler, args);
    this.send(`%xt%${handler}%-1%` + args.join('%') + '%');
  }

  static as1Crumb (penguin: Penguin): string {
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
      0, // X
      0, // y
      0, // TODO frame
      penguin.isMember ? 1 : 0
    ].join('|')
  }

  get penguinString (): string {
    if (isAs1(this.version)) {
      return Client.as1Crumb(this.penguin);
    } else {
      return [
        this.penguin.id,
        this.penguin.name,
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
        1, // TODO, figure what this "frame" means
        this.penguin.isMember ? 1 : 0,
        this.memberAge,
        0, // TODO figure out what this "avatar" is
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

  get age (): number {
    // difference converted into days
    return Math.floor((Date.now() - this.penguin.registrationTimestamp) / 1000 / 86400);
  }

  get memberAge (): number {
    // TODO implement proper for this, if ever needed
    return this.age;
  }

  joinRoom (room: number): void {
    // TODO multiplayer logic
    const string = this.penguinString;
    if (isGameRoom(room)) {
      this.sendXt('jg', room);
    } else {
      this.sendXt('jr', room, string);
      this.sendXt('ap', string);
    }
    this.currentRoom = room;
  }

  update (): void {
    db.update<PenguinData>(Databases.Penguins, this.penguin.id, this.penguin.serialize());
  }

  static getPenguinFromName (name: string): Penguin {
    let data = db.get<PenguinData>(Databases.Penguins, 'name', name);

    if (data === undefined) {
      data = Client.create(name);
    }

    const [penguinData, id] = data;

    return new Penguin(id, penguinData);
  }

  setPenguinFromName (name: string): void {
    this.penguin = Client.getPenguinFromName(name)
  }

  setPenguinFromId (id: number): void {
    const data = db.getById<PenguinData>(Databases.Penguins, id);
    const penguin = data;
    if (penguin === undefined) {
      throw new Error(`Could not find penguin of ID ${id}`);
    }
    this.penguin = new Penguin(id, penguin);
  }

  static create (name: string, mascot = 0): [PenguinData, number] {
    const defaultPenguin = Penguin.getDefault(0, name, true).serialize();
    return db.add<PenguinData>(Databases.Penguins, {
      ...defaultPenguin,
      name,
      mascot
    });
  }

  canBuy (item: number): boolean {
    // TODO
    return true;
  }

  /**
   * Add a new item to a player
   * @param itemId
   * @param params.cost Cost of the item (default 0)
   * @param params.notify Whether or not to notify the client (default false)
   */
  buyItem (itemId: number, params: { cost?: number, notify?: boolean } = {}): void {
    this.penguin.addItem(itemId);
    const cost = params.cost ?? 0;
    const notify = params.notify ?? true;
    this.penguin.removeCoins(cost);
    if (notify) {
      this.sendXt('ai', itemId, this.penguin.coins);
    }
  }

  sendInventory(): void {
    this.sendXt('gi', this.penguin.getItems().join('%'));
  }

  addItems (items: number[]): void {
    for (const item of items) {
      this.penguin.addItem(item);
    }

    this.sendInventory();
    this.sendPenguinInfo();
  }

  updateColor (color: number): void {
    this.penguin.color = color;
    this.sendXt('upc', this.penguin.id, color);
  }

  sendStamps (): void {
    this.sendXt('gps', this.penguin.id, this.penguin.getStamps().join('|'));
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

    if (this.currentRoom in roomStamps) {
      let gameStamps = roomStamps[this.currentRoom];
      // manually removing stamps if using a version before it was available
      if (isLower(this.version, '2010-Jul-26')) {
        gameStamps = [];
      } else if (this.currentRoom === Room.JetPackAdventure) {
        // Before puffle stamps
        if (isLower(this.version, '2010-Sep-24')) {
          gameStamps = [
            Stamp.LiftOff,
            Stamp.FuelRank1,
            Stamp.JetPack5,
            Stamp.Crash,
            Stamp.FuelRank2,
            Stamp.FuelRank3,
            Stamp.FuelRank4,
            Stamp.FuelRank5,
            Stamp.OneUpLeader,
            Stamp.Kerching,
            Stamp.FuelCommand,
            Stamp.FuelWings,
            Stamp.OneUpCaptain,
            Stamp.AcePilot,
          ]
        }
      }
      const stamps = gameStamps;

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

  /**
   * Give a stamp to a player
   * @param stampId 
   * @param params.notify Default `true` - Whether to notify the client or not
   * @param params.release Proper version string for when the stamp released (defaults to the stamp release date) 
   */
  giveStamp(stampId: number, params: { notify?: boolean, release?: string } = {}): void {
    const notify = params.notify ?? true;
    const releaseDate = params.release ?? STAMP_RELEASE_VERSION;
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

  getIglooString (): string {
    const furnitureString = this.penguin.igloo.furniture.map((furniture) => {
      return [
        furniture.id,
        furniture.x,
        furniture.y,
        furniture.rotation,
        furniture.frame
      ].join('|')
    }).join(',')
    if (isAs2(this.version)) {
      return [
        this.penguin.igloo.type,
        this.penguin.igloo.music,
        this.penguin.igloo.flooring,
        furnitureString
      ].join('%');
    } else {
      // This is AS3

      // TODO making this dynamic
      const locked = true;
      // TODO like stuff
      const likeCount = 0;
      const iglooLocation = 1;
      const iglooType = 1; // TODO Seems to be different compared to legacy? eg 0 vs 1
      return [
        this.penguin.id, // TODO might have to do with igloo id?
        1, 0, // TODO don't know what these are
        locked ? 1 : 0,
        this.penguin.igloo.music,
        this.penguin.igloo.flooring,
        iglooLocation,
        iglooType,
        likeCount,
        furnitureString
      ].join(':');
    }
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
  }): void {
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
    this.sendXt('lp', this.penguinString, String(this.penguin.coins), 0, 1440, 1727536687000, this.age, 0, this.penguin.minutesPlayed, -1, 7, 1, 4, 3);
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

  updateIglooFurniture(furniture: IglooFurniture): void {
    this.penguin.igloo.furniture = furniture;
  }

  sendError(error: number, ...args: string[]): void {
    this.sendXt('e', error, ...args)
  }

  disconnect(): void {
    const delta = Date.now() - this.sessionStart;
    const minutesDelta = delta / 1000 / 60;
    this.penguin.incrementPlayTime(minutesDelta);
  }

  checkAgeStamps(): void {
    const days = this.age;
    if (days >= 183) {
      this.giveStamp(14);
      if (days >= 365) {
        this.giveStamp(20);        
      }
    }
  }

  getCoinsFromScore(score: number): number {
    return isLiteralScoreGame(this.currentRoom) ? (
      Number(score)
    ) : (
      Math.floor(Number(score) / 10)
    );
  }

  sendAs1Coins(): void {
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
}
