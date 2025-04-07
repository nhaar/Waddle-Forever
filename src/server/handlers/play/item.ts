import { Handler } from "..";

const handler = new Handler();

// sending inventory to player
handler.xt('i#gi', (client) => {
  client.sendInventory();
});

// giving item
// NOTICE: COST here is NOT part of vanilla shell, MUST be modded
handler.xt('i#ai', (client, item, cost) => {
  const id = Number(item);
  if (client.hasItem(id)) {
    // TODO
  } else if (!client.canBuy(id)) {
    // TODO
  } else {
    client.addItem(id, Number(cost));
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