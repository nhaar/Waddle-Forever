import { ITEMS } from "../../game-logic/items";
import { Handler } from "..";
import { EQUIP_SLOT_MAPPINGS } from "../../../server/client";
import { iterateEntries } from "../../../common/utils";

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

iterateEntries(EQUIP_SLOT_MAPPINGS, (slot, char) => {
  handler.xt(`s#up${char}`, (client, id) => {
    const itemId = Number(id);
    client.updateEquipment(slot, itemId);
    client.update();
  })
});

export default handler;