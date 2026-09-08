// Fake computer-controlled penguins ("bots") that wander the island so rooms
// don't feel empty in singleplayer.
//
// A bot is a normal WorldPenguin that simply has no client socket attached to
// it. PenguinMessenger.write() looks the socket up with an optional chain, so
// sending to a bot is a silent no-op, while the bot still shows up in every
// room roster, in `jr`/`ap` packets and in player cards.

import { getDefaultPenguin, PenguinJson } from '@server/database/database';
import { ROOMS, RoomName } from '@server/game-data/rooms';
import { SettingsManager } from '@server/settings';
import { GameData } from '@server/timelines/game-data';
import { getPenguinString } from '../handlers/join';
import { PenguinMessenger } from '../messenger';
import { BOT_ID_BASE, isBot } from './bot-id';
import { BotGames } from './bot-games';
import { SledRace } from './sled';
import { PenguinEnvironment, World } from './world';
import { WorldPenguin } from './world-penguin';
import { WorldRoom } from './world-room';
import { WorldTable } from './world-table';

export { BOT_ID_BASE, isBot };

/** Rooms bots are allowed to hang around in */
const BOT_ROOMS: RoomName[] = [
  'town', 'coffee', 'book', 'dance', 'lounge', 'shop', 'dock', 'village',
  'rink', 'forts', 'plaza', 'pet', 'pizza', 'mtn', 'beach', 'berg', 'light',
  'mine', 'cave', 'cove', 'dojo', 'lodge', 'attic', 'sport'
];

/**
 * Rough walkable box of a Club Penguin room. The stage is 760x480, and most
 * floors sit in the lower half of it. Bots that pick a spot outside the walkable
 * area of a specific room just stand there, which is harmless.
 */
const WALK_AREA = { minX: 120, maxX: 640, minY: 300, maxY: 440 };

/** Frames sent through `sf`. 25 is wave, 26 is dance, 17-24 are the sit directions. */
const IDLE_FRAMES = [25, 26, 17, 18, 19, 20, 21, 22, 23, 24];

/** Emote ids sent through `se` */
const EMOTES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const CHAT_LINES = [
  'hi', 'hello!', 'sup', 'wanna be buddies?', 'brb', 'cool igloo',
  'lets go sledding', 'anyone wanna play find four?', 'nice hat',
  'im so bored', 'party at my igloo', 'waddle on', 'lol', 'thanks!',
  'where is everyone', 'first!', 'im a member', 'add me'
];

const NAME_PARTS_A = [
  'Cool', 'Snow', 'Ice', 'Fluffy', 'Turbo', 'Frosty', 'Mega', 'Blue',
  'Puffle', 'Wacky', 'Sunny', 'Rocket', 'Jolly', 'Waddle', 'Chill', 'Zippy'
];

const NAME_PARTS_B = [
  'Penguin', 'Flipper', 'Waddler', 'Bean', 'Beak', 'Berg', 'Wing', 'Paws',
  'Puff', 'Slider', 'Nugget', 'Pop', 'Hopper', 'Dude', 'Star', 'Fish'
];

/** Colors 1-15 are the classic penguin colors */
const COLORS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

/** Safe, very old clothing ids so bots look dressed on any timeline date */
const HEADS = [0, 0, 0, 401, 403, 413, 419, 428];
const FACES = [0, 0, 0, 0, 130, 131];
const NECKS = [0, 0, 0, 0, 104, 108];
const BODIES = [0, 0, 0, 201, 210, 215, 222, 230];
const HANDS = [0, 0, 0, 0, 301, 303];
const FEET = [0, 0, 0, 0, 0, 0, 501, 503];

/** Igloo rooms live at 2000 + the owner's penguin id, on every client version */
const IGLOO_ROOM_BASE = 2000;

/** Classic furniture sets, so an igloo looks decorated on any timeline date */
const FURNITURE_SETS = [
  [1, 2, 3, 4, 5, 6],       // pink
  [10, 11, 12, 13, 14],     // log
  [21, 22, 23, 24, 25, 26], // blue
  [31, 32, 33]              // coffee
];

/** Spots to place furniture in, roughly around the walls of a basic igloo */
const FURNITURE_SPOTS: Array<[number, number]> = [
  [180, 260], [300, 240], [420, 240], [540, 260],
  [200, 360], [330, 380], [460, 380], [580, 360],
  [260, 300], [500, 300]
];

const IGLOO_TYPES = [1, 2, 3];
const IGLOO_MUSIC = [0, 1, 2, 5, 20];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

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

export type BotSettings = {
  /** How many bots exist on the island at once */
  population: number;
  /** Chance (0-1) that a wandering bot picks the room you are standing in */
  followChance: number;
  /** Chance (0-1) that a bot says something instead of moving */
  chatChance: number;
  /** Milliseconds between the fastest and slowest bot action */
  minDelay: number;
  maxDelay: number;
  /** Whether bots sit down in waddles and play sled racing, Card-Jitsu and table games */
  playGames: boolean;
  /** How many bots keep an open igloo at any one time */
  openIgloos: number;
};

export const DEFAULT_BOT_SETTINGS: BotSettings = {
  population: 0,
  followChance: 0.5,
  chatChance: 0.08,
  minDelay: 2500,
  maxDelay: 9000,
  playGames: true,
  openIgloos: 3
};

export class BotManager {
  private _bots = new Map<number, BotState>();
  private _nextId = BOT_ID_BASE;
  private _timer: NodeJS.Timeout | null = null;
  private _settings: BotSettings = { ...DEFAULT_BOT_SETTINGS };
  private _games: BotGames;
  /** Bots sitting in a waddle or at a table, which must stop waddling about */
  private _busy = new Set<WorldPenguin>();
  /** Bots currently at home with an open igloo, and when they will head back out */
  private _homes = new Map<WorldPenguin, number>();

  constructor(
    private _world: World,
    private _msg: PenguinMessenger,
    private _data: GameData,
    private _appSettings: SettingsManager
  ) {
    this._games = new BotGames(this);
  }

  public get world(): World {
    return this._world;
  }

  public get msg(): PenguinMessenger {
    return this._msg;
  }

  public get data(): GameData {
    return this._data;
  }

  public get population(): number {
    return this._bots.size;
  }

  public setBusy(penguin: WorldPenguin, busy: boolean): void {
    if (busy) {
      this._busy.add(penguin);
    } else {
      this._busy.delete(penguin);
    }
  }

  /** Spawns a bot straight into one room and returns it */
  public spawnInto(roomId: number): WorldPenguin | undefined {
    // with bots turned off, nothing should ever appear on its own
    if (this._settings.population === 0 || this._bots.size >= 60) {
      return undefined;
    }
    this._settings.population = Math.max(this._settings.population, this._bots.size + 1);
    return this.spawn(roomId);
  }

  // --- hooks called from the game handlers ---------------------------------

  public onSledMove(sled: SledRace, x: number, y: number, time: number): void {
    if (this._settings.playGames) {
      this._games.onSledMove(sled, x, y, time);
    }
  }

  public onSledEnd(sled: SledRace): void {
    this._games.endSled(sled);
  }

  public onTableMove(table: WorldTable, moves: number[]): void {
    this._games.onTableMove(table, moves);
  }

  public configure(partial: Partial<BotSettings>): void {
    this._settings = { ...this._settings, ...partial };
    this.syncPopulation();
    if (this._settings.population > 0) {
      this.start();
    } else {
      this.stop();
    }
  }

  public setPopulation(n: number): void {
    this.configure({ population: Math.max(0, Math.min(n, 60)) });
  }

  /** Spawns `count` extra bots directly into one room and keeps them around */
  public addAt(roomId: number, count: number): void {
    this._settings.population = Math.min(this._settings.population + count, 60);
    for (let i = 0; i < count; i++) {
      if (this._bots.size >= this._settings.population) {
        break;
      }
      this.spawn(roomId);
    }
    this.start();
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
    this._busy.clear();
    this._homes.clear();
    this._games.reset();
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
        ([, b]) => !this._busy.has(b.penguin) && !this._homes.has(b.penguin)
      );
      const id = idle?.[0] ?? [...this._bots.keys()][0];
      if (id === undefined) {
        break;
      }
      this.despawn(id);
    }
  }

  private makeJson(): PenguinJson {
    const name = `${pick(NAME_PARTS_A)}${pick(NAME_PARTS_B)}${randInt(1, 999)}`;
    const color = pick(COLORS);
    const base = getDefaultPenguin(
      name,
      color,
      true,
      this._appSettings.getVirtualDate(0).getTime()
    );

    return {
      ...base,
      head: pick(HEADS),
      face: pick(FACES),
      neck: pick(NECKS),
      body: pick(BODIES),
      hand: pick(HANDS),
      feet: pick(FEET),
      // never let a bot be written to the penguin database
      noSave: true
    };
  }

  public spawn(roomId?: number): WorldPenguin | undefined {
    const id = this._nextId++;
    const penguin = new WorldPenguin(id, this.makeJson(), this._appSettings);
    this._world.addPenguin(penguin);
    this._bots.set(id, { penguin, nextActionAt: Date.now() + this.delay() });

    this.decorateIgloo(penguin);

    const room = this._world.getRoom(roomId ?? this.chooseRoom());
    this.enter(penguin, room);
    return penguin;
  }

  public despawn(id: number): void {
    const bot = this._bots.get(id);
    if (bot === undefined) {
      return;
    }
    const room = this._world.getPenguinRoom(bot.penguin);
    if (room !== undefined) {
      this.leave(bot.penguin, room);
    }
    this._world.closeIgloo(bot.penguin);
    this._world.disconnect(bot.penguin);
    this._busy.delete(bot.penguin);
    this._homes.delete(bot.penguin);
    this._bots.delete(id);
  }

  // -------------------------------------------------------------------------
  // room movement
  // -------------------------------------------------------------------------

  private enter(penguin: WorldPenguin, room: WorldRoom): void {
    const x = randInt(WALK_AREA.minX, WALK_AREA.maxX);
    const y = randInt(WALK_AREA.minY, WALK_AREA.maxY);
    room.addPenguin(penguin, x, y);
    this._world.enterState(penguin, { room });
    this._msg.send(
      room.players,
      'ap',
      getPenguinString(this._data, penguin, { x, y, frame: 1 })
    );
  }

  private leave(penguin: WorldPenguin, room: WorldRoom): void {
    room.removePenguin(penguin);
    this._msg.send(
      room.players,
      'rp',
      penguin.id,
      ...room.playerStates.map(([p, s]) => getPenguinString(this._data, p, s))
    );
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
      return pick(humans).id;
    }
    return ROOMS[pick(BOT_ROOMS)].id;
  }

  // -------------------------------------------------------------------------
  // behaviour
  // -------------------------------------------------------------------------

  private delay(): number {
    return randInt(this._settings.minDelay, this._settings.maxDelay);
  }

  private tick(): void {
    const now = Date.now();
    this.syncPopulation();
    this.tickReturns();
    this.tickIgloos();

    if (this._settings.playGames) {
      try {
        this._games.tick();
      } catch (e) {
        console.error('bot game tick failed', e);
      }
    }

    for (const bot of this._bots.values()) {
      if (now < bot.nextActionAt || this._busy.has(bot.penguin)) {
        continue;
      }
      bot.nextActionAt = now + this.delay();
      try {
        this.act(bot.penguin);
      } catch (e) {
        // a misbehaving bot should never take the world server down
        console.error('bot action failed', e);
      }
    }
  }

  /**
   * A bot that went into a minigame stays there until the game ends, and the
   * game never tells it so. Once no human shares the bot's environment any
   * more, the match is over and the bot goes back to waddling around.
   */
  private tickReturns(): void {
    const humanStates = this._world.players
      .filter(p => !isBot(p))
      .map(p => this._world.getContext(p))
      .filter((c): c is PenguinEnvironment => c !== undefined);

    for (const bot of this._bots.values()) {
      const state = this._world.getContext(bot.penguin);
      if (state !== undefined && 'room' in state) {
        continue;
      }
      if (state !== undefined && humanStates.some(h => sharesEnvironment(h, state))) {
        continue;
      }
      this.sendHome(bot.penguin);
    }
  }

  /** Gives a bot a decorated igloo of its own. Called once, when it spawns. */
  private decorateIgloo(penguin: WorldPenguin): void {
    const set = pick(FURNITURE_SETS);
    const spots = [...FURNITURE_SPOTS].sort(() => Math.random() - 0.5)
      .slice(0, randInt(3, Math.min(7, FURNITURE_SPOTS.length)));

    const furniture = spots.map(([x, y]) => {
      const id = pick(set);
      penguin.igloo.addFurniture(id, 1);
      return { id, x, y, rotation: randInt(1, 4), frame: 1 };
    });

    try {
      penguin.igloo.updateIgloo({
        type: pick(IGLOO_TYPES),
        music: pick(IGLOO_MUSIC),
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
      .map(b => b.penguin)
      .find(p => !this._busy.has(p) && !this._homes.has(p));

    if (candidate !== undefined) {
      this.openIglooFor(candidate);
    }
  }

  /** Opens a bot's igloo and puts the bot inside it, so visitors find someone home */
  public openIglooFor(penguin: WorldPenguin): void {
    const room = this._world.getRoom(IGLOO_ROOM_BASE + penguin.id);
    const previous = this._world.getPenguinRoom(penguin);
    if (previous !== undefined) {
      this.leave(penguin, previous);
    }
    this._world.openIgloo(penguin);
    this.enter(penguin, room);
    this._homes.set(penguin, Date.now() + randInt(180_000, 480_000));
  }

  /** Closes the igloo and sends the bot back out onto the island */
  public closeIglooFor(penguin: WorldPenguin): void {
    this._world.closeIgloo(penguin);
    this._homes.delete(penguin);
    const previous = this._world.getPenguinRoom(penguin);
    if (previous !== undefined) {
      this.leave(penguin, previous);
    }
    this.enter(penguin, this._world.getRoom(this.chooseRoom()));
  }

  /** Puts a bot back on the island after a game */
  public sendHome(penguin: WorldPenguin): void {
    this.setBusy(penguin, false);
    this.enter(penguin, this._world.getRoom(this.chooseRoom()));
  }

  private act(penguin: WorldPenguin): void {
    const room = this._world.getPenguinRoom(penguin);
    if (room === undefined) {
      return;
    }

    const roll = Math.random();

    // a bot hosting an open igloo stays in it, but still chats and dances
    if (roll < 0.10 && !this._homes.has(penguin)) {
      this.leave(penguin, room);
      this.enter(penguin, this._world.getRoom(this.chooseRoom()));
      return;
    }

    if (roll < 0.10 + this._settings.chatChance) {
      this._msg.send(room.players, 'sm', penguin.id, pick(CHAT_LINES));
      return;
    }

    if (roll < 0.28) {
      const frame = pick(IDLE_FRAMES);
      room.updateFrame(penguin, frame);
      this._msg.send(room.players, 'sf', penguin.id, frame);
      return;
    }

    if (roll < 0.36) {
      this._msg.send(room.players, 'se', penguin.id, pick(EMOTES));
      return;
    }

    if (roll < 0.40) {
      this._msg.send(
        room.players,
        'sb',
        penguin.id,
        randInt(WALK_AREA.minX, WALK_AREA.maxX),
        randInt(WALK_AREA.minY, WALK_AREA.maxY)
      );
      return;
    }

    // default: waddle somewhere else in the room
    const x = randInt(WALK_AREA.minX, WALK_AREA.maxX);
    const y = randInt(WALK_AREA.minY, WALK_AREA.maxY);
    room.updatePosition(penguin, x, y);
    this._msg.send(room.players, 'sp', penguin.id, x, y);
  }
}
