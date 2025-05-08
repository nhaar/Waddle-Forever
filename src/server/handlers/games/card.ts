import { WaddleName } from "../../../server/game-logic/waddles";
import { WaddleGame } from "../../../server/client";
import { WaddleHandler } from "./waddle";

export class CardJitsu extends WaddleGame {
  public roomId: number = 998;

  public name: WaddleName = 'card';
}

const handler = new WaddleHandler<CardJitsu>('card');

handler.waddleXt('z', 'gz', (game, client) => {
  const seatNumber = game.getSeatId(client);
  // TODO why is seats duplicated?
  client.sendXt('gz', game.seats, game.seats);
  client.sendXt('jz', seatNumber, client.penguin.name, client.penguin.color, client.penguin.ninjaRank)
});

handler.waddleXt('z', 'uz', (game, client) => {
  client.sendXt('uz', ...game.players.map((p, i) => {
    return [i, p.penguin.name, p.penguin.color, client.penguin.ninjaRank].join('|');
  }));
  client.sendXt('sz');
});

export default handler;