import { Table } from "./table";

export class MancalaTable extends Table {
  private _board: number[] | undefined;

  override createBoard(): void {
    this._board = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
  }

  isMancalaCupForPlayer(player: number, cup: number): boolean {
    return player === 0 ? cup >= 0 && cup <= 5 : cup >= 7 && cup <= 12;
  }

  isMancalaSideEmpty(player: number): boolean {
    if (this._board === undefined) {
      return true;
    }
    const start = player === 0 ? 0 : 7;
    const end = player === 0 ? 5 : 12;
    for (let i = start; i <= end; i++) {
      if (this._board[i] > 0) {
        return false;
      }
    }
    return true;
  }

  applyMancalaMove(board: number[], player: number, cup: number): { command: string; nextTurn: number; gameOver: boolean } {
    let stones = board[cup];
    board[cup] = 0;

    const opponentMancala = player === 0 ? 13 : 6;
    let index = cup;
    while (stones > 0) {
      index = (index + 1) % 14;
      if (index === opponentMancala) {
        index = (index + 1) % 14;
      }
      board[index] += 1;
      stones -= 1;
    }

    const playerMancala = player === 0 ? 6 : 13;
    const lastCup = index;
    let command = '';
    let nextTurn = player === 0 ? 1 : 0;

    if (lastCup === playerMancala) {
      command = 'f';
      nextTurn = player;
    } else if (this.isMancalaCupForPlayer(player, lastCup) && board[lastCup] === 1) {
      const oppositeCup = 12 - lastCup;
      if (board[oppositeCup] > 0) {
        command = 'c';
        board[playerMancala] += board[oppositeCup] + board[lastCup];
        board[oppositeCup] = 0;
        board[lastCup] = 0;
      }
    }

    const gameOver = this.isMancalaSideEmpty(0) || this.isMancalaSideEmpty(1);
    return { command, nextTurn, gameOver };
  }


  getMancalaScore(player: number): number {
    let total = 0;
    if (this._board !== undefined) {
      const start = player === 0 ? 0 : 7;
      const end = player === 0 ? 6 : 13;
      for (let i = start; i <= end; i++) {
        total += this._board[i];
      }
    }
    return total;
  }

  awardMancalaCoins(): void {
    this.awardCoins([this.getMancalaScore(0), this.getMancalaScore(1)])
  }

  override serializeBoard(): string {
    if (this._board == undefined) {
      return '';
    }
    return this._board.join(',');
  }

  override moveLength = 1;

  override automaticTurnChange = false;

  override sendMove(moves: number[]): boolean {
    const cup = moves[0];
    if (!this.isMancalaCupForPlayer(this.turn, cup)) {
      return false;
    }
    if (this._board === undefined || this._board[cup] <= 0) {
      return false;
    }

    const { command, nextTurn, gameOver } = this.applyMancalaMove(this._board, this.turn, cup);
    const zmArgs: Array<number | string> = [this.turn, cup];
    if (command !== '') {
      zmArgs.push(command);
    }
    this.sendPacket('zm', ...zmArgs);
    this._turn = nextTurn;
    if (gameOver) {
      this.setEnded();
      this.awardMancalaCoins();
      this.sendPacket('zo');
      return true;
    }
    return false;
  }
}