import { Igloo, Mail, PenguinJson, PlayerPuffle, RainbowPuffleStage, StampbookCover } from "@server/database/database";
import { CardJitsuProgress } from "@server/game-logic/ninja-progress";
import { getDefaultIgloo } from "@server/handlers/play/login";
import { processVersion } from "@server/routes/versions";
import { SettingsManager } from "@server/settings";

export type PenguinEquipped = {
  color: number
  head: number
  face: number
  neck: number
  body: number
  hand: number
  feet: number
  pin: number
  background: number  
}

export type RoomState = { x: number; y: number; frame: number; };

function getVirtualDate(date: [number, number, number], offset: number) {
  // simulating PST time for the current day
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  const [year, month, day] = date;

  // date generates this time thinking in the same timezone as the user
  // an arbitrary offset may be applied depending on how each client behaves
  return new Date(year, month - 1, day, hour + offset, minute, second);
}

class Profile {
  private _name: string;
  private _mascot: number;

  constructor(private _id: number, data: PenguinJson) {
    this._name = data.name;
    this._mascot = data.mascot;
  }

  get name() {
    return this._name;
  }

  public changeName(name: string) {
    this._name = name;
  }

  get mascot() {
    return this._mascot;
  }

  get id() {
    return this._id;
  }
}

class Membership {
  private _member: boolean;

  constructor(data: PenguinJson) {
    this._member = data.is_member;
  }

  public swap() {
    this._member = !this._member;
  }

  get isMember() {
    return this._member;
  }
}

class PSA {
  private _agent: boolean;
  private _pending = false;

  constructor(data: PenguinJson) {
    this._agent = data.is_agent;
  }

  get isAgent() {
    return this._agent;
  }

  setAgentPending() {
    this._pending = true;
  }

  public get isPending() {
    return this._pending;
  }

}

class Inventory {
  private _equipped: PenguinEquipped;
  private _items: Set<number>;

  constructor(data: PenguinJson) {
    this._equipped = {
      color: data.color,
      head: data.head,
      face: data.face,
      neck: data.neck,
      body: data.body,
      feet: data.feet,
      pin: data.pin,
      background: data.background,
      hand: data.hand
    };
    this._items = new Set(data.inventory);
  }

  public get color() {
    return this._equipped.color;
  }

  public get head() {
    return this._equipped.head;
  }

  public get face() {
    return this._equipped.face;
  }

  public get neck() {
    return this._equipped.neck;
  }

  public get body() {
    return this._equipped.body;
  }

  public get feet() {
    return this._equipped.feet;
  }

  public get hand() {
    return this._equipped.hand;
  }

  public get pin() {
    return this._equipped.pin;
  }

  public get background() {
    return this._equipped.background;
  }

  public get items() {
    return [...this._items.values()];
  }

  public updateWear(items: Partial<PenguinEquipped>) {
    this._equipped = { ... this._equipped, ...items };
  }

  public has(id: number): boolean {
    return this._items.has(id);
  }

  public add(id: number): void {
    this._items.add(id);
  }
}

class Currency {
  private _coins: number;

  constructor(data: PenguinJson) {
    this._coins = data.coins;
  }

  public get coins() {
    return this._coins;
  }

  public discount(coins: number) {
    this._coins -= coins;
    return this._coins;
  }

  public add(coins: number) {
    this._coins += coins;
    return this._coins;
  }
}

class Meta {
  private _registrationDate: number;

  constructor(data: PenguinJson) {
    this._registrationDate = data.registration_date;
  }

  public get registrationTime() {
    return this._registrationDate;
  }
}

class Time {
  private _previousPlaytime: number;
  private _sessionStart: number = Date.now();
  private _virtualRegistrationTimestamp: number;

  constructor(data: PenguinJson, private _virtualDay: [number, number, number]) {
    this._previousPlaytime = data.minutes_played;
    this._virtualRegistrationTimestamp = data.virtualRegistrationTimestamp;
  }

  public get minutesPlayed() {
    return this._previousPlaytime + (Date.now() - this._sessionStart) / (1000 * 60);
  }

  public get virtualRegistrationTimestamp() {
    return this._virtualRegistrationTimestamp;
  }

  public get age() {
    // converted into days
    return Math.floor((getVirtualDate(this._virtualDay, 0).getTime() - this._virtualRegistrationTimestamp) / 1000 / 86400);
  }

  public getDate() {
    return getVirtualDate(this._virtualDay, 0).getTime();
  }

  public setVirtualRegistrationToNow() {
    this._virtualRegistrationTimestamp = this.getDate();
  }
}

class BuddyInventory {
  private _buddies: Set<number>;

  constructor(data: PenguinJson) {
    this._buddies = new Set(data.buddies);
  }

  public get buddies() {
    return [...this._buddies.values()];
  }

  public isBuddy(id: number) {
    return this._buddies.has(id);
  }

  public add(id: number) {
    this._buddies.add(id);
  }

  public remove(id: number) {
    return this._buddies.delete(id);
  }
}

class Stampbook {
  private _stamps: Set<number>;
  private _cover: StampbookCover;
  private _sessionStamps = new Set<number>();
  
  constructor(data: PenguinJson) {
    this._stamps = new Set(data.stamps);
    this._cover = data.stampbook;
  }

  public get stamps() {
    return [...this._stamps.values()];
  }

  public get cover(): StampbookCover {
    return JSON.parse(JSON.stringify(this._cover));
  }

  public setCover(color: number, highlight: number, pattern: number, icon: number, stamps: Array<{
    stamp: number,
    x: number,
    y: number,
    rotation: number,
    depth: number
  }>) {
    this._cover = { ...this._cover, color, highlight, pattern, icon, stamps };
  }

  public add(stamp: number) {
    this._cover.recent_stamps.push(stamp);
    this._sessionStamps.add(stamp);
    this._stamps.add(stamp);
  }

  public has(stamp: number) {
    return this._stamps.has(stamp);
  }

  public get recentStamps() {
    return [...this._cover.recent_stamps];
  }

  public clearRecentStamps() {
    this._cover.recent_stamps = [];
  }

  public get sessionStamps() {
    return [...this._sessionStamps.values()];
  }

  public resetSessionStamps() {
    this._sessionStamps = new Set();
  }
}

class PuffleInventory {
  private _seq: number;
  private _puffles: Map<number, PlayerPuffle>;
  private _backyard: Set<number>;
  private _items: Map<number, number>;
  private _walking: number | null = null;

  constructor(data: PenguinJson) {
    this._seq = data.puffleSeq;
    this._puffles = new Map(data.puffles.map(p => [p.id, p]));
    this._backyard = new Set(data.backyard);
    this._items = new Map(Object.entries(data.puffleItems).map(([k, v]) => [Number(k), v]));
  }

  public get seq() {
    return this._seq;
  }

  public get puffles() {
    return [...this._puffles.values()];
  }

  public get backyard() {
    return [...this._backyard.values()];
  }

  public get items() {
    return Object.fromEntries(this._items.entries());
  }

  public getItemAmount(item: number) {
    return this._items.get(item) ?? 0;
  }

  public get walking() {
    return this._walking;
  }

  public getWalking() {
    if (this._walking === null) {
      return undefined;
    }
    return this._puffles.get(this._walking)
  }

  public unwalk() {
    this._walking = null;
  }

  public walk(id: number) {
    this._walking = id;
  }

  public isInBackyard(id: number) {
    return this._backyard.has(id);
  }

  public addPuffle(name: string, puffleType: number): PlayerPuffle {
    this._seq += 1;
    const id = this._seq;
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

  public toBackyard(id: number): void {
    this._backyard.add(id);
  }

  public fromBackyard(id: number): void {
    this._backyard.delete(id);
  }

  public addItem(itemId: number, amount: number): number {
    const owned = this._items.get(itemId) ?? 0 + amount;
    this._items.set(itemId, owned);
    return owned;
  }

  public getAllItems(): Array<[number, number]> {
    return [...this._items.entries()];
  }

  public getPuffle(id: number) {
    return this._puffles.get(id);
  }
}

class DigData {
  private _hasDug: boolean;
  private _treasureFinds: number[];
  private _colors = new Set<number>();

  constructor(data: PenguinJson) {
    this._hasDug = data.hasDug;
    this._treasureFinds = [...data.treasureFinds];
  }

  public get hasDug() {
    return this._hasDug;
  }

  public get treasureFinds() {
    return [...this._treasureFinds];
  }

  public addColor(color: number) {
    this._colors.add(color);
  }

  public get colorsDug() {
    return this._colors.size;
  }

  public addFind() {
    this._treasureFinds.push(Date.now());    
  }

  public get treasuresInLastDay() {
    const now = Date.now();
    const treasures = this._treasureFinds.filter(time => now - time < 24 * 3600 * 1000);
    this._treasureFinds = treasures;
    return treasures.length;
  }

  public clearFinds() {
    this._treasureFinds = [];
  }

  public setDug() {
    this._hasDug = true;
  }
}

class RainbowQuest {
  private _canAdopt: boolean;
  private _task: number;
  private _lastTaskCompletionTimestamp: number | null;
  private _collected: Set<RainbowPuffleStage>;

  constructor(data: PenguinJson) {
    this._canAdopt = data.rainbow.adoptability;
    this._task = data.rainbow.currentTask;
    this._lastTaskCompletionTimestamp = data.rainbow.latestTaskCompletionTime ?? null;
    this._collected = new Set(data.rainbow.coinsCollected);
  }

  public get canAdopt() {
    return this._canAdopt;
  }

  public setAdoptable() {
    this._canAdopt = true;
  }

  public resetQuest() {
    this._canAdopt = false;
    this._task = 0;
    this._collected = new Set();
  }

  public get task() {
    return this._task;
  }

  public get lastCompletionTime() {
    return this._lastTaskCompletionTimestamp;
  }

  public setCompleted(task: number) {
    this._task = task + 1;
    this._lastTaskCompletionTimestamp = Date.now() / 1000;
  }

  public setCollected(task: RainbowPuffleStage) {
    this._collected.add(task);
  }

  public get coinsCollected() {
    return [...this._collected.values()];
  }
}

class IglooInventory {
  private _selected: number;
  private _layouts: Map<number, Igloo>;
  private _seq: number;
  private _furniture: Map<number, number>;
  private _types: Set<number>;
  private _locations: Set<number>;
  private _floorings: Set<number>;

  constructor(data: PenguinJson) {
    this._selected = data.igloo;
    this._layouts = new Map(data.igloos.map(i => [i.id, i]));
    this._seq = data.iglooSeq;
    this._furniture = new Map(Object.entries(data.furniture).map(([k ,v]) => [Number(k), v]));
    this._types = new Set(data.iglooTypes);
    this._locations = new Set(data.iglooLocations);
    this._floorings = new Set(data.iglooFloorings);
  }

  public get selectedIgloo() {
    return this._selected;
  }

  public get activeIgloo() {
    const layout = this._layouts.get(this._selected);
    if (layout === undefined) {
      throw new Error('Selected igloo layout doesn\'t exist');
    }
    return layout;
  }

  public setActiveIgloo(index: number) {
    this._selected = index;
  }

  public setLocked(index: number, locked: boolean) {
    const prev = this._layouts.get(index);
    if (prev !== undefined && prev.locked !== locked) {
      this._layouts.set(index, { ...prev, locked });
    }
  }

  public addIglooLayout(): [number, Igloo] {
    this._seq++;
    const id = this._seq;
    const igloo = getDefaultIgloo(id);
    this._layouts.set(id, igloo);
    return [id, igloo];
  }

  public addIglooLocation(location: number) {
    this._locations.add(location);
  }

  public get layouts() {
    return [...this._layouts.values()];
  }

  public get seq() {
    return this._seq;
  }

  public get furniture() {
    return [...this._furniture.entries()];
  }

  public getFurnitureAmount(furnitureId: number) {
    return this._furniture.get(furnitureId) ?? 0;
  }

  public getAllFurniture(): Array<[number, number]> {
    return [...this._furniture.entries()];
  }

  public getAllLayouts(): Array<[number, Igloo]> {
    return [...this._layouts.entries()];
  }

  public addFurniture(furnitureId: number, amount: number) {
    this._furniture.set(furnitureId, this.getFurnitureAmount(furnitureId) + amount);
  }

  public addIglooType(iglooType: number) {
    this._types.add(iglooType);
  }

  public addFlooring(flooringId: number) {
    this._floorings.add(flooringId);
  }

  public updateIgloo(features: Partial<Igloo>): void {
    const igloo = this.activeIgloo;
    this._layouts.set(this._selected, { ...igloo, ...features });
  }

  public get types() {
    return [...this._types.values()];
  }

  public get locations() {
    return [...this._locations.values()];
  }

  public get floorings() {
    return [...this._floorings.values()];
  }
}

class MailInventory {
  private _seq: number;
  private _mail: Mail[];

  constructor(data: PenguinJson) {
    this._seq = data.mailSeq;
    this._mail = JSON.parse(JSON.stringify(data.mail));
  }

  public get seq() {
    return this._seq;
  }

  public get mail(): Mail[] {
    return JSON.parse(JSON.stringify(this._mail));
  }

  public get unread() {
    return this._mail.filter(m => !m.postcard.read).length;
  }

  public get total() {
    return this._mail.length;
  }

  public receivePostcard(postcard: number, info: {
    senderId?: number
    senderName?: string
    details?: string    
  }): Mail {
    this._seq += 1;
    const uid = this._seq;
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
}

class PuffleLaunchData {
  private _data: Buffer | null;

  constructor(data: PenguinJson) {
    this._data = data.puffleLaunchGameData === undefined ? (null) : (Buffer.from(data.puffleLaunchGameData, 'base64'));
  }

  public get data() {
    return this._data;
  }

  public set(data: Buffer) {
    this._data = data;
  }
}

class EpfInventory {
  private _careerMedals: number;
  private _medals: number;

  constructor(data: PenguinJson) {
    this._careerMedals = data.careerMedals;
    this._medals = data.ownedMedals;
  }

  public get careerMedals() {
    return this._careerMedals;
  }

  public get medals() {
    return this._medals;
  }

  public removeMedals(medals: number) {
    this._medals -= medals;
    return this._medals;
  }

  public addMedals(medals: number) {
    this._medals += medals;
    this._careerMedals += medals;
  }
}

class GoldPuffleInventory {
  private _nuggets: number;
  private _nuggetState: boolean = false;
  
  constructor(data: PenguinJson) {
    this._nuggets = data.nuggets;
  }

  public get nuggets() {
    return this._nuggets;
  }

  public reset() {
    this._nuggets = 0;
    this._nuggetState = false;
  }

  public get goldNuggetState() {
    return this._nuggetState;
  }

  public add(nuggets: number) {
    this._nuggets += nuggets;
  }

  public setState() {
    this._nuggetState = true;
  }
}

class NinjaProfile {
  private _cards: Map<number, number>;
  private _cardProgress: CardJitsuProgress;
  private _cardWins: number;
  private _fire: boolean;
  private _water: boolean;
  private _snow: boolean;

  constructor(data: PenguinJson) {
    this._cards = new Map(Object.entries(data.cards).map(([k, v]) => [Number(k), v]));
    this._cardProgress = new CardJitsuProgress(data.cardProgress, data.senseiAttempts, data.isNinja);
    this._cardWins = data.cardWins;
    this._fire = data.fireNinja ?? false;
    this._water = data.waterNinja ?? false;
    this._snow = data.snowNinja ?? false;
  }

  public get cards() {
    return [...this._cards.entries()];
  }

  public get xp() {
    return this._cardProgress.xp;
  }

  public get isNinja() {
    return this._cardProgress.isNinja;
  }

  public get senseiAttempts() {
    return this._cardProgress.senseiAttempts;
  }

  public get cardWins() {
    return this._cardWins;
  }

  public get isFireNinja() {
    return this._fire;
  }

  public get isWaterNinja() {
    return this._water;
  }

  public get isSnowNinja() {
    return this._snow;
  }

  public setFireNinja(value: boolean) {
    this._fire = value;
  }

  public setWaterNinja(value: boolean) {
    this._water = value;
  }

  public setSnowNinja(value: boolean) {
    this._snow = value;
  }

  public addCard(cardId: number, amount = 1): void {
    this._cards.set(cardId, (this._cards.get(cardId) ?? 0) + amount);
  }

  public addMatchProgress(won: boolean) {
    this._cardProgress.earnXP(won ? 5 : 1);
  }
}

class BattleOfDoomStatus {
  private _completed: boolean;

  constructor(data: PenguinJson) {
    this._completed = data.battleOfDoom;
  }

  public get completed() {
    return this._completed;
  }

  public setComplete() {
    this._completed = true;
  }
}

class Medieval2012Status {
  private _message: number;

  constructor(data: PenguinJson) {
    this._message = data.medieval2012Message ?? 0;
  }

  public get message() {
    return this._message;
  }
}

class UserPreference {
  private _save: boolean;
  private _safeChat: boolean;

  constructor(data: PenguinJson) {
    this._save = !(data.noSave ?? false);
    this._safeChat = data.safeChat ?? false;
  }

  public get canSave() {
    return this._save;
  }

  public get isSafeChat() {
    return this._safeChat;
  }

  public disableSave() {
    this._save = false;
  }

  public enableSave() {
    this._save = true;
  }

  public setSafeChat(value: boolean) {
    this._safeChat = value;
  }
}

class Avatar {
  private _id = 0;

  public get id() {
    return this._id;
  }

  public transform(id: number) {
    this._id = id;
  }
}

export class WorldPenguin {
  private _profile: Profile;
  private _membership: Membership;
  private _psa: PSA;
  private _inventory: Inventory;
  private _currency: Currency;
  private _meta: Meta;
  private _time: Time;
  private _buddies: BuddyInventory;
  private _stampbook: Stampbook;
  private _puffles: PuffleInventory;
  private _dig: DigData;
  private _rainbow: RainbowQuest;
  private _igloo: IglooInventory;
  private _mail: MailInventory;
  private _puffleLaunch: PuffleLaunchData;
  private _epf: EpfInventory;
  private _gold: GoldPuffleInventory;
  private _ninja: NinjaProfile;
  private _battleOfDoom: BattleOfDoomStatus;
  private _medieval2012: Medieval2012Status;
  private _preference: UserPreference;
  private _avatar = new Avatar();

  constructor(
    id: number,
    json: PenguinJson,
    settings: SettingsManager
  ) {
    this._profile = new Profile(id, json);
    this._membership = new Membership(json);
    this._psa = new PSA(json);
    this._inventory = new Inventory(json);
    this._currency = new Currency(json);
    this._meta = new Meta(json);
    this._time = new Time(json, processVersion(settings.settings.version));
    this._buddies = new BuddyInventory(json);
    this._stampbook = new Stampbook(json);
    this._puffles = new PuffleInventory(json);
    this._dig = new DigData(json);
    this._rainbow = new RainbowQuest(json);
    this._igloo = new IglooInventory(json);
    this._mail = new MailInventory(json);
    this._puffleLaunch = new PuffleLaunchData(json);
    this._epf = new EpfInventory(json);
    this._gold = new GoldPuffleInventory(json);
    this._ninja = new NinjaProfile(json);
    this._battleOfDoom = new BattleOfDoomStatus(json);
    this._medieval2012 = new Medieval2012Status(json);
    this._preference = new UserPreference(json);
  }

  public get id() {
    return this._profile.id;
  }

  public get name() {
    return this._profile.name;
  }

  public changeName(name: string) {
    this._profile.changeName(name);
  }

  public get mascot() {
    return this._profile.mascot;
  }

  public get puffle() {
    return this._puffles;
  }

  public get inventory() {
    return this._inventory;
  }

  public get psa() {
    return this._psa;
  }

  public get epf() {
    return this._epf;
  }

  public get battleOfDoom() {
    return this._battleOfDoom;
  }

  public get igloo() {
    return this._igloo;
  }

  public get buddy() {
    return this._buddies;
  }

  public get mail() {
    return this._mail;
  }

  public get currency() {
    return this._currency;
  }

  public get stampbook() {
    return this._stampbook;
  }

  public get membership() {
    return this._membership;
  }

  public get time() {
    return this._time;
  }

  public get preference() {
    return this._preference;
  }

  public get avatar() {
    return this._avatar;
  }

  public get puffleLaunch() {
    return this._puffleLaunch;
  }

  public get ninja() {
    return this._ninja;
  }

  public get rainbow() {
    return this._rainbow;
  }

  public get gold() {
    return this._gold;
  }

  public get dig() {
    return this._dig;
  }

  public getJSON(): PenguinJson {
    return {
      name: this._profile.name,
      mascot: this._profile.mascot,

      is_member: this._membership.isMember,

      is_agent: this._psa.isAgent,

      color: this._inventory.color,
      head: this._inventory.head,
      face: this._inventory.face,
      neck: this._inventory.neck,
      body: this._inventory.body,
      hand: this._inventory.hand,
      feet: this._inventory.feet,
      pin: this._inventory.pin,
      background: this._inventory.background,
      inventory: this._inventory.items,

      coins: this._currency.coins,

      registration_date: this._meta.registrationTime,

      minutes_played: this._time.minutesPlayed,
      virtualRegistrationTimestamp: this._time.virtualRegistrationTimestamp,

      buddies: this._buddies.buddies,

      stamps: this._stampbook.stamps,
      stampbook: this._stampbook.cover,

      puffleSeq: this._puffles.seq,
      puffles: this._puffles.puffles,
      backyard: this._puffles.backyard,
      puffleItems: this._puffles.items,

      hasDug: this._dig.hasDug,
      treasureFinds: this._dig.treasureFinds,

      rainbow: {
        adoptability: this._rainbow.canAdopt,
        currentTask: this._rainbow.task,
        latestTaskCompletionTime: this._rainbow.lastCompletionTime ?? undefined,
        coinsCollected: this._rainbow.coinsCollected
      },

      igloo: this._igloo.selectedIgloo,
      igloos: this._igloo.layouts,
      iglooSeq: this._igloo.seq,
      furniture: Object.fromEntries(this._igloo.furniture),
      iglooTypes: this._igloo.types,
      iglooLocations: this._igloo.locations,
      iglooFloorings: this._igloo.floorings,

      mail: this._mail.mail,
      mailSeq: this._mail.seq,

      puffleLaunchGameData: this._puffleLaunch.data === null ? undefined : this._puffleLaunch.data.toString('base64'),

      careerMedals: this._epf.careerMedals,
      ownedMedals: this._epf.medals,

      nuggets: this._gold.nuggets,

      cards: Object.fromEntries(this._ninja.cards),
      cardProgress: this._ninja.xp,
      isNinja: this._ninja.isNinja,
      senseiAttempts: this._ninja.senseiAttempts,
      cardWins: this._ninja.cardWins,
      fireNinja: this._ninja.isFireNinja,
      waterNinja: this._ninja.isWaterNinja,
      snowNinja: this._ninja.isSnowNinja,

      battleOfDoom: this._battleOfDoom.completed,

      medieval2012Message: this._medieval2012.message,

      noSave: !this._preference.canSave,
      safeChat: this._preference.isSafeChat
    }
  }
}

export type ContextAdder<T> = (client: WorldPenguin, entity: T) => void;
export type ContextRemover = (client: WorldPenguin) => void;

export abstract class WorldEntity {
  constructor(private onAdd: ContextAdder<WorldEntity>, private onRemove: ContextRemover) {

  }
  
  protected addClient(client: WorldPenguin) {
    this.onAdd(client, this);
  }

  protected removeClient(client: WorldPenguin) {
    this.onRemove(client);
  }
}