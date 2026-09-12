import { getDefaultPenguin } from '../src/server/database/database';
import { SettingsManager } from '../src/server/settings';
import { WorldPenguin } from '../src/server/socket-server/world/world-penguin';
import { SledRace } from '../src/server/socket-server/world/sled';
import { BotGames } from '../src/server/socket-server/world/bot-games';
import { BOT_ID_BASE } from '../src/server/socket-server/world/bot-id';

const settings = new SettingsManager();
const mk = (id: number, name: string) =>
  new WorldPenguin(id, getDefaultPenguin(name, 1, true, Date.now()), settings);

type Sent = { seat: number; x: number; y: number; humanX: number; humanY: number };

const newGames = () => new BotGames({ msg: { send: () => undefined } } as never);

/**
 * Runs one race.
 * `crashAt` makes the player hit something at that step, losing most of their
 * speed for a moment, the way an obstacle would.
 */
function race(opts: {
  games?: BotGames;
  stallAt?: number;
  crashAt?: number;
  steps?: number;
} = {}) {
  const sent: Sent[] = [];
  let hx = 380;
  let hy = 0;

  const games = opts.games ?? newGames();

  // capture whatever this instance sends, including a shared one
  (games as never as { _manager: { msg: { send: unknown } } })._manager.msg.send =
    (_to: unknown, _cmd: string, seat: number, x: number, y: number) => {
      sent.push({ seat, x, y, humanX: Math.round(hx), humanY: hy });
    };

  const human = mk(101, 'Player');
  const bots = [mk(BOT_ID_BASE + 1, 'B1'), mk(BOT_ID_BASE + 2, 'B2'), mk(BOT_ID_BASE + 3, 'B3')];
  const sled = new SledRace([human, ...bots]);

  const steps = opts.steps ?? 300;
  let clock = Date.now();
  const realNow = Date.now;
  (Date as unknown as { now: () => number }).now = () => clock;

  for (let i = 0; i < steps; i++) {
    clock += 33;
    const stalled = opts.stallAt !== undefined && i > opts.stallAt && i < opts.stallAt + 45;
    const crashing = opts.crashAt !== undefined && i > opts.crashAt && i < opts.crashAt + 20;
    if (stalled) {
      // dead stop
    } else if (crashing) {
      hy += 0.4;                                // most of the speed gone
    } else {
      hy += 4;
      hx += Math.sin(i / 18) * 6;
    }
    games.onSledMove(sled, Math.round(hx), hy, i * 33);
  }

  (Date as unknown as { now: () => number }).now = realNow;

  const finals = new Map<number, number>();
  sent.forEach(p => finals.set(p.seat, p.y));
  return { humanY: hy, humanX: hx, bots: [...finals.values()], sent, games };
}

/** Counts moments where a bot suddenly slowed, within a stretch of the course */
function slowEventsInBand(sent: Sent[], from: number, to: number): number {
  const last = new Map<number, number>();
  const steps: Array<{ y: number; dy: number }> = [];
  for (const p of sent) {
    const prev = last.get(p.seat);
    if (prev !== undefined) {
      steps.push({ y: p.y, dy: Math.abs(p.y - prev) });
    }
    last.set(p.seat, p.y);
  }
  if (steps.length === 0) {
    return 0;
  }
  const sorted = steps.map(s => s.dy).sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  return steps.filter(s => s.dy < median * 0.5 && s.y >= from && s.y <= to).length;
}

let bad = 0;
const check = (n: string, ok: boolean, x = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${n} ${x}`); if (!ok) bad++;
};

// --- racing basics -------------------------------------------------------
const one = race();
// averaged, because with obstacles in play three bots occasionally do finish
// close together, and that is the system working rather than a defect
let spreadTotal = 0;
for (let i = 0; i < 20; i++) {
  const r = race();
  spreadTotal += Math.max(...r.bots) - Math.min(...r.bots);
}
const spread = spreadTotal / 20;
check('bots finish spread out, on average', spread > 60, `mean spread ${Math.round(spread)}`);
check('bots travel a comparable distance to the player',
  Math.min(...one.bots) > one.humanY * 0.5 && Math.max(...one.bots) < one.humanY * 1.5,
  `player ${one.humanY}, bots ${one.bots.map(Math.round).join(', ')}`);

let playerWins = 0;
for (let i = 0; i < 200; i++) {
  const r = race();
  if (Math.max(...r.bots) <= r.humanY) playerWins++;
}
// observed mean is around 105/200; the band is wide enough that ordinary
// sampling noise on 200 races cannot trip it, but a real balance regression can
check('a flawless run wins about half the time',
  playerWins > 70 && playerWins < 150, `${playerWins}/200`);

const collisions = one.sent.filter(p =>
  Math.abs(p.y - p.humanY) < 70 && Math.abs(p.x - p.humanX) < 52);
check('no bot overlaps the player', collisions.length === 0,
  `${collisions.length} overlaps in ${one.sent.length} packets`);

// --- obstacles the player teaches it -------------------------------------
const taught = newGames();
for (let i = 0; i < 5; i++) {
  race({ games: taught, crashAt: 120 });        // player crashes around y = 480
}
const learned = (taught as never as { knownHazards: number }).knownHazards;
check('a repeated crash spot is learned once, not five times',
  learned >= 1 && learned <= 2, `${learned} hazard(s) mapped`);

const hazards = (taught as never as { _hazards: Array<{ x: number; y: number; seen: number }> })._hazards;
const main = hazards.reduce((a, b) => (a.seen >= b.seen ? a : b));
check('the hazard is where the player actually crashed',
  main.y > 400 && main.y < 600, `at y ${Math.round(main.y)}, seen ${main.seen} times`);
check('repeated crashes build confidence', main.seen >= 4, `seen ${main.seen}`);

// --- do bots actually hit it? --------------------------------------------
const band: [number, number] = [420, 580];
let blindSlow = 0;
let taughtSlow = 0;
for (let i = 0; i < 60; i++) {
  blindSlow += slowEventsInBand(race({ games: newGames() }).sent, band[0], band[1]);
  taughtSlow += slowEventsInBand(race({ games: taught }).sent, band[0], band[1]);
}
check('bots hit the obstacle the player showed them',
  taughtSlow > blindSlow * 1.4,
  `${taughtSlow} slowdowns there once learned vs ${blindSlow} before`);

// --- unmapped obstacles still exist --------------------------------------
let anySlow = 0;
for (let i = 0; i < 20; i++) {
  anySlow += slowEventsInBand(race({ games: newGames() }).sent, 0, 2000);
}
check('bots hit unmapped obstacles too', anySlow > 10, `${anySlow} slowdowns across 20 races`);

// --- crashing still costs the player -------------------------------------
const rate = (opts: { stallAt?: number }) => {
  let lost = 0;
  for (let i = 0; i < 120; i++) {
    const r = race(opts);
    if (Math.max(...r.bots) > r.humanY) lost++;
  }
  return lost / 120;
};
const clean = rate({});
const crashed = rate({ stallAt: 120 });
check('a crash makes the player much likelier to lose',
  crashed > clean + 0.15,
  `lose ${Math.round(clean * 100)}% clean vs ${Math.round(crashed * 100)}% after a crash`);

console.log(bad === 0 ? '\nALL SLED CHECKS PASSED' : `\n${bad} FAILED`);
process.exit(bad === 0 ? 0 : 1);
