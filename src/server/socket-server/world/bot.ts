import { choose, clamp, isDisjoint, iterateEntries, randomInt, randomLogNormal, shuffleArray } from "@common/utils";
import { equipProp, EquipProp, PenguinEquipped, WorldPenguin } from "./world-penguin";
import { WorldRoom } from "./world-room";
import { GameData } from "@server/timelines/game-data";
import { World } from "./world";
import { ClientSocket } from "../socket-server";
import { WorldTable } from "./world-table";
import { FindFourTable } from "./find-four";
import { MancalaTable } from "./mancala";
import { CardJitsu, NinjaPlayer } from "./card";
import { getRoomFromName, IGLOO_ROOM_BASE, RoomName, ROOMS } from "@server/game-data/rooms";
import { ITEMS } from "@server/game-logic/items";
import { getItemTypeFromEquipProp } from "@server/timelines/items";

const CHANCE_NO_ITEM = 0.3;
const CHANCE_AVAILABLE_ITEM = 0.2;

export function generateRandomOutfit(
  data: GameData,
  inventory: number[]
): PenguinEquipped {
  const available = [...data.getAvailableItems().values()];
  const items: Array<[EquipProp, number]> = [];

  equipProp.forEach(prop => {
    const roll = Math.random();
    let item: number;
    if (prop !== 'color' && roll < CHANCE_NO_ITEM) {
      item = 0;
    } else {
      const itemPool = ((roll < CHANCE_NO_ITEM + CHANCE_AVAILABLE_ITEM) ? available : inventory)
        .filter(i => {
          const info = ITEMS.get(i);
          return info !== undefined && info.type === getItemTypeFromEquipProp(prop)
        });
        item = itemPool.length === 0 ? 0 : choose(itemPool);
    }

    items.push([prop, item]);
  });

  return Object.fromEntries(items) as PenguinEquipped;
}

export type WriteFunction = (b: Bot, ext: string, code: string, ...args: Array<string | number>) => void;
type SendFunction = (ext: string, code: string, ...args: Array<string | number>) => void;

// TODO -> Complete tracking of all walkable boxes
//         (If possible with a FFDEC script)
/**
 * Rough walkable box of a Club Penguin room. The resolution is 760x480, and most
 * floors sit in the lower half of it. Bots that pick a spot outside the walkable
 * area of a specific room just stand there, which is harmless.
 */
export const WALK_AREA = { minX: 120, maxX: 640, minY: 300, maxY: 440 };

// TODO -> Visitable rooms tracked by timeline
//      -> Room popularity
//      -> Member only rooms
/** Rooms bots are allowed to hang around in */
const BOT_ROOMS: RoomName[] = [
  'town', 'coffee', 'book', 'dance', 'lounge', 'shop', 'dock', 'village',
  'rink', 'forts', 'plaza', 'pet', 'pizza', 'mtn', 'beach', 'berg', 'light',
  'mine', 'cave', 'cove', 'dojo', 'lodge', 'attic', 'sport'
];

/** How long a bot "thinks" before playing a table move, in s */
const TABLE_THINK_MIN = 1.8;
const TABLE_THINK_MAX = 4.2;

/** Emote ids sent through `se` */
const EMOTES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];


// TODO -> Add safe chat lines
//         Richer library of lines
const CHAT_LINES = [
  'hi', 'hello!', 'sup', 'wanna be buddies?', 'brb', 'cool igloo',
  'lets go sledding', 'anyone wanna play find four?', 'nice hat',
  'im so bored', 'party at my igloo', 'waddle on', 'lol', 'thanks!',
  'where is everyone', 'first!', 'im a member', 'add me'
];

interface BotBrain {
  handle(name: string, args: string[]): void;
  dispose(): void;
}

class TableBrain implements BotBrain {
  private _timeout: NodeJS.Timeout;

  constructor(
    private _table: WorldTable,
    private _seat: number,
    private _room: WorldRoom,
    private _penguin: WorldPenguin,
    private _send: SendFunction,
    private _onEnd: () => void,
    private _rng: Rng
  ) {
    this._timeout = this.tableMove();
  }

  handle(name: string, args: string[]): void {
    
  }

  dispose(): void {
    clearTimeout(this._timeout);
    this._onEnd();
  }

  public tableMove(): NodeJS.Timeout {
    return setTimeout(() => {
      // human walked off, or the round was reset out from under us
      const stillSeated = this._table.getSeatIndex(this._penguin) === this._seat;
      const opponent = this._table.getSeats().some(p => p !== null);

      if (!stillSeated || !opponent) {
        this.dispose();
        return;
      }

      if (this._table.hasEnded()) {
        this.dispose();
        return;
      }
      if (!this._table.hasStarted() || this._table.getTurn() !== this._seat) {
        this._timeout = this.tableMove();
        return;
      }

      const moves = this.chooseTableMove();
      if (moves === null) {
        return;
      }
      this._send('z', 'zm', ...moves);
      this._timeout = this.tableMove();
    }, this._rng.int(TABLE_THINK_MIN, TABLE_THINK_MAX) * 1000);
  }

  private chooseTableMove(): number[] | null {
    if (this._table instanceof FindFourTable) {
      return this.chooseFindFourMove(this._table);
    }
    if (this._table instanceof MancalaTable) {
      return this.chooseMancalaMove(this._table);
    }
    return null;
  }

  private chooseFindFourMove(table: FindFourTable): number[] | null {
    const board = this.parseFindFour(table);
    const me = this._seat + 1;
    const them = this._seat === 0 ? 2 : 1;

    const options: Array<{ column: number; row: number }> = [];
    for (let x = 0; x < FindFourTable.FIND_FOUR_WIDTH; x++) {
      const row = this.dropRow(board[x] ?? []);
      if (row !== null) {
        options.push({ column: x, row });
      }
    }
    if (options.length === 0) {
      return null;
    }

    // win if possible
    for (const { column, row } of options) {
      if (this.isFindFourWin(board, column, row, me)) {
        return [column, row];
      }
    }
    // otherwise block
    for (const { column, row } of options) {
      if (this.isFindFourWin(board, column, row, them)) {
        return [column, row];
      }
    }
    // otherwise favour the middle, but not every single time
    if (Math.random() < 0.75) {
      const centre = (FindFourTable.FIND_FOUR_WIDTH - 1) / 2;
      const sorted = [...options].sort(
        (a, b) => Math.abs(a.column - centre) - Math.abs(b.column - centre)
      );
      const best = sorted.slice(0, 3);
      const choice = choose(best);
      return [choice.column, choice.row];
    }

    const choice = choose(options);
    return [choice.column, choice.row];
  }

  private chooseMancalaMove(table: MancalaTable): number[] | null {
    const board = table.serializeBoard().split(',').map(Number);
    if (board.length !== 14) {
      return null;
    }

    const legal: number[] = [];
    for (let cup = 0; cup < 14; cup++) {
      if (table.isMancalaCupForPlayer(this._seat, cup) && (board[cup] ?? 0) > 0) {
        legal.push(cup);
      }
    }
    if (legal.length === 0) {
      return null;
    }

    let free: number | null = null;
    let capture: number | null = null;

    for (const cup of legal) {
      // applyMancalaMove works on the array it is handed, so a copy simulates
      const result = table.applyMancalaMove([...board], this._seat, cup);
      if (result.command === 'f' && free === null) {
        free = cup;
      }
      if (result.command === 'c' && capture === null) {
        capture = cup;
      }
    }

    if (free !== null && Math.random() < 0.85) {
      return [free];
    }
    if (capture !== null && Math.random() < 0.75) {
      return [capture];
    }
    return [choose(legal)];
  }

  private parseFindFour(table: FindFourTable): number[][] {
    const values = table.serializeBoard().split(',').map(Number);
    const board: number[][] = [];
    for (let x = 0; x < FindFourTable.FIND_FOUR_WIDTH; x++) {
      const column: number[] = [];
      for (let y = 0; y < FindFourTable.FIND_FOUR_HEIGHT; y++) {
        column.push(values[x * FindFourTable.FIND_FOUR_HEIGHT + y] ?? 0);
      }
      board.push(column);
    }
    return board;
  }

  private dropRow(column: number[]): number | null {
    const height = FindFourTable.FIND_FOUR_HEIGHT;
    for (let y = height - 1; y >= 0; y--) {
      if (column[y] === 0) {
        return y;
      }
    }
    return null;
  }

  private isFindFourWin(board: number[][], x: number, y: number, value: number): boolean {
    const width = FindFourTable.FIND_FOUR_WIDTH;
    const height = FindFourTable.FIND_FOUR_HEIGHT;
    const dirs = [[1, 0], [0, 1], [1, 1], [1, -1]];

    return dirs.some(([dx, dy]) => {
      let count = 1;
      for (const sign of [1, -1]) {
        let cx = x + dx * sign;
        let cy = y + dy * sign;
        while (
          cx >= 0 && cx < width && cy >= 0 && cy < height &&
          board[cx]?.[cy] === value
        ) {
          count++;
          cx += dx * sign;
          cy += dy * sign;
        }
      }
      return count >= 4;
    });
  }
}

class CardJitsuBrain implements BotBrain {
  private _timeout: NodeJS.Timeout | null = null;

  constructor(
    private _game: CardJitsu,
    private _ninja: NinjaPlayer,
    private _seat: number,
    private _send: SendFunction,
    private _onEnd: () => void
  ) {

  }

  handle(name: string, args: string[]): void {
    if (name === 'zm') {
      if (args[0] === 'deal' && args[1] != String(this._seat)) {
        // remove deal and seat to find number of cards
        const amount = args.length - 2;
        this._send('z', 'zm', 'deal', amount);
        this._timeout = setTimeout(() => {
          const selectableCards = this._ninja.cards
            .map((sessionId) => [this._game.getCard(sessionId).element, sessionId])
            .filter(([element,]) => element !== this._ninja.blockedElement)
            .map(([,id]) => id);
          
          if (selectableCards.length === 0) {
            this._send('z', 'zm', 'death');
          } else {
            this._send('z', 'zm', 'pick', choose(selectableCards));
          }
          
        }, clamp(randomLogNormal(1.2, 0.8), 1, 20) * 1000);
      }
    } else if (name === 'czo' || name === 'cz') {
      // packets that terminate the match
      this.dispose();
    }
  }

  dispose(): void {
    if (this._timeout !== null) {
      clearTimeout(this._timeout);
    }
    this._onEnd();
  }
}

type BotAttributes = {
  emptyRoomTolerance: number;
  roomDistraction: number;
  snowballFan: number;
  waveFan: number;
  sitFan: number;
  danceFan: number;
  chatFan: number;
  emoteFan: number;
  walkFan: number;
  iglooFan: number;
  secretsFan: number;
  followability: number;
  mythsFan: number;
  stampsFan: number;
  musicFan: number;
}

enum BehaviorId {
  RandomDance,
  RandomSnowball,
  RandomWave,
  RandomSit,
  RandomMessage,
  RandomEmote,
  RandomWalk,
  LeaveRoom,
  HostIgloo,
  JoinDanceFloor,
  MatchDanceColor,
  TipTheBerg,
  FormBand
}

// this variable is usede to access all behaviors at compile time
const allBehaviors: Record<BehaviorId, 0> = {
  [BehaviorId.RandomDance]: 0,
  [BehaviorId.RandomSnowball]: 0,
  [BehaviorId.RandomWave]: 0,
  [BehaviorId.RandomSit]: 0,
  [BehaviorId.RandomMessage]: 0,
  [BehaviorId.RandomWalk]: 0,
  [BehaviorId.RandomEmote]: 0,
  [BehaviorId.LeaveRoom]: 0,
  [BehaviorId.HostIgloo]: 0,
  [BehaviorId.JoinDanceFloor]: 0,
  [BehaviorId.MatchDanceColor]: 0,
  [BehaviorId.TipTheBerg]: 0,
  [BehaviorId.FormBand]: 0
}

interface Behavior {
  readonly id: BehaviorId;
  readonly uses: readonly Resource[];
  success(ctx: BotContext): boolean;
  duration(ctx: BotContext): number;
  cooldown(ctx: BotContext): number;
  start(ctx: BotContext): void;
  end?(ctx: BotContext): void;
}

interface BotContext {
  bot: Bot;
  room: WorldRoom;
  now: number;
  attrs: BotAttributes;
  rng: Rng;
}

interface Rng {
  random(): number;
  int(a: number, b: number): number;
  choose<T>(xs: T[]): T;
  logNormal(mu: number, sigma: number): number;
}

const eagerness = (attr: number, max: number) => (1 - attr) * max;
const stamina = (attr: number, max: number) => (attr + 1) * max;

type Resource = 'locomotion' | 'pose' | 'voice' | 'appearance' | 'room';

const BEHAVIORS: Behavior[] = [
  {
    id: BehaviorId.RandomDance,
    uses: ['pose'],
    duration({ rng, attrs }) {
      return stamina(attrs.danceFan, rng.random() * 20);
    },
    cooldown({ rng, attrs }) {
      return eagerness(attrs.danceFan, rng.random() * 30);
    },
    success({ rng, attrs }) {
      return attrs.danceFan > rng.random();
    },
    start({ bot }) {
      bot.doDance();
    }
  },
  {
    id: BehaviorId.RandomSnowball,
    uses: ['pose'],
    duration() {
      return 0;
    },
    cooldown({ rng, attrs }) {
      return eagerness(attrs.snowballFan, rng.random() * 30);
    },
    success({ rng, attrs }) {
      return attrs.snowballFan > rng.random();
    },
    start({ bot }) {
      bot.throwSnowball(randomInt(WALK_AREA.minX, WALK_AREA.maxX), randomInt(WALK_AREA.minY, WALK_AREA.maxY));
    },
  },
  {
    id: BehaviorId.RandomSit,
    uses: ['pose'],
    duration({ rng, attrs }) {
      return stamina(attrs.sitFan, rng.random() * 20);
    },
    cooldown({ rng, attrs }) {
      return eagerness(attrs.sitFan, rng.random() * 30);
    },
    success({ rng, attrs }) {
      return attrs.sitFan > rng.random();
    },
    start({ bot }) {
      bot.doFrame(choose([17, 18, 19, 20, 21, 22, 23, 24]));
    },
  },
  {
    id: BehaviorId.RandomWalk,
    uses: ['locomotion'],
    duration() {
      return 0
    },
    cooldown({ rng, attrs }) {
      return eagerness(attrs.walkFan, rng.random() * 30);
    },
    success({ attrs }) {
      return attrs.walkFan > Math.random();
    },
    start({ bot, rng }) {
      bot.walkTo(rng.int(WALK_AREA.minX, WALK_AREA.maxX), rng.int(WALK_AREA.minY, WALK_AREA.maxY));
    }
  },
  {
    id: BehaviorId.RandomMessage,
    uses: ['voice'],
    duration() {
      return 5;
    },
    cooldown({ rng, attrs }) {
      return eagerness(attrs.chatFan, rng.random() * 30);
    },
    success({ rng, attrs }) {
      return attrs.chatFan > rng.random();
    },
    start({ bot, rng }) {
      bot.sendMessage(rng.choose(CHAT_LINES));
    }
  },
  {
    id: BehaviorId.RandomEmote,
    uses: ['voice'],
    duration() {
      return 5;
    },
    cooldown({ rng, attrs }) {
      return eagerness(attrs.emoteFan, rng.random() * 30);
    },
    success({ rng, attrs }) {
      return attrs.emoteFan > rng.random();
    },
    start({ bot, rng }) {
      bot.doEmote(rng.choose(EMOTES));
    }
  },
  {
    id: BehaviorId.RandomWave,
    uses: ['pose'],
    duration() {
      return 0;
    },
    cooldown({ rng, attrs }) {
      return eagerness(attrs.waveFan, rng.random() * 30);
    },
    success({ rng, attrs }) {
      return attrs.waveFan > rng.random();
    },
    start({ bot }) {
      bot.doFrame(25);
    },
  },
  {
    id: BehaviorId.LeaveRoom,
    uses: ['room'],
    duration() {
      return 0;
    },
    cooldown({ rng, attrs }) {
      return eagerness(attrs.roomDistraction, rng.random() * 300);
    },
    success({ rng, attrs, room }) {
      return (rng.random() * attrs.emptyRoomTolerance + (1 - attrs.emptyRoomTolerance) * clamp(room.players.length / 30, 0, 30)) < 0.5;
    },
    start({ bot }) {
      bot.enter(bot.chooseRoom());
    }
  },
  {
    id: BehaviorId.HostIgloo,
    uses: ['room'],
    duration({ rng, attrs }) {
      return stamina(attrs.iglooFan, rng.random() * 900);
    },
    cooldown({ rng, attrs }) {
      return eagerness(attrs.roomDistraction, rng.random() * 300);
    },
    success({ rng, attrs }) {
      return rng.random() * attrs.iglooFan > 0.9;
    },
    start({ bot }) {
      bot.enter(IGLOO_ROOM_BASE + bot.penguin.id);
      bot.openIgloo();
    },
  },
  {
    id: BehaviorId.JoinDanceFloor,
    uses: ['locomotion', 'pose', 'room'],
    duration({ rng, attrs }) {
      return stamina(attrs.danceFan, rng.random() * 180);
    },
    cooldown({ rng, attrs }) {
      return eagerness(attrs.danceFan, rng.random() * 30);
    },
    success({ room, rng, attrs }) {
      return room.id === ROOMS.dance.id && (rng.random() * attrs.danceFan > 0.3); 
    },
    start({ bot }) {
      bot.joinDanceFloor();
    },
  },
  {
    id: BehaviorId.MatchDanceColor,
    uses: ['appearance'],
    duration() {
      return 0;
    },
    cooldown({ rng, attrs }) {
      return eagerness(attrs.secretsFan, rng.random() * 30);
    },
    success({ bot, rng, attrs, now }) {
      return bot.isDoingAction(BehaviorId.JoinDanceFloor, now) && rng.random() * attrs.danceFan > 0.3;
    },
    start({ room, bot }) {
      const colors = new Map<number, number>();
      room.players.forEach((p) => {
        colors.set(p.inventory.color, (colors.get(p.inventory.color) ?? 0) + 1);
      });
      const entries = [...colors.entries()];
      let mostPopular = entries[0][0];
      let mostAmount = entries[0][1];
      for (const [id, amount] of entries.slice(1)) {
        if (amount > mostAmount) {
          mostAmount = amount;
          mostPopular = id;
        }
      }
      bot.schedule(() => {
        bot.wearItem('color', mostPopular);
      }, 4 + Math.random() * 2);
    }
  },
  {
    id: BehaviorId.TipTheBerg,
    uses: ['locomotion', 'pose', 'appearance', 'room'],
    duration({ rng, attrs }) {
      return stamina(Math.pow(Math.max(attrs.mythsFan, attrs.stampsFan), 2), rng.random() * 600);
    },
    cooldown({ rng, attrs }) {
      return eagerness(Math.max(attrs.mythsFan, attrs.stampsFan), rng.random() * 120);
    },
    success({ room, attrs, rng }) {
      return room.id === ROOMS.berg.id && Math.max(attrs.mythsFan, attrs.stampsFan) > rng.random();
    },
    start({ bot, rng }) {
      bot.wearItem('head', 429);
      bot.wearItem('face', 0);
      bot.wearItem('neck', 0);
      bot.wearItem('body', 0);
      bot.wearItem('hand', 0);
      bot.wearItem('feet', 0);
      bot.schedule(() => {
        bot.doDance();
      }, bot.walkTo(rng.int(80, 120), rng.int(150, 350)));
    },
    end({ bot }) {
      bot.wearOutfit();
    },
  },
  {
    id: BehaviorId.FormBand,
    uses: ['locomotion', 'appearance', 'pose', 'room'],
    duration({ rng, attrs }) {
      return stamina(Math.pow(Math.max(attrs.musicFan, attrs.stampsFan), 2), rng.random() * 600);
    },
    cooldown({ rng, attrs }) {
      return eagerness(Math.max(attrs.musicFan, attrs.stampsFan), rng.random() * 120);
    },
    success({ attrs, rng, room }) {
      return room.id === ROOMS.light.id && Math.max(attrs.musicFan, attrs.stampsFan) > rng.random();
    },
    start({ bot, rng }) {
      bot.joinBand(rng.random(), rng.random());
    },
    end({ bot }) {
      bot.wearOutfit();
    }
  }
];

// generate a more optimized mapping of all the allowed behaviors
const allowedMapping: Record<BehaviorId, BehaviorId[]> = Object.fromEntries(Object.keys(allBehaviors).map(v => [Number(v), []])) as Record<BehaviorId, BehaviorId[]>;
BEHAVIORS.forEach((behavior, i) => {
  for (let j = i + 1; j < BEHAVIORS.length; j++) {
    const other = BEHAVIORS[j];
    if (isDisjoint(behavior.uses, other.uses)) {
      allowedMapping[behavior.id].push(other.id);
      allowedMapping[other.id].push(behavior.id);
    }  
  }
});

export class Bot implements ClientSocket {
  private _brain: BotBrain | null = null;
  public get busy () {
    return this._brain !== null;
  }
  private _timers = new Set<NodeJS.Timeout>();

  private _simulate: (ext: string, code: string, ...args: Array<string | number>) => void;

  private _lenghts: Record<BehaviorId, number> = { ...allBehaviors };
  private _cooldowns: Record<BehaviorId, number> = { ...allBehaviors };
  private _rng: Rng = {
    random() {
      return Math.random()
    },
    choose(xs) {
      return choose(xs);
    },
    int(a, b) {
      return randomInt(a, b);
    },
    logNormal(mu, sigma) {
      return randomLogNormal(mu, sigma);
    }
  }

  constructor(
    private _penguin: WorldPenguin,
    private _data: GameData,
    private _world: World,
    public nextActionAt: number,
    writeFn: WriteFunction,
    private _attributes: BotAttributes
  ) {
    this._simulate = (e, c, ...a) => writeFn(this, e, c, ...a);
  }

  public get penguin() {
    return this._penguin;
  }

  public enter(id: number): void {
    this._simulate('s', this._data.isPreCpip() ? 'jr' : 'j#jr', id,
      randomInt(WALK_AREA.minX, WALK_AREA.maxX),
      randomInt(WALK_AREA.minY, WALK_AREA.maxY)
    );
  }

  public schedule(fn: () => void, seconds: number): NodeJS.Timeout {
    const t = setTimeout(() => {
      this._timers.delete(t);
      fn();
    }, seconds * 1000);

    this._timers.add(t);
    return t;
  }

  private clearAllTimers() {
    this._timers.forEach(clearTimeout);
    this._timers.clear();
  }

  public async write(message: string): Promise<void> {
    const split = message.split('%');
    const name = split[2];
    const args = split.slice(4, split.length - 1);

    this.handle(name, args);
  }

  private reactToMessage(message: string) {
    message = message.toLowerCase();

    // attempt to match a two or one word name, for the room
    const commandMatch = message.match(/^come to (\w+)( \w+)?$/i);
    if (commandMatch !== null) {
      const doubleName = commandMatch[1] + commandMatch[2];
      const singleName = commandMatch[1];
      const room = getRoomFromName(doubleName) ?? getRoomFromName(singleName);
      if (room !== undefined && this._attributes.roomDistraction * this._attributes.followability > Math.pow(Math.random(), 2)) {

        this.schedule(() => {
          this.stopAllActions();
          this.enter(room);
        }, 2 * (Math.random() + 1));
      }
    }
  }

  private stopAllActions() {
    this._lenghts = { ...allBehaviors };
    this.clearAllTimers();
  }

  private exitGameMode() {
    this.enter(this.chooseRoom());
  }

  private handleOverworld(message: string, args: string[]): void {
    if (message === 'jt') {
      const room = this._world.getPenguinRoom(this._penguin);
      this._brain = new TableBrain(
        room.getTable(Number(args[0])),
        Number(args[1]) - 1,
        room,
        this._penguin,
        this._simulate,
        () => {
          this.exitGameMode();
          this._brain = null;
        },
        this._rng
      );
      this._simulate('z', 'gz');
      this._simulate('z', 'jz');
    } else if (message === 'sm') {
      this.reactToMessage(args[1]);
    }
  }
  

  private handle(name: string, args: string[]): void {
    this._brain?.handle(name, args) ?? this.handleOverworld(name, args);
  }

  public joinCard(card: CardJitsu): void {
    this._brain = new CardJitsuBrain(
      card,
      card.getNinja(this._penguin),
      card.getSeatId(this._penguin),
      this._simulate,
      () => {
        this._brain = null;
        this.exitGameMode();
      }
    );
  }

  public sitAtTable(tableId: number): void {
    this._simulate('s', this._data.isPreCpip() ? 'jt' : 'a#jt', tableId);
  }

  public throwSnowball(x: number, y: number) {
    if (this._data.isPreCpip()) {
      this._simulate('s', 'sb', x, y);
    } else {
      this._simulate('s', 'u#sb', x, y);
    }
  }

  public doEmote(emote: number) {
    if (this._data.isPreCpip()) {
      this._simulate('s', 'se', emote);
    } else {
      this._simulate('s', 'u#se', emote);
    }
  }

  public doFrame(frame: number) {
    if (this._data.isPreCpip()) {
      this._simulate('s', 'sf', frame);
    } else {
      this._simulate('s', 'u#sf', frame);
    }
  }

  public sendMessage(message: string) {
    if (this._data.isPreCpip()) {
      this._simulate('m', 'sm', this._penguin.id, message);
    } else {
      this._simulate('s', 'm#sm', this._penguin.id, message);
    }
  }

  /** Returns time in seconds to walk that distance */
  public walkTo(x: number, y: number): number {
    const state = this._world.getPenguinRoom(this._penguin).getState(this._penguin);
    const distance = Math.sqrt(Math.pow(x - state.x, 2) + Math.pow(y - state.y, 2));
    this._simulate('s', this._data.isPreCpip() ? 'sp' : 'u#sp', x, y);

    // 4.8 pixels per frame at 24 fps
    // exgtra time of lenience
    return distance / 4.8 / 24 + 1;
  }

  public chooseRoom(): number {
    return ROOMS[choose(BOT_ROOMS)].id;
  }

  public openIgloo(): void {
    if (this._data.isPreCpip()) {
      this._simulate('r', 'or', this.penguin.id);
    } else {
      this._simulate('s', 'g#or', this.penguin.id, this.penguin.name);
    }
  }

  public doDance(): void {
    this.doFrame(26);
  }

  public joinDanceFloor(): void {
    const y = randomInt(267,413);
    const minX = (149-205) / (413-267) * (y - 267) + 205;
    const maxX = (489-442) / (413-267) * (y - 267) + 489;
    this.schedule(() => {
      this.doDance();
    }, this.walkTo(randomInt(minX, maxX), y));
  }

  public joinBand(deltaX: number, deltaY: number): void {
    const BAND_ROLES: Array<[EquipProp, number, [number, number]]> = [
      ['hand', 233, [117, 337]],
      ['hand', 234, [139, 302]],
      ['hand', 729, [43, 308]],
      ['body', 293, [44, 351]],
      ['hand', 5014, [176, 268]],
      ['hand', 340, [87, 225]]
    ];

    const taken = BAND_ROLES.map(() => false);

    const room = this._world.getPenguinRoom(this._penguin);
    room.players.forEach(p => {
      let i = 0;
      for (const [prop, id] of BAND_ROLES) {
        if (p.inventory[prop] === id) {
          taken[i] = true;
          break;
        }
        i++;
      }
    });

    const notYetTaken = taken.map((v, i): [number, boolean] => [i, v]).filter(([,v]) => !v);
    const roleIndex = notYetTaken.length === 0 ? randomInt(0, BAND_ROLES.length - 1) : choose(notYetTaken)[0];

    const role = BAND_ROLES[roleIndex];
    const x = Math.round(role[2][0] + (deltaX - 0.5) * 30);
    const y = Math.round(role[2][1] + (deltaY - 0.5) * 30);

    this.wearItem('body', 0);
    this.wearItem('hand', 0);
    this.wearItem('face', 0);
    this.wearItem('feet', 0);
    this.wearItem('head', 0);
    this.wearItem('neck', 0);
    this.wearItem(role[0], role[1]);
    this.schedule(() => {
      this.doDance();
    }, this.walkTo(x, y));
  }

  public wearOutfit(): void {
    const outfit = generateRandomOutfit(this._data, [...this._penguin.inventory.items]);
    equipProp.forEach(prop => {
      this.wearItem(prop, outfit[prop]);
    })
  }

  public wearItem(type: EquipProp, id: number): void {
    const code = {
      'color': 'c',
      'head': 'h',
      'neck': 'n',
      'hand': 'a',
      'body': 'b',
      'feet': 'e',
      'face': 'f'
    }[type];
    this._penguin.inventory.updateWear({ [type]: id });
    if (code !== undefined) {
      this._simulate('s', `s#up${code}`, id);
    }
  }

  public act(): void {
    const room = this._world.getPenguinRoom(this.penguin);
    if (room === undefined) {
      return;
    }

    const now = Date.now();

    const allowed = new Set<BehaviorId>();
    let ongoing = false;
    iterateEntries(this._lenghts, (behavior, time) => {
      if (time > now) {
        ongoing = true;
        allowedMapping[Number(behavior) as BehaviorId].forEach(b => {
          allowed.add(b);
        });
      }
    });

    const takeAllowedIntoAccount = ongoing;

    const ctx: BotContext = {
      bot: this,
      room: this._world.getPenguinRoom(this._penguin),
      rng: this._rng,
      now: Date.now(),
      attrs: this._attributes
    }

    for (const action of shuffleArray(BEHAVIORS)) {
      if (takeAllowedIntoAccount && !allowed.has(action.id)) {
        continue;
      }

      if (action.success(ctx)) {
        const len = action.duration(ctx);
        const cooldown = action.cooldown(ctx);
        action.start(ctx);
        if (action.end !== undefined) {
          this.schedule(() => {
            action.end(ctx);
          }, len);
        }
        this._lenghts[action.id] = now + len * 1000;
        this._cooldowns[action.id] = now + (len + cooldown) * 1000;
        break;
      }
    }
  }

  public isDoingAction(id: BehaviorId, now: number): boolean {
    return this._lenghts[id] > now;
  }

  public end() {};
  public buffer = '';
}