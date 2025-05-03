/** Represent the basic data set used in Puffle Launch, which is generally an array of blocks of 16 bit integers and blocks of 16 booleans */
class DataSet {
  /** This byte is placed at the beginning of every new block */
  static MANIFEST = 0xC8;

  // Each manifest below is placed as the second byte at the start
  // of a block and signals if it is an integer or boolean
  // Also, it is incremented by 1 if the block is null
  // (0, or all falses)
  static INT_MANIFEST = 0x90;
  static BOOL_MANIFEST = 0xA0;

  /** Array where each number represents a byte, which represents the data set binary */
  private dataSet: number[] = [];

  /** Encode a number into the correct bytes */
  private encode(n: number): number[] {
    const encoder = new TextEncoder();
    const utf8Bytes = encoder.encode(String.fromCharCode(Math.round(n)));
    return [...utf8Bytes];
  }

  /** Add a 16 bit integer to the data set */
  protected addInteger = (n: number) => {
    if (n === 0 || isNaN(n)) {
      this.dataSet.push(DataSet.MANIFEST, DataSet.INT_MANIFEST + 1, 0x1);
    } else {
      this.dataSet.push(DataSet.MANIFEST, DataSet.INT_MANIFEST, ...this.encode(Math.round(n)));
    }
  }

  /** Add a block of 16 booleans to the data set */
  protected addBooleanBlock = (block: boolean[]) => {
    const allFalse = block.every((condition) => condition === false);
    if (allFalse) {
      this.dataSet.push(DataSet.MANIFEST, DataSet.BOOL_MANIFEST + 1, 0x1);
    } else {
      let total = 0;
      for (let i = 0; i < 16; i++) {
        if (block[i] === true) {
          total += Math.pow(2, i);
        }
      }
      this.dataSet.push(DataSet.MANIFEST, DataSet.BOOL_MANIFEST, ...this.encode(total));
    }
  }

  /** Get final data set as a buffer */
  public get(): Buffer {
    return Buffer.from(this.dataSet);
  }
}

/** Represents valid Puffle Launch Game Data */
export default class PuffleLaunchGameSet extends DataSet {
  /**
   * @param puffleOs Array must have 36 numbers which are how many Puffle O's are acquired in each level
   * @param times Array must have 36 numbers which is the time in seconds for each level
   * @param turboStatuses Array must have 36 booleans which is whether turbo mode was beaten in each level
   */
  constructor(puffleOs: number[], times: number[], turboStatuses: boolean[]) {
    super();
    for (let i = 0; i < 36; i++) {
      this.addInteger(puffleOs[i]);
    }

    for (let i = 0; i < 36; i++) {
      let time = times[i];
      if (time === undefined || time > 600) {
        time = 600; // 10 minutes is the maximum permitted time
      }
      this.addInteger(time);
    }

    let level = 0;
    while (level < 36) {
      let block = [];
      for (let i = 0; i < 16 && level < 36; i++) {
        block.push(turboStatuses[level] ?? false);
        level++;
      }
      this.addBooleanBlock(block);
    }
  }
}