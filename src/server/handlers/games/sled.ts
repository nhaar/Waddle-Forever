import { WaddleName } from "../../../server/game-logic/waddles";
import { WaddleGame } from "../../../server/client";
import { WaddleHandler } from "./waddle";

export class SledRace extends WaddleGame {
  public roomId: number = 999;

  public name: WaddleName = 'sled';

  private _payouts: number[] = [20, 10, 5, 5];

  getPayout(): number {
    return this._payouts.shift() ?? 0;
  }
}

const handler = new WaddleHandler<SledRace>('sled');

handler.waddleXt('z', 'jz', (game, client) => {
  client.sendXt('uz', game.seats, ...game.players.map((p) => {
    return [p.penguin.name, p.penguin.color, p.penguin.hand, p.penguin.name].join('|');
  }));
});

handler.waddleXt('z', 'zm', (_, client, id, x, y, time) => {
  client.sendWaddleXt('zm', id, x, y, time);
});

handler.waddleXt('z', 'zo', (game, client) => {
  client.penguin.addCoins(game.getPayout())
  client.sendXt('zo', client.penguin.coins, '', 0, 0, 0);
  client.update();
});

export default handler;