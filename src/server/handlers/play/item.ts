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

type BodyPartName = 'head' | 'face' | 'neck' | 'body' | 'hand' | 'feet' | 'pin' | 'background';

const addBodyPartUpdater = (xtCode: string, name: BodyPartName) => {
  handler.xt(`s#${xtCode}`, (client, id) => {
    const itemId = Number(id);
    client.penguin[name] = Number(itemId);
    client.update();
    client.sendXt(xtCode, client.id, itemId);
  })
}

// equipping color
handler.xt('s#upc', (client, color) => {
  client.updateColor(Number(color));
});

addBodyPartUpdater('upa', 'hand');

addBodyPartUpdater('upf', 'face');

addBodyPartUpdater('upb', 'body');

addBodyPartUpdater('upn', 'neck');

addBodyPartUpdater('uph', 'head');

addBodyPartUpdater('upe', 'feet');

addBodyPartUpdater('upl', 'pin');

addBodyPartUpdater('upp', 'background');

export default handler;