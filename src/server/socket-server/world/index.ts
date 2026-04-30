// ZA WAAAARUDO!

import { Client, Server } from "@server/client";
import { JsonDatabase } from "@server/database";
import { Handler } from "@server/handlers";
import { startMatchmakers } from "@server/handlers/games/matchmaking";
import { initWaddleConstructors } from "@server/handlers/play/navigation";
import { WORLD_PORT } from "@server/servers";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { ClientSocket, SocketServer } from "..";
import worldHandler from '../../handlers/world'

export class World extends SocketServer<Client> {
  private worldServer: Server;
  private worldHandler: Handler<Client>;
  
  constructor(settings: SettingsManager, gameData: GameData, private db: JsonDatabase) {
    super('world', WORLD_PORT);
    this.worldHandler = worldHandler;

    this.worldServer = new Server(settings, gameData);

    // todo refactor these things here somehow...
    startMatchmakers(this.worldServer);
    initWaddleConstructors(this.worldServer);
  }

  override createHandler() {
    return worldHandler;
  }

  override makeClient(socket: ClientSocket): Client {
    return new Client(
      this.worldServer,
      socket,
      'World',
      this.db
    );
  }

  public get server() {
    return this.worldServer;
  }

  public getHandler() {
    return this.worldHandler;
  }
}