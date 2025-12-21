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

handler.xt(Handle.SendEnterHopper, (client, type) => {
  // this is a recreation of this handler, it is unknown if the original handler sent the snowball type or not
  // the type was added to prevent bugs with people spamming snowballs
  // however, the way this was added isn't perfect and it's likely it didn't really check the types, as the shell function
  // never receives the snowball thrown event information, and instead I had to fetch it directly from the transformation
  // which introduces the bug of the player walking mid snowball throw
  const enumType = type.match(/\[ball(\w+)\|\d+\]/);
  if (enumType !== null) {
    const ingredient = {
      'Candy': 'Candy',
      'Egg': 'Eggs',
      'Tire': 'Tire',
      'Hay': 'Hay',
      'Flour': 'Flour',
      'Milk': 'Milk'
    }[enumType[1]];
    if (client.server.bakery.currentIngredient === ingredient) {
      client.server.bakery.nextIngredient();
    }
  }
});

export default handler;