import { ITEMS, ItemType } from "../../game-logic/items";
import { Handler } from "..";
import { Handle } from "../handles";

const handler = new Handler();

// getting pin information opening stampbook
handler.xt(Handle.GetPinInformation, (client, id) => {
  client.sendXt('qpp', client.getPinString());
});

// getting mission stamps
handler.xt(Handle.GetMissionStamps, (client) => {
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
handler.xt(Handle.GetStampbookCoverData, (client, id) => {
  client.sendXt('gsbcd', client.getStampbookCoverString());
});

// getting all the player stamps
handler.xt(Handle.GetPlayerStamps, (client, id) => {
  client.sendStamps();
});

// getting recent player stamps
handler.xt(Handle.GetRecentStamps, (client) => {
  client.sendXt('gmres', client.getRecentStampsString());
});

// save stamp book cover data
handler.xt(Handle.SetStampbookCoverData, (client, color, highlight, pattern, icon) => {
  client.penguin.stampbook.color = color;
  client.penguin.stampbook.highlight = highlight;
  client.penguin.stampbook.icon = icon;
  client.penguin.stampbook.pattern = pattern;
  client.update();
});

// earn client side stamp
handler.xt(Handle.SetStampEarned, (client, stamp) => {
  // for this endpoint notifying is unecessary since it's the one
  // that the client sends
  client.giveStamp(stamp, { notify: false });
  client.update();
});

export default handler;