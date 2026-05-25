// ZAAAA WAAAARUDO!

import { EffectService } from "@common/utils";
import { WORLD_PORT } from "@server/servers";

import { SettingsManager } from "@server/settings";
import { PenguinRepository } from "@server/database/database";
import { GameData } from "@server/timelines/game-data";

import { ClientSocket, MessageHandler, setupSocketServer } from "..";

import { PenguinMessenger } from "@server/handlers/messenger";

import { PenguinPersister, World, WorldContext } from "./world";


import { addBakeryListener } from "@server/handlers/play/party";
import { addMatchmakerListeners } from "@server/handlers/play/ninja";

import { CommandsHandler } from "./commands";
import { CommandContext, commands } from "./command-handlers";
import { XtHandler } from "./xt-handler";
import { XmlHandler } from "./xml-handler";
import { createWorldXtHandler } from "./world-handlers";
import { createLoginXmlHandler } from "./login-handlers";


export class WorldServer implements MessageHandler {
  private _world: World;
  private _msg = new PenguinMessenger();
  private _commandsHandler: CommandsHandler<CommandContext>;
  private _xtHandler: XtHandler;
  private _xmlHandler: XmlHandler;
  private _persister: PenguinPersister;
  
  constructor(private _settings: SettingsManager, private _gameData: GameData, private _db: PenguinRepository) {
    this._world = new World(_gameData);

    this._commandsHandler = new CommandsHandler(commands.get());

    this._persister = (p, force = false) => { 
      if (p.preference.canSave || force) {
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
    await Promise.all(this._msg.getClients().map(client => this.disconnect(client)));
    this._msg.close();
    this._msg = new PenguinMessenger();
    this._world = new World(this._gameData);
    this.init();
  }

  private getContext(client: ClientSocket): Partial<WorldContext> {
    const penguin = this._msg.getPenguin(client);
    const state = penguin === undefined ? {} : (this._world.getContext(penguin) ?? {});
    return {
      ...state,
      penguin,
      world: this._world,
      data: this._gameData,
      db: this._db,
      settings: this._settings,
      msg: this._msg,
      prst: this._persister,
      client
    };
  }

  public handle(client: ClientSocket, message: string): void {
    if (message.startsWith('<')) {
      this._xmlHandler.handle({ 
        msg: this._msg,
        data: this._gameData,
        settings: this._settings,
        db: this._db,
        client,
        world: this._world
      }, message);
    } else {
      this._xtHandler.handle(this.getContext(client), message);
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