import { BotGroup, Client } from "../../../server/client";
import { getHandlerCallback, Handler } from "..";
import { ITEMS } from "../../game-logic/items";
import { Room } from "../../game-logic/rooms";
import { CARDS } from "../../../server/game-logic/cards";
import { RoomName, ROOMS } from "../../../server/game-data/rooms";
import { randomInt, Vector } from "../../../common/utils";
import { ArgumentsIndicator, GetArgumentsType } from "../handles";
import { logdebug } from "../../../server/logger";

const handler = new Handler();

type CommandCallback = (client: Client, ...args: string[]) => void;

class CommandsHandler {
  private _commands: Map<string, Array<CommandCallback>>;

  constructor() {
    this._commands = new Map<string, CommandCallback[]>();
  }

  add<
    T extends ArgumentsIndicator
  >(code: string, types: T, callback: (client: Client, ...args: GetArgumentsType<T>) => void) {
    let prev = this._commands.get(code);
    if (prev === undefined) {
      prev = [];
    }

    prev.push(getHandlerCallback(types, callback));

    this._commands.set(code, prev);
  }

  getCommandsHandler() {
    const commands = this._commands;
    return (client: Client, message: string) => {
      const commandMatch = message.match(/^(\w+)(.*)/);
      if (commandMatch !== null) {
        const keyword = commandMatch[1];
        const callbacks = commands.get(keyword);
        if (callbacks !== undefined) {
          const args = commandMatch[2].split(/\s+/).slice(1);
          callbacks.forEach(callback => callback(client, ...args));
        } else {
          logdebug(`Attempted to use command ${keyword}, but it doesn't exist`);
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
  client.buyItem(id, { free: true });
  client.update();
});

commands.add('ac', ['number'], (client, coins) => {
  client.penguin.addCoins(coins, false);
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

commands.add('age', [], (client) => {
  client.penguin.setVirtualRegistration(client.server.getVirtualDate(0).getTime());
  client.sendPenguinInfo();
  client.update();
});

commands.add('rename', 'string', (client, ...names) => {
  const name = names.join(' ');
  client.penguin.changeName(name);
  client.sendPenguinInfo();
  client.update();
});

commands.add('member', [], (client) => {
  client.penguin.swapMember();
  client.sendPenguinInfo();
  client.update();
});

function addCardJitsuWin(client: Client, amount: number) {
  for (let i = 0; i < amount; i++) {
    client.gainNinjaProgress(true);
  }
}

commands.add('cjwin', [], (client) => {
  addCardJitsuWin(client, 1);
});

commands.add('cjwin', ['number'], (client, amount) => {
  addCardJitsuWin(client, amount);
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

/** A given action for a bot group */
type BotAction = {
  action: 'spawn';
  name: string;
  room?: number;
  pos?: [number, number];
  items?: number[];
  frame?: number;
} | {
  action: 'say';
  message: string;
  target?: string;
} | {
  action: 'spawn-increment-group';
  base: string;
  amount: number;
  room?: number;
} | {
  action: 'draw-rectangle';
  x?: number;
  y?: number;
  width: number;
  xSpace: number;
  ySpace: number;
} | {
  action: 'wear';
  item: number;
  target?: string;
} | {
  action: 'dance';
  target?: string;
} | {
  action: 'walk';
  x: number;
  y: number;
  target: string;
} | {
  action: 'command';
  name: string;
} | {
  action: 'follow';
};

/** Manages all accessible commands for bots */
class BotCommands {
  private _commands: Map<string, BotAction[]>

  constructor() {
    this._commands = new Map<string, BotAction[]>();
  }

  /** Add a command and its actions */
  add(command: string, actions: BotAction[]): void {
    this._commands.set(command, actions);
  }

  runCommand(client: Client, command: string, recursion: boolean = false): BotGroup {
    const actions = this._commands.get(command);
    const group = new BotGroup(client.server);
    if (actions !== undefined) {
      actions.forEach(action => {
        switch (action.action) {
          case 'spawn':
            group.spawnBot(action.name, action.room);
            if (action.pos !== undefined) {
              group.goTo(...action.pos, action.name);
            }
            if (action.items !== undefined) {
              action.items.forEach(item => group.wear(item, action.name));
            }
            if (action.frame !== undefined) {
              group.setFrame(action.frame, action.name);
            }
            break;
          case 'spawn-increment-group':
            group.spawnNumberedGroup(action.base, action.amount, action.room);
            break;
          case 'dance':
            group.dance(action.target);
            break;
          case 'draw-rectangle':
            group.makeRectangle(action.width, action.xSpace, action.ySpace, action.x, action.y);
            break;
          case 'say':
            group.say(action.message);
            break;
          case 'wear':
            group.wear(action.item, action.target);
            break;
          case 'walk':
            group.goTo(action.x, action.y, action.target);
            break;
          case 'command':
            if (!recursion) {
              group.merge(this.runCommand(client, action.name, true));
            }
            break;
        }
      })
    }
    return group;
  }

  getCommandHandler() {
    const handler = this;
    return (client: Client, id: string, message: string) => {
      const commandMatch = message.match(/!b(\w+)/);
      if (commandMatch !== null) {
        const command = commandMatch[2];
        const group = handler.runCommand(client, command);

        group.bots.forEach(bot => {
          bot.room.botGroup.addBot(bot);
        })
      }
    }
  }
}

commands.add('bcolor', ['string'], (client, color) => {
  let colorId = {
    color: 1,
    green: 2,
    pink: 3,
    black: 4,
    red: 5,
    orange: 6,
    yellow: 7,
    darkpurple: 8,
    brown: 9,
    peach: 10,
    darkgreen: 11,
    lightblue: 12,
    limegreen: 13,
    gray: 14,
    aqua: 15,
    white: 16,
    lavender: 17
  }[color];

  if (colorId !== undefined) {
    client.botGroup.wear(colorId);
  }
});

commands.add('follow', [], (client) => {
  const shape: Vector[] = [];
  for (let i = 0; i < client.botGroup.bots.length; i++) {
    shape.push(new Vector(randomInt(-50, 50), randomInt(-50, 50)));
  }
  client.botGroup.follow(client, shape);
});

const botCommands = new BotCommands();

botCommands.add('bergtip', [
  {
    action: 'spawn-increment-group',
    base: 'miner',
    amount: 30,
    room: 805
  },
  {
    action: 'draw-rectangle',
    x: 141,
    y: 220,
    width: 5,
    xSpace: 40,
    ySpace: 20
  },
  {
    action: 'wear',
    item: 403
  },
  {
    action: 'dance'
  }
]);

botCommands.add('band', [
  {
    action: 'spawn',
    name: 'BandDrummer',
    room: 410,
    pos: [87, 225],
    items: [340]
  },
  {
    action: 'spawn',
    name: 'BandGuitar',
    room: 410,
    pos: [172, 272],
    items: [233]
  },
  {
    action: 'spawn',
    name: 'BandAcoustic',
    room: 410,
    pos: [137, 305],
    items: [234]
  },
  {
    action: 'spawn',
    name: 'BandBass',
    room: 410,
    pos: [71, 313],
    items: [729]
  },
  {
    action: 'spawn',
    name: 'BandTuba',
    room: 410,
    pos: [64, 359],
    items: [293]
  },
  {
    action: 'spawn',
    name: 'BandTrumpet',
    room: 410,
    pos: [104, 336],
    items: [5014]
  },
  {
    action: 'dance'
  }
])

botCommands.add('dance', [
  {
    action: 'spawn-increment-group',
    base: 'dance',
    amount: 48,
    room: 120,
  },
  {
    action: 'draw-rectangle',
    x: 206,
    y: 273,
    xSpace: 32,
    ySpace: 30,
    width: 8
  },
  {
    action: 'dance'
  }
])

botCommands.add('stamps', [
  {
    action: 'command',
    name: 'dance'
  },
  {
    action: 'command',
    name: 'bergtip'
  },
  {
    action: 'command',
    name: 'band'
  }
]);

botCommands.add('epfmeeting', [
  {
    action: 'spawn',
    name: 'Agent1',
    pos: [280, 310],
    room: 323,
    frame: 17,
  },
  {
    action: 'spawn',
    name: 'Agent2',
    pos: [347, 310],
    room: 323,
    frame: 17,
  },
  {
    action: 'spawn',
    name: 'Agent3',
    pos: [414, 310],
    room: 323,
    frame: 17,
  },
  {
    action: 'spawn',
    name: 'Agent4',
    pos: [483, 310],
    room: 323,
    frame: 17,
  },
  {
    action: 'spawn',
    name: 'Agent5',
    pos: [571, 348],
    room: 323,
    frame: 19
  },
  {
    action: 'spawn',
    name: 'Agent6',
    pos: [187, 348],
    room: 323,
    frame: 23
  },
  {
    action: 'spawn',
    name: 'Agent7',
    pos: [535, 413],
    room: 323,
    frame: 21
  },
  {
    action: 'spawn',
    name: 'Agent8',
    pos: [434, 413],
    room: 323,
    frame: 21
  },
  {
    action: 'spawn',
    name: 'Agent9',
    pos: [329, 413],
    room: 323,
    frame: 21
  },
  {
    action: 'spawn',
    name: 'Agent10',
    pos: [230, 413],
    room: 323,
    frame: 21
  }
])

handler.addCommandsHandler(commands.getCommandsHandler());

export default handler;
