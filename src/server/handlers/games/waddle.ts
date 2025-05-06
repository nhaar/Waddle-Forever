import { WaddleName } from "../../../server/game-logic/waddles";
import { Handler } from "..";
import { Client } from "../../../server/client";

/** XT Handler but for a Waddle Game */
export class WaddleHandler<GameLogic> extends Handler {
  private _name: WaddleName;
  
  constructor(name: WaddleName) {
    super();
    this._name = name;
  }

  /** Add a listener to a XT message with extension, code, that takes the game logic as an extra parameter */
  public waddleXt(extension: string, code: string, callback: (game: GameLogic, client: Client, ...args: string[]) => void) {
    this.xt(extension, code, (client: Client, ...args: string[]) => {
      if (client.isInWaddleGame() && client.waddleGame.name === this._name) {
        callback(client.waddleGame as GameLogic, client, ...args);
      }
    })
  }
}