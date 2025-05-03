import { ITEMS, ItemType } from "../../game-logic/items";
import { Handler } from "..";

const handler = new Handler();

// getting pin information opening stampbook
handler.xt('i#qpp', (client, id) => {
  client.sendXt('qpp', client.getPinString());
});

// getting mission stamps
handler.xt('i#qpa', (client) => {
  const awards = [];
  for (const item of client.penguin.getItems()) {
    const itemInfo = ITEMS.get(Number(item));
    if (itemInfo !== undefined && itemInfo.type === ItemType.Award) {
      awards.push(item);
    }
  }
  client.sendXt('qpa', client.penguin.id, awards.join('|'));
});

// stampbook cover information
handler.xt('st#gsbcd', (client, id) => {
  client.sendXt('gsbcd', client.getStampbookCoverString());
});

// getting all the player stamps
handler.xt('st#gps', (client, id) => {
  client.sendStamps();
});

// getting recent player stamps
handler.xt('st#gmres', (client) => {
  client.sendXt('gmres', client.getRecentStampsString());
});

// save stamp book cover data
handler.xt('st#ssbcd', (client, color, highlight, pattern, icon) => {
  client.penguin.stampbook.color = Number(color);
  client.penguin.stampbook.highlight = Number(highlight);
  client.penguin.stampbook.icon = Number(icon);
  client.penguin.stampbook.pattern = Number(pattern);
  client.update();
});

// earn client side stamp
handler.xt('st#sse', (client, stamp) => {
  // for this endpoint notifying is unecessary since it's the one
  // that the client sends
  client.giveStamp(Number(stamp), { notify: false });
  client.update();
});

export default handler;