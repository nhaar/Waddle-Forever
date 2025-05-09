import { Client } from "../../../server/client";
import { Handler } from "..";
import { ITEMS } from "../../game-logic/items";
import { Room } from "../../game-logic/rooms";
import { CARDS } from "../../../server/game-logic/cards";
import { RoomName, ROOMS } from "../../../server/game-data/rooms";

const handler = new Handler();

type Primitive = 'number' | 'string';

// helper to map primitive types to actual typescript types
type MapPrimitive<T> =
  T extends 'number' ? number :
  T extends 'string' ? string :
  never;

// map the tuple of primitives to their actual types
type MapPrimitives<T extends readonly Primitive[]> = {
  [K in keyof T]: MapPrimitive<T[K]>;
};

type CommandCallback = (client: Client, args: string[]) => void;

class CommandsHandler {
  private _commands: Map<string, Array<CommandCallback>>;

  constructor() {
    this._commands = new Map<string, CommandCallback[]>();
  }

  add<
    T extends readonly Primitive[]
  >(code: string, types: T, callback: (client: Client, ...args: MapPrimitives<T>) => void) {
    let prev = this._commands.get(code);
    if (prev === undefined) {
      prev = [];
    }

    prev.push((client: Client, args: string[]) => {
      let valid = true;
      const parsedArgs: unknown[] = [];
    
      types.forEach((type, i) => {
        const arg = args[i];
        if (type === 'number') {
          const num = Number(arg);
          if (isNaN(num)) {
            valid = false;
            return;
          }
          parsedArgs.push(num);
        } else if (type === 'string') {
          if (arg === undefined) {
            valid = false;
            return;
          }
          parsedArgs.push(arg);
        } else {
          valid = false;
        }
      });
    
      if (valid) {
        callback(client, ...parsedArgs as MapPrimitives<T>);
      }
    });


    this._commands.set(code, prev);
  }

  getCommandsHandler() {
    const commands = this._commands;
    return (client: Client, id: string, message: string) => {
      const commandMatch = message.match(/^\!(\w+)(.*)/);
      if (commandMatch !== null) {
        const keyword = commandMatch[1];
        const callbacks = commands.get(keyword);
        if (callbacks !== undefined) {
          const args = commandMatch[2].split(/\s+/).slice(1);
          console.log(args);
          callbacks.forEach(callback => callback(client, args));
        } else {
          console.log(`Attempted to use command ${keyword}, but it doesn't exist`);
        }
      }
    }
  }
}

const commands = new CommandsHandler();

commands.add('ai', ['string'], (client, action) => {
  if (action === 'all') {
    const allItems = ITEMS.rows;
    client.addItems(allItems.map((item) => item.id));
    client.update();
  }
});

commands.add('ai', ['number'], (client, id) => {
  client.buyItem(id);
  client.update();
});

commands.add('ac', ['number'], (client, coins) => {
  client.penguin.addCoins(coins);
  if (client.isEngine1) {
    client.sendEngine1Coins();
  } else {
    client.sendPenguinInfo();
  }
  client.update();
});

commands.add('jr', ['number'], (client, id) => {
  client.joinRoom(id);
});

commands.add('jr', ['string'], (client, name) => {
  if (name in ROOMS) {
    const info = ROOMS[name as RoomName];
    client.joinRoom(info.id);
  }
});

commands.add('systemdefender', [], (client) => {
  client.joinRoom(950);
});

commands.add('pufflelaunch', [], (client) => {
  client.joinRoom(955);
});

commands.add('plunlocklevels', [], (client) => {
  client.unlockPuffleLaunchLevels();
});

commands.add('plunlocktimeattack', [], (client) => {
  client.unlockPuffleLaunchTimeAttack();
});

commands.add('plunlockturbo', [], (client) => {
  client.unlockTurboMode();
});

commands.add('plunlockslowmode', [], (client) => {
  client.unlockSlowMode();
});

commands.add('epf', [], (client) => {
  client.joinRoom(Room.VRRoom);
});

commands.add('awards', [], (client) => {
  // grant m7-m11 awards for speedrunning
  const awards = [815, 817, 819, 822, 8007];
  awards.forEach((award) => {
    client.buyItem(award);
  });
  client.update();
});

commands.add('age', ['number'], (client, age) => {
  client.penguin.setAge(age);
  client.sendPenguinInfo();
  client.update();
});

commands.add('rename', ['string'], (client, name) => {
  client.penguin.changeName(name);
  client.sendPenguinInfo();
  client.update();
});

commands.add('member', [], (client) => {
  client.penguin.swapMember();
  client.sendPenguinInfo();
  client.update();
});

function addFurniture(client: Client, id: number, amount: number): void {
  const ownedAmount = client.penguin.getFurnitureOwnedAmount(id);
  const addAmount = Math.max(Math.min(amount, 99 - ownedAmount), 0);
  client.penguin.addFurniture(id, addAmount);
  client.update();
  for (let i = 0; i < addAmount; i++) {
    client.sendXt('af', id, client.penguin.coins);
  }
  client.update();
}

commands.add('af', ['number', 'number'], addFurniture);

commands.add('af', ['number'], (client, id) => addFurniture(client, id, 1));

commands.add('powercards', [], (client) => {
  CARDS.rows.forEach(row => {
    if (row.powerId > 0) {
      client.penguin.addCard(row.id, 1);
    }
  });
  client.update();
});

export const commandsHandler = commands.getCommandsHandler();

handler.xt('m#sm', commandsHandler);

handler.xt('m#sm', (client, id, message) => {
  client.sendMessage(message);
});

export default handler;