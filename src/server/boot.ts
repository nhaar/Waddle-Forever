import { DataFolder, PenguinRepository } from './database/database';
import { VERSION } from '@common/constants';
import { USER_DATA_FOLDER } from '@common/paths';
import settingsManager from './settings';
import { GameData } from './timelines/game-data';

import { HttpServer } from './http';
import { setupWorldServer } from './socket-server/world-server';
import { setupLoginServer } from './socket-server/login-server';
import { setupSnowServer } from './socket-server/snow-server';

/** Initialize the db, game data, and the 3 services (http, login, world). Returns the world server and list of failed mods. */
export async function startServices() {
  const data = new DataFolder(USER_DATA_FOLDER);
  data.init(VERSION);

  const gameData = new GameData(settingsManager.settings.version);

  settingsManager.addListener(() => {
    gameData.update(settingsManager.settings.version);
  })

  const db = new PenguinRepository(data.getPath());

  await setupLoginServer(settingsManager, db, gameData);

  const world = await setupWorldServer(settingsManager, db, gameData);

  await (new HttpServer(gameData, settingsManager, db, world.mods)).setupServer();

  // TODO: would be nice if we could only have this available
  // when cj snow is available on the timeline (can dynamically start or stop)
  await setupSnowServer(settingsManager, db, gameData,);

  const failedMods = world.mods.initializeMods();

  return {
    world,
    failedMods
  };
}
