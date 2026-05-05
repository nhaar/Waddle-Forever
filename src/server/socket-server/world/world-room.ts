import { PenguinEquipmentSlot } from "@server/penguin";
import { FindFourTable } from "./find-four";
import { MancalaTable } from "./mancala";
import { WaddleRoom } from "./waddle-room";
import { ContextAdder, ContextRemover, WorldEntity } from "./world-penguin";
import { RoomState, WorldPenguin } from "./world-penguin";
import { WorldTable } from "./world-table";

/** Maps the slot name to what it's called in the packets */
const EQUIP_SLOT_MAPPINGS: Record<PenguinEquipmentSlot, string> = {
  color: 'c',
  head: 'h',
  face: 'f',
  neck: 'n',
  body: 'b',
  hand: 'a',
  feet: 'e',
  pin: 'l',
  background: 'p'
}

export class WorldRoom extends WorldEntity {
  private penguins = new Map<WorldPenguin, RoomState>();
  private waddles = new Map<number, WaddleRoom>();
  private tables = new Map<number, WorldTable>();

  constructor(onAdd: (p: WorldPenguin, e: WorldEntity) => void, onRemove: (p: WorldPenguin) => void, private id: number) {
    super(onAdd, onRemove);
  }

  public getPlayers(): string[] {
    return [...this.penguins.entries()].map(([penguin, info]) => {
      return penguin.getString(info);
    });
  }

  public getPlayerStates() {
    return this.penguins.entries();
  }

  public addPenguin(penguin: WorldPenguin, x: number, y: number): void {
    this.addClient(penguin);
    const state = { x, y, frame: 1 };
    this.penguins.set(penguin, state);

    const string = penguin.getString(state);
    penguin.sendXt('jr', this.id, ...this.getPlayers());
    this.sendXt('ap', string);
    // it seems that the new x, y position of players must be sent via a new set position packet
    this.move(penguin, x, y);
  }

  public getState(penguin: WorldPenguin) {
    const state = this.penguins.get(penguin);
    if (state === undefined) {
      throw new Error("Penguin not found");
    }
    return state;
  }

  public move(penguin: WorldPenguin, x: number, y: number): void {
    this.penguins.set(penguin, { x, y, frame: 1 });
    this.sendXt('sp', penguin.id, x, y);
  }

  public teleport(penguin: WorldPenguin, x: number, y: number, frame: number): void {
    this.penguins.set(penguin, { x, y, frame });
    this.sendXt('st', penguin.id, x, y, frame);
  }

  public removePenguin(penguin: WorldPenguin): void {
    this.removeClient(penguin);
    this.penguins.delete(penguin);

    const players = this.getPlayers();
    // because minigames get the player from their previous room, you can't
    // send the remove player packet to the player leaving otherwise it won't
    // find itself and minigame features (the penguin color) won't work
    this.sendXt('rp', penguin.id, ...players);
  }

  public sendXt(message: string, ...args:Array<string | number>): void {
    [...this.penguins.keys()].forEach(p => p.sendXt(message, ...args));
  }

  public throwSnowball(penguin: WorldPenguin, x: string, y: string): void {
    this.sendXt('sb', penguin.id, x, y);
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

  public enterWaddleRoom(waddle: WaddleRoom, penguin: WorldPenguin): void {
    const seat = waddle.addPenguin(penguin)
    penguin.sendXt('jw', seat);
    this.sendXt('uw', waddle.getId(), seat, penguin.info.name, penguin.id);
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

  public getPenguinTable(penguin: WorldPenguin): WorldTable | null {
    for (const table of this.tables.values()) {
      if (table.hasPlayer(penguin)) {
        return table;
      }
    }

    return null;
  }

  public sendTableState(table: WorldTable) {
    this.sendXt('ut', table.getId(), table.getCount());
  }

  public getId() {
    return this.id;
  }

  public setFrame(penguin: WorldPenguin, frame: number) {
    const info = this.penguins.get(penguin);
    if (info !== undefined) {
      info.frame = frame;
    }
  }

  public updateEquipment(penguin: WorldPenguin, slot: PenguinEquipmentSlot, id: number): void {
    penguin.info[slot] = id;
    this.sendXt(`up${EQUIP_SLOT_MAPPINGS[slot]}`, penguin.id, id);
  }
}