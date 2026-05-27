import { EffectService } from "@common/utils";
import { LOGIN_PORT } from "@server/servers";

import { SettingsManager } from "@server/settings";
import { PenguinRepository } from "@server/database/database";
import { GameData } from "@server/timelines/game-data";

import { ClientSocket, MessageHandler, setupSocketServer } from "./socket-server";

import { PenguinMessenger } from "@server/handlers/messenger";

import { XmlHandler } from "./world/xml-handler";
import { createLoginXmlHandler } from "./world/login-handlers";

class LoginServer implements MessageHandler {
  private _msg: PenguinMessenger;
  private _handler: XmlHandler;

  constructor(private gameData: GameData, private settings: SettingsManager, private db: PenguinRepository) {
    this._msg = new PenguinMessenger();
    this._handler = createLoginXmlHandler();
  }

  public handle(client: ClientSocket, message: string): void {
    this._handler.handle({ 
      msg: this._msg,
      data: this.gameData,
      settings: this.settings,
      db: this.db,
      client
    }, message); 
  };

  public async disconnect() {}
}

export const setupLoginServer = async (settings: SettingsManager, db: PenguinRepository, gameData: GameData): Promise<EffectService<void>> => {
  const loginServer = new LoginServer(gameData, settings, db);
  await setupSocketServer('login', LOGIN_PORT, loginServer);
}