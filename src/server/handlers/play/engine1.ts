import { Client } from '../../client';
import { Handler } from '..';
import { Room } from '../../game-logic/rooms';
import { getDateString } from '../../../common/utils';
import { commandsHandler } from '../commands';

const handler = new Handler();

// Joining server
handler.xt('js', (client) => {
  client.sendXt('js')
  client.joinRoom(Room.Town)
})

// Joining room
handler.xt('jr', (client, room) => {
  client.joinRoom(Number(room));
})

// Paying after minigame
handler.xt('z', 'zo', (client, score) => {
  const coins = client.getCoinsFromScore(Number(score));
  client.penguin.addCoins(coins);
  
  client.sendXt('zo');
  client.update();
})

// update client's coins
handler.xt('ac', (client) => {
  client.sendEngine1Coins();
})

handler.xt('ai', (client, item) => {
  // TODO remove coins logic
  client.buyItem(Number(item));
  client.update();
})

// updating penguin
handler.xt('up', (client, color, head, face, neck, body, hand, feet, pin, background) => {
  client.penguin.color = Number(color)
  client.penguin.head = Number(head);
  client.penguin.face = Number(face);
  client.penguin.neck = Number(neck);
  client.penguin.body = Number(body);
  client.penguin.hand = Number(hand);
  client.penguin.feet = Number(feet);
  client.penguin.pin = Number(pin);
  client.penguin.background = Number(background);
  client.sendXt('up', client.penguinString)
  client.update();
})

handler.xt('k', 'spy', (client) => {
  client.buyItem(800);
  client.update();
})

handler.xt('il', (client) => {
  client.sendInventory();
}, { once: true })

handler.xt('m', 'sm', commandsHandler);

// handler for 2007 client
handler.xt('gi', (client) => {
  client.sendInventory();
});

// Logging in
handler.post('/php/login.php', (body) => {
  const { Username } = body;
  const penguin = Client.getPenguinFromName(Username);

  const params: Record<string, number | string> = {
    crumb: Client.engine1Crumb(penguin),
    k1: 'a',
    c: penguin.coins,
    s: 0, // SAFE MODE TODO in future?
    jd: getDateString(penguin.registrationTimestamp),
    ed: '10000-1-1', // EXPIRACY DATE TODO what is it for?
    h: '', // TODO what is?
    w: '100|0', // TODO what is?
    m: '' // TODO what is
  }

  let response = ''
  for (const key in params) {
    response += `&${key}=${params[key]}`
  }
  return response 
})

export default handler;
