import { SledGuard, SledHandler } from "../handlers";

export const isSledGuard: SledGuard = (ctx) => ctx.sled !== undefined;

export const handleJoinSled: SledHandler<[]> = ({ sled, penguin, msg, data }) => {
  msg.send(penguin, 'uz', sled.getPlayerCount(), ...sled.getPlayers().map((p) => {
    return (data.isPreCpip() ? [p.name, p.inventory.color] : [p.name, p.inventory.color, p.inventory.hand, p.name]).join('|');
  }));
}

export const handleMoveSled: SledHandler<[number, number, number, number]> = ({ sled, msg }, id, x, y, time) => {
  msg.send(sled.getPlayers(), 'zm', id, x, y, time);
}

export const handleEndSled: SledHandler<[number]> = ({ msg, penguin, prst, data }, standing) => {
  const coins = [20, 10, 5, 5][standing - 1];

  const total = penguin.currency.add(coins);
  if (data.isPreCpip()) {
    msg.send(penguin, 'zo');
  } else {
    msg.send(penguin, 'zo', total, '', 0, 0);
  }
  prst(penguin);
}