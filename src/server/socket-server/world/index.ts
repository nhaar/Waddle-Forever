// ZA WAAAARUDO!
import { EffectService } from "@common/utils";
import { WORLD_PORT } from "@server/servers";

import { SettingsManager } from "@server/settings";
import { PenguinRepository } from "@server/database/database";
import { GameData } from "@server/timelines/game-data";

import { setupSocketServer } from "..";

import { PenguinMessenger } from "@server/handlers/messenger";

import { PenguinPersister, World, WorldContext } from "./world";

import { Handler } from "@server/handlers";
import { joinHandler } from "@server/handlers/play/join";
import { iglooHandler } from "@server/handlers/play/igloo";
import { worldLoginHandler } from "@server/handlers/play/login";
import { roomHandler } from "@server/handlers/play/room";
import { createHandler } from "@server/handlers/play/create";
import { gameHandler } from "@server/handlers/play/game";
import { sledHandler } from "@server/handlers/games/sled";
import { mailHandler } from "@server/handlers/play/mail";
import { rainbowHandler } from "@server/handlers/play/rainbow";
import { cardHandler } from "@server/handlers/play/card";
import { addMatchmakerListeners, ninjaHandler } from "@server/handlers/play/ninja";
import { addBakeryListener, partyHandler } from "@server/handlers/play/party";
import { puffleHandler } from "@server/handlers/play/puffle";

import { CommandsHandler } from "./commands";
import { CommandContext, commands } from "./command-handlers";

export class WorldServer {
  private _world: World;
  private _msg = new PenguinMessenger();
  private _commandsHandler: CommandsHandler<CommandContext>;
  private _handler: Handler<WorldContext>;
  private _persister: PenguinPersister;
  
  constructor(private settings: SettingsManager, private gameData: GameData, private db: PenguinRepository) {
    this._world = new World(gameData);

    this._commandsHandler = new CommandsHandler(commands.get());

    this._persister = (p, force = false) => { 
      if (p.preference.canSave || force) {
        this.db.write(p.id, p.getJSON());
      }
    };

    const handler = new Handler<WorldContext>((client) => {
      const penguin = this._msg.getPenguin(client);
      const state = penguin === undefined ? {} : (this._world.getContext(penguin) ?? {});
      return {
        ...state,
        penguin,
        world: this._world,
        data: this.gameData,
        db: this.db,
        settings: this.settings,
        msg: this._msg,
        prst: this._persister,
        client
      };
    });
    handler.use(worldLoginHandler);
    handler.use(joinHandler);
    handler.use(roomHandler);
    handler.use(iglooHandler);
    handler.use(puffleHandler);
    handler.use(createHandler);
    handler.use(gameHandler);
    handler.use(mailHandler);
    handler.use(sledHandler);
    handler.use(rainbowHandler);
    handler.use(cardHandler);
    handler.use(ninjaHandler);
    handler.use(partyHandler);
    this._handler = handler;

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
        data: this.gameData,
        db: this.db,  
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
    this._world = new World(this.gameData);
    this.init();
  }
}

export const setupWorldServer = async (settings: SettingsManager, db: PenguinRepository, gameData: GameData): Promise<EffectService<WorldServer>> => {
  const world = new WorldServer(settings, gameData, db);
  await setupSocketServer('world', WORLD_PORT, world.handler);
  return world;
}