import { logdebugerr } from "@server/logger";
import { BattleType, BOARD, getAllPlayers } from "../world/fire";
import { FireGuard, FireHandler } from "./handlers";
import { getWinner } from "../world/card";
import { CardElement, CARDS } from "@server/game-logic/cards";

export const isFireGuard: FireGuard = () => true;

export const handleEnterFireGame: FireHandler<[]> = async ({ fire, penguin, msg }) => {
  const seatId = fire.getSeatId(penguin);
  
  await msg.send(penguin, 'jz', seatId);
  
  const players = fire.getPlayers();

  await msg.send(
    penguin, 'sz',
    0, // id of player that is playing, which is always 0?
    players.map(p => p.name).join(','),
    players.map(p => p.inventory.color).join(','),
    fire.energies.join(','),
    fire.positions.join(','),
    fire.getHand(seatId).join(','),
    fire.spin.join(','),
    players.map(p => p.ninja.cardRank).join(','),
    '' // unused
  );
}

const handleClickSpinner: FireHandler<[number]> = ({ msg, fire }, tablet) => {
  msg.send(fire.getPlayers(), 'zm', 'is', '' /* unused */, tablet);
}

const getBattleInfo = (battleType: BattleType): [string, string] => battleType === 'b' ? ['be', ''] : ['bt', battleType];

const handleStartBattle: FireHandler<[BattleType, number[]]> = async ({ fire, msg }, type, players) => {
  const [battle, trump] = getBattleInfo(type);
  fire.createRound(players, type);
  await msg.send(fire.getPlayers(), 'zm', 'sb', battle, players.join(','), trump);
}

const handleChooseOpponent: FireHandler<[number[]]> = async ({ msg, fire }, pool) => {
  msg.send(fire.getPlayers(), 'zm', 'co', '' /* unused */, pool.join(','));
}

const handleClickBoard: FireHandler<[number]> = async (ctx, tile) => {
  const { msg, fire, penguin } = ctx;
  const playersInTile = fire.positions
    .map((t, i) => t === tile ? i : null)
    .filter((i): i is number => i !== null);
  
  fire.updatePosition(fire.getSeatId(penguin), tile);
  
  await msg.send(
    fire.getPlayers(), 'zm', 'ub',
    fire.getSeatId(penguin),
    fire.positions.join(','),
    0 // unknown, more testing needed
  );

  if (playersInTile.length > 0) {
    if (playersInTile.length === 1) {
      await handleStartBattle(ctx, 'b', playersInTile);
    } else {
      await handleChooseOpponent(ctx, playersInTile);
    }
  } else {
    const type = BOARD[tile];

    if (type === 'b') {
      if (fire.getPlayers().length > 2) {
        await handleChooseOpponent(ctx, getAllPlayers(fire.getPlayers()));
      } else {
        await handleStartBattle(ctx, type, getAllPlayers(fire.getPlayers()));
      }
    } else if (type === 'c') {
      await msg.send(fire.getPlayers(), 'zm', 'ct');
    } else {
      await handleStartBattle(ctx, type, getAllPlayers(fire.getPlayers()));
    }
  }
}

const getCardJitsuResults = (cardId1: number, cardId2: number): [number[], CardElement] => {
  const card1 = CARDS.getStrict(cardId1);
  const card2 = CARDS.getStrict(cardId2);
  const winner = getWinner(card1.element, card2.element, card1.value, card2.value);
  const element = winner === 0 ? card1.element : card2.element;
  const results = winner === -1 ? [2, 2] :
    winner === 0 ? [4, 1] : [1, 4];
  return [results, element];
}

const getTrumpResults = (ids: number[], cardIds: number[], element: CardElement): [number[], CardElement] => {
  const cardValues = cardIds.map(id => {
    const card = CARDS.getStrict(id);
    return card.element === element ? card.value : null;
  });

  const validValues = cardValues.filter((value): value is number => value !== null);
  const highest = validValues.length === 0 ? null : Math.max(...validValues);
  const isTie = validValues.filter(v => v === highest).length > 1;
  
  return [ids.map((_, i) => {
    const winner = cardValues[i] !== null && cardValues[i] === highest;
    return winner ? (isTie ? 2 : 3) : 1;
  }), element];
}

const handleResolveBattle: FireHandler<[number[]]> = async ({ msg, fire }, cards) => {
  const battleIds = fire.round.players;
  const cardIds = battleIds.map((id, i) => fire.getHand(id)[cards[i]]);
  
  // results: 1 = losing, 2 = in a tie, 3 = winning, 4 = winning in card jitsu
  const [results, element] = fire.round.type === 'b'
    ? getCardJitsuResults(cardIds[0], cardIds[1])
    : getTrumpResults(battleIds, cardIds, fire.round.type);
  
  results.forEach((result, i) => {
    if (result === 4) {
      fire.addEnergy(battleIds[i]);
    } else if (result === 1) {
      fire.removeEnergy(battleIds[i]);
    }
  });
  cards.forEach((cardIndex, i) => {
    fire.updateHand(battleIds[i], cardIndex);
  });
  
  const energies = battleIds.map(id => fire.energies[id]);

  const [battleType] = getBattleInfo(fire.round.type);

  await Promise.all(fire.getPlayers().map(p => msg.send(
    p, 'zm', 'rb',
    battleIds.join(','),
    cardIds.join(','),
    energies.join(','),
    results.join(','),
    [battleType, element].join(','),
    fire.getHand(fire.getSeatId(p)).join(','),
    [0,0,0,0].join(',') // TODO -> podium
  )));
}

const handleClickCard: FireHandler<[number]> = async (ctx, cardIndex) => {
  const { msg, fire, penguin } = ctx;
  const seatId = fire.getSeatId(penguin);

  fire.round.setCard(seatId, cardIndex);

  await msg.send(fire.getPlayers().filter(p => p !== penguin), 'zm', 'ic', seatId);

  const cards = fire.round.cards;
  if (cards.every((card): card is number => card !== null)) {
    await handleResolveBattle(ctx, cards);
  }
}

export const handleFireMove: FireHandler<string[]> = (ctx, action, ...rest) => {
  switch (action) {
    case 'is':
      handleClickSpinner(ctx, Number(rest[1]));
      break;
    case 'cb':
      handleClickBoard(ctx, Number(rest[0]));
      break;
    case 'cc':
      handleClickCard(ctx, Number(rest[0]));
      break;
    default:
      logdebugerr('unknown cjfire action: ' + action);
  }
}
