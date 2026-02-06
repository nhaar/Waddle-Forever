import { choose } from "@common/utils";
import { Handler } from "..";
import { SPY_DRILLS_DATA } from "../../game-logic/spy-drills";
import { Handle } from "../handles";

const handler = new Handler();

// currently only supporting puffle launch. There may be other games that use this
// get game data
handler.xt(Handle.GetPuffleLaunchData, (client) => {
  client.sendXt('ggd', client.penguin.getGameData().toString('utf-8'));
});

// set/save game data
handler.xt(Handle.SetPuffleLaunchData, (client, data) => {
  client.penguin.setGameData(Buffer.from(data));
  client.update();
});

// this is seemingly the same endpoint used in dance contest
// there may be conflict, but this is for spy drills
handler.xt(Handle.RollSpyDrills, (client) => {
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

  client.sendXt('zr', games.join(','), medalCount);
});

// receive medals from spy drills
handler.xt(Handle.SpyDrillsReward, (client, medals) => {
  client.penguin.addEpfMedals(medals);
});

export default handler;