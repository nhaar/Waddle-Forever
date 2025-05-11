import { Handler } from "..";
import { Handle } from "../handles";

const handler = new Handler();

// mail system
handler.xt(Handle.GetMail, (client) => {
  client.sendXt('mst', client.penguin.getUnreadMailTotal(), client.penguin.getMailTotal());
});

handler.xt(Handle.GetAllMail, (client) => {
  const postcards = client.penguin.getAllMail().map((mail) => {
    return [
      mail.sender.name,
      mail.sender.id,
      mail.postcard.postcardId,
      mail.postcard.details,
      mail.postcard.timestamp,
      mail.postcard.uid,
      mail.postcard.read ? 1 : 0
    ].join('|')
  })
  client.sendXt('mg', ...postcards);
});

// opened the postcards
handler.xt(Handle.SetMailCheck, (client) => {
  client.penguin.setAllMailAsRead();
  client.update();
})

export default handler;