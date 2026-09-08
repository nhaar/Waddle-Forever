import { getDefaultPenguin } from '../src/server/database/database';
import { SettingsManager } from '../src/server/settings';
import { WorldPenguin } from '../src/server/socket-server/world/world-penguin';
import { WorldRoom } from '../src/server/socket-server/world/world-room';
import { CardJitsu } from '../src/server/socket-server/world/card';

const settings = new SettingsManager();
const mk = (id: number, name: string) =>
  new WorldPenguin(id, getDefaultPenguin(name, 1, true, Date.now()), settings);

let bad = 0;
const check = (n: string, ok: boolean, x = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${n} ${x}`); if (!ok) bad++;
};

// --- table lookup ---
const room = new WorldRoom(111);
const t100 = room.getTable(100);   // mancala, created first
const t102 = room.getTable(102);
const alice = mk(101, 'Alice');
t102.assignSeatIndex(alice);

check('getPenguinTable finds the table actually sat at',
  room.getPenguinTable(alice) === t102,
  room.getPenguinTable(alice) === t100 ? '(got the first table)' : '');

const bob = mk(102, 'Bob');
check('a penguin at no table resolves to null', room.getPenguinTable(bob) === null);

// --- puffle item stacking ---
const carol = mk(103, 'Carol');
carol.puffle.addItem(1, 5);
const after = carol.puffle.addItem(1, 5);
check('puffle items stack', after === 10, `got ${after}`);

// --- deckless penguin can play card jitsu ---
const dave = mk(104, 'Dave');
check('fresh penguin owns no cards', dave.ninja.getDeck().length === 0);
let crashed = false;
try {
  const game = new CardJitsu([dave]);      // solo -> sensei match
  const ninja = game.getNinja(dave);
  game.deal(ninja, 5);
  game.deal(game.getOpponent(ninja), 5);
} catch (e) {
  crashed = true;
  console.log('   threw:', (e as Error).message);
}
check('deckless penguin no longer crashes the deal', !crashed);

console.log(bad === 0 ? '\nALL BUGFIX CHECKS PASSED' : `\n${bad} FAILED`);
process.exit(bad === 0 ? 0 : 1);
