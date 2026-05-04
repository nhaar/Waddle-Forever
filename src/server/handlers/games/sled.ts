import { WorldClient, WorldContext } from "@server/new-client";
import { Handler } from "..";
import { Handle } from "../handles";

const handler = new Handler<WorldClient, WorldContext, ['world', 'penguin', 'sled']>(['world', 'penguin', 'sled']);

// Joining room
handler.xt(Handle.JoinRoom, ({ world, sled, penguin }, id, x, y) => {
  sled.removePlayer(penguin);
  world.getRoom(id).addPenguin(penguin, x, y);
});

handler.xt(Handle.JoinRoomOld, ({ world, sled, penguin }, id, x, y) => {
  sled.removePlayer(penguin);
  world.getRoom(id).addPenguin(penguin, x, y);
});

handler.xt(Handle.JoinSled, ({ world, sled, penguin }) => {
  penguin.sendXt('uz', sled.getPlayerCount(), ...sled.getPlayers().map((p) => {
    if (world.data.isPreCpip()) {
      // TODO is this check really necessary?
      return [p.info.name, p.info.color]
    } else {
      return [p.info.name, p.info.color, p.info.hand, p.info.name]
    }
  }).map(array => array.join('|')));
});

handler.xt(Handle.SledRaceAction, ({ sled }, id, x, y, time) => {
  sled.sendXt('zm', id, x, y, time);
});

handler.xt(Handle.LeaveWaddleGame, ({ world, penguin }, score) => {
  const coins = [20, 10, 5, 5][score - 1];
  penguin.info.addCoins(coins)
  if (world.data.isPreCpip()) {
    penguin.sendXt('zo');
  } else {
    penguin.sendXt('zo', penguin.info.coins, '', 0, 0, 0);
  }
  penguin.info.update();
});

export default handler;