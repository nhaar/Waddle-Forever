import { WorldContext } from "@server/socket-server/world/world";
import { XtHandler } from "../xt";
import { JoinHandler } from "./join";

const handler = new XtHandler<WorldContext, ['penguin', 'world', 'data', 'msg', 'prst', 'db']>(['penguin', 'world', 'data', 'msg', 'prst', 'db']);

const handleSendCard: JoinHandler<[number, number, number]> = (ctx, recipientId, cardId, cost) => {
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

const handleSetMailCheck: JoinHandler<[]> = ({ prst, penguin }) => {
  penguin.mail.setRead();
  prst(penguin);
}

export const sendMail: JoinHandler<[number, { senderId?: number; senderName?: string; details?: string; }]> = ({ prst, msg, penguin }, postcard, info) => {
  const mail = penguin.mail.receivePostcard(postcard, info);
  msg.send(penguin, 'mr', mail.sender.name, mail.sender.id, postcard, mail.postcard.details, mail.postcard.timestamp, mail.postcard.uid);
  prst(penguin);
}

handler.xt('s', 'sc', ['number', 'number', 'number'], handleSendCard);
handler.xt('s', 'l#mc', [], handleSetMailCheck);

export {
  handler as mailHandler
};