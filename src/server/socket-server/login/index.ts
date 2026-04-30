import { JsonDatabase } from "@server/database";
import { loginHandler } from "@server/handlers/play/login";
import { LOGIN_PORT } from "@server/servers";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { ClientSocket, SocketServer } from "..";
import { LoginClient } from "./login-client";

export class LoginServer extends SocketServer<LoginClient> {
  constructor(private gameData: GameData, private settings: SettingsManager, private db: JsonDatabase) {
    super('login', LOGIN_PORT);
  }
  
  override createHandler() {
    return loginHandler;
  }

  override makeClient(socket: ClientSocket): LoginClient {
    return new LoginClient(
      socket,
      this.gameData,
      this.settings,
      this.db
    );
  }
}