import { Mail } from "@server/database/database";
import { WorldPenguin } from "../world/world-penguin";
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
  ].join('|')).reverse();
  msg.send(penguin, 'mg', ...postcards);
}

export const handleSendCard: PenguinHandler<[number, number, number]> = (ctx, recipientId, cardId, cost) => {
  const { msg, prst, penguin, world } = ctx;
  const postcardCost = 10;
  const recipient = world.getById(recipientId);
  if (recipient !== undefined) {
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

export const handleReceiveMail: PenguinHandler<[Mail]> = ({ msg, penguin, data }, mail) => {
  msg.send(penguin, 'mr', 
    mail.sender.name,
    mail.sender.id,
    mail.postcard.postcardId,
    mail.postcard.details,
    ...data.isNewShell2009() ? [mail.postcard.timestamp] : [], // timestamp wasn't given before this shell
    mail.postcard.uid
  );
}

export const handleSendMail: PenguinHandler<[number, number]> = async (ctx, receiverId, postcardId) => {
  const { msg, penguin, world, off, prst } = ctx;
  const postcardCost = 10;
  const inboxFull = 0;
  const successful = 1;
  const notEnoughCoins = 2;

  if (penguin.currency.coins < postcardCost) {
    msg.send(penguin, 'ms', penguin.currency.coins, notEnoughCoins);
  } else {
    // TODO -> offline mail
    const receiver = world.getById(receiverId) ?? await off.getPenguin(receiverId);
    if (receiver === undefined) {
      return;
    }
    if (receiver.mail.total >= 50) {
      msg.send(penguin, 'ms', penguin.currency.coins, inboxFull);
    } else {
      const mail = receiver.mail.receivePostcard(postcardId, { senderId: penguin.id, senderName: penguin.name });
      if (receiver instanceof WorldPenguin) {
        handleReceiveMail({ ...ctx, penguin: receiver }, mail);
      }
      msg.send(penguin, 'ms', penguin.currency.discount(postcardCost), successful);
      prst(receiver);
    }
  }
}

export const handleDeleteMailFromPenguin: PenguinHandler<[number]> = ({ penguin, msg, prst }, penguinId) => {
  penguin.mail.deleteMail(m => m.sender.id === penguinId);
  msg.send(penguin, 'mdp', penguin.mail.total);
  prst(penguin);
}

export const handleDeletePostcard: PenguinHandler<[number]> = ({ penguin, prst }, postcardUid) => {
  penguin.mail.deleteMail(m => m.postcard.uid === postcardUid);
  prst(penguin);
}