import { Client, Server } from '../../client';
import { Handler } from '..';
import { Room } from '../../game-logic/rooms';
import { getDateString } from '../../../common/utils';
import { Handle } from '../handles';
import { processFurniture } from './igloo';
import { isGreaterOrEqual } from '../../../server/routes/versions';
import { getDate } from '../../../server/timelines/dates';
import { Penguin } from '../../penguin';
import { FURNITURE } from '../../../server/game-logic/furniture';
import { getFlooringCost, getIglooCost } from '../../../server/game-logic/iglooItems';
import { Table } from './table';
import { ROOMS } from '../../game-data/rooms';

const handler = new Handler();

// restrict post-cpip clients from using buddy system (not yet implemented)
function canHandleBuddy(client: Client): boolean {
  return client.isEngine1;
}

function getPenguinNameById(id: number): string | undefined {
  return Penguin.getById(id)?.name;
}

function formatBuddyEntry(id: number, server: Client['server'], includeOnlineFlag: boolean): string {
  const name = getPenguinNameById(id) ?? server.getPlayerById(id)?.penguin.name ?? 'Unknown';
  if (!includeOnlineFlag) {
    return `${id}|${name}`;
  }
  const online = server.getPlayerById(id) !== undefined;
  return online ? `${id}|${name}|1` : `${id}|${name}`;
}

function sendBuddyOnlineList(client: Client, excludeId?: number): void {
  const onlineIds = client.penguin.getBuddies().filter((id) => {
    if (excludeId !== undefined && id === excludeId) {
      return false;
    }
    return client.server.getPlayerById(id) !== undefined;
  });
  client.sendXt('go', ...onlineIds);
}

// engine1 clients expect seats as 1-based; 99 is spectator

// engine1 sled uses waddle state but uses old z% protocol
function getSledGame(client: Client) {
  if (!client.isInWaddleGame() || client.waddleGame.name !== 'sled') {
    return undefined;
  }
  return client.waddleGame;
}

// Joining server
handler.xt(Handle.JoinServerOld, (client) => {
  client.sendXt('js', client.isAgent() ? 1 : 0);

  // chat506+ expects an immediate buddy list + online list after login
  if (client.buddyProtocol === 'b') {
    handleGetBuddies(client);
    handleGetBuddyOnlineList(client);
  }

  // notify buddies this player is now online
  sendBuddyOnlineList(client);
  client.penguin.getBuddies().forEach((buddyId) => {
    const buddyClient = client.server.getPlayerById(buddyId);
    if (buddyClient !== undefined && canHandleBuddy(buddyClient)) {
      sendBuddyOnlineList(buddyClient);
    }
  });

  client.joinRoom(Room.Town)
})

// Joining room
handler.xt(Handle.JoinRoomOld, (client, room, x, y) => {
  if (client.isEngine1 && client.isInWaddleGame() && client.waddleGame.name === 'sled') {
    if (room !== client.waddleGame.roomId) {
      client.waddleGame.removePlayer(client);
      client.clearWaddleGame();
      if (client.isInWaddleRoom()) {
        client.leaveWaddleRoom();
      }
    }
  }
  client.joinRoom(room, x, y);
})

// Paying after minigame
handler.xt(Handle.LeaveGame, (client, score) => {
  if (!client.isEngine1) {
    return;
  }
  if (client.isInWaddleGame() && client.waddleGame.name === 'sled') {
    return;
  }
  const coins = client.getCoinsFromScore(score);
  client.penguin.addCoins(coins);
  
  client.sendXt('zo');
  client.update();
})

handler.xt(Handle.JoinSled, (client) => {
  if (!client.isEngine1) {
    return;
  }
  const game = getSledGame(client);
  if (game === undefined) {
    return;
  }
  // engine1 expects a compact name|color roster
  const roster = game.players.map((player) => {
    return `${player.penguin.name}|${player.penguin.color}`;
  });
  client.sendXt('uz', game.players.length, ...roster);
});

handler.xt(Handle.SledRaceAction, (client, id, x, y, time) => {
  if (!client.isEngine1) {
    return;
  }
  const game = getSledGame(client);
  if (game === undefined) {
    return;
  }
  // relay sled movement to all players
  game.sendXt('zm', id, x, y, time);
});

handler.xt(Handle.LeaveWaddleGame, (client, score) => {
  if (!client.isEngine1) {
    return;
  }
  const game = getSledGame(client);
  if (game === undefined) {
    return;
  }
  game.removePlayer(client);
  client.clearWaddleGame();
  if (client.isInWaddleRoom()) {
    client.leaveWaddleRoom();
  }
  // engine1 sled sends place (1-4); map to coins and close
  const place = Number(score);
  let reward = 0;
  if (place === 1) {
    reward = 20;
  } else if (place === 2) {
    reward = 10;
  } else if (place === 3 || place === 4) {
    reward = 5;
  }
  if (reward > 0) {
    client.penguin.addCoins(reward);
  }
  client.sendXt('zo');
  client.update();
});

// update client's coins
handler.xt(Handle.GetCoins, (client) => {
  if (client.server.removeSpectator(client.penguin.id)) {
    return;
  }
  client.sendEngine1Coins();
})

handler.xt(Handle.GetCoins2007, (client) => {
  client.sendXt('gc', client.penguin.coins);
})

handler.xt(Handle.GetTableOld, (client, ...tableIds) => {
  if (!client.isEngine1) {
    return;
  }
  // return table occupancy counts for the requested table ids
  if (tableIds.length === 0) {
    client.sendXt('gt');
    return;
  }
  const roomId = client.room?.id;
  if (roomId === undefined) {
    client.sendXt('gt');
    return;
  }
  const entries: string[] = [];
  tableIds.forEach((tableId) => {
    const table = client.server.getTable(tableId, roomId);
    entries.push(`${tableId}|${table.count}`);
  });
  if (entries.length === 0) {
    client.sendXt('gt');
    return;
  }
  client.sendXt('gt', ...entries);
});

handler.xt(Handle.JoinTableOld, (client, tableId) => {
  if (!client.isEngine1) {
    return;
  }
  const room = client.room;
  if (room === undefined) {
    return;
  }

  const table = client.server.getTable(tableId, room.id);
  const beforeCount = table.count;

  const seatId = table.getSeatIndex(client) ?? table.assignSeatIndex(client);
  
  client.enterTable(tableId, seatId);
  // first seated player resets a stale board
  if (seatId !== Table.TABLE_SPECTATOR_SEAT && beforeCount === 0) {
    table.reset();
  }
  if (seatId !== Table.TABLE_SPECTATOR_SEAT) {
    const afterCount = table.count;
    if (afterCount !== beforeCount) {
      table.broadcastUpdate();
    }
  }
  // the index here is 1 based
  const tableSeatId = seatId === Table.TABLE_SPECTATOR_SEAT ? seatId : seatId + 1;
  client.sendXt('jt', tableId, tableSeatId);
});

handler.xt(Handle.LeaveTableOld, (client) => {
  if (!client.isEngine1) {
    return;
  }
  // old leave flow: free seat, broadcast count, and reset if empty
  const tableInfo = client.getTable();
  if (tableInfo !== undefined) {
    const table = client.server.getTableIfExists(tableInfo.id);
    client.exitTable();
    if (table === undefined) {
      return;
    }
    const seatIndex = table.getSeatIndex(client);
    if (seatIndex === undefined) {
      return;
    }
    table.emptySeat(seatIndex);
    const count = table.count;
    table.broadcastUpdate();
    if (count === 0) {
      table.reset();
    }
  }
});

function isTableId(tableId: number) {
  return Server.FIND_FOUR_TABLE_IDS.has(tableId) || Server.MANCALA_TABLE_IDS.has(tableId);
}

handler.xt(Handle.GetTableGame, (client, tableId) => {
  if (!client.isEngine1 || client.room.id === ROOMS['rink'].id) {
    return;
  }
  // resolve table id from context so spectators can re-open correctly
  let resolvedTableId = tableId;
  if (!isTableId(resolvedTableId)) {
    const existingTable = client.getTable();
    if (existingTable !== undefined) {
      resolvedTableId = existingTable.id;
    } else {
      for (const [id, table] of client.server.getTables()) {
        if (table.getSeatIndex(client) !== undefined) {
          resolvedTableId = id;
          break;
        }
      }
    }
  }

  const roomId = client.room.id;
  const table = client.server.getTable(resolvedTableId, roomId);
  const name0 = table.getName(0);
  const name1 = table.getName(1);

  const boardState = table.serializeBoard();

  const existing = client.getTable();
  if (existing === undefined || existing.id !== resolvedTableId) {
    const seatId = table.getSeatIndex(client) ?? Table.TABLE_SPECTATOR_SEAT;
    client.enterTable(resolvedTableId, seatId);
  }
  client.sendXt('gz', name0, name1, boardState);
});

handler.xt(Handle.JoinTableGame, (client) => {
  if (!client.isEngine1) {
    return;
  }
  // join the game instance after table seat selection
  let tableInfo = client.getTable();
  if (tableInfo !== undefined) {
    const roomId = client.room.id;
    const table = client.server.getTable(tableInfo.id, roomId);
    const currentSeat = table.getSeatIndex(client);
    let seatId = tableInfo.seat;
    if (currentSeat !== undefined) {
      seatId = currentSeat;
    } else if (seatId >= 0 && seatId < Table.SEAT_LENGTH && table.getSeat(seatId) === null) {
      table.setSeat(client, seatId);
    } else {
      seatId = table.assignSeatIndex(client);
    }

    if (seatId !== tableInfo.seat) {
      client.enterTable(tableInfo.id, seatId);
    }

    const alreadyJoined = seatId !== Table.TABLE_SPECTATOR_SEAT && table.hasJoined(seatId);
    if (seatId !== Table.TABLE_SPECTATOR_SEAT) {
      table.setJoined(seatId);
    }

    client.sendXt('jz', seatId);
    table.sendSeatRoaster('uz', client);

    if (seatId !== Table.TABLE_SPECTATOR_SEAT && !alreadyJoined) {
      table.sendUpdate(seatId, client.penguin.name);
    }

    // start the match when both players have joined
    if (!table.started) {
      if (table.hasEveryoneJoined()) {
        table.setStarted();
        table.sendPacket('sz', table.turn);
      }
      return;
    }

    if (!alreadyJoined) {
      client.sendXt('sz', table.turn);
    }
  }
});

handler.xt(Handle.LeaveTableGame, (client) => {
  if (!client.isEngine1) {
    return;
  }
  // leave the active game: spectators just close, players clear seats/reset
  const tableInfo = client.getTable();

  if (tableInfo !== undefined) {
    const table = client.server.getTableIfExists(tableInfo.id);
    if (table === undefined) {
      client.exitTable();
      return;
    }
    if (tableInfo.seat === Table.TABLE_SPECTATOR_SEAT) {
      table.removeSpectator(client);
      client.sendXt('lz');
      client.exitTable();
      return;
    }
    if (!table.started) {
      const seatIndex = table.getSeatIndex(client);
      if (seatIndex !== undefined) {
        table.seats[seatIndex] = null;
      }
      client.exitTable();
      if (tableInfo.seat < 2) {
        table.sendUpdate(tableInfo.seat, '');
      }
      const count = table.count;
      table.broadcastUpdate();
      if (count === 0) {
        table.reset();
      }
      return;
    }
    table.clear(client.penguin.name);
  }
});

handler.xt(Handle.SendTableMove, (client, ...moves) => {
  if (!client.isEngine1) {
    return;
  }
  // dispatch board moves for find four or mancala
  const tableInfo = client.getTable();
  if (tableInfo !== undefined) {
    const table = client.server.getTableIfExists(tableInfo.id);
    if (table === undefined || !table.started || table.ended) {
      return;
    }
    if (tableInfo.seat === Table.TABLE_SPECTATOR_SEAT || !table.hasJoined(tableInfo.seat)) {
      return;
    }
    const player = tableInfo.seat;
    if (player !== 0 && player !== 1) {
      return;
    }
    if (table.turn !== player) {
      return;
    }

    // table game specific logic
    if (moves.length === table.moveLength) {
      const reset = table.sendMove(moves);
      // Ignore non-table zm packets (e.g. sled racing uses 4 args).
      if (table.automaticTurnChange) {
        table.changeTurn();
      }
      if (reset) {
        table.resetRound();
      }
    }
  }  
});

handler.xt(Handle.AddItemOld, (client, item) => {
  // TODO remove coins logic
  client.buyItem(item);
  client.update();
})

// updating penguin
handler.xt(Handle.UpdatePenguinOld, (client, color, head, face, neck, body, hand, feet, pin, background) => {
  client.penguin.color = color
  client.penguin.head = head;
  client.penguin.face = face;
  client.penguin.neck = neck;
  client.penguin.body = body;
  client.penguin.hand = hand;
  client.penguin.feet = feet;
  client.penguin.pin = pin;
  client.penguin.background = background;
  client.sendRoomXt('up', client.penguinString)
  client.update();
})

handler.xt(Handle.BecomeAgent, (client) => {
  client.setAgentPending();
})

handler.xt(Handle.SendInventory, () => {
  // seemingly useless handler, it just sends the client's inventory to the server
  return;
});

handler.xt(Handle.SendMessageOld, (client, id, message) => {
  client.sendMessage(message);
});

handler.xt(Handle.SetPositionOld, (client, ...args) => {
  const [x, y] = args;
  if (x === undefined || y === undefined) {
    return;
  }
  const safeX = x <= 0 ? 20 : x;
  const safeY = y <= 0 ? 20 : y;
  client.setPosition(safeX, safeY);
});

handler.xt(Handle.SendTeleportOld, (client, x, y, frame) => {
  if (!client.isEngine1) {
    return;
  }
  client.setPosition(x, y);
  client.setFrame(frame);
  client.sendRoomXt('st', client.penguin.id, x, y, frame);
});

handler.xt(Handle.SendEmoteOld, (client, emote) => {
  client.sendEmote(emote);
});

handler.xt(Handle.SnowballOld, (client, ...args) => {
  client.throwSnowball(...args);
})

handler.xt(Handle.SendJokeOld, (client, joke) => {
  client.sendJoke(joke);
});

const handleSafeMessageOld = (client: Client, id: string) => {
  client.sendSafeMessage(id);
};

handler.xt(Handle.SendSafeMessageOld, handleSafeMessageOld);
handler.xt(Handle.SendSafeMessageOldAlt, handleSafeMessageOld);

handler.xt(Handle.SendActionOld, (client, id) => {
  client.sendAction(id);
});

handler.xt(Handle.OpenBookOld, (client, toyId, frame) => {
  if (!client.isEngine1) {
    return;
  }
  client.sendRoomXt('at', client.penguin.id, toyId, frame);
});

handler.xt(Handle.CloseBookOld, (client) => {
  if (!client.isEngine1) {
    return;
  }
  client.sendRoomXt('rt', client.penguin.id);
});

const handleGetBuddies = (client: Client) => {
  if (!canHandleBuddy(client)) {
    return;
  }
  const buddies = client.penguin.getBuddies()
    .map((id) => formatBuddyEntry(id, client.server, true));
  if (buddies.length === 0) {
    client.sendXtEmptyLast('gb');
    return;
  }
  client.sendXt('gb', ...buddies);
};

const handleGetBuddyOnlineList = (client: Client) => {
  if (!canHandleBuddy(client)) {
    return;
  }
  const onlineIds = client.penguin.getBuddies().filter((id) => client.server.getPlayerById(id) !== undefined);
  if (onlineIds.length === 0) {
    client.sendXtEmptyLast('go');
    return;
  }
  client.sendXt('go', ...onlineIds);
};

// Unified buddy request handler; picks outgoing code based on sender's protocol
const handleBuddyRequest = (client: Client, targetId: number) => {
  if (!canHandleBuddy(client)) {
    return;
  }
  const numericTargetId = Number(targetId);
  if (!Number.isFinite(numericTargetId)) {
    return;
  }
  const target = client.server.getPlayerById(numericTargetId);
  if (target === undefined) {
    return;
  }
  if (client.penguin.hasBuddy(numericTargetId)) {
    return;
  }
  const senderProtocol = client.buddyProtocol;
  const requestCode = senderProtocol === 'b' ? 'br' : 'bq';
  target.sendXt(requestCode, client.penguin.id, client.penguin.name);
  target.update();
  // refresh sender list to avoid temporary placeholders client-side
  if (senderProtocol === 'b') {
    handleGetBuddies(client);
  }
};

// accept + persist buddy for both parties (works even if requester is offline)
const handleBuddyAccept = (client: Client, requesterId: number) => {
  if (!canHandleBuddy(client)) {
    return;
  }
  const requesterNumericId = Number(requesterId);
  if (Number.isNaN(requesterNumericId)) {
    return;
  }
  const requester = client.server.getPlayerById(requesterNumericId);
  if (requester !== undefined) {
    if (!client.penguin.hasBuddy(requesterNumericId)) {
      client.penguin.addBuddy(requesterNumericId);
      requester.penguin.addBuddy(client.penguin.id);
      client.update();
      requester.update();
    }
    requester.sendXt('ba', client.penguin.id, client.penguin.name);
    if (client.buddyProtocol === 'b') {
      handleGetBuddies(client);
      handleGetBuddies(requester);
    }
    return;
  }

  const requesterPenguin = Penguin.getById(requesterNumericId);
  if (requesterPenguin === undefined) {
    return;
  }

  if (!client.penguin.hasBuddy(requesterNumericId)) {
    client.penguin.addBuddy(requesterNumericId);
    client.update();
  }

  if (!requesterPenguin.hasBuddy(client.penguin.id)) {
    requesterPenguin.addBuddy(client.penguin.id);
    requesterPenguin.update();
  }
};

// notify requester their invite was declined
const handleBuddyDecline = (client: Client, requesterId: number) => {
  if (!canHandleBuddy(client)) {
    return;
  }
  const requester = client.server.getPlayerById(Number(requesterId));
  if (requester === undefined) {
    return;
  }
  requester.sendXt('bd', client.penguin.id, client.penguin.name);
};

// remove buddy for both sides; if other side is offline, persist to DB
const handleBuddyRemove = (client: Client, buddyId: number) => {
  if (!canHandleBuddy(client)) {
    return;
  }
  const numericId = Number(buddyId);
  if (Number.isNaN(numericId)) {
    return;
  }
  let changed = false;
  if (client.penguin.hasBuddy(numericId)) {
    client.penguin.removeBuddy(numericId);
    changed = true;
  }
  const buddyClient = client.server.getPlayerById(numericId);
  if (buddyClient !== undefined && buddyClient.penguin.hasBuddy(client.penguin.id)) {
    buddyClient.penguin.removeBuddy(client.penguin.id);
    const removeProtocol = client.buddyProtocol;
    const removeCode = removeProtocol === 'b' ? 'rb' : 'br';
    buddyClient.sendXt(removeCode, client.penguin.id, client.penguin.name);
    buddyClient.update();
  }
  if (buddyClient === undefined) {
    const buddyPenguin = Penguin.getById(numericId);
    if (buddyPenguin !== undefined) {
      if (buddyPenguin.hasBuddy(client.penguin.id)) {
        buddyPenguin.removeBuddy(client.penguin.id);
        buddyPenguin.update();
      }
    }
  }
  if (changed) {
    client.update();
  }
};

const handleBuddyMessage = (client: Client, targetId: number, messageId: number) => {
  if (!canHandleBuddy(client)) {
    return;
  }
  const target = client.server.getPlayerById(Number(targetId));
  if (target === undefined) {
    return;
  }
  target.sendXt('bm', client.penguin.id, client.penguin.name, messageId);
};

handler.xt(Handle.GetBuddies, handleGetBuddies);
handler.xt(Handle.GetBuddiesB, handleGetBuddies);

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

const getPlayerOldHandler = (client: Client, playerId: number | string) => {
  if (!client.isEngine1) {
    return;
  }
  const targetId = Number(playerId);
  if (Number.isNaN(targetId)) {
    return;
  }
  const target = client.server.getPlayerById(targetId);
  if (target !== undefined) {
    const roomId = target.room?.id ?? 0;
    client.sendXt('gp', target.penguinString, roomId);
    return;
  }
  const penguin = Penguin.getById(targetId);
  if (penguin !== undefined) {
    client.sendXt('gp', Client.engine1Crumb(penguin), 0);
    return;
  }
  // fallback: respond with minimal crumb so client doesn't hang
  const crumb = `${targetId}|Unknown|0|0|0|0|0|0|0|0|0|0|0|0|0`;
  client.sendXt('gp', crumb, 0);
};

handler.xt(Handle.GetPlayerOld, getPlayerOldHandler);
handler.xt(Handle.GetPlayerOldAlt, getPlayerOldHandler);

handler.xt(Handle.SendCardOld, (client, recipientId, cardId, cost) => {
  if (!client.isEngine1) {
    return;
  }

  const postcardCost = 10;
  const recipient = client.server.getPlayerById(recipientId);
  if (recipient !== undefined) {
    recipient.penguin.receivePostcard(cardId, {senderId: client.penguin.id, senderName: client.penguin.name});
    recipient.sendXt('sc', client.penguin.id, client.penguin.name, cardId);
    recipient.update();
  }

  client.penguin.removeCoins(postcardCost);
  client.sendXt('gc', client.penguin.coins);
  client.update();
});

// handler for 2007 client
handler.xt(Handle.GetInventory2007, (client) => {
  client.sendInventory();
});

handler.xt(Handle.SetFrameOld, (client, frame) => {
  client.setFrame(frame);
})

handler.xt(Handle.JoinIglooOld, (client, id, isMember) => {
  const ownerId = Number(id);
  const ownerClient = client.server.getPlayerById(ownerId);
  let igloo = ownerClient?.penguin.activeIgloo;

  if (igloo === undefined && ownerId === client.penguin.id) {
    igloo = client.penguin.activeIgloo;
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
  if (isGreaterOrEqual(client.version, getDate('igloo-music'))) {
    args.push(igloo.music);
  }

  // client misteriously removes the first element of the furniture
  client.sendXt('jp', ...args, ',' + Client.getFurnitureString(igloo.furniture));
  const roomId = 2000 + ownerId;
  client.joinRoom(roomId);
});

// open igloo to the public
handler.xt(Handle.OpenIglooOld, (client, id) => {
  if (!client.isEngine1) {
    return;
  }
  if (id !== client.penguin.id) {
    return;
  }
  client.server.openIgloo(client.penguin.id, client.penguin.activeIgloo);
});

// close igloo to the public
handler.xt(Handle.CloseIglooOld, (client, id) => {
  if (!client.isEngine1) {
    return;
  }
  if (id !== client.penguin.id) {
    return;
  }
  client.server.closeIgloo(client.penguin.id);
});

// get list of open igloos (member igloos)
handler.xt(Handle.GetOpenIgloosOld, (client) => {
  if (!client.isEngine1) {
    return;
  }
  const players = client.server.getOpenIglooPlayers();
  if (players.length === 0) {
    client.sendXt('gr');
    return;
  }
  client.sendXt('gr', ...players.map((p) => `${p.penguin.id}|${p.penguin.name}`));
});

handler.xt(Handle.GetIgloo2007, (client, id) => {
  const targetId = Number(id);
  const targetClient = client.server.getPlayerById(targetId);
  let igloo = targetClient?.penguin.activeIgloo;

  if (igloo === undefined && targetId === client.penguin.id) {
    igloo = client.penguin.activeIgloo;
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

  client.sendXt('gm', targetId, igloo.type, igloo.music, igloo.flooring, Client.getFurnitureString(igloo.furniture));
});

handler.xt(Handle.GetFurnitureOld, (client) => {
  const furniture: number[] = [];
  client.penguin.getAllFurniture().forEach(furn => {
    for (let i = 0; i < furn[1]; i++) {
      furniture.push(furn[0]);
    }
  })

  client.sendXt('gf', ...furniture);
});

handler.xt(Handle.GetFurniture2007, (client) => {
  const furniture: number[] = [];
  client.penguin.getAllFurniture().forEach(furn => {
    for (let i = 0; i < furn[1]; i++) {
      furniture.push(furn[0]);
    }
  })

  client.sendXt('gf', ...furniture);
});

const handleAddFurniture = (client: Client, id: number) => {
  const item = FURNITURE.getStrict(id);
  client.buyFurniture(id, { cost: item.cost });
  client.update();
};

handler.xt(Handle.AddFurnitureOld, handleAddFurniture);
handler.xt(Handle.AddFurniture2007, handleAddFurniture);

const handleAddIgloo = (client: Client, iglooType: number) => {
  const cost = getIglooCost(iglooType);
  client.penguin.removeCoins(cost);
  client.penguin.addIgloo(iglooType);
  // unknown if music was reset or not in the original
  client.penguin.updateIgloo({ type: iglooType, music: 0, flooring: 0, furniture: [] });
  client.sendXt('au', iglooType, client.penguin.coins);
  client.update();
};

handler.xt(Handle.AddIglooOld, handleAddIgloo);
handler.xt(Handle.AddIgloo2007, handleAddIgloo);

const handleAddFlooring = (client: Client, flooring: number) => {
  const cost = getFlooringCost(flooring);
  client.penguin.updateIgloo({ flooring });
  client.penguin.removeCoins(cost);
  client.sendXt('ag', flooring, client.penguin.coins);
  client.update();
};

handler.xt(Handle.AddFlooring2007, handleAddFlooring);

handler.xt(Handle.UpdateIglooOld, (client, type, ...rest) => {
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
  client.penguin.updateIgloo({ furniture: igloo, type: Number(type), music });
  client.update();
});

handler.xt(Handle.UpdateIgloo2007, (client, ...furnitureItems) => {
  const igloo = processFurniture(furnitureItems);
  client.penguin.updateIgloo({ furniture: igloo });
  client.update();
});

handler.xt(Handle.UpdateIglooMusic2007, (client, music) => {
  client.penguin.updateIgloo({ music });
  client.update();
});

// Logging in
handler.post('/php/login.php', (server, body) => {
  const { Username } = body;

  if (server.settings.no_create_via_login && !server.penguinExists(Username)) {
    return 'e=100';
  }

  const penguin = server.getPenguinFromName(Username);

  const virtualDate = server.getVirtualDate(43);
  const buddies = penguin.getBuddies();
  const buddyList = buddies.map((id) => formatBuddyEntry(id, server, true)).join(',');

  const params: Record<string, number | string> = {
    crumb: Client.engine1Crumb(penguin),
    k1: 'a',
    c: penguin.coins,
    s: 0, // SAFE MODE TODO in future?
    // jd uses non virtual date, there simulating age delta it with real time
    jd: getDateString(Date.now() - (server.getVirtualDate(0).getTime() - penguin.virtualRegistration)),
    ed: '10000-1-1', // EXPIRACY DATE TODO what is it for?
    h: '', // TODO what is?
    w: '100|0', // TODO what is?
    m: '', // TODO what is
    bl: buddyList,
    nl: '',
    il: server.getItemsFiltered(penguin.getItems()).join('|'), // item list
    td: `${virtualDate.getUTCFullYear()}-${String(virtualDate.getUTCMonth()).padStart(2, '0')}-${String(virtualDate.getUTCDate()).padStart(2, '0')}:${virtualDate.getUTCHours()}:${virtualDate.getUTCMinutes()}:${virtualDate.getUTCSeconds()}` // used for the snow forts clock in later years
  }

  let response = ''
  for (const key in params) {
    response += `&${key}=${params[key]}`
  }
  return response 
})

handler.post('/php/online.php', () => {
  return '0';
});

// returns a crumb for a given player ID
handler.post('/php/gp.php', (server, body) => {
  const rawId = body.PlayerId ?? body.playerId ?? body.id;
  const penguinId = Number(rawId);
  if (!Number.isFinite(penguinId)) {
    return 'e=0&crumb=0|Unknown|0|0|0|0|0|0|0|0|0|0|0|0|0';
  }

  const penguin = Penguin.getById(penguinId);
  if (penguin !== undefined) {
    const crumb = Client.engine1Crumb(penguin);
    return `e=0&crumb=${crumb}`;
  }

  const crumb = `${penguinId}|Unknown|0|0|0|0|0|0|0|0|0|0|0|0|0`;
  return `e=0&crumb=${crumb}`;
});

handler.disconnect((client) => {
  if (client.hasPenguin()) {
    if (client.isAgentPending()) {
      client.buyItem(800);
      client.update();
    }
    const tableInfo = client.getTable();
    if (tableInfo !== undefined) {
      const table = client.server.getTableIfExists(tableInfo.id);
      if (table !== undefined && tableInfo.seat !== Table.TABLE_SPECTATOR_SEAT) {
        if (table.started && table.hasJoined(tableInfo.seat)) {
          table.clear(client.penguin.name);
        } else {
          const seatIndex = table.getSeatIndex(client);
          if (seatIndex !== undefined) {
            table.seats[seatIndex] = null;
            const count = table.count;
            table.broadcastUpdate();
            if (count === 0) {
              table.reset();
            }
          }
        }
      }
    }
  
    client.disconnect();
    client.penguin.getBuddies().forEach((buddyId) => {
      const buddyClient = client.server.getPlayerById(buddyId);
      if (buddyClient !== undefined) {
        sendBuddyOnlineList(buddyClient, client.penguin.id);
      }
    });
  }
});

export default handler;
