import { isLiteralScoreGame } from "@server/game-logic/rooms";

export class WorldGame {
  constructor(private id: number) {}

  public getId() {
    return this.id;
  }

  public getCoinsFromScore(score: number): number {
    return isLiteralScoreGame(this.id) ? (
      Number(score)
    ) : (
      Math.floor(Number(score) / 10)
    );
  }
}