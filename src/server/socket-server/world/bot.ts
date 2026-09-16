import { choose, clamp, iterateEntries, randomInt, randomLogNormal, shuffleArray } from "@common/utils";
import { WorldPenguin } from "./world-penguin";
import { WorldRoom } from "./world-room";
import { GameData } from "@server/timelines/game-data";
import { World } from "./world";
import { ClientSocket } from "../socket-server";
import { WorldTable } from "./world-table";
import { FindFourTable } from "./find-four";
import { MancalaTable } from "./mancala";
import { CardJitsu, NinjaPlayer } from "./card";
import { IGLOO_ROOM_BASE, RoomName, ROOMS } from "@server/game-data/rooms";

export type SendFunction = (p: WorldPenguin[] | WorldPenguin, msg: string, ...args: Array<string | number>) => void;
export type WriteFunction = (b: Bot, ext: string, code: string, ...args: Array<string | number>) => void;

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

/** How long a bot "thinks" before playing a table move, in ms */
const TABLE_THINK_MIN = 1800;
const TABLE_THINK_MAX = 4200;

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
}

enum OverWorldBehavior {
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
  MatchDanceColor
}

/** Bot actions that can be done at the same time */
const allowedPairs: Array<[OverWorldBehavior, OverWorldBehavior]> = [
  [OverWorldBehavior.RandomDance, OverWorldBehavior.RandomMessage],
  [OverWorldBehavior.RandomMessage, OverWorldBehavior.RandomSit],
  [OverWorldBehavior.RandomDance, OverWorldBehavior.RandomEmote],
  [OverWorldBehavior.RandomEmote, OverWorldBehavior.RandomSnowball],
  [OverWorldBehavior.RandomEmote, OverWorldBehavior.RandomWave],
  [OverWorldBehavior.RandomEmote, OverWorldBehavior.RandomSit],
  [OverWorldBehavior.RandomWalk, OverWorldBehavior.RandomEmote],
  [OverWorldBehavior.JoinDanceFloor, OverWorldBehavior.MatchDanceColor]
]



// this variable is usede to access all behaviors at compile time
const allBehaviors: Record<OverWorldBehavior, 0> = {
  [OverWorldBehavior.RandomDance]: 0,
  [OverWorldBehavior.RandomSnowball]: 0,
  [OverWorldBehavior.RandomWave]: 0,
  [OverWorldBehavior.RandomSit]: 0,
  [OverWorldBehavior.RandomMessage]: 0,
  [OverWorldBehavior.RandomWalk]: 0,
  [OverWorldBehavior.RandomEmote]: 0,
  [OverWorldBehavior.LeaveRoom]: 0,
  [OverWorldBehavior.HostIgloo]: 0,
  [OverWorldBehavior.JoinDanceFloor]: 0,
  [OverWorldBehavior.MatchDanceColor]: 0
}

// generate a more optimized mapping of all the allowed behaviors
const allowedMapping: Record<OverWorldBehavior, OverWorldBehavior[]> = Object.fromEntries(Object.keys(allBehaviors).map(v => [Number(v), []])) as Record<OverWorldBehavior, OverWorldBehavior[]>;
allowedPairs.forEach(([x1, x2]) => {
  allowedMapping[x1].push(x2);
  allowedMapping[x2].push(x1);
});

export class Bot implements ClientSocket {
  public busy = false;
  private _tableInfo: {
    table: WorldTable,
    room: WorldRoom,
    seat: number,
    timeout: NodeJS.Timeout
   } | null = null;
  
  private _cardInfo : {
    seat: number,
    card: CardJitsu,
    ninja: NinjaPlayer,
    chooseCard: NodeJS.Timeout | null
  } | null = null;

  private _simulate: (ext: string, code: string, ...args: Array<string | number>) => void;
  private returnToIsland: () => void;  

  private _lenghts: Record<OverWorldBehavior, number> = { ...allBehaviors };
  private _cooldowns: Record<OverWorldBehavior, number> = { ...allBehaviors };

  constructor(
    private _penguin: WorldPenguin,
    private _data: GameData,
    private _world: World,
    public nextActionAt: number,
    writeFn: WriteFunction,
    returnFn: (b: Bot) => void,
    private _attributes: BotAttributes
  ) {
    this._simulate = (e, c, ...a) => writeFn(this, e, c, ...a);
    this.returnToIsland = () => returnFn(this);
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

  public async write(message: string): Promise<void> {
    const split = message.split('%');
    const name = split[2];
    const args = split.slice(4, split.length - 1);

    this.handle(name, args);
  }
  

  private handle(name: string, args: string[]): void {
    if (this._cardInfo !== null) {
      if (name === 'zm') {
        if (args[0] === 'deal' && args[1] != String(this._cardInfo.seat)) {
          // remove deal and seat to find number of cards
          const amount = args.length - 2;
          this._simulate('z', 'zm', 'deal', amount);
          this._cardInfo.chooseCard = setTimeout(() => {
            const selectableCards = this._cardInfo.ninja.cards
              .map((sessionId) => [this._cardInfo.card.getCard(sessionId).element, sessionId])
              .filter(([element,]) => element !== this._cardInfo.ninja.blockedElement)
              .map(([,id]) => id);
            
            if (selectableCards.length === 0) {
              this._simulate('z', 'zm', 'death');
            } else {
              this._simulate('z', 'zm', 'pick', choose(selectableCards));
            }
            
          }, clamp(randomLogNormal(1.2, 0.8), 1, 20) * 1000);
        }
      } else if (name === 'czo' || name === 'cz') {
        // packets that terminate the match
        this._cardInfo = null;
        this.returnToIsland();
      }
    } else {
      if (name === 'jt') {
        const room = this._world.getPenguinRoom(this._penguin);  
        this._tableInfo = {
          table: room.getTable(Number(args[0])),
          seat: Number(args[1]) - 1,
          room: room,
          timeout: this.tableMove()
        }
        this._simulate('z', 'gz');
        this._simulate('z', 'jz');
      }
    }
  }

  public joinCard(card: CardJitsu): void {
    this._cardInfo = {
      card,
      ninja: card.getNinja(this._penguin),
      seat: card.getSeatId(this._penguin),
      chooseCard: null
    };
  }

  public sitAtTable(tableId: number): void {
    this._simulate('s', this._data.isPreCpip() ? 'jt' : 'a#jt', tableId);
    this.busy = true;
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
      const choice = choose(best);
      return [choice.column, choice.row];
    }

    const choice = choose(options);
    return [choice.column, choice.row];
  }

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
    return [choose(legal)];
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

  public tableMove(): NodeJS.Timeout {
    return setTimeout(() => {
      if (this._tableInfo === null) {
        return;
      }
      const { table, seat, room } = this._tableInfo;
      // human walked off, or the round was reset out from under us
      const stillSeated = table.getSeatIndex(this._penguin) === seat;
      const opponent = table.getSeats().some(p => p !== null);

      if (!stillSeated || !opponent) {
        this.busy = false;
        this._tableInfo = null;
        return;
      }

      if (table.hasEnded()) {
        this._tableInfo = null;
        return;
      }
      if (!table.hasStarted() || table.getTurn() !== seat) {
        this._tableInfo.timeout = this.tableMove();
        return;
      }

      const moves = this.chooseTableMove(table, seat);
      if (moves === null) {
        return;
      }
      this._simulate('z', 'zm', ...moves);
      this._tableInfo.timeout = this.tableMove();
    }, randomInt(TABLE_THINK_MIN, TABLE_THINK_MAX));
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

  public walkTo(x: number, y: number) {
    this._simulate('s', this._data.isPreCpip() ? 'sp' : 'u#sp', x, y);
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
    this.walkTo(randomInt(minX, maxX), y);
    // TODO system to calculate time of walk
    setTimeout(() => {
      this.doDance();
    }, 4000);
  }

  public wearColor(color: number): void {
    this._simulate('s', 's#upc', color);
  }

  public act(): void {
    const room = this._world.getPenguinRoom(this.penguin);
    if (room === undefined) {
      return;
    }

    const now = Date.now();

    const actions: Record<OverWorldBehavior, {
      getLength: () => number;
      getCooldown: () => number;
      callback: () => void,
      getSuccess: () => boolean;
    }> = {
      [OverWorldBehavior.RandomDance]: {
        getLength: () => {
          return Math.random() * (this._attributes.danceFan + 1) * 20;
        },
        getCooldown: () => {
          return Math.random() * (1 - this._attributes.danceFan) * 30;
        },
        callback: () => {
          this.doDance();
        },
        getSuccess: () => {
          return this._attributes.danceFan > Math.random();
        },
      },
      [OverWorldBehavior.RandomSnowball]: {
        getLength: () => {
          return 0;
        },
        getCooldown: () => {
          return Math.random() * (1 - this._attributes.danceFan) * 30;
        },
        callback: () => {
          this.throwSnowball(randomInt(WALK_AREA.minX, WALK_AREA.maxX), randomInt(WALK_AREA.minY, WALK_AREA.maxY));
        },
        getSuccess: () => {
          return this._attributes.snowballFan > Math.random();
        },
      },
      [OverWorldBehavior.RandomSit]: {
        getLength: () => {
          return Math.random() * (this._attributes.sitFan + 1) * 20;
        },
        getCooldown: () => {
          return Math.random() * (1 - this._attributes.sitFan) * 30;
        },
        callback: () => {
          this.doFrame(choose([17, 18, 19, 20, 21, 22, 23, 24]));
        },
        getSuccess: () => {
          return this._attributes.sitFan > Math.random();
        }
      },
      [OverWorldBehavior.RandomWalk]: {
        getLength: () => {
          return 0;
        },
        getCooldown: () => {
          return Math.random() * (1 - this._attributes.walkFan) * 30;
        },
        callback: () => {
          this.walkTo(randomInt(WALK_AREA.minX, WALK_AREA.maxX), randomInt(WALK_AREA.minY, WALK_AREA.maxY));
        },
        getSuccess: () => {
          return this._attributes.walkFan > Math.random()
        }
      },
      [OverWorldBehavior.RandomMessage]: {
        getLength: () => {
          return 5;
        },
        getCooldown: () => {
          return Math.random() * (1 - this._attributes.chatFan) * 30;
        },
        callback: () => {
          this.sendMessage(choose(CHAT_LINES));
        },
        getSuccess: () => {
          return this._attributes.chatFan > Math.random();
        }
      },
      [OverWorldBehavior.RandomEmote]: {
        getLength: () => {
          return 5;
        },
        getCooldown: () => {
          return Math.random() * (1 - this._attributes.emoteFan) * 30;
        },
        callback: () => {
          this.doEmote(choose(EMOTES));
        },
        getSuccess: () => {
          return this._attributes.emoteFan > Math.random();
        }
      },
      [OverWorldBehavior.RandomWave]: {
        getLength: () => {
          return 0;
        },
        getCooldown: () => {
          return Math.random() * (1 - this._attributes.waveFan) * 30;
        },
        callback: () => {
          this.doFrame(25);
        },
        getSuccess: () => {
          return this._attributes.waveFan > Math.random();
        },
      },
      [OverWorldBehavior.LeaveRoom]: {
        getLength: () => {
          return 0;
        },
        getCooldown: () => {
          return Math.random() * (1 - this._attributes.roomDistraction) * 300;
        },
        callback: () => {
          this.enter(this.chooseRoom());
        },
        getSuccess: () => {
          return (Math.random() * this._attributes.emptyRoomTolerance + (1 - this._attributes.emptyRoomTolerance) * clamp(room.players.length / 30, 0, 30)) < 0.5;
        }
      },
      [OverWorldBehavior.HostIgloo]: {
        getLength: () => {
          return Math.random() * (this._attributes.danceFan) * 900;
        },
        getCooldown: () => {
          return Math.random() * (1 - this._attributes.roomDistraction) * 300;
        },
        callback: () => {
          this.enter(IGLOO_ROOM_BASE + this.penguin.id);
          this.openIgloo();
        },
        getSuccess: () => {
          return Math.random() * this._attributes.iglooFan > 0.9;
        }
      },
      [OverWorldBehavior.JoinDanceFloor]: {
        getLength: () => {
          return Math.random() * (this._attributes.danceFan + 1) * 180;
        },
        getCooldown: () => {
          return Math.random() * (1 - this._attributes.danceFan) * 30;
        },
        callback: () => {
          this.joinDanceFloor();
        },
        getSuccess: () => {
          return room.id === ROOMS.dance.id && (Math.random() * this._attributes.danceFan > 0.3); 
        }
      },
      [OverWorldBehavior.MatchDanceColor]: {
        getLength: () => {
          return 0;
        },
        getCooldown: () => {
          return Math.random() * (1 - this._attributes.secretsFan) * 30;
        },
        callback: () => {
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
          setTimeout(() => {
            this.wearColor(mostPopular);
          }, 4000 + Math.random() * 2000);
        },
        getSuccess: () => {
          return this._lenghts[OverWorldBehavior.JoinDanceFloor] > now && Math.random() * this._attributes.danceFan > 0.3;
        }
      }
    }

    const setLength = (cat: OverWorldBehavior, cooldown: number) => {
      this._lenghts[cat] = now + cooldown * 1000
    }
    const setCooldown = (cat: OverWorldBehavior, cooldown: number) => {
      this._cooldowns[cat] = now + cooldown * 1000;
    }

    const allowed = new Set<OverWorldBehavior>();
    iterateEntries(this._lenghts, (behavior, time) => {
      if (time > now) {
        allowedMapping[Number(behavior) as OverWorldBehavior].forEach(b => {
          allowed.add(b);
        });
      }
    });

    for (const action of shuffleArray(Object.keys(actions))) {
      const actionEnum = Number(action) as OverWorldBehavior;
      if (allowed.size > 0 && !allowed.has(actionEnum)) {
        continue;
      }
      const options = actions[actionEnum];
      if (options.getSuccess()) {
        const len = options.getLength();
        const cooldown = options.getCooldown();
        options.callback();
        setLength(actionEnum, len);
        setCooldown(actionEnum, len + cooldown);
        break;
      }
    }
  }

  public end() {};
  public buffer = '';
}