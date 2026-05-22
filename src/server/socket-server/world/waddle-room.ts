import { WaddleName } from "@server/game-logic/waddles";
import { WorldPenguin } from "./world-penguin";

export class WaddleRoom {
  private _seats: Array<WorldPenguin | null>;
  private _capacity: number;
  private _takenIndex = 0;

  constructor(private id: number, seats: number, private game: WaddleName) {
    this._capacity = seats;
    this._seats = new Array(seats).fill(null);
  }

  public getId() {
    return this.id;
  }

  public getSeats() {
    return [...this._seats];
  }

  public addPenguin(penguin: WorldPenguin): number | null {
    if (this._takenIndex < this._capacity) {
      const seat = this._takenIndex;
      this._seats[seat] = penguin;
      for (this._takenIndex = seat + 1; this._takenIndex < this._capacity; this._takenIndex++) {
        if (this._seats[this._takenIndex] === null) {
          break;
        }
      }
      return seat;
    }
    return null;
  }

  public isFull() {
    return this._takenIndex >= this._capacity;
  }

  public getGame() {
    return this.game;
  }

  public reset() {
    this._seats = new Array(this._capacity).fill(null);
    this._takenIndex = 0;
  }

  public removePlayer(penguin: WorldPenguin) {
    const index = this._seats.findIndex(p => p === penguin);
    if (index > -1) {
      this._seats[index] = null;
      for (let i = 0; i < this._capacity; i++) {
        if (this._seats[i] === null) {
          this._takenIndex = i;
          break;
        }
      }
    }
    return index;
  }
}