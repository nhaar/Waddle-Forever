// ZA WAAAARUDO!

// import { Client, Server } from "@server/client";
import { JsonDatabase } from "@server/database";
import { Handler } from "@server/handlers";
import { cardHandler } from "@server/handlers/games/card";
import { sledHandler } from "@server/handlers/games/sled";
import { gameHandler } from "@server/handlers/play/game";
import { joinHandler } from "@server/handlers/play/join";
import { worldLoginHandler } from "@server/handlers/play/login";
import { roomHandler } from "@server/handlers/play/navigation";
// import { startMatchmakers } from "@server/handlers/games/matchmaking";
// import { initWaddleConstructors } from "@server/handlers/play/navigation";
import { WORLD_PORT } from "@server/servers";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { ClientSocket, SocketServer } from "..";
import { World, WorldContext } from "./world";
// import worldHandler from '../../handlers/world'

export class WorldServer extends SocketServer {
  private worldServer: World;
  private worldHandler: Handler<WorldContext>;
  
  constructor(settings: SettingsManager, gameData: GameData, db: JsonDatabase) {
    super('world', WORLD_PORT);

    this.worldServer = new World(gameData, settings, db);

    // TODO: remove scuff
    this.worldHandler = this.createHandler();

    this.disconnect = (client) => {
      this.worldServer.disconnect(client);
    }

    // this.worldHandler = worldHandler;

    
    // new Server(settings, gameData);

    // todo refactor these things here somehow...
    // startMatchmakers(this.worldServer);
    // initWaddleConstructors(this.worldServer);
  }

  override createHandler() {
    const handler = new Handler<WorldContext>((client) => {
      return { ...(this.worldServer.getContext(client)), world: this.worldServer };
    });
    handler.use(worldLoginHandler);
    handler.use(joinHandler);
    handler.use(roomHandler);
    handler.use(gameHandler);
    handler.use(sledHandler);
    handler.use(cardHandler);
    return handler;
  }

  public get server() {
    return this.worldServer;
  }

  public getHandler() {
    return this.worldHandler;
  }
}