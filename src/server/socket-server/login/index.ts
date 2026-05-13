import { Handler } from "@server/handlers";
import { LOGIN_PORT } from "@server/servers";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { SocketServer } from "..";
import { PenguinRepository } from "@server/database/database";

export type LoginContext = {
  // db: JsonDatabase;
  // settings: SettingsManager;
  // data: GameData;
  // messenger: PenguinMessenger;
}

export class LoginServer extends SocketServer {
  constructor(private gameData: GameData, private settings: SettingsManager, private db: PenguinRepository) {
    super('login', LOGIN_PORT);
  }
  
  override createHandler() {
    const handler = new Handler<LoginContext>((client) => {
      return { 
        // data: this.gameData,
        // settings: this.settings,
        // db: this.db,
        // messenger: new PenguinMessenger(client)
      };
    }, () => {});
    // handler.use(loginHandler);
    return handler;
  }
}