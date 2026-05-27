import { WorldPenguin } from "./world-penguin";

export abstract class WaddleGame {
  public abstract roomId: number;

  constructor(protected players: Array<WorldPenguin>) {}

  public removePlayer(penguin: WorldPenguin): void {
    const index = this.players.indexOf(penguin);
    if (index !== -1) {
      this.players.splice(index, 1);
    }
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