import { getDefaultPenguin } from '../src/server/database/database';
import { SettingsManager } from '../src/server/settings';
import { CardJitsu, NinjaBot, NinjaPlayer, Sensei } from '../src/server/socket-server/world/card';
import { WorldPenguin } from '../src/server/socket-server/world/world-penguin';
import { BOT_ID_BASE } from '../src/server/socket-server/world/bot-id';
import { CARDS } from '../src/server/game-logic/cards';

const settings = new SettingsManager();
const make = (id: number, name: string) =>
  new WorldPenguin(id, { ...getDefaultPenguin(name, 1, true, Date.now()), noSave: id >= BOT_ID_BASE }, settings);

const human = make(101, 'RealPlayer');
// give the human a normal deck, like a real account would have
CARDS.rows.slice(0, 24).forEach(c => human.ninja.addCard(c.id, 1));

const bot = make(BOT_ID_BASE + 1, 'SnowFlipper42');

const game = new CardJitsu([human, bot]);

let failures = 0;
const check = (name: string, ok: boolean, extra = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name} ${extra}`);
  if (!ok) failures++;
};

check('not treated as a Sensei match', game.sensei === false);

const ninja = game.getNinja(human);
const opponent = game.getOpponent(ninja);
check('human keeps a NinjaPlayer', ninja instanceof NinjaPlayer);
check('bot gets a NinjaBot', opponent instanceof NinjaBot);
check('NinjaBot is picked up by the Sensei branch', opponent instanceof Sensei);
check('seats are distinct', ninja.seat !== opponent.seat, `${opponent.seat} vs ${ninja.seat}`);

// play a whole match the way handlers/card.ts drives it
let rounds = 0;
let winner: number | undefined;

for (let i = 0; i < 200; i++) {
  // deal both sides up to five cards
  const needed = 5 - ninja.cards.length;
  if (needed > 0) {
    game.deal(ninja, needed);
    game.deal(opponent, needed);
  }

  const humanCard = ninja.cards[Math.floor(Math.random() * ninja.cards.length)];
  ninja.choose(humanCard);
  (opponent as NinjaBot).pickCard();

  if (!opponent.hasChosen()) {
    check('bot chose a card', false);
    break;
  }

  game.judgeWinner();
  const hand = game.getWinningHand();
  ninja.unchoose();
  opponent.unchoose();
  rounds++;

  if (hand !== undefined) {
    winner = hand.seat;
    break;
  }
}

check('match reached a winner', winner !== undefined, `after ${rounds} rounds, seat ${winner}`);
// three is the fastest legal win: three cards of one element
check('rounds look sane', rounds >= 3 && rounds < 60, `${rounds}`);

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
