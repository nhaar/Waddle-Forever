import settingsManager from './settings';
import { GameData } from './timelines/game-data';
import { HttpServer } from './http';
// import { LoginServer } from './socket-server/login';
import { WorldServer } from './socket-server/world';
import { DataFolder } from './database/database';
import { USER_DATA_FOLDER } from '@common/paths';
import { VERSION } from '@common/version';
import { LoginServer } from './socket-server/login';

// load user data
const failedMods = settingsManager.mods.initializeMods();
if (failedMods.length > 0) {
  console.log('Error turning on the following mods:');
  failedMods.forEach(mod => console.log(`- ${mod}`));
}

const data = new DataFolder(USER_DATA_FOLDER);
data.init(VERSION);

const gameData = new GameData(settingsManager);

// initialize the three services
const login = new LoginServer(gameData, settingsManager, data.db);
login.setupServer();

const world = new WorldServer(settingsManager, gameData, data.db);
world.setupServer();

const httpServer = new HttpServer(gameData, settingsManager, data.db);

httpServer.setupServer();