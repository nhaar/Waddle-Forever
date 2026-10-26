import { RoomName } from "@server/game-data/rooms";

export class WorldGraph {
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
