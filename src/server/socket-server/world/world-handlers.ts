import { SettingsManager } from "@server/settings";
import { PenguinRepository } from "@server/database/database";
import { GameData } from "@server/timelines/game-data";

import { PenguinPersister, World, WorldContext } from "./world";

import { PenguinMessenger } from "@server/handlers/messenger";

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
import { ninjaHandler } from "@server/handlers/play/ninja";
import { partyHandler } from "@server/handlers/play/party";
import { puffleHandler } from "@server/handlers/play/puffle";

export const createWorldHandler = (settings: SettingsManager, db: PenguinRepository, gameData: GameData, world: World, msg: PenguinMessenger, prst: PenguinPersister): Handler<WorldContext> => {
  const handler = new Handler<WorldContext>((client) => {
    const penguin = msg.getPenguin(client);
    const state = penguin === undefined ? {} : (world.getContext(penguin) ?? {});
    return {
      ...state,
      penguin,
      world,
      data: gameData,
      db,
      settings,
      msg,
      prst,
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