import { XtHandler } from '..';
import { Room } from '../../game/rooms';

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

export default handler;
