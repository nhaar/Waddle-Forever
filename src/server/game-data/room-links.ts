import { RoomName, ROOMS } from './rooms';

export const ROOM_ID_TO_NAME: Record<number, RoomName> = (() => {
  const map = {} as Record<number, RoomName>;
  (Object.keys(ROOMS) as RoomName[]).forEach(name => {
    map[ROOMS[name].id] = name;
  });
  return map;
})();

export const ROOM_LINKS: Partial<Record<RoomName, RoomName[]>> = {
  town: ['forts'],
  forts: ['town', 'plaza'],
  plaza: ['forts', 'forest'],
  forest: ['plaza']
};

export const MAX_BOTS_PER_ROOM = 5;