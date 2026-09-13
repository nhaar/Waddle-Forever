import { choose, clamp, randomInt, randomLogNormal } from "@common/utils";
import { WorldPenguin } from "./world-penguin";
import { WorldRoom } from "./world-room";
import { getPenguinString } from "../handlers/join";
import { GameData } from "@server/timelines/game-data";
import { World } from "./world";
import { ClientSocket } from "../socket-server";
import { WorldTable } from "./world-table";
import { FindFourTable } from "./find-four";
import { MancalaTable } from "./mancala";
import { sendTableMove } from "../handlers/room";
import { CardJitsu, NinjaPlayer } from "./card";

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

/** How long a bot "thinks" before playing a table move, in ms */
const TABLE_THINK_MIN = 1800;
const TABLE_THINK_MAX = 4200;

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


  constructor(
    private _penguin: WorldPenguin,
    private _data: GameData,
    private _world: World,
    private send: SendFunction,
    public nextActionAt: number,
    writeFn: WriteFunction,
    returnFn: (b: Bot) => void
  ) {
    this._simulate = (e, c, ...a) => writeFn(this, e, c, ...a);
    this.returnToIsland = () => returnFn(this);
  }

  public get penguin() {
    return this._penguin;
  }

  public enter(room: WorldRoom): void {
    const x = randomInt(WALK_AREA.minX, WALK_AREA.maxX);
    const y = randomInt(WALK_AREA.minY, WALK_AREA.maxY);
    room.addPenguin(this._penguin, x, y);
    this._world.enterState(this._penguin, { room });
    this.send(
      room.players,
      'ap',
      getPenguinString(this._data, this._penguin, { x, y, frame: 1 })
    );
  }

  public leave(room: WorldRoom): void {
    room.removePenguin(this._penguin);
    this.send(
      room.players,
      'rp',
      this._penguin.id,
      ...room.playerStates.map(([p, s]) => getPenguinString(this._data, p, s))
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

  public sitAtTable(room: WorldRoom, table: WorldTable): void {
    const seat = table.assignSeatIndex(this._penguin);
    if (seat === WorldTable.TABLE_SPECTATOR_SEAT) {
      return;
    }
    this.busy = true;

    this.send(room.players, 'ut', table.getId(), table.getCount());

    table.setJoined(seat);
    this.send(table.penguins, 'uz', seat, this._penguin.name);

    if (!table.hasStarted() && table.hasEveryoneJoined()) {
      table.setStarted();
      this.send(table.penguins, 'sz', table.getTurn());
    }

    this._tableInfo = {
      table,
      seat,
      room,
      timeout: this.tableMove()
    }
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
        table.removePlayer(this._penguin);
        this.send(room.players, 'ut', table.getId(), table.getCount());
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
      const msgs = sendTableMove(this._data, table, room, moves);
      msgs.forEach(([p, m, a]) => this.send(p, m, ...a));
      this._tableInfo.timeout = this.tableMove();
    }, randomInt(TABLE_THINK_MIN, TABLE_THINK_MAX));
  }

  public end() {};
  public buffer = '';
}