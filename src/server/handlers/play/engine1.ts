import { Client } from '../../client';
import { Handler } from '..';
import { Room } from '../../game-logic/rooms';
import { getDateString } from '../../../common/utils';
import { commandsHandler } from '../commands';
import { Handle } from '../handles';
import { processFurniture } from './igloo';
import { isGreaterOrEqual } from '../../../server/routes/versions';
import { IGLOO_MUSIC_RELEASE } from '../../../server/timelines/dates';
import { Penguin } from '../../penguin';

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

function ensureBuddyPersisted(penguinId: number, buddyId: number): void {
  const penguin = Penguin.getById(penguinId);
  if (penguin === undefined) {
    return;
  }
  if (!penguin.hasBuddy(buddyId)) {
    penguin.addBuddy(buddyId);
    penguin.update();
  }
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
handler.xt(Handle.JoinRoomOld, (client, room) => {
  client.joinRoom(room);
})

// Paying after minigame
handler.xt(Handle.LeaveGame, (client, score) => {
  if (!client.isEngine1) {
    return;
  }
  const coins = client.getCoinsFromScore(score);
  client.penguin.addCoins(coins);
  
  client.sendXt('zo');
  client.update();
})

// update client's coins
handler.xt(Handle.GetCoins, (client) => {
  client.sendEngine1Coins();
})

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

handler.xt(Handle.SendMessageOld, commandsHandler);

handler.xt(Handle.SetPositionOld, (client, ...args) => {
  client.setPosition(...args);
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
      // persist both sides immediately
      client.update();
      requester.update();
      ensureBuddyPersisted(client.penguin.id, requesterNumericId);
      ensureBuddyPersisted(requesterNumericId, client.penguin.id);
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
    ensureBuddyPersisted(client.penguin.id, requesterNumericId);
  }

  if (!requesterPenguin.hasBuddy(client.penguin.id)) {
    requesterPenguin.addBuddy(client.penguin.id);
    requesterPenguin.update();
    ensureBuddyPersisted(requesterNumericId, client.penguin.id);
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

handler.xt(Handle.AddFurnitureOld, (client, id) => {
  client.buyFurniture(id);
  client.update();
});

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
  const penguin = (client as unknown as { _penguin?: Penguin })._penguin;
  const buddyIds = penguin !== undefined ? penguin.getBuddies() : [];

  client.disconnect();

  buddyIds.forEach((buddyId) => {
    const buddyClient = client.server.getPlayerById(buddyId);
    if (buddyClient !== undefined) {
      sendBuddyOnlineList(buddyClient, client.penguin.id);
    }
  });
});

export default handler;
