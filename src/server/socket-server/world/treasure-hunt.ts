import { WorldTable } from "./world-table";


// placeholder until the correct logic is implemented
export class TreasureHuntTable extends WorldTable {
  override createBoard(): void {
    
  }

  override serializeBoard(): string {
    return '';
  }

  override getMoveLength(): number {
    return 0;
  }

  override sendMove(moves: number[]): [Array<string | number> | null, Array<string | number> | null] {
    return [[], []];
  }

  override getAutomaticTurnChange(): boolean {
    return false;
  }
}