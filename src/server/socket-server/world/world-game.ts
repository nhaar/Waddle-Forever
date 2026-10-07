import { isLiteralScoreGame } from "@server/game-logic/rooms";
import { MatchMaker } from "./matchmaker";
import { WorldPenguin } from "./world-penguin";

export class WorldGame {
  private _matchMaker: MatchMaker<WorldPenguin> | null = null;

  constructor(private id: number, mm?: MatchMaker<WorldPenguin>) {
    this._matchMaker = mm ?? null;
  }

  public get matchMaker() {
    return this._matchMaker;
  }

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