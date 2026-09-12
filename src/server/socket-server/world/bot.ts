import { randomInt } from "@common/utils";
import { WorldPenguin } from "./world-penguin";
import { WorldRoom } from "./world-room";
import { getPenguinString } from "../handlers/join";
import { GameData } from "@server/timelines/game-data";
import { World } from "./world";

export type SendFunction = (p: WorldPenguin[] | WorldPenguin, msg: string, ...args: Array<string | number>) => void;

// TODO -> Complete tracking of all walkable boxes
//         (If possible with a FFDEC script)
/**
 * Rough walkable box of a Club Penguin room. The resolution is 760x480, and most
 * floors sit in the lower half of it. Bots that pick a spot outside the walkable
 * area of a specific room just stand there, which is harmless.
 */
export const WALK_AREA = { minX: 120, maxX: 640, minY: 300, maxY: 440 };

export class Bot {
  public busy = false;
  
  constructor(
    private _penguin: WorldPenguin,
    private _data: GameData,
    private _world: World,
    private send: SendFunction,
    public nextActionAt: number
  ) {

  }

  public get penguin() {
    return this._penguin;
  }

  public enter(room: WorldRoom): void {
    const x = randomInt(WALK_AREA.minX, WALK_AREA.maxX);
    const y = randomInt(WALK_AREA.minY, WALK_AREA.maxY);
    room.addPenguin(this._penguin, x, y);
    this._world.enterState(this._penguin, { room });
    this.send(
      room.players,
      'ap',
      getPenguinString(this._data, this._penguin, { x, y, frame: 1 })
    );
  }

  public leave(room: WorldRoom): void {
    room.removePenguin(this._penguin);
    this.send(
      room.players,
      'rp',
      this._penguin.id,
      ...room.playerStates.map(([p, s]) => getPenguinString(this._data, p, s))
    );
  }
}