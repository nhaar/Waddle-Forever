import { Igloo, IglooFurniture } from "@server/database";
import { isFlag } from "@server/game-logic/flags";
import { ItemType } from "@server/game-logic/items";
import { CardJitsuProgress } from "@server/game-logic/ninja-progress";
import { PUFFLES } from "@server/game-logic/puffle";
import { Room } from "@server/game-logic/rooms";
import { Penguin } from "@server/penguin";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { getXtMessage } from "..";
import { PenguinMessenger } from "./world-client";

export type RoomState = { x: number; y: number; frame: number; };

export class WorldPenguin {
  private _avatar = 0;
  private _walkingPuffle: number | null = null;
  private _sessionStamps: number[] = [];
  private _sessionStart = Date.now();
  private agentPending = false;

  constructor(private client: PenguinMessenger, private penguin: Penguin, private gameData: GameData, private settings: SettingsManager) {

  }

  public async sendXt(message: string, ...args: Array<string | number>) {
    
    await this.client.send(message, ...args);
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
    
    this.client.send(
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
    
    this.client.sendLastless(handler, ...args);
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