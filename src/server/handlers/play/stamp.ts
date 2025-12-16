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
handler.xt(Handle.SetStampbookCoverData, (client, color, highlight, pattern, icon, ...stamps) => {
  client.penguin.stampbook.color = Number(color);
  client.penguin.stampbook.highlight = Number(highlight);
  client.penguin.stampbook.icon = Number(icon);
  client.penguin.stampbook.pattern = Number(pattern);
  client.penguin.stampbook.stamps = stamps.map(stampString => {
    const [_, id, x, y, rotation, depth] = stampString.split('|').map(n => Number(n));
    return {
      stamp: id,
      x,
      y,
      rotation,
      depth
    }
  })
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