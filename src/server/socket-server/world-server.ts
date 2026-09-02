// ZAAAA WAAAARUDO!

import { EffectService } from "@common/utils";
import { WORLD_PORT } from "@server/servers";

import { SettingsManager } from "@server/settings";
import { PenguinRepository } from "@server/database/database";
import { GameData } from "@server/timelines/game-data";

import { ClientSocket, MessageHandler, setupSocketServer } from "./socket-server";

import { PenguinMessenger } from "@server/socket-server/messenger";

import { World } from "./world/world";

import { addBakeryListener } from "./handlers/party";
import { addMatchmakerListeners } from "./handlers/ninja";

import { XtHandler } from "./xt-handler";
import { XmlHandler } from "./xml-handler";
import { createWorldXtHandler } from "./world-handlers";
import { createLoginXmlHandler } from "./login-handlers";
import { PenguinPersister, WorldContext } from "@server/socket-server/handlers/handlers";
import { CommandsHandler, getCommandsHandler } from "@server/commands/commands";
import { OfflineWorld } from "./offline-world";

export class WorldServer implements MessageHandler {
  private _world: World;
  private _msg = new PenguinMessenger();
  private _off: OfflineWorld;
  private _commandsHandler: CommandsHandler;
  private _xtHandler: XtHandler;
  private _xmlHandler: XmlHandler;
  private _persister: PenguinPersister;
  
  constructor(private _settings: SettingsManager, private _gameData: GameData, private _db: PenguinRepository) {
    this._off = new OfflineWorld(_db);
    this._world = new World(_gameData);

    this._commandsHandler = getCommandsHandler();

    this._persister = (p, force = false) => { 
      if (p.canSave || force) {
        this._db.write(p.id, p.getJSON());
      }
    };

    this._xtHandler = createWorldXtHandler();
    this._xmlHandler = createLoginXmlHandler();

    this.init();
  }

  public runCommand(penguinId: number, name: string, args: string[]) {
    const penguin = this._world.getById(penguinId);
    if (penguin !== undefined) {
      const client = this._msg.getClient(penguin);
      this._commandsHandler.run({
        world: this._world,
        penguin,
        prst: this._persister,
        msg: this._msg,
        data: this._gameData,
        db: this._db,
        settings: this._settings,
        off: this._off,
        client,
        room: this._world.getPenguinRoom(penguin)
      }, name, args);
    }
  }

  public getAllPlayersInfo() {
    return this._world.players.map(p => ({
      name: p.name,
      id: p.id
    }));
  }

  private init() {
    addBakeryListener(this._world, this._msg);
    addMatchmakerListeners(this._world, this._msg);
  }

  public async reset() {
    await Promise.all(this._msg.getClients().map(client => this.disconnect(client)));
    this._msg.close();
    this._msg = new PenguinMessenger();
    this._world = new World(this._gameData);
    this.init();
  }

  private getContext(client: ClientSocket): WorldContext {
    const penguin = this._msg.getPenguin(client);
    return {
      world: this._world,
      msg: this._msg,
      data: this._gameData,
      settings: this._settings,
      db: this._db,
      prst: this._persister,
      off: this._off,

      client,

      ...(penguin === undefined ? {} : {
        penguin, ...this._world.getContext(penguin)
      })
    };
  }

  public handle(client: ClientSocket, message: string): void {
    if (message.startsWith('<')) {
      this._xmlHandler.handle({ 
        msg: this._msg,
        data: this._gameData,
        settings: this._settings,
        db: this._db,
        off: this._off,
        client,
        world: this._world
      }, message);
    } else {
      this._xtHandler.handle(client, this.getContext(client), message);
    }
  }

  public async disconnect(client: ClientSocket): Promise<void> {
    const context = this.getContext(client);
    await this._xtHandler.disconnect(context);
  }
}

export const setupWorldServer = async (settings: SettingsManager, db: PenguinRepository, gameData: GameData): Promise<EffectService<WorldServer>> => {
  const world = new WorldServer(settings, gameData, db);
  await setupSocketServer('world', WORLD_PORT, world);
  return world;
}
