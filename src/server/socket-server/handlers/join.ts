import { PenguinRepository } from '@server/database/database';
import { isGameRoom, Room } from '@server/game-logic/rooms';
import { World } from '@server/socket-server/world/world';
import { WorldPenguin } from '@server/socket-server/world/world-penguin';
import { WorldRoom } from '@server/socket-server/world/world-room';
import { GameData } from '@server/timelines/game-data';
import { PenguinMessenger } from '../../socket-server/messenger';
import { getClientPuffleIds, getPuffleWalkArguments } from './puffle';
import { getFurnitureString, getIglooFromId } from './igloo';
import { WorldTable } from '@server/socket-server/world/world-table';
import { getOfflinePenguinCrumb } from '@server/http/php-server';
import { ItemType } from '@server/game-logic/items';
import { isFlag } from '@server/game-logic/flags';
import { STARTER_DECKS } from '@server/game-logic/starter-deck';
import { CARDS } from '@server/game-logic/cards';
import { choose } from '@common/utils';
import { SPY_DRILLS_DATA } from '@server/game-logic/spy-drills';
import { PenguinHandler, PenguinGuard, RoomHandler, WorldContext } from './handlers';
import { handleLeaveFire } from './fire';


function unequipPuffle(p: WorldPenguin): void {
  const hand = p.inventory.hand
  if (hand >= 750 && hand <= 759) {
    p.inventory.updateWear({ hand: 0 });
  }
}

function isEPFAgent(p: WorldPenguin): boolean {
  return p.inventory.has(8009);
}

function isPSAAgent(p: WorldPenguin): boolean {
  return p.inventory.has(800);
}

const isNewBuddyProtocol = (data: GameData): boolean => {
  return !data.isPreCpip() || data.getChatVersion() >= 506;
}

export async function formatBuddyEntry(id: number, world: World, db: PenguinRepository, includeOnlineFlag: boolean) {
  const name = world.getById(id)?.name ?? (await db.get(id))?.name ?? 'Unknown';

  if (!includeOnlineFlag) {
    return `${id}|${name}`;
  }

  const online = world.getById(id) !== undefined;
  return online ? `${id}|${name}|1` : `${id}|${name}`;
}

function sendGetOnlineBuddies(msg: PenguinMessenger, p: WorldPenguin, world: World) {
  const onlineIds = p.buddy.buddies.filter(id => world.getById(id) !== undefined).map(i => String(i));
  msg.send(p, 'go', ...onlineIds);
}

const getOnlineBuddies = (world: World, penguin: WorldPenguin): WorldPenguin[] => {
  return penguin.buddy.buddies.map(i => world.getById(i)).filter((i: WorldPenguin | undefined): i is WorldPenguin => i !== undefined);
}

const handleSendBuddyOnline: PenguinHandler<[]> = ({ world, msg, penguin }) => {
  msg.send(getOnlineBuddies(world, penguin), 'bon', penguin.id);
}

export function getPenguinString(data: GameData, p: WorldPenguin, state: { x: number; y: number; frame: number; }): string {
  const approvedFlag = data.isNewShell2009() ? [1] : [];

  return [
    p.id,
    p.name,
    ...approvedFlag,
    p.inventory.color,
    p.inventory.head,
    p.inventory.face,
    p.inventory.neck,
    p.inventory.body,
    p.inventory.hand,
    p.inventory.feet,
    p.inventory.pin,
    p.inventory.background,
    state.x,
    state.y,
    state.frame,
    p.membership.isMember ? 1 : 0,
    
    ...(data.isPreCpip() ? [] : [p.time.age, // todo member age
    p.avatar.id,
    0, // TODO document these 0s and empty strings
    0,
    0,
    '',
    '',
    '',
    ''])
  ].join('|');
}

const enterRoom: PenguinHandler<[WorldRoom, number, number]> = (ctx, r, x, y) => {
  const { penguin, msg, data, world } = ctx;
  const previousPlayers = r.players;
  r.addPenguin(penguin, x, y);
  world.enterState(penguin, { room: r });
  msg.send(penguin, 'jr', r.id, ...r.playerStates.map(([p, s]) => getPenguinString(data, p, s)));
  msg.send(r.players, 'ap', getPenguinString(data, penguin, { x, y, frame: 1 }));


  // modern versions don't have the puffle information on penguin so the packet is resent
  if (!data.puffleHandItems()) {
    const replayWalkingPuffle = (player: WorldPenguin, recipients: WorldPenguin | WorldPenguin[]) => {
      const walkingPuffleId = player.puffle.walking;
      if (walkingPuffleId === null) {
        return;
      }
  
      const args = getPuffleWalkArguments(data, player, walkingPuffleId, 1);
      if (args !== undefined) {
        msg.send(recipients, 'pw', ...args);
      }
    };
  
    previousPlayers.forEach((player) => replayWalkingPuffle(player, penguin));
    replayWalkingPuffle(penguin, previousPlayers);
  }
}

export function filterItems(data: GameData, items: number[]): number[] {
  if (data.isPreCpip()) {
    const clientItems = data.getClientItems();
    return items.filter(i => clientItems.has(i));
  }

  return items;
}

function sendCoinsForChange(data: GameData, msg: PenguinMessenger, penguin: WorldPenguin) {
  const donations = data.getCoinsForChangeDonations();
  if (donations !== null) {
    // placeholder donation values
    msg.send(penguin, 'gcfct', donations.map((amount, i) => `${i}|${amount}`).join(','));
  }
}

export function sendLPMessage(penguin: WorldPenguin, data: GameData, msg: PenguinMessenger) {
  msg.send(
    penguin,
    'lp',
    getPenguinString(data, penguin, { x: 0, y: 0, frame: 1}),
    penguin.currency.coins,
    penguin.preference.isSafeChat ? 1 : 0,
    1440,
    penguin.time.getDate(),
    penguin.time.age,
    0,
    penguin.time.minutesPlayed,
    -1, 7, 1, 4, 3
  );
}

export const sendStamps: PenguinHandler<[]> = async ({ msg, penguin }) => {
  await msg.send(penguin, 'gps', penguin.id, penguin.stampbook.stamps.join('|'));
}

export const handleJoinServer: PenguinHandler<[]> = async (ctx) => {
  const { world, penguin, data, msg } = ctx;
  // penguins don't keep the puffle from previous session
  unequipPuffle(penguin);
  /*
  TODO: find what second number is
  Figure out how moderators will be handled
  Figure out what moderator_status is used for
  Add last number (something to do with stamp book)
  */
  // initializing penguin data
  msg.send(
    penguin,
    'js',
    // TODO date reference for EPF
    (data.isPreCpip() ? isPSAAgent(penguin) : isEPFAgent(penguin)) ? 1 : 0,
    // moderator status
    ...(data.isPreCpip() ? [] : [penguin.mascot > 0 ? 3 : 0])
  );

  if (isNewBuddyProtocol(data)) {
    sendGetBuddies(ctx);
    sendBuddyOnlineList(ctx);
  }

  sendGetOnlineBuddies(msg, penguin, world);
  if (data.isPreCpip()) {
    getOnlineBuddies(world, penguin).forEach(buddy => sendGetOnlineBuddies(msg, buddy, world));
  } else {
    handleSendBuddyOnline(ctx);
  }

  if (data.isVanillaEngine()) {
    msg.send(penguin, 'activefeatures', data.getActiveFeatures() ?? '');
  }

  if (!data.isPreCpip()) {
    sendLPMessage(penguin, data, msg);
    // receiving inventory
    // TODO proper inventory
    // send stamps must be before join room
    // for the 365 days stamp to work
    await sendStamps(ctx);

    const puffles = data.isVanillaEngine() ? penguin.puffle.puffles.map((puffle) => [
    puffle.id,
    ...getClientPuffleIds(puffle.type),
    puffle.name,
    10, // TODO, adoption date
    puffle.food,
    100, // TODO puffle play stat
    puffle.rest,
    puffle.clean,
    0, // TODO puffle hat
    0 // TODO unknown what this last one is
  ].join('|')) : penguin.puffle.puffles.map((puffle) => {
    return [puffle.id, puffle.name, puffle.type, puffle.clean, puffle.food, puffle.rest, 100, 100, 100].join('|')
  });
  
    msg.send(penguin, 'pgu', ...puffles);

    if (data.isVanillaEngine()) {
      msg.send(penguin, 'nxquestsettings', '{"ver":1,"spawnRoomId":800,"quests":[{"id":1,"name":"shopping","awards":[{"id":24023,"type":"penguinItem","n":1}],"tasks":[{"type":"room","description":"Visit the Clothes Shop","data":130}]},{"id":3,"name":"igloo","awards":[{"id":2166,"type":"furnitureItem","n":1}],"tasks":[{"type":"","description":"Visit your Igloo","data":null}]},{"id":2,"name":"puffle","awards":[{"id":70,"type":"puffleItem","n":1}],"tasks":[{"type":"room","description":"Visit the Pet Shop","data":310}]}]}');
      msg.send(penguin, 'nxquestdata', '{"quests":[{"id":1,"status":"prize claimed","tasks":[true]},{"id":3,"status":"prize claimed","tasks":[true]},{"id":2,"status":"prize claimed","tasks":[true]}]}');
    }

    // TODO: this would periodically send to each player but right now this isn't fully implemented
    sendCoinsForChange(data, msg, penguin);
  }

  // joining spawn room // TODO more spawn rooms in the future?
  enterRoom(ctx, world.getRoom(Room.Town), 0, 0);
}

export const leaveRoom: RoomHandler<[]> = async (ctx) => {
  const { room, penguin, msg, data } = ctx;
  room.removePenguin(penguin);
  await msg.send(room.players, 'rp', penguin.id, ...room.playerStates.map(([p, s]) => getPenguinString(data, p, s)));
}

export const joinRoom: PenguinHandler<[number, number, number]> = (ctx, id: number, x: number, y: number) => {
  const { world, penguin, msg, data } = ctx;
  if ('room' in ctx) {
    leaveRoom(ctx);
  } else if ('game' in ctx) {
    ctx.game.matchMaker?.removePlayer(penguin);
  } else if ('sled' in ctx) {
    ctx.sled.removePlayer(penguin);
  }

  if (isGameRoom(id)) {
    const game = world.getGame(id);
    world.enterState(penguin, { game });
    msg.send(penguin, 'jg', id);
  } else {
    const newRoom = world.getRoom(id);
    world.enterState(penguin, { room: newRoom });
    enterRoom(ctx, newRoom, x, y);
  }
}

export const handleGetItems: PenguinHandler<[]> = ({ penguin, msg, data }) => {
  msg.send(penguin, 'gi', ...filterItems(data, penguin.inventory.items));
}

const addStarterDeck: PenguinHandler<[number[]]> = ({ prst, penguin }, cards) => {
  const cardInfo = cards.map(id => CARDS.getStrict(id));
  const powerCards = cardInfo.filter(c => c.powerId > 0);
  const normalCards = cardInfo.filter(c => c.powerId === 0);

  normalCards.forEach(card => penguin.ninja.addCard(card.id, 1));
  penguin.ninja.addCard(choose(powerCards).id, 1);
  prst(penguin);
}

export const handleAddItem: PenguinHandler<[number]> = (ctx, item) => {
  const { penguin, msg, data, prst } = ctx;
  const deck = STARTER_DECKS[item];
  if (deck !== undefined) {
    addStarterDeck(ctx, deck);
  }
  
  const info = data.getItem(item);
  penguin.inventory.add(item);
  msg.send(penguin, 'ai', item, penguin.currency.discount(info.cost));
  prst(penguin);
}

export const handleJoinPlayerOld: PenguinHandler<[number, number]> = async (ctx, ownerId, isMember) => {
  const { world, db, data, msg, penguin } = ctx;
  const igloo = await getIglooFromId(world, db, ownerId);
  if (igloo === undefined) {
    return;
  }

  const args: Array<string | number> = [ownerId, igloo.type];

  // when igloo music was added, the music parameter is optional
  if (data.hasIglooMusicReleased()) {
    args.push(igloo.music);
  }

  // client misteriously removes the first element of the furniture
  msg.send(penguin, 'jp', ...args, ',' + getFurnitureString(igloo.furniture));
  const roomId = 2000 + ownerId;
  joinRoom(ctx, roomId, 0, 0);
}

export const handleJoinPlayerCpip: PenguinHandler<[number]> = (ctx, fakeId) => {
  const { world } = ctx;
  // for some reason the ID given is the player + 1000
  // in WF igloo room IDs are playerID + 2000
  const iglooId = fakeId + 1000;
  const igloo = world.getRoom(iglooId);
  enterRoom(ctx, igloo, 0, 0);
}

export const handleJoinPlayerModern: PenguinHandler<[number, string]> = (ctx, playerId, roomType) => {
  const { msg, penguin, data, world } = ctx;
  // 1000 = backyard
  const roomId = roomType === 'igloo' ? playerId + 2000 : 1000;
  msg.send(penguin, 'jp', roomId, roomId, roomType);
  // TODO: backyard should only be player itself?
  enterRoom(ctx, world.getRoom(roomId), 0, 0);
}

export const isPreBackyardGuard: PenguinGuard = (ctx) => !isBackyardGuard(ctx);

export const isBackyardGuard: PenguinGuard = ({ data }) => data.isVanillaEngine();

export const handleGLR: PenguinHandler<[]> = ({ msg, penguin }) => {
  msg.send(penguin, 'glr', '');
}

export const handlePBI: PenguinHandler<[string]> = ({ msg, penguin }, id) => {
  msg.send(penguin ,'pbi', id);
}

export const handleGetTotalCoins: PenguinHandler<[]> = ({ penguin, msg }) => {
  msg.send(penguin, 'gtc', penguin.currency.coins);
}

export const handleSendCoins: PenguinHandler<[]> = (ctx) => {
  const { penguin, msg } = ctx;
  if ('room' in ctx) {
    if (ctx.room.getTables().some(t => t.unblockPayout(penguin))) {
      // don't send if payout is blocked from being a spectator
      return;
    }
  }
  msg.send(penguin, 'ac', penguin.currency.coins);
}

export const handleGetCoins: PenguinHandler<[]> = ({ penguin, msg }) => {
  msg.send(penguin, 'gc', penguin.currency.coins);
}

export const handleSpyRequest: PenguinHandler<[]> = ({ penguin }) => {
  penguin.psa.setAgentPending();
}

export const handleReceiveInventory: PenguinHandler<[]> = () => {
  // seemingly useless handler, it just sends the client's inventory to the server
  return;
}

export const sendGetBuddies: PenguinHandler<[]> = async ({ msg, penguin, world, db }) => {
  const buddies = await Promise.all(penguin.buddy.buddies.map(id => {
    return formatBuddyEntry(id, world, db, true);
  }));
  msg.send(penguin, 'gb', ...buddies);
}

export const sendBuddyOnlineList: PenguinHandler<[]> = ({ msg, penguin, world }) => {
  const onlineIds = penguin.buddy.buddies.filter(id => world.getById(id) !== undefined);
  msg.send(penguin, 'go', ...onlineIds);
}

export const handleBuddyRequest: PenguinHandler<[number]> = (ctx, targetId) => {
  const { msg, penguin, world, data, prst } = ctx;
  const target = world.getById(targetId);
  if (target === undefined) {
    return;
  }

  if (penguin.buddy.isBuddy(targetId)) {
    return;
  }

  if (isNewBuddyProtocol(data)) {
    msg.send(target, 'br', penguin.id, penguin.name);
    // refresh sender list to avoid temporary placeholders client-side
    sendGetBuddies(ctx);
  } else {
    msg.send(target, 'bq', penguin.id, penguin.name);
  }

  prst(target);
}

export const handleBuddyAccept: PenguinHandler<[number]> = async (ctx, requesterId) => {
  const { world, penguin, prst, msg, data, off } = ctx;
  const requester = world.getById(requesterId) ?? await off.getPenguin(requesterId);

  penguin.buddy.add(requesterId);

  if (requester === undefined) {
    return;
  }
  requester.buddy.add(penguin.id);
  if (requester instanceof WorldPenguin) {
    msg.send(requester, 'ba', penguin.id, penguin.name);
  }
  prst(requester);

  if (isNewBuddyProtocol(data)) {
    sendGetBuddies(ctx);
    if (requester instanceof WorldPenguin) {
      sendGetBuddies({ ...ctx, penguin: requester });
    }
  }

  prst(penguin);
}

export const handleBuddyDecline: PenguinHandler<[number]> = (ctx, requesterId) => {
  const { msg, world, penguin } = ctx;

  const requester = world.getById(requesterId);
  if (requester !== undefined) {
    msg.send(requester, 'bd', penguin.id, penguin.name);
  }
}

export const handleBuddyRemove: PenguinHandler<[number]> = async (ctx, removeId) => {
  const { penguin, prst, world, data, msg, off } = ctx;
  
  penguin.buddy.remove(removeId);

  const buddy = world.getById(removeId) ?? await off.getPenguin(removeId);

  if (buddy === undefined) {
    return;
  }

  buddy.buddy.remove(penguin.id);
  if (buddy instanceof WorldPenguin) {
    if (isNewBuddyProtocol(data)) {
      msg.send(buddy, 'rb', penguin.id, penguin.name);
    } else {
      msg.send(buddy, 'br', penguin.id, penguin.name);
    }
  }

  prst(penguin);
  prst(buddy);
}

export const handleBuddyMessage: PenguinHandler<[number, number]> = (ctx, targetId, messageId) => {
  const { msg , world, penguin } = ctx;
  const target = world.getById(targetId);
  if (target !== undefined) {
    msg.send(target, 'bm', penguin.id, penguin.name, messageId);
  }
}

export const handleGetPlayer: PenguinHandler<[number]> = async (ctx, playerId) => {
  const { world, msg, penguin, data, db } = ctx
  const target = world.getById(playerId);
  if (target === undefined) {
    const data = await db.get(playerId);
    if (data !== null) {
      msg.send(penguin, 'gp', getOfflinePenguinCrumb(playerId, data), 0);
    }
  } else {
    const room = world.getPenguinRoom(target);
    if (room !== undefined) {
      msg.send(penguin, 'gp', getPenguinString(data, target, room.getState(target)), room.id);
    }
  }
}

export const handleFindBuddy: PenguinHandler<[number]> = ({ msg, penguin, world }, buddyId) => {
  const buddy = world.getById(buddyId);
  if (buddy !== undefined) {
    const room = world.getPenguinRoom(buddy);
    if (room !== undefined) {
      msg.send(penguin, 'bf', room.id);
    }
  }
}

export const handleDisconnect = async (ctx: WorldContext) => {
  if ('penguin' in ctx) {
    const { penguin, msg, prst, world } = ctx;
    if (penguin.psa.isPending) {
      penguin.inventory.add(800);
    }

    (await Promise.all(penguin.buddy.buddies.map(id => world.getById(id)))).filter((p): p is WorldPenguin => p !== undefined)
      .forEach(p => {
        sendBuddyOnlineList({ ...ctx, penguin: p });
      });

    if ('room' in ctx) {
      const table = ctx.room.getPenguinTable(penguin);

      await leaveRoom(ctx);

      if (table !== null) {
        const index = table.getSeatIndex(penguin);
        if (index !== undefined && index !== WorldTable.TABLE_SPECTATOR_SEAT) {
          table.removePlayer(penguin);
          if (table.hasStarted()) {
            await msg.send(table.penguins, 'cz', penguin.name);
            table.resetRound();
          } else {
            if (table.getCount() === 0) {
              table.reset();
            }
          }
          await msg.send(ctx.room.players, 'ut', table.getId(), table.getCount());
        }
      }

    } else if ('fire' in ctx) {
      await handleLeaveFire(ctx);
    }

    world.disconnect(penguin);
    try {
      await prst(penguin);
    } catch (error) {
      console.error(`Failed to save penguin ${penguin.id} during disconnect`, error);
    }
    msg.unlinkClient(penguin);
  }
}

export const handleGetPuffleLaunchData: PenguinHandler<[]> = ({ msg, penguin }) => {
  msg.send(penguin, 'ggd', penguin.puffleLaunch.data === null ? '' : penguin.puffleLaunch.data.toString('utf-8') );
}

export const handleSetPuffleLaunchData: PenguinHandler<[string]> = ({ prst, penguin }, data) => {
  penguin.puffleLaunch.set(Buffer.from(data));
  prst(penguin);
}

export const handleGetSpyDrillsChallenge: PenguinHandler<[]> = ({ msg, penguin }) => {
  // The original algorithm is unknown, so we are using experimental data to simulate it
  const randomOption = choose(SPY_DRILLS_DATA);
  const [games, medalCount] = randomOption;
  
  /*
  Regarding the generation, it would pick 3 random spy drill games and then assign a medal count to them.
  We don't know how either of those processes worked exactly

  # Minigame picking
  At first you would think it is random, but there seems to be a clear relation with how the games are picked.
  The algorithm seems to have a difficulty preference and it tries to increase the difficulty each time.
  It is not exactly known what algorithm is used for this, however

  # Medals Calculation
  The medals number is deterministic, meaning the same minigames always give the same medals.
  It is likely that it just follows a simple point system, but the points are likely decimal, which make it
  hard to predict their values since they would get rounded into an integer, and we lose a lot
  of information because of that
  */

  msg.send(penguin, 'zr', games.join(','), medalCount);
}

export const handleGetSpyDrillsReward: PenguinHandler<[number]> = ({ penguin, prst }, medals) => {
  penguin.epf.addMedals(medals);
  prst(penguin);
}

export const handleHeartbeat: PenguinHandler<[]> = ({ msg, penguin }) => {
  msg.send(penguin, 'h', '');
}

export const handleGetPinInfo: PenguinHandler<[number]> = (ctx) => {
  const { msg, penguin, data } = ctx;

  const pins = penguin.inventory.items.filter((item) => {
    const id = Number(item)
    return data.getItem(id)?.type === ItemType.Pin && !isFlag(id);
  }).map((pin) => {
    const item = data.getItem(pin);
    return [item.id, (new Date(`${item.releaseDate}T12:00:00`)).getTime() / 1000, item.isMember ? 1 : 0].join('|');
  })

  msg.send(penguin, 'qpp', ...pins);
}

export const handleGetMissionStamps: PenguinHandler<[]> = (ctx) => {
  const { msg, penguin, data } = ctx;
  
  const awards = penguin.inventory.items.filter(id => {
    const info = data.getItem(id);
    return info.type === ItemType.Award;
  });

  msg.send(penguin, 'qpa', penguin.id, awards.join('|'));
}

export const handleGetStampbookCoverData: PenguinHandler<[number]> = (ctx) => {
  const { msg, penguin } = ctx;

  const stamps = penguin.stampbook.cover.stamps.map(stamp => [
    0, stamp.stamp, stamp.x, stamp.y, stamp.rotation, stamp.depth
  ].join('|'));

  msg.send(
    penguin, 'gsbcd',
    penguin.stampbook.cover.color,
    penguin.stampbook.cover.highlight,
    penguin.stampbook.cover.pattern,
    penguin.stampbook.cover.icon,
    ...stamps
  );
}

export const handleGetRecentStamps: PenguinHandler<[]> = ({ msg, penguin, prst }) => {
  msg.send(penguin, 'gmres', penguin.stampbook.recentStamps.join('|'));
  penguin.stampbook.clearRecentStamps();
  prst(penguin);
}

export const handleSetStampbookCoverData: PenguinHandler<string[]> = ({ penguin, prst }, color, highlight, pattern, icon, ...stamps) => {
  penguin.stampbook.setCover(
    Number(color),
    Number(highlight),
    Number(pattern),
    Number(icon),
    stamps.map(str => {
      const [_, id, x, y, rotation, depth] = str.split('|').map(n => Number(n));
      return {
        stamp: id,
        x,
        y,
        rotation,
        depth
      }
    })
  );
  prst(penguin);
}

export const handleSetStampEarned: PenguinHandler<[number]> = ({ penguin, prst }, stampId) => {
  penguin.stampbook.add(stampId);
  prst(penguin);
}

export const handleGetEpfStatus: PenguinHandler<[]> = ({ penguin, msg }) => {
  msg.send(penguin, 'epfga', penguin.inventory.has(8009) ? 1 : 0);
}

export const handleGetFieldOps: PenguinHandler<[]> = ({ penguin, msg }) => {
  // sends an integer boolean, FALSE if there is an active field ops
  // that wasn't done
  msg.send(penguin, 'epfgf', 0);
}

export const handleGetEpfMedals: PenguinHandler<[]> = ({ msg, penguin }) => {
  msg.send(penguin, 'epfgr', penguin.epf.careerMedals, penguin.epf.medals);
}

export const handleAddEpfItem: PenguinHandler<[number]> = ({ data, penguin, msg, prst }, itemId) => {
  const item = data.getItem(itemId);
  if (!item.isEPF) {
    throw new Error(`Item ${itemId} is marked as not being from EPF, but is being bought through it`);
  }

  penguin.inventory.add(itemId);

  msg.send(penguin, 'epfai', penguin.epf.removeMedals(item.cost));
  prst(penguin);
}

export const handleBecomeAgent: PenguinHandler<[]> = ({ prst, msg, penguin }) => {
  msg.send(penguin, 'epfsa', 1);
  prst(penguin);
}

export const handleGrantAwards: PenguinHandler<[number]> = ({ prst, penguin }, medals) => {
  penguin.epf.addMedals(medals);
  prst(penguin);
}

export const handleGetPartyOp: PenguinHandler<[]> = ({ msg, data, penguin }) => {
  if (data.getPartyOp() === 'battle-of-doom') {
    msg.send(penguin, 'epfgp', penguin.battleOfDoom.completed ? 1 : 0);
  }
}

export const handleSetPartyOp: PenguinHandler<[number]> = ({ data, penguin, prst }, completed) => {
  if (completed === 1) {
    if (data.getPartyOp() === 'battle-of-doom') {
      penguin.battleOfDoom.setComplete();
    }
  }

  prst(penguin);
}

export const handleEPFStamp: PenguinHandler<[number]> = ({ msg, penguin }, stamp) => {
  if (!isEPFAgent(penguin)) {
    msg.send(penguin, 'epfsf', 'naa'); // TODO document
  }

  if (penguin.stampbook.has(stamp)) {
    msg.send(penguin, 'epfsf', 'ahm'); // TODO document
  } else {
    msg.send(penguin, 'epfsf', 'nem', stamp); // giving the stamp
  }
}
