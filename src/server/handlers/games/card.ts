import { CardJitsuProgress } from "@server/game-logic/ninja-progress";
import { Stamp } from "@server/game-logic/stamps";
import { CardJitsu, NinjaPlayer, Sensei, WorldClient, WorldContext } from "@server/new-client";
import { Handle } from "../handles";
import { XtHandler } from "../xt";

const handler = new XtHandler<WorldClient, WorldContext, ['world', 'penguin', 'card']>(['world', 'penguin', 'card']);

handler.xt(Handle.EnterWaddleGame, ({ card, penguin }) => {
  const seatNumber = card.sensei ? 1 : card.getSeatId(penguin);
  // TODO why is seats duplicated?
  penguin.sendXt('gz', card.getPlayerCount(), card.getPlayerCount());
  penguin.sendXt('jz', seatNumber, penguin.info.name, penguin.info.color, penguin.info.ninjaProgress.rank)
});

handler.xt(Handle.UpdateWaddleGameSeats, ({ card, penguin }) => {
  const playersInfo: Array<[number, string, number, number]> = [];
  let seat = 0;
  if (card.sensei) {
    playersInfo.push([0, 'Sensei', 14, 10]);
    seat++;
  }
  for (const p of card.getPlayers()) {
    playersInfo.push([seat, p.info.name, p.info.color, p.info.ninjaProgress.rank]);
    seat++;
  }
  penguin.sendXt('uz', ...playersInfo.map(info => info.join('|')));
  penguin.sendXt('sz');
});

// specifically for quitting
handler.xt(Handle.LeaveWaddleMatch, ({ card, penguin }) => {
  card.removePlayer(penguin);

  const seatId = card.getSeatId(penguin);
  card.sendXt('cz', penguin.info.name);
  card.sendXt('lz', seatId);
});

// dealing new card to the player
handler.xt(Handle.CardJitsuDeal, ({ card, penguin }, action, amount) => {
  if (action === CardJitsu.DEAL_ACTION) {
    const ninja = card.getNinja(penguin);

    ninja.deal(amount);
    if (card.sensei) {
      ninja.opponent.deal(amount);
    }
  }
});

// player picks a card
handler.xt(Handle.CardJitsuPick, ({ card, penguin }, action, sessionId) => {
  if (action === CardJitsu.PICK_ACTION) {
    const ninja = card.getNinja(penguin);
    const otherNinja = ninja.opponent;

    card.chooseCard(ninja, sessionId);
    
    if (otherNinja instanceof Sensei) {
      otherNinja.pickCard();
    }

    if (otherNinja.hasChosen()) {
      const winner = card.judgeWinner();

      const winningHand = card.getWinningHand();

      const ninjas = [ninja, otherNinja];

      ninjas.forEach((n) => {
        const cardPick = card.getCard(n.chosen);
        if (cardPick.id === 256) {
          card.getPlayers().forEach(player => player.giveStamp(Stamp.SenseiCard));
        }
        if (n.seat !== winner) {
          n.removeFlawless();
        }

        if (CardJitsu.ON_PLAYED_POWER_CARDS.has(cardPick.powerId) || (cardPick.powerId > 0 && n.seat === winner)) {
          const cardsToDiscard: number[] = [];
          if (cardPick.powerId === 1) {
            card.setValueSwap();
          } else if (cardPick.powerId === 2) {
            card.alterModifier(n.seat, 2);
          } else if (cardPick.powerId === 3) {
            card.alterModifier(n.otherSeat, -2);
          }

          const colorToDiscard = CardJitsu.COLOR_DISCARD_POWER_CARDS[cardPick.powerId];
          if (colorToDiscard !== undefined) {
            Object.values(n.opponent.scores).forEach((cards) => {
              cards.forEach((sessionId) => {
                if (card.getCard(sessionId).color === colorToDiscard) {
                  cardsToDiscard.push(sessionId);
                }
              })
            });
            n.opponent.removeCards(cardsToDiscard);
          }
          const elementToDiscard = CardJitsu.ELEMENT_DISCARD_POWER_CARDS[cardPick.powerId];
          if (elementToDiscard !== undefined) {
            const cards = ninja.opponent.scores[elementToDiscard];
            const last = cards[cards.length - 1];
            cardsToDiscard.push(last);
            ninja.opponent.removeCards(cardsToDiscard);
          }

          // element blocking
          const elementToBlock = CardJitsu.ELEMENT_BLOCK_POWER_CARDS[cardPick.powerId];
          if (elementToBlock !== undefined) {
            n.opponent.blockElement(elementToBlock);
          }

          const [sender, recipient] =  CardJitsu.SELF_EFFECT_POWER_CARDS.has(cardPick.powerId) ? [n.seat, n.seat] : [n.seat, n.otherSeat];
          card.sendXt('zm', 'power', sender, recipient, cardPick.powerId, ...cardsToDiscard);
        }
        n.unchoose();
      });
      otherNinja.unchoose();
      ninja.unchoose();

      card.sendXt('zm', 'judge', winner);

      if (winningHand !== undefined) {
        const winnerNinja = card.getNinjaBySeatIndex(winner);
        if (winnerNinja instanceof NinjaPlayer) {
          // TODO research order stamps are given?
          if (winningHand.oneElement) {
            winnerNinja.player.giveStamp(Stamp.OneElement);
          } else {
            winnerNinja.player.giveStamp(Stamp.ElementalWin);
          }
          if (winnerNinja.isFlawless) {
            winnerNinja.player.giveStamp(Stamp.FlawlessVictory);
          }

          const scoredCards = Object.values(winnerNinja.scores).flat().length;
          if (scoredCards >= 9) {
            winnerNinja.player.giveStamp(Stamp.FullDojo);
          }

          winnerNinja.player.gainNinjaProgress(true);

          if (winnerNinja.player.info.cardJitsuWins >= 25) {
            winnerNinja.player.giveStamp(Stamp.MatchMaster);
          }

          // beating Sensei without Ninja Mask
          if (card.sensei && !penguin.info.ninjaProgress.isNinja) {
            penguin.becomeNinja();
          }
        }
        if (winnerNinja.opponent instanceof NinjaPlayer) {
          winnerNinja.opponent.player.gainNinjaProgress(false);
          // losing to Sensei as a black belt
          if (winnerNinja instanceof Sensei) {
            if (winnerNinja.opponent.player.info.ninjaProgress.rank >= CardJitsuProgress.MAX_RANK) {
              winnerNinja.opponent.player.info.ninjaProgress.addAttempt();
              winnerNinja.opponent.player.info.update();
            }
          }
        }

        card.setWinner(winningHand.seat, ...winningHand.cards);
      } else {
        // forced losing is achieved by sending no cards
        ninjas.forEach(n => {
          if (!n.hasCardsToPlay()) {
            card.setWinner(n.opponent.seat);
          }
        })
      }
    }
  }
})

export { handler as cardHandler };