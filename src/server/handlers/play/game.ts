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

export default handler;