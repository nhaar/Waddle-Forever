import { COLOR_DISCARD_POWER_CARDS, ELEMENT_BLOCK_POWER_CARDS, ELEMENT_DISCARD_POWER_CARDS, NinjaPlayer, ON_PLAYED_POWER_CARDS, SELF_EFFECT_POWER_CARDS, Sensei } from "@server/socket-server/world/card";
import { getStamp } from "./puffle";
import { Stamp } from "@server/game-logic/stamps";
import { CardJitsuProgress } from "@server/game-logic/ninja-progress";
import { handleReceiveMail } from "./mail";
import { CardGuard, CardHandler, PenguinHandler } from "./handlers";

export const handleEnterCardGame: CardHandler<[]> = ({ card, penguin, msg }) => {
  const seatNumber = card.sensei ? 1 : card.getSeatId(penguin);
  // TODO why is seats duplicated?
  msg.send(penguin, 'gz', card.getPlayerCount(), card.getPlayerCount());
  msg.send(penguin, 'jz', seatNumber, penguin.name, penguin.inventory.color, penguin.ninja.cardRank);
}

export const handleUpdateCardSeats: CardHandler<[]> = ({ msg, penguin, card }) => {
  const playersInfo = [
    ...(card.sensei ? [[0, 'Sensei', 14, 10]] : []),
    ...card.players.map((p, i) => [i + (card.sensei ? 1 : 0), p.name, p.inventory.color, p.ninja.cardRank])
  ];
  msg.send(penguin, 'uz', ...playersInfo.map(info => info.join('|')));
  msg.send(penguin, 'sz');
}

const handleCardJitsuDeal: CardHandler<[number]> = ({ penguin, card, msg }, amount) => {
  const ninja = card.getNinja(penguin);

  const cards = card.deal(ninja, amount);
  msg.send(card.players, 'zm', 'deal', ninja.seat, ...cards);

  if (card.sensei) {
    const sensei = card.getOpponent(ninja);
    const cards = card.deal(sensei, amount);
    msg.send(card.players, 'zm', 'deal', sensei.seat, ...cards);
  }
}

const ninjaRankUp: PenguinHandler<[number]> = (ctx, previous) => {
  const { prst, msg, penguin, data } = ctx;
  for (let i = previous + 1; i <= penguin.ninja.cardRank; i++) {
    penguin.inventory.add(CardJitsuProgress.ITEM_AWARDS[i - 1]);
    const postcard = CardJitsuProgress.POSTCARD_AWARDS[i];
    if (postcard !== undefined) {
      handleReceiveMail(ctx, penguin.mail.receivePostcard(postcard, {}));
    }
    const stamp = CardJitsuProgress.STAMP_AWARDS[i];
    if (stamp !== undefined) {
      getStamp(data, msg, penguin, stamp);
    }
  }
  msg.send(penguin, 'cza', penguin.ninja.cardRank);
  prst(penguin);
}

const gainProgress: PenguinHandler<[boolean]> = (ctx, won) => {
  const { penguin, prst } = ctx;
  penguin.ninja.addWin();

  if (penguin.ninja.cardRank < CardJitsuProgress.MAX_RANK) {
    const exp = won ? 5 : 1;
    const previousRank = penguin.ninja.cardRank;
    penguin.ninja.earnXP(exp);

    if (penguin.ninja.cardRank > previousRank) {
      ninjaRankUp(ctx, previousRank);
    }
  }

  prst(penguin);
}

export const handleSendCardJitsuStampInfo: PenguinHandler<[]> = async (ctx) => {
  const { data, penguin, msg, prst } = ctx;
  
  const game = 'card' in ctx ? ctx.card :
    'fire' in ctx ? ctx.fire : undefined;
  const roomId = game?.roomId;
  if (roomId === undefined) {
    return;
  }

  const gameStamps = data.getGameStamps(roomId);
  const sessionStamps = penguin.stampbook.sessionStamps.filter(stamp => gameStamps.has(stamp));
  const collectedCount = [...gameStamps.values()].filter(stamp => penguin.stampbook.has(stamp)).length;
  const totalCount = gameStamps.size;

  penguin.stampbook.resetSessionStamps();
  await msg.send(penguin, 'cjsi', sessionStamps.join('|'), collectedCount, totalCount, 0);
  prst(penguin);
}

const exitGame: CardHandler<[]> = async (ctx) => {
  const { penguin, data, msg } = ctx;
  // for when the player got stamps in older versions
  for (let i = 0; i <= penguin.ninja.cardRank; i++) {
    const stamp = CardJitsuProgress.STAMP_AWARDS[i];
    if (stamp !== undefined) {
      getStamp(data, msg, penguin, stamp);
    }
  }
  handleSendCardJitsuStampInfo(ctx);
}

const setWinner: CardHandler<number[]> = async (ctx, winner, ...cards: number[]) => {
  const { card, msg } = ctx;
  // players are removed so that they don't get the "player quit" popup even though the game ended normally
  
  await Promise.all(card.players.map(p => exitGame({ ...ctx, penguin: p })));
  msg.send(card.players, 'czo', 0, winner, ...cards);
}

const handleCardJitsuPick: CardHandler<[number]> = (ctx, sessionId) => {
  const { penguin, card, msg, data, prst } = ctx;
  const ninja = card.getNinja(penguin);
  const otherNinja = card.getOpponent(ninja);

  ninja.choose(sessionId);
  msg.send(card.players, 'zm', 'pick', ninja.seat, sessionId);
  
  if (otherNinja instanceof Sensei) {
    otherNinja.pickCard();
    msg.send(card.players, 'zm', 'pick', otherNinja.seat, otherNinja.chosen);
  }

  if (otherNinja.hasChosen()) {
    const winner = card.judgeWinner();

    const winningHand = card.getWinningHand();

    const ninjas = [ninja, otherNinja];

    ninjas.forEach((n) => {
      const otherN = card.getOpponent(n);
      const chosenCard = card.getCard(n.chosen);
      if (chosenCard.id === 256) {
        card.players.forEach(p => getStamp(data, msg, p, Stamp.SenseiCard));
      }
      if (n.seat !== winner) {
        n.removeFlawless();
      }

      if (ON_PLAYED_POWER_CARDS.has(chosenCard.powerId) || (chosenCard.powerId > 0 && n.seat === winner)) {
        const cardsToDiscard: number[] = [];
        if (chosenCard.powerId === 1) {
          card.setValueSwap();
        } else if (chosenCard.powerId === 2) {
          card.alterModifier(n.seat, 2);
        } else if (chosenCard.powerId === 3) {
          card.alterModifier(otherN.seat, -2);
        }

        const colorToDiscard = COLOR_DISCARD_POWER_CARDS[chosenCard.powerId];
        if (colorToDiscard !== undefined) {
          Object.values(otherN.scores).forEach((cards) => {
            cards.forEach((sessionId) => {
              if (card.getCard(sessionId).color === colorToDiscard) {
                cardsToDiscard.push(sessionId);
              }
            })
          });
          otherN.removeCards(cardsToDiscard);
        }
        const elementToDiscard = ELEMENT_DISCARD_POWER_CARDS[chosenCard.powerId];
        if (elementToDiscard !== undefined) {
          const cards = otherN.scores[elementToDiscard];
          const last = cards[cards.length - 1];
          cardsToDiscard.push(last);
          otherN.removeCards(cardsToDiscard);
        }

        // element blocking
        const elementToBlock = ELEMENT_BLOCK_POWER_CARDS[chosenCard.powerId];
        if (elementToBlock !== undefined) {
          otherN.blockElement(elementToBlock);
        }

        const [sender, recipient] =  SELF_EFFECT_POWER_CARDS.has(chosenCard.powerId) ? [n.seat, n.seat] : [n.seat, otherN.seat];
        msg.send(card.players, 'zm', 'power', sender, recipient, chosenCard.powerId, ...cardsToDiscard);
      }
      n.unchoose();
    });
    otherNinja.unchoose();
    ninja.unchoose();

    msg.send(card.players, 'zm', 'judge', winner);

    if (winningHand !== undefined) {
      const winnerNinja = card.getNinjaBySeatIndex(winner);
      const loserNinja = card.getOpponent(winnerNinja);
      if (winnerNinja instanceof NinjaPlayer) {
        // TODO research order stamps are given?
        if (winningHand.oneElement) {
          getStamp(data, msg, winnerNinja.player, Stamp.OneElement);
        } else {
          getStamp(data, msg, winnerNinja.player, Stamp.ElementalWin);
        }
        if (winnerNinja.isFlawless) {
          getStamp(data, msg, winnerNinja.player, Stamp.FlawlessVictory);
        }

        const scoredCards = Object.values(winnerNinja.scores).flat().length;
        if (scoredCards >= 9) {
          getStamp(data, msg, winnerNinja.player, Stamp.FullDojo);
        }

        gainProgress({ ...ctx, penguin: winnerNinja.player }, true);

        if (winnerNinja.player.ninja.cardWins >= 25) {
          getStamp(data, msg, winnerNinja.player, Stamp.MatchMaster);
        }

        // beating Sensei without Ninja Mask
        if (card.sensei && !penguin.ninja.isNinja) {
          penguin.ninja.becomeNinja();
        }
      }
      if (loserNinja instanceof NinjaPlayer) {
        gainProgress({ ...ctx, penguin: loserNinja.player }, false);
        // losing to Sensei as a black belt
        if (winnerNinja instanceof Sensei) {
          if (loserNinja.player.ninja.cardRank >= CardJitsuProgress.MAX_RANK) {
            loserNinja.player.ninja.addAttempt();
            prst(loserNinja.player);
          }
        }
      }

      setWinner(ctx, winningHand.seat, ...winningHand.cards);
    } else {
      // forced losing is achieved by sending no cards
      ninjas.forEach(n => {
        if (card.playerCanPlay(n)) {
          setWinner(ctx, card.getOpponent(n).seat);
        }
      });
    }
  }
}

export const handleCardJitsuAction: CardHandler<[string, number]> = (ctx, action, arg) => {
  if (action === 'deal') {
    handleCardJitsuDeal(ctx, arg);
  } else if (action === 'pick') {
    handleCardJitsuPick(ctx, arg);
  }
}

export const handleQuitCard: CardHandler<[]> = (ctx) => {
  const { card, msg, penguin } = ctx;
  exitGame(ctx);
  const seat = card.getSeatId(penguin);

  msg.send(card.players, 'cz', penguin.name);
  msg.send(card.players, 'lz', seat);
}

export const isCardJitsuGuard: CardGuard = ({ card }) => card !== undefined;
