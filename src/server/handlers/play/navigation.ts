import { Handler } from '..';
// import { SledRace } from '../games/sled';
// import { CardJitsu } from '../games/card';
import { Handle } from '../handles';
// import { CardJitsuFire } from '../games/fire';
import { isGameRoom, Room } from '@server/game-logic/rooms';
import { WorldClient, WorldContext } from '@server/new-client';
import { PUFFLES } from '@server/game-logic/puffle';

const handler = new Handler<WorldClient, WorldContext, ['world', 'room', 'penguin']>(['world', 'room', 'penguin']);

// client requesting to join room
handler.xt(Handle.JoinRoom, ({ world, room, penguin, client }, id, x, y) => {
  // leaving previous room
  room.removePenguin(penguin);

  if (isGameRoom(id)) {
    world.getGame(id).addPenguin(penguin);
    client.sendXt('jg', id);
  } else {
    const newRoom = world.getRoom(id);

    const xx = x ?? 0;
    const yy = y ?? 0;
    newRoom.addPenguin(penguin, xx, yy);
  }
});

// sending inventory to player
handler.xt(Handle.GetInventory, ({ penguin }) => {
  penguin.sendInventory();
});

handler.xt(Handle.GN, ({client}) => {
  client.sendXt('gn', '');
});

handler.xt(Handle.GetMail, ({ penguin }) => {
  penguin.sendXt(
    'mst',
    penguin.info.getUnreadMailTotal(),
    penguin.info.getMailTotal()
  );
});

handler.xt(Handle.GetBuddies, ({client}) => {
  client.sendXt('gb');
});

handler.xt(Handle.JoinIgloo, ({ world, penguin }, fakeId) => {
  if (world.data.isVanillaEngine()) {
    return;
  }
  // for some reason the ID given is the player + 1000
  // in WF igloo room IDs are playerID + 2000
  const iglooId = fakeId + 1000;
  const igloo = world.getRoom(iglooId);
  igloo.addPenguin(penguin, 0, 0);
});

// // Joining player igloo
// handler.xt(Handle.JoinIglooNew, (client, playerId, roomType) => {
//   if (!client.isEngine3) {
//     return;
//   }
//   if (roomType === 'igloo') {
//     // in WF igloo room IDs are playeId + 2000
//     const iglooId = playerId + 2000;
//     client.sendXt('jp', iglooId, iglooId, roomType);
//     client.joinRoom(iglooId);
//   } else if (roomType === 'backyard') {
//     const backyardId = 1000;
//     client.sendXt('jp', backyardId, backyardId, roomType);
//     client.joinRoom(backyardId);
//   }
// })

handler.xt(Handle.SendAction, ({ room, penguin }, action) => {
  room.sendXt('sa', penguin.id, action);
});

handler.xt(Handle.SendFrame, ({ room, penguin }, frame) => {
  room.sendXt('sf', penguin.id, frame);
});

handler.xt(Handle.SetPosition, ({ room, penguin }, ...args) => {
  room.move(penguin, ...args);
});

handler.xt(Handle.Snowball, ({ room, penguin }, ...args) => {
  room.throwSnowball(penguin, ...args);
});

// sending emotes
handler.xt(Handle.SendEmote, ({ room, penguin }, emote) => {
  room.sendXt('se', penguin.id, emote);
});

handler.xt(Handle.SendJoke, ({ room, penguin }, joke) => {
  room.sendXt('sj', penguin.id, joke);
});

handler.xt(Handle.HandleSendMessage, ({ room }, id, msg) => {
  room.sendXt('sm', id, msg);
});

handler.xt(Handle.SendSafeMessage, ({ room, penguin }, id) => {
  room.sendXt('ss', penguin.id, id);
});

handler.xt(Handle.SendLine, ({ room, penguin }, line) => {
  room.sendXt('sl', penguin.id, line);
});

// // player inventory thing? Not sure why this exists
// handler.xt(Handle.PBI, (client, id) => {
//   client.sendXt('pbi', id);
// })

// // refreshing room (required for bits and bolts, maybe other places)
// handler.xt(Handle.RoomRefresh, (client) => {
//   // TODO multiplayer logic
//   client.sendXt('grs', client.penguin.id, client.penguinString);
// })

// // sending coins, used by some places to get coin count (golden puffle)
// handler.xt(Handle.GetTotalCoins, (client) => {
//   client.sendXt('gtc', client.penguin.coins);
// })

// // get penguins in the waddles
// handler.xt(Handle.GetWaddle, (client, ...waddles) => {
//   const waddleRooms = client.room.getWaddleRooms();
//   client.sendXt('gw', ...waddleRooms.map((w) => {
//     return `${w.id}|${w.seats.map(p => {
//       return p?.penguin.name ?? '';
//     }).join(',')}`
//   }));
// });

// // used to indicate opening book (eg. newspaper), which was apparently called a "toy"
// // TODO persistence for new penguins joining
// handler.xt(Handle.OpenBook, (client, id) => {
//   client.sendRoomXt('at', client.penguin.id, id);
// });

// handler.xt(Handle.CloseBook, (client) => {
//   client.sendRoomXt('rt', client.penguin.id);
// });

// export const initWaddleConstructors = (s: Server) => {
//   s.waddleConstructors = {
//     'card': CardJitsu,
//     'sled': SledRace,
//     'fire': CardJitsuFire
//   };
// }

// // join a waddle
// handler.xt(Handle.JoinWaddle, (client, waddle) => {
//   const room = client.room.getWaddleRoom(waddle);
//   client.joinWaddleRoom(room);
// });

// handler.xt(Handle.JoinTemporaryWaddle, (client, room, waddle, unknown) => {
//   if (client.isEngine1) {
//     const roomId = waddle;
//     if (client.isInWaddleGame() && client.waddleGame.name === 'sled') {
//       if (roomId === client.waddleGame.roomId) {
//         client.joinGameRoomOld(roomId, 'jx');
//       }
//     }
//     return;
//   }
//   const waddleRoom = client.server.getRoom(room).waddles.get(waddle);
//   if (waddleRoom === undefined) {
//     throw new Error('Player is joining Waddle Room, but it doesn\'t exist');
//   }
//   client.joinWaddleRoom(waddleRoom);
// });

// // leave a waddle room
// handler.xt(Handle.LeaveWaddle, (client) => {
//   if (!client.hasWaddleRoom()) {
//     return;
//   }
//   const waddleRoom = client.waddleRoom;
//   const seatIndex = waddleRoom.seats.findIndex((seat) => seat?.penguin.id === client.penguin.id);
//   client.leaveWaddleRoom();
//   if (seatIndex !== -1) {
//     client.sendRoomXt('uw', waddleRoom.id, seatIndex);
//   }
// });

// handler.xt(Handle.PlayerTransformation, (client, id) => {
//   client.setAvatar(id);
//   client.sendRoomXt('spts', client.penguin.id, id);
// });

// handler.disconnect((client) => {
//   client.disconnect();
// })

// get igloo information
handler.xt(Handle.GetIgloo, ({ world, client }, id) => {
  const host = world.getPenguin(id);
  if (host !== undefined) {
    const igloo = host.getOwnIglooString();
    client.sendXt('gm', id, igloo);
  }
});

// seemingly the format in which client usually wants the puffle IDs
export function getClientPuffleIds(puffleId: number) {
  const parentId = PUFFLES.get(puffleId)?.parentId;
  if (parentId === undefined) {
    return [puffleId, ''];
  } else {
    return [parentId, puffleId];
  }
}

// get puffles in igloo
handler.xt(Handle.GetIglooPuffles, ({ world, penguin, client }, id, iglooType) => {
  if (!world.data.isVanillaEngine()) {
    const puffles = penguin.info.getPuffles().map((puffle) => {
      return [
        puffle.id,
        puffle.name,
        puffle.type,
        puffle.clean,
        puffle.food,
        puffle.rest,
        100,
        100,
        100,
        0,
        0,
        0,
        puffle.id === penguin.walkingPuffle ? 1 : 0
      ].join('|')
    })
    if (puffles.length >= 16) {
      // PUFFLE OWNER
      penguin.giveStamp(21);
    }
  
    client.sendXt('pg', ...puffles);
  } else {
    const isBackyard = iglooType === 'backyard';
    const puffles = penguin.info.getPuffles().filter((puffle) => {
      // filtering for backyard or igloo puffles
      return penguin.info.isInBackyard(puffle.id) === isBackyard;
    }).map((puffle) => {
      return [
        puffle.id,
        ...getClientPuffleIds(puffle.type),
        puffle.name,
        Math.round(Date.now()), // TODO puffle adoption date in puffle
        puffle.food,
        100, // TODO puffle play
        puffle.rest,
        puffle.clean,
        0, // TODO puffle hat
        0, 0, // TODO what are these 0?
        puffle.id === penguin.walkingPuffle ? 1 : 0
      ].join('|')
    })
    client.sendXt('pg', puffles.length, ...puffles);
  }
});

export default handler;
