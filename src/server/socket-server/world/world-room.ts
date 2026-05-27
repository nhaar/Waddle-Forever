import { FindFourTable } from "./find-four";
import { MancalaTable } from "./mancala";
import { WaddleRoom } from "./waddle-room";
import { RoomState, WorldPenguin } from "./world-penguin";
import { WorldTable } from "./world-table";

export class WorldRoom {
  private penguins = new Map<WorldPenguin, RoomState>();
  private waddles = new Map<number, WaddleRoom>();
  private tables = new Map<number, WorldTable>();

  static MANCALA_TABLE_IDS = new Set([100, 101, 102, 103, 104]);
  static FIND_FOUR_TABLE_IDS = new Set([200, 201, 202, 203, 204, 205, 206, 207]);

  constructor(private _id: number) {}

  public getPlayers(): string[] {
    return [];
  }

  public getPlayerStates() {
    return this.penguins.entries();
  }

  public get players() {
    return [...this.penguins.keys()];
  }

  public get playerStates() {
    return [...this.penguins.entries()];
  }

  public addPenguin(penguin: WorldPenguin, x: number, y: number): void {
    this.penguins.set(penguin, { x, y, frame : 1});
  }

  public getState(penguin: WorldPenguin) {
    const state = this.penguins.get(penguin);
    if (state === undefined) {
      throw new Error("Penguin not found");
    }
    return state;
  }

  public removePenguin(penguin: WorldPenguin): void {
    this.penguins.delete(penguin);
  }

  public addWaddle(id: number, waddle: WaddleRoom): void {
    this.waddles.set(id, waddle);
  }

  public getWaddleRooms() {
    return [...this.waddles.values()];
  }

  public getWaddleRoom(id: number): WaddleRoom | undefined {
    return this.waddles.get(id);
  }

  public enterWaddleRoom(waddle: WaddleRoom, penguin: WorldPenguin): number {
    const index = waddle.addPenguin(penguin);
    if (index === null) {
      throw new Error("Somehow entered full waddle room");
    }
    return index;
  }

  public getTable(id: number) {
    let table = this.tables.get(id);
    if (table === undefined) {
      if (WorldTable.FIND_FOUR_TABLE_IDS.has(id)) {
        table = new FindFourTable(id);
      } else if (WorldTable.MANCALA_TABLE_IDS.has(id)) {
        table = new MancalaTable(id);
      } else {
        throw new Error('Unknown table id');
      }

      this.tables.set(id, table);
    }
    return table;
  }

  public getPenguinTable(penguin: WorldPenguin) {
    for (const table of this.tables.values()) {
      if (table.hasPlayer(penguin)) {
        return table;
      }
    }

    return null;
  }

  public get id() {
    return this._id;
  }

  public setFrame(penguin: WorldPenguin, frame: number) {
    const info = this.penguins.get(penguin);
    if (info !== undefined) {
      info.frame = frame;
    }
  }

  public updatePosition(penguin: WorldPenguin, x: number, y: number): void {
    // dance animation resets
    this.penguins.set(penguin, { x, y, frame: 1 });
  }

  public updateFrame(penguin: WorldPenguin, frame: number): void {
    this.penguins.set(penguin, { ...this.getState(penguin), frame });
  }

  public hasTable(): boolean {
    return this.tables.size > 0;
  }

  public getTables(): WorldTable[] {
    return [...this.tables.values()];
  }
}