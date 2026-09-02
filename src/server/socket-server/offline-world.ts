import { PenguinRepository } from "@server/database/database";
import { OfflinePenguin } from "./world/world-penguin";

// Note -> Offline world never unloads penguins
// Once a penguin is updated offline, it will remain in memory until it logins in
export class OfflineWorld {
  private _penguins = new Map<number, OfflinePenguin>();

  constructor(private _db: PenguinRepository) {}

  public async getPenguin(id: number): Promise<OfflinePenguin | undefined> {
    const saved = this._penguins.get(id);
    if (saved === undefined) {
      const data = await this._db.get(id);
      if (data === null) {
        return undefined;
      } else {
        const penguin = new OfflinePenguin(id, data);
        this._penguins.set(id, penguin);
        return penguin;
      }
    } else {
      return saved;
    }
  }

  public removePenguin(id: number) {
    this._penguins.delete(id);
  }
}