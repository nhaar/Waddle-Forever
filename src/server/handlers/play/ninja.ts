import { WorldContext } from "@server/socket-server/world/world";
import { XtHandler } from "../xt";
import { JoinHandler } from "./join";
import { CARDS } from "@server/game-logic/cards";
import { chooseN } from "@common/utils";

const handler = new XtHandler<WorldContext, ['penguin', 'world', 'data', 'msg', 'prst', 'db']>(['penguin', 'world', 'data', 'msg', 'prst', 'db']);

const handleGetNinjaRanks: JoinHandler<[]> = ({ msg, penguin }) => {
  msg.send(
    penguin, 'gnr',
    penguin.id,
    penguin.ninja.cardRank,
    penguin.ninja.isFireNinja ? 5 : 0,
    penguin.ninja.isWaterNinja ? 5 : 0,
    penguin.ninja.isSnowNinja ? 13 : 0
  );
}

const handleGetNinjaLevel: JoinHandler<[]> = ({ msg, penguin }) => {
  // ranke, percentage, unsure what 10 is
  msg.send(penguin, 'gnl', penguin.ninja.cardRank, penguin.ninja.cardPercentage, 10);
}

const handleGetNinjaCards: JoinHandler<[]> = ({ msg, penguin }) => {
  msg.send(penguin, 'gcd', penguin.ninja.cards.map((card) => {
    return card.join(',');
  }).join('|'));
}

function getAllPowerCards(): number[] {
  return CARDS.rows.filter((card) => card.powerId > 0).map(card => card.id);
}

const handleBuyNinjaCards: JoinHandler<[]> = ({ msg, penguin, prst }) => {
  const powerCards = getAllPowerCards();
  const cards = chooseN(powerCards, 3);
  cards.forEach(card => {
    penguin.ninja.addCard(card, 1);
  });
  
  msg.send(penguin, 'bpc', cards.join(','), penguin.currency.discount(1500));
  prst(penguin);
}

handler.xt('s', 'ni#gnr', [], handleGetNinjaRanks);
handler.xt('s', 'ni#gnl', [], handleGetNinjaLevel);
handler.xt('s', 'ni#gcd', [], handleGetNinjaCards);
handler.xt('s', 'cd#bpc', [], handleBuyNinjaCards);

export {
  handler as ninjaHandler
};