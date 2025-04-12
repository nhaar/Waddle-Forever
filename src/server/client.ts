import net from 'net';

import db, { Databases, Igloo, IglooFurniture, PenguinData } from './database';
import { GameVersion, Settings, SettingsManager } from './settings';
import { Penguin } from './penguin';
import { Stamp } from './game/stamps';
import { isEngine1, isEngine2, isEngine3, isGreaterOrEqual, isLower } from './routes/versions';
import { ITEMS, ItemType } from './game/items';
import { isFlag } from './game/flags';
import PuffleLaunchGameSet from './game/pufflelaunch';
import { isGameRoom, isLiteralScoreGame, Room, roomStamps } from './game/rooms';
import { PUFFLES } from './game/puffle';

type ServerType = 'Login' | 'World';

const STAMP_RELEASE_VERSION : string = '2010-Jul-26'

export class Client {
  socket: net.Socket;
  penguin: Penguin;
  x: number;
  y: number;
  currentRoom: number;
  private _settingsManager: SettingsManager
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

  constructor (socket: net.Socket, type: ServerType, settingsManager: SettingsManager) {
    this.currentRoom = -1;
    
    this.socket = socket;
    this._settingsManager = settingsManager;
    this.serverType = type;
    this.penguin = Penguin.getDefault(-1, '', this._settingsManager.settings.always_member);
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

  private get version(): GameVersion {
    return this._settingsManager.settings.version;
  }

  get settings(): Settings {
    return this._settingsManager.settings;
  }

  send (message: string): void {
    this.socket.write(message + '\0');
  }

  sendXt (handler: string, ...args: Array<number | string>): void {
    console.log('\x1b[32mSending XT:\x1b[0m ', handler, args);
    this.send(`%xt%${handler}%-1%` + args.join('%') + '%');
  }

  static engine1Crumb (penguin: Penguin): string {
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
    if (isEngine1(this.version)) {
      return Client.engine1Crumb(this.penguin);
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

  getIglooString (): string {
    const igloo = this.penguin.activeIgloo;
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
}
