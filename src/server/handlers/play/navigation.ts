import { Handler } from '..';

const handler = new Handler();

// client requesting to join room
handler.xt('j#jr', (client, destinationRoom, x, y) => {
  client.setPosition(Number(x), Number(y));
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

  client.penguin.addCoins(coins);
  
  client.sendXt('zo', String(client.penguin.coins), ...stampInfo);
  void client.update();
});

handler.xt('j#jp', (client, fakeId) => {
  if (!client.isEngine2) {
    return;
  }
  // for some reason the ID given is the player + 1000
  // in WF igloo room IDs are playerID + 2000
  const iglooId = Number(fakeId) + 1000;
  client.joinRoom(iglooId);
})

// Joining player igloo
handler.xt('j#jp', (client, playerId, roomType) => {
  if (!client.isEngine3) {
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
  client.setFrame(Number(frame));
  client.sendRoomXt('sf', client.penguin.id, frame);
})

handler.xt('u#sp', (client, x, y) => {
  // walking stops your character from whichever animation
  client.resetFrame();
  client.setPosition(Number(x), Number(y));
  client.sendRoomXt('sp', client.penguin.id, x, y);
})

handler.xt('u#sb', (client, x, y) => {
  client.sendRoomXt('sb', client.penguin.id, x, y);
})

// sending emotes
handler.xt('u#se', (client, emote) => {
  client.sendRoomXt('se', client.penguin.id, emote);
})

// player inventory thing? Not sure why this exists
handler.xt('u#pbi', (client, id) => {
  client.sendXt('pbi', id);
})

// refreshing room (required for bits and bolts, maybe other places)
handler.xt('j#grs', (client) => {
  // TODO multiplayer logic
  client.sendXt('grs', client.penguin.id, client.penguinString);
})

// sending coins, used by some places to get coin count (golden puffle)
handler.xt('r#gtc', (client) => {
  client.sendXt('gtc', client.penguin.coins);
})

handler.disconnect((client) => {
  client.disconnect();
  client.update();
})

export default handler;
