import { iterateEntries } from "@common/utils";
import { RoomName } from "@server/game-data/rooms";

class WorldGraph {
  private edges = new Map<RoomName, Array<{
    name: RoomName;
    pos: [number, number];
    spawn: [number, number];
  }>>

  private getEdges(room: RoomName) {
    let edges = this.edges.get(room);
    if (edges === undefined) {
      edges = [];
      this.edges.set(room, edges);
    }
    return edges;
  }

  public addRoomTransition(leftRoom: RoomName, rightRoom: RoomName, leftTrigger: [number, number], rightTrigger: [number, number]) {
    const leftEdges = this.getEdges(leftRoom);
    const rightEdges = this.getEdges(rightRoom);

    leftEdges.push({ name: rightRoom, pos: leftTrigger, spawn: rightTrigger });
    rightEdges.push({ name: leftRoom, pos: rightTrigger, spawn: leftTrigger });
  }

  public removeRoomTransition(leftRoom: RoomName, rightRoom: RoomName) {
    const leftEdges = this.getEdges(leftRoom);
    const rightEdges = this.getEdges(rightRoom);
    this.edges.set(leftRoom, leftEdges.filter(({ name }) => {
        return name !== rightRoom
    }));
    this.edges.set(rightRoom, rightEdges.filter(({ name }) => {
        return name !== leftRoom
    }));
  }

  public getPath(leftRoom: RoomName, rightRoom: RoomName) {
    const accessed = new Set<RoomName>();
    const predecessor = new Map<RoomName, RoomName>();

    let rooms: RoomName[] = [leftRoom];
    let queue: RoomName[] = [];

    let found = false;
    while (true) {
      for (const room of rooms) {
        const adjs = this.edges.get(room) ?? [];
        for (const { name } of adjs) {
          if (!accessed.has(name)) {
            queue.push(name);
            predecessor.set(name, room);
            accessed.add(name);
          }
          if (name === rightRoom) {
            found = true;
            break;
          }
        }
        if (found) {
          break;
        }
      }
      if (found) {
        break;
      }
      if (queue.length === 0) {
        break;
      }

      rooms = queue;
      queue = [];
    }

    if (found) {
      const path: Array<{ target: RoomName, pos: [number, number], spawn: [number, number] }> = [];

      let cur = rightRoom;

      while (cur !== leftRoom) {
        const prev = predecessor.get(cur);
        if (prev === undefined) {
          return null;
        }
        const trans = (this.edges.get(prev) ?? []).find(({ name }) => name === cur);
        if (trans === undefined) {
          return null;
        }
        path.push({ target: cur, pos: trans.pos, spawn: trans.spawn });
        cur = prev;
      }

      return path.reverse();
    }
    return null;
  }
}

const ROOM_TRANSITIONS: Partial<Record<RoomName, Array<{
  room: RoomName, pos: [number, number], spawn: [number, number]
}>>> = {
  'town': [
    { room: 'dance', pos: [340, 200], spawn: [150, 280] },
    { room: 'coffee', pos: [275, 225], spawn: [350, 225] },
    { room: 'shop', pos: [500, 230], spawn: [518, 260] },
    { room: 'forts', pos: [705, 290], spawn: [180, 260] },
    { room: 'dock', pos: [100, 300], spawn: [600, 200] },
  ],
  'dance': [
    { room: 'town', pos: [110, 270], spawn: [340, 260] },
    { room: 'lounge', pos: [680, 355], spawn: [600, 380] },
    { room: 'boiler', pos: [480, 210], spawn: [560, 320] },
  ],
  'coffee': [
    { room: 'town', pos: [375, 196], spawn: [290, 260] },
    { room: 'book', pos: [640, 395], spawn: [600, 290] },
  ],
  'book': [
    { room: 'coffee', pos: [605, 229], spawn: [560, 400] },
  ],
  'lounge': [
    { room: 'dance', pos: [718, 327], spawn: [600, 396] },
  ],
  'shop': [
    { room: 'town', pos: [540, 233], spawn: [466, 280] },
  ]
}

export const WORLD_GRAPH = new WorldGraph();

iterateEntries(ROOM_TRANSITIONS, (left, transitions) => {
  transitions.forEach(({ room, pos, spawn }) => {
    WORLD_GRAPH.addRoomTransition(left, room, pos, spawn);
  });
});
