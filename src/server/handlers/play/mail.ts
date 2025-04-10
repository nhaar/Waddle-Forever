import { Handler } from "..";

const handler = new Handler();

// mail system
handler.xt('l#mst', (client) => {
  client.sendXt('mst', client.penguin.getUnreadMailTotal(), client.penguin.getMailTotal());
});

handler.xt('l#mg', (client) => {
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
handler.xt('l#mc', (client) => {
  client.penguin.setAllMailAsRead();
})

export default handler;