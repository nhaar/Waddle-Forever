import { ITEMS } from "../../game/items";
import { Handler } from "..";

const handler = new Handler();

// sending inventory to player
handler.xt('i#gi', (client) => {
  client.sendInventory();
});

// giving item
handler.xt('i#ai', (client, item) => {
  const id = Number(item);
  if (client.penguin.hasItem(id)) {
    // TODO
  } else if (!client.canBuy(id)) {
    // TODO
  } else {
    const item = ITEMS.getStrict(id);
    client.buyItem(id, { cost: item.cost });
  }
  client.update();
});

type BodyPartName = 'head' | 'face' | 'neck' | 'body' | 'hand' | 'feet' | 'pin' | 'background';

const addBodyPartUpdater = (xtCode: string, name: BodyPartName) => {
  handler.xt(`s#${xtCode}`, (client, id) => {
    const itemId = Number(id);
    client.penguin[name] = Number(itemId);
    client.sendXt(xtCode, client.penguin.id, itemId);
    client.update();
  })
}

// equipping color
handler.xt('s#upc', (client, color) => {
  client.updateColor(Number(color));
  client.update();
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