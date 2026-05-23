import { WorldContext } from "@server/socket-server/world/world";
import { XtHandler } from "../xt";
import { getPenguinString } from "./join";
import { WorldPenguin } from "@server/socket-server/world/world-penguin";
import { WorldTable } from "@server/socket-server/world/world-table";
import { ROOMS } from "@server/game-data/rooms";

const handler = new XtHandler<WorldContext, ['world', 'penguin', 'room', 'msg', 'data', 'prst']>(['world', 'penguin', 'room', 'msg', 'data', 'prst']);

handler.xt([['s', 'sp'], ['s', 'u#sp']], ['number', 'number'], ({ penguin, room, msg }, x, y) => {
  room.updatePosition(penguin, x, y);
  msg.send(room.players, 'sp', penguin.id, x, y);
});

handler.xt([['s', 'sf'], ['s', 'u#sf']], ['number'], ({ penguin, room, msg }, frame) => {
  room.updateFrame(penguin, frame);
  msg.send(room.players, 'sf', penguin.id, frame);
});

handler.xt([['s', 'sa'], ['s', 'u#sa']], ['string'], ({ room, msg, penguin }, action) => {
  msg.send(room.players, 'sa', penguin.id, action);
});

handler.xt([['s', 'sb'], ['s', 'u#sb']], ['string', 'string'], ({ room, msg, penguin }, x, y) => {
  msg.send(room.players, 'sb', penguin.id, x, y);
});

handler.xt([['s', 'se'], ['s', 'u#se']], ['string'], ({ room, msg, penguin }, emote) => {
  msg.send(room.players, 'se', penguin.id, emote);
});

handler.xt([['s', 'sj'], ['s', 'u#sj']], ['string'], ({ room, msg, penguin }, joke) => {
  msg.send(room.players, 'sj', penguin.id, joke);
});

handler.xt([['m', 'sm'], ['s', 'm#sm']], ['string', 'string'], ({ room, msg }, penguin, message) => {
  msg.send(room.players, 'sm', penguin, message);
});

handler.xt([['s', 'ss'], ['m', 'ss'], ['s', 'u#ss']], ['string'], ({ room, msg, penguin }, message) => {
  msg.send(room.players, 'ss', penguin.id, message);
});

handler.xt('s', 'u#sl', ['string'], ({ room, msg, penguin }, line) => {
  msg.send(room.players, 'sl', penguin.id, line);
});

handler.xt('z', 'gw', 'number', ({ msg, penguin, room }) => {
  msg.send(penguin, 'gw', ...room.getWaddleRooms().map((w) => {
    return `${w.getId()}|${w.getSeats().map(p => {
      return p?.name ?? '';
    }).join(',')}`
  }))
});

handler.xt('z', 'jw', ['number'], ({ msg, penguin, room, world, data }, waddleId) => {
  const waddle = room.getWaddleRoom(waddleId);
  if (waddle !== undefined) {
    const seat = room.enterWaddleRoom(waddle, penguin);
    msg.send(penguin, 'jw', seat);
    msg.send(room.players, 'uw', waddleId, seat, penguin.name, penguin.id);
    if (waddle.isFull()) {
      const players = waddle.getSeats().filter((p): p is WorldPenguin => p !== null);
      players.forEach(p => {
        room.removePenguin(p);
      });
      const game = world.getWaddleGame(waddle.getGame(), players);
      waddle.reset();
      msg.send(players, 'jg', game.roomId);

      // 2006 sled race notification for starting the game
      if (waddle.getGame() === 'sled' && data.isPreCpip()) {
        msg.send(players, 'sw', waddle.getId(), room.id, players.length);
      }
    }
  }
});

// leave a waddle room
handler.xt('z', 'lw', [], ({ penguin, msg, room }) => {
  const waddleRoom = room.getWaddleRooms().find(room => room.getSeats().includes(penguin));
  if (waddleRoom === undefined) {
    return;
  }
  const seatIndex = waddleRoom.removePlayer(penguin);
  msg.send(room.players, 'uw', waddleRoom.getId(), seatIndex);
});

//TODO persistence for new players joining (was that actually a thing?)
handler.xt('s', 't#at', ['string'], ({ msg, penguin, room }, toy) => {
  msg.send(room.players, 'at', penguin.id, toy);
});

handler.xt('s', 'at', ['string', 'string'], ({ msg, penguin, room }, toy, frame) => {
  msg.send(room.players, 'at', penguin.id, toy, frame);
});

handler.xt([['s', 'rt'], ['s', 't#rt']], [], ({ msg, room, penguin }) => {
  msg.send(room.players, 'rt', penguin.id);
})

handler.xt('s', 'pt#spts', ['number'], ({ msg, room, penguin }, avatarId) => {
  penguin.avatar.transform(avatarId);
  msg.send(room.players, 'spts', penguin.id, avatarId);
});

handler.xt('s', 'st', ['number', 'number', 'number'], ({ msg, penguin, room }, x, y, frame) => {
  room.updatePosition(penguin, x, y);
  room.updateFrame(penguin, frame);

  msg.send(room.players, 'st', x, y, frame);
});

handler.xt('s', 'gt', 'number', ({ msg, penguin, room }, ...tableIds) => {
  // return table occupancy counts for the requested table ids
  msg.send(penguin, 'gt', ...tableIds.map(id => {
    return `${id}|${room.getTable(id).getCount()}`;
  }));
});

handler.xt('s', 'jt', ['number'], ({ msg, penguin, room }, tableId) => {
  const table = room.getTable(tableId);

  const before = table.getCount();

  const seatId = table.getSeatIndex(penguin) ?? table.assignSeatIndex(penguin);

  if (seatId !== WorldTable.TABLE_SPECTATOR_SEAT && before === 0) {
    table.reset();
  }
  if (seatId !== WorldTable.TABLE_SPECTATOR_SEAT) {
    const count = table.getCount();
    if (count !== before) {
      msg.send(room.players, 'ut', table.getId(), table.getCount())
    }
  }
  // the index here is 1 based
  const tableSeatId = seatId === WorldTable.TABLE_SPECTATOR_SEAT ? seatId : seatId + 1;
  msg.send(penguin, 'jt', tableId, tableSeatId);
});

handler.xt('s', 'lt', [], ({ msg, room, penguin }) => {
  // old leave flow: free seat, broadcast count, and reset if empty
  const table = room.getPenguinTable(penguin);
  if (table !== null) {
    table.removePlayer(penguin);
    const count = table.getCount();
    msg.send(room.players, 'ut', table.getId(), table.getCount());
    if (count === 0) {
      table.reset();
    }
  }
});

function isTableId(tableId: number) {
  return WorldTable.FIND_FOUR_TABLE_IDS.has(tableId) || WorldTable.MANCALA_TABLE_IDS.has(tableId);
}

handler.xt('z', 'gz', ['number'], ({ msg, room, penguin }, tableId) => {
  if (room.id === ROOMS['rink'].id) {
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

  msg.send(penguin, 'gz', ...table.getNames(), boardState);
});

handler.xt('z', 'jz', [], ({ msg, room, penguin }) => {
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

    table.setJoined(seatId);

    msg.send(penguin, 'jz', seatId);
    table.getSeats().forEach((seat, index) => {
      msg.send(penguin, 'uz', index, seat?.name ?? '');
    });

    msg.send(table.penguins, 'uz', seatId, penguin.name);

    // start the match when both players have joined
    if (!table.hasStarted()) {
      if (table.hasEveryoneJoined()) {
        table.setStarted();
        msg.send(table.penguins, 'sz', table.getTurn())
      }
      return;
    }
  }
});

handler.xt('z', 'lz', [], ({ msg, room, penguin }) => {
  // leave the active game: spectators just close, players clear seats/reset
  const table = room.getPenguinTable(penguin);

  if (table !== null) {
    const seat = table.getSeatIndex(penguin);
    if (seat === WorldTable.TABLE_SPECTATOR_SEAT) {
      table.removeSpectator(penguin);
      msg.send(penguin, 'lz');
      return;
    }
    if (!table.hasStarted()) {
      if (seat !== undefined) {
        table.removePlayer(penguin);
        msg.send(table.penguins, 'uz', seat, '');
      }
      const count = table.getCount();
      msg.send(room.players, 'ut', table.getId(), table.getCount());
      if (count === 0) {
        table.reset();
      }
      return;
    }
    msg.send(table.penguins, 'cz', penguin.name);
    table.resetRound();
    msg.send(room.players, 'ut', table.getId(), table.getCount());
  }
});

handler.xt('z', 'zm', 'number', ({ msg, room, penguin }, ...moves) => {
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
      // TODO
      const [endArgs, args] = table.sendMove(moves);
      
      // Ignore non-table zm packets (e.g. sled racing uses 4 args).
      if (table.getAutomaticTurnChange()) {
        table.changeTurn();
      }
      if (args !== null) {
        msg.send(table.penguins, 'zm', ...args);
      }
      if (endArgs !== null) {
        // todo 'zo' with args?
        msg.send(table.penguins, 'zo', ...endArgs);
        msg.send(room.players, 'ut', table.getId(), table.getCount());
        table.resetRound();
      }
    }
  }  
});

// updating penguin
handler.xt('s', 'up', ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'], ({ penguin, room, msg, data, prst }, color, head, face, neck, body, hand, feet, pin, background) => {
  penguin.inventory.updateWear({
    color,
    head,
    face,
    neck,
    body,
    hand,
    feet,
    pin,
    background
  });

  msg.send(room.players, 'up', getPenguinString(data, penguin, room.getState(penguin)));

  prst(penguin);
})

handler.xt('s', 's#upc', ['number'], ({ room, msg, penguin }, id) => {
  penguin.inventory.updateWear({ color: id });
  msg.send(room.players, 'upc', penguin.id, id);
});

handler.xt('s', 's#uph', ['number'], ({ room, msg, penguin }, id) => {
  penguin.inventory.updateWear({ head: id });
  msg.send(room.players, 'uph', penguin.id, id);
});

handler.xt('s', 's#upf', ['number'], ({ room, msg, penguin }, id) => {
  penguin.inventory.updateWear({ face: id });
  msg.send(room.players, 'upf', penguin.id, id);
});

handler.xt('s', 's#upn', ['number'], ({ room, msg, penguin }, id) => {
  penguin.inventory.updateWear({ neck: id });
  msg.send(room.players, 'upn', penguin.id, id);
});

handler.xt('s', 's#upb', ['number'], ({ room, msg, penguin }, id) => {
  penguin.inventory.updateWear({ body: id });
  msg.send(room.players, 'upb', penguin.id, id);
});

handler.xt('s', 's#upa', ['number'], ({ room, msg, penguin }, id) => {
  penguin.inventory.updateWear({ hand: id });
  msg.send(room.players, 'upa', penguin.id, id);
});

handler.xt('s', 's#upe', ['number'], ({ room, msg, penguin }, id) => {
  penguin.inventory.updateWear({ feet: id });
  msg.send(room.players, 'upe', penguin.id, id);
});

handler.xt('s', 's#upl', ['number'], ({ room, msg, penguin }, id) => {
  penguin.inventory.updateWear({ pin: id });
  msg.send(room.players, 'upl', penguin.id, id);
});

handler.xt('s', 's#upp', ['number'], ({ room, msg, penguin }, id) => {
  penguin.inventory.updateWear({ background: id });
  msg.send(room.players, 'upp', penguin.id, id);
});

export {
  handler as roomHandler
};