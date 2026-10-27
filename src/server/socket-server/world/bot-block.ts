import { RoomName } from "@server/game-data/rooms";
import { VANILLA_ICEBERG, VANILLA_TOWN } from "./blocks";
import { choose } from "@common/utils";

const ROOM_WIDTH = 760;
const ROOM_HEIGHT = 480;

class BlockError extends Error {
  constructor(msg: string) {
    super(`Block Error: ${msg}`);
  }
}

export class Block {
  private flatMatrix: boolean[];
  private valid: number[];
  private rows: number;
  private cols: number;
  private constructor(
    public readonly scale: number,
    values: boolean[][]
  ) {
    this.flatMatrix = values.flat();
    this.rows = values.length;
    this.cols = values[0].length;

    this.valid = [];
    this.flatMatrix.forEach((v, i) => {
      if (v) {
        this.valid.push(i);
      }
    })
  }

  public getCoords(i: number) {
    return [i % this.rows, Math.floor(i / this.cols)];
  }

  public getRandom() {
    const random = choose(this.valid);
    return [random % this.rows, Math.floor(random / this.cols)];
  }

  public at(x: number, y: number) {
    const index = y * this.rows + x;
    return this.flatMatrix[index];
  }

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
  public get dimension() {
    return [this.rows, this.cols];
  }
}

class GridSet<T> {
  private map = new Map<T, Set<T>>();

  public add(x: T, y: T) {
    let set = this.map.get(x);
    if (set === undefined) {
      set = new Set();
      this.map.set(x, set);
    }
    set.add(y);
  }

  public has(x: T, y: T) {
    return this.map.get(x)?.has(y) === true;
  }
}

function getInvalidPositions(block: Block, positions: Array<[number, number]>) {
  const invalid = new GridSet<number>();
  const spacing = 20;
  positions.forEach(([x, y]) => {
    const i0 = Math.floor(x / block.scale);
    const j0 = Math.floor(y / block.scale);
    
    // iterate on the square centered around the spacing
    for (let i = Math.round(i0 - spacing / block.scale - 1); i < Math.round(i0 + spacing / block.scale); i++) {
      for (let j = Math.round(j0 - spacing / block.scale - 1); j < Math.round(j0 + spacing / block.scale); j++) {
        invalid.add(i, j);
      }
    }
  });
  return invalid;
}

export function findLeftmostMiddlemostPosition(block: Block, positions: Array<[number, number]>): [number, number] { 
  const xToYs = getInvalidPositions(block, positions);
  const [width, height] = block.dimension;
  // assuming even
  const half = height / 2;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < half; j++) {
      for (const k of [-1, 1]) {
        const j0 = half + j * k;
        if (block.at(i, j0) && !xToYs.has(i, j0)) {
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
        const [w, h] = block.dimension;
        const isInBound = x1 >= 0 && y1 >=0 && x1 < w && y1 < h;
        if (isInBound) {
          const visitedNode = accessed.get(x1)?.has(y1);
          const canVisit = block.at(x1,y1)
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
    if (!block.at(possibleCorner[0], possibleCorner[1])) {
      compacted.push(cur);
    }
  }

  // add last step
  compacted.push(path[path.length - 1]);

  return compacted;
}

export function getRandomPositionFromBlock(block: Block): [number, number] {
  const random = block.getRandom();

  return [random[0] * block.scale, random[1] * block.scale];
}