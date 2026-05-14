import { PenguinMessenger } from "@server/handlers/messenger";
import { PenguinPersister, World } from "./world"
import { WorldPenguin } from "./world-penguin";
import { CommandResponse } from "./commands";
import { ArgumentsIndicator, GetArgumentsType, parseArgs } from "@server/handlers/arg-parser";
import { ITEMS } from "@server/game-logic/items";
import { filterItems, joinRoom, sendLPMessage } from "@server/handlers/play/join";
import { GameData } from "@server/timelines/game-data";
import { WorldRoom } from "./world-room";
import { RoomName, ROOMS } from "@server/game-data/rooms";

export type CommandContext = { 
  world: World;
  penguin: WorldPenguin;
  msg: PenguinMessenger;
  prst: PenguinPersister;
  data: GameData;
  room?: WorldRoom;
};

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
          runCallback: (ctx: CommandContext, commandArgs: Array<string>): void => {
            for (const [types, callback] of responses) {
              const parse = parseArgs(commandArgs, types);
              if (parse !== null) {
                callback(ctx, ...parse);
              }
            }
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

commands.add('ai', ['string'], ({ msg, penguin, prst, data }, action) => {
  if (action === 'all') {
    const allItems = ITEMS.rows;
    allItems.forEach(item => penguin.inventory.add(item.id));

    msg.send(penguin, 'gi', ...filterItems(data, penguin.inventory.items));
    prst(penguin);
  }
});

commands.add('jr', ['number'], (ctx, id) => {
  joinRoom(ctx, id, 0, 0);
});

commands.add('jr', ['string'], (ctx, name) => {
  if (name in ROOMS) {
    const info = ROOMS[name as RoomName];
    joinRoom(ctx, info.id, 0, 0);
  }
});

commands.add('ac', ['number'], ({ msg, penguin, prst, data }, coins) => {
  console.log(typeof coins, 'eis os coins');
  const total = penguin.currency.add(coins);

  if (data.isPreCpip()) {
    msg.send(penguin, 'ac', total);
  } else {
    sendLPMessage(penguin, data, msg);
  }

  prst(penguin);
});

commands.add('rename', 'string', ({ penguin, msg, data, prst }, ...names) => {
  const name = names.join(' ');

  penguin.changeName(name);
  // TODO what about pre-cpip?
  sendLPMessage(penguin, data, msg);
  prst(penguin);
});

commands.add('awards', [], ({ msg, penguin, prst }) => {
  // grant m7-m11 awards for speedrunning
  const awards = [815, 817, 819, 822, 8007];
  awards.forEach((award) => {
    penguin.inventory.add(award);
    msg.send(penguin, 'ai', award, penguin.currency.coins);
  });
  prst(penguin);
});

commands.add('age', [], ({ msg, prst, penguin, data }) => {  
  penguin.time.setVirtualRegistrationToNow();
  sendLPMessage(penguin, data, msg);
  prst(penguin);
});

commands.add('member', [], ({ penguin, prst, msg, data }) => {
  penguin.membership.swap();
  sendLPMessage(penguin, data, msg);
  prst(penguin);
});

export { commands }