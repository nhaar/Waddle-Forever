import { isAs3 } from '../../../server/routes/versions';
import { XtHandler } from '..';
import { Room } from '../../game/rooms';

const handler = new XtHandler();

handler.xt('j#js', (client) => {
  if (isAs3(client.version)) {
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
  client.sendXt('js', client.penguin.is_agent ? 1 : 0, 0, moderatorStatus, 0);

  client.sendPenguinInfo();

  // joining spawn room // TODO more spawn rooms in the future?
  client.joinRoom(Room.Town);

  // receiving inventory
  // TODO proper inventory
  client.sendStamps();

  client.sendPuffles();

  client.checkAgeStamps();
});

handler.xt('j#js', (client, id) => {
  if (!isAs3(client.version)) {
    return;
  }
  // in AS3, the client reconnects, thus losing the login data, the only thing
  // we have is the ID granted by this handler
  client.setPenguinFromId(Number(id));
  const moderatorStatus = client.penguin.mascot > 0 ? 3 : 0;
  // // initializing penguin data
  client.sendXt('js', client.penguin.is_agent ? 1 : 0, 0, moderatorStatus, 0);

  // unsure what this is for, seemingly uneeded
  // client.sendXt('activefeatures');
  client.sendPenguinInfo();
  client.joinRoom(Room.Town);
  client.sendStamps();

  // TODO refactor these
  client.send('%xt%nxquestsettings%-1%{"ver":1,"spawnRoomId":800,"quests":[{"id":1,"name":"shopping","awards":[{"id":24023,"type":"penguinItem","n":1}],"tasks":[{"type":"room","description":"Visit the Clothes Shop","data":130}]},{"id":3,"name":"igloo","awards":[{"id":2166,"type":"furnitureItem","n":1}],"tasks":[{"type":"","description":"Visit your Igloo","data":null}]},{"id":2,"name":"puffle","awards":[{"id":70,"type":"puffleItem","n":1}],"tasks":[{"type":"room","description":"Visit the Pet Shop","data":310}]}]}%')
  client.send('%xt%nxquestdata%-1%{"quests":[{"id":1,"status":"prize claimed","tasks":[true]},{"id":3,"status":"prize claimed","tasks":[true]},{"id":2,"status":"prize claimed","tasks":[true]}]}%')
});

handler.xt('b#gb', (client) => {
  if (isAs3(client.version)) {
    return;
  }
  client.sendXt('gb', '');
});

handler.xt('b#gb', (client) => {
  // TODO: buddy stuff
  if (!isAs3(client.version)) {
    return;
  }
  client.sendXt('gs', 0, 0, 1, 0);
  client.sendXt('gb', '');
  client.sendXt('pbr', '');
  client.sendXt('gc', '');
});

handler.xt('n#gn', (client) => {
  client.sendXt('gn', '');
});

handler.xt('u#glr', (client) => {
  client.sendXt('glr', '');
});


handler.xt('u#h', (client) => {
  client.sendXt('h', '');
});

handler.xt('g#gii', (client) => {
  const furnitureInfo = [];
  // No idea what these zeros are used for
  const zeros = '0000000000';
  for (const furnitureId in client.penguin.furniture) {
    const amount = client.penguin.furniture[furnitureId];
    furnitureInfo.push(`${furnitureId}|${zeros}|${amount}`);
  }
  const floorings = Object.keys(client.penguin.iglooFloorings);
  const igloos = Object.keys(client.penguin.iglooTypes);
  const locations = Object.keys(client.penguin.iglooLocations);
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
