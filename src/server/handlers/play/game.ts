import { randomInt } from "../../../common/utils";
import { Handler } from "..";

const handler = new Handler();

// currently only supporting puffle launch. There may be other games that use this
// get game data
handler.xt('z', 'ggd', (client) => {
  client.sendXt('ggd', client.penguin.getGameData().toString('utf-8'));
})

// set/save game data
handler.xt('z', 'sgd', (client, data) => {
  client.penguin.setGameData(Buffer.from(data));
  client.update();
})

// this is seemingly the same endpoint used in dance contest
// there may be conflict, but this is for spy drills
handler.xt('z', 'zr', (client) => {
  // array containing 1...10
  const games = [...Array(10).keys()].map((i) => i + 1);

  // pick 3 games randomly
  const picks = [];
  const totalPicks = 3;
  for (let i = 0; i < totalPicks; i++) {
    const pick = randomInt(0, games.length - 1);
    picks.push(...games.splice(pick, 1));
  }

  // TODO look into original algorithm
  const medalsReward = 1;

  client.sendXt('zr', picks.join(','), medalsReward);
})

export default handler;