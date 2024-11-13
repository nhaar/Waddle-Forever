import { Client } from '../../../server/penguin';
import { XtHandler } from '..';
import { Room } from '../../game/rooms';
import { getDateString } from '../../../common/utils';

const handler = new XtHandler();

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
  client.addCoins(coins);
  client.update();

  client.sendXt('zo');
})

handler.xt('ac', (client) => {
  client.sendXt('ac', client.penguin.coins);
})

handler.xt('ai', (client, item) => {
  // TODO remove coins logic
  client.addItem(Number(item));
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
  client.update();
  client.sendXt('up', client.penguinString)
})
handler.xt('il', (client) => {
  client.sendInventory();
}, { once: true })


// Logging in
handler.post('/php/login.php', (body) => {
  const { Username } = body;
  const [penguin, id] = Client.getPenguinFromName(Username);

  const params: Record<string, number | string> = {
    crumb: Client.as1Crumb(penguin ,id),
    k1: 'a',
    c: penguin.coins,
    s: 0, // SAFE MODE TODO in future?
    jd: getDateString(penguin.registration_date),
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
