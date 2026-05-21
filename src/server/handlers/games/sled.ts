import { WorldContext } from "@server/socket-server/world/world";
import { XtHandler } from "../xt";

const handler = new XtHandler<WorldContext, ['world', 'penguin', 'sled', 'msg', 'prst', 'data']>(['world', 'penguin', 'sled', 'msg', 'prst', 'data']);

handler.xt('z', 'jz', [], ({ sled, penguin, msg }) => {
  msg.send(penguin, 'uz', sled.getPlayerCount(), ...sled.getPlayers().map((p) => {
    return [p.name, p.inventory.color, p.inventory.hand, p.name].join('|');
  }));
});

handler.xt('z', 'zm', ['number', 'number', 'number', 'number'], ({ sled, msg }, id, x, y, time) => {
  msg.send(sled.getPlayers(), 'zm', id, x, y, time);
});

handler.xt('z', 'zo', ['number'], ({ msg, penguin, prst, data }, standing) => {
  const coins = [20, 10, 5, 5][standing - 1];

  const total = penguin.currency.add(coins);
  if (data.isPreCpip()) {
    msg.send(penguin, 'zo');
  } else {
    msg.send(penguin, 'zo', total, '', 0, 0);
  }
  prst(penguin);
});

export { handler as sledHandler };