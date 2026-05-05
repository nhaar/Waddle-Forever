import { WaddleName } from "@server/game-logic/waddles";
import { WorldPenguin } from "./world-penguin";

export class WaddleRoom {
  private players: Array<WorldPenguin | null>;
  private seatIndex = 0;

  constructor(private id: number, private seats: number, private game: WaddleName) {
    this.players = new Array(seats).fill(null);
  }

  public getId() {
    return this.id;
  }

  public getSeats() {
    return [...this.players];
  }

  public addPenguin(penguin: WorldPenguin): number {
    this.players[this.seatIndex] = penguin;
    const seat = this.seatIndex;
    this.seatIndex++;
    return seat;
  }

  public isFull() {
    return this.seatIndex === this.players.length;
  }

  public getGame() {
    return this.game;
  }

  public reset() {
    this.players = new Array(this.seats).fill(null);
    return this.seatIndex = 0;
  }
}