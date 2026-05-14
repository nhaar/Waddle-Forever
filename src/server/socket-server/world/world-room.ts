import { WaddleRoom } from "./waddle-room";
import { WorldEntity } from "./world-penguin";
import { RoomState, WorldPenguin } from "./world-penguin";
import { WorldTable } from "./world-table";

export class WorldRoom extends WorldEntity {
  private penguins = new Map<WorldPenguin, RoomState>();
  private waddles = new Map<number, WaddleRoom>();
  private tables = new Map<number, WorldTable>();

  constructor(onAdd: (p: WorldPenguin, e: WorldEntity) => void, onRemove: (p: WorldPenguin) => void, private _id: number) {
    super(onAdd, onRemove);
  }

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
    this.addClient(penguin);
  }

  public getState(penguin: WorldPenguin) {
    const state = this.penguins.get(penguin);
    if (state === undefined) {
      throw new Error("Penguin not found");
    }
    return state;
  }

  public removePenguin(penguin: WorldPenguin): void {
    this.removeClient(penguin);
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
    return waddle.addPenguin(penguin)
  }

  public getTable(id: number) {
    let table = this.tables.get(id);
    if (table === undefined) {
      throw new Error();
    }
    // if (table === undefined) {
    //   if (WorldTable.FIND_FOUR_TABLE_IDS.has(id)) {
    //     table = new FindFourTable(id);
    //   } else if (WorldTable.MANCALA_TABLE_IDS.has(id)) {
    //     table = new MancalaTable(id);
    //   } else {
    //     throw new Error('Unknown table id');
    //   }

    //   this.tables.set(id, table);
    // }
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
}