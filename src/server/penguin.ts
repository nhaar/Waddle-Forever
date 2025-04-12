import { PenguinData, PlayerPuffle, Stampbook, RainbowPuffleStage, Mail, Igloo, parseJsonSet, parseJsonRows, parseJsonMap, dumpJsonSet, dumpJsonRows, dumpJsonMap, isRainbowStage } from './database';
import { PUFFLE_ITEMS } from './game/puffle-item';

export class Penguin {
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
  private _igloos: Map<number, Igloo>;
  private _igloo: number;
  private _iglooSeq: number;
  private _ownedMedals: number;
  private _careerMedals: number;

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
    this._igloos = parseJsonRows(data.igloos);
    this._iglooSeq = data.iglooSeq;
    this._ownedMedals = data.ownedMedals;
    this._careerMedals = data.careerMedals;
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
      igloos: dumpJsonRows(this._igloos),
      iglooSeq: this._iglooSeq,
      mail: this._mail,
      ownedMedals: this._ownedMedals,
      careerMedals: this._careerMedals
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

  resetRainbowQuest(): void {
    this._rainbow = {
      adoptability: false,
      currentTask: 0,
      coinsCollected: new Set<RainbowPuffleStage>(),
    };
  }

  get careerMedals(): number {
    return this._careerMedals;
  }

  get ownedMedals(): number {
    return this._ownedMedals;
  }

  addEpfMedals(amount: number): void {
    if (amount < 0 || !Number.isInteger(amount) || isNaN(amount)) {
      throw new Error(`Incorrect amount of EPF medals added: ${amount}`);
    }

    this._ownedMedals += amount;
    this._careerMedals += amount;
  }

  removeEpfMedals(amount: number): void {
    if (amount < 0 || !Number.isInteger(amount) || isNaN(amount)) {
      throw new Error (`Incorrect amount of EPF medals removed: ${amount}`);
    }

    this._ownedMedals -= amount;
    if (this._ownedMedals < 0) {
      this._ownedMedals = 0;
    }
  }

  get activeIgloo(): Igloo {
    return this.getIglooLayout(this._igloo);
  }

  setActiveIgloo(id: number): void {
    this._igloo = id;
  }

  updateIgloo(features: Partial<Igloo>): void {
    const igloo = this.activeIgloo;
    this._igloos.set(this._igloo, { ...igloo, ...features });
  }

  getIglooLayout(id: number): Igloo {
    const igloo = this._igloos.get(id);
    if (igloo === undefined) {
      throw new Error(`Unexistent igloo ID: ${id}`);
    }
    return igloo;
  }

  getAllIglooLayouts(): Igloo[] {
    return Array.from(this._igloos.values());
  }

  addIglooLayout(): Igloo {
    this._iglooSeq++;
    const id = this._iglooSeq;
    const igloo = Penguin.getDefaultIgloo(id)
    this._igloos.set(id, igloo);
    return igloo;
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
      igloo: 1,
      igloos: [Penguin.getDefaultIgloo(1)],
      furniture: {},
      iglooFloorings: [], // floorings inventory is a modern feature
      iglooTypes: [1],
      iglooLocations: [1],
      iglooSeq: 1,
      mail: [],
      mailSeq: 0,
      ownedMedals: 0,
      careerMedals: 0
    })
  }

  static getDefaultIgloo(id: number): Igloo {
    return {
      type: 1,
      music: 0,
      flooring: 0,
      furniture: [],
      locked: true,
      location: 1,
      id
    };
  }
}
