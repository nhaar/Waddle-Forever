import { to2BytesLittleEndian, to4BytesLittleEndian } from "./bytes";

export enum Action {
  Push = 0x96,
  GetVariable = 0x1C,
  CallMethod = 0x52,
  DefineLocal = 0x3C,
  Add2 = 0x47,
  NewObject = 0x40,
  SetMember = 0x4F,
  InitObject = 0x43,
  GetMember = 0x4E,
  InitArray = 0x42,
  Pop = 0x17
}

export type PCodeRep = Array<[Action, ...Array<string | number | boolean>] | Action>;

export function createBytecode(code: PCodeRep): Uint8Array {
  const numbers: number[] = [];

  code.forEach(line => {
    if (typeof line === 'number') {
      numbers.push(line);
    } else {
      const action = line[0];
      const args = line.slice(1);
      switch (action) {
        case Action.Push:
          numbers.push(Action.Push);
          let bytes = 0;
          args.forEach(arg => {
            // type
            bytes += 1;
            if (typeof arg === 'number') {
              // this is a UI32
              bytes += 4;
            } else if (typeof arg === 'boolean') {
              bytes += 1;
            } else {
              // null terminated string
              bytes += arg.length + 1;
            }
          });
          numbers.push(...to2BytesLittleEndian(bytes));
          args.forEach(arg => {
            if (typeof arg === 'number') {
              numbers.push(0x07, ...to4BytesLittleEndian(arg));
            } else if (typeof arg === 'boolean') {
              numbers.push(0x05, arg ? 1 : 0);
            } else {
              const bytes = new TextEncoder().encode(arg);
              numbers.push(0x00, ...bytes, 0x00);
            }
          });
          break;
        default:
          throw new Error('Unimplemented bytecode with arguments');
      }
    }
  })

  return new Uint8Array(numbers);
}