// Makes bots play Waddle Forever's multiplayer content: sled racing,
// Card-Jitsu, Find Four and Mancala.
//
// Three different mechanisms are at work, because the three kinds of game are
// driven differently by the original protocol:
//
//   Waddle games (sled, Card-Jitsu, Card-Jitsu Fire)
//     A bot sits down in a free waddle seat once a human is waiting in one.
//     Filling the last seat starts the game through the same code path the
//     real handler uses.
//
//   Sled racing
//     The client draws every racer from `zm` position broadcasts. Bots piggy
//     back on the human's own `zm` packets: every few samples each bot emits a
//     position near the human's, with its own lateral offset and drift. That
//     means the bots stay in whatever coordinate space the client is actually
//     using, on any timeline version, without hardcoding track geometry.
//
//   Card-Jitsu
//     Handled almost entirely by card.ts: a bot in a Card-Jitsu game gets a
//     NinjaBot, which is the existing Sensei AI with a name. The game is purely
//     reactive to the human's packets, so nothing here has to drive it.
//
//   Table games (Find Four, Mancala)
//     Fully server authoritative. A bot takes the empty seat, then plays its
//     own turns on a timer using the same table.sendMove() the handler calls.

import { GameData } from '@server/timelines/game-data';
import { joinWaddle } from '../handlers/room';
import { PenguinMessenger } from '../messenger';
import { isBot } from './bot-id';
import type { BotManager } from './bots';
import { FindFourTable } from './find-four';
import { MancalaTable } from './mancala';
import { SledRace } from './sled';
import { World } from './world';
import { WorldPenguin } from './world-penguin';
import { WorldRoom } from './world-room';
import { WorldTable } from './world-table';

const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** How long a human sits alone in a waddle before bots start joining, in ms */
const WADDLE_JOIN_DELAY = 4000;
/** Gap between two bots taking waddle seats, in ms */
const WADDLE_SEAT_GAP = 2500;

/** How long a bot "thinks" before playing a table move, in ms */
const TABLE_THINK_MIN = 1800;
const TABLE_THINK_MAX = 4200;

/** Emit bot sled positions once every N human position packets */
const SLED_SAMPLE_RATE = 2;
/** Starting lane offsets, in client units either side of where the player starts */
const SLED_LANES = [-115, 75, -55, 130, -145, 45];
/** A bot this close to the player along the track counts as alongside them */
const SLED_CLEAR_Y = 70;
/** ...and is pushed at least this far sideways so the sleds never overlap */
const SLED_CLEAR_X = 52;
/** Bots keep at least this fraction of the player's best pace when the player stalls */
const SLED_STALL_FLOOR = 0.6;
/**
 * Spread of bot paces, as a multiplier on the player's own average speed.
 * Tuned so a player who never hits anything wins a little under 60% of races;
 * bots lose time to obstacles as well, so this sits slightly above 1.0.
 */
const SLED_PACE_MIN = 0.87;
const SLED_PACE_MAX = 1.07;

// --- obstacles -----------------------------------------------------------
// The server has no map of the course, so hazards are learned by watching the
// player: a sudden collapse in their pace means they hit something, and where
// that happened is remembered. Bots passing the same spot on later races can
// hit it too. Until anything has been learned, and alongside it afterwards,
// bots also hit the occasional unseen obstacle so the effect is there from the
// very first race.

/** Player pace below this fraction of their recent average counts as a crash */
const HAZARD_CRASH_RATIO = 0.45;
/** Crashes within this distance of a known hazard are treated as the same obstacle */
const HAZARD_MERGE_X = 70;
const HAZARD_MERGE_Y = 90;
/** How close a bot must pass to a known hazard to risk hitting it */
const HAZARD_REACH_X = 58;
const HAZARD_REACH_Y = 55;
/** Chance of actually hitting a hazard you pass through, at full confidence */
const HAZARD_HIT_CHANCE = 0.55;
/** Chance per second that a bot hits an obstacle nobody has mapped yet */
const HAZARD_BLIND_CHANCE_PER_SECOND = 0.06;
/** A bot that hits something keeps this fraction of its speed... */
const HAZARD_SLOW_FACTOR = 0.28;
/** ...for this long, in milliseconds */
const HAZARD_SLOW_MIN = 600;
const HAZARD_SLOW_MAX = 1500;
/** Hazards seen this many times by the player are trusted completely */
const HAZARD_FULL_CONFIDENCE = 3;
/** Cap on remembered hazards, oldest and least seen dropped first */
const HAZARD_LIMIT = 60;

type SledHazard = {
  x: number;
  y: number;
  /** how many times the player has crashed here */
  seen: number;
};

type SledRacer = {
  penguin: WorldPenguin;
  seat: number;
  /** current position across the track */
  lane: number;
  targetLane: number;
  /** current position along the track, in the same units the client sends */
  progress: number;
  /** multiplier on the player's average pace, fixed for the race */
  pace: number;
  /** slow oscillation so the lead changes hands mid race */
  phase: number;
  phaseRate: number;
  /** milliseconds left of a collision slowdown */
  slowFor: number;
  /** hazards already struck this race, so one obstacle hits once */
  struck: Set<SledHazard>;
};

type SledState = {
  samples: number;
  lastWall: number;
  lastY: number;
  /** which way along the track y grows, learned from the player */
  direction: number;
  /** smoothed player pace, in client units per millisecond */
  pace: number;
  /** the fastest the player has gone this race */
  peakPace: number;
  minX: number;
  maxX: number;
  /** faster moving average, used to spot the player hitting something */
  recentPace: number;
  /** true while the player is still inside a crash, so it is logged once */
  crashed: boolean;
  racers: SledRacer[];
};

type TableSeat = {
  table: WorldTable;
  room: WorldRoom;
  penguin: WorldPenguin;
  seat: number;
  nextMoveAt: number;
};

export class BotGames {
  private _waddleSeen = new Map<number, number>();
  private _waddleLastSeat = new Map<number, number>();
  private _sleds = new Map<SledRace, SledState>();
  /** Obstacles learned from watching the player crash. Survives between races. */
  private _hazards: SledHazard[] = [];
  private _tables: TableSeat[] = [];

  /** Which way a Find Four column fills up. Learned from the human's own moves. */
  private _findFourFillsDown = true;

  constructor(private _manager: BotManager) {}

  private get world(): World {
    return this._manager.world;
  }

  private get msg(): PenguinMessenger {
    return this._manager.msg;
  }

  private get data(): GameData {
    return this._manager.data;
  }

  private humans(): WorldPenguin[] {
    return this.world.players.filter(p => !isBot(p));
  }

  public tick(): void {
    const rooms = new Set<WorldRoom>();
    this.humans().forEach((human) => {
      const room = this.world.getPenguinRoom(human);
      if (room !== undefined) {
        rooms.add(room);
      }
    });

    rooms.forEach((room) => {
      this.tickWaddles(room);
      this.tickTables(room);
    });

    this.tickTableTurns();
  }

  public reset(): void {
    this._waddleSeen.clear();
    this._waddleLastSeat.clear();
    this._sleds.clear();
    this._tables = [];
  }

  // -------------------------------------------------------------------------
  // waddle seats
  // -------------------------------------------------------------------------

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

      const bot = this.freeBotIn(room) ?? this._manager.spawnInto(room.id);
      if (bot === undefined) {
        continue;
      }

      this._waddleLastSeat.set(id, now);
      this._manager.setBusy(bot, true);
      joinWaddle({ msg: this.msg, world: this.world, data: this.data }, room, waddle, bot);

      // starting the game empties the waddle
      if (waddle.isFull()) {
        this._waddleSeen.delete(id);
        this._waddleLastSeat.delete(id);
      }
    }
  }

  /** A bot standing in this room that isn't already sitting somewhere */
  private freeBotIn(room: WorldRoom): WorldPenguin | undefined {
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

    return room.players.find(p => isBot(p) && !seated.has(p));
  }

  // -------------------------------------------------------------------------
  // sled racing
  // -------------------------------------------------------------------------

  /**
   * Called from the sled move handler with the player's own position packet.
   *
   * Bots are simulated independently rather than shadowing the player: each
   * one carries its own pace, and the only thing taken from the player is the
   * scale of the track. That is deliberate, because the track geometry is not
   * in the server code and differs by timeline version. Watching one real
   * racer tells us how fast a sled travels and which way along y the course
   * runs, and from there the bots can race on their own.
   *
   * Because each bot's pace is drawn around the player's average, the finish
   * order genuinely varies, and a player who hits an obstacle will be passed.
   */
  public onSledMove(sled: SledRace, x: number, y: number, time: number): void {
    const now = Date.now();
    let state = this._sleds.get(sled);

    if (state === undefined) {
      const racers = sled.players.filter(isBot).map((penguin, i): SledRacer => {
        const lane = x + SLED_LANES[i % SLED_LANES.length];
        return {
          penguin,
          seat: sled.getSeatId(penguin),
          lane,
          targetLane: lane,
          progress: y,
          pace: SLED_PACE_MIN + Math.random() * (SLED_PACE_MAX - SLED_PACE_MIN),
          phase: Math.random() * Math.PI * 2,
          phaseRate: 0.05 + Math.random() * 0.07,
          slowFor: 0,
          struck: new Set<SledHazard>()
        };
      });

      this._sleds.set(sled, {
        samples: 0,
        lastWall: now,
        lastY: y,
        direction: 0,
        pace: 0,
        peakPace: 0,
        minX: x,
        maxX: x,
        recentPace: 0,
        crashed: false,
        racers
      });
      return;
    }

    state.samples++;
    if (state.racers.length === 0) {
      return;
    }

    // wall clock, because the client's own time argument is not a documented
    // unit and only needs echoing back
    const dt = Math.min(400, Math.max(1, now - state.lastWall));
    const dy = y - state.lastY;
    state.lastWall = now;
    state.lastY = y;

    if (dy !== 0) {
      state.direction = Math.sign(dy);
    }
    const instant = Math.abs(dy) / dt;
    state.peakPace = Math.max(state.peakPace, instant);
    // slow average, so a crash or a pause does not stop the whole field
    state.pace = state.pace === 0 ? instant : state.pace * 0.94 + instant * 0.06;

    // a sharp collapse in the player's pace means they hit something, and
    // where it happened is worth remembering
    if (state.recentPace > 0 && instant < state.recentPace * HAZARD_CRASH_RATIO) {
      if (!state.crashed) {
        state.crashed = true;
        this.rememberHazard(x, y);
      }
    } else if (instant > state.recentPace * 0.8) {
      state.crashed = false;
    }
    state.recentPace = state.recentPace === 0 ? instant : state.recentPace * 0.7 + instant * 0.3;

    state.minX = Math.min(state.minX, x);
    state.maxX = Math.max(state.maxX, x);

    if (state.direction === 0) {
      return;
    }

    const pace = Math.max(state.pace, state.peakPace * SLED_STALL_FLOOR);
    const laneMin = state.minX - 130;
    const laneMax = state.maxX + 130;

    for (const racer of state.racers) {
      racer.phase += racer.phaseRate;
      const wobble = 1 + 0.12 * Math.sin(racer.phase);

      // obstacles: a known one the bot is passing through, or an unmapped one
      if (racer.slowFor <= 0) {
        const hazard = this.hazardAt(racer.lane, racer.progress, racer.struck);
        if (hazard !== undefined) {
          const confidence = Math.min(1, hazard.seen / HAZARD_FULL_CONFIDENCE);
          racer.struck.add(hazard);
          if (Math.random() < HAZARD_HIT_CHANCE * confidence) {
            racer.slowFor = randInt(HAZARD_SLOW_MIN, HAZARD_SLOW_MAX);
          }
        } else if (Math.random() < HAZARD_BLIND_CHANCE_PER_SECOND * (dt / 1000)) {
          racer.slowFor = randInt(HAZARD_SLOW_MIN, HAZARD_SLOW_MAX);
        }
      }

      let hit = 1;
      if (racer.slowFor > 0) {
        racer.slowFor -= dt;
        hit = HAZARD_SLOW_FACTOR;
      }

      racer.progress += state.direction * pace * racer.pace * wobble * hit * dt;

      if (Math.random() < 0.03) {
        racer.targetLane = laneMin + Math.random() * (laneMax - laneMin);
      }
      const step = 0.14 * dt;
      const wanted = racer.targetLane - racer.lane;
      racer.lane += Math.max(-step, Math.min(step, wanted));
      racer.lane = Math.max(laneMin, Math.min(laneMax, racer.lane));

    }

    // keep the bots off each other first...
    for (let i = 0; i < state.racers.length; i++) {
      for (let j = i + 1; j < state.racers.length; j++) {
        const a = state.racers[i];
        const b = state.racers[j];
        if (Math.abs(a.progress - b.progress) < SLED_CLEAR_Y && Math.abs(a.lane - b.lane) < SLED_CLEAR_X) {
          const middle = (a.lane + b.lane) / 2;
          const order = a.lane >= b.lane ? 1 : -1;
          a.lane = middle + order * (SLED_CLEAR_X / 2 + 1);
          b.lane = middle - order * (SLED_CLEAR_X / 2 + 1);
        }
      }
    }

    // ...then off the player, which has to be the last word, otherwise the
    // separation pass above can shove a bot straight back into their sled
    for (const racer of state.racers) {
      if (Math.abs(racer.progress - y) < SLED_CLEAR_Y && Math.abs(racer.lane - x) < SLED_CLEAR_X) {
        const side = racer.lane >= x ? 1 : -1;
        racer.lane = x + side * (SLED_CLEAR_X + 4);
        racer.targetLane = racer.lane;
      }
    }

    if (state.samples % SLED_SAMPLE_RATE !== 0) {
      return;
    }

    for (const racer of state.racers) {
      this.msg.send(
        sled.players,
        'zm',
        racer.seat,
        Math.round(racer.lane),
        Math.round(racer.progress),
        time
      );
    }
  }

  /** Records that the player crashed here, merging with a nearby known hazard */
  private rememberHazard(x: number, y: number): void {
    const existing = this._hazards.find(
      h => Math.abs(h.x - x) < HAZARD_MERGE_X && Math.abs(h.y - y) < HAZARD_MERGE_Y
    );

    if (existing !== undefined) {
      // nudge towards the average of the crashes seen at this spot
      existing.x = (existing.x * existing.seen + x) / (existing.seen + 1);
      existing.y = (existing.y * existing.seen + y) / (existing.seen + 1);
      existing.seen++;
      return;
    }

    this._hazards.push({ x, y, seen: 1 });

    if (this._hazards.length > HAZARD_LIMIT) {
      // drop the least corroborated one
      let worst = 0;
      this._hazards.forEach((h, i) => {
        if (h.seen < this._hazards[worst].seen) {
          worst = i;
        }
      });
      this._hazards.splice(worst, 1);
    }
  }

  /** A known hazard this position is passing through and hasn't already hit */
  private hazardAt(x: number, y: number, struck: Set<SledHazard>): SledHazard | undefined {
    return this._hazards.find(h =>
      !struck.has(h) &&
      Math.abs(h.x - x) < HAZARD_REACH_X &&
      Math.abs(h.y - y) < HAZARD_REACH_Y
    );
  }

  /** How many obstacles have been learned so far, for testing and debugging */
  public get knownHazards(): number {
    return this._hazards.length;
  }

  public endSled(sled: SledRace): void {
    this._sleds.delete(sled);
  }

  // -------------------------------------------------------------------------
  // table games
  // -------------------------------------------------------------------------

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

      const bot = this.freeBotIn(room) ?? this._manager.spawnInto(room.id);
      if (bot === undefined) {
        continue;
      }
      this.sitAtTable(room, table, bot);
    }
  }

  private sitAtTable(room: WorldRoom, table: WorldTable, bot: WorldPenguin): void {
    const seat = table.assignSeatIndex(bot);
    if (seat === WorldTable.TABLE_SPECTATOR_SEAT) {
      return;
    }
    this._manager.setBusy(bot, true);

    this.msg.send(room.players, 'ut', table.getId(), table.getCount());

    table.setJoined(seat);
    this.msg.send(table.penguins, 'uz', seat, bot.name);

    if (!table.hasStarted() && table.hasEveryoneJoined()) {
      table.setStarted();
      this.msg.send(table.penguins, 'sz', table.getTurn());
    }

    this._tables.push({
      table,
      room,
      penguin: bot,
      seat,
      nextMoveAt: Date.now() + randInt(TABLE_THINK_MIN, TABLE_THINK_MAX)
    });
  }

  private tickTableTurns(): void {
    const now = Date.now();

    this._tables = this._tables.filter((entry) => {
      const { table, room, penguin, seat } = entry;

      // human walked off, or the round was reset out from under us
      const stillSeated = table.getSeatIndex(penguin) === seat;
      const opponent = table.getSeats().some(p => p !== null && !isBot(p));

      if (!stillSeated || !opponent) {
        table.removePlayer(penguin);
        this.msg.send(room.players, 'ut', table.getId(), table.getCount());
        this._manager.setBusy(penguin, false);
        return false;
      }

      if (table.hasEnded()) {
        return true;
      }
      if (!table.hasStarted() || table.getTurn() !== seat) {
        entry.nextMoveAt = now + randInt(TABLE_THINK_MIN, TABLE_THINK_MAX);
        return true;
      }
      if (now < entry.nextMoveAt) {
        return true;
      }

      const moves = this.chooseTableMove(table, seat);
      if (moves === null) {
        return true;
      }
      this.playTableMove(entry, moves);
      entry.nextMoveAt = now + randInt(TABLE_THINK_MIN, TABLE_THINK_MAX);
      return true;
    });
  }

  /** Mirror of handleSendTableMove, driven by a bot instead of a client packet */
  private playTableMove(entry: TableSeat, moves: number[]): void {
    const { table, room, penguin } = entry;
    if (moves.length !== table.getMoveLength()) {
      return;
    }

    const [endArgs, args] = table.sendMove(moves);

    if (table.getAutomaticTurnChange()) {
      table.changeTurn();
    }
    if (args !== null) {
      this.msg.send(table.penguins, 'zm', ...args);
    }
    if (endArgs !== null) {
      if (this.data.isPreCpip()) {
        table.blockSpectators();
        this.msg.send(table.penguins, 'zo', ...endArgs);
      } else {
        table.penguins.forEach(p => this.msg.send(p, 'zo', p.currency.coins));
      }
      this.msg.send(room.players, 'ut', table.getId(), table.getCount());
      table.resetRound();
      this._manager.setBusy(penguin, false);
    }
  }

  /** Learn which end of a Find Four column fills first, from the human's move */
  public onTableMove(table: WorldTable, moves: number[]): void {
    if (!(table instanceof FindFourTable) || moves.length !== 2) {
      return;
    }
    const board = this.parseFindFour(table);
    const column = moves[0];
    const row = moves[1];
    const filled = (board[column] ?? []).filter(v => v !== 0).length;

    if (row === FindFourTable.FIND_FOUR_HEIGHT - 1 - filled) {
      this._findFourFillsDown = true;
    } else if (row === filled) {
      this._findFourFillsDown = false;
    }
  }

  private chooseTableMove(table: WorldTable, seat: number): number[] | null {
    if (table instanceof FindFourTable) {
      return this.chooseFindFourMove(table, seat);
    }
    if (table instanceof MancalaTable) {
      return this.chooseMancalaMove(table, seat);
    }
    return null;
  }

  // --- Find Four -----------------------------------------------------------

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
    if (this._findFourFillsDown) {
      for (let y = height - 1; y >= 0; y--) {
        if (column[y] === 0) {
          return y;
        }
      }
    } else {
      for (let y = 0; y < height; y++) {
        if (column[y] === 0) {
          return y;
        }
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

  private chooseFindFourMove(table: FindFourTable, seat: number): number[] | null {
    const board = this.parseFindFour(table);
    const me = seat + 1;
    const them = seat === 0 ? 2 : 1;

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
      const choice = pick(best);
      return [choice.column, choice.row];
    }

    const choice = pick(options);
    return [choice.column, choice.row];
  }

  // --- Mancala -------------------------------------------------------------

  private chooseMancalaMove(table: MancalaTable, seat: number): number[] | null {
    const board = table.serializeBoard().split(',').map(Number);
    if (board.length !== 14) {
      return null;
    }

    const legal: number[] = [];
    for (let cup = 0; cup < 14; cup++) {
      if (table.isMancalaCupForPlayer(seat, cup) && (board[cup] ?? 0) > 0) {
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
      const result = table.applyMancalaMove([...board], seat, cup);
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
    return [pick(legal)];
  }
}
