import { EffectService } from "@common/utils";
import { LOGIN_PORT } from "@server/servers";

import { SettingsManager } from "@server/settings";
import { PenguinRepository } from "@server/database/database";
import { GameData } from "@server/timelines/game-data";

import { setupSocketServer } from "..";

import { PenguinMessenger } from "@server/handlers/messenger";

import { WorldContext } from "../world/world";

import { Handler } from "@server/handlers";
import { loginHandler } from "@server/handlers/play/login";

export type LoginContext = Pick<WorldContext, 'msg' | 'data' | 'settings' | 'db' |'client'>;

class LoginServer {
  private _msg: PenguinMessenger;
  private _handler: Handler<LoginContext>;

  constructor(private gameData: GameData, private settings: SettingsManager, private db: PenguinRepository) {
    this._msg = new PenguinMessenger();
    const handler = new Handler<LoginContext>((client) => {
      return { 
        msg: this._msg,
        data: this.gameData,
        settings: this.settings,
        db: this.db,
        client
      };
    });
    handler.use(loginHandler);
    this._handler = handler;
  }
  
  public get handler() {
    return this._handler;
  }
}

export const setupLoginServer = async (settings: SettingsManager, db: PenguinRepository, gameData: GameData): Promise<EffectService<void>> => {
  const loginServer = new LoginServer(gameData, settings, db);
  await setupSocketServer('login', LOGIN_PORT, loginServer.handler);
}