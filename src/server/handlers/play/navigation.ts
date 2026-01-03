import { Handler } from '..';
import { SledRace } from '../games/sled';
import { CardJitsu } from '../games/card';
import { Handle } from '../handles';
import { CardJitsuFire } from '../games/fire';

const handler = new Handler();

// client requesting to join room

handler.xt(Handle.JoinRoom, (client, ...args) => {
  client.joinRoom(...args);
});

// client requesting to leave a minigame
handler.xt(Handle.LeaveGame, (client, score) => {
  // waddle games individually handle this
  if (client.isInWaddleGame() || client.isEngine1) {
    return;
  }

  const stampInfo = client.getEndgameStampsInformation();
  let coins = client.getCoinsFromScore(score);

  // stamps double coins
  if (stampInfo[1] > 0 && stampInfo[1] == stampInfo[2]) {
    coins *= 2;
  }

  client.penguin.addCoins(coins);
  
  client.sendXt('zo', String(client.penguin.coins), ...stampInfo);
  void client.update();
});

handler.xt(Handle.JoinIgloo, (client, fakeId) => {
  if (!client.isEngine2) {
    return;
  }
  // for some reason the ID given is the player + 1000
  // in WF igloo room IDs are playerID + 2000
  const iglooId = fakeId + 1000;
  client.joinRoom(iglooId);
})

// Joining player igloo
handler.xt(Handle.JoinIglooNew, (client, playerId, roomType) => {
  if (!client.isEngine3) {
    return;
  }
  if (roomType === 'igloo') {
    // in WF igloo room IDs are playeId + 2000
    const iglooId = playerId + 2000;
    client.sendXt('jp', iglooId, iglooId, roomType);
    client.joinRoom(iglooId);
  } else if (roomType === 'backyard') {
    const backyardId = 1000;
    client.sendXt('jp', backyardId, backyardId, roomType);
    client.joinRoom(backyardId);
  }
})

handler.xt(Handle.SendAction, (client, action) => {
  client.sendAction(action);
});

handler.xt(Handle.SendFrame, (client, frame) => {
  client.setFrame(frame);
})

handler.xt(Handle.SetPosition, (client, ...args) => {
  // walking stops your character from whichever animation
  client.setPosition(...args);
  client.sendRoomXt('sp', client.penguin.id, ...args);
})

handler.xt(Handle.Snowball, (client, ...args) => {
  client.throwSnowball(...args);
})

// sending emotes
handler.xt(Handle.SendEmote, (client, emote) => {
  client.sendEmote(emote);
});

handler.xt(Handle.SendJoke, (client, joke) => {
  client.sendJoke(joke);
});

handler.xt(Handle.SendSafeMessage, (client, id) => {
  client.sendSafeMessage(id);
});

handler.xt(Handle.SendLine, (client, line) => {
  client.sendRoomXt('sl', client.penguin.id, line);
});

// player inventory thing? Not sure why this exists
handler.xt(Handle.PBI, (client, id) => {
  client.sendXt('pbi', id);
})

// refreshing room (required for bits and bolts, maybe other places)
handler.xt(Handle.RoomRefresh, (client) => {
  // TODO multiplayer logic
  client.sendXt('grs', client.penguin.id, client.penguinString);
})

// sending coins, used by some places to get coin count (golden puffle)
handler.xt(Handle.GetTotalCoins, (client) => {
  client.sendXt('gtc', client.penguin.coins);
})

// get penguins in the waddles
handler.xt(Handle.GetWaddle, (client, ...waddles) => {
  const waddleRooms = client.room.getWaddleRooms();
  client.sendXt('gw', ...waddleRooms.map((w) => {
    return `${w.id}|${w.seats.map(p => {
      return p?.penguin.name ?? '';
    }).join(',')}`
  }));
});

// used to indicate opening book (eg. newspaper), which was apparently called a "toy"
// TODO persistence for new penguins joining
handler.xt(Handle.OpenBook, (client, id) => {
  client.sendRoomXt('at', client.penguin.id, id);
});

handler.xt(Handle.CloseBook, (client) => {
  client.sendRoomXt('rt', client.penguin.id);
});

handler.boot(s => {
  s.waddleConstructors = {
    'card': CardJitsu,
    'sled': SledRace,
    'fire': CardJitsuFire
  };
});

// join a waddle
handler.xt(Handle.JoinWaddle, (client, waddle) => {
  const room = client.room.getWaddleRoom(waddle);
  client.joinWaddleRoom(room);
});

handler.xt(Handle.JoinTemporaryWaddle, (client, room, waddle, unknown) => {
  if (client.isEngine1) {
    const roomId = waddle;
    if (client.isInWaddleGame() && client.waddleGame.name === 'sled') {
      if (roomId === client.waddleGame.roomId) {
        client.joinGameRoomOld(roomId, 'jx');
      }
    }
    return;
  }
  const waddleRoom = client.server.getRoom(room).waddles.get(waddle);
  if (waddleRoom === undefined) {
    throw new Error('Player is joining Waddle Room, but it doesn\'t exist');
  }
  client.joinWaddleRoom(waddleRoom);
});

// leave a waddle room
handler.xt(Handle.LeaveWaddle, (client) => {
  if (!client.hasWaddleRoom()) {
    return;
  }
  const waddleRoom = client.waddleRoom;
  const seatIndex = waddleRoom.seats.findIndex((seat) => seat?.penguin.id === client.penguin.id);
  client.leaveWaddleRoom();
  if (seatIndex !== -1) {
    client.sendRoomXt('uw', waddleRoom.id, seatIndex);
  }
});

handler.xt(Handle.PlayerTransformation, (client, id) => {
  client.setAvatar(id);
  client.sendRoomXt('spts', client.penguin.id, id);
});

handler.disconnect((client) => {
  client.disconnect();
})

export default handler;
