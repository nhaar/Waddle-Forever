import { PenguinMessenger } from "@server/handlers/messenger";
import { WorldPenguin } from "./world-penguin";
import { CommandResponse } from "./commands";
import { ArgumentsIndicator, GetArgumentsType, parseArgs } from "@server/handlers/arg-parser";
import { ITEMS } from "@server/game-logic/items";
import { filterItems, joinRoom, sendLPMessage } from "@server/handlers/play/join";
import { RoomName, ROOMS } from "@server/game-data/rooms";
import PuffleLaunchGameSet from "@server/game-logic/pufflelaunch";
import { CARDS } from "@server/game-logic/cards";
import { PenguinContext, PenguinPersister, RoomContext } from "@server/handlers/handlers";

export type CommandContext = PenguinContext | RoomContext;

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

function addFurniture({ penguin, prst, msg }: { penguin: WorldPenguin; prst: PenguinPersister, msg: PenguinMessenger; }, id: number, amount: number): void {
  const ownedAmount = penguin.igloo.getFurnitureAmount(id);
  const addAmount = Math.max(Math.min(amount, 99 - ownedAmount), 0);
  penguin.igloo.addFurniture(id, addAmount);
  for (let i = 0; i < addAmount; i++) {
    msg.send(penguin, 'af', id, penguin.currency.coins);
  }

  prst(penguin);
}

commands.add('af', ['number', 'number'], addFurniture);

commands.add('af', ['number'], (client, id) => addFurniture(client, id, 1));

function getPuffleLaunchDataWithAlLBerries(times: number[], turboStatuses: boolean[]): PuffleLaunchGameSet {
  return new PuffleLaunchGameSet([
    34, 46, 99, 90, 115, 39,
    84, 42, 120, 123, 183, 54,
    59, 75, 243, 88, 203, 135,
    113, 284, 122, 153, 172, 69,
    44, 48, 103, 97, 86, 144,
    318, 165, 219, 87, 277, 33
  ], times, turboStatuses);
}

commands.add('plunlocklevels', [], ({ penguin, prst }) => {
  penguin.puffleLaunch.set(new PuffleLaunchGameSet((new Array<number>(36)).fill(0x1), [], []).get());
  prst(penguin);
});

commands.add('plunlocktimeattack', [], ({ penguin, prst }) => {
  penguin.puffleLaunch.set(getPuffleLaunchDataWithAlLBerries([], []).get());
  prst(penguin);
});

commands.add('plunlockturbo', [], ({ penguin, prst }) => {
  penguin.puffleLaunch.set(getPuffleLaunchDataWithAlLBerries((new Array<number>(36)).fill(1), []).get());
  prst(penguin);
});

commands.add('plunlockslowmode', [], ({ penguin, prst }) => {
  penguin.puffleLaunch.set(getPuffleLaunchDataWithAlLBerries((new Array<number>(36)).fill(1), (new Array<boolean>(36)).fill(true)).get());
  prst(penguin);
});

commands.add('nosave', [], ({ penguin, prst }) => {
  penguin.preference.disableSave();
  prst(penguin, true);
});

commands.add('enablesave', [], ({ penguin, prst }) => {
  penguin.preference.enableSave();
  prst(penguin);
});

commands.add('amulet', ['string'], ({ penguin, prst }, element) => {
  switch (element) {
    case 'fire':
      penguin.ninja.setFireNinja(!penguin.ninja.isFireNinja);
      break;
    case 'water':
      penguin.ninja.setWaterNinja(!penguin.ninja.isWaterNinja);
      break;
    case 'snow':
      penguin.ninja.setSnowNinja(!penguin.ninja.isSnowNinja);
      break;
  }
  prst(penguin);
});

commands.add('cjwin', [], ({ penguin, prst }) => {
  penguin.ninja.addMatchProgress(true);
  prst(penguin);
});

commands.add('cjwin', ['number'], ({ penguin, prst }, amount) => {
  for (let i = 0; i < amount; i++) {
    penguin.ninja.addMatchProgress(true);
  }
  prst(penguin);
});

commands.add('powercards', [], ({ penguin, prst }) => {
  CARDS.rows.forEach(row => {
    if (row.powerId > 0) {
      penguin.ninja.addCard(row.id, 1);
    }
  });
  prst(penguin);
});

commands.add('addcard', ['number', 'number'], ({ penguin, prst }, card, amount) => {
  penguin.ninja.addCard(card, amount);
  prst(penguin);
});

commands.add('safechat', [], ({ penguin, prst }) => {
  penguin.preference.setSafeChat(!penguin.preference.isSafeChat);
  prst(penguin);
});

export { commands }