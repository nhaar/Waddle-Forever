import { Handler } from './handlers';
import { Client, Server, } from './client';
import { SettingsManager } from './settings';
import db from './database';
import { GameData } from './timelines/game-data';
import { HttpServer } from './http';
import { World } from './socket-server/world';
import { LoginServer } from './socket-server/login';

type StartServerError = {
  type: 'mods';
  message: string;
};


/** Returns a list of relevant errors with the startup */
const startServer = async (settingsManager: SettingsManager): Promise<{
  errors: StartServerError[];
  server: Server;
  handler: Handler<Client>
}> => {
  const errors: StartServerError[] = [];

  db.loadDatabase();

  const gameData = new GameData(settingsManager);
  
  const login = new LoginServer(gameData, settingsManager, db);
  await login.setupServer();
  const world = new World(settingsManager, gameData, db);
  await world.setupServer();

  const httpServer = new HttpServer(gameData, settingsManager, db, world.server);
  await httpServer.setupServer();

  // mods that fail to initialize are turned off and the user must be warned about
  const failedMods = settingsManager.mods.initializeMods();
  if (failedMods.length > 0) {
    errors.push({
      type: 'mods',
      message: `The following mods had an issue during startup: ${failedMods.join(', ')}. They have been turned off.`
    });
  }
  
  return { errors, server: world.server, handler: world.getHandler() };
};

export default startServer;