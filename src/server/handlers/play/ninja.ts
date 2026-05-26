import { World } from "@server/socket-server/world/world";
import { CARDS } from "@server/game-logic/cards";
import { chooseN } from "@common/utils";
import { PenguinMessenger } from "../messenger";
import { PenguinHandler } from "../handlers";

export const handleGetNinjaRanks: PenguinHandler<[]> = ({ msg, penguin }) => {
  msg.send(
    penguin, 'gnr',
    penguin.id,
    penguin.ninja.cardRank,
    penguin.ninja.isFireNinja ? 5 : 0,
    penguin.ninja.isWaterNinja ? 5 : 0,
    penguin.ninja.isSnowNinja ? 13 : 0
  );
}

export const handleGetNinjaLevel: PenguinHandler<[]> = ({ msg, penguin }) => {
  // ranke, percentage, unsure what 10 is
  msg.send(penguin, 'gnl', penguin.ninja.cardRank, penguin.ninja.cardPercentage, 10);
}

export const handleGetNinjaCards: PenguinHandler<[]> = ({ msg, penguin }) => {
  msg.send(penguin, 'gcd', penguin.ninja.cards.map((card) => {
    return card.join(',');
  }).join('|'));
}

function getAllPowerCards(): number[] {
  return CARDS.rows.filter((card) => card.powerId > 0).map(card => card.id);
}

export const handleBuyNinjaCards: PenguinHandler<[]> = ({ msg, penguin, prst }) => {
  const powerCards = getAllPowerCards();
  const cards = chooseN(powerCards, 3);
  cards.forEach(card => {
    penguin.ninja.addCard(card, 1);
  });
  
  msg.send(penguin, 'bpc', cards.join(','), penguin.currency.discount(1500));
  prst(penguin);
}

export const addMatchmakerListeners = (world: World, msg: PenguinMessenger) => {
  world.cardMatchmaker.addMatchListener((players) => {
    const game = world.getWaddleGame('card', players);
    const playersInfo = players.map(p => [p.name, p.inventory.color].join('|'));
    msg.send(players, 'scard', game.roomId, 1000 + players[0].id, players.length, 10, ...playersInfo);
  });
  world.cardMatchmaker.addTickListener((players, time) => {
    msg.send(players, 'tmm', time, ...players.map(p => p.name));
  });
}

export const handleJoinMatchmaking: PenguinHandler<[]> = ({ msg, penguin, world }) => {
  world.cardMatchmaker.addPlayer(penguin);
  msg.send(penguin, 'jmm', penguin.name);
}

export const handleJoinSensei: PenguinHandler<[]> = ({ world, penguin, msg }) => {
  const game = world.getWaddleGame('card', [penguin]);
  msg.send(penguin, 'scard', game.roomId, 1000 + penguin.id, 1, 0, [penguin.name, penguin.inventory.color].join('|'));
}
