import { isAs2, isAs3 } from '../../../server/routes/versions';
import { Handler } from '..';

const handler = new Handler();

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

handler.xt('j#jp', (client, fakeId) => {
  if (!isAs2(client.version)) {
    return;
  }
  // for some reason the ID given is the player + 1000
  // in WF igloo room IDs are playerID + 2000
  const iglooId = Number(fakeId) + 1000;
  client.joinRoom(iglooId);
})

// Joining player igloo
handler.xt('j#jp', (client, playerId, roomType) => {
  if (!isAs3(client.version)) {
    return;
  }
  if (roomType === 'igloo') {
    // in WF igloo room IDs are playeId + 2000
    const iglooId = Number(playerId) + 2000;
    client.sendXt('jp', iglooId, iglooId, roomType);
    client.joinRoom(iglooId);
  } else if (roomType === 'backyard') {
    const backyardId = 1000;
    client.sendXt('jp', backyardId, backyardId, roomType);
    client.joinRoom(backyardId);
  }
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
