import { EffectService } from "@common/utils";
import { SNOW_PORT } from "@server/servers";

import { SettingsManager } from "@server/settings";
import { PenguinRepository } from "@server/database/database";
import { GameData } from "@server/timelines/game-data";

import { ClientSocket, MessageHandler, setupSocketServer } from "./socket-server";

import { PenguinMessenger } from "@server/socket-server/messenger";

import { XmlHandler } from "./xml-handler";
import { createSnowXmlHandler } from "./snow-handlers";

class SnowServer implements MessageHandler {
  private _msg: PenguinMessenger;
  private _xmlHandler: XmlHandler;

  constructor(private gameData: GameData, private settings: SettingsManager, private db: PenguinRepository) {
    this._msg = new PenguinMessenger();
    this._xmlHandler = createSnowXmlHandler();
  }

  public handle(client: ClientSocket, message: string): void {
    if (message.startsWith('<')) {
      this._xmlHandler.handle({ 
        msg: this._msg,
        data: this.gameData,
        settings: this.settings,
        db: this.db,
        client,
      }, message);
    }
  };

  public async disconnect() {}
}

export const setupSnowServer = async (settings: SettingsManager, db: PenguinRepository, gameData: GameData): Promise<EffectService<void>> => {
  const snowServer = new SnowServer(gameData, settings, db);
  await setupSocketServer('CJ Snow', SNOW_PORT, snowServer);
}