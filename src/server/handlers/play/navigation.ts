import { isLiteralScoreGame } from '../../game/rooms';
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
  const coins = isLiteralScoreGame(client.currentRoom) ? (
    Number(score)
  ) : (
    Math.floor(Number(score) / 10)
  );
  client.penguin.coins += coins;
  void client.update();

  /* TODO stamps information */
  client.sendXt('zo', String(client.penguin.coins), ...client.getEndgameStampsInformation());
});

export default handler;
