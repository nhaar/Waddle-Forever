import { WorldContext } from "@server/socket-server/world/world";
import { XtHandler } from "../xt";
import { JoinHandler } from "./join";
import { sendError } from "./login";

const handler = new XtHandler<WorldContext, ['penguin', 'world', 'data', 'msg', 'prst', 'db']>(['penguin', 'world', 'data', 'msg', 'prst', 'db']);

const handleDonateCoins: JoinHandler<[string, number]> = ({ prst, penguin, msg }, _, donation) => {
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

const handleRetrieveMedieval2012: JoinHandler<[]> = ({ penguin, msg }) => {
  const medievalMessage = penguin.medieval2012.message;
  msg.send(penguin, 'sent', JSON.stringify({
    'msgViewedArray': [medievalMessage >= 1 ? 1 : 0, medievalMessage >= 2 ? 1 : 0]
  }));
}

const handleViewedMedieval2012: JoinHandler<[number]> = ({ penguin, prst }, message) => {
  penguin.medieval2012.setViewed(message);
  prst(penguin);
}

handler.xt('s', 'e#dc', ['string', 'number'], handleDonateCoins);
handler.xt('s', 'mdvl#retrieve', [], handleRetrieveMedieval2012);
handler.xt('s', 'mdvl#msgviewed', ['number'], handleViewedMedieval2012);

export {
  handler as partyHandler
};