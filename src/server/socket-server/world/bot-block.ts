import { RoomName } from "@server/game-data/rooms";
import { VANILLA_ICEBERG, VANILLA_TOWN } from "./blocks";

const ROOM_WIDTH = 760;
const ROOM_HEIGHT = 480;

class BlockError extends Error {
  constructor(msg: string) {
    super(`Block Error: ${msg}`);
  }
}

export class Block {
  private constructor(
    public readonly scale: number,
    public readonly values: boolean[][]
  ) {}

  static parseRawBlock(values: number[][]): Block {
    const height = values.length;
    const scale = ROOM_HEIGHT / height;
    if (!Number.isInteger(scale)) {
      throw new BlockError('Invalid scale, expected to be integer');
    }
    const width = ROOM_WIDTH / scale;
    if (!Number.isInteger(width)) {
      throw new BlockError('Invalid scale doesn\'t divide both dimensions');
    }
    values.forEach(row => {
      if (row.length !== width) {
        throw new BlockError('Block matrix doesn\'t have correct width');
      }
    });

    return new Block(scale, values.map(row => row.map(value => value === 1)));
  }
}

function getDimensions(block: Block): [number, number] {
  return [block.values[0].length, block.values.length];
}

export function findLeftmostMiddlemostPosition(block: Block, positions: Array<[number, number]>): [number, number] { 
  const xToYs = new Map<number, Set<number>>();
  const spacing = 20;
  positions.forEach(([x, y]) => {
    const i0 = Math.floor(x / block.scale);
    const j0 = Math.floor(y / block.scale);
    
    // iterate on the square centered around the spacing
    for (let i = Math.round(i0 - spacing / block.scale - 1); i < Math.round(i0 + spacing / block.scale); i++) {
      for (let j = Math.round(j0 - spacing / block.scale - 1); j < Math.round(j0 + spacing / block.scale); j++) {
        let ys = xToYs.get(i);
        if (ys === undefined) {
          ys = new Set<number>();
          xToYs.set(i, ys);
        }
        ys.add(j);
      }
    }
  });
  const [width, height] = getDimensions(block);
  // assuming even
  const half = height / 2;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < half; j++) {
      for (const k of [-1, 1]) {
        const j0 = half + j * k;
        if (block.values[j0][i] && !xToYs.get(i)?.has(j0)) {
          return [i * block.scale, j0 * block.scale];
        }
      }
    }
  }

  return [0, 0];
}

const BERG_BLOCK = Block.parseRawBlock(VANILLA_ICEBERG);
const TOWN_BLOCK = Block.parseRawBlock(VANILLA_TOWN);

export function getBlock(room: RoomName): Block {
  switch (room) {
    case 'berg':
      return BERG_BLOCK;
    default:
      return TOWN_BLOCK;
  }
}

/** Returns the path of points adjacent (including starting point and goal), empty if no path */
export function findPathBetweenBlockPoints([startX, startY]: [number, number], [goalX, goalY]: [number, number], block: Block) {
  // bfs search over the graph defined by the block
  
  const accessed = new Map<number, Set<number>>();
  const predecessor = new Map<number, Map<number, [number, number]>>();
  let paths: Array<[number, number]> = [[startX, startY]];
  let queue: Array<[number, number]> = [[startX, startY]];

  let found = false;
  while (!found) {
    if (paths.length === 0) {
      break;
    }
    for (const [x, y] of paths) {
      let ys = accessed.get(x);
      if (ys === undefined) {
        ys = new Set();
        accessed.set(x, ys);
      }
      ys.add(y);
      
      for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        const x1 = dx + x;
        const y1 = dy + y;
        const [w, h] = getDimensions(block);
        const isInBound = x1 >= 0 && y1 >=0 && x1 < w && y1 < h;
        if (isInBound) {
          const visitedNode = accessed.get(x1)?.has(y1);
          const canVisit = block.values[y1][x1]
          if (!visitedNode && canVisit) {
            queue.push([x1, y1]);
            let ys = predecessor.get(x1);
            if (ys === undefined) {
              ys = new Map();
              predecessor.set(x1, ys);
            }
            ys.set(y1, [x, y]);
            if (x1 === goalX && y1 === goalY) {
              found = true;
              break;
            }
          }
        }
  
      }
      if (found) {
        break;
      }
    }

    paths = queue;
    queue = [];
  }

  const path: Array<[number, number]> = [];
  let predecesso: [number, number] = [goalX, goalY];
  while (predecesso !== undefined) {
    path.push(predecesso);
    predecesso = predecessor.get(predecesso[0])?.get(predecesso[1]);
  }

  return path.reverse();
}

/** Takes a path between two points in a block and only keep the non redundant points that would be clicked when walking that path inside the game */
export function compactPath(path: Array<[number, number]>, block: Block): Array<[number, number]> {
  const compacted: Array<[number, number]> = [];

  // exclude first, include last, include the ones in between if they are points around corners

  for (let i = 1; i < path.length - 1; i++) {
    // add corners
    const prev = path[i - 1];
    const cur = path[i];
    const next = path[i + 1];
    
    const delta = [next[0] - cur[0], next[1] - cur[1]];

    // finding corner: apply delta from previous point
    const possibleCorner = [prev[0] + delta[0], prev[1] + delta[1]];
    if (!block.values[possibleCorner[1]][possibleCorner[0]]) {
      compacted.push(cur);
    }
  }

  // add last step
  compacted.push(path[path.length - 1]);

  return compacted;
}
