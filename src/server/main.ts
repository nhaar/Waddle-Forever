import db from './database';
import settingsManager from './settings';
import { GameData } from './timelines/game-data';
import { HttpServer } from './http';
import { LoginServer } from './socket-server/login';
import { WorldServer } from './socket-server/world';

// load user data
const failedMods = settingsManager.mods.initializeMods();
if (failedMods.length > 0) {
  console.log('Error turning on the following mods:');
  failedMods.forEach(mod => console.log(`- ${mod}`));
}
db.loadDatabase();
const gameData = new GameData(settingsManager);

// initialize the three services
const login = new LoginServer(gameData, settingsManager, db);
login.setupServer();

const world = new WorldServer(settingsManager, gameData, db);
world.setupServer();

const httpServer = new HttpServer(gameData, settingsManager, db, world.server);

httpServer.setupServer();