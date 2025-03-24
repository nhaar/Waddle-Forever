import { XtHandler } from "..";

const handler = new XtHandler();

// currently only supporting puffle launch. There may be other games that use this
// get game data
handler.xt('z', 'ggd', (client) => {
  client.sendXt('ggd', client.getGameData());
})

// set/save game data
handler.xt('z', 'sgd', (client, data) => {
  client.saveGameData(data);
})

export default handler;