import net from 'net';

import { isGameRoom, Room, roomStamps } from './game/rooms';
import db, { Penguin, Databases, Puffle, IglooFurniture } from './database';
import { GameVersion } from './settings';
import { Stamp } from './game/stamps';
import { isGreaterOrEqual, isLower } from './routes/versions';

const STAMP_RELEASE_VERSION : GameVersion = '2010-Sep-03'

export class Client {
  socket: net.Socket;
  penguin: Penguin;
  id: number;
  x: number;
  y: number;
  currentRoom: number;
  version: GameVersion;

  /**
   * Temporary variable to keep track of stamps collected used to know
   * which ones someone collected when ending a game
   */
  sessionStamps: number[];

  /** ID of puffle that player is walking */
  walkingPuffle: number;

  constructor (socket: net.Socket, version: GameVersion) {
    this.socket = socket;
    this.version = version;
    this.penguin = Client.getDefault();
    /* TODO, x and y random generation at the start? */
    this.x = 100;
    this.y = 100;
  
    this.sessionStamps = [];
    this.walkingPuffle = NaN;
  }

  send (message: string): void {
    this.socket.write(message + '\0');
  }

  sendXt (handler: string, ...args: Array<number | string>): void {
    console.log('xt: ', `%xt%${handler}%-1%` + args.join('%') + '%');
    this.send(`%xt%${handler}%-1%` + args.join('%') + '%');
  }

  get penguinString (): string {
    return [
      this.id,
      this.penguin.name,
      1, // meant to be approval, but always approved
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
      this.penguin.is_member ? 1 : 0,
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

  get age (): number {
    // difference converted into days
    return Math.floor((Date.now() - this.penguin.registration_date) / 1000 / 86400);
  }

  get memberAge (): number {
    // TODO implement proper for this, if ever needed
    return this.age;
  }

  joinRoom (room: Room): void {
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
    db.update<Penguin>(Databases.Penguins, this.id, this.penguin);
  }

  private getPenguinFromName (name: string): boolean {
    const data = db.get<Penguin>(Databases.Penguins, 'name', name);
    if (data === undefined) {
      return false;
    } else {
      const [penguin, id] = data;
      this.penguin = penguin;
      this.id = id;
      return true;
    }
  }

  create (name: string, mascot = 0): void {
    const found = this.getPenguinFromName(name);
    if (!found) {
      [this.penguin, this.id] = db.add<Penguin>(Databases.Penguins, {
        ...this.penguin,
        name,
        mascot
      });
    }
  }

  static getDefault (): Penguin {
    return {
      name: '',
      mascot: 0,
      is_member: true,
      is_agent: false,
      color: 1,
      head: 0,
      face: 0,
      neck: 0,
      body: 0,
      hand: 0,
      feet: 0,
      background: 0,
      pin: 0,
      registration_date: Date.now(),
      coins: 500,
      minutes_played: 0,
      inventory: [1],
      stamps: [],
      pins: [],
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
      igloo: {
        type: 0,
        music: 0,
        flooring: 0,
        furniture: []
      },
      furniture: {},
      mail: [],
      mailSeq: 0
    };
  }

  hasItem (item: number): boolean {
    return this.penguin.inventory.includes(item);
  }

  canBuy (item: number): boolean {
    // TODO
    return true;
  }

  addItem (item: number, cost: number = 0): void {
    this.penguin.inventory.push(item);
    this.removeCoins(cost);
    this.update();
    this.sendXt('ai', item, this.penguin.coins);
  }

  updateColor (color: number): void {
    this.penguin.color = color;
    this.update();
    this.sendXt('upc', this.id, color);
  }

  sendStamps (): void {
    this.sendXt('gps', this.id, this.penguin.stamps.join('|'));
  }

  getPinString (): string {
    const pins = this.penguin.pins.map((pin) => {
      // TODO -> middle is "date", third is member
      // Proper pin objects and information
      return [pin, 0, 0].join('|');
    });
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
    this.update();
    return recentStamps;
  }

  getEndgameStampsInformation (): [string, number, number, number] {
    const info: [string, number, number, number] = ['', 0, 0, 0];

    if (this.currentRoom in roomStamps) {
      let gameStamps = roomStamps[this.currentRoom];
      // manually removing stamps if using a version before it was available
      if (this.currentRoom === Room.JetPackAdventure) {
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
      info[1] = stamps.filter((stamp) => this.penguin.stamps.includes(stamp)).length;
      // total number of stamps the game has
      info[2] = stamps.length;

      // TODO check what this is used for
      info[3] = 0;
    }

    this.sessionStamps = [];

    return info;
  }

  addStamp (stamp: number, releaseVersion: GameVersion = STAMP_RELEASE_VERSION): void {
    if (isGreaterOrEqual(this.version, releaseVersion)) {
      this.penguin.stamps.push(stamp);
      this.penguin.stampbook.recent_stamps.push(stamp);
      this.sessionStamps.push(stamp);
      this.update();
    }
  }

  giveStamp(stamp: number): void {
    this.addStamp(stamp);
    this.sendXt('aabs', stamp);
  }
  
  addCoins (amount: number): void {
    this.penguin.coins += amount;
    this.update();
  }

  removeCoins (amount: number): void {
    this.penguin.coins -= amount
    this.update()
  }

  addPuffle (type: number, name: string): Puffle {
    this.penguin.puffleSeq += 1;
    const puffle = {
      id: this.penguin.puffleSeq,
      name,
      type,
      clean: 100,
      rest: 100,
      food: 100
    };
    this.penguin.puffles.push(puffle);
    this.update()
    return puffle
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

    return [
      this.penguin.igloo.type,
      this.penguin.igloo.music,
      this.penguin.igloo.flooring,
      furnitureString
    ].join('%');
  }

  walkPuffle (puffle: number) {
    this.walkingPuffle = puffle;
  }

  makeAgent (): void {
    this.penguin.is_agent = true;
    this.update();
  }

  sendPuffles (): void {
    const puffles = this.penguin.puffles.map((puffle) => {
      return [puffle.id, puffle.name, puffle.type, puffle.clean, puffle.food, puffle.rest, 100, 100, 100].join('|')
    })
    this.sendXt('pgu', ...puffles);
  }

  addPostcard (postcard: number, info: {
    senderId?: number
    senderName?: string
    details?: string    
  }): void {
    this.penguin.mailSeq += 1;
    const senderName = info.senderName ?? 'sys';
    const senderId = info.senderId ?? 0;
    const details = info.details ?? '';
    const timestamp = Date.now();
    this.penguin.mail.push({
      sender: {
        name: senderName,
        id: senderId
      },
      postcard: {
        postcardId: postcard,
        uid: this.penguin.mailSeq,
        details,
        timestamp,
        read: false
      }
    })
    this.sendXt('mr', senderName, senderId, postcard, details, timestamp, this.penguin.mailSeq);
    this.update();
  }

  setMailRead(): void {
    this.penguin.mail = this.penguin.mail.map((mail) => {
      const postcard = { ...mail.postcard, read: true };
      return { ...mail, postcard: postcard }
    })
    this.update()
  }

  unequipPuffle(): void {
    const puffles = [
      750, 751, 752, 753, 754, 755, 756, 757, 758, 759
    ];
    if (puffles.includes(this.penguin.hand)) {
      this.penguin.hand = 0;
      this.update();
    }
  }

  setAge(days: number): void {
    this.penguin.registration_date = Date.now() - days * 3600 * 24 * 1000;
    this.update();
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
    this.sendXt('lp', this.penguinString, String(this.penguin.coins), 0, 1440, 1727536687000, this.age, 0, this.penguin.minutes_played, -1, 7, 1, 4, 3);
  }

  setName(name: string): void {
    this.penguin.name = name;
    this.update();
  }

  swapMember(): void {
    this.penguin.is_member = !this.penguin.is_member;
    this.update();
  }

  getFurnitureString(): string {
    const furniture = []
    for (const id in this.penguin.furniture) {
      furniture.push([id, this.penguin.furniture[id]].join('|'))
    }
    return furniture.join('%')
  }

  addFurniture(furniture: number, cost: number = 0): void {
    this.removeCoins(cost);
    if (!(furniture in this.penguin.furniture)) {
      this.penguin.furniture[furniture] = 0;
    }
    this.penguin.furniture[furniture] += 1;

    this.update();
    this.sendXt('af', furniture, this.penguin.coins);
  }

  updateIglooFurniture(furniture: IglooFurniture): void {
    this.penguin.igloo.furniture = furniture;
    this.update();
  }
}
