import { MatchMaker, WaddleRoom } from "@server/client";
import { Handler } from "..";
import { CardJitsu } from "./card";
import { Handle } from "../handles";

const handler = new Handler();

handler.boot((s) => {
  s.setCardMatchmaker(new MatchMaker(2, (players) => {
    const game = new CardJitsu(players);
    game.startMatch();
  }, (players, time) => {
    const nicknames = players.map(p => p.penguin.name);
    players.forEach(p => p.sendXt('tmm', time, ...nicknames));
  }))
})

handler.xt(Handle.JoinMatchMaking, (client) => {
  client.server.cardMatchmaking.addPlayer(client);
  client.sendXt('jmm', client.penguin.name);
});

handler.xt(Handle.JoinSensei, (client) => {
  const game = new CardJitsu([client]);
  game.startMatch();
});

export default handler;