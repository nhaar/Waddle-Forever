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
