import { CARD_STARTER_DECK } from "../../../server/game-logic/starter-deck";
import { Handler } from "..";
import { choose } from "../../../common/utils";
import { Handle } from "../handles";

const handler = new Handler();

// get ninja rank
handler.xt(Handle.GetNinjaRanks, (client) => {
  client.sendXt('gnr', client.penguin.id, client.penguin.ninjaRank, 0, 0, 0);
});

// get card-jitsu level
handler.xt(Handle.GetNinjaLevel, (client) => {
  // ranke, percentage, unsure what 10 is
  client.sendXt('gnl', client.penguin.ninjaRank, client.penguin.beltPercentage, 10);
})

// get cards
handler.xt(Handle.GetCards, (client) => {
  client.sendXt('gcd', client.penguin.getCards().map((card) => {
    return card.join(',');
  }).join('|'));
});

// adding cards when receiving a starter deck
handler.xt(Handle.AddItem, (client, id) => {
  if (id === 821) {
    CARD_STARTER_DECK.cards.forEach(card => {
      client.penguin.addCard(card, 1);
    });
    client.penguin.addCard(choose(CARD_STARTER_DECK.powerCards), 1);
  }
  client.update();
});

export default handler;