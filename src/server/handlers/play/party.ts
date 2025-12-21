import { Handler } from "..";
import { Handle } from "../handles";
import { findInVersionStrict } from "../../game-data";
import { BAKERY_TIMELINE } from "../../timelines/cfc";

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
  const medievalMessage = client.penguin.medieval2012Message;
  client.sendXt('sent', JSON.stringify({
    'msgViewedArray': [medievalMessage >= 1 ? 1 : 0, medievalMessage >= 2 ? 1 : 0]
  }));
});

handler.xt(Handle.Medieval2012ViewedMessage, (client, messageIndex) => {
  // message is index of an array (0-indexed)
  client.penguin.medieval2012Message = messageIndex + 1;
  client.penguin.update();
});

handler.xt(Handle.GetBakeryState, (client) => {
  client.server.bakery.sendBakeryState();
});

handler.xt(Handle.SendEmote, (client, emote) => {
  if (findInVersionStrict(client.version, BAKERY_TIMELINE) === false) {
    return;
  }
  // party3
  if (client.room === client.server.bakery.room && Number(emote) === client.server.bakery.emote) {
    client.server.bakery.incrementCheer();
  }
});

export default handler;