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

export function parseSwf(data: Uint8Array): SwfContent {
  const dataArray = [...data];
  dataArray.splice(0, 3);
  const version = dataArray.splice(0, 5)[0];

  const sizeFirstByte = dataArray.splice(0, 1)[0];
  const rectNumberSize = sizeFirstByte >> 3;
  const rectByteSize = Math.ceil((rectNumberSize * 4 + 5) / 8);
  const rectOtherBytes = dataArray.splice(0, rectByteSize - 1);

  // unused byte
  dataArray.splice(0, 1);
  const frameRate = dataArray.splice(0, 1)[0];
  const frameCount = fromLE(...dataArray.splice(0, 2));

  const header: SwfHeader = {
    rect: new Uint8Array([sizeFirstByte, ...rectOtherBytes]),
    frameCount,
    version,
    framerate: frameRate
  }

  const tags: SwfTag[] = [];

  while (dataArray.length > 0) {
    const tagBytes = dataArray.splice(0, 2);
    const tagType = (tagBytes[1] << 2) + (tagBytes[0] >> 6);
    let tagLength = tagBytes[0] & 0x3F;
    if (tagLength === 0x3F) {
      tagLength = fromLE(...dataArray.splice(0, 4));
    }
    const tagContent = dataArray.splice(0, tagLength);
    tags.push({
      type: tagType,
      content: new Uint8Array(tagContent)
    });
  }

  return {
    header,
    tags
  }
}

