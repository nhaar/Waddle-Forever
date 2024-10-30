import { items } from "../../game/item";
import { XtHandler } from "..";
import { ItemType } from "../../game/items";

const handler = new XtHandler();

// getting pin information opening stampbook
handler.xt('i#qpp', (client, id) => {
  client.sendXt('qpp', client.getPinString());
});

// getting mission stamps
handler.xt('i#qpa', (client) => {
  const awards = [];
  for (const item in client.penguin.inventory) {
    const itemInfo = items[item]
    if (itemInfo !== undefined && items[item].type === ItemType.Award) {
      awards.push(item);
    }
  }
  client.sendXt('qpa', client.id, awards.join('|'));
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

// earn stamp
handler.xt('st#sse', (client, stamp) => {
  client.addStamp(Number(stamp));
});

export default handler;