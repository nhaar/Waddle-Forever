import { JoinHandler } from "./join";

export const handleMailTotal: JoinHandler<[]> = ({ penguin, msg }) => {
  msg.send(penguin, 'mst', penguin.mail.unread, penguin.mail.total);
}

export const handleGetMail: JoinHandler<[]> = ({ penguin, msg }) => {
  const postcards = penguin.mail.mail.map(m => [
    m.sender.name,
    m.sender.id,
    m.postcard.postcardId,
    m.postcard.details,
    m.postcard.timestamp,
    m.postcard.uid,
    m.postcard.read ? 1 : 0
  ].join('|'));
  msg.send(penguin, 'mg', ...postcards);
}

export const handleSendCard: JoinHandler<[number, number, number]> = (ctx, recipientId, cardId, cost) => {
  const { msg, prst, penguin, world } = ctx;
  const postcardCost = 10;
  const recipient = world.getById(recipientId);
  if (recipient !== undefined) {
    // TODO offline mail delivery (Post-CPIP only)
    recipient.mail.receivePostcard(cardId, { senderId: penguin.id, senderName: penguin.name });
    msg.send(recipient, 'sc', penguin.id, penguin.name, cardId);
    prst(recipient);
  }

  msg.send(penguin, 'gc', penguin.currency.discount(postcardCost));
  prst(penguin);
}

export const handleSetMailCheck: JoinHandler<[]> = ({ prst, penguin }) => {
  penguin.mail.setRead();
  prst(penguin);
}

export const sendMail: JoinHandler<[number, { senderId?: number; senderName?: string; details?: string; }]> = ({ prst, msg, penguin }, postcard, info) => {
  const mail = penguin.mail.receivePostcard(postcard, info);
  msg.send(penguin, 'mr', mail.sender.name, mail.sender.id, postcard, mail.postcard.details, mail.postcard.timestamp, mail.postcard.uid);
  prst(penguin);
}