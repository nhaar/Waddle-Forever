import { World } from "@server/socket-server/world/world";
import { JoinHandler } from "./join";
import { sendError } from "./login";
import { PenguinMessenger } from "../messenger";

export const handleDonateCoins: JoinHandler<[string, number]> = ({ prst, penguin, msg }, _, donation) => {
  // choice is useless, since we are not trying to rewrite history unfortunately

  // client doesn't check if can donate
  if (penguin.currency.coins >= donation) {
    penguin.currency.discount(donation);
  } else {
    sendError(msg, penguin, 401);
  }

  msg.send(penguin, 'dc', penguin.currency.coins);
  prst(penguin);
}

export const handleRetrieveMedieval2012: JoinHandler<[]> = ({ penguin, msg }) => {
  const medievalMessage = penguin.medieval2012.message;
  msg.send(penguin, 'sent', JSON.stringify({
    'msgViewedArray': [medievalMessage >= 1 ? 1 : 0, medievalMessage >= 2 ? 1 : 0]
  }));
}

export const handleViewedMedieval2012: JoinHandler<[number]> = ({ penguin, prst }, message) => {
  penguin.medieval2012.setViewed(message);
  prst(penguin);
}

export const addBakeryListener = (world: World, msg: PenguinMessenger) => {
  world.addBakeryListener(() => {
    msg.send(world.bakery.players, 'barsu', world.bakery.bakeryState);
  });
}

export const handleGetBakeryState: JoinHandler<[]> = ({ msg, penguin, world }) => {
  msg.send(penguin, 'barsu', world.bakery.bakeryState);
}

export const handleSendEnterHopper: JoinHandler<[string]> = ({ world }, type) => {
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
    console.log(ingredient, world.bakery.currentIngredient, 'KKKK');
    if (world.bakery.currentIngredient === ingredient) {
      world.bakery.nextIngredient();
    }
  }
}

export const handleGetCookieInventory: JoinHandler<[]> = ({ penguin, msg }) => {
  // placeholder just so that the animation works
  // cookie stock should theoreticailly increase when the bakery happens and decrease when a transformation happens
  // none of that is implemented however
  // and the max cookie variable is an unknown

  // current, max
  msg.send(penguin, 'ctc', 500, 1000);
}