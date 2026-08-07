import { WorldTable } from "./world-table";

type TreasureTile = [treasure: number, digs: number];

export class TreasureHuntTable extends WorldTable {
  static WIDTH = 10;
  static HEIGHT = 10;
  static STARTING_TURNS = 12;
  static GEM_VALUE = 25;
  static COIN_VALUE = 1;
  static EMERALD_VALUE = 100;

  private treasureMap: TreasureTile[][] = [];
  private coinsHidden = 0;
  private gemsHidden = 0;
  private turns = TreasureHuntTable.STARTING_TURNS;
  private gemLocations: string[] = [];
  private coinsFound = 0;
  private gemsFound = 0;
  private emeraldFound = 0;
  private digRecordNames: string[] = [];
  private digRecordDirections: string[] = [];
  private digRecordNumbers: number[] = [];
  private hasEmerald = false;

  override createBoard(): void {
    this.treasureMap = [];
    this.coinsHidden = 0;
    this.gemsHidden = 0;
    this.turns = TreasureHuntTable.STARTING_TURNS;
    this.gemLocations = [];
    this.coinsFound = 0;
    this.gemsFound = 0;
    this.emeraldFound = 0;
    this.digRecordNames = [];
    this.digRecordDirections = [];
    this.digRecordNumbers = [];
    this.hasEmerald = false;

    for (let row = 0; row < TreasureHuntTable.HEIGHT; row++) {
      this.treasureMap.push([]);
      for (let column = 0; column < TreasureHuntTable.WIDTH; column++) {
        this.treasureMap[row].push([this.generateTreasure(row, column), 0]);
      }
    }
  }

  private generateTreasure(row: number, column: number): number {
    if (this.getGemByPiece(row, column) !== null) {
      return 3;
    }

    let value: number;
    if (row === TreasureHuntTable.HEIGHT - 1 || column === TreasureHuntTable.WIDTH - 1) {
      value = Math.random() * 100 < 80 ? 0 : 1;
    } else {
      const choice = Math.random() * 106;
      value = choice < 80 ? 0 : choice < 100 ? 1 : choice < 101 ? 2 : 4;
    }

    if (value === 1) {
      this.coinsHidden += 1;
    } else if (value > 1) {
      this.gemsHidden += 1;
      this.gemLocations.push(`${row},${column}`);
      if (this.hasEmerald) {
        return 2;
      }
    }

    if (value === 4) {
      this.hasEmerald = true;
    }
    return value;
  }

  private getGemByPiece(row: number, column: number): [number, number] | null {
    const candidates = [
      [row - 1, column],
      [row, column - 1],
      [row - 1, column - 1]
    ];
    for (const [candidateRow, candidateColumn] of candidates) {
      if (candidateRow < 0 || candidateColumn < 0) {
        continue;
      }
      const treasure = this.treasureMap[candidateRow]?.[candidateColumn]?.[0];
      if (treasure === 2 || treasure === 4) {
        return [candidateRow, candidateColumn];
      }
    }
    return null;
  }

  private isGemUncovered(row: number, column: number): boolean {
    if (row === TreasureHuntTable.HEIGHT - 1 || column === TreasureHuntTable.WIDTH - 1) {
      return false;
    }
    return [[0, 1], [1, 1], [1, 0]].every(([deltaRow, deltaColumn]) =>
      this.treasureMap[row + deltaRow][column + deltaColumn][1] === 2
    );
  }

  private dig(row: number, column: number): void {
    const tile = this.treasureMap[row][column];
    tile[1] += 1;
    const [treasure, digs] = tile;
    if (digs !== 2) {
      return;
    }
    if (treasure === 1) {
      this.coinsFound += 1;
    } else if (treasure === 2 && this.isGemUncovered(row, column)) {
      this.gemsFound += 1;
    } else if (treasure === 4 && this.isGemUncovered(row, column)) {
      this.emeraldFound = 1;
    } else if (treasure === 3) {
      const location = this.getGemByPiece(row, column);
      if (location === null || !this.isGemUncovered(...location)) {
        return;
      }
      const gem = this.treasureMap[location[0]][location[1]][0];
      if (gem === 2) {
        this.gemsFound += 1;
      } else if (gem === 4) {
        this.emeraldFound = 1;
      }
    }
  }

  public makeMove(movie: string, direction: string, spade: number): boolean {
    if (!this.isValidMove(movie, direction, spade)) {
      return false;
    }

    if (direction === "right") {
      for (let column = 0; column < TreasureHuntTable.WIDTH; column++) {
        this.dig(spade, column);
      }
    } else {
      for (let row = 0; row < TreasureHuntTable.HEIGHT; row++) {
        this.dig(row, spade);
      }
    }

    this.turns -= 1;
    this.digRecordNames.push(movie);
    this.digRecordDirections.push(direction);
    this.digRecordNumbers.push(spade);

    if (this.turns === 0) {
      const winnings = this.determineWinnings();
      this.awardCoins([winnings, winnings]);
      this.endGame();
    }
    return true;
  }

  private isValidMove(movie: string, direction: string, spade: number): boolean {
    if ((direction !== "right" && direction !== "down") || !Number.isInteger(spade) || spade < 0 || spade > 9) {
      return false;
    }
    if (movie !== `${direction}button${spade}_mc`) {
      return false;
    }
    if (direction === "right") {
      return this.treasureMap[spade].every((tile) => tile[1] !== 2);
    }
    return this.treasureMap.every((row) => row[spade][1] !== 2);
  }

  private determineWinnings(): number {
    return this.coinsFound * TreasureHuntTable.COIN_VALUE
      + this.gemsFound * TreasureHuntTable.GEM_VALUE
      + this.emeraldFound * TreasureHuntTable.EMERALD_VALUE;
  }

  override serializeBoard(): string {
    const map = this.treasureMap.flatMap((row) => row.map(([treasure]) => treasure)).join(",");
    const state: Array<string | number> = [
      TreasureHuntTable.WIDTH,
      TreasureHuntTable.HEIGHT,
      this.coinsHidden,
      this.gemsHidden,
      this.turns,
      TreasureHuntTable.GEM_VALUE,
      TreasureHuntTable.COIN_VALUE,
      this.gemLocations.join(","),
      map
    ];
    if (this.digRecordNumbers.length > 0) {
      state.push(
        this.coinsFound,
        this.gemsFound,
        this.emeraldFound,
        this.digRecordNames.join(","),
        this.digRecordDirections.join(","),
        this.digRecordNumbers.join(",")
      );
    }
    return state.join("%");
  }

  override getMoveLength(): number {
    return 0;
  }

  override sendMove(): [null, null] {
    return [null, null];
  }

  override getAutomaticTurnChange(): boolean {
    return false;
  }
}
