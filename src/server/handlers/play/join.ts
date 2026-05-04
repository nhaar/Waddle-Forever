import { Room } from '@server/game-logic/rooms';
import { WorldClient, WorldContext } from '@server/new-client';
import { Handle } from '../handles';
import { XtHandler } from '../xt';
import { getClientPuffleIds } from './navigation';

const handler = new XtHandler<WorldClient, WorldContext, ['penguin', 'world']>(['penguin', 'world']);

handler.xt(Handle.JoinServer, async ({ world, penguin }) => {
  if (world.data.isVanillaEngine()) {
    return;
  }
  // penguins don't keep the puffle from previous session
  penguin.unequipPuffle();
  /*
  TODO: find what second number is
  Figure out how moderators will be handled
  Figure out what moderator_status is used for
  Add last number (something to do with stamp book)
  */
  const moderatorStatus = penguin.info.mascot > 0 ? 3 : 0;
  // initializing penguin data
  penguin.sendXt('js', penguin.info.isAgent ? 1 : 0, 0, moderatorStatus, 0);

  penguin.sendInfo({x:0,y:0,frame:1});

  // receiving inventory
  // TODO proper inventory
  // send stamps must be before join room
  // for the 365 days stamp to work
  await penguin.sendStamps();

  // joining spawn room // TODO more spawn rooms in the future?
  const town = world.getRoom(Room.Town);
  town.addPenguin(penguin, 0, 0);

  penguin.sendPuffles();
});

handler.xt(Handle.JoinServerNew, async ({ world, penguin }, id) => {
  if (!world.data.isVanillaEngine()) {
    return;
  }
  // in Engine 3, the client reconnects, thus losing the login data, the only thing
  // we have is the ID granted by this handler
  // client.setPenguinFromId(id);
  penguin.unequipPuffle();
  const moderatorStatus = penguin.info.mascot > 0 ? 3 : 0;
  // // initializing penguin data
  penguin.sendXt('js', penguin.info.isAgent ? 1 : 0, 0, moderatorStatus, 0);

  penguin.sendXt('activefeatures', world.data.getActiveFeatures() ?? '');
  penguin.sendInfo({ x: 0, y: 0, frame: 1});
  // client.sendPenguinInfo();

  await penguin.sendStamps()

  const town = world.getRoom(Room.Town);
  town.addPenguin(penguin, 0, 0);

  // loading puffle inventory
  // this is important for things like identifying which puffles belong to you
  penguin.sendXt('pgu', ...penguin.info.getPuffles().map((puffle) => [
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
  ].join('|')));

  // TODO refactor these
  penguin.getClient().write('%xt%nxquestsettings%-1%{"ver":1,"spawnRoomId":800,"quests":[{"id":1,"name":"shopping","awards":[{"id":24023,"type":"penguinItem","n":1}],"tasks":[{"type":"room","description":"Visit the Clothes Shop","data":130}]},{"id":3,"name":"igloo","awards":[{"id":2166,"type":"furnitureItem","n":1}],"tasks":[{"type":"","description":"Visit your Igloo","data":null}]},{"id":2,"name":"puffle","awards":[{"id":70,"type":"puffleItem","n":1}],"tasks":[{"type":"room","description":"Visit the Pet Shop","data":310}]}]}%')
  penguin.getClient().write('%xt%nxquestdata%-1%{"quests":[{"id":1,"status":"prize claimed","tasks":[true]},{"id":3,"status":"prize claimed","tasks":[true]},{"id":2,"status":"prize claimed","tasks":[true]}]}%')

  // TODO: this would periodically send to each player but right now this isn't fully implemented
  penguin.sendCoinsForChange();
});

// Joining server
handler.xt(Handle.JoinServerOld, ({ world, penguin }) => {
  penguin.sendXt('js', penguin.isAgent() ? 1 : 0);

  // chat506+ expects an immediate buddy list + online list after login
  if (penguin.getBuddyProtocol() === 'b') {
    world.handleGetBuddies(penguin);
    world.handleGetBuddyOnlineList(penguin);
  }

  // notify buddies this player is now online
  world.sendBuddyOnlineList(penguin);
  penguin.info.getBuddies().forEach((buddyId) => {
    const buddyClient = world.getPenguin(buddyId);
    if (buddyClient !== undefined && world.data.isPreCpip()) {
      world.sendBuddyOnlineList(buddyClient);
    }
  });

  const town = world.getRoom(Room.Town);
  town.addPenguin(penguin, 0, 0);
})

// don't know when this is called, not sure if this is the right context for it
handler.xt(Handle.CheckNameOld, ({ world, penguin }, name) => {
  const isValid = (name.length > 2 && name.length <= 12 && !world.getDb().penguinExists(name)) ? 0 : 1;
  penguin.sendXt('checkName', isValid, name);
});

export { handler as joinHandler };
