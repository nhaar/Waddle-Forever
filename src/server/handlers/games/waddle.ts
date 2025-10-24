import { WaddleName } from "../../../server/game-logic/waddles";
import { Handler } from "..";
import { Client } from "../../../server/client";
import { HandleName, HandleArguments, GetArgumentsType, ArgumentsIndicator } from "../handles";

/** XT Handler but for a Waddle Game */
export class WaddleHandler<GameLogic> extends Handler {
  private _name: WaddleName;
  
  constructor(name: WaddleName) {
    super();
    this._name = name;
  }

  /** Add a listener to a XT message with extension, code, that takes the game logic as an extra parameter */
  public waddleXt<
    Name extends HandleName
  >(
    name: Name,
    callback: (game: GameLogic, client: Client, ...args: GetArgumentsType<HandleArguments[Name]>) => void
  ) {
    this.xt(name, (client: Client, ...args: GetArgumentsType<HandleArguments[Name]>) => {
      if (client.isInWaddleGame() && client.waddleGame.name === this._name) {
        callback(client.waddleGame as GameLogic, client, ...args);
      }
    });
  }
}