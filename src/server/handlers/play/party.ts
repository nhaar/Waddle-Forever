import { Handler } from "..";
import { Handle } from "../handles";

const handler = new Handler();

// donate coins for coins for change
handler.xt(Handle.DonateCoins, (client, choice, donation) => {
  // choice is useless, since we are not trying to rewrite history unfortunately

  // client doesn't check if can donate
  if (client.penguin.coins >= donation) {
    client.penguin.removeCoins(donation);
  } else {
    client.sendError(401);
  }

  client.sendXt('dc', client.penguin.coins);
  client.update();
})

handler.xt(Handle.RetrieveMedieval2012, (client) => {
  client.sendXt('sent', JSON.stringify({
    'msgViewedArray': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'communicatorMsgArray': [0, 0, 0, 0, 0],
    'questTaskStatus': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}));
});

export default handler;