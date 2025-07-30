import { Handler } from '.';
import { RoomName, ROOMS } from '../game-data/rooms';

const handler = new Handler();

handler.boot((server) => {
  const rooms: RoomName[] = ['town', 'plaza', 'forts','forest'];
  rooms.forEach((roomName) => {
    const roomId = ROOMS[roomName].id;
    const room = server.getRoom(roomId);
    const group = room.botGroup;
    group.spawnNumberedGroup('Bot', 5, roomId);
    group.wearRandom();
    group.giveRandomPuffle();
    group.wander();
  });
});

export default handler;