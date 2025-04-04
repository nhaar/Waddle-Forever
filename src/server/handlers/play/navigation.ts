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
  const stampInfo = client.getEndgameStampsInformation();
  let coins = client.getCoinsFromScore(Number(score));

  // stamps double coins
  if (stampInfo[1] > 0 && stampInfo[1] == stampInfo[2]) {
    coins *= 2;
  }

  client.penguin.coins += coins;
  void client.update();

  client.sendXt('zo', String(client.penguin.coins), ...stampInfo);
});

// Joining player igloo
handler.xt('j#jp', (client, fakeId) => {
  // TODO room ID is currently useless here
  client.joinRoom(Number(fakeId));
})

handler.xt('u#sf', (client, frame) => {
  // TODO multiplayer logic
  client.sendXt('sf', client.id, frame);
})

handler.xt('u#sp', (client, x, y) => {
  // TODO multiplayer logic
  client.sendXt('sp', client.id, x, y);
})

// refreshing room (required for bits and bolts, maybe other places)
handler.xt('j#grs', (client) => {
  // TODO multiplayer logic
  client.sendXt('grs', client.id, client.penguinString);
})

handler.disconnect((client) => {
  client.disconnect();
})

export default handler;
