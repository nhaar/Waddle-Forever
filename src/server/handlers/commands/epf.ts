import { Room } from "../../game/rooms";
import { XtHandler } from "..";

const handler = new XtHandler();

handler.xt('m#sm', (client, id, message) => {
  if (message.startsWith('!epf')) {
    client.joinRoom(Room.VRRoom);
  } else if (message.startsWith('!awards')) {
    // grant m7-m11 awards for speedrunning
    const awards = [815, 817, 819, 822, 8007];
    awards.forEach((award) => {
      client.addItem(award);
    });
  }
});

export default handler;