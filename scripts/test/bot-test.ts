import { FindFourTable } from '../src/server/socket-server/world/find-four';
import { MancalaTable } from '../src/server/socket-server/world/mancala';
import { BotGames } from '../src/server/socket-server/world/bot-games';

const games = new BotGames({} as never) as never as {
  chooseTableMove(table: unknown, seat: number): number[] | null;
  onTableMove(table: unknown, moves: number[]): void;
  parseFindFour(table: unknown): number[][];
};

let failures = 0;
const check = (name: string, ok: boolean, extra = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name} ${extra}`);
  if (!ok) failures++;
};

// --- Find Four -------------------------------------------------------------
const ff = new FindFourTable(200);
ff.reset();

// bot is seat 1 (value 2). Give seat 1 three in a row on the bottom row.
// board fills from y=5 downward by default
ff.setStarted();
// simulate: player 1 pieces in columns 0,1,2 at row 5
(ff as never as { _board: number[][] })._board[0][5] = 2;
(ff as never as { _board: number[][] })._board[1][5] = 2;
(ff as never as { _board: number[][] })._board[2][5] = 2;

const winMove = games.chooseTableMove(ff, 1);
check('find four takes the win', JSON.stringify(winMove) === JSON.stringify([3, 5]), JSON.stringify(winMove));

// now the same shape for the opponent (value 1), bot is seat 1 and must block
const ff2 = new FindFourTable(201);
ff2.reset();
const b2 = (ff2 as never as { _board: number[][] })._board;
b2[2][5] = 1; b2[3][5] = 1; b2[4][5] = 1;
const blockMove = games.chooseTableMove(ff2, 1);
check('find four blocks', JSON.stringify(blockMove) === JSON.stringify([1, 5]) || JSON.stringify(blockMove) === JSON.stringify([5, 5]), JSON.stringify(blockMove));

// board parsing round trip
const parsed = games.parseFindFour(ff);
check('board parse matches serialize', parsed[0][5] === 2 && parsed[3][5] === 0);

// orientation learning: a human move that fills from the top instead
const ff3 = new FindFourTable(202);
ff3.reset();
games.onTableMove(ff3, [0, 0]);   // empty column, row 0 -> fills upward
const upMove = games.chooseTableMove(ff3, 0);
check('learns upward fill', upMove !== null && upMove[1] === 0, JSON.stringify(upMove));
games.onTableMove(ff3, [1, 5]);   // empty column, row 5 -> fills downward
const downMove = games.chooseTableMove(ff3, 0);
check('relearns downward fill', downMove !== null && downMove[1] === 5, JSON.stringify(downMove));

// legality: every move the bot picks must be accepted by the table
const ff4 = new FindFourTable(203);
ff4.reset();
ff4.setStarted();
let plies = 0;
for (let i = 0; i < 42; i++) {
  const seat = ff4.getTurn();
  const move = games.chooseTableMove(ff4, seat);
  if (move === null) break;
  const before = ff4.serializeBoard();
  const [end] = ff4.sendMove(move);
  const after = ff4.serializeBoard();
  if (before === after) { check('find four move was legal', false, JSON.stringify(move)); break; }
  ff4.changeTurn();
  plies++;
  if (end !== null) break;
}
check('find four self-play ran', plies > 6, `${plies} plies`);

// --- Mancala ---------------------------------------------------------------
const mc = new MancalaTable(100);
mc.reset();
mc.setStarted();
let mancalaPlies = 0;
for (let i = 0; i < 200; i++) {
  const seat = mc.getTurn();
  const move = games.chooseTableMove(mc, seat);
  if (move === null) break;
  const before = mc.serializeBoard();
  const [end] = mc.sendMove(move);
  if (before === mc.serializeBoard()) { check('mancala move was legal', false, JSON.stringify(move)); break; }
  mancalaPlies++;
  if (end !== null) break;
}
check('mancala self-play reached an end', mancalaPlies > 5, `${mancalaPlies} plies`);

// first move should usually be the free-turn cup (cup 2 from the opening board)
const opens: number[] = [];
for (let i = 0; i < 40; i++) {
  const t = new MancalaTable(101);
  t.reset();
  t.setStarted();
  const m = games.chooseTableMove(t, 0);
  if (m !== null) opens.push(m[0]);
}
const freeTurnRate = opens.filter(c => c === 2).length / opens.length;
check('mancala prefers the free turn opening', freeTurnRate > 0.6, `${Math.round(freeTurnRate * 100)}%`);

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
