import { XtHandler } from '..';
import { Room } from '../../game/rooms';

const handler = new XtHandler();

handler.xt('j#js', (client) => {
  // penguins don't keep the puffle from previous session
  client.unequipPuffle();
  /*
  TODO: find what second number is
  Figure out how moderators will be handled
  Figure out what moderator_status is used for
  Add last number (something to do with stamp book)
  */
  const moderatorStatus = client.penguin.mascot > 0 ? 3 : 0;
  // initializing penguin data
  client.sendXt('js', client.penguin.is_agent ? 1 : 0, 0, moderatorStatus, 0);

  client.sendPenguinInfo();

  // joining spawn room // TODO more spawn rooms in the future?
  client.joinRoom(Room.Town);

  // receiving inventory
  // TODO proper inventory
  client.sendStamps();

  client.sendPuffles();

  client.checkAgeStamps();
});

handler.xt('b#gb', (client) => {
  client.sendXt('gb', '');
});

handler.xt('n#gn', (client) => {
  client.sendXt('gn', '');
});

handler.xt('u#glr', (client) => {
  client.sendXt('glr', '');
});


handler.xt('u#h', (client) => {
  client.sendXt('h', '');
});

export default handler;
