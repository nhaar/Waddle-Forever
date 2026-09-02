import { WorldPenguin } from "./world-penguin";

export abstract class WaddleGame {
  public abstract roomId: number;
  private _gameSeats: WorldPenguin[];

  constructor(protected _players: Array<WorldPenguin>) {
    this._gameSeats = [..._players];
  }

  public removePlayer(penguin: WorldPenguin): void {
    const index = this._players.indexOf(penguin);
    if (index !== -1) {
      this._players.splice(index, 1);
    }
  }

  public getPlayerCount() {
    return this._players.length;
  }

  public get players() {
    return [...this._players];
  }

  getSeatId(penguin: WorldPenguin): number {
    return this._gameSeats.indexOf(penguin);
  }
}