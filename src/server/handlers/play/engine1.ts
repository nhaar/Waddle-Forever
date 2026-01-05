import { Client, Server } from '../../client';
import { Handler } from '..';
import { Room } from '../../game-logic/rooms';
import { getDateString } from '../../../common/utils';
import { Handle } from '../handles';
import { processFurniture } from './igloo';
import { isGreaterOrEqual } from '../../../server/routes/versions';
import { IGLOO_MUSIC_RELEASE } from '../../../server/timelines/dates';
import { Penguin } from '../../penguin';
import { FURNITURE } from '../../../server/game-logic/furniture';
import { getFlooringCost, getIglooCost } from '../../../server/game-logic/iglooItems';

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

const MANCALA_TABLE_IDS = new Set([100, 101, 102, 103, 104]);
const FIND_FOUR_TABLE_IDS = new Set([200, 201, 202, 203, 204, 205, 206, 207]);
// engine1 clients expect seats as 1-based; 99 is spectator
const TABLE_SPECTATOR_SEAT = 99;
const FIND_FOUR_WIDTH = 7;
const FIND_FOUR_HEIGHT = 6;

// engine1 sled uses waddle state but uses old z% protocol
function getSledGame(client: Client) {
  if (!client.isInWaddleGame() || client.waddleGame.name !== 'sled') {
    return undefined;
  }
  return client.waddleGame;
}

type BoardType = 'find' | 'mancala';

type FindFourBoard = {
  type: 'find';
  board: number[][];
}

type MancalaBoard = {
  type: 'mancala';
  board: number[];
}

type Board = FindFourBoard | MancalaBoard;

type Table = {
  id: number;
  roomId: number;
  server: Server;
  seats: Array<Client | null>;
  board: Board;
  started: boolean;
  ended: boolean;
  turn: number;
}

type TablePlayerState = {
  tableId: number;
  seatId: number;
  joinedGame: boolean;
};

// in-memory state for engine1 table games.
const tables = new Map<number, Table>();
const playerTables = new Map<number, TablePlayerState>();
// track spectators so we can suppress the 0-coin popup
const tableSpectators = new Set<number>();

function forEachTableParticipant(
  tableId: number,
  server: Server,
  callback: (player: Client) => void
): void {
  for (const [playerId, info] of playerTables.entries()) {
    if (info.tableId !== tableId || !info.joinedGame) {
      continue;
    }
    const participant = server.getPlayerById(playerId);
    if (participant !== undefined) {
      callback(participant);
    }
  }
}

function countSeats(seats: Array<Client | null>): number {
  return seats.filter((seat) => seat !== null).length;
}

function getSeatIndex(seats: Array<Client | null>, client: Client): number | undefined {
  const seatIndex = seats.findIndex((seat) => seat?.penguin.id === client.penguin.id);
  return seatIndex === -1 ? undefined : seatIndex;
}

function assignSeatIndex(seats: Array<Client | null>, client: Client): number | undefined {
  const existingSeat = getSeatIndex(seats, client);
  if (existingSeat !== undefined) {
    return existingSeat;
  }
  const openSeat = seats.findIndex((seat) => seat === null);
  if (openSeat === -1) {
    return undefined;
  }
  seats[openSeat] = client;
  return openSeat;
}

function sendTablePacket(
  tableId: number,
  server: Server,
  handler: string,
  ...args: Array<number | string>
): void {
  forEachTableParticipant(tableId, server, (player) => {
    player.sendXt(handler, ...args);
  });
}

function sendSeatRoster(
  tableId: number,
  server: Server,
  seats: Array<Client | null>,
  handler: string,
  target?: Client
): void {

  seats.forEach((seat, index) => {
    const name = seat?.penguin.name ?? '';
    if (target !== undefined) {
      target.sendXt(handler, index, name);
      return;
    }
    sendTablePacket(tableId, server, 'uz', index, name);
  });
}

function createBoard(type: BoardType): Board {
  switch (type) {
    case 'find':
      return { board: createFindFourBoard(), type };
    case 'mancala':
      return { board: createMancalaBoard(), type };
  }
}

function createMancalaBoard(): number[] {
  return [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
}

function getTableType(tableId: number): BoardType {
  if (MANCALA_TABLE_IDS.has(tableId)) {
    return 'mancala'
  } else if (FIND_FOUR_TABLE_IDS.has(tableId)) {
    return 'find'
  } else {
      throw new Error('Unkown table ID');

  }
}

function getTable(tableId: number, roomId: number, server: Server): Table {
  let table = tables.get(tableId);
  if (table === undefined) {
    const board = createBoard(getTableType(tableId));
    table = {
      id: tableId,
      roomId,
      server,
      seats: [null, null],
      board,
      started: false,
      ended: false,
      turn: 0
    };
    tables.set(tableId, table);
  } else {
    table.roomId = roomId;
    table.server = server;
  }
  return table;
}

function resetTable(table: Table): void {
  table.board = createBoard(table.board.type);
  table.started = false;
  table.ended = false;
  table.turn = 0;
}

function broadcastTableUpdate(server: Client['server'], roomId: number, tableId: number, count: number): void {
  const room = server.getRoom(roomId);
  room.players.forEach((player) => {
    player.sendXt('ut', tableId, count);
  });
}

function sendTableUpdate(tableId: number, server: Server, seatId: number, name: string): void {
  sendTablePacket(tableId, server, 'uz', seatId, name);
}

function clearTable(table: Table, quitterName: string): void {
  const notified = new Set<number>();
  table.seats.forEach((player) => {
    if (player !== null) {
      player.sendXt('cz', quitterName);
      notified.add(player.penguin.id);
    }
  });
  forEachTableParticipant(table.id, table.server, (player) => {
    if (!notified.has(player.penguin.id)) {
      player.sendXt('cz', quitterName);
    }
  });
  for (const [playerId, info] of playerTables.entries()) {
    if (info.tableId === table.id) {
      playerTables.delete(playerId);
    }
  }
  table.seats = [null, null];
  resetTable(table);
  broadcastTableUpdate(table.server, table.roomId, table.id, 0);
}


function isMancalaCupForPlayer(player: number, cup: number): boolean {
  return player === 0 ? cup >= 0 && cup <= 5 : cup >= 7 && cup <= 12;
}

function isMancalaSideEmpty(board: number[], player: number): boolean {
  const start = player === 0 ? 0 : 7;
  const end = player === 0 ? 5 : 12;
  for (let i = start; i <= end; i++) {
    if (board[i] > 0) {
      return false;
    }
  }
  return true;
}

function applyMancalaMove(board: number[], player: number, cup: number): { command: string; nextTurn: number; gameOver: boolean } {
  let stones = board[cup];
  board[cup] = 0;

  const opponentMancala = player === 0 ? 13 : 6;
  let index = cup;
  while (stones > 0) {
    index = (index + 1) % 14;
    if (index === opponentMancala) {
      index = (index + 1) % 14;
    }
    board[index] += 1;
    stones -= 1;
  }

  const playerMancala = player === 0 ? 6 : 13;
  const lastCup = index;
  let command = '';
  let nextTurn = player === 0 ? 1 : 0;

  if (lastCup === playerMancala) {
    command = 'f';
    nextTurn = player;
  } else if (isMancalaCupForPlayer(player, lastCup) && board[lastCup] === 1) {
    const oppositeCup = 12 - lastCup;
    if (board[oppositeCup] > 0) {
      command = 'c';
      board[playerMancala] += board[oppositeCup] + board[lastCup];
      board[oppositeCup] = 0;
      board[lastCup] = 0;
    }
  }

  const gameOver = isMancalaSideEmpty(board, 0) || isMancalaSideEmpty(board, 1);
  return { command, nextTurn, gameOver };
}

function getMancalaScore(board: number[], player: number): number {
  const start = player === 0 ? 0 : 7;
  const end = player === 0 ? 6 : 13;
  let total = 0;
  for (let i = start; i <= end; i++) {
    total += board[i];
  }
  return total;
}

function awardMancalaCoins(table: Table, board: number[]): void {
  awardTableCoins(table, [getMancalaScore(board, 0), getMancalaScore(board, 1)])
}

function awardTableCoins(table: Table, scores: [number, number]): void {
  for (const [playerId, info] of playerTables.entries()) {
    if (info.tableId !== table.id || !info.joinedGame) {
      continue;
    }
    if (info.seatId !== 0 && info.seatId !== 1) {
      continue;
    }
    const player = table.server.getPlayerById(playerId);
    if (player === undefined) {
      continue;
    }
    const score = scores[info.seatId] ?? 0;
    if (score > 0) {
      player.penguin.addCoins(score);
    }
    player.update();
  }
}

function resetTableRound(table: Table): void {
  resetTable(table);
  table.seats = [null, null];
  for (const [playerId, info] of playerTables.entries()) {
    if (info.tableId !== table.id) {
      continue;
    }
    playerTables.set(playerId, { ...info, joinedGame: false });
  }
  broadcastTableUpdate(table.server, table.roomId, table.id, 0);
}

function createFindFourBoard(): number[][] {
  return Array.from({ length: FIND_FOUR_WIDTH }, () => Array(FIND_FOUR_HEIGHT).fill(0));
}

function markTableSpectatorCoins(table: Table): void {
  // spectators still request coins; flag them so GetCoins ignores it
  for (const [playerId, info] of playerTables.entries()) {
    if (info.tableId !== table.id || !info.joinedGame) {
      continue;
    }
    if (info.seatId === 0 || info.seatId === 1) {
      continue;
    }
    tableSpectators.add(playerId);
  }
}

function serializeFindFourBoard(board: number[][]): string {
  const values: number[] = [];
  for (let x = 0; x < FIND_FOUR_WIDTH; x++) {
    for (let y = 0; y < FIND_FOUR_HEIGHT; y++) {
      values.push(board[x]?.[y] ?? 0);
    }
  }
  return values.join(',');
}

function isFindFourBoardFull(board: number[][]): boolean {
  for (let x = 0; x < FIND_FOUR_WIDTH; x++) {
    for (let y = 0; y < FIND_FOUR_HEIGHT; y++) {
      if (board[x]?.[y] === 0) {
        return false;
      }
    }
  }
  return true;
}

function findFourWin(
  board: number[][],
  lastX: number,
  lastY: number
): { x: number; y: number; direction: number; winner: number } | undefined {
  const value = board[lastX]?.[lastY] ?? 0;
  if (value <= 0) {
    return undefined;
  }

  const inBounds = (x: number, y: number): boolean =>
    x >= 0 && x < FIND_FOUR_WIDTH && y >= 0 && y < FIND_FOUR_HEIGHT;

  const countInDirection = (dx: number, dy: number): number => {
    let count = 0;
    let x = lastX + dx;
    let y = lastY + dy;
    while (inBounds(x, y) && board[x]?.[y] === value) {
      count += 1;
      x += dx;
      y += dy;
    }
    return count;
  };

  const directions = [
    { dx: 1, dy: 0, direction: 2 },
    { dx: 0, dy: 1, direction: 1 },
    { dx: 1, dy: 1, direction: 3 },
    { dx: 1, dy: -1, direction: 4 }
  ];

  let best:
    | { x: number; y: number; direction: number; winner: number; dist: number }
    | undefined;

  for (const { dx, dy, direction } of directions) {
    const back = countInDirection(-dx, -dy);
    const forward = countInDirection(dx, dy);
    const total = back + 1 + forward;
    if (total < 4) {
      continue;
    }
    const lineStartX = lastX - dx * back;
    const lineStartY = lastY - dy * back;
    const startMin = Math.max(0, back - 3);
    const startMax = Math.min(back, total - 4);

    for (let startIndex = startMin; startIndex <= startMax; startIndex++) {
      const startX = lineStartX + dx * startIndex;
      const startY = lineStartY + dy * startIndex;
      const positions = [
        { x: startX, y: startY },
        { x: startX + dx, y: startY + dy },
        { x: startX + dx * 2, y: startY + dy * 2 },
        { x: startX + dx * 3, y: startY + dy * 3 }
      ];
      const anchorY = Math.min(...positions.map((pos) => pos.y));
      const anchorX =
        direction === 4
          ? Math.max(...positions.map((pos) => pos.x))
          : Math.min(...positions.map((pos) => pos.x));
      const centerX = startX + dx * 1.5;
      const centerY = startY + dy * 1.5;
      const dist = (centerX - lastX) ** 2 + (centerY - lastY) ** 2;
      if (best === undefined || dist < best.dist) {
        best = { x: anchorX, y: anchorY, direction, winner: value, dist };
      }
    }
  }

  if (best !== undefined) {
    return { x: best.x, y: best.y, direction: best.direction, winner: best.winner };
  }

  return undefined;
}

function awardFindFourCoins(table: Table, winnerSeat?: number): void {
  const rewards: [number, number] = [5, 5];
  if (winnerSeat === 0 || winnerSeat === 1) {
    rewards[winnerSeat] = 10;
  }
  awardTableCoins(table, rewards);
}

// Joining server
handler.xt(Handle.JoinServerOld, (client) => {
  client.sendXt('js')

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
      if ((client as unknown as { _currentWaddleRoom?: unknown })._currentWaddleRoom !== undefined) {
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
  if ((client as unknown as { _currentWaddleRoom?: unknown })._currentWaddleRoom !== undefined) {
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
  if (tableSpectators.delete(client.penguin.id)) {
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
    const table = getTable(tableId, roomId, client.server);
    entries.push(`${tableId}|${countSeats(table.seats)}`);
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

  // clear any stale table seat if the player is switching tables
  const existingTable = playerTables.get(client.penguin.id);
  if (existingTable !== undefined && existingTable.tableId !== tableId) {
    const previousTable = tables.get(existingTable.tableId);
    if (previousTable !== undefined) {
      const previousSeat = getSeatIndex(previousTable.seats, client);
      if (previousSeat !== undefined) {
        previousTable.seats[previousSeat] = null;
        const remaining = countSeats(previousTable.seats);
        broadcastTableUpdate(previousTable.server, previousTable.roomId, previousTable.id, remaining);
        if (remaining === 0) {
          resetTable(previousTable);
          for (const [playerId, info] of playerTables.entries()) {
            if (info.tableId === previousTable.id) {
              playerTables.delete(playerId);
            }
          }
        }
      }
    }
    playerTables.delete(client.penguin.id);
  }

  const table = getTable(tableId, room.id, client.server);
  const beforeCount = countSeats(table.seats);
  let seatId = getSeatIndex(table.seats, client);
  if (seatId === undefined) {
    const assigned = assignSeatIndex(table.seats, client);
    seatId = assigned ?? TABLE_SPECTATOR_SEAT;
  }
  
  playerTables.set(client.penguin.id, { tableId, seatId, joinedGame: false });
  // first seated player resets a stale board
  if (seatId !== TABLE_SPECTATOR_SEAT && beforeCount === 0) {
    resetTable(table);
  }
  if (seatId !== TABLE_SPECTATOR_SEAT) {
    const afterCount = countSeats(table.seats);
    if (afterCount !== beforeCount) {
      broadcastTableUpdate(client.server, room.id, tableId, afterCount);
    }
  }
  // the index here is 1 based
  const tableSeatId = seatId === TABLE_SPECTATOR_SEAT ? seatId : seatId + 1;
  client.sendXt('jt', tableId, tableSeatId);
});

function serializeBoard(board: Board): string {
  switch (board.type) {
    case 'mancala':
      return board.board.join(',');
    case 'find':
      return serializeFindFourBoard(board.board);
  }
}

handler.xt(Handle.LeaveTableOld, (client) => {
  if (!client.isEngine1) {
    return;
  }
  // old leave flow: free seat, broadcast count, and reset if empty
  const tableInfo = playerTables.get(client.penguin.id);
  if (tableInfo !== undefined) {
    const table = tables.get(tableInfo.tableId);
    playerTables.delete(client.penguin.id);
    if (table === undefined) {
      return;
    }
    const seatIndex = getSeatIndex(table.seats, client);
    if (seatIndex === undefined) {
      return;
    }
    table.seats[seatIndex] = null;
    const count = countSeats(table.seats);
    broadcastTableUpdate(table.server, table.roomId, table.id, count);
    if (count === 0) {
      resetTable(table);
      for (const [playerId, playerInfo] of playerTables.entries()) {
        if (playerInfo.tableId === table.id) {
          playerTables.delete(playerId);
        }
      }
    }
  }
});

function isTableId(tableId: number) {
  return FIND_FOUR_TABLE_IDS.has(tableId) || MANCALA_TABLE_IDS.has(tableId);
}

handler.xt(Handle.GetTableGame, (client, tableId) => {
  if (!client.isEngine1) {
    return;
  }
  // resolve table id from context so spectators can re-open correctly
  let resolvedTableId = tableId;
  if (!isTableId(resolvedTableId)) {
    const existingTable = playerTables.get(client.penguin.id);
    if (existingTable !== undefined) {
      resolvedTableId = existingTable.tableId;
    } else {
      for (const [id, table] of tables.entries()) {
        if (getSeatIndex(table.seats, client) !== undefined) {
          resolvedTableId = id;
          break;
        }
      }
    }
  }

  const roomId = client.room?.id ?? tables.get(resolvedTableId)?.roomId ?? 0;
  const table = getTable(resolvedTableId, roomId, client.server);
  const name0 = table.seats[0]?.penguin.name ?? '';
  const name1 = table.seats[1]?.penguin.name ?? '';

  // game-depending logic  
  const boardState = serializeBoard(table.board);

  const existing = playerTables.get(client.penguin.id);
  if (existing === undefined || existing.tableId !== resolvedTableId) {
    const seatId = getSeatIndex(table.seats, client) ?? TABLE_SPECTATOR_SEAT;
    playerTables.set(client.penguin.id, { tableId: resolvedTableId, seatId, joinedGame: false });
  }
  const playerInfo = playerTables.get(client.penguin.id);
  // when already in-game, include turn info
  if (table.started && playerInfo?.joinedGame) {
    client.sendXt('gz', name0, name1, boardState, table.turn);
  } else {
    client.sendXt('gz', name0, name1, boardState);
  }
});

handler.xt(Handle.JoinTableGame, (client) => {
  if (!client.isEngine1) {
    return;
  }
  // join the game instance after table seat selection
  let tableInfo = playerTables.get(client.penguin.id);
  if (tableInfo !== undefined) {
    const roomId = client.room?.id ?? tables.get(tableInfo.tableId)?.roomId ?? 0;
    const table = getTable(tableInfo.tableId, roomId, client.server);
    const currentSeat = getSeatIndex(table.seats, client);
    let seatId = tableInfo.seatId;
    if (currentSeat !== undefined) {
      seatId = currentSeat;
    } else if (seatId >= 0 && seatId < table.seats.length && table.seats[seatId] === null) {
      table.seats[seatId] = client;
    } else {
      const assigned = assignSeatIndex(table.seats, client);
      seatId = assigned ?? TABLE_SPECTATOR_SEAT;
    }

    if (seatId !== tableInfo.seatId) {
      tableInfo = { ...tableInfo, seatId };
    }

    const alreadyJoined = tableInfo.joinedGame;
    if (!tableInfo.joinedGame) {
      tableInfo = { ...tableInfo, joinedGame: true };
    }
    playerTables.set(client.penguin.id, tableInfo);

    client.sendXt('jz', seatId);
    sendSeatRoster(table.id, table.server, table.seats, 'uz', client);

    if (!alreadyJoined && seatId !== TABLE_SPECTATOR_SEAT) {
      sendTableUpdate(table.id, table.server, seatId, client.penguin.name);
    }

    // start the match when both players have joined
    if (!table.started) {
      const seatsReady = table.seats.every((seat) => {
        if (seat === null) {
          return false;
        }
        return playerTables.get(seat.penguin.id)?.joinedGame === true;
      });
      if (seatsReady) {
        table.started = true;
        table.turn = 0;
        sendTablePacket(table.id, table.server, 'sz', table.turn);
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
  const tableInfo = playerTables.get(client.penguin.id);
  if (tableInfo !== undefined) {
    const table = tables.get(tableInfo.tableId);
    if (table === undefined) {
      playerTables.delete(client.penguin.id);
      return;
    }
    if (tableInfo.seatId === TABLE_SPECTATOR_SEAT) {
      client.sendXt('lz');
      playerTables.delete(client.penguin.id);
      return;
    }
    if (!table.started) {
      const seatIndex = getSeatIndex(table.seats, client);
      if (seatIndex !== undefined) {
        table.seats[seatIndex] = null;
      }
      playerTables.delete(client.penguin.id);
      if (tableInfo.seatId < 2) {
        sendTableUpdate(table.id, table.server, tableInfo.seatId, '');
      }
      const count = countSeats(table.seats);
      broadcastTableUpdate(table.server, table.roomId, table.id, count);
      if (count === 0) {
        resetTable(table);
        for (const [playerId, info] of playerTables.entries()) {
          if (info.tableId === table.id) {
            playerTables.delete(playerId);
          }
        }
      }
      return;
    }
    clearTable(table, client.penguin.name);
  }
});

handler.xt(Handle.SendTableMove, (client, ...moves) => {
  if (!client.isEngine1) {
    return;
  }
  let automaticTurnChange = true;
  // dispatch board moves for find four or mancala
  const tableInfo = playerTables.get(client.penguin.id);
  if (tableInfo !== undefined) {
    if (!tableInfo.joinedGame || tableInfo.seatId === TABLE_SPECTATOR_SEAT) {
      return;
    }
    const table = tables.get(tableInfo.tableId);
    if (table === undefined || !table.started || table.ended) {
      return;
    }
    const player = tableInfo.seatId;
    if (player !== 0 && player !== 1) {
      return;
    }
    if (table.turn !== player) {
      return;
    }


    // table game specific logic
    if (table.board.type === 'find') {
      if (moves.length !== 2) {
        // Ignore non-table zm packets (e.g. sled racing uses 4 args).
        return;
      }
      const column = moves[0];
      const dropRow = moves[1];
      table.board.board[column][dropRow] = player + 1;
      sendTablePacket(table.id, table.server, 'zm', player, column, dropRow);
      const win = findFourWin(table.board.board, column, dropRow);
      if (win !== undefined) {
        table.ended = true;
        awardFindFourCoins(table, win.winner - 1);
        markTableSpectatorCoins(table);
        sendTablePacket(table.id, table.server, 'zo', win.x, win.y, win.direction);
        resetTableRound(table);
        return;
      } else if (isFindFourBoardFull(table.board.board)) {
        table.ended = true;
        awardFindFourCoins(table);
        markTableSpectatorCoins(table);
        sendTablePacket(table.id, table.server, 'zo', -10, -10, 1);
        resetTableRound(table);
        return;
      }
    } else if (table.board.type === 'mancala') {
      if (moves.length !== 1) {
        return;
      }
      const cup = moves[0];
      if (!isMancalaCupForPlayer(player, cup)) {
        return;
      }
      if (table.board.board[cup] <= 0) {
        return;
      }

      const { command, nextTurn, gameOver } = applyMancalaMove(table.board.board, player, cup);
      const zmArgs: Array<number | string> = [player, cup];
      if (command !== '') {
        zmArgs.push(command);
      }
      sendTablePacket(table.id, table.server, 'zm', ...zmArgs);
      table.turn = nextTurn;
      automaticTurnChange = false;
      if (gameOver) {
        table.ended = true;
        awardMancalaCoins(table, table.board.board);
        markTableSpectatorCoins(table);
        sendTablePacket(table.id, table.server, 'zo');
        resetTableRound(table);
      }
    }
    if (automaticTurnChange) {
      table.turn = table.turn === 0 ? 1 : 0;
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
  client.buyItem(800);
  client.update();
})

handler.xt(Handle.GetInventoryOld, (client) => {
  client.sendInventory();
}, { once: true });

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
  const roomInfo = (client as unknown as { _roomInfo?: { x: number; y: number; frame: number } })._roomInfo;
  if (roomInfo === undefined) {
    return;
  }
  roomInfo.x = x;
  roomInfo.y = y;
  roomInfo.frame = frame;
  if ((client as unknown as { _currentRoom?: unknown })._currentRoom === undefined) {
    return;
  }
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

handler.xt(Handle.SendSafeMessageOld, (client, id) => {
  client.sendSafeMessage(id);
});

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
  if (isGreaterOrEqual(client.version, IGLOO_MUSIC_RELEASE)) {
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
    const tableInfo = playerTables.get(client.penguin.id);
    if (tableInfo !== undefined) {
      const table = tables.get(tableInfo.tableId);
      if (table === undefined) {
        playerTables.delete(client.penguin.id);
      } else if (tableInfo.seatId === TABLE_SPECTATOR_SEAT) {
        playerTables.delete(client.penguin.id);
      } else if (table.started && tableInfo.joinedGame) {
        clearTable(table, client.penguin.name);
      } else {
        const seatIndex = getSeatIndex(table.seats, client);
        if (seatIndex !== undefined) {
          table.seats[seatIndex] = null;
          const count = countSeats(table.seats);
          broadcastTableUpdate(table.server, table.roomId, table.id, count);
          if (count === 0) {
            resetTable(table);
            for (const [playerId, info] of playerTables.entries()) {
              if (info.tableId === table.id) {
                playerTables.delete(playerId);
              }
            }
          }
        }
        playerTables.delete(client.penguin.id);
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
