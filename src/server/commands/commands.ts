import { ArgumentsIndicator, GetArgumentsType, parseArgs } from "@server/handlers/arg-parser";
import { ITEMS } from "@server/game-logic/items";
import { filterItems, joinRoom, sendLPMessage } from "@server/handlers/play/join";
import { RoomName, ROOMS } from "@server/game-data/rooms";
import PuffleLaunchGameSet from "@server/game-logic/pufflelaunch";
import { CARDS } from "@server/game-logic/cards";
import { PenguinContext, RoomContext } from "@server/handlers/handlers";

type CommandContext = PenguinContext | RoomContext;
type CommandHandler<T extends Array<string | number>> = (ctx: CommandContext, ...args: T) => void;

type CommandResponse = (ctx: CommandContext, args: Array<string>) => void;
type CommandsGenerator = Array<[string, Array<[ArgumentsIndicator, callback: (ctx: CommandContext, ...args: Array<string | number>) => void]>]>;

const getCommands = (generators: CommandsGenerator): Array<[string, CommandResponse]> => {
  return generators.map(([name, responses]) => {
    const responder: CommandResponse = (ctx: CommandContext, commandArgs: Array<string>): void => {
      for (const [types, callback] of responses) {
        const parse = parseArgs(commandArgs, types);
        if (parse !== null) {
          callback(ctx, ...parse);
          break;
        }
      }
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
}

const handleAddAllItems: CommandHandler<[string]> = ({ msg, penguin, prst, data }, action) => {
  if (action === 'all') {
    const allItems = ITEMS.rows;
    allItems.forEach(item => penguin.inventory.add(item.id));

    msg.send(penguin, 'gi', ...filterItems(data, penguin.inventory.items));
    prst(penguin);
  }
}

const handleJoinRoomId: CommandHandler<[number]> = (ctx, id) => {
  joinRoom(ctx, id, 0, 0);
}

const handleJoinRoomName: CommandHandler<[string]> = (ctx, name) => {
  if (name in ROOMS) {
    const info = ROOMS[name as RoomName];
    joinRoom(ctx, info.id, 0, 0);
  }
}

const handleAddCoins: CommandHandler<[number]> = ({ msg, penguin, prst, data }, coins) => {
  console.log(typeof coins, 'eis os coins');
  const total = penguin.currency.add(coins);

  if (data.isPreCpip()) {
    msg.send(penguin, 'ac', total);
  } else {
    sendLPMessage(penguin, data, msg);
  }

  prst(penguin);
}

const handleRename: CommandHandler<string[]> = ({ penguin, msg, data, prst }, ...names) => {
  const name = names.join(' ');

  penguin.changeName(name);
  // TODO what about pre-cpip?
  sendLPMessage(penguin, data, msg);
  prst(penguin);
}

const handleAwards: CommandHandler<[]> = ({ msg, penguin, prst }) => {
  // grant m7-m11 awards for speedrunning
  const awards = [815, 817, 819, 822, 8007];
  awards.forEach((award) => {
    penguin.inventory.add(award);
    msg.send(penguin, 'ai', award, penguin.currency.coins);
  });
  prst(penguin);
}

const handleAge: CommandHandler<[]> = ({ msg, prst, penguin, data }) => {  
  penguin.time.setVirtualRegistrationToNow();
  sendLPMessage(penguin, data, msg);
  prst(penguin);
}

const handleMember: CommandHandler<[]> = ({ penguin, prst, msg, data }) => {
  penguin.membership.swap();
  sendLPMessage(penguin, data, msg);
  prst(penguin);
}

const handleAddFurniture: CommandHandler<[number, number]> = ({ penguin, prst, msg }, id: number, amount: number): void => {
  const ownedAmount = penguin.igloo.getFurnitureAmount(id);
  const addAmount = Math.max(Math.min(amount, 99 - ownedAmount), 0);
  penguin.igloo.addFurniture(id, addAmount);
  for (let i = 0; i < addAmount; i++) {
    msg.send(penguin, 'af', id, penguin.currency.coins);
  }

  prst(penguin);
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
}

const handleUnlockTimeAttack: CommandHandler<[]> = ({ penguin, prst }) => {
  penguin.puffleLaunch.set(getPuffleLaunchDataWithAlLBerries([], []).get());
  prst(penguin);
}

const handleUnlockTurbo: CommandHandler<[]> = ({ penguin, prst }) => {
  penguin.puffleLaunch.set(getPuffleLaunchDataWithAlLBerries((new Array<number>(36)).fill(1), []).get());
  prst(penguin);
}

const handleUnlockSlowMove: CommandHandler<[]> = ({ penguin, prst }) => {
  penguin.puffleLaunch.set(getPuffleLaunchDataWithAlLBerries((new Array<number>(36)).fill(1), (new Array<boolean>(36)).fill(true)).get());
  prst(penguin);
}

const handleNoSave: CommandHandler<[]> = ({ penguin, prst }) => {
  penguin.preference.disableSave();
  prst(penguin, true);
}

const handleEnableSave: CommandHandler<[]> = ({ penguin, prst }) => {
  penguin.preference.enableSave();
  prst(penguin);
}

const handleAmulet: CommandHandler<[string]> = ({ penguin, prst }, element) => {
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
}

const handleCjOneWin: CommandHandler<[]> = ({ penguin, prst }) => {
  penguin.ninja.addMatchProgress(true);
  prst(penguin);
}

const handleCjWins: CommandHandler<[number]> = ({ penguin, prst }, amount) => {
  for (let i = 0; i < amount; i++) {
    penguin.ninja.addMatchProgress(true);
  }
  prst(penguin);
}

const handlePowercards: CommandHandler<[]> = ({ penguin, prst }) => {
  CARDS.rows.forEach(row => {
    if (row.powerId > 0) {
      penguin.ninja.addCard(row.id, 1);
    }
  });
  prst(penguin);
}

const handleAddCard: CommandHandler<[number, number]> = ({ penguin, prst }, card, amount) => {
  penguin.ninja.addCard(card, amount);
  prst(penguin);
}

const handleSafechat: CommandHandler<[]> = ({ penguin, prst }) => {
  penguin.preference.setSafeChat(!penguin.preference.isSafeChat);
  prst(penguin);
}

export class CommandsHandler {
  private _listeners: Map<
    string,
    CommandResponse
  >;

  constructor(listeners: Array<[string, CommandResponse]>) {
    this._listeners = new Map(listeners);
  }

  public run(ctx: CommandContext, name: string, args: Array<string>) {
    const callback = this._listeners.get(name);
    if (callback !== undefined) {
      callback(ctx, args);
    }
  }
}

const c = <const T extends ArgumentsIndicator>(args: T, callback: (ctx: CommandContext, ...args: GetArgumentsType<T>) => void): [ArgumentsIndicator, callback: (ctx: CommandContext, ...args: Array<string | number>) => void] => {
  return [args, callback as (ctx: CommandContext, ...args: Array<string | number>) => void];
}

export const getCommandsHandler = (): CommandsHandler => {
  const generators: CommandsGenerator = [
    ['ai', [c(['number'], handleAddItem), c(['string'], handleAddAllItems)]],
    ['jr', [c(['number'], handleJoinRoomId), c(['string'], handleJoinRoomName)]],
    ['ac', [c(['number'], handleAddCoins)]],
    ['rename', [c('string', handleRename)]],
    ['awards', [c([], handleAwards)]],
    ['age', [c([], handleAge)]],
    ['member', [c([], handleMember)]],
    ['af', [c(['number', 'number'], handleAddFurniture), c(['number'], handleAddOneFurniture)]],
    ['plunlocklevels', [c([], handleUnlockPlLevels)]],
    ['plunlocktimeattack', [c([], handleUnlockTimeAttack)]],
    ['plunlockturbo', [c([], handleUnlockTurbo)]],
    ['plunlockslowmode', [c([], handleUnlockSlowMove)]],
    ['nosave', [c([], handleNoSave)]],
    ['enablesave', [c([], handleEnableSave)]],
    ['amulet', [c(['string'], handleAmulet)]],
    ['cjwin', [c([], handleCjOneWin), c(['number'], handleCjWins)]],
    ['powercards', [c([], handlePowercards)]],
    ['addcard', [c(['number', 'number'], handleAddCard)]],
    ['safechat', [c([], handleSafechat)]]
  ];

  return new CommandsHandler(getCommands(generators));
}