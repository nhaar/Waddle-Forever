import { JsonDatabase } from "@server/database";
import { Handler } from "@server/handlers";
import { loginHandler } from "@server/handlers/play/login";
import { LOGIN_PORT } from "@server/servers";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { SocketServer } from "..";
import { PenguinMessenger } from "../world/world-client";
import { LoginContext } from "./login-client";

export class LoginServer extends SocketServer {
  constructor(private gameData: GameData, private settings: SettingsManager, private db: JsonDatabase) {
    super('login', LOGIN_PORT);
  }
  
  override createHandler() {
    const handler = new Handler<LoginContext>((client) => {
      return { 
        data: this.gameData,
        settings: this.settings,
        db: this.db,
        messenger: new PenguinMessenger(client)
      };
    });
    handler.use(loginHandler);
    return handler;
  }
}