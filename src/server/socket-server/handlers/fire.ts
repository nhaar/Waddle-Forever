import { STARTER_ENERGY } from "../world/fire";
import { FireGuard, FireHandler } from "./handlers";
import { chooseN } from "@common/utils";

export const isFireGuard: FireGuard = () => true;

export const handleEnterFireGame: FireHandler<[]> = async ({ fire, penguin, msg }) => {
  const seatId = fire.getSeatId(penguin);
  
  await msg.send(penguin, 'jz', seatId);
  
  const players = fire.getPlayers();

  await msg.send(
    penguin, 'sz',
    0, // id of player that is playing, which is always 0?
    players.map(p => p.name).join(','),
    players.map(p => p.inventory.color).join(','),
    players.map(_ => STARTER_ENERGY).join(','),
    fire.positions.join(','),
    chooseN(penguin.ninja.getDeck(), 5).join(','),
    fire.spin.join(','),
    players.map(p => p.ninja.cardRank).join(','),
    '' // unused
  );
}

export const handleFireMove: FireHandler<[string, number, number]> = ({ msg, fire }, action, unknown, tile) => {
  if (action === 'is') {
    msg.send(fire.getPlayers(), 'zm', 'is', '' /* unused */, tile);
  }
}
