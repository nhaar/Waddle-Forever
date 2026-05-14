import { WorldPenguin } from "./world-penguin";

export abstract class WaddleGame {
  public abstract roomId: number;

  constructor(protected players: Array<WorldPenguin>, onAdd: (p: WorldPenguin, e: WaddleGame) => void, private onRemove: (p: WorldPenguin) => void) {
    players.forEach(p => onAdd(p, this));
  }

  public removePlayer(penguin: WorldPenguin): void {
    const index = this.players.indexOf(penguin);
    if (index !== -1) {
      this.players.splice(index, 1);
    }
    this.onRemove(penguin);
  }

  public getPlayerCount() {
    return this.players.length;
  }

  public getPlayers() {
    return [...this.players];
  }

  getSeatId(penguin: WorldPenguin): number {
    return this.players.indexOf(penguin);
  }
}