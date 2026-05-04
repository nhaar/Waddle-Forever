import { Handler } from '..';
// import { SledRace } from '../games/sled';
// import { CardJitsu } from '../games/card';
import { Handle } from '../handles';
// import { CardJitsuFire } from '../games/fire';
import { isGameRoom, Room } from '@server/game-logic/rooms';
import { CardJitsu, WaddleGame, World, WorldClient, WorldContext, WorldPenguin, WorldRoom, WorldTable } from '@server/new-client';
import { PUFFLES } from '@server/game-logic/puffle';
import { ROOMS } from '@server/game-data/rooms';
import { Penguin } from '@server/penguin';
import { FURNITURE } from '@server/game-logic/furniture';
import { getFlooringCost, getIglooCost } from '@server/game-logic/iglooItems';
import { Igloo, IglooFurniture, isRainbowStage, PlayerPuffle } from '@server/database';
import { ITEMS, ItemType } from '@server/game-logic/items';
import { choose, chooseN, randomInt } from '@common/utils';
import { PUFFLE_ITEMS } from '@server/game-logic/puffle-item';
import { CARDS } from '@server/game-logic/cards';

const handler = new Handler<WorldClient, WorldContext, ['world', 'room', 'penguin']>(['world', 'room', 'penguin']);

// client requesting to join room
const joinRoom = ({ world, room, penguin }: {
  world: World;
  room: WorldRoom;
  penguin: WorldPenguin
}, id: number, x: number, y: number) => {
  // leaving previous room
  room.removePenguin(penguin);

  if (isGameRoom(id)) {
    world.getGame(id).addPenguin(penguin);
    penguin.sendXt('jg', id);
  } else {
    const newRoom = world.getRoom(id);

    const xx = x ?? 0;
    const yy = y ?? 0;
    newRoom.addPenguin(penguin, xx, yy);
  }
}
handler.xt(Handle.JoinRoom, joinRoom);

// Joining room
handler.xt(Handle.JoinRoomOld, joinRoom);

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

handler.xt(Handle.GetBuddies, ({ world, client }) => {
  if (world.data.isVanillaEngine()) {
    return;
  }
  client.sendXt('gb', '');
});

handler.xt(Handle.GetBuddies, ({ world, client }) => {
  // TODO: buddy stuff
  if (!world.data.isVanillaEngine()) {
    return;
  }
  client.sendXt('gs', 0, 0, 1, 0);
  client.sendXt('gb', '');
  client.sendXt('pbr', '');
  client.sendXt('gc', '');
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
  room.setFrame(penguin, frame);
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

handler.xt(Handle.GN, ({ client }) => {
  client.sendXt('gn', '');
});

handler.xt(Handle.GLR, ({ client }) => {
  client.sendXt('glr', '');
});

handler.xt(Handle.GetAllMail, ({ penguin }) => {
  const postcards = penguin.info.getAllMail().map((mail) => {
    return [
      mail.sender.name,
      mail.sender.id,
      mail.postcard.postcardId,
      mail.postcard.details,
      mail.postcard.timestamp,
      mail.postcard.uid,
      mail.postcard.read ? 1 : 0
    ].join('|')
  })
  penguin.sendXt('mg', ...postcards);
});

handler.xt(Handle.GetIglooInventory, ({ penguin }) => {
  // No idea what these zeros are used for
  const zeros = '0000000000';
  const furnitureInfo = penguin.info.getAllFurniture().map((pair) => {
    const [id, amount] = pair;
    return `${id}|${zeros}|${amount}`;
  });
  
  const floorings = penguin.info.getIglooFloorings();
  const igloos = penguin.info.getIglooTypes();
  const locations = penguin.info.getIglooLocations();
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
  penguin.sendXt('gii', ...information);
})

// player inventory thing? Not sure why this exists
handler.xt(Handle.PBI, ({ client }, id) => {
  client.sendXt('pbi', id);
})

// refreshing room (required for bits and bolts, maybe other places)
handler.xt(Handle.RoomRefresh, ({ room, penguin }) => {
  room.sendXt('grs', penguin.id, penguin.getString(room.getState(penguin)));
})

// sending coins, used by some places to get coin count (golden puffle)
handler.xt(Handle.GetTotalCoins, ({ penguin }) => {
  penguin.sendXt('gtc', penguin.info.coins);
})

// get penguins in the waddles
handler.xt(Handle.GetWaddle, ({ room, client }, ...waddles) => {
  client.sendXt('gw', ...room.getWaddleRooms().map((w) => {
    return `${w.getId()}|${w.getSeats().map(p => {
      return p?.info.name ?? '';
    }).join(',')}`
  }));
});

// used to indicate opening book (eg. newspaper), which was apparently called a "toy"
// TODO persistence for new penguins joining
handler.xt(Handle.OpenBook, ({ room, penguin }, id) => {
  room.sendXt('at', penguin.id, id);
});

handler.xt(Handle.CloseBook, ({ room, penguin }) => {
  room.sendXt('rt', penguin.id);
});

// join a waddle
handler.xt(Handle.JoinWaddle, ({ world, room, penguin }, id) => {
  const waddle = room.getWaddleRoom(id);
  if (waddle !== undefined) {
    room.enterWaddleRoom(waddle, penguin);

    if (waddle.isFull()) {
      const players = waddle.getSeats().filter((p): p is WorldPenguin => p !== null);
      players.forEach(p => {
        room.removePenguin(p);
      });
      const game = world.getWaddleGame(waddle.getGame(), players);
      waddle.reset();
      players.forEach(p => {
        p.sendXt('jg', game.roomId);
      });

      // // 2006 sled race notification for starting the game
      // if (waddleGame.name === 'sled' && players.every((player) => player.isEngine1)) {
      //   players.forEach((player) => {
      //     player.sendXt('sw', waddleRoom.id, waddleGame.roomId, waddleRoom.size);
      //   });
      //   return;
      // }
    }
  }
});

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

// giving item
handler.xt(Handle.AddItem, ({ penguin }, id) => {
  penguin.addItem(id);
  penguin.info.update();
});

// update client's coins
handler.xt(Handle.GetCoins, ({ world, penguin }) => {
  if (world.removeSpectator(penguin)) {
    return;
  }
  penguin.sendCoinsOld();
})

handler.xt(Handle.SendTeleportOld, ({ world, room, penguin }, x, y, frame) => {
  if (!world.data.isPreCpip()) {
    return;
  }
  room.teleport(penguin, x, y, frame);
});

handler.xt(Handle.SendEmoteOld, ({ room, penguin }, emote) => {
  room.sendXt('se', penguin.id, emote);
});

handler.xt(Handle.SnowballOld, ({ room, penguin }, ...args) => {
  room.throwSnowball(penguin, ...args);
})

handler.xt(Handle.SendJokeOld, ({ room, penguin }, joke) => {
  room.sendXt('sj', penguin.id, joke);
});

handler.xt(Handle.SendSafeMessageOld, ({ room, penguin }, id) => {
  room.sendXt('ss', penguin.id, id);
});
handler.xt(Handle.SendSafeMessageOldAlt, ({ room, penguin }, id) => {
  room.sendXt('ss', penguin.id, id);
});
handler.xt(Handle.SendActionOld, ({ room, penguin }, id) => {
  room.sendXt('sa', penguin.id, id);
});

handler.xt(Handle.OpenBookOld, ({ room, penguin }, toyId, frame) => {
  room.sendXt('at', penguin.id, toyId, frame);
});

handler.xt(Handle.CloseBookOld, ({ room, penguin }) => {
  room.sendXt('rt', penguin.id);
});

handler.xt(Handle.GetCoins2007, ({ penguin }) => {
  penguin.sendXt('gc', penguin.info.coins);
});

handler.xt(Handle.GetTableOld, ({ world, penguin, room }, ...tableIds) => {
  if (!world.data.isPreCpip()) {
    return;
  }
  // return table occupancy counts for the requested table ids
  if (tableIds.length === 0) {
    penguin.sendXt('gt');
    return;
  }
  const entries: string[] = [];
  tableIds.forEach((tableId) => {
    const table = room.getTable(tableId);
    entries.push(`${tableId}|${table.getCount()}`);
  });
  penguin.sendXt('gt', ...entries);
});

handler.xt(Handle.JoinTableOld, ({ world, room, penguin }, tableId) => {
  if (!world.data.isPreCpip()) {
    return;
  }

  const table = room.getTable(tableId);
  const beforeCount = table.getCount();

  const seatId = table.getSeatIndex(penguin) ?? table.assignSeatIndex(penguin);
  
  // first seated player resets a stale board
  if (seatId !== WorldTable.TABLE_SPECTATOR_SEAT && beforeCount === 0) {
    table.reset();
  }
  if (seatId !== WorldTable.TABLE_SPECTATOR_SEAT) {
    const afterCount = table.getCount();
    if (afterCount !== beforeCount) {
      room.sendTableState(table);
    }
  }
  // the index here is 1 based
  const tableSeatId = seatId === WorldTable.TABLE_SPECTATOR_SEAT ? seatId : seatId + 1;
  penguin.sendXt('jt', tableId, tableSeatId);
});


handler.xt(Handle.LeaveTableOld, ({ world, room, penguin }) => {
  if (!world.data.isPreCpip()) {
    return;
  }
  // old leave flow: free seat, broadcast count, and reset if empty
  const table = room.getPenguinTable(penguin);
  if (table !== null) {
    table.removePlayer(penguin);
    const count = table.getCount();
    room.sendTableState(table);
    if (count === 0) {
      table.reset();
    }
  }
});

function isTableId(tableId: number) {
  return WorldTable.FIND_FOUR_TABLE_IDS.has(tableId) || WorldTable.MANCALA_TABLE_IDS.has(tableId);
}

handler.xt(Handle.GetTableGame, ({ world, room, penguin }, tableId) => {
  if (!world.data.isPreCpip() || room.getId() === ROOMS['rink'].id) {
    return;
  }
  // resolve table id from context so spectators can re-open correctly
  let resolvedTableId = tableId;
  if (!isTableId(resolvedTableId)) {
    const existingTable = room.getPenguinTable(penguin);
    if (existingTable !== null) {
      resolvedTableId = existingTable.getId();
    }
  }

  const table = room.getTable(resolvedTableId);

  const boardState = table.serializeBoard();

  penguin.sendXt('gz', ...table.getNames(), boardState);
});

handler.xt(Handle.JoinTableGame, ({ world, room, penguin }) => {
  if (!world.data.isPreCpip()) {
    return;
  }
  // join the game instance after table seat selection
  const table = room.getPenguinTable(penguin);
  if (table !== null) {
    const currentSeat = table.getSeatIndex(penguin);
    let seatId;
    if (currentSeat !== undefined) {
      seatId = currentSeat;
    } else {
      seatId = table.assignSeatIndex(penguin);
    }

    // const alreadyJoined = seatId !== WorldTable.TABLE_SPECTATOR_SEAT;
    // if (seatId !== Table.TABLE_SPECTATOR_SEAT) {
    table.setJoined(seatId);
    // }

    penguin.sendXt('jz', seatId);
    table.sendSeatRoaster('uz', penguin);

    // if (seatId !== Table.TABLE_SPECTATOR_SEAT && !alreadyJoined) {
    table.sendUpdate(seatId, penguin.info.name);
    // }

    // start the match when both players have joined
    if (!table.hasStarted()) {
      if (table.hasEveryoneJoined()) {
        table.setStarted();
        table.sendXt('sz', table.getTurn());
      }
      return;
    }

    // if (!alreadyJoined) {
      // client.sendXt('sz', table.turn);
    // }
  }
});

handler.xt(Handle.LeaveTableGame, ({ world, room, penguin }) => {
  if (!world.data.isPreCpip()) {
    return;
  }
  // leave the active game: spectators just close, players clear seats/reset
  const table = room.getPenguinTable(penguin);

  if (table !== null) {
    const seat = table.getSeatIndex(penguin);
    if (seat === WorldTable.TABLE_SPECTATOR_SEAT) {
      table.removeSpectator(penguin);
      penguin.sendXt('lz');
      return;
    }
    if (!table.hasStarted()) {
      if (seat !== undefined) {
        table.removePlayer(penguin);
        table.sendUpdate(seat, '');
      }
      const count = table.getCount();
      room.sendTableState(table);
      if (count === 0) {
        table.reset();
      }
      return;
    }
    table.sendXt('cz', penguin.info.name);
    table.resetRound();
    room.sendTableState(table);
  }
});

handler.xt(Handle.SendTableMove, ({ world, room, penguin }, ...moves) => {
  if (!world.data.isPreCpip()) {
    return;
  }
  // dispatch board moves for find four or mancala
  const table = room.getPenguinTable(penguin);
  if (table !== null) {
    if (!table.hasStarted() || table.hasEnded()) {
      return;
    }
    const seat = table.getSeatIndex(penguin);
    if (seat === undefined || seat === WorldTable.TABLE_SPECTATOR_SEAT || !table.hasJoined(seat)) {
      return;
    }
    const player = seat;
    if (player !== 0 && player !== 1) {
      return;
    }
    if (table.getTurn() !== player) {
      return;
    }

    // table game specific logic
    if (moves.length === table.getMoveLength()) {
      const reset = table.sendMove(moves);
      // Ignore non-table zm packets (e.g. sled racing uses 4 args).
      if (table.getAutomaticTurnChange()) {
        table.changeTurn();
      }
      if (reset) {
        table.resetRound();
        room.sendTableState(table);
      }
    }
  }  
});

handler.xt(Handle.AddItemOld, ({ penguin }, item) => {
  // TODO remove coins logic
  penguin.addItem(item);
  penguin.info.update();
})

// updating penguin
handler.xt(Handle.UpdatePenguinOld, ({ penguin, room }, color, head, face, neck, body, hand, feet, pin, background) => {
  
  penguin.info.color = color
  penguin.info.head = head;
  penguin.info.face = face;
  penguin.info.neck = neck;
  penguin.info.body = body;
  penguin.info.hand = hand;
  penguin.info.feet = feet;
  penguin.info.pin = pin;
  penguin.info.background = background;
  room.sendXt('up', penguin.getString(room.getState(penguin)));
  penguin.info.update();
})

handler.xt(Handle.BecomeAgent, ({ penguin }) => {
  penguin.setAgentPending();
})

handler.xt(Handle.SendInventory, () => {
  // seemingly useless handler, it just sends the client's inventory to the server
  return;
});

handler.xt(Handle.SendMessageOld, ({ room }, id, message) => {
  room.sendXt('sm', id, message);
});

handler.xt(Handle.SetPositionOld, ({ room, penguin }, ...args) => {
  const [x, y] = args;
  if (x === undefined || y === undefined) {
    return;
  }
  const safeX = x <= 0 ? 20 : x;
  const safeY = y <= 0 ? 20 : y;

  room.move(penguin, safeX, safeY);
});

const handleGetBuddyOnlineList = ({ world, penguin }: { world: World; penguin: WorldPenguin }) => {
  if (!world.data.isPreCpip()) {
    return;
  }
  const onlineIds = penguin.info.getBuddies().filter((id) => world.getPenguin(id) !== undefined);
  if (onlineIds.length === 0) {
    penguin.sendXtEmptyLast('go');
    return;
  }
  penguin.sendXt('go', ...onlineIds);
};

// Unified buddy request handler; picks outgoing code based on sender's protocol
const handleBuddyRequest = ({ world, penguin }: { world: World; penguin: WorldPenguin }, targetId: number) => {
  if (!world.data.isPreCpip()) {
    return;
  }
  const numericTargetId = Number(targetId);
  if (!Number.isFinite(numericTargetId)) {
    return;
  }
  const target = world.getPenguin(numericTargetId);
  if (target === undefined) {
    return;
  }
  if (penguin.info.hasBuddy(numericTargetId)) {
    return;
  }
  const senderProtocol = penguin.getBuddyProtocol();
  const requestCode = senderProtocol === 'b' ? 'br' : 'bq';
  target.sendXt(requestCode, penguin.id, penguin.info.name);
  target.info.update();
  // refresh sender list to avoid temporary placeholders client-side
  if (senderProtocol === 'b') {
    world.handleGetBuddies(penguin);
  }
};

// accept + persist buddy for both parties (works even if requester is offline)
const handleBuddyAccept = ({ world, penguin }: { world: World; penguin: WorldPenguin }, requesterId: number) => {
  if (!world.data.isPreCpip()) {
    return;
  }
  const requesterNumericId = Number(requesterId);
  if (Number.isNaN(requesterNumericId)) {
    return;
  }
  const requester = world.getPenguin(requesterNumericId);
  if (requester !== undefined) {
    if (!penguin.info.hasBuddy(requesterNumericId)) {
      penguin.info.addBuddy(requesterNumericId);
      requester.info.addBuddy(penguin.id);
      penguin.info.update();
      requester.info.update();
    }
    requester.sendXt('ba', penguin.id, penguin.info.name);
    if (penguin.getBuddyProtocol() === 'b') {
      world.handleGetBuddies(penguin);
      world.handleGetBuddies(requester);
    }
    return;
  }

  const requesterPenguin = Penguin.getById(requesterNumericId);
  if (requesterPenguin === undefined) {
    return;
  }

  if (!penguin.info.hasBuddy(requesterNumericId)) {
    penguin.info.addBuddy(requesterNumericId);
    penguin.info.update();
  }

  if (!requesterPenguin.hasBuddy(penguin.id)) {
    requesterPenguin.addBuddy(penguin.id);
    requesterPenguin.update();
  }
};

// notify requester their invite was declined
const handleBuddyDecline = ({ world, penguin }: { world: World; penguin: WorldPenguin }, requesterId: number) => {
  if (!world.data.isPreCpip()) {
    return;
  }
  const requester = world.getPenguin(Number(requesterId));
  if (requester === undefined) {
    return;
  }
  requester.sendXt('bd', penguin.info.id, penguin.info.name);
};

// remove buddy for both sides; if other side is offline, persist to DB
const handleBuddyRemove = ({ world, penguin }: { world: World; penguin: WorldPenguin }, buddyId: number) => {
  if (!world.data.isPreCpip()) {
    return;
  }
  const numericId = Number(buddyId);
  if (Number.isNaN(numericId)) {
    return;
  }
  let changed = false;
  if (penguin.info.hasBuddy(numericId)) {
    penguin.info.removeBuddy(numericId);
    changed = true;
  }
  const buddyClient = world.getPenguin(numericId);
  if (buddyClient !== undefined && buddyClient.info.hasBuddy(penguin.id)) {
    buddyClient.info.removeBuddy(penguin.id);
    const removeProtocol = penguin.getBuddyProtocol();
    const removeCode = removeProtocol === 'b' ? 'rb' : 'br';
    buddyClient.sendXt(removeCode, penguin.id, penguin.info.name);
    buddyClient.info.update();
  }
  if (buddyClient === undefined) {
    const buddyPenguin = Penguin.getById(numericId);
    if (buddyPenguin !== undefined) {
      if (buddyPenguin.hasBuddy(penguin.id)) {
        buddyPenguin.removeBuddy(penguin.id);
        buddyPenguin.update();
      }
    }
  }
  if (changed) {
    penguin.info.update();
  }
};

const handleBuddyMessage = ({ world, penguin }: { world: World; penguin: WorldPenguin }, targetId: number, messageId: number) => {
  if (!world.data.isPreCpip()) {
    return;
  }
  const target = world.getPenguin(Number(targetId));
  if (target === undefined) {
    return;
  }
  target.sendXt('bm', penguin.id, penguin.info.name, messageId);
};

handler.xt(Handle.GetBuddies, ({ world, penguin }) => world.handleGetBuddies(penguin));
handler.xt(Handle.GetBuddiesB, ({ world, penguin }) => world.handleGetBuddies(penguin));

handler.xt(Handle.GetBuddyOnline, handleGetBuddyOnlineList);
handler.xt(Handle.GetBuddyOnlineB, handleGetBuddyOnlineList);

handler.xt(Handle.BuddyRequest, handleBuddyRequest);
handler.xt(Handle.BuddyRequestB, handleBuddyRequest);

handler.xt(Handle.BuddyAccept, handleBuddyAccept);
handler.xt(Handle.BuddyAcceptB, handleBuddyAccept);

handler.xt(Handle.BuddyDecline, handleBuddyDecline);
handler.xt(Handle.BuddyDeclineB, handleBuddyDecline);

handler.xt(Handle.BuddyRemove, handleBuddyRemove);
handler.xt(Handle.BuddyRemoveB, handleBuddyRemove);

handler.xt(Handle.BuddyMessage, handleBuddyMessage);
handler.xt(Handle.BuddyMessageB, handleBuddyMessage);

const getPlayerOldHandler = ({ world, penguin, room }: { world: World; penguin: WorldPenguin, room: WorldRoom }, playerId: number | string) => {
  if (!world.data.isPreCpip()) {
    return;
  }
  const targetId = Number(playerId);
  if (Number.isNaN(targetId)) {
    return;
  }
  const target = world.getPenguin(targetId);
  if (target !== undefined) {
    const targetRoom = world.getContext(target.getClient())?.room;
    if (targetRoom !== undefined) {
      penguin.sendXt('gp', target.getString(targetRoom.getState(target)), targetRoom.getId());
      return;
    }
  }
  const targetPenguin = Penguin.getById(targetId);
  if (targetPenguin !== undefined) {
    penguin.sendXt('gp', targetPenguin.getEngine1Crumb(), 0);
    return;
  }
  // fallback: respond with minimal crumb so client doesn't hang
  const crumb = `${targetId}|Unknown|0|0|0|0|0|0|0|0|0|0|0|0|0`;
  penguin.sendXt('gp', crumb, 0);
};

handler.xt(Handle.SendCardOld, ({ world, penguin }, recipientId, cardId, cost) => {
  if (!world.data.isPreCpip()) {
    return;
  }

  const postcardCost = 10;
  const recipient = world.getPenguin(recipientId);
  if (recipient !== undefined) {
    recipient.info.receivePostcard(cardId, {senderId: penguin.id, senderName: penguin.info.name});
    recipient.sendXt('sc', penguin.id, penguin.info.name, cardId);
    recipient.info.update();
  }

  penguin.info.removeCoins(postcardCost);
  penguin.sendXt('gc', penguin.info.coins);
  penguin.info.update();
});

// handler for 2007 client
handler.xt(Handle.GetInventory2007, ({ penguin }) => {
  penguin.sendInventory();
});

handler.xt(Handle.SetFrameOld, ({ room, penguin }, frame) => {
  room.setFrame(penguin, frame);
  room.sendXt('sf', penguin.id, frame);
})

handler.xt(Handle.JoinIglooOld, ({ world, penguin }, id, isMember) => {
  const ownerId = Number(id);
  const ownerClient = world.getPenguin(ownerId);
  let igloo = ownerClient?.info.activeIgloo;

  if (igloo === undefined && ownerId === penguin.id) {
    igloo = penguin.info.activeIgloo;
  }

  if (igloo === undefined) {
    const penguin = Penguin.getById(ownerId);
    if (penguin !== undefined) {
      igloo = penguin.activeIgloo;
    }
  }

  if (igloo === undefined) {
    return;
  }

  const args: Array<string | number> = [ownerId, igloo.type];

  // when igloo music was added, the music parameter is optional
  if (world.data.hasIglooMusicReleased()) {
    args.push(igloo.music);
  }

  // client misteriously removes the first element of the furniture
  penguin.sendXt('jp', ...args, ',' + WorldPenguin.getFurnitureString(igloo.furniture));
  const roomId = 2000 + ownerId;
  world.getRoom(roomId).addPenguin(penguin, 0, 0);
});

// open igloo to the public
handler.xt(Handle.OpenIglooOld, ({ world, penguin }, id) => {
  if (!world.data.isPreCpip()) {
    return;
  }
  if (id !== penguin.id) {
    return;
  }
  world.openIgloo(penguin);
  // client.server.openIgloo(client.penguin.id, client.penguin.activeIgloo);
});

// close igloo to the public
handler.xt(Handle.CloseIglooOld, ({ world, penguin }, id) => {
  if (!world.data.isPreCpip()) {
    return;
  }
  if (id !== penguin.id) {
    return;
  }
  world.closeIgloo(penguin);
});

// get list of open igloos (member igloos)
handler.xt(Handle.GetOpenIgloosOld, ({ world, penguin }) => {
  if (!world.data.isPreCpip()) {
    return;
  }
  const players = world.getOpenIglooPlayers();
  if (players.length === 0) {
    penguin.sendXt('gr');
    return;
  }
  penguin.sendXt('gr', ...players.map((p) => `${p.id}|${p.info.name}`));
});

handler.xt(Handle.GetIgloo2007, ({ world, penguin }, id) => {
  const targetId = Number(id);
  const targetClient = world.getPenguin(targetId);
  let igloo = targetClient?.info.activeIgloo;

  if (igloo === undefined && targetId === penguin.id) {
    igloo = penguin.info.activeIgloo;
  }

  if (igloo === undefined) {
    const penguin = Penguin.getById(targetId);
    if (penguin !== undefined) {
      igloo = penguin.activeIgloo;
    }
  }

  if (igloo === undefined) {
    return;
  }

  penguin.sendXt('gm', targetId, igloo.type, igloo.music, igloo.flooring, WorldPenguin.getFurnitureString(igloo.furniture));
});

handler.xt(Handle.GetFurnitureOld, ({ penguin }) => {
  const furniture: number[] = [];
  penguin.info.getAllFurniture().forEach(furn => {
    for (let i = 0; i < furn[1]; i++) {
      furniture.push(furn[0]);
    }
  })

  penguin.sendXt('gf', ...furniture);
});

handler.xt(Handle.GetFurniture2007, ({ penguin }) => {
  const furniture: number[] = [];
  penguin.info.getAllFurniture().forEach(furn => {
    for (let i = 0; i < furn[1]; i++) {
      furniture.push(furn[0]);
    }
  })

  penguin.sendXt('gf', ...furniture);
});

handler.xt(Handle.GetPlayerOld, getPlayerOldHandler);
handler.xt(Handle.GetPlayerOldAlt, getPlayerOldHandler);

const handleAddFurniture = ({ penguin }: { penguin: WorldPenguin; }, id: number) => {
  const item = FURNITURE.getStrict(id);
  penguin.addFurniture(id, { cost: item.cost });
  penguin.info.update();
};

handler.xt(Handle.AddFurnitureOld, handleAddFurniture);
handler.xt(Handle.AddFurniture2007, handleAddFurniture);

const handleAddIgloo = ({ penguin }: { penguin: WorldPenguin; }, iglooType: number) => {
  const cost = getIglooCost(iglooType);
  penguin.info.removeCoins(cost);
  penguin.info.addIgloo(iglooType);
  // unknown if music was reset or not in the original
  penguin.info.updateIgloo({ type: iglooType, music: 0, flooring: 0, furniture: [] });
  penguin.sendXt('au', iglooType, penguin.info.coins);
  penguin.info.update();
};

handler.xt(Handle.AddIglooOld, handleAddIgloo);
handler.xt(Handle.AddIgloo2007, handleAddIgloo);

const handleAddFlooring = ({ penguin }: { penguin: WorldPenguin; }, flooring: number) => {
  const cost = getFlooringCost(flooring);
  penguin.info.updateIgloo({ flooring });
  penguin.info.removeCoins(cost);
  penguin.sendXt('ag', flooring, penguin.info.coins);
  penguin.info.update();
};

handler.xt(Handle.AddFlooring2007, handleAddFlooring);

export function processFurniture(furnitureItems: string[]): IglooFurniture {
  return furnitureItems.map((furnitureString) => {
    const [furniture, x, y, rotation, frame] = furnitureString.split('|').map((str) => Number(str))
    return {
      id: furniture,
      x,
      y,
      rotation,
      frame
    }
  })
}

handler.xt(Handle.UpdateIglooOld, ({ penguin }, type, ...rest) => {
  // music ID is placed at the start, though it may not be present
  let furnitureItems: string[];
  let music: number;
  if (rest[0].includes('|')) {
    furnitureItems = rest;
    music = 0;
  } else {
    music = Number(rest[0]);
    furnitureItems = rest.slice(1);
  }
  
  const igloo = processFurniture(furnitureItems);
  penguin.info.updateIgloo({ furniture: igloo, type: Number(type), music });
  penguin.info.update();
});

handler.xt(Handle.UpdateIgloo2007, ({ penguin }, ...furnitureItems) => {
  const igloo = processFurniture(furnitureItems);
  penguin.info.updateIgloo({ furniture: igloo });
  penguin.info.update();
});

handler.xt(Handle.UpdateIglooMusic2007, ({ penguin }, music) => {
  penguin.info.updateIgloo({ music });
  penguin.info.update();
});

// check if is an epf agent
handler.xt(Handle.GetEpfStatus, ({ penguin }) => {
  penguin.sendXt('epfga', penguin.info.hasItem(8009) ? 1 : 0);
});

// check if there is an active field ops
handler.xt(Handle.GetFieldOps, ({ penguin }) => {
  // sends an integer boolean, FALSE if there is an active field ops
  // that wasn't done
  penguin.sendXt('epfgf', 0);
});

// client requesting epf medals
handler.xt(Handle.GetEpfMedals, ({ penguin }) => {
  penguin.sendXt('epfgr', penguin.info.careerMedals, penguin.info.ownedMedals);
});

// buying item from EPF catalogue
handler.xt(Handle.AddEpfItem, ({ world, penguin }, itemId) => {
  const item = world.data.getItem(itemId);
  if (item === undefined) {
    throw new Error(`Item not found in database ${itemId}`);
  }
  if (!item.isEPF) {
    throw new Error(`Item ${itemId} is marked as not being from EPF, but is being bought through it`);
  }

  penguin.info.addItem(item.id);
  penguin.info.removeEpfMedals(item.cost);

  penguin.sendXt('epfai', penguin.info.ownedMedals);
  penguin.info.update();
})

// becoming an agent
handler.xt(Handle.BecomeEpfAgent, ({ penguin }) => {
  penguin.info.makeAgent();
  penguin.sendXt('epfsa', 1); // 1 is "true" for being agent
  penguin.info.update();
})

// add medals from completing PSA mission
handler.xt(Handle.GrantEpfMedals, ({ penguin }, medals) => {
  penguin.info.addEpfMedals(medals);
  penguin.info.update();
});

// epf stamps, a seemingly unused system that was only implemented for one stamp of system defender
handler.xt(Handle.EPFStamps, ({ penguin }, stamp) => {
  if (!penguin.info.isAgent) {
    penguin.sendXt('epfsf', 'naa'); // TODO document
  }

  if (penguin.info.hasStamp(stamp)) {
    penguin.sendXt('epfsf', 'ahm'); // TODO document
  } else {
    penguin.sendXt('epfsf', 'nem', stamp); // giving the stamp
  }
});


handler.xt(Handle.GetPartyOp, ({ world, penguin }) => {
  const op = world.data.getPartyOp();

  if (op === 'battle-of-doom') {
    penguin.sendXt('epfgp', penguin.info.completedBattleOfDoom ? 1 : 0);
  }
});

handler.xt(Handle.SetPartyOp, ({ world, penguin }, completed) => {
  const op = world.data.getPartyOp();

  if (completed === 1) {
    if (op === 'battle-of-doom') {
      penguin.info.setBattleOfDoomCompleted();
    }
  }

  penguin.info.update();
});

// get all owned igloo types
handler.xt(Handle.GetIglooTypes, ({ penguin }) => {
  const iglooTypes = penguin.info.getIglooTypes()
  penguin.sendXt('go', iglooTypes.join('|'))
});

handler.xt(Handle.GetFurniture, ({ penguin }) => {
  penguin.sendXt('gf', penguin.getFurnitureString())
})

handler.xt(Handle.AddFurniture, ({ penguin }, furniture) => {
  const item = FURNITURE.getStrict(furniture);
  penguin.addFurniture(furniture, { cost: item.cost });
  penguin.info.update();
})

function addFullHouseStamp(penguin: WorldPenguin) {
  penguin.giveStamp(23);
}

// saving client new igloo
handler.xt(Handle.UpdateIgloo, ({ penguin }, ...furnitureItems) => {
  const igloo = processFurniture(furnitureItems);
  if (igloo.length === 99) {
    addFullHouseStamp(penguin);
  }
  penguin.info.updateIgloo({ furniture: igloo });
  penguin.info.update();
})

// save the igloo music (v2)
handler.xt(Handle.UpdateIglooMusic, ({ penguin }, music) => {
  penguin.info.updateIgloo({ music });
  penguin.info.update();
})

// buying flooring
handler.xt(Handle.AddFlooring, ({ world, penguin }, flooring) => {
  const cost = getFlooringCost(flooring);
  if (world.data.isPreCpip()) {
    // in this engine, flooring inventory did not exist
    // and buying immediately applied the flooring
    penguin.info.updateIgloo({ flooring });
  } else {
    penguin.info.addFlooring(flooring);
  }
  penguin.info.removeCoins(cost);

  penguin.sendXt('ag', flooring, penguin.info.coins);
  penguin.info.update();
})

function discountIglooTypeCost(penguin: WorldPenguin, type: number): void {
  const cost = getIglooCost(type);
  if (cost !== undefined) {
    penguin.info.removeCoins(cost);
  }
}

// buying igloo
handler.xt(Handle.AddIgloo, ({ world, penguin }, igloo) => {
  discountIglooTypeCost(penguin, igloo);
  // pre owned igloos
  if (!world.data.isAfterOwnedIgloos()) {
    penguin.info.updateIgloo({ type: igloo });
  } else {
    penguin.info.addIgloo(igloo);
  }
  penguin.sendXt('au', igloo, penguin.info.coins);
  penguin.info.update();
})

// saving igloo type
handler.xt(Handle.UpdateIglooType, ({ penguin }, type) => {
  penguin.info.updateIgloo({ type });
  penguin.info.update();
})

handler.xt(Handle.GetMusicTracks, ({ penguin }) => {
  const playerTracks: string[] = []; // TODO player tracks
  penguin.sendXt('getmymusictracks', playerTracks.length, playerTracks.join(','));
})

// get igloo likes
handler.xt(Handle.GetIglooLikes, ({ penguin }) => {
  const id = 1; // TODO Unsure what this ID is
  const likeCount = 0; // TODO like system
  // TODO unsure what this 200 is
  penguin.sendXt('gili', id, 200, JSON.stringify({
    likedby: {
      counts: {
        count: likeCount,
        maxCount: likeCount,
        accumCount: likeCount
      },
      IDs: []
    }
  }));
})

// get DJ3K tracks
handler.xt(Handle.GetDj3kTracks, ({ penguin }) => {
  penguin.sendXt('ggd', '');
})

function getModernIglooString(igloo: Igloo, index: number) {
  // TODO like stuff
  const likeCount = 0;
  const furnitureString = WorldPenguin.getFurnitureString(igloo.furniture);
  return [
    igloo.id,
    index,
    0, // TODO don't know what this is
    igloo.locked ? 1 : 0,
    igloo.music,
    igloo.flooring,
    igloo.location,
    igloo.type,
    likeCount,
    furnitureString
  ].join(':');
} 

// get all igloo layouts
handler.xt(Handle.GetAllIglooLayouts, ({ penguin }) => {
  const layouts = penguin.info.getAllIglooLayouts().map((layout, index) => {
    return getModernIglooString(layout, index);
  });
  // TODO unsure what the 0 is
  penguin.sendXt('gail', penguin.id, 0, ...layouts);
})

// update igloo (v3)
handler.xt(Handle.UpdateIglooNew, ({ penguin }, layoutId, type, flooring, location, music, furnitureData) => {
  penguin.info.setActiveIgloo(layoutId);

  // if empty, the split function used will cause issues with ghost furniture
  const furniture = furnitureData === '' ? [] : processFurniture(furnitureData.split(','));
  if (furniture.length >= 99) {
    addFullHouseStamp(penguin);
  }
  penguin.info.updateIgloo({ type, music, flooring, location, furniture });
  penguin.info.update();
});

// add layout
handler.xt(Handle.AddIglooLayout, ({ penguin }) => {
  const igloo = penguin.info.addIglooLayout();
  
  // TODO document better what this slot-index is for in the engine 3 string
  const slot = penguin.info.getAllIglooLayouts().length;
  
  penguin.sendXt('al', penguin.id, getModernIglooString(igloo, slot));
  penguin.info.update();
});

// update active igloo layout
handler.xt(Handle.UpdateIglooLayout, ({ penguin }, layoutId) => {
  // TODO what is 2nd argument for? (combination of slots and if they are locked)
  penguin.info.setActiveIgloo(layoutId);
  penguin.info.update();
});

// add location
handler.xt(Handle.AddIglooLocation, ({ penguin }, location) => {
  // TODO adding cost deducting
  penguin.info.addIglooLocation(location);
  penguin.sendXt('aloc', location, penguin.info.coins);
  penguin.info.update();
});

// open igloo
handler.xt(Handle.OpenIgloo, ({ world, penguin }, id, name) => {
  world.openIgloo(penguin);//, penguin.info.activeIgloo);
});

// close igloo
handler.xt(Handle.CloseIgloo, ({ world, penguin }, id) => {
  world.closeIgloo(penguin);
});

// get all open igloos
handler.xt(Handle.GetOpenIgloos, ({ world, penguin }) => {
  const players = world.getOpenIglooPlayers();

  // TODO need to figure out how to make this penguin "nickname" properly display
  // on showHint, without modding. Seems to require an old shell
  // (and for the newer shells, what is the proper map SWF to use?)
  penguin.sendXtEmptyLast('gr', ...players.map(p => `${p.id}|${p.info.name}`));
});

// sending inventory to player
handler.xt(Handle.GetInventory, ({ penguin }) => {
  penguin.sendInventory();
});

handler.xt(Handle.UpdateColor, ({ room, penguin }, id) => {
  room.updateEquipment(penguin, 'color', id);
  penguin.info.update();
});

handler.xt(Handle.UpdateHead, ({ room, penguin }, id) => {
  room.updateEquipment(penguin, 'head', id);
  penguin.info.update();
});

handler.xt(Handle.UpdateFace, ({ room, penguin }, id) => {
  room.updateEquipment(penguin, 'face', id);
  penguin.info.update();
});

handler.xt(Handle.UpdateNeck, ({ room, penguin }, id) => {
  room.updateEquipment(penguin, 'neck', id);
  penguin.info.update();
});

handler.xt(Handle.UpdateBody, ({ room, penguin }, id) => {
  room.updateEquipment(penguin, 'body', id);
  penguin.info.update();
});

handler.xt(Handle.UpdateHand, ({ room, penguin }, id) => {
  room.updateEquipment(penguin, 'hand', id);
  penguin.info.update();
});

handler.xt(Handle.UpdateFeet, ({ room, penguin }, id) => {
  room.updateEquipment(penguin, 'feet', id);
  penguin.info.update();
});

handler.xt(Handle.UpdatePin, ({ room, penguin }, id) => {
  room.updateEquipment(penguin, 'pin', id);
  penguin.info.update();
});

handler.xt(Handle.UpdateBackground, ({ room, penguin }, id) => {
  room.updateEquipment(penguin, 'background', id);
  penguin.info.update();
});

// mail system
handler.xt(Handle.GetMail, ({ penguin }) => {
  penguin.sendXt('mst', penguin.info.getUnreadMailTotal(), penguin.info.getMailTotal());
});

// opened the postcards
handler.xt(Handle.SetMailCheck, ({ penguin }) => {
  penguin.info.setAllMailAsRead();
  penguin.info.update();
})

// donate coins for coins for change
handler.xt(Handle.DonateCoins, ({ penguin }, choice, donation) => {
  // choice is useless, since we are not trying to rewrite history unfortunately

  // client doesn't check if can donate
  if (penguin.info.coins >= donation) {
    penguin.info.removeCoins(donation);
  } else {
    penguin.sendError(401);
  }

  penguin.sendXt('dc', penguin.info.coins);
  penguin.info.update();
})

handler.xt(Handle.RetrieveMedieval2012, ({ penguin }) => {
  const medievalMessage = penguin.info.medieval2012Message;
  penguin.sendXt('sent', JSON.stringify({
    'msgViewedArray': [medievalMessage >= 1 ? 1 : 0, medievalMessage >= 2 ? 1 : 0]
  }));
});

handler.xt(Handle.Medieval2012ViewedMessage, ({ penguin }, messageIndex) => {
  // message is index of an array (0-indexed)
  penguin.info.medieval2012Message = messageIndex + 1;
  penguin.info.update();
});

handler.xt(Handle.GetBakeryState, ({ world }) => {
  world.getBakery().sendBakeryState();
});

handler.xt(Handle.SendEmote, ({ world, room }, emote) => {
  if (!world.data.hasBakery()) {
    return;

  }
  const bakery = world.getBakery();
  // party3
  if (room.getId() === bakery.room.getId() && Number(emote) === bakery.emote) {
    bakery.incrementCheer();
  }
});

handler.xt(Handle.SendEnterHopper, ({ world }, type) => {
  // this is a recreation of this handler, it is unknown if the original handler sent the snowball type or not
  // the type was added to prevent bugs with people spamming snowballs
  // however, the way this was added isn't perfect and it's likely it didn't really check the types, as the shell function
  // never receives the snowball thrown event information, and instead I had to fetch it directly from the transformation
  // which introduces the bug of the player walking mid snowball throw
  const bakery = world.getBakery();
  const enumType = type.match(/\[ball(\w+)\|\d+\]/);
  if (enumType !== null) {
    const ingredient = {
      'Candy': 'Candy',
      'Egg': 'Eggs',
      'Tire': 'Tire',
      'Hay': 'Hay',
      'Flour': 'Flour',
      'Milk': 'Milk'
    }[enumType[1]];
    if (bakery.currentIngredient === ingredient) {
      bakery.nextIngredient();
    }
  }
});

handler.xt(Handle.GetCookieInventory, ({ penguin }) => {
  // placeholder just so that the animation works
  // cookie stock should theoreticailly increase when the bakery happens and decrease when a transformation happens
  // none of that is implemented however
  // and the max cookie variable is an unknown

  // current, max
  penguin.sendXt('ctc', 500, 1000);
});

// TODO remove this global state.
const teamScore: number[] = [0, 0];

// TODO change these as method for room (or a class PuckRoom as a context entity)
function getPuckPosition(world: World, room: WorldRoom): Array<number> | null {
  if (room.getId() === 802) {
    return world.getPuckPosition();
  }
  if (room.getId() === 898) {
    // Client is in the Pitch room during the Penguin Games 2008
    return world.getPuckPositionParty();
  }
  return null;
}

handler.xt(Handle.GetHockeyGame, ({world, room, penguin }) => {
  const vector = getPuckPosition(world, room);
  if (vector === null) {
    return;
  }
  penguin.sendXt('gz', ...vector, ...teamScore);
});

handler.xt(Handle.MoveHockeyPuck, ({ world, room }, penguinId, x, y, ...speed) => {
  const vector = getPuckPosition(world, room);
  if (vector === null) {
    return;
  }
  vector[0] = x;
  vector[1] = y;
  room.sendXt('zm', penguinId, x, y, ...speed);
});

handler.xt(Handle.MoveHockeyPuckOld, ({ world, room }, x, y) => {
  const vector = getPuckPosition(world, room);
  if (vector === null) {
    return;
  }
  vector[0] = x;
  vector[1] = y;
  room.sendXt('zm', x, y);
});

handler.xt(Handle.UpdateHockeyGame, ({ room }, team) => {
  if (room.getId() !== 802) {
    return;
  }

  teamScore[team] = (teamScore[team] + 1) % 10;

  room.sendXt('uz', ...teamScore);
});

const getPuffleString = (puffle: PlayerPuffle): string => {
  return [
    puffle.id,
    puffle.name,
    puffle.type,
    100,
    100,
    100,
    100,
    100,
    100
  ].join('|')
}

handler.xt(Handle.AdoptPuffle, ({ world, penguin }, puffleType, puffleName) => {
  if (world.data.isVanillaEngine()) {
    return;
  }
  let cost = 800;

  if (puffleType == 9 && world.data.isBrownPuffleFree()) { // free brown puffle
    cost = 0;
  }

  if (penguin.info.coins < cost) {
    // TODO no coins error
  } else if (false) {
    // TODO too many puffles error
  }
  penguin.info.removeCoins(cost)
  const puffle = penguin.info.addPuffle(puffleName, puffleType);
  penguin.sendXt('pn', penguin.info.coins, getPuffleString(puffle));

  penguin.addPostcard(111, { details: puffleName });
  penguin.info.update();
  // TODO favorite item code in houdini?
  // TODO 'pgu' is necessary?
})

enum PuffleCategory {
  Normal,
  Rainbow,
  Gold,
  Creature
};

handler.xt(Handle.AdoptPuffleNew, ({ world, penguin }, puffleType, puffleName, puffleSubType) => {
  if (!world.data.isVanillaEngine()) {
    return;
  }

  let category: PuffleCategory;
  if (puffleType === 10) {
    category = PuffleCategory.Rainbow;
  } else if (puffleType === 11) {
    category = PuffleCategory.Gold;
  } else if (puffleSubType === 0) {
    category = PuffleCategory.Normal;
  } else {
    category = PuffleCategory.Creature;
  }
  // TODO dynamic cost for eg creatures, changing to 800 for earlier times
  // gold puffles must be 0
  let puffleCost = 400;
  if (category === PuffleCategory.Creature) {
    puffleCost = 800;
  } else if (category === PuffleCategory.Gold) {
    puffleCost = 0;
  }

  const puffleId = Number(puffleSubType === 0 ? puffleType : puffleSubType);
  const puffle = PUFFLES.get(puffleId);
  if (puffle === undefined) {
    throw new Error(`Puffle of ID ${puffleId} was not found in the database`);
  }

  if (category === PuffleCategory.Rainbow) {
    // rainbow puffle
    // upon adopting a puffle, its progress resests meaning
    // you'd need to redo the quest for a new one
    penguin.info.resetRainbowQuest();
  } else if (category === PuffleCategory.Gold) {
    penguin.resetGoldNuggetState();
    penguin.info.removeGoldPuffleNuggets();
  } else if (category === PuffleCategory.Creature) {
    if (puffle.favouriteToy === undefined) {
      throw new Error(`Non creature puffle did not have a favorite toy: ${puffle}`);
    }
    penguin.buyPuffleItem(3, 0, 5);
    penguin.buyPuffleItem(79, 0, 1);
    penguin.buyPuffleItem(puffle.favouriteToy, 0, 1);
  }

  penguin.info.removeCoins(puffleCost);
  const playerPuffle = penguin.info.addPuffle(puffleName, puffleId);

  penguin.sendXt('pn', penguin.info.coins, [
    playerPuffle.id,
    ...getClientPuffleIds(puffle.id),
    puffle.name,
    Math.floor(Date.now() / 1000),
    100, 100, 100, 100, 0, 0 // TODO no clue what these number are
  ].join('|'));
  penguin.addPostcard(111, { details: playerPuffle.name });

  // TODO: this has two assumptions about how backyard reallocation worked. If possible it would be nice to verify them
  // assumption 1: if you have 10 puffles and adopt one, a backyward slot is immediately freed
  // even before the walking puffle is sent to the igloo
  // assumption 2: the puffle to be reallocated is chosen as the first puffle you've adopted that is not in the backyard
  const pufflesInIgloo = penguin.info.getPuffles().filter((puffle) => !penguin.info.isInBackyard(puffle.id));
  if (pufflesInIgloo.length > 10) {
    penguin.swapPuffleFromIglooAndBackyard(pufflesInIgloo[0].id, true);
  }

  penguin.info.update();
}, {
  // without cooldown, this can be spammed in the Engine 3 client,
  // allowing a second puffle to be bought
  // It is unknown if the original had this issue so we are correcting it
  cooldown: 2000
});

// get puffles in igloo
handler.xt(Handle.GetIglooPuffles, ({ world, penguin }, id, iglooType) => {
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
  
    penguin.sendXt('pg', ...puffles);
  } else if (world.data.isVanillaEngine()) {
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
    penguin.sendXt('pg', puffles.length, ...puffles);
  }
})

// walking puffle engine 2
handler.xt(Handle.WalkPuffle, ({ world, penguin }, puffleId, walking) => {
  if (world.data.isVanillaEngine()) {
    return;
  }
  // TODO add puffle refusing to walk
  // TODO add removing puffle

  penguin.walkPuffle(puffleId);

  // TODO make the room send XT to everyone
  penguin.sendXt('pw', penguin.id, `${puffleId}||||||||||||${walking}`);
  penguin.info.update();
})
// walking puffle Engine 3
handler.xt(Handle.WalkPuffle, ({ world, penguin }, penguinPuffleId, walking) => {
  if (!world.data.isVanillaEngine()) {
    return;
  }

  const playerPuffle = penguin.info.getPuffles().find((puffle) => puffle.id === penguinPuffleId);
  if (playerPuffle === undefined) {
    throw new Error(`Walk puffle: could not find puffle in inventory: ${penguinPuffleId}`);
  }

  if (walking === 1) {
    penguin.walkPuffle(playerPuffle.id);
  } else {
    penguin.unwalkPuffle();
  }

  penguin.sendXt('pw', penguin.id, playerPuffle.id, ...getClientPuffleIds(playerPuffle.type), walking, 0); // TODO hat stuff (last argument)
  penguin.info.update();
  // TODO removing puffle, other cases, properly walking puffle in penguin
})

// Engine 3 puffle name check
handler.xt(Handle.CheckPuffleName, ({ penguin }, puffleName) => {
  // last argument is integer boolean
  penguin.sendXt('checkpufflename', puffleName, 1);
})

// endpoint that checks name used by some puffles (rainbow puffle, gold puffle)
// potentially a predecessor to the one above
handler.xt(Handle.CheckPuffleNameAlt, ({ penguin }, puffleName) => {
  penguin.sendXt('pcn', puffleName, 1);
})

/** Brush, bath, sleep, basically functionalities disguised as items */
const BASE_CARE_INVENTORY = [1, 8, 37];

// get inventory for pet care items
handler.xt(Handle.GetPuffleInventory, ({ penguin }) => {
  penguin.sendXt(
    'pgpi',
    ...BASE_CARE_INVENTORY.map((item) => `${item}|1`),
    ...penguin.info.getAllPuffleItems().map((entry) => `${entry[0]}|${entry[1]}`)
  );
})

// send a puffle to or from the backyard
handler.xt(Handle.PuffleBackyardSwap, ({ penguin }, playerPuffleId, destination) => {
  penguin.swapPuffleFromIglooAndBackyard(playerPuffleId, destination === 'backyard');
  penguin.sendXt('puffleswap', playerPuffleId, destination);
  penguin.info.update();
})

function sendGoldNuggets(penguin: WorldPenguin): void {
  // TODO what is the first 1?
  penguin.sendXt('currencies', `1|${penguin.info.nuggets}`);
}

/** Possible treasure types and their client-side IDs */
enum TreasureType {
  Coins = 0,
  Food = 1,
  Furniture = 2,
  Clothing = 3,
  Gold = 4
};

/**
 * Send packet for client to dig
 * @param target For coins, it is how many coins earned, for nuggets, how many nuggets, for items, the item ID
 * */
function sendPuffleDig(room: WorldRoom, penguin: WorldPenguin, treasureType: TreasureType, target: number): void {
  let coins: number = 0;
  let itemId: number = 0;
  if (treasureType === TreasureType.Coins) {
    coins = target;
  } else if (treasureType === TreasureType.Gold) {
    // TODO not sure why 1.
    itemId = 1;
    coins = target;
  } else {
    itemId = target;
  }
  // TODO multiplayer logic so it sneds to everyone in room
  room.sendXt('puffledig', penguin.id, penguin.walkingPuffle ?? 0, treasureType, itemId, coins, penguin.info.hasDug ? 0 : 1);
}

/** ID of all items that are a puffle's favorite food */
const PUFFLE_FOOD = [105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 128];

// currently all item lists BELOW come from the Wiki, there's no way to verify
// their veracity, or if they all had the same chance of being found

/** ID of all clothing a normal puffle can dig out */
const REGULAR_PUFFLE_CLOTHING = [
  3028,
  232,
  412,
  112,
  184,
  1056,
  6012,
  118,
  774,
  366,
  103,
  498,
  469,
  1082,
  5196,
  790,
  4039,
  326,
  105,
  122,
  5080,
  111
];

const REGULAR_PUFFLE_FURNITURE = [
  305,
  313,
  504,
  506,
  500,
  503,
  501,
  507,
  505,
  502,
  616,
  542,
  340,
  150,
  149,
  369,
  370,
  300
];

const GOLD_PUFFLE_CLOTHING = [
  2139,
  2137,
  5385,
  3185,
  5384,
  5386,
  6209,
  2138,
  1735,
  3186,
  1734,
  2136,
  4994,
  4993,
  3187
];

const GOLD_PUFFLE_FURNITURE = [
  2132,
  2131,
  2130,
  2129
];

const PUFFLE_CREATURE_CLOTHING = [
  24073,
  24075,
  24078,
  24074,
  24080,
  24076,
  24081,
  24071,
  24072,
  24077,
  24079,
  24070,
  24031, // TODO Originally dinossaur only
  24030, // Originally dinossaur only
  24033, // Originally dinossaur only
  24029, // Originally dinossaur only
  4414,
  122,
  366,
  790,
  232
];

const PUFFLE_CREATURE_FURNITURE = [
  2180, // Originally dinossaur only
  2182, // Originally dinossaur only
  2183, // Originally dinossaur only
  506,
  504,
  501,
  507,
  505,
  503,
  500,
  502,
  340,
  305,
  150,
  370,
  300,
  616,
  313
];

/**
 * Carries out the action of a client to dig with a puffle
 * @param client 
 * @param onCommand Whether or not the dig happened by command or randomly
 */
function dig(room: WorldRoom, penguin: WorldPenguin, onCommand: boolean) {
  // PUFFLE DIG MECHANICS
  // Puffle digging is a completely server-side feature and with a big amount of variables,
  // and for that it is very hard to accurately implement it
  // Finding gameplay footage of this is extremely difficult, and as such, the amount of practical
  // documentation is low, mostly of what we know is a few videos and just word of mouth from people
  // Here everything known and not known will be documented in an effort to make this algorithm as
  // clear and transparent as possible to what might've been implemented in the game at some point

  // # Probability of the event failing
  // when you don't command the puffle dig, there seems to be a chance that no dig will happen
  // which is meant to be responded with a "nodig" packet. It is completely unknown
  // what influences this
  // For WF, we will consider this chance to be 1/2
  // TODO investigate client-side what this packet is. Since it has no response, it is hard to know
  // if it happened or not while watching videos, so studying the client will be important
  if (!onCommand) {
    if (Math.random() > 0.5) {
      // TODO Not sure what the last 1 is
      penguin.sendXt('nodig', penguin.id, 1);
      return;
    }
  }

  // "Puffle Dig" stamp
  // Stamp for digging for the first time
  // Note: It is unknown if command allows this to happen, but due to the complete lack of footage
  // we will stick with what is reasonable, and it probably did work, it would've been weird
  // for them to make an exception in the code for this
  penguin.giveStamp(489);

  const playerPuffle = penguin.info.getPuffles().find((puffle) => puffle.id === penguin.walkingPuffle);
  if (playerPuffle === undefined) {
    throw new Error(`Player is walking puffle ${penguin.walkingPuffle} which they don't have`);
  }
  const puffleType = playerPuffle.type;

  // every color stamp, which requires you to dig with
  // 11 different color puffles (excludes puffle creatures)
  // it is unknown if this is per session
  // or not, unless evidence is found otherwise
  // it will remain in session
  penguin.addDugPuffleColor(puffleType);
  if (penguin.getTotalColorsDug() >= 11) {
    penguin.giveStamp(491);
  }

  // dig all day stamp, which reportedly kept track of everything in the past 24hrs
  // it is likely that it persisted sessions although there's no concrete evidence
  // (finding evidence for this would be very hard)
  // there is also no evidence saying that coins count but 
  // it is known it counted with puffle nuggets, so it probably
  // did count with coins too
  const DIG_ALL_DAY_STAMP = 492;
  if (!penguin.info.hasStamp(DIG_ALL_DAY_STAMP)) {
    penguin.info.addTreasureFind();

    if (penguin.info.getTreasureFindsInLastDay() >= 5) {
      penguin.giveStamp(DIG_ALL_DAY_STAMP);
      penguin.info.clearTreasureFinds();
    }
  }

  // Save that have done digging
  if (!penguin.info.hasDug) {
    penguin.info.setHaveDug();
  }

  // digging for gold nuggets
  // when you are in this state, only nuggets can show up. It seems that
  // you can get 1-3 nuggets per dig (proven by client files)
  // no concrete proof of the distribution but from looking at a few videos,
  // it feels uniformly distributed
  if (penguin.isGoldNuggetState()) {
    const nuggets = randomInt(1, 3);
    penguin.info.addNuggets(nuggets);
    
    sendGoldNuggets(penguin);
    sendPuffleDig(room, penguin, TreasureType.Gold, nuggets);
    
    penguin.info.update();
    return;
  }

  // # Probability of each dig type
  // There are four main types of things that can be obtained from puffle digging, which depend
  // on which puffle you have
  // 1. Coins
  // 2. Furniture
  // 3. Items
  // 4. Food (Except Puffle Creatures)
  // 
  // Aditionally, non-members can only get COINS, and if you have a golden puffle, there are only two types,
  // which are coins and the golden items
  //
  // The probabilities of the events are widely unresearched. The club penguin wiki and solero claims that
  // these chances are influenced by age of the puffle and its health. It is however unknown how they
  // are influenced, the wiki claims that age influences the "rarity" of items and the amount of coins,
  // while also claiming that the health increases the amount of coins and the number of rare items you can get
  // (it is possible that rarity is just a miswrite, and it just increases the chances of getting items)
  // Supermanover made some research and found the odds to be somewhere along 1/2 coins, 1/2 the remaining items
  // Since we don't have much to work with it, we are not really making any assumptions about how much
  // the puffle stats influence, and we are giving basic probabilities

  // getting coins: 50% if member, guaranteed otherwise
  // NOTE/TODO: There are certain footages that may indicate that puffle creatures are less likely
  // to get coins, while normal puffle might have as high as 80% coin rate, but this is still
  // not founded with great evidence
  if (!penguin.info.isMember || Math.random() > 0.5) {
    // this video shows that on a fresh account you can get up to 256 coins
    // https://youtu.be/EKf9E9Wg058?t=419
    // On the wiki sits an image of someone receiveing 1133 coins, but it is likely not a fresh Puffle
    // Since we have no clues on how this algorithm works and WF is focused on speedrunning eg. fresh states
    // we will maintain this basic algorithm between 1 and 256.
    // TODO: Add a system which would increase coins with bigger age. (Granted, it wouldn't be very useful in a singleplayer client)
    const coins = randomInt(1, 256);
    if (coins >= 50) {
      // Big Dig stamp
      penguin.giveStamp(493);
    }
    penguin.info.addCoins(coins);
    sendPuffleDig(room, penguin, TreasureType.Coins, coins);
    penguin.info.update();
    return;
  }

  // Options array will store all the possible remaining item types and the option will be chosen from this
  // array randomly with equal chances since we don't know if there are specific chance
  // it's also unknown if golden puffle had
  // equal odds for clothing and furniture
  type PoolType = 'clothing' | 'furniture' | 'food';
  const options: PoolType[] = [];

  // It is unknown what happens exactly if you reach the limit of items in a category
  // Eg, if you have all possible clothing, does the clothing probability not get accounted, eg.
  // the probability of the others become more likely, or does it still get accounted
  // and if you get clothing you just "fail" or it goes to coins or something?
  // We will be assuming the first. There's no evidence for either

  // This map stores for each type all the possible values that can be chosen
  const itemPools: Record<PoolType, number[]> = {
    clothing: [],
    furniture: [],
    food: []
  };
  // Gold puffle only has its own gold items pool, and no food
  if (puffleType === 11) {
    itemPools.clothing = GOLD_PUFFLE_CLOTHING;
    itemPools.furniture = GOLD_PUFFLE_FURNITURE;
  } else if (puffleType > 1000) { // puffle creatures have a different item pool and no puffle food
    itemPools.clothing = PUFFLE_CREATURE_CLOTHING;
    itemPools.furniture = PUFFLE_CREATURE_FURNITURE;
  } else {
    itemPools.food = PUFFLE_FOOD;
    itemPools.clothing = REGULAR_PUFFLE_CLOTHING;
    itemPools.furniture = REGULAR_PUFFLE_FURNITURE;
  }

  // assign to each type of item a function that will check if the item in question
  // CAN be found on this dig
  const filters: Record<PoolType, (n: number) => boolean> = {
    'food': (food) => {
      const ownedAmount = penguin.info.getPuffleItemOwnedAmount(food);
      // can only hold one of each, even though that is not true
      // for puffle items in general
      return ownedAmount === 0;
    },
    'furniture': (furniture) => {
      const ownedAmount = penguin.info.getFurnitureOwnedAmount(furniture);
      return ownedAmount !== 99;
    },
    'clothing': (clothing) => {
      return !penguin.info.hasItem(clothing);
    }
  }

  // going through everything, removing the items we can't get
  // and adding to the random option if there's still items to get
  for (const pool in itemPools) {
    const itemPool = pool as PoolType
    itemPools[itemPool] = itemPools[itemPool].filter(filters[itemPool]);
    if (itemPools[itemPool].length > 0) {
      options.push(itemPool);
    }
  }

  const option = choose(options);
  const treasure = {
    'furniture': TreasureType.Furniture,
    'clothing': TreasureType.Clothing,
    'food': TreasureType.Food
  }[option];
  const itemId = choose(itemPools[option]);
  if (treasure === TreasureType.Clothing || treasure === TreasureType.Furniture) {
    // Treasure Box stamp, find item in dig
    // wiki claims that furnitures are included, no solid evidence though
    penguin.giveStamp(494);
  }

  if (treasure === TreasureType.Clothing) {
    penguin.addItem(itemId, { notify: false, free: true });
  } else if (treasure === TreasureType.Food) {
    // TODO notify = false?
    penguin.buyPuffleItem(itemId, 0, 1);
    if (itemId === PUFFLES.get(playerPuffle.type)?.favouriteFood) {
      // Tasty Treasure stamp
      penguin.giveStamp(495);
    }
  } else if (treasure === TreasureType.Furniture) {
    penguin.addFurniture(itemId, { notify: false });
  }
  sendPuffleDig(room, penguin, treasure, itemId);
  penguin.info.update();
}

// puffle dig no command
handler.xt(Handle.PuffleDigRandom, ({ room, penguin }) => {
  dig(room, penguin, false);
})

// puffle dig via the puffle tricks
handler.xt(Handle.PuffleDigOnCommand, ({ room, penguin }) => {
  dig(room, penguin, true);
})

// eating puffle care item
handler.xt(Handle.EatPuffleItem, ({ penguin }, puffleId, puffleItemId) => {
  const puffleItem = PUFFLE_ITEMS.get(puffleItemId);
  const puffle = penguin.info.getPuffle(puffleId);
  if (puffleItem === undefined) {
    throw new Error(`Puffle item not in the database: ${puffleItem}`);
  }
  // TODO non golden puffle handling
  // code here only accounts for the gold puffle berry you get
  penguin.sendXt('pcid', penguin.id, [
    puffle.id,
    puffle.food,
    100, // TODO puffle.play
    puffle.rest,
    puffle.clean,
    Number(false) // TODO "celebration" (apparently when puffle is maxed out?)
  ].join('|'));
  
  // starting golden puffle quest
  const goldBerry = PUFFLE_ITEMS.get(126);
  if (puffleItem.id === goldBerry?.id) {
    penguin.info.removeCoins(goldBerry.cost);

    penguin.activateGoldNuggetState();
    penguin.sendXt('oberry', penguin.id, penguin.walkingPuffle ?? 0);
    sendGoldNuggets(penguin);
  }
  penguin.info.update();
});

// make gold puffle appear in the mine
handler.xt(Handle.RevealGoldPuffle, ({ penguin }) => {
  // TODO multiplayer room logic
  penguin.sendXt('revealgoldpuffle', penguin.id);
});

/** Item reward obtained at the end of each quest in order */
const RAINBOW_QUEST_REWARDS = [6158, 4809, 1560, 3159];

/** Status of the item and coin rewards of each task */
enum ItemStatus {
  // can't because is a non-member or haven't done task
  CannotCollect = 0,
  NotCollected = 1,
  Collected = 2
}

/** Status of each rainbow puffle task that the client consumes */
type Task = {
  /** Status of the item reward */
  item: ItemStatus
  /** Status of the coin reward */
  coin: ItemStatus
  /** If have completed this task */
  completed: boolean
}

/** Information the client consumes of the quest progress */
type RainbowQuestStatus = {
  /** ID of current task waiting to be done */
  currTask: number,
  /** Timestamp for when the next task is available, in seconds */
  taskAvail: number,
  /** Integer boolean for whether or not can collect bonus */
  bonus: number,
  /** Boolean for whether or not can use the cannon */
  cannon: boolean,
  /** Number of quests completed */
  questsDone: number,
  /** String of the number of hours remaining for next task */
  hoursRemaining: string,
  /** String of the number of minutes remaining for next task */
  minutesRemaining: string,
  /** Map of all task IDs and their task status */
  tasks: Record<number, Task>
}

/** Item obtained from the bonus reward */
const RAINBOW_BONUS_REWARD = 5220;

// sending the rainbow puffle quest data
handler.xt(Handle.GetRainbowQuestData, ({ world, penguin }) => {
  // time in minutes between each task
  // TODO this changed with time, by 2014 it was already 20 minutes
  // but at some point in 2013 it was 18 hours
  const waitTime = world.getSettings().settings.no_rainbow_quest_wait ? 0 : 20;

  let currentTask = penguin.info.rainbowQuestInfo.currentTask;

  // TODO unsure of why this condition is needed
  if (currentTask === RAINBOW_QUEST_REWARDS.length && !penguin.info.rainbowQuestInfo.adoptability) {
    currentTask = 0;
  }

  // default values if haven't completed anything before (doesn't need to wait)
  let minutesRemaining = 0;
  let hoursRemaining = 0;
  let taskAvail = 0;

  // must use timestamp in seconds for the client
  const currentTimestamp = Date.now() / 1000;
  const taskCompletion = penguin.info.rainbowQuestInfo.latestTaskCompletionTime;
  // if have completed task, update the waiting times accordingly
  if (taskCompletion !== undefined) {
    taskAvail = Math.floor(taskCompletion + waitTime * 60);
    const secondsRemaining = taskAvail - currentTimestamp;
    minutesRemaining = Math.floor(secondsRemaining / 60);
    hoursRemaining = Math.floor(secondsRemaining / 60 / 60);
  }

  const bonus = Number(currentTask === RAINBOW_QUEST_REWARDS.length && !penguin.info.rainbowQuestInfo.coinsCollected.has('bonus'));

  const tasks: Record<number, Task> = {};

  for (let taskId = 0; taskId < RAINBOW_QUEST_REWARDS.length; taskId++) {
    const strTask = String(taskId);
    tasks[taskId] = {
      item: penguin.info.hasItem(RAINBOW_QUEST_REWARDS[taskId])
        ? 2
        : penguin.info.isMember
          ? 1
          : 0,
      coin: isRainbowStage(strTask) && penguin.info.rainbowQuestInfo.coinsCollected.has(strTask)
        ? 2
        : taskId < currentTask
          ? 1
          : 0,
      completed: taskId < currentTask
    }
  }

  const rainbowQuestStatus: RainbowQuestStatus = {
    currTask: Math.min(currentTask, RAINBOW_QUEST_REWARDS.length - 1),
    taskAvail,
    bonus,
    cannon: penguin.info.rainbowQuestInfo.adoptability,
    questsDone: currentTask,
    hoursRemaining: String(hoursRemaining),
    minutesRemaining: String(Math.max(0, minutesRemaining + 1)),
    tasks
  }

  penguin.sendXt('rpqd', JSON.stringify(rainbowQuestStatus));
})

// rainbow puffle quest task complete
handler.xt(Handle.SetRainbowQuestTaskComplete, ({ penguin }, task) => {
  // completing last quest, can adopt
  if (task === RAINBOW_QUEST_REWARDS.length - 1) {
    penguin.info.rainbowQuestInfo.adoptability = true;
  }

  penguin.info.rainbowQuestInfo.currentTask = task + 1;
  penguin.info.rainbowQuestInfo.latestTaskCompletionTime = Date.now() / 1000;
  penguin.info.update();
})

// rainbow puffle quest collect coins
handler.xt(Handle.RainbowQuestCollectCoins, ({ penguin }, task) => {
  if (isRainbowStage(task)) {
    penguin.info.rainbowQuestInfo.coinsCollected.add(task);
  }
  penguin.info.addCoins(150);
  penguin.sendXt('rpqcc', task, ItemStatus.Collected, penguin.info.coins);
  penguin.info.update();
});

// rainbow puffle quest item collect
handler.xt(Handle.RainbowQuestItemCollect, ({ penguin }, task) => {
  penguin.addItem(RAINBOW_QUEST_REWARDS[task], { notify: false, free: true });
  penguin.sendXt('rpqic', task, ItemStatus.Collected);
  penguin.info.update();
});

// rainbow puffle quest bonus collect
handler.xt(Handle.RainbowQuestCollectBonus, ({ penguin }) => {
  // if have item, already completed the quest once
  if (penguin.info.hasItem(RAINBOW_BONUS_REWARD)) {
    // TODO get evidence this reward amount is correct
    penguin.info.addCoins(500);
    // TODO unsure why these 2 zeros
    penguin.sendXt('rpqbc', 0, 0, penguin.info.coins);
  } else {
    penguin.addItem(RAINBOW_BONUS_REWARD, { free: true });
  }
  penguin.info.rainbowQuestInfo.coinsCollected.add('bonus');
  penguin.info.update();
})

// getting pin information opening stampbook
handler.xt(Handle.GetPinInformation, ({ penguin }, id) => {
  penguin.sendXt('qpp', penguin.getPinString());
});

// getting mission stamps
handler.xt(Handle.GetMissionStamps, ({ world, penguin }) => {
  const awards = [];
  for (const item of penguin.info.getItems()) {
    const itemInfo = world.data.getItem(Number(item));
    if (itemInfo !== undefined && itemInfo.type === ItemType.Award) {
      awards.push(item);
    }
  }
  penguin.sendXt('qpa', penguin.id, awards.join('|'));
});

// stampbook cover information
handler.xt(Handle.GetStampbookCoverData, ({ penguin }, id) => {
  penguin.sendXt('gsbcd', penguin.getStampbookCoverString());
});

// getting all the player stamps
handler.xt(Handle.GetPlayerStamps, ({ penguin }, id) => {
  penguin.sendStamps();
});

// getting recent player stamps
handler.xt(Handle.GetRecentStamps, ({ penguin }) => {
  penguin.sendXt('gmres', penguin.getRecentStampsString());
});

// save stamp book cover data
handler.xt(Handle.SetStampbookCoverData, ({ penguin }, color, highlight, pattern, icon, ...stamps) => {
  penguin.info.stampbook.color = Number(color);
  penguin.info.stampbook.highlight = Number(highlight);
  penguin.info.stampbook.icon = Number(icon);
  penguin.info.stampbook.pattern = Number(pattern);
  penguin.info.stampbook.stamps = stamps.map(stampString => {
    const [_, id, x, y, rotation, depth] = stampString.split('|').map(n => Number(n));
    return {
      stamp: id,
      x,
      y,
      rotation,
      depth
    }
  })
  penguin.info.update();
});

// earn client side stamp
handler.xt(Handle.SetStampEarned, ({ penguin }, stamp) => {
  // for this endpoint notifying is unecessary since it's the one
  // that the client sends
  penguin.giveStamp(stamp, { notify: false });
  penguin.info.update();
});

// get ninja rank
handler.xt(Handle.GetNinjaRanks, ({ penguin }) => {
  penguin.sendXt(
    'gnr',
    penguin.info.id,
    penguin.info.ninjaProgress.rank,
    penguin.info.isFireNinja ? 5 : 0,
    penguin.info.isWaterNinja ? 5 : 0,
    penguin.info.isSnowNinja ? 13 : 0
  );
});

// get card-jitsu level
handler.xt(Handle.GetNinjaLevel, ({ penguin }) => {
  // ranke, percentage, unsure what 10 is
  penguin.sendXt('gnl', penguin.info.ninjaProgress.rank, penguin.info.ninjaProgress.percentage, 10);
})

handler.xt(Handle.GetFireLevel, ({ penguin }) => {
  // unsure why 5 is needed
  // TODO fire ranks
  penguin.sendXt('gfl', 0, 0, 5);
});

// get cards
handler.xt(Handle.GetCards, ({ penguin }) => {
  penguin.sendXt('gcd', penguin.info.getCards().map((card) => {
    return card.join(',');
  }).join('|'));
});

function getAllPowerCards(): number[] {
  return CARDS.rows.filter((card) => card.powerId > 0).map(card => card.id);
}

handler.xt(Handle.BuyPowerCards, ({ penguin }) => {
  const powerCards = getAllPowerCards();
  const cards = chooseN(powerCards, 3);
  cards.forEach(card => {
    penguin.info.addCard(card, 1);
  });
  penguin.info.removeCoins(1500);
  
  penguin.sendXt('bpc', cards.join(','), penguin.info.coins);
  penguin.info.update();
});

export default handler;
