import { Handler } from '.';
import { Room } from '../game-logic/rooms';

const handler = new Handler();

handler.boot((server) => {
  const rooms = [Room.Town, Room.Plaza];
  rooms.forEach((roomId) => {
    const room = server.getRoom(roomId);
    const group = room.botGroup;
    group.spawnNumberedGroup('Bot', 5, roomId);
    group.wearRandom();
    group.giveRandomPuffle();
    group.wander();
  });
});

export default handler;