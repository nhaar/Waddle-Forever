import { XtHandler } from '..';
import { Room } from '../../game/rooms';

const handler = new XtHandler();

handler.xt('j#js', (client) => {
  /*
  TODO: find what second number is
  Figure out how moderators will be handled
  Figure out what moderator_status is used for
  Add last number (something to do with stamp book)
  */
  const moderatorStatus = client.penguin.mascot > 0 ? 3 : 0;
  // initializing penguin data
  client.sendXt('js', client.penguin.is_agent ? 1 : 0, 0, moderatorStatus, 0);
  /*
  TODO safe chat (after coins) will ever be required?
  TODO after safechat, what is that variable
  TODO after age, what is it?
  TODO how to implement penguin time zone?
  TODO what is last?
  TODO -1: membership days remain is useful?
  TODO 7: how to handle offset
  TODO 1: how to handle opened played cards
  TODO 4: map category how to handle
  TODO 3: how to handle status field
  */
  client.sendXt('lp', client.penguinString, String(client.penguin.coins), 0, 1440, 1727536687000, client.age, 0, client.penguin.minutes_played, -1, 7, 1, 4, 3);

  // joining spawn room // TODO more spawn rooms in the future?
  client.joinRoom(Room.Town);

  // receiving inventory
  // TODO proper inventory
  client.sendStamps();
});

handler.xt('b#gb', (client) => {
  client.sendXt('gb', '');
});

handler.xt('n#gn', (client) => {
  client.sendXt('gn', '');
});

// mail system
handler.xt('l#mst', (client) => {
  client.sendXt('mst', 0, 3);
});

handler.xt('l#mg', (client) => {
  client.send('%xt%mg%-1%sys|0|112||1726639082|29|0%sys|0|177||1726474034|4|0%sys|0|125||1726466667|2|0%');
});

handler.xt('u#glr', (client) => {
  client.sendXt('glr', '');
});

handler.xt('f#epfga', (client) => {
  client.send('%xt%epfga%-1%0%');
});

handler.xt('i#qpa', (client) => {
  client.send('%xt%qpa%-1%103%821|8006|8010|8011%');
});

handler.xt('f#epfgf', (client) => {
  client.sendXt('epfgf', 0);
});

handler.xt('f#epfgr', (client) => {
  client.sendXt('epfgr', 0, 0);
});

handler.xt('u#h', (client) => {
  client.sendXt('h', '');
});

export default handler;
