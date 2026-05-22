import { PenguinRepository } from '@server/database/database';
import { isGameRoom, Room } from '@server/game-logic/rooms';
import { WorldContext, World } from '@server/socket-server/world/world';
import { WorldPenguin } from '@server/socket-server/world/world-penguin';
import { WorldRoom } from '@server/socket-server/world/world-room';
import { GameData } from '@server/timelines/game-data';
import { PenguinMessenger } from '../messenger';
import { XtHandler } from '../xt';
import { SledRace } from '@server/socket-server/world/sled';
import { getClientPuffleIds } from './puffle';

const handler = new XtHandler<WorldContext, ['penguin', 'world', 'data', 'msg', 'prst', 'db']>(['penguin', 'world', 'data', 'msg', 'prst', 'db']);

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

export function getBuddyProtocol(data: GameData) {
  if (data.isPreCpip()) {
    const chat = data.getChatVersion();
    return chat >= 506 ? 'b' : 's';
  } else {
    return undefined;
  }
}

async function formatBuddyEntry(id: number, world: World, db: PenguinRepository, includeOnlineFlag: boolean) {
  const name = world.getById(id)?.name ?? (await db.get(id))?.name ?? 'Unknown';

  if (!includeOnlineFlag) {
    return `${id}|${name}`;
  }

  const online = world.getById(id) !== undefined;
  return online ? `${id}|${name}|1` : `${id}|${name}`;
}

async function sendGetBuddies(msg: PenguinMessenger, penguin: WorldPenguin, world: World, db: PenguinRepository) {
  const buddies = penguin.buddy.buddies
    .map(id => formatBuddyEntry(id, world, db, true));
  msg.send(penguin, 'gb', ...await Promise.all(buddies));
}

function sendGetOnlineBuddies(msg: PenguinMessenger, p: WorldPenguin, world: World) {
  const onlineIds = p.buddy.buddies.filter(id => world.getById(id) !== undefined).map(i => String(i));
  msg.send(p, 'go', ...onlineIds);
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

function enterRoom(data: GameData, msg: PenguinMessenger, p: WorldPenguin, r: WorldRoom, x: number, y: number) {
  r.addPenguin(p, x, y);
  msg.send(p, 'jr', r.id, ...r.playerStates.map(([p, s]) => getPenguinString(data, p, s)));
  msg.send(r.players, 'ap', getPenguinString(data, p, { x, y, frame: 1 }));
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

handler.xt([['s', 'js'], ['s', 'j#js']], [], async ({ world, penguin, data, msg, db }) => {
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

  if (data.isPreCpip()) {
    if (getBuddyProtocol(data) == 'b') {
      sendGetBuddies(msg, penguin, world, db);
      // sendGetOnlineBuddies(msg, penguin, world);
    }

    sendGetOnlineBuddies(msg, penguin, world);
    const onlineBuddies = penguin.buddy.buddies.map(i => world.getById(i)).filter((i: WorldPenguin | undefined): i is WorldPenguin => i !== undefined);
    onlineBuddies.forEach(buddy => sendGetOnlineBuddies(msg, buddy, world));

  } else if (data.isVanillaEngine()) {
    msg.send(penguin, 'activefeatures', data.getActiveFeatures() ?? '');
  }

  if (!data.isPreCpip()) {
    sendLPMessage(penguin, data, msg);
    // receiving inventory
    // TODO proper inventory
    // send stamps must be before join room
    // for the 365 days stamp to work
    await msg.send(penguin, 'gps', penguin.id, penguin.stampbook.stamps.join('|'));

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
  const town = world.getRoom(Room.Town);
  enterRoom(data, msg, penguin, town, 0, 0);
});

export const joinRoom = ({ world, penguin, msg, data, room, sled }: { world: World, penguin: WorldPenguin, msg: PenguinMessenger; data: GameData, room?: WorldRoom; sled?: SledRace }, id: number, x: number, y: number) => {
  if (room !== undefined) {
    room.removePenguin(penguin);
    msg.send(room.players, 'rp', penguin.id, ...room.playerStates.map(([p, s]) => getPenguinString(data, p, s)));
  }
  if (sled !== undefined) {
    sled.removePlayer(penguin);
  }

  if (isGameRoom(id)) {
    world.getGame(id).addPenguin(penguin);
    msg.send(penguin, 'jg', id);
  } else {
    const newRoom = world.getRoom(id);
    enterRoom(data, msg, penguin, newRoom, x, y);
  }
}

handler.xt([['s', 'jr'], ['s', 'j#jr']], ['number', 'number', 'number'], (ctx, id, x, y) => {
  joinRoom(ctx, id, x ,y);
});

handler.xt([['s', 'gi'], ['s', 'i#gi']], [], ({ penguin, msg, data }) => {
  msg.send(penguin, 'gi', ...filterItems(data, penguin.inventory.items));
});

handler.xt([['s', 'ai'], ['s', 'i#ai']], ['number'], ({ penguin, msg, data, prst }, item) => {
  const info = data.getItem(item);
  penguin.inventory.add(item);
  msg.send(penguin, 'ai', item, penguin.currency.discount(info.cost));
  prst(penguin);
});

handler.xt('s', 'l#mst', [], ({ penguin, msg }) => {
  msg.send(penguin, 'mst', penguin.mail.unread, penguin.mail.total);
});

handler.xt('s', 'l#mg', [], ({ penguin, msg }) => {
  const postcards = penguin.mail.mail.map(m => [
    m.sender.name,
    m.sender.id,
    m.postcard.postcardId,
    m.postcard.details,
    m.postcard.timestamp,
    m.postcard.uid,
    m.postcard.read ? 1 : 0
  ].join('|'));
  msg.send(penguin, 'mg', ...postcards);
});

handler.xt('s', 'n#gn', [], ({ msg, penguin }) => {
  msg.send(penguin, 'gn', '');
});

handler.xt('s', 'b#gb', [], ({ msg, penguin, data }) => {
  msg.send(penguin, 'gb', '');

  // TODO these aren't to do with buddies
  if (data.isVanillaEngine()) {
    msg.send(penguin, 'gs', 0, 0, 1, 0);
    msg.send(penguin, 'pbr', '');
    msg.send(penguin, 'gc', '');
  }
});

handler.xt('s', 'j#jp', ['number'], ({ msg, penguin, world, data }, fakeId) => {
  // for some reason the ID given is the player + 1000
  // in WF igloo room IDs are playerID + 2000
  const iglooId = fakeId + 1000;
  const igloo = world.getRoom(iglooId);
  enterRoom(data, msg, penguin, igloo, 0, 0);
});

handler.xt('s', 'j#jp', ['number', 'string'], ({ msg, penguin, data, world }, playerId, roomType) => {
  // 1000 = backyard
  const roomId = roomType === 'igloo' ? playerId + 2000 : 1000;
  msg.send(penguin, 'jp', roomId, roomId, roomType);
  // TODO: backyard should only be player itself?
  enterRoom(data, msg, penguin, world.getRoom(roomId), 0, 0);
});

handler.xt('s', 'u#glr', [], ({ msg, penguin }) => {
  msg.send(penguin, 'glr', '');
});

handler.xt('s', 'u#pbi', ['string'], ({ msg, penguin }, id) => {
  msg.send(penguin ,'pbi', id);
});

handler.xt('s', 'r#gtc', [], ({ penguin, msg }) => {
  msg.send(penguin, 'gtc', penguin.currency.coins);
});

handler.xt('s', 'ac', [], ({ penguin, msg }) => {
  // TODO something to do with table spectators
  msg.send(penguin, 'ac', penguin.currency.coins);
});

handler.xt('s', 'gc', [], ({ penguin, msg }) => {
  msg.send(penguin, 'gc', penguin.currency.coins);
});

handler.xt('k', 'spy', [], ({ penguin }) => {
  penguin.psa.setAgentPending();
});

handler.xt('s', 'il', [], () => {
  // seemingly useless handler, it just sends the client's inventory to the server
  return;
});

export { handler as joinHandler };
