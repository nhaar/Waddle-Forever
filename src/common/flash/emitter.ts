import { to4BytesLittleEndian } from "./bytes";

function createHeader(headerlessFileSize: number): Uint8Array {
  const headerBytes = 21;
  return new Uint8Array([
    0x46, // F
    0x57, // W
    0x53, // S
    0x09, // Version 9
    ...to4BytesLittleEndian(headerlessFileSize + headerBytes),
    
    // hardcoded RECT
    0x78,
    0x00,
    0x07,
    0x6C,
    0x00,
    0x00,
    0x12,
    0xC0,
    0x00,

    0x00, // ignored byte
    0x18, // FPS

    0x01, // frame count
    0x00
  ]);
}

export function emitSwf(code: Uint8Array): Uint8Array {
  const bytes: number[] = [];

  const headerless: number[] = [
    0x44, // hardcoded file attributes
    0x11,
    0x00,
    0x00,
    0x00,
    0x00,

    0x43, // hardcoded background color tag
    0x02,
    0xFF,
    0xFF,
    0xFF,

    0x3F, // hardcoded doAction tag header with length greater than 63
    0x03,
    ...to4BytesLittleEndian(code.length),
    ...code,

    0x40, // heardcoded show frame tag
    0x00,

    0x00, // end tag
    0x00
  ];

  bytes.push(...createHeader(headerless.length));
  headerless.forEach(value => {
    bytes.push(value);
  });

  return new Uint8Array(bytes);
}