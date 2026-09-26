import { EffectService } from "@common/utils";
import { SNOW_PORT } from "@server/servers";

import { SettingsManager } from "@server/settings";
import { PenguinRepository } from "@server/database/database";
import { GameData } from "@server/timelines/game-data";

import { ClientSocket, MessageHandler, setupSocketServer } from "./socket-server";

import { PenguinMessenger } from "@server/socket-server/messenger";

import { XmlHandler } from "./xml-handler";
import { createSnowXmlHandler, createSnowDataHandler } from "./snow-handlers";
import { SnowContext, SnowDataHandler, SnowPenguinContext } from "./snow-data-handler";
import { SnowPlayer, SnowWorld } from "./world/snow/snow";
import { PenguinPersister } from "./handlers/handlers";
import { OfflineWorld } from "./offline-world";
import { setAssets } from "./world/snow/snow-assets";
import { setupMatchMaker } from "./handlers/snow";

class SnowServer implements MessageHandler {
  private _msg: PenguinMessenger<SnowPlayer>;
  private _handler: SnowDataHandler;
  private _xmlHandler: XmlHandler;
  private _world: SnowWorld
  private _persister: PenguinPersister;
  private _off: OfflineWorld;

  constructor(private gameData: GameData, private settings: SettingsManager, private db: PenguinRepository) {
    this._msg = new PenguinMessenger<SnowPlayer>((p): p is SnowPlayer => p instanceof SnowPlayer);
    this._handler = createSnowDataHandler();
    this._xmlHandler = createSnowXmlHandler();
    this._off = new OfflineWorld(db);
    this._world = new SnowWorld();
    this._world.init(this.getContext());

    this._persister = (p, force = false) => { 
      if (p.canSave || force) {
        this.db.write(p.id, p.getJSON());
      }
    };

    setupMatchMaker(this._world);
  }

  private getContext(): SnowContext {
    return {
      world: this._world,
      msg: this._msg,
      data: this.gameData,
      settings: this.settings,
      db: this.db,
      prst: this._persister,
      off: this._off
    };
  }

  private getPenguinCtx(client: ClientSocket): SnowPenguinContext {
    const penguin = this._msg.getPenguin(client);
    const game = Array.from(this._world.games).find(game => game.players.includes(penguin)) ?? null;
    return {
      ...this.getContext(),
      client,
      penguin,
      game
    };
  }

  public async setAssets() {
    await setAssets({ world: this._world } as SnowContext);
  }

  public async handle(client: ClientSocket, message: string) {
    if (message.startsWith('<')) {
      this._xmlHandler.handle({ client } as SnowPenguinContext, message);
    } else {
      await this._handler.handle(this.getPenguinCtx(client), message)
    }
  };

  public async connect(cs: ClientSocket) {
    const { msg, client } = this.getPenguinCtx(cs);
    const p = new SnowPlayer(this.getContext());
    msg.linkClient(client, p);
  }

  public async disconnect(cs: ClientSocket) {
    const { penguin, game } = this.getPenguinCtx(cs);
    penguin.disconnected = true;
    this._world.disconnect(penguin);
    if (game !== null && penguin.ninja !== null) {
      game.callbacks.forceFireClientEvents(penguin);
      game.windowEvents.fireAllForPlayer(penguin);
      penguin.ninja.setHealth(0);
    }
  }
}

export const setupSnowServer = async (settings: SettingsManager, db: PenguinRepository, gameData: GameData): Promise<EffectService<void>> => {
  const snowServer = new SnowServer(gameData, settings, db);
  await snowServer.setAssets();
  await setupSocketServer('CJ Snow', SNOW_PORT, snowServer);
}