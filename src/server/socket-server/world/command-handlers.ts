import { PenguinMessenger } from "@server/handlers/messenger";
import { PenguinPersister, World } from "./world"
import { WorldPenguin } from "./world-penguin";
import { CommandResponse } from "./commands";
import { ArgumentsIndicator, GetArgumentsType, parseArgs } from "@server/handlers/arg-parser";

export type CommandContext = { world: World; penguin: WorldPenguin; msg: PenguinMessenger; prst: PenguinPersister };

class CommandResponseGenerator {
  private _listeners = new Map<string, Array<[ArgumentsIndicator, callback: (ctx: CommandContext, ...args: Array<string | number>) => void]>>();
  
  public add<const T extends ArgumentsIndicator>(name: string, types: T, callback: (ctx: CommandContext, ...args: GetArgumentsType<T>) => void) {
    let overloads = this._listeners.get(name);
    if (overloads === undefined) {
      overloads = [];
      this._listeners.set(name, overloads);
    }

    overloads.push(
      [types, callback as (ctx: CommandContext, ...args: Array<string | number>) => void]
    );
  }

  public get(): Array<[string, CommandResponse<CommandContext>]> {
    const entries: Array<[string, CommandResponse<CommandContext>]> = [];

    

    return [...this._listeners.entries()].map(([name, responses]) => {
      const responder: CommandResponse<CommandContext> = {
          getCallback: (commandArgs: Array<string>): ((ctx: CommandContext, ...args: Array<string | number>) => void) | undefined => {
            for (const [types, callback] of responses) {
              const parse = parseArgs(commandArgs, types);
              if (parse !== null) {
                return callback;
              }
            }
            return undefined;
          }
        }
      return [
        name,
        responder
      ]
    });
  }
}

const commands = new CommandResponseGenerator();

commands.add('ai', ['number'], ({ msg, penguin, prst }, itemId) => {
  penguin.inventory.add(itemId);
  msg.send(penguin, 'ai', itemId, penguin.currency.coins);
  prst(penguin);
});

export { commands }