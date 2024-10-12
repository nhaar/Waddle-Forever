import { XtHandler } from "..";

const handler = new XtHandler();

handler.xt('m#sm', (client, id, message) => {
  if (message.startsWith('!ai')) {
    const numberMatch = message.match(/!ai\s+(\d+)/);
    if (numberMatch !== null) {
      const itemId = Number(numberMatch[1]);
      client.addItem(itemId);
    }
  }
});

export default handler