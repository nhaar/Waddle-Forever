export function to2BytesLittleEndian(num: number): [number, number] {
  return [num & 0xff, (num >> 8) & 0xff];
}

export function to4BytesLittleEndian(num: number): [number, number, number, number] {
  return [
    num & 0xff,
    (num >> 8) & 0xff,
    (num >> 16) & 0xff,
    (num >> 24) & 0xff,
  ];
}