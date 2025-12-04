import { Client } from '../../client';
import { Handler } from '..';
import { Room } from '../../game-logic/rooms';
import { getDateString } from '../../../common/utils';
import { commandsHandler } from '../commands';
import { Handle } from '../handles';
import { processFurniture } from './igloo';
import { isGreaterOrEqual } from '../../../server/routes/versions';
import { IGLOO_MUSIC_RELEASE } from '../../../server/timelines/dates';

const handler = new Handler();

// Joining server
handler.xt(Handle.JoinServerOld, (client) => {
  client.sendXt('js')
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
  const args: Array<string | number> = [id, client.penguin.activeIgloo.type, ];
  
  // when igloo music was added, the music parameter is optional
  if (isGreaterOrEqual(client.version, IGLOO_MUSIC_RELEASE)) {
    args.push(client.penguin.activeIgloo.music);
  }
  
  // client misteriously removes the first element of the furniture
  client.sendXt('jp', ...args, ',' + Client.getFurnitureString(client.penguin.activeIgloo.furniture));
  const roomId = 2000 + id;
  client.joinRoom(roomId);
});

handler.xt(Handle.GetIgloo2007, (client, id) => {
  client.sendXt('gm', id, client.penguin.activeIgloo.type, client.penguin.activeIgloo.music, client.penguin.activeIgloo.flooring, Client.getFurnitureString(client.penguin.activeIgloo.furniture));
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
    il: server.getItemsFiltered(penguin.getItems()).join('|'), // item list
    td: `${virtualDate.getUTCFullYear()}-${String(virtualDate.getUTCMonth()).padStart(2, '0')}-${String(virtualDate.getUTCDate()).padStart(2, '0')}:${virtualDate.getUTCHours()}:${virtualDate.getUTCMinutes()}:${virtualDate.getUTCSeconds()}` // used for the snow forts clock in later years
  }

  let response = ''
  for (const key in params) {
    response += `&${key}=${params[key]}`
  }
  return response 
})

handler.disconnect((client) => {
  client.disconnect();
});

export default handler;
