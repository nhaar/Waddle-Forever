// import { choose } from "@common/utils";
// import { Client } from "@server/client";
// import { Handler } from "..";
// import { SPY_DRILLS_DATA } from "../../game-logic/spy-drills";
// import { Handle } from "../handles";

import { choose } from "@common/utils";
import { CARDS } from "@server/game-logic/cards";
import { ItemType } from "@server/game-logic/items";
import { Room } from "@server/game-logic/rooms";
import { SPY_DRILLS_DATA } from "@server/game-logic/spy-drills";
import { STARTER_DECKS } from "@server/game-logic/starter-deck";
import { CardJitsu, MatchMaker, World, WorldClient, WorldContext } from "@server/new-client";
import { Handler } from "..";
import { Handle } from "../handles";

const handler = new Handler<WorldClient, WorldContext, ['penguin', 'world','game']>(['penguin', 'world', 'game']);

handler.xt(Handle.JoinRoom, ({ world, game, penguin }, id, x, y ) => {
  game.removePenguin(penguin);
  world.getRoom(id).addPenguin(penguin, x, y);
});

// const CARD_JITSU_ROOMS = new Set<number>([Room.CardJitsu, Room.CardJitsuFire, Room.CardJitsuWater]);

// client requesting to leave a minigame
handler.xt(Handle.LeaveGame, ({ world, game, penguin, client }, score) => {
  // waddle games individually handle this
  // card jitsu sometimes has stamp endscreen
  // const isCardJitsu = CARD_JITSU_ROOMS.has(game.getId());
  // if ((client.isInWaddleGame() && !isCardJitsu) || world.data.isPreCpip()) {
  //   return;
  // }
  if (world.data.isPreCpip()) {
    return;
  }

  const stampInfo = penguin.getEndgameStampsInformation(game.getId());

  // if (!isCardJitsu) {
    let coins = game.getCoinsFromScore(score);
  
    // stamps double coins
    if (stampInfo[1] > 0 && stampInfo[1] == stampInfo[2]) {
      coins *= 2;
    }
  
    penguin.info.addCoins(coins);
  // }
  
  client.sendXt('zo', String(penguin.info.coins), ...stampInfo);
  void penguin.info.update();
});

// Paying after minigame
handler.xt(Handle.LeaveGame, ({ world, game, penguin }, score) => {
  if (!world.data.isPreCpip()) {
    return;
  }
  // if (client.isInWaddleGame() && client.waddleGame.name === 'sled') {
  //   return;
  // }
  const coins = game.getCoinsFromScore(score);
  penguin.info.addCoins(coins);
  
  penguin.sendXt('zo');
  penguin.info.update();
})

// currently only supporting puffle launch. There may be other games that use this
// get game data
handler.xt(Handle.GetPuffleLaunchData, ({ penguin }) => {
  penguin.sendXt('ggd', penguin.info.getGameData().toString('utf-8'));
});

// set/save game data
handler.xt(Handle.SetPuffleLaunchData, ({ penguin }, data) => {
  penguin.info.setGameData(Buffer.from(data));
  penguin.info.update();
});

// this is seemingly the same endpoint used in dance contest
// there may be conflict, but this is for spy drills
handler.xt(Handle.RollSpyDrills, ({ penguin }) => {
  // The original algorithm is unknown, so we are using experimental data to simulate it
  const randomOption = choose(SPY_DRILLS_DATA);
  const [games, medalCount] = randomOption;
  
  /*
  Regarding the generation, it would pick 3 random spy drill games and then assign a medal count to them.
  We don't know how either of those processes worked exactly

  # Minigame picking
  At first you would think it is random, but there seems to be a clear relation with how the games are picked.
  The algorithm seems to have a difficulty preference and it tries to increase the difficulty each time.
  It is not exactly known what algorithm is used for this, however

  # Medals Calculation
  The medals number is deterministic, meaning the same minigames always give the same medals.
  It is likely that it just follows a simple point system, but the points are likely decimal, which make it
  hard to predict their values since they would get rounded into an integer, and we lose a lot
  of information because of that
  */

  penguin.sendXt('zr', games.join(','), medalCount);
});

// receive medals from spy drills
handler.xt(Handle.SpyDrillsReward, ({ penguin }, medals) => {
  penguin.info.addEpfMedals(medals);
});

// adding cards when receiving a starter deck
handler.xt(Handle.AddItem, ({ world, penguin, client }, id) => {
  const deck = STARTER_DECKS[id];
  if (deck !== undefined) {
    const powerCards: number[] = [];
    const normalCards: number[] = [];
    deck.forEach(card => {
      const info = CARDS.getStrict(card);
      (info.powerId > 0 ? powerCards : normalCards).push(card);
    });
    normalCards.forEach(card => penguin.info.addCard(card, 1));
    penguin.info.addCard(choose(powerCards), 1);
  }

  // updating mission stampbook
  const item = world.data.getItem(id);
  if (item.type === ItemType.Award) {
    client.sendXt('qpa', penguin.id, id);
  }

  penguin.addItem(id);
  penguin.info.update();
});

handler.xt(Handle.JoinMatchMaking, ({ world, penguin }) => {
  world.cardMatchmaker.addPlayer(penguin);
  penguin.sendXt('jmm', penguin.info.name);
});

handler.xt(Handle.JoinSensei, ({ world, penguin }) => {
  const game = world.getWaddleGame('card', [penguin]) as CardJitsu;
  game.startMatch();
});

export default handler;