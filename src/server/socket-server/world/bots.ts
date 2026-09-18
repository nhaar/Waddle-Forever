/**
 * Handles NPCs (bots)
 */

import { getDefaultPenguin, PenguinJson } from '@server/database/database';
import { SettingsManager } from '@server/settings';
import { GameData } from '@server/timelines/game-data';
import { World } from './world';
import { WorldPenguin } from './world-penguin';
import { WorldRoom } from './world-room';
import { choose, clamp, randomInt } from '@common/utils';
import { Bot, generateRandomOutfit, WriteFunction } from './bot';
import { FindFourTable } from './find-four';
import { MancalaTable } from './mancala';
import { PenguinMessenger } from '../messenger';
import { joinWaddle } from '../handlers/room';
import { getItemsInRange } from '@server/timelines/items';
import { addDays, getDaysDelta, versionToEpoch } from '@server/routes/versions';
import { ITEMS } from '@server/game-logic/items';
import { START_DATE } from '@server/timelines/dates';

const BOT_ID_BASE = 9_000_000;

const isBot = (p: WorldPenguin): boolean => p.id >= BOT_ID_BASE;




// TODO -> Easter Egg names
//         Game Day NPCs
//         Richer library of name parts
const NAME_PARTS_A = [
  'Cool', 'Snow', 'Ice', 'Fluffy', 'Turbo', 'Frosty', 'Mega', 'Blue',
  'Puffle', 'Wacky', 'Sunny', 'Rocket', 'Jolly', 'Waddle', 'Chill', 'Zippy'
];
const NAME_PARTS_B = [
  'Penguin', 'Flipper', 'Waddler', 'Bean', 'Beak', 'Berg', 'Wing', 'Paws',
  'Puff', 'Slider', 'Nugget', 'Pop', 'Hopper', 'Dude', 'Star', 'Fish'
];

// TODO -> Similar to item trackign system, a furniture and igloo type/music tracking system
// temporary set of furniture
const FURNITURE_SETS = [
  [1, 2, 3, 4, 5, 6],       // pink
  [10, 11, 12, 13, 14],     // log
  [21, 22, 23, 24, 25, 26], // blue
  [31, 32, 33]              // coffee
];
const IGLOO_TYPES = [1, 2, 3];
const IGLOO_MUSIC = [0, 1, 2, 5, 20];

// TODO -> Documenting spawnable areas for each igloo
//      -> Igloo presets ? (Would involve creating a large database of igloos)
// places to spawn furniture
const FURNITURE_SPOTS: Array<[number, number]> = [
  [180, 260], [300, 240], [420, 240], [540, 260],
  [200, 360], [330, 380], [460, 380], [580, 360],
  [260, 300], [500, 300]
];

/** How long a human sits alone in a waddle before bots start joining, in ms */
const WADDLE_JOIN_DELAY = 4000;
/** Gap between two bots taking waddle seats, in ms */
const WADDLE_SEAT_GAP = 2500;

type BotSettings = {
  /** How many bots exist on the island at once */
  population: number;
  /** Chance (0-1) that a wandering bot picks the room you are standing in */
  followChance: number;
  /** Chance (0-1) that a bot says something instead of moving */
  chatChance: number;
  /** Milliseconds between the fastest and slowest bot action */
  minDelay: number;
  maxDelay: number;
  /** Whether bots sit down in waddles and play them */
  playGames: boolean;
  /** How many bots keep an open igloo at any one time */
  openIgloos: number;
};

const DEFAULT_BOT_SETTINGS: BotSettings = {
  population: 0,
  followChance: 0.5,
  chatChance: 0.08,
  minDelay: 2500,
  maxDelay: 9000,
  playGames: true,
  openIgloos: 3
};

const MAX_SIZE = 500;

const MEMBER_CHANCE = 0.6;

// for simplicity the member items won't be added (but this could be changed if there was a reason for it)
function generateRandomInventory(data: GameData, age: number, member: boolean) {
  const available = [...data.getAvailableItems().values()];
  const possibleInventory = [...new Set([...available, ...getItemsInRange(addDays(data.getDate(), -age), data.getDate()).values()])].filter(i => {
    const info = ITEMS.get(i);
    return info !== undefined && (member || !info.isMember);
  });

  return possibleInventory.filter(() => Math.random() > 0.5);
}

function generateRandomPenguin(data: GameData): PenguinJson {
  const name = `${choose(NAME_PARTS_A)}${choose(NAME_PARTS_B)}${randomInt(1, 999)}`;
  // TODO -> more realistic distribution
  const age = randomInt(0, getDaysDelta(START_DATE, data.getDate()));
  const isMember = Math.random() <= MEMBER_CHANCE;
  const base = getDefaultPenguin(
    name,
    1,
    isMember,
    versionToEpoch(data.getDate())
  );

  const inventory = generateRandomInventory(data, age, isMember);
  const outfit = generateRandomOutfit(data, inventory);

  return {
    ...base,
    ...outfit,
    inventory,
    // never let a bot be written to the penguin database
    noSave: true
  };
}

export class BotManager {
  private _bots = new Map<number, Bot>();
  private _nextId = BOT_ID_BASE;
  private _timer: NodeJS.Timeout | null = null;
  private _settings: BotSettings = { ...DEFAULT_BOT_SETTINGS };
  /** Bots sitting in a waddle or at a table, which must stop waddling about */
  /** Bots currently at home with an open igloo, and when they will head back out */
  private _on = false;
  private _waddleSeen = new Map<number, number>();
  private _waddleLastSeat = new Map<number, number>();

  constructor(
    private _world: World,
    private _msg: PenguinMessenger,
    private _data: GameData,
    private _appSettings: SettingsManager,
    private _writeFn: WriteFunction,
    private disconnect: (b: Bot) => void
  ) {
  }

  public setOff() {
    this._on = false;
    this._settings.population = 0;
    this.syncPopulation();
    this.stop();
  }

  /** Spawns a bot straight into one room and returns it */
  public spawnInto(roomId: number): Bot {
    if (!this._on || this._bots.size > MAX_SIZE) {
      return undefined;
    }
    this._settings.population += 1;
    return this.spawn(roomId);
  }

  public configure(partial: Partial<BotSettings>): void {
    this._settings = { ...this._settings, ...partial };
  }

  private setOn() {
    if (this._settings.population > 0) {
      this._on = true;
      this.start();
    }
  }

  public setPopulation(n: number): void {
    this._settings.population = clamp(n, 0, MAX_SIZE);
    if (n > 0) {
      this.setOn();
      this.syncPopulation();
    }
  }

  /** Spawns `count` extra bots directly into one room and keeps them around */
  public addAt(roomId: number, count: number): void {
    this._settings.population = Math.min(this._settings.population + count, MAX_SIZE);
    for (let i = 0; i < count; i++) {
      if (this._bots.size >= this._settings.population) {
        break;
      }
      this.spawn(roomId);
    }
    this.setOn();
  }

  public start(): void {
    if (this._timer === null) {
      this._timer = setInterval(() => this.tick(), 1000);
      // don't hold the process open just for bots
      this._timer.unref?.();
    }
  }

  public stop(): void {
    if (this._timer !== null) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  /** Removes every bot and stops the loop. Call this when the world is reset. */
  public shutdown(): void {
    this.stop();
    [...this._bots.keys()].forEach(id => this.despawn(id));
  }

  // -------------------------------------------------------------------------
  // population
  // -------------------------------------------------------------------------

  private syncPopulation(): void {
    while (this._bots.size < this._settings.population) {
      this.spawn();
    }
    while (this._bots.size > this._settings.population) {
      const idle = [...this._bots.entries()].find(
        ([, b]) => !b.busy
      );
      const id = idle?.[0] ?? [...this._bots.keys()][0];
      if (id === undefined) {
        break;
      }
      this.despawn(id);
    }
  }

  private makeJson(): PenguinJson {
    // TODO refactor this later once virtual date is refactored
    return generateRandomPenguin(this._data);
  }

  public spawn(roomId?: number): Bot {
    const id = this._nextId++;
    const penguin = new WorldPenguin(id, this.makeJson(), this._appSettings);
    this._world.addPenguin(penguin);
    const bot = new Bot(
      penguin,
      this._data,
      this._world,
      Date.now() + this.delay(),
      this._writeFn,
      {
        danceFan: Math.random(),
        snowballFan: Math.random(),
        waveFan: Math.random(),
        sitFan: Math.random(),
        chatFan: Math.random(),
        emoteFan: Math.random(),
        walkFan: Math.random(),
        emptyRoomTolerance: Math.random(),
        roomDistraction: Math.random(),
        iglooFan: Math.random(),
        secretsFan: Math.random(),
        followability: Math.random(),
        mythsFan: Math.random(),
        stampsFan: Math.random(),
        musicFan: Math.random()
      }
    )
    this._msg.linkClient(bot, bot.penguin);
    this._bots.set(id, bot);
    this._msg
    this.decorateIgloo(penguin);

    bot.enter(roomId ?? bot.chooseRoom());
    return bot;
  }

  public despawn(id: number): void {
    const bot = this._bots.get(id);
    if (bot === undefined) {
      return;
    }

    this.disconnect(bot);
    this._world.closeIgloo(bot.penguin);
    this._world.disconnect(bot.penguin);
    this._bots.delete(id);
  }

  /** Rooms that a real, human player is currently standing in */
  private humanRooms(): WorldRoom[] {
    return this._world.players
      .filter(p => !isBot(p))
      .map(p => this._world.getPenguinRoom(p))
      .filter((r): r is WorldRoom => r !== undefined);
  }

  // -------------------------------------------------------------------------
  // behaviour
  // -------------------------------------------------------------------------

  private delay(): number {
    return randomInt(this._settings.minDelay, this._settings.maxDelay);
  }

  /** A bot standing in this room that isn't already sitting somewhere */
  private getFreeBotIn(room: WorldRoom): Bot | undefined {
    const seated = new Set<WorldPenguin>();
    room.getWaddleRooms().forEach((w) => {
      w.getSeats().forEach((p) => {
        if (p !== null) {
          seated.add(p);
        }
      });
    });
    room.getTables().forEach((t) => {
      t.getSeats().forEach((p) => {
        if (p !== null) {
          seated.add(p);
        }
      });
    });

    const p = room.players.find(p => isBot(p) && !seated.has(p));
    if (p === undefined) {
      return undefined;
    }
    return this._bots.get(p.id);
  }

  private tickWaddles(room: WorldRoom): void {
    const now = Date.now();

    for (const waddle of room.getWaddleRooms()) {
      const seats = waddle.getSeats();
      const occupants = seats.filter((p): p is WorldPenguin => p !== null);
      const waitingHuman = occupants.some(p => !isBot(p));
      const id = waddle.getId();

      if (!waitingHuman || waddle.isFull()) {
        this._waddleSeen.delete(id);
        this._waddleLastSeat.delete(id);
        continue;
      }

      const since = this._waddleSeen.get(id);
      if (since === undefined) {
        this._waddleSeen.set(id, now);
        continue;
      }
      if (now - since < WADDLE_JOIN_DELAY) {
        continue;
      }
      const last = this._waddleLastSeat.get(id) ?? 0;
      if (now - last < WADDLE_SEAT_GAP) {
        continue;
      }

      const bot = this.getFreeBotIn(room) ?? this.spawnInto(room.id);
      if (bot === undefined) {
        continue;
      }

      this._waddleLastSeat.set(id, now);
      joinWaddle({ msg: this._msg, world: this._world, data: this._data }, room, waddle, bot.penguin);

      const ctx = this._world.getContext(bot.penguin);
      if ('card' in ctx) {
        bot.joinCard(ctx.card);
      }

      // starting the game empties the waddle
      if (waddle.isFull()) {
        this._waddleSeen.delete(id);
        this._waddleLastSeat.delete(id);
      }
    }
  }

  private tickTables(room: WorldRoom): void {
    for (const table of room.getTables()) {
      if (table.hasStarted() || table.hasEnded()) {
        continue;
      }
      const seats = table.getSeats();
      const occupants = seats.filter((p): p is WorldPenguin => p !== null);
      const human = occupants.some(p => !isBot(p));
      const hasBot = occupants.some(p => isBot(p));

      if (!human || hasBot || occupants.length !== 1) {
        continue;
      }
      // treasure hunt is co-op and needs mining logic bots don't have
      if (!(table instanceof FindFourTable) && !(table instanceof MancalaTable)) {
        continue;
      }

      const bot = this.getFreeBotIn(room) ?? this.spawnInto(room.id);
      if (bot === undefined) {
        continue;
      }
      bot.sitAtTable(table.getId());
    }
  }

  private tickGames(): void {
    const rooms = this.humanRooms();

    rooms.forEach((room) => {
      this.tickWaddles(room);
      this.tickTables(room);
    });
  }

  private tick(): void {
    const now = Date.now();
    this.syncPopulation();
    if (this._settings.playGames) {
      this.tickGames();
    }

    for (const bot of this._bots.values()) {
      if (now < bot.nextActionAt || bot.busy) {
        continue;
      }
      bot.nextActionAt = now + this.delay();
      try {
        bot.act();
      } catch (e) {
        // a misbehaving bot should never take the world server down
        console.error('bot action failed', e);
      }
    }
  }

  /** Gives a bot a decorated igloo of its own. Called once, when it spawns. */
  private decorateIgloo(penguin: WorldPenguin): void {
    const set = choose(FURNITURE_SETS);
    const spots = [...FURNITURE_SPOTS].sort(() => Math.random() - 0.5)
      .slice(0, randomInt(3, Math.min(7, FURNITURE_SPOTS.length)));

    const furniture = spots.map(([x, y]) => {
      const id = choose(set);
      penguin.igloo.addFurniture(id, 1);
      return { id, x, y, rotation: randomInt(1, 4), frame: 1 };
    });

    try {
      penguin.igloo.updateIgloo({
        type: choose(IGLOO_TYPES),
        music: choose(IGLOO_MUSIC),
        flooring: 0,
        location: 1,
        locked: false,
        furniture
      });
    } catch (e) {
      // a bot without a valid layout simply doesn't get an igloo
      console.error('could not decorate bot igloo', e);
    }
  }
}
