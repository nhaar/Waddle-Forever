import { XtHandler } from '..';

const handler = new XtHandler();

// client requesting to join room
handler.xt('j#jr', (client, destinationRoom, x, y) => {
  client.x = Number(x);
  client.y = Number(y);
  client.joinRoom(Number(destinationRoom));
});

// client requesting to leave a minigame
handler.xt('z', 'zo', (client, score) => {
  client.penguin.coins += Math.floor(Number(score) / 10);
  void client.update();

  /* TODO stamps information */
  client.sendXt('zo', String(client.penguin.coins), 0, 0, 0, 0);
});

export default handler;
