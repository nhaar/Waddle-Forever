import { SettingsManager } from '../src/server/settings';
import { World } from '../src/server/socket-server/world/world';
import { PenguinMessenger } from '../src/server/socket-server/messenger';
import { BotManager, isBot } from '../src/server/socket-server/world/bots';
import { getFurnitureString, getIglooFromId } from '../src/server/socket-server/handlers/igloo';

const settings = new SettingsManager();
const stubData = {
  getExtraWaddleRooms: () => [],
  isNewShell2009: () => false,
  isPreCpip: () => false,
  puffleHandItems: () => true,
  isSpOnJr: () => false
} as never;
const db = { get: async () => null } as never;

const world = new World(stubData);
const msg = new PenguinMessenger();
const bots = new BotManager(world, msg, stubData, settings);

let bad = 0;
const check = (n: string, ok: boolean, x = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${n} ${x}`); if (!ok) bad++;
};

bots.setPopulation(2);
const bot = world.players.filter(isBot)[0];
check('a bot spawned', bot !== undefined);

// the igloo is furnished at spawn
const igloo = bot.igloo.activeIgloo;
check('igloo has furniture', igloo.furniture.length >= 3, `${igloo.furniture.length} pieces`);
check('igloo is unlocked for visitors', igloo.locked === false);
check('igloo has a real type', igloo.type >= 1);
check('furniture pieces are well formed',
  igloo.furniture.every(f => f.id > 0 && f.x > 0 && f.y > 0 && f.rotation >= 1 && f.frame >= 1));

// opening it
bots.openIglooFor(bot);
check('bot is listed as having an open igloo',
  world.getOpenIglooPlayers().some(p => p.id === bot.id));
const home = world.getPenguinRoom(bot);
check('bot is standing in its own igloo room',
  home !== undefined && home.id === 2000 + bot.id, `room ${home?.id}`);
check('the bot is visible to anyone who visits', (home?.players ?? []).includes(bot));

// what a visiting player's client would be served
(async () => {
  const served = await getIglooFromId(world, db, bot.id);
  check('the igloo resolves for a visitor', served !== undefined);
  check('the visitor gets the decorated igloo',
    served?.furniture.length === igloo.furniture.length);

  const str = getFurnitureString(served!.furniture);
  const pieces = str.split(',');
  check('furniture string is the right shape',
    pieces.length === igloo.furniture.length && pieces.every(p => p.split('|').length === 5),
    pieces[0]);

  // and closing up again
  bots.closeIglooFor(bot);
  check('igloo no longer listed', !world.getOpenIglooPlayers().some(p => p.id === bot.id));
  const after = world.getPenguinRoom(bot);
  check('bot went back out to the island', after !== undefined && after.id < 2000, `room ${after?.id}`);

  bots.shutdown();
  console.log(bad === 0 ? '\nALL IGLOO CHECKS PASSED' : `\n${bad} FAILED`);
  process.exit(bad === 0 ? 0 : 1);
})();
