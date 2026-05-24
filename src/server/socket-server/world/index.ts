// ZAAAA WAAAARUDO!

import { EffectService } from "@common/utils";
import { WORLD_PORT } from "@server/servers";

import { SettingsManager } from "@server/settings";
import { PenguinRepository } from "@server/database/database";
import { GameData } from "@server/timelines/game-data";

import { setupSocketServer } from "..";

import { PenguinMessenger } from "@server/handlers/messenger";

import { PenguinPersister, World, WorldContext } from "./world";

import { Handler } from "@server/handlers";
import { createWorldHandler } from "./world-handlers";

import { addBakeryListener } from "@server/handlers/play/party";
import { addMatchmakerListeners } from "@server/handlers/play/ninja";

import { CommandsHandler } from "./commands";
import { CommandContext, commands } from "./command-handlers";


export class WorldServer {
  private _world: World;
  private _msg = new PenguinMessenger();
  private _commandsHandler: CommandsHandler<CommandContext>;
  private _handler: Handler<WorldContext>;
  private _persister: PenguinPersister;
  
  constructor(settings: SettingsManager, private _gameData: GameData, private _db: PenguinRepository) {
    this._world = new World(_gameData);

    this._commandsHandler = new CommandsHandler(commands.get());

    this._persister = (p, force = false) => { 
      if (p.preference.canSave || force) {
        this._db.write(p.id, p.getJSON());
      }
    };

    this._handler = createWorldHandler(settings, _db, _gameData, this._world, this._msg, this._persister);

    this.init();
  }

  public get handler() {
    return this._handler;
  }

  public runCommand(penguinId: number, name: string, args: string[]) {
    const penguin = this._world.getById(penguinId);
    if (penguin !== undefined) {
      const ctx: CommandContext = {
        world: this._world,
        penguin,
        prst: this._persister,
        msg: this._msg,
        data: this._gameData,
        db: this._db,  
        room: this._world.getContext(penguin)?.room
      }
      this._commandsHandler.run(ctx, name, args);
    }
  }

  public getAllPlayersInfo() {
    return this._world.players.map(p => ({
      name: p.name,
      id: p.id
    }));
  }

  public init() {
    addBakeryListener(this._world, this._msg);
    addMatchmakerListeners(this._world, this._msg);
  }

  public async reset() {
    await Promise.all(this._msg.getClients().map(client => this._handler.disconnect(client)));
    this._msg.close();
    this._msg = new PenguinMessenger();
    this._world = new World(this._gameData);
    this.init();
  }
}

export const setupWorldServer = async (settings: SettingsManager, db: PenguinRepository, gameData: GameData): Promise<EffectService<WorldServer>> => {
  const world = new WorldServer(settings, gameData, db);
  await setupSocketServer('world', WORLD_PORT, world.handler);
  return world;
}