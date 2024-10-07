import { XtHandler } from "..";

const handler = new XtHandler();

// get igloo information
handler.xt('g#gm', (client, id) => {
  client.sendXt('gm', id, client.getIglooString());
})

export default handler;