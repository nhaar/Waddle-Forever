import { ArgumentsIndicator, GetArgumentsType, parseArgs } from "@server/socket-server/arg-parser";
import { filterItems, handleGetFieldOps, joinRoom, sendLPMessage } from "@server/socket-server/handlers/join";
import { RoomName, ROOMS } from "@server/game-data/rooms";
import PuffleLaunchGameSet from "@server/game-logic/pufflelaunch";
import { CARDS } from "@server/game-logic/cards";
import { PenguinContext, RoomContext } from "@server/socket-server/handlers/handlers";
import { BotManager } from "@server/socket-server/world/bots";
import { clamp } from "@common/utils";

type CommandContext = (PenguinContext | RoomContext) & {
  bot: BotManager
};
type CommandHandler<T extends Array<string | number>> = (ctx: CommandContext, ...args: T) => string | void;

type CommandResponse = (ctx: CommandContext, args: Array<string>) => string | void;
type CommandsGenerator = Array<[
  string,
  Array<[ArgumentsIndicator, callback: (ctx: CommandContext, ...args: Array<string | number>) => string | void]>,
  CommandDisplayInfo
]>;

interface CommandDisplayInfo {
  argNames: Array<string>
  description: string
  examples: Array<string>
}

interface CommandDisplayInfoFull extends CommandDisplayInfo {
  name: string
}

const getCommands = (generators: CommandsGenerator): Array<[string, CommandResponse]> => {
  return generators.map(([name, responses]) => {
    const responder: CommandResponse = (ctx: CommandContext, commandArgs: Array<string>): string | void => {
      for (const [types, callback] of responses) {
        const parse = parseArgs(commandArgs, types);
        if (parse !== null) {
          return callback(ctx, ...parse);
        }
      }
      return 'Invalid arguments provided';
    }
      
    return [
      name,
      responder
    ]
  });
}

const handleAddItem: CommandHandler<[number]> = ({ msg, penguin, prst }, itemId) => {
  penguin.inventory.add(itemId);
  msg.send(penguin, 'ai', itemId, penguin.currency.coins);
  prst(penguin);
  return `Added item ${itemId} to penguin`;
}

const handleAddAllItems: CommandHandler<[string]> = ({ msg, penguin, prst, data }, action) => {
  if (action === 'all') {
    const allItems = data.getItems();
    allItems.forEach(item => penguin.inventory.add(item.id));

    msg.send(penguin, 'gi', ...filterItems(data, penguin.inventory.items));
    prst(penguin);
    return 'Added all items to penguin';
  }
  return "Must provide either an ID or 'all'";
}

const handleRemoveItem: CommandHandler<[number]> = ({ msg, penguin, prst, data }, itemId) => {
  penguin.inventory.delete(itemId);
  msg.send(penguin, 'gi', ...filterItems(data, penguin.inventory.items));
  prst(penguin);
  return `Removed item ${itemId} from penguin`;
}

const handleJoinRoomId: CommandHandler<[number]> = (ctx, id) => {
  joinRoom(ctx, id, 0, 0);
}

const handleJoinRoomName: CommandHandler<[string]> = (ctx, name) => {
  if (name in ROOMS) {
    const info = ROOMS[name as RoomName];
    joinRoom(ctx, info.id, 0, 0);
    return `Penguin is joining "${info.name}"`;
  }
  return 'Invalid room name';
}

const handleAddCoins: CommandHandler<[number]> = ({ msg, penguin, prst, data }, coins) => {
  const total = penguin.currency.add(coins);

  if (data.isPreCpip()) {
    msg.send(penguin, 'ac', total);
  } else {
    sendLPMessage(penguin, data, msg);
  }

  prst(penguin);
  return `Added ${coins} coins - total is now ${total}`;
}

const handleAgent: CommandHandler<[string]> = ({ msg, penguin, prst, data }, agency) => {
  if (agency !== 'psa' && agency !== 'epf') return 'Must choose either psa or epf';

  if (agency === 'psa') {
    penguin.inventory.add(800); // add spy phone
  } else {
    penguin.inventory.add(8009); // add epf phone
    msg.send(penguin, 'epfsa', 1);
  }
  msg.send(penguin, 'gi', ...filterItems(data, penguin.inventory.items));
  penguin.psa.setAgent();
  prst(penguin);
  return agency === 'psa' ? 'Penguin is now a PSA agent' : 'Penguin is now an EPF agent';
}

const handleRename: CommandHandler<string[]> = ({ penguin, msg, data, prst }, ...names) => {
  const name = names.join(' ');

  penguin.changeName(name);
  // TODO what about pre-cpip?
  sendLPMessage(penguin, data, msg);
  prst(penguin);
  return `Renamed penguin to ${name}`;
}

const handleAwards: CommandHandler<[]> = ({ msg, penguin, prst }) => {
  // grant m7-m11 awards for speedrunning
  const awards = [815, 817, 819, 822, 8007];
  awards.forEach((award) => {
    penguin.inventory.add(award);
    msg.send(penguin, 'ai', award, penguin.currency.coins);
  });
  prst(penguin);
  return 'Awards added';
}

const handleAge: CommandHandler<[]> = ({ msg, prst, penguin, data }) => {  
  penguin.time.setVirtualRegistrationToNow();
  sendLPMessage(penguin, data, msg);
  prst(penguin);
  return 'Updated penguin age';
}

const handleMember: CommandHandler<[]> = ({ penguin, prst, msg, data }) => {
  penguin.membership.swap();
  sendLPMessage(penguin, data, msg);
  prst(penguin);
  return penguin.membership.isMember ? 'Penguin is now a member' : 'Penguin is no longer a member';
}

const handleAddFurniture: CommandHandler<[number, number]> = ({ penguin, prst, msg }, id: number, amount: number) => {
  const ownedAmount = penguin.igloo.getFurnitureAmount(id);
  const addAmount = clamp(amount, 0, 99 - ownedAmount);
  penguin.igloo.addFurniture(id, addAmount);
  for (let i = 0; i < addAmount; i++) {
    msg.send(penguin, 'af', id, penguin.currency.coins);
  }

  prst(penguin);
  return `Added ${amount} units of furniture ID ${id}`;
}

const handleAddOneFurniture: CommandHandler<[number]> = (ctx, id) => handleAddFurniture(ctx, id, 1);

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

const handleUnlockPlLevels: CommandHandler<[]> = ({ penguin, prst }) => {
  penguin.puffleLaunch.set(new PuffleLaunchGameSet((new Array<number>(36)).fill(0x1), [], []).get());
  prst(penguin);
  return 'Unlocked all levels for this penguin';
}

const handleUnlockTimeAttack: CommandHandler<[]> = ({ penguin, prst }) => {
  penguin.puffleLaunch.set(getPuffleLaunchDataWithAlLBerries([], []).get());
  prst(penguin);
  return 'Unlocked time attack for this penguin';
}

const handleUnlockTurbo: CommandHandler<[]> = ({ penguin, prst }) => {
  penguin.puffleLaunch.set(getPuffleLaunchDataWithAlLBerries((new Array<number>(36)).fill(1), []).get());
  prst(penguin);
  return 'Unlocked turbo mode for this penguin';
}

const handleUnlockSlowMove: CommandHandler<[]> = ({ penguin, prst }) => {
  penguin.puffleLaunch.set(getPuffleLaunchDataWithAlLBerries((new Array<number>(36)).fill(1), (new Array<boolean>(36)).fill(true)).get());
  prst(penguin);
  return 'Unlocked slow mode for this penguin';
}

const handleAmulet: CommandHandler<[]> = ({ penguin, prst }) => {
  penguin.ninja.setWaterNinja(!penguin.ninja.isWaterNinja);
  prst(penguin);
  return penguin.ninja.isWaterNinja ? 'Penguin now has the water gem' : 'Penguin no longer has the water gem';
}

const handleSave: CommandHandler<[string]> = ({ penguin, prst }, which) => {
  if (which !== 'on' && which !== 'off') return "Must choose either 'on' or 'off'";
  if (which === 'on') {
    penguin.preference.enableSave();
  } else {
    penguin.preference.disableSave();
  }
  prst(penguin);
  return `Saving is now ${which === 'on' ? 'ENABLED' : 'DISABLED'}`;
}

const handleCjOneWin: CommandHandler<[]> = ({ penguin, prst }) => {
  penguin.ninja.addMatchProgress(true);
  prst(penguin);
  return 'Added 1 Card-Jitsu win';
}

const handleCjWins: CommandHandler<[number]> = ({ penguin, prst }, amount) => {
  for (let i = 0; i < amount; i++) {
    penguin.ninja.addMatchProgress(true);
  }
  prst(penguin);
  return `Added ${amount} Card-Jitsu wins`;
}

const handlePowercards: CommandHandler<[]> = ({ penguin, prst }) => {
  CARDS.rows.forEach(row => {
    if (row.powerId > 0) {
      penguin.ninja.addCard(row.id, 1);
    }
  });
  prst(penguin);
  return 'Added 1 of all powercards';
}

const handleAddCard: CommandHandler<[number, number]> = ({ penguin, prst }, card, amount) => {
  penguin.ninja.addCard(card, amount);
  prst(penguin);
  return `Added ${amount} of card ID ${card}`;
}

const handleSafechat: CommandHandler<[]> = ({ penguin, prst }) => {
  penguin.preference.setSafeChat(!penguin.preference.isSafeChat);
  prst(penguin);
  return `Safe chat is now ${penguin.preference.isSafeChat ? 'ENABLED' : 'DISABLED'}`;
}

const handleResetFieldOp: CommandHandler<[number]> = (ctx, id) => {
  ctx.penguin.epf.resetFieldOp(id);
  ctx.prst(ctx.penguin);
  handleGetFieldOps(ctx);
  return `Reset progress for Field-Op #${id}`;
}

const handleResetAllFieldOps: CommandHandler<[string]> = (ctx, all) => {
  if (all !== 'all') return "Must provide either an ID or 'all'";
  ctx.penguin.epf.resetAllFieldOps();
  ctx.prst(ctx.penguin);
  handleGetFieldOps(ctx);
  return `Reset all Field-Ops progress`;
}

export class CommandsHandler {
  private _listeners: Map<
    string,
    CommandResponse
  >;

  constructor(listeners: Array<[string, CommandResponse]>) {
    this._listeners = new Map(listeners);
  }

  public run(ctx: CommandContext, name: string, args: Array<string>): string | void {
    const callback = this._listeners.get(name);
    if (callback !== undefined) {
      return callback(ctx, args);
    }
    return "Invalid command";
  }
}

const c = <const T extends ArgumentsIndicator>(args: T, callback: (ctx: CommandContext, ...args: GetArgumentsType<T>) => string | void): [ArgumentsIndicator, callback: (ctx: CommandContext, ...args: Array<string | number>) => string | void] => {
  return [args, callback as (ctx: CommandContext, ...args: Array<string | number>) => void];
}

const handleBots: CommandHandler<[number]> = ({ bot }, amount) => {
  bot.setPopulation(amount);
  return `Setting bot population to ${amount}`;
}

const handleBotsAction: CommandHandler<[string]> = (ctx, action) => {
  const { bot } = ctx;
  if (action === 'here' && 'room' in ctx) {
    bot.addAt(ctx.room.id, 5);
    return `Spawning 5 bots at room ${ctx.room.id}`;
  } else if (action === 'off') {
    bot.setOff();
    return 'Bots are now OFF';
  } else if (action === 'games') {
    bot.configure({ playGames: true });
    return 'Bots can now play games';
  } else if (action === 'nogames') {
    bot.configure({ playGames: false });
    return 'Bots can no longer play games';
  }
  return 'Invalid action provided';
}

const generators: CommandsGenerator = [
  [
    'bots',
    [c(['number'], handleBots), c(['string'], handleBotsAction)],
    {
      argNames: ['amount/here/off/games/nogames'],
      description: "Populate the island with computer controlled penguins. 'bots [amount]' keeps [amount] of them wandering around, 'bots here' drops 5 in your current room, 'bots off' removes them all. They will also sit down for sled races, Card-Jitsu, Find Four and Mancala; 'bots nogames' stops that and 'bots games' turns it back on.",
      examples: ['bots 12', 'bots here', 'bots off', 'bots nogames']
    }
  ],
  [
    'ai',
    [c(['number'], handleAddItem), c(['string'], handleAddAllItems)],
    {
      argNames: ['id'],
      description: "Add a clothing item to your penguin. You can also do 'ai all' to add all clothing items in the game.",
      examples: ['ai 102', 'ai all']
    }
  ],
  [
    'ri',
    [c(['number'], handleRemoveItem)],
    {
      argNames: ['id'],
      description: "Remove a clothing item from your inventory.",
      examples: ['ri 413']
    }
  ],
  [
    'jr',
    [c(['number'], handleJoinRoomId), c(['string'], handleJoinRoomName)],
    {
      argNames: ['id/name'],
      description: "Join a room by its ID or name.",
      examples: ['jr 400', 'jr plaza']
    }
  ],
  [
    'ac',
    [c(['number'], handleAddCoins)],
    {
      argNames: ['amount'],
      description: "Add a given amount of coins to your penguin. You can also give a negative number to subtract coins.",
      examples: ['ac 1024', 'ac -329']
    }
  ],
  [
    'rename',
    [c('string', handleRename)],
    {
      argNames: ['name'],
      description: "Rename your penguin to something else.",
      examples: ['rename UnfunnyPenguin67']
    }
  ],
  [
    'awards',
    [c([], handleAwards)],
    {
      argNames: [],
      description: "For speedrunning purposes, adds the medals from PSA missions 7 through 11 to your penguin.",
      examples: []
    }
  ],
  [
    'age',
    [c([], handleAge)],
    {
      argNames: [],
      description: `Make your penguin's \"birthday\" be on the day you are currently in on the timeline.

      For example, if you run this command on January 15, 2009, and then jump to February 20, 2009, then your penguin will be 36 days old.
      `,
      examples: []
    }
  ],
  [
    'agent',
    [c(['string'], handleAgent)],
    {
      argNames: ['psa/epf'],
      description: "Makes your penguin either a PSA or EPF agent.",
      examples: ['agent psa', 'agent epf']
    }
  ],
  [
    'member',
    [c([], handleMember)],
    {
      argNames: [],
      description: "Swap the membership status of your penguin. If your penguin is currently a member, then it will turn into a non-member, and vice-versa.",
      examples: []
    }
  ],
  [
    'af',
    [c(['number', 'number'], handleAddFurniture), c(['number'], handleAddOneFurniture)],
    {
      argNames: ['id', 'quantity'],
      description: "Adds the given quantity (or just 1 if not provided) of the furniture item with the given ID to your penguin.",
      examples: ['af 33', 'af 2320 50']
    }
  ],
  [
    'plunlocklevels',
    [c([], handleUnlockPlLevels)],
    {
      argNames: [],
      description: "Unlocks all levels in Puffle Launch.",
      examples: []
    }
  ],
  [
    'plunlocktimeattack',
    [c([], handleUnlockTimeAttack)],
    {
      argNames: [],
      description: "Unlocks time attack mode in Puffle Launch.",
      examples: []
    }
  ],
  [
    'plunlockturbo',
    [c([], handleUnlockTurbo)],
    {
      argNames: [],
      description: "Unlocks turbo mode in Puffle Launch.",
      examples: []
    }
  ],
  [
    'plunlockslowmode',
    [c([], handleUnlockSlowMove)],
    {
      argNames: [],
      description: "Unlocks slow mode in Puffle Launch.",
      examples: []
    }
  ],
  [
    'save',
    [c(['string'], handleSave)],
    {
      argNames: ['on/off'],
      description: "When set to 'off', the penguin's current state will be saved, and any changes made to the penguin afterward will not be saved, meaning relogging will go back to the initial state.\n\nSetting it to 'on' undoes this effect.",
      examples: []
    }
  ],
  [
    'waterninja',
    [c([], handleAmulet)],
    {
      argNames: [],
      description: "Adds the water gem to your Card-Jitsu amulet (or removes it). Note that this command will be removed when Card-Jitsu Water is implemented.",
      examples: []
    }
  ],
  [
    'cjwin',
    [c([], handleCjOneWin), c(['number'], handleCjWins)],
    {
      argNames: ['wins'],
      description: "Adds a given number of wins (or just 1 if not provided) to your Card-Jitsu progress.",
      examples: ['cjwin', 'cjwin 20']
    }
  ],
  [
    'powercards',
    [c([], handlePowercards)],
    {
      argNames: [],
      description: "Adds 1 of each of all the Card-Jitsu powercards to your penguin.",
      examples: []
    }
  ],
  [
    'addcard',
    [c(['number', 'number'], handleAddCard)],
    {
      argNames: ['id', 'amount'],
      description: "Adds the given amount (or just 1 if not provided) of Card-Jitsu cards with the given card ID.",
      examples: ['addcard 76', 'addcard 345 10']
    }
  ],
  [
    'safechat',
    [c([], handleSafechat)],
    {
      argNames: [],
      description: "Toggles safe-chat mode for your penguin.",
      examples: []
    }
  ],
  [
    'resetfieldop',
    [c(['number'], handleResetFieldOp), c(['string'], handleResetAllFieldOps)],
    {
      argNames: ['id/all'],
      description: "Resets the progress of the given Field-Op #, allowing you to replay that Field-Op if it's already been completed. You can also do 'all' to reset progress for all Field-Ops.",
      examples: ['resetfieldop 21', 'resetfieldop all']
    }
  ]
];

export function getCommandsList(): Array<CommandDisplayInfoFull> {
  return generators.map(([name, _, displayInfo]) => {
    return { name, ...displayInfo }
  });
}

export const getCommandsHandler = (): CommandsHandler => {
  return new CommandsHandler(getCommands(generators));
}