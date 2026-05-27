import { DataFolder, PenguinRepository } from './database/database';
import { VERSION } from '@common/version';
import { USER_DATA_FOLDER } from '@common/paths';
import settingsManager from './settings';
import { GameData } from './timelines/game-data';

import { HttpServer } from './http';
import { setupWorldServer } from './socket-server/world-server';
import { setupLoginServer } from './socket-server/login-server';

// load user data
const failedMods = settingsManager.mods.initializeMods();
if (failedMods.length > 0) {
  console.log('Error turning on the following mods:');
  failedMods.forEach(mod => console.log(`- ${mod}`));
}

const data = new DataFolder(USER_DATA_FOLDER);
data.init(VERSION);

const gameData = new GameData(settingsManager);

const db = new PenguinRepository(data.getPath());

// initialize the three services
setupLoginServer(settingsManager, db, gameData);

setupWorldServer(settingsManager, db, gameData);

const httpServer = new HttpServer(gameData, settingsManager, db);

httpServer.setupServer();