import { items } from "../../game/item";
import { XtHandler } from "..";

const handler = new XtHandler();

handler.xt('m#sm', (client, id, message) => {
  if (message.startsWith('!ai')) {
    if (message.match(/!ai\s+all/) !== null) {
      Object.values(items).map((item) => client.addItem(item.id));
    } else {
      const numberMatch = message.match(/!ai\s+(\d+)/);
      if (numberMatch !== null) {
        const itemId = Number(numberMatch[1]);
        client.addItem(itemId);
      }
    }
  }
});

export default handler