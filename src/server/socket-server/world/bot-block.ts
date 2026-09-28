import { VANILLA_ICEBERG } from "./blocks";

const ROOM_WIDTH = 760;
const ROOM_HEIGHT = 480;

class BlockError extends Error {
  constructor(msg: string) {
    super(`Block Error: ${msg}`);
  }
}

class Block {
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

export const BERG_BLOCK = Block.parseRawBlock(VANILLA_ICEBERG);