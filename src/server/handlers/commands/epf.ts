import { Room } from "../../game/rooms";
import { XtHandler } from "..";

const handler = new XtHandler();

handler.xt('m#sm', (client, id, message) => {
  if (message.startsWith('!epf')) {
    client.joinRoom(Room.VRRoom);
  }
});

export default handler;