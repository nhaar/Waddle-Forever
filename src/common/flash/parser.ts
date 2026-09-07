import zlib from 'zlib';

/**
 * Warning for header: some information isn't obtained because it's hardcoded in emitter.ts
 * This is only meant for SWFs that we've had to use this on.
 */

export type SwfHeader = {
  rect: Uint8Array;
  frameCount: number;
  version: number;
  framerate: number;
}

type SwfTag = {
  type: number;
  content: Uint8Array;
}

export type SwfContent = {
  header: SwfHeader;
  tags: SwfTag[];
}

export function fromLE(...bytes: number[]) {
  let value = 0;
  bytes.forEach((byte, i) => {
    value += byte * 2 ** (8 * i);
  });
  return value;
}

export function decompress(data: Uint8Array): [string, Uint8Array] {
  const signature = String.fromCharCode(...data.slice(0, 3));

  if (signature === 'CWS') {
    return [signature, new Uint8Array([...data.slice(0, 8), ...zlib.inflateSync(data.slice(8))])];
  }
  return [signature, data];
}

export function compress(signature: string, data: Uint8Array): Uint8Array {
  if (signature === 'CWS') {
    return new Uint8Array([...data.slice(0, 8), ...zlib.deflateSync(data.slice(8))]);
  }
  return data;
}

export function getSwfRectSizeBytes(data: Uint8Array): number {
  const byte = data[8];
  const rectSize = byte >> 3;
  return Math.ceil((rectSize * 4 + 5) / 8);
}

export function getFrameRateOffset(rectSize: number): number {
  return 9 + rectSize;
}

export function parseSwf(data: Uint8Array): SwfContent {
  data = decompress(data)[1];
  const version = data[3];

  const rectByteSize = getSwfRectSizeBytes(data);

  const frameRate = data[getFrameRateOffset(rectByteSize)];
  const frameCount = fromLE(...data.slice(10 + rectByteSize, 12 + rectByteSize));

  const header: SwfHeader = {
    rect: data.slice(8, 8 + rectByteSize),
    frameCount,
    version,
    framerate: frameRate
  }

  const tags: SwfTag[] = [];

  let i = 12 + rectByteSize;
  while (i < data.length) {
    const tagBytes = data.slice(i, i + 2);
    const tagType = (tagBytes[1] << 2) + (tagBytes[0] >> 6);
    let tagLength = tagBytes[0] & 0x3F;
    let tagOffset = i + 2;
    if (tagLength === 0x3F) {
      tagLength = fromLE(...data.slice(i + 2, i + 6));
      tagOffset += 4;
    }
    const tagContent = data.slice(tagOffset, tagOffset + tagLength);
    tags.push({
      type: tagType,
      content: new Uint8Array(tagContent)
    });
    i = tagOffset + tagLength;
  }

  return {
    header,
    tags
  }
}

