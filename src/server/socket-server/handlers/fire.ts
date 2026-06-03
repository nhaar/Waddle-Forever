import { logdebugerr } from "@server/logger";
import { BattleType, BOARD, FireNinja } from "../world/fire";
import { FireGuard, FireHandler } from "./handlers";
import { getWinner } from "../world/card";
import { CardElement, CARDS } from "@server/game-logic/cards";
import { handleSendCardJitsuStampInfo } from "./card";
import { choose, doubleFilter, randomInt } from "@common/utils";

export const isFireGuard: FireGuard = () => true;

export const handleEnterFireGame: FireHandler<[]> = async (ctx) => {
  const { fire, penguin, msg } = ctx;
  const ninja = fire.fromPenguin(penguin);
  if (ninja === undefined) {
    return;
  }

  ninja.setReady();

  await msg.send(penguin, 'jz', ninja.seat);
  
  const players = fire.players;

  await msg.send(
    penguin, 'sz',
    fire.activePlayer.seat, // this is seemingly always 0, which is odd
    players.map(p => p.name).join(','),
    players.map(p => p.inventory.color).join(','),
    fire.energies.join(','),
    fire.positions.join(','),
    ninja.hand.join(','),
    fire.spin.join(','),
    players.map(p => p.ninja.cardRank).join(','),
    '' // unused
  );

  if (fire.everyoneReady()) {
    fire.setBoardTimeout(() => handleBoardTimeout(ctx));
  }
}

const handleClickSpinner: FireHandler<[number]> = ({ msg, fire }, tablet) => {
  msg.send(fire.players, 'zm', 'is', '' /* unused */, tablet);
}

const getBattleInfo = (battleType: BattleType): [string, string] => battleType === 'b' ? ['be', ''] : ['bt', battleType];

const handleStartBattle: FireHandler<[BattleType, FireNinja[]]> = async (ctx, type, players) => {
  const { fire, msg } = ctx;
  const [battle, trump] = getBattleInfo(type);
  fire.clearBoardTimeout();
  fire.createRound(players, type);

  fire.round.players.forEach(b => {
    b.setCardTimeout(() => {
      if (b.chosen === null) {
        handleClickCardRandom({ ...ctx, penguin: b.ninja.penguin });
      }
    });
  })

  await msg.send(fire.players, 'zm', 'sb', battle, players.map(p => p.seat).join(','), trump);
}

const handleSendChooseOpponent: FireHandler<[FireNinja[]]> = async ({ msg, fire }, pool) => {
  await msg.send(fire.players, 'zm', 'co', '' /* unused */, pool.map(n => n.seat).join(','));
}

const handleChooseOpponent: FireHandler<[number]> = async (ctx, opponent) => {
  const { fire, penguin } = ctx;
  const ninja = fire.fromPenguin(penguin);
  if (ninja === undefined) {
    return;
  }
  await handleStartBattle(ctx, 'b', [ninja, fire.fromSeat(opponent)]);
}

const handleClickBoard: FireHandler<[number, boolean]> = async (ctx, tile, auto) => {
  const { msg, fire, penguin } = ctx;
  const ninja = fire.fromPenguin(penguin);
  if (ninja === undefined) {
    return;
  }

  const playersInTile = fire.activePlayers
    .map(n => n.tile === tile ? n : null)
    .filter((n): n is FireNinja => n !== null);
  
  ninja.updateTile(tile);
  
  await msg.send(
    fire.players, 'zm', 'ub',
    fire.getSeatId(penguin),
    fire.positions.join(','),
    auto ? randomInt(1, 6) : 0 // the tablet being clicked, though this is seemingly only needed in auto play in the first turn
  );

  if (playersInTile.length > 0) {
    if (playersInTile.length === 1) {
      await handleStartBattle(ctx, 'b', [ninja, ...playersInTile]);
    } else {
      if (auto) {
        await handleStartBattle(ctx, 'b', [ninja, choose(playersInTile)]);
      } else {
        await handleSendChooseOpponent(ctx, playersInTile);
      }
    }
  } else {
    const type = BOARD[tile];

    if (type === 'b') {
      if (fire.players.length > 2) {
        if (auto) {
          await handleStartBattle(ctx, 'b', [ninja, choose(fire.activePlayers.filter(n => n !== ninja))]);
        } else {
          await handleSendChooseOpponent(ctx, fire.activePlayers);
        }
      } else {
        await handleStartBattle(ctx, type, fire.activePlayers);
      }
    } else if (type === 'c') {
      if (auto) {
        await handleChooseTrump(ctx, choose(['f', 'w', 's']));
      } else {
        await msg.send(fire.players, 'zm', 'ct');
      }
    } else {
      await handleStartBattle(ctx, type, fire.activePlayers);
    }
  }
}

const handleClickBoardPlayer: FireHandler<[number]> = async (ctx, tile) => await handleClickBoard(ctx, tile, false);

const handleClickBoardRandom: FireHandler<[]> = async (ctx) => {
  const { fire } = ctx;
  await handleClickBoard(ctx, fire.spin[randomInt(1, 2)], true);
}

const handleBoardTimeout: FireHandler<[]> = async (ctx) => {
  const { msg, fire } = ctx;
  const ninja = fire.activePlayer;

  await msg.send(ninja.penguin, 'zm', 'tb');

  await handleClickBoardRandom({ ...ctx, penguin: ninja.penguin });
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

const getTrumpResults = (cardIds: number[], element: CardElement): [number[], CardElement] => {
  const cardValues = cardIds.map(id => {
    const card = CARDS.getStrict(id);
    return card.element === element ? card.value : null;
  });

  const validValues = cardValues.filter((value): value is number => value !== null);
  const highest = validValues.length === 0 ? null : Math.max(...validValues);
  const isTie = validValues.filter(v => v === highest).length > 1;
  
  return [cardValues.map(value => {
    const winner = value !== null && value === highest;
    return winner ? (isTie ? 2 : 3) : 1;
  }), element];
}

const handleResolveBattle: FireHandler<[number[]]> = async ({ msg, fire }, cardIndexes) => {
  const battleIds = fire.round.players.map(b => b.ninja.seat);
  const cardIds = fire.round.players.map((b, i) => b.ninja.hand[cardIndexes[i]]);
  
  // results: 1 = losing, 2 = in a tie, 3 = winning, 4 = winning in card jitsu
  const [results, element] = fire.round.type === 'b'
    ? getCardJitsuResults(cardIds[0], cardIds[1])
    : getTrumpResults(battleIds, cardIds, fire.round.type);
  
  results.forEach((result, i) => {
    const ninja = fire.round.players[i].ninja;
    if (result === 4) {
      ninja.addEnergy();
    } else if (result === 1) {
      ninja.removeEnergy();
      if (ninja.energy <= 0) {
        fire.playerEntersPodium(ninja);
      }
    }
  });
  cardIndexes.forEach((cardIndex, i) => {
    fire.round.players[i].ninja.drawCard(cardIndex);
  });

  const energies = fire.round.players.map(b => b.ninja.energy);

  const [battleType] = getBattleInfo(fire.round.type);

  await Promise.all(fire.players.map(p => {
    const ninja = fire.fromPenguin(p);
    if (ninja === undefined) {
      return;
    }
    return msg.send(
      p, 'zm', 'rb',
      battleIds.join(','),
      cardIds.join(','),
      energies.join(','),
      results.join(','),
      [battleType, element].join(','),
      ninja.hand.join(','),
      fire.standings.join(',')
    );
  }));

  const finished = fire.energies.filter(energy => energy > 0).length <= 1;

  await Promise.all(fire.round.players.map(b => {
    const penguin = b.ninja.penguin;
    const noEnergy = b.ninja.energy <= 0;
    if (noEnergy) {
      fire.removePlayer(penguin);
    }
    if (noEnergy || finished) {
      if (!noEnergy) {
        fire.playerEntersPodium(b.ninja);
      }
      return msg.send(penguin, 'zm', 'zo', fire.standings.join(','));
    }
  }))
}

const handleClickCardRandom: FireHandler<[]> = async (ctx) => {
  await handleClickCard(ctx, randomInt(0, 4));
}

const handleClickCard: FireHandler<[number]> = async (ctx, cardIndex) => {
  const { msg, fire, penguin } = ctx;
  const battleNinja = fire.round.fromPenguin(penguin);
  if (battleNinja === undefined) {
    return;
  }

  battleNinja.clearTimeout();
  battleNinja.setCard(cardIndex);

  await msg.send(fire.players.filter(p => p !== penguin), 'zm', 'ic', battleNinja.ninja.seat);

  const [pendingPeople, nonPendingPeople] = doubleFilter((n => n.isPending()), fire.round.players);

  if (nonPendingPeople.filter(b => b.chosen === null).length === 0) {
    await Promise.all(pendingPeople.map(pending => {
      return (async () => {
        if (pending.chosen === null) {
          await handleClickCardRandom({ ...ctx, penguin: pending.ninja.penguin });
        }
        await pending.callPending();
      })()
    }));
  }

  const cards = fire.round.cards;
  if (cards.every((card): card is number => card !== null)) {
    await handleResolveBattle(ctx, cards);
  }
}

const handleReady: FireHandler<[]> = async (ctx) => {
  const { msg, penguin, fire } = ctx;
  const ninja = fire.fromPenguin(penguin);
  if (ninja === undefined || !fire.isPlaying(ninja)) {
    // 'ir' is still sent even after the end of the game
    return;
  }
  ninja.setReady();

  if (fire.everyoneReady()) {
    fire.nextPlayer();
    fire.newSpin();

    await Promise.all(fire.players.map(p => {
      const ninja = fire.fromPenguin(p);
      if (ninja === undefined) {
        return;
      }
      return msg.send(
        p, 'zm', 'nt',
        fire.activePlayer.seat,
        fire.spin.join(','),
        ninja.hand.join(',')
      )
    }));

    fire.setBoardTimeout(() => handleBoardTimeout(ctx));
  }
}

const handleChooseTrump: FireHandler<[BattleType]> = (ctx, trump) => {
  const { fire } = ctx;
  handleStartBattle(ctx, trump, fire.activePlayers);
}

export const handleLeaveFire: FireHandler<[]> = async (ctx) => {
  const { msg, fire, penguin } = ctx;
  const ninja = fire.fromPenguin(penguin);
  if (ninja === undefined) {
    return;
  }

  if (fire.isPlaying(ninja)) {
    if (fire.activePlayers.length === 2) {
      await msg.send(fire.activePlayers.filter(n => n !== ninja)[0].penguin, 'cz');
    
      fire.clearBoardTimeout();
    } else {
      const leaveMatch = async () => {
        await msg.send(fire.players, 'zm', 'cz', ninja.seat);
        fire.playerEntersPodium(ninja);
      }

      await handleSendCardJitsuStampInfo(ctx);
      fire.removePlayer(penguin);
      if (fire.activePlayer === ninja && fire.isChoosing()) {
        await handleClickBoardRandom(ctx);
        const battleNinja = fire.round.fromPenguin(penguin);
        if (battleNinja !== undefined) {
          battleNinja.setPending(leaveMatch);
        }
      } else if (fire.activePlayer !== ninja) {
        leaveMatch();
      }
    }
  }

  await handleSendCardJitsuStampInfo(ctx);
}

export const handleFireMove: FireHandler<string[]> = (ctx, action, ...rest) => {
  switch (action) {
    case 'is':
      handleClickSpinner(ctx, Number(rest[1]));
      break;
    case 'cb':
      handleClickBoardPlayer(ctx, Number(rest[0]));
      break;
    case 'cc':
      handleClickCard(ctx, Number(rest[0]));
      break;
    case 'co':
      handleChooseOpponent(ctx, Number(rest[0]));
      break;
    case 'ir':
      handleReady(ctx);
      break;
    case 'ct':
      handleChooseTrump(ctx, rest[0] as BattleType);
      break;
    default:
      logdebugerr('unknown cjfire action: ' + action);
  }
}
