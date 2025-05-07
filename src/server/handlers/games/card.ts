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
});

export default handler;