import { isLiteralScoreGame } from "@server/game-logic/rooms";
import { ContextAdder, ContextRemover } from "./world-penguin";
import { WorldPenguin } from "./world-penguin";

export class WorldGame {
  constructor(private onAdd: ContextAdder<WorldGame>, private onRemove: ContextRemover, private id: number) {

  }

  public addPenguin(penguin: WorldPenguin) {
    this.onAdd(penguin, this);
  }

  public removePenguin(penguin: WorldPenguin) {
    this.onRemove(penguin);
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