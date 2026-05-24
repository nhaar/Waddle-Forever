// ZA WAAAARUDO!

import { PenguinRepository } from "@server/database/database";
import { Handler } from "@server/handlers";
import { PenguinMessenger } from "@server/handlers/messenger";
import { joinHandler } from "@server/handlers/play/join";
import { iglooHandler } from "@server/handlers/play/igloo";
import { worldLoginHandler } from "@server/handlers/play/login";
import { roomHandler } from "@server/handlers/play/room";
import { WORLD_PORT } from "@server/servers";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { SocketServer } from "..";
import { PenguinPersister, World, WorldContext } from "./world";
import { puffleHandler } from "@server/handlers/play/puffle";
import { CommandsHandler } from "./commands";
import { CommandContext, commands } from "./command-handlers";
import { createHandler } from "@server/handlers/play/create";
import { gameHandler } from "@server/handlers/play/game";
import { sledHandler } from "@server/handlers/games/sled";
import { mailHandler } from "@server/handlers/play/mail";
import { rainbowHandler } from "@server/handlers/play/rainbow";
import { cardHandler } from "@server/handlers/play/card";
import { ninjaHandler } from "@server/handlers/play/ninja";
import { addBakeryListener, partyHandler } from "@server/handlers/play/party";

export class WorldServer extends SocketServer {
  private worldServer: World;
  private worldHandler: Handler<WorldContext>;
  private messenger = new PenguinMessenger();
  private _commandsHandler: CommandsHandler<CommandContext>;
  private _persister: PenguinPersister;
  
  constructor(private settings: SettingsManager, private gameData: GameData, private db: PenguinRepository) {
    super('world', WORLD_PORT);

    this.worldServer = new World(gameData);

    // TODO: remove scuff
    this.worldHandler = this.createHandler();

    this._commandsHandler = new CommandsHandler(commands.get());

    this._persister = (p, force = false) => { 
      if (p.preference.canSave || force) {
        this.db.write(p.id, p.getJSON());
      }
    };

    addBakeryListener(this.worldServer, this.messenger);

    // this.disconnect = (client) => {
    //   this.worldServer.disconnect(client);
    // }

    // this.worldHandler = worldHandler;

    
    // new Server(settings, gameData);

    // todo refactor these things here somehow...
    // startMatchmakers(this.worldServer);
    // initWaddleConstructors(this.worldServer);
  }

  override createHandler() {
    const handler = new Handler<WorldContext>((client) => {
      const penguin = this.messenger.getPenguin(client);
      const state = penguin === undefined ? {} : (this.worldServer.getContext(penguin) ?? {});
      return {
        ...state,
        penguin,
        world: this.worldServer,
        data: this.gameData,
        db: this.db,
        settings: this.settings,
        msg: this.messenger,
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
    return handler;
  }

  public get server() {
    return this.worldServer;
  }

  public getHandler() {
    return this.worldHandler;
  }

  public runCommand(penguinId: number, name: string, args: string[]) {
    const penguin = this.worldServer.getById(penguinId);
    if (penguin !== undefined) {
      const ctx: CommandContext = {
        world: this.worldServer,
        penguin,
        prst: this._persister,
        msg: this.messenger,
        data: this.gameData,
        db: this.db,  
        room: this.worldServer.getContext(penguin)?.room
      }
      this._commandsHandler.run(ctx, name, args);
    }
  }

  public getAllPlayersInfo() {
    return this.worldServer.players.map(p => ({
      name: p.name,
      id: p.id
    }));
  }

  public async reset() {
    await Promise.all(this.messenger.getClients().map(client => this.handler.disconnect(client)));
    this.messenger.close();
    this.messenger = new PenguinMessenger();
    this.worldServer = new World(this.gameData);
  }
}