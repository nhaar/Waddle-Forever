/**
 * Handles NPCs (bots)
 * 
 * Internally, a bot is a socketless WorldPenguin, and its messages are handled here
 */

import { getDefaultPenguin, PenguinJson } from '@server/database/database';
import { IGLOO_ROOM_BASE, ROOMS, RoomName } from '@server/game-data/rooms';
import { SettingsManager } from '@server/settings';
import { GameData } from '@server/timelines/game-data';
import { BOT_ID_BASE, isBot } from './bot-id';
import { SledRace } from './sled';
import { PenguinEnvironment, World } from './world';
import { WorldPenguin } from './world-penguin';
import { WorldRoom } from './world-room';
import { WorldTable } from './world-table';
import { choose, randomInt } from '@common/utils';
import { Bot, SendFunction, WALK_AREA } from './bot';

export { BOT_ID_BASE, isBot };


// TODO -> Visitable rooms tracked by timeline
//      -> Room popularity
//      -> Member only rooms
/** Rooms bots are allowed to hang around in */
const BOT_ROOMS: RoomName[] = [
  'town', 'coffee', 'book', 'dance', 'lounge', 'shop', 'dock', 'village',
  'rink', 'forts', 'plaza', 'pet', 'pizza', 'mtn', 'beach', 'berg', 'light',
  'mine', 'cave', 'cove', 'dojo', 'lodge', 'attic', 'sport'
];


/** Frames sent through `sf`. 25 is wave, 26 is dance, 17-24 are the sit directions. */
const IDLE_FRAMES = [25, 26, 17, 18, 19, 20, 21, 22, 23, 24];

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


// TODO -> Items must be properly tracked
//      -> Entire module to generate outfits on date will be added later
// temporary item arrays just to have some clothing
const COLORS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const HEADS = [0, 0, 0, 401, 403, 413, 419, 428];
const FACES = [0, 0, 0, 0, 131];
const NECKS = [0, 0, 0, 0, 104, 108];
const BODIES = [0, 0, 0, 201, 210, 215, 222, 230];
const HANDS = [0, 0, 0, 0, 301, 303];
const FEET = [0, 0, 0, 0, 0, 0, 501, 503];


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

/** True when two penguin environments are the same room, game or match */
const sharesEnvironment = (a: PenguinEnvironment, b: PenguinEnvironment): boolean => {
  if ('room' in a && 'room' in b) return a.room === b.room;
  if ('game' in a && 'game' in b) return a.game === b.game;
  if ('card' in a && 'card' in b) return a.card === b.card;
  if ('sled' in a && 'sled' in b) return a.sled === b.sled;
  if ('fire' in a && 'fire' in b) return a.fire === b.fire;
  return false;
};

type BotState = {
  penguin: WorldPenguin;
  nextActionAt: number;
};

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

const MAX_SIZE = 60;


function generateRandomPenguin(time: number): PenguinJson {
  const name = `${choose(NAME_PARTS_A)}${choose(NAME_PARTS_B)}${randomInt(1, 999)}`;
  const color = choose(COLORS);
  const base = getDefaultPenguin(
    name,
    color,
    true,
    time
  );

  return {
    ...base,
    head: choose(HEADS),
    face: choose(FACES),
    neck: choose(NECKS),
    body: choose(BODIES),
    hand: choose(HANDS),
    feet: choose(FEET),
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
  private _homes = new Map<Bot, number>();
  private _on = false;

  constructor(
    private _world: World,
    private send: SendFunction,
    private _data: GameData,
    private _appSettings: SettingsManager
  ) {
  }

  public setOff() {
    this._on = false;
    this._settings.population = 0;
    this.syncPopulation();
    this.stop();
  }

  /** Spawns a bot straight into one room and returns it */
  public spawnInto(roomId: number): void {
    if (!this._on || this._bots.size > MAX_SIZE) {
      return undefined;
    }
    this._settings.population += 1;
    this.spawn(roomId);
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
    this._settings.population = Math.max(0, Math.min(n, 60));
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
    this._homes.clear();
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
        ([, b]) => !b.busy && !this._homes.has(b)
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
    return generateRandomPenguin(this._appSettings.getVirtualDate(0).getTime());
  }

  public spawn(roomId?: number): void {
    const id = this._nextId++;
    const penguin = new WorldPenguin(id, this.makeJson(), this._appSettings);
    this._world.addPenguin(penguin);
    const bot = new Bot(penguin, this._data, this._world, this.send, Date.now() + this.delay())
    this._bots.set(id, bot);

    this.decorateIgloo(penguin);

    const room = this._world.getRoom(roomId ?? this.chooseRoom());
    bot.enter(room);
  }

  public despawn(id: number): void {
    const bot = this._bots.get(id);
    if (bot === undefined) {
      return;
    }
    const room = this._world.getPenguinRoom(bot.penguin);
    if (room !== undefined) {
      bot.leave(room);
    }
    this._world.closeIgloo(bot.penguin);
    this._world.disconnect(bot.penguin);
    this._homes.delete(bot);
    this._bots.delete(id);
  }

  /** Rooms that a real, human player is currently standing in */
  private humanRooms(): WorldRoom[] {
    return this._world.players
      .filter(p => !isBot(p))
      .map(p => this._world.getPenguinRoom(p))
      .filter((r): r is WorldRoom => r !== undefined);
  }

  private chooseRoom(): number {
    const humans = this.humanRooms();
    if (humans.length > 0 && Math.random() < this._settings.followChance) {
      return choose(humans).id;
    }
    return ROOMS[choose(BOT_ROOMS)].id;
  }

  // -------------------------------------------------------------------------
  // behaviour
  // -------------------------------------------------------------------------

  private delay(): number {
    return randomInt(this._settings.minDelay, this._settings.maxDelay);
  }

  private tick(): void {
    const now = Date.now();
    this.syncPopulation();
    this.tickIgloos();

    for (const bot of this._bots.values()) {
      if (now < bot.nextActionAt || bot.busy) {
        continue;
      }
      bot.nextActionAt = now + this.delay();
      try {
        this.act(bot);
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

  /** Keeps a few igloos open, and sends hosts back out when they've had enough */
  private tickIgloos(): void {
    const now = Date.now();

    for (const [penguin, until] of [...this._homes.entries()]) {
      if (now >= until) {
        this.closeIglooFor(penguin);
      }
    }

    if (this._homes.size >= Math.min(this._settings.openIgloos, this._bots.size)) {
      return;
    }
    // one at a time, and not every tick, so igloos open and close gradually
    if (Math.random() > 0.04) {
      return;
    }

    const candidate = [...this._bots.values()]
      .find(b => !b.busy && !this._homes.has(b));

    if (candidate !== undefined) {
      this.openIglooFor(candidate);
    }
  }

  /** Opens a bot's igloo and puts the bot inside it, so visitors find someone home */
  public openIglooFor(bot: Bot): void {
    const room = this._world.getRoom(IGLOO_ROOM_BASE + bot.penguin.id);
    const previous = this._world.getPenguinRoom(bot.penguin);
    if (previous !== undefined) {
      bot.leave(previous);
    }
    this._world.openIgloo(bot.penguin);
    bot.enter(room);
    this._homes.set(bot, Date.now() + randomInt(180_000, 480_000));
  }

  /** Closes the igloo and sends the bot back out onto the island */
  public closeIglooFor(bot: Bot): void {
    this._world.closeIgloo(bot.penguin);
    this._homes.delete(bot);
    const previous = this._world.getPenguinRoom(bot.penguin);
    if (previous !== undefined) {
      bot.leave(previous);
    }
    bot.enter(this._world.getRoom(this.chooseRoom()));
  }

  /** Puts a bot back on the island after a game */
  public sendToIsland(bot: Bot): void {
    bot.busy = false;
    bot.enter(this._world.getRoom(this.chooseRoom()));
  }

  private act(bot: Bot): void {
    const room = this._world.getPenguinRoom(bot.penguin);
    if (room === undefined) {
      return;
    }

    const roll = Math.random();

    // a bot hosting an open igloo stays in it, but still chats and dances
    if (roll < 0.10 && !this._homes.has(bot)) {
      bot.leave(room);
      bot.enter(this._world.getRoom(this.chooseRoom()));
      return;
    }

    if (roll < 0.10 + this._settings.chatChance) {
      this.send(room.players, 'sm', bot.penguin.id, choose(CHAT_LINES));
      return;
    }

    if (roll < 0.28) {
      const frame = choose(IDLE_FRAMES);
      room.updateFrame(bot.penguin, frame);
      this.send(room.players, 'sf', bot.penguin.id, frame);
      return;
    }

    if (roll < 0.36) {
      this.send(room.players, 'se', bot.penguin.id, choose(EMOTES));
      return;
    }

    if (roll < 0.40) {
      this.send(
        room.players,
        'sb',
        bot.penguin.id,
        randomInt(WALK_AREA.minX, WALK_AREA.maxX),
        randomInt(WALK_AREA.minY, WALK_AREA.maxY)
      );
      return;
    }

    // default: waddle somewhere else in the room
    const x = randomInt(WALK_AREA.minX, WALK_AREA.maxX);
    const y = randomInt(WALK_AREA.minY, WALK_AREA.maxY);
    room.updatePosition(bot.penguin, x, y);
    this.send(room.players, 'sp', bot.penguin.id, x, y);
  }
}
