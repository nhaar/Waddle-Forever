import { STARTER_DECKS } from "@server/game-logic/starter-deck";
import { Handler } from "..";
import { choose } from "@common/utils";
import { Handle } from "../handles";
import { CARDS } from "@server/game-logic/cards";

const handler = new Handler();

// get ninja rank
handler.xt(Handle.GetNinjaRanks, (client) => {
  client.sendXt('gnr', client.penguin.id, client.penguin.ninjaProgress.rank, 0, 0, 0);
});

// get card-jitsu level
handler.xt(Handle.GetNinjaLevel, (client) => {
  // ranke, percentage, unsure what 10 is
  client.sendXt('gnl', client.penguin.ninjaProgress.rank, client.penguin.ninjaProgress.percentage, 10);
})

handler.xt(Handle.GetFireLevel, (client) => {
  // unsure why 5 is needed
  // TODO fire ranks
  client.sendXt('gfl', 0, 0, 5);
});

// get cards
handler.xt(Handle.GetCards, (client) => {
  client.sendXt('gcd', client.penguin.getCards().map((card) => {
    return card.join(',');
  }).join('|'));
});

// adding cards when receiving a starter deck
handler.xt(Handle.AddItem, (client, id) => {
  const deck = STARTER_DECKS[id];
  if (deck !== undefined) {
    const powerCards: number[] = [];
    const normalCards: number[] = [];
    deck.forEach(card => {
      const info = CARDS.getStrict(card);
      (info.powerId > 0 ? powerCards : normalCards).push(card);
    });
    normalCards.forEach(card => client.penguin.addCard(card, 1));
    client.penguin.addCard(choose(powerCards), 1);
  }
  client.update();
});

export default handler;