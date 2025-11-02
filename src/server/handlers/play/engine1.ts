import { Client } from '../../client';
import { Handler } from '..';
import { Room } from '../../game-logic/rooms';
import { getDateString } from '../../../common/utils';
import { commandsHandler } from '../commands';
import { Handle } from '../handles';

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

// handler for 2007 client
handler.xt(Handle.GetInventory2007, (client) => {
  client.sendInventory();
});

handler.xt(Handle.SetFrameOld, (client, frame) => {
  client.setFrame(frame);
})

// Logging in
handler.post('/php/login.php', (server, body) => {
  const { Username } = body;
  const penguin = Client.getPenguinFromName(Username);

  const virtualDate = server.getVirtualDate(43);

  const params: Record<string, number | string> = {
    crumb: Client.engine1Crumb(penguin),
    k1: 'a',
    c: penguin.coins,
    s: 0, // SAFE MODE TODO in future?
    jd: getDateString(penguin.registrationTimestamp),
    ed: '10000-1-1', // EXPIRACY DATE TODO what is it for?
    h: '', // TODO what is?
    w: '100|0', // TODO what is?
    m: '', // TODO what is
    il: penguin.getItems().join('|'), // item list
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
