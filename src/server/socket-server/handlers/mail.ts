import { PenguinHandler } from "./handlers";

export const handleMailTotal: PenguinHandler<[]> = ({ penguin, msg }) => {
  msg.send(penguin, 'mst', penguin.mail.unread, penguin.mail.total);
}

export const handleGetMail: PenguinHandler<[]> = ({ penguin, msg }) => {
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

export const handleSendCard: PenguinHandler<[number, number, number]> = (ctx, recipientId, cardId, cost) => {
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

export const handleSetMailCheck: PenguinHandler<[]> = (ctx) => {
  const { prst, penguin } = ctx;

  penguin.mail.setRead();
  prst(penguin);
}

export const handleReceiveMail: PenguinHandler<[number, { senderId?: number; senderName?: string; details?: string; }]> = ({ prst, msg, penguin, data }, postcard, info) => {
  const mail = penguin.mail.receivePostcard(postcard, info);

  msg.send(
    penguin, 'mr',
    mail.sender.name,
    mail.sender.id,
    postcard,
    mail.postcard.details,
    ...data.isNewShell2009() ? [mail.postcard.timestamp] : [], // timestamp wasn't given before this shell
    mail.postcard.uid);
  prst(penguin);
}

export const handleSendMail: PenguinHandler<[number, number]> = (ctx, receiverId, postcardId) => {
  const { msg, penguin, world } = ctx;
  const postcardCost = 10;
  const inboxFull = 0;
  const successful = 1;
  const notEnoughCoins = 2;

  if (penguin.currency.coins < postcardCost) {
    msg.send(penguin, 'ms', penguin.currency.coins, notEnoughCoins);
  } else {
    // TODO -> offline mail
    const receiver = world.getById(receiverId);
    if (receiver !== undefined) {
      if (receiver.mail.total >= 50) {
        msg.send(penguin, 'ms', penguin.currency.coins, inboxFull);
      } else {
        handleReceiveMail({ ...ctx, penguin: receiver }, postcardId, { senderId: penguin.id, senderName: penguin.name });
        msg.send(penguin, 'ms', penguin.currency.discount(postcardCost), successful);
      }
    }
  }
}