import { Table } from "./table";

export class FindFourTable extends Table {
  static FIND_FOUR_WIDTH = 7;
  static FIND_FOUR_HEIGHT = 6;

  private _board: number[][] | undefined;

  override createBoard(): void {
    this._board = Array.from({ length: FindFourTable.FIND_FOUR_WIDTH }, () => Array(FindFourTable.FIND_FOUR_HEIGHT).fill(0));
  }

  isFindFourBoardFull(): boolean {
    if (this._board !== undefined) {
      for (let x = 0; x < FindFourTable.FIND_FOUR_WIDTH; x++) {
        for (let y = 0; y < FindFourTable.FIND_FOUR_HEIGHT; y++) {
          if (this._board[x]?.[y] === 0) {
            return false;
          }
        }
      }
    }
    return true;
  }

  findFourWin(
    lastX: number,
    lastY: number
  ): { x: number; y: number; direction: number; winner: number } | undefined {
    if (this._board === undefined) {
      return undefined;
    }
    const value = this._board[lastX]?.[lastY] ?? 0;
    if (value <= 0) {
      return undefined;
    }

    const inBounds = (x: number, y: number): boolean =>
      x >= 0 && x < FindFourTable.FIND_FOUR_WIDTH && y >= 0 && y < FindFourTable.FIND_FOUR_HEIGHT;

    const countInDirection = (dx: number, dy: number): number => {
      let count = 0;
      if (this._board !== undefined) {
        let x = lastX + dx;
        let y = lastY + dy;
        while (inBounds(x, y) && this._board[x]?.[y] === value) {
          count += 1;
          x += dx;
          y += dy;
        }
      }
      return count;
    };

    const directions = [
      { dx: 1, dy: 0, direction: 2 },
      { dx: 0, dy: 1, direction: 1 },
      { dx: 1, dy: 1, direction: 3 },
      { dx: 1, dy: -1, direction: 4 }
    ];

    let best:
      | { x: number; y: number; direction: number; winner: number; dist: number }
      | undefined;

    for (const { dx, dy, direction } of directions) {
      const back = countInDirection(-dx, -dy);
      const forward = countInDirection(dx, dy);
      const total = back + 1 + forward;
      if (total < 4) {
        continue;
      }
      const lineStartX = lastX - dx * back;
      const lineStartY = lastY - dy * back;
      const startMin = Math.max(0, back - 3);
      const startMax = Math.min(back, total - 4);

      for (let startIndex = startMin; startIndex <= startMax; startIndex++) {
        const startX = lineStartX + dx * startIndex;
        const startY = lineStartY + dy * startIndex;
        const positions = [
          { x: startX, y: startY },
          { x: startX + dx, y: startY + dy },
          { x: startX + dx * 2, y: startY + dy * 2 },
          { x: startX + dx * 3, y: startY + dy * 3 }
        ];
        const anchorY = Math.min(...positions.map((pos) => pos.y));
        const anchorX =
          direction === 4
            ? Math.max(...positions.map((pos) => pos.x))
            : Math.min(...positions.map((pos) => pos.x));
        const centerX = startX + dx * 1.5;
        const centerY = startY + dy * 1.5;
        const dist = (centerX - lastX) ** 2 + (centerY - lastY) ** 2;
        if (best === undefined || dist < best.dist) {
          best = { x: anchorX, y: anchorY, direction, winner: value, dist };
        }
      }
    }

    if (best !== undefined) {
      return { x: best.x, y: best.y, direction: best.direction, winner: best.winner };
    }

    return undefined;
  }

  awardFindFourCoins(winnerSeat?: number): void {
    const rewards: [number, number] = [5, 5];
    if (winnerSeat === 0 || winnerSeat === 1) {
      rewards[winnerSeat] = 10;
    }
    this.awardCoins(rewards);
  }

  override serializeBoard(): string {
    const values: number[] = [];
    if (this._board !== undefined) {
      for (let x = 0; x < FindFourTable.FIND_FOUR_WIDTH; x++) {
        for (let y = 0; y < FindFourTable.FIND_FOUR_HEIGHT; y++) {
          values.push(this._board[x]?.[y] ?? 0);
        }
      }
    }
    return values.join(',');
  }

  override moveLength = 2;

  override automaticTurnChange = true;

  override sendMove(moves: number[]): boolean {
    if (this._board === undefined) {
      return false;
    }
    const column = moves[0];
    const dropRow = moves[1];
    this._board[column][dropRow] = this.turn + 1;
    this.sendPacket('zm', this.turn, column, dropRow);
    const win = this.findFourWin(column, dropRow);
    if (win !== undefined) {
      this.awardFindFourCoins(win.winner - 1);
      this.endGame(win.x, win.y, win.direction);
      return true;
    } else if (this.isFindFourBoardFull()) {
      this.awardFindFourCoins();
      this.endGame(-10, -10, 1);
      return true;
    }
    return false;
  }
};