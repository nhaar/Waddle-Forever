// import { Client } from '@server/client';
import { Room } from '@server/game-logic/rooms';
import { WorldClient, WorldContext } from '@server/new-client';
import { Handler } from '..';
// import { Room } from '../../game-logic/rooms';
import { Handle } from '../handles';
// import { getClientPuffleIds } from './puffle';

const handler = new Handler<WorldClient, WorldContext, ['penguin', 'world']>(['penguin', 'world']);

handler.xt(Handle.JoinServer, ({ world, penguin, client }) => {
  if (world.data.isVanillaEngine()) {
    return;
  }
  // penguins don't keep the puffle from previous session
  // client.unequipPuffle();
  /*
  TODO: find what second number is
  Figure out how moderators will be handled
  Figure out what moderator_status is used for
  Add last number (something to do with stamp book)
  */
  const moderatorStatus = 0;
  // penguin.mascot > 0 ? 3 : 0;
  // initializing penguin data
  client.sendXt('js', 
    // client.penguin.isAgent ? 1 : 0
    0
    , 0, moderatorStatus, 0);

  penguin.sendInfo({x:0,y:0,frame:1});
  // client.sendPenguinInfo();

  // receiving inventory
  // TODO proper inventory
  // send stamps must be before join room
  // for the 365 days stamp to work
  client.sendXt('gps', penguin.id, '426|188|14|20|21|438');
  // await client.sendStamps();

  // joining spawn room // TODO more spawn rooms in the future?
  const town = world.getRoom(Room.Town);
  town.addPenguin(penguin, 0, 0);

  client.sendXt('pgu',   '1|asdfas|5|100|100|100|100|100|100',
  '2|asdasd|0|100|100|100|100|100|100',
  '3|nhaarBlackPu|2|100|100|100|100|100|100',
  '4|asdas|7|100|100|100|100|100|100',
  '5|nhaarBlackP|2|100|100|100|100|100|100',
  '6|dsadsa|2|100|100|100|100|100|100',
  '7|asdfas|2|100|100|100|100|100|100',
  '8|asdfas|5|100|100|100|100|100|100',
  '9|asdfasdf|2|100|100|100|100|100|100',
  '10|asdfas|2|100|100|100|100|100|100',
  '11|nhaarBlackPu|2|100|100|100|100|100|100',
  '12|asdfas|2|100|100|100|100|100|100',
  '13|asdfa|2|100|100|100|100|100|100',
  '14|sdfgs|2|100|100|100|100|100|100',
  '15|asd|2|100|100|100|100|100|100',
  '16|dsadsa|1|100|100|100|100|100|100',
  '17|asdfa|2|100|100|100|100|100|100',
  '18|asdfas|3|100|100|100|100|100|100',
  '19|asdfa|2|100|100|100|100|100|100',
  '20|asdfa|2|100|100|100|100|100|100');

  // client.sendPuffles();
});

// handler.xt(Handle.JoinServerNew, async (client, id) => {
//   if (!client.isEngine3) {
//     return;
//   }
//   // in Engine 3, the client reconnects, thus losing the login data, the only thing
//   // we have is the ID granted by this handler
//   client.setPenguinFromId(id);
//   client.unequipPuffle();
//   const moderatorStatus = client.penguin.mascot > 0 ? 3 : 0;
//   // // initializing penguin data
//   client.sendXt('js', client.penguin.isAgent ? 1 : 0, 0, moderatorStatus, 0);

//   client.sendXt('activefeatures', client.data.getActiveFeatures() ?? '');
//   client.sendPenguinInfo();

//   await client.sendStamps()

//   client.joinRoom(Room.Town);

//   // loading puffle inventory
//   // this is important for things like identifying which puffles belong to you
//   client.sendXt('pgu', ...client.penguin.getPuffles().map((puffle) => [
//     puffle.id,
//     ...getClientPuffleIds(puffle.type),
//     puffle.name,
//     10, // TODO, adoption date
//     puffle.food,
//     100, // TODO puffle play stat
//     puffle.rest,
//     puffle.clean,
//     0, // TODO puffle hat
//     0 // TODO unknown what this last one is
//   ].join('|')));

//   // TODO refactor these
//   client.send('%xt%nxquestsettings%-1%{"ver":1,"spawnRoomId":800,"quests":[{"id":1,"name":"shopping","awards":[{"id":24023,"type":"penguinItem","n":1}],"tasks":[{"type":"room","description":"Visit the Clothes Shop","data":130}]},{"id":3,"name":"igloo","awards":[{"id":2166,"type":"furnitureItem","n":1}],"tasks":[{"type":"","description":"Visit your Igloo","data":null}]},{"id":2,"name":"puffle","awards":[{"id":70,"type":"puffleItem","n":1}],"tasks":[{"type":"room","description":"Visit the Pet Shop","data":310}]}]}%')
//   client.send('%xt%nxquestdata%-1%{"quests":[{"id":1,"status":"prize claimed","tasks":[true]},{"id":3,"status":"prize claimed","tasks":[true]},{"id":2,"status":"prize claimed","tasks":[true]}]}%')

//   // TODO: this would periodically send to each player but right now this isn't fully implemented
//   client.sendCoinsForChange();
// });

// handler.xt(Handle.GetBuddies, (client) => {
//   if (client.isEngine3) {
//     return;
//   }
//   client.sendXt('gb', '');
// });

// handler.xt(Handle.GetBuddies, (client) => {
//   // TODO: buddy stuff
//   if (!client.isEngine3) {
//     return;
//   }
//   client.sendXt('gs', 0, 0, 1, 0);
//   client.sendXt('gb', '');
//   client.sendXt('pbr', '');
//   client.sendXt('gc', '');
// });

// handler.xt(Handle.GN, (client) => {
//   client.sendXt('gn', '');
// });

// handler.xt(Handle.GLR, (client) => {
//   client.sendXt('glr', '');
// });


// handler.xt(Handle.Heartbeat, (client) => {
//   client.sendXt('h', '');
// });

// handler.xt(Handle.GetIglooInventory, (client) => {
//   // No idea what these zeros are used for
//   const zeros = '0000000000';
//   const furnitureInfo = client.penguin.getAllFurniture().map((pair) => {
//     const [id, amount] = pair;
//     return `${id}|${zeros}|${amount}`;
//   });
  
//   const floorings = client.penguin.getIglooFloorings();
//   const igloos = client.penguin.getIglooTypes();
//   const locations = client.penguin.getIglooLocations();
//   const information = [
//     furnitureInfo,
//     // this ... is for the other types which don't have "amount"
//     ...[
//       floorings,
//       igloos,
//       locations
//     ].map((items) => {
//       return items.map(item => `${item}|0000000000`)
//     })
//   ].map((infoArray) => {
//     return infoArray.join(',');
//   })
//   client.sendXt('gii', ...information);
// })

export default handler;
