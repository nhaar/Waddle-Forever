import { Handler } from "@server/handlers";
import { LOGIN_PORT } from "@server/servers";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { SocketServer } from "..";
import { PenguinRepository } from "@server/database/database";
import { WorldContext } from "../world/world";
import { PenguinMessenger } from "@server/handlers/messenger";
import { loginHandler } from "@server/handlers/play/login";

export type LoginContext = Pick<WorldContext, 'msg' | 'data' | 'settings' | 'db' |'client'>;
export class LoginServer extends SocketServer {
  private _messenger: PenguinMessenger;
  
  constructor(private gameData: GameData, private settings: SettingsManager, private db: PenguinRepository) {
    super('login', LOGIN_PORT);
    this._messenger = new PenguinMessenger();
  }
  
  override createHandler() {
    const handler = new Handler<LoginContext>((client) => {
      return { 
        msg: this._messenger,
        data: this.gameData,
        settings: this.settings,
        db: this.db,
        client
      };
    }, () => {});
    handler.use(loginHandler);
    return handler;
  }
}