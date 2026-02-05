import { to2BytesLittleEndian, to4BytesLittleEndian } from "./bytes";
import { SwfContent, SwfHeader } from "./parser";

function createHeader(header: SwfHeader, headerlessFileSize: number): Uint8Array {
  const headerBytes = 12 + header.rect.length;
  return new Uint8Array([
    0x46, // F
    0x57, // W
    0x53, // S
    header.version,
    ...to4BytesLittleEndian(headerlessFileSize + headerBytes),
    
    ...header.rect,

    0x00, // ignored byte
    header.framerate, // FPS

    ...to2BytesLittleEndian(header.frameCount)
  ]);
}

enum TagType {
  FileAttributes = 69,
  SetBackgroundColor = 9,
  DoAction = 12,
  ShowFrame = 1,
  End = 0
}

export function emitCrumbSwf(code: Uint8Array): Uint8Array {
  return emitSwf({
    header: {
      version: 9,
      framerate: 24,
      frameCount: 1,
      // hardcoded rect
      rect: new Uint8Array([
        0x78,
        0x00,
        0x07,
        0x6C,
        0x00,
        0x00,
        0x12,
        0xC0,
        0x00
      ])
    },
    tags: [
      {
        type: TagType.FileAttributes,
        content: new Uint8Array([0, 0 ,0 ,0])
      },
      {
        type: TagType.SetBackgroundColor,
        content: new Uint8Array([0xFF, 0xFF, 0xFF])
      },
      {
        type: TagType.DoAction,
        content: code
      },
      {
        type: TagType.ShowFrame,
        content: new Uint8Array([])
      },
      {
        type: TagType.End,
        content: new Uint8Array([])
      }
    ]
  });
}

export function emitSwf(content: SwfContent): Uint8Array {
  const bytes: number[] = [];

  const headerless = content.tags.flatMap(tag => {
    const bytes: number[] = [];
    const length = tag.content.length
    bytes.push(((tag.type & 0x03) << 6) | (length < 0x3F ? length : 0x3F));
    bytes.push(tag.type >> 2);
    if (length >= 0x3F) { 
      bytes.push(...to4BytesLittleEndian(length))
    }
    tag.content.forEach(byte => bytes.push(byte));
    return bytes;
  });


  createHeader(content.header, headerless.length).forEach(byte => bytes.push(byte));
  headerless.forEach(value => {
    bytes.push(value);
  });

  return new Uint8Array(bytes);
}