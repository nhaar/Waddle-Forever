import { ACTIVE_FEATURES_TIMELINE } from '../../timelines/activefeatures';
import { Handler } from '..';
import { Room } from '../../game-logic/rooms';
import { Handle } from '../handles';
import { getClientPuffleIds } from './puffle';
import { findInVersion } from '../../game-data';

const handler = new Handler();

handler.xt(Handle.JoinServer, async (client) => {
  if (client.isEngine3) {
    return;
  }
  // penguins don't keep the puffle from previous session
  client.unequipPuffle();
  /*
  TODO: find what second number is
  Figure out how moderators will be handled
  Figure out what moderator_status is used for
  Add last number (something to do with stamp book)
  */
  const moderatorStatus = client.penguin.mascot > 0 ? 3 : 0;
  // initializing penguin data
  client.sendXt('js', client.penguin.isAgent ? 1 : 0, 0, moderatorStatus, 0);

  client.sendPenguinInfo();

  // receiving inventory
  // TODO proper inventory
  // send stamps must be before join room
  // for the 365 days stamp to work
  await client.sendStamps();

  // joining spawn room // TODO more spawn rooms in the future?
  client.joinRoom(Room.Town);


  client.sendPuffles();
});

handler.xt(Handle.JoinServerNew, async (client, id) => {
  if (!client.isEngine3) {
    return;
  }
  // in Engine 3, the client reconnects, thus losing the login data, the only thing
  // we have is the ID granted by this handler
  client.setPenguinFromId(id);
  client.unequipPuffle();
  const moderatorStatus = client.penguin.mascot > 0 ? 3 : 0;
  // // initializing penguin data
  client.sendXt('js', client.penguin.isAgent ? 1 : 0, 0, moderatorStatus, 0);

  client.sendXt('activefeatures', findInVersion(client.version, ACTIVE_FEATURES_TIMELINE) ?? '');
  client.sendPenguinInfo();

  await client.sendStamps()

  client.joinRoom(Room.Town);

  // loading puffle inventory
  // this is important for things like identifying which puffles belong to you
  client.sendXt('pgu', ...client.penguin.getPuffles().map((puffle) => [
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
  client.send('%xt%nxquestsettings%-1%{"ver":1,"spawnRoomId":800,"quests":[{"id":1,"name":"shopping","awards":[{"id":24023,"type":"penguinItem","n":1}],"tasks":[{"type":"room","description":"Visit the Clothes Shop","data":130}]},{"id":3,"name":"igloo","awards":[{"id":2166,"type":"furnitureItem","n":1}],"tasks":[{"type":"","description":"Visit your Igloo","data":null}]},{"id":2,"name":"puffle","awards":[{"id":70,"type":"puffleItem","n":1}],"tasks":[{"type":"room","description":"Visit the Pet Shop","data":310}]}]}%')
  client.send('%xt%nxquestdata%-1%{"quests":[{"id":1,"status":"prize claimed","tasks":[true]},{"id":3,"status":"prize claimed","tasks":[true]},{"id":2,"status":"prize claimed","tasks":[true]}]}%')
});

handler.xt(Handle.GetBuddies, (client) => {
  if (client.isEngine3) {
    return;
  }
  client.sendXt('gb', '');
});

handler.xt(Handle.GetBuddies, (client) => {
  // TODO: buddy stuff
  if (!client.isEngine3) {
    return;
  }
  client.sendXt('gs', 0, 0, 1, 0);
  client.sendXt('gb', '');
  client.sendXt('pbr', '');
  client.sendXt('gc', '');
});

handler.xt(Handle.GN, (client) => {
  client.sendXt('gn', '');
});

handler.xt(Handle.GLR, (client) => {
  client.sendXt('glr', '');
});


handler.xt(Handle.Heartbeat, (client) => {
  client.sendXt('h', '');
});

handler.xt(Handle.GetIglooInventory, (client) => {
  // No idea what these zeros are used for
  const zeros = '0000000000';
  const furnitureInfo = client.penguin.getAllFurniture().map((pair) => {
    const [id, amount] = pair;
    return `${id}|${zeros}|${amount}`;
  });
  
  const floorings = client.penguin.getIglooFloorings();
  const igloos = client.penguin.getIglooTypes();
  const locations = client.penguin.getIglooLocations();
  const information = [
    furnitureInfo,
    // this ... is for the other types which don't have "amount"
    ...[
      floorings,
      igloos,
      locations
    ].map((items) => {
      return items.map(item => `${item}|0000000000`)
    })
  ].map((infoArray) => {
    return infoArray.join(',');
  })
  client.sendXt('gii', ...information);
})

export default handler;
