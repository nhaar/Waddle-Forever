import { JsonDatabase } from "@server/database";
import { logverbose } from "@server/logger";
import { Penguin } from "@server/penguin";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { ClientSocket, getXtMessage } from "..";

export class LoginClient {
  private _socket: ClientSocket;

  constructor(socket: ClientSocket, private gameData: GameData, private settingsManager: SettingsManager, private _db: JsonDatabase) {
    this._socket = socket;
  }

  get socket() {
    return this._socket;
  }

  get data() {
    return this.gameData;
  }

  async send (message: string): Promise<void> {
    return this.socket?.write(message)
  }

  get settings() {
    return this.settingsManager.settings;
  }

  get db() {
    return this._db;
  }

  getPenguinFromName (name: string): number {
    const penguin = Penguin.getPenguinFromName(name, this.settingsManager.getVirtualDate(0).getTime(), this.settings.always_member);

    return penguin.id;
  }

  async sendXt (handler: string, ...args: Array<number | string>): Promise<void> {
    logverbose('\x1b[32mSending XT from Login:\x1b[0m ', handler, args);
    await this.send(getXtMessage(false, handler, ...args));
  }
}