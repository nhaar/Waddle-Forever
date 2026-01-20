import { ITEMS, ItemType } from "../../game-logic/items";
import { Handler } from "..";
import { Handle } from "../handles";
import { isGameRoom } from "../../game-logic/rooms";

const handler = new Handler();

// sending inventory to player
handler.xt(Handle.GetInventory, (client) => {
  client.sendInventory();
});

// giving item
handler.xt(Handle.AddItem, (client, id) => {
  client.buyItem(id);
  client.update();
  // updating mission stampbook
  if (isGameRoom(client.room.id)) {
    const item = ITEMS.getStrict(id);
    if (item.type === ItemType.Award) {
      client.sendXt('qpa', client.penguin.id, id);
    }
  }
});

handler.xt(Handle.UpdateColor, (client, id) => {
  client.updateEquipment('color', id);
  client.update();
});

handler.xt(Handle.UpdateHead, (client, id) => {
  client.updateEquipment('head', id);
  client.update();
});

handler.xt(Handle.UpdateFace, (client, id) => {
  client.updateEquipment('face', id);
  client.update();
});

handler.xt(Handle.UpdateNeck, (client, id) => {
  client.updateEquipment('neck', id);
  client.update();
});

handler.xt(Handle.UpdateBody, (client, id) => {
  client.updateEquipment('body', id);
  client.update();
});

handler.xt(Handle.UpdateHand, (client, id) => {
  client.updateEquipment('hand', id);
  client.update();
});

handler.xt(Handle.UpdateFeet, (client, id) => {
  client.updateEquipment('feet', id);
  client.update();
});

handler.xt(Handle.UpdatePin, (client, id) => {
  client.updateEquipment('pin', id);
  client.update();
});

handler.xt(Handle.UpdateBackground, (client, id) => {
  client.updateEquipment('background', id);
  client.update();
});

export default handler;