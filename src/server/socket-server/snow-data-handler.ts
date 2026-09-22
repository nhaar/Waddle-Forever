import { PenguinMessenger } from "@server/socket-server/messenger"
import { World } from "./world/world"
import { GameData } from "@server/timelines/game-data"
import { SettingsManager } from "@server/settings"
import { PenguinRepository } from "@server/database/database"
import { ClientSocket } from "./socket-server"
import { getRedString, getBlueString, getYellowString, logverbose } from "@server/logger"
import { OfflineWorld } from "./offline-world"
import { SnowFrameworkHandler, SnowHandler } from "./handlers/snow"
import { SnowGame, SnowWorld } from "./world/snow/snow"
import { SnowPlayer } from "./world/snow/snow"
import { PenguinPersister } from "./handlers/handlers"

export type SnowContext = {
  msg: PenguinMessenger<SnowPlayer>,
  data: GameData,
  settings: SettingsManager,
  db: PenguinRepository,
  client: ClientSocket,
  world: SnowWorld,
  off: OfflineWorld
  prst: PenguinPersister
  penguin: SnowPlayer,
  game: SnowGame | null
};

export class SnowDataHandler {
  constructor(
    private _callbacks: Map<string, SnowHandler>,
    private _frameworkCallbacks: Map<string, SnowFrameworkHandler>
  ) {}

  public async handle(ctx: SnowContext, message: string) {
    if (ctx.penguin === undefined) {
      // a SnowPlayer object should get created and linked on connection (see snow-server.ts)
      throw new Error('Snow player should exist!');
    }

    const messages = message.trim().split('\n');
    for (const command of messages) {
      if (ctx.client.closed) {
        return;
      }

      logverbose(getBlueString('Incoming snow data:'), command);

      const data = command.trim().split(' ');
      const action = data.shift(); 

      if (action === '/framework') {
        let json: Record<string, any>;

        try {
          json = JSON.parse(command.trim().slice(action.length).trim());
        } catch(e) {
          logverbose(getRedString('Could not parse /framework JSON: ' + e));
          continue;
        }

        const callback = this._frameworkCallbacks.get(json.triggerName);

        if (callback !== undefined) {
          logverbose(getBlueString('Processing snow /framework command:'), json.triggerName);
          await callback(ctx, json);
        } else {
          logverbose(getRedString('unhandled snow /framework command: ' + json.triggerName));
        }
      } else {
        const callback = this._callbacks.get(action);
        if (callback !== undefined) {
          await callback(ctx, ...data);
        } else {
          logverbose(getRedString('unhandled snow command: ' + action));
        }
      }
    }
  }
}
