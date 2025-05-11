import { MatchMaker, WaddleRoom } from "../../../server/client";
import { Handler } from "..";
import { CardJitsu } from "./card";
import { Handle } from "../handles";

const handler = new Handler();

handler.boot((s) => {
  s.setCardMatchmaker(new MatchMaker(2, (players) => {
    const game = new CardJitsu(players);

    const waddleRoom = new WaddleRoom(players.length);

    players.forEach((p) => {
      waddleRoom.addPlayer(p);
    });

    const playerInfo = players.map(p => `${p.penguin.name}|${p.penguin.color}`);

    const waddleId = 1000 + players[0].penguin.id;

    players.forEach((p) => {
      p.sendXt('scard', game.roomId, waddleId, players.length, 10, ...playerInfo);
    });
  }))
})

handler.xt(Handle.JoinMatchMaking, (client) => {
  client.server.cardMatchmaking.addPlayer(client);
  client.sendXt('jmm', client.penguin.name);
});

export default handler;