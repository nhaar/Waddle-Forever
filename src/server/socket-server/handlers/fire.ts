import { logdebugerr } from "@server/logger";
import { getClockwise, getCounterClockwise, getRandomSpin, STARTER_ENERGY } from "../world/fire";
import { FireGuard, FireHandler } from "./handlers";
import { chooseN } from "@common/utils";

export const isFireGuard: FireGuard = () => true;

export const handleEnterFireGame: FireHandler<[]> = async ({ fire, penguin, msg }) => {
  const seatId = fire.getSeatId(penguin);
  
  await msg.send(penguin, 'jz', seatId);
  
  const players = fire.getPlayers();

  const positions = {
    2: [12, 4],
    3: [12, 4, 0],
    4: [12, 4, 0, 8]
  }[players.length];

  if (positions === undefined) {
    logdebugerr('fire game with illegal player count');
    return;
  }

  const tile = positions[seatId];

  const spin = getRandomSpin();
  
  msg.send(
    penguin, 'sz',
    0, // id of player that is playing, which is always 0?
    players.map(p => p.name).join(','),
    players.map(p => p.inventory.color).join(','),
    players.map(_ => STARTER_ENERGY).join(','),
    positions.join(','),
    chooseN(penguin.ninja.getDeck(), 5).join(','),
    [spin, getClockwise(tile, spin), getCounterClockwise(tile, spin)].join(','),
    players.map(p => p.ninja.cardRank).join(','),
    '' // unused
  );
}