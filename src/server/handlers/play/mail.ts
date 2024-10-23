import { XtHandler } from "..";

const handler = new XtHandler();

// mail system
handler.xt('l#mst', (client) => {
  const unreadTotal = client.penguin.mail.filter((mail) => !mail.postcard.read).length;
  client.sendXt('mst', unreadTotal, client.penguin.mail.length);
});

handler.xt('l#mg', (client) => {
  const postcards = client.penguin.mail.map((mail) => {
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
  client.setMailRead();
})

export default handler;