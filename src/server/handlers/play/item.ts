import { XtHandler } from "..";

const handler = new XtHandler();

// sending inventory to player
handler.xt('i#gi', (client) => {
  client.sendXt('gi', client.penguin.inventory.join('%'));
});

// giving item
handler.xt('i#ai', (client, item) => {
  const id = Number(item);
  if (client.hasItem(id)) {
    // TODO
  } else if (!client.canBuy(id)) {
    // TODO
  } else {
    client.addItem(id);
  }
});

export default handler;