import { iterateEntries } from "../utils";
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
  Pop = 0x17,
  CallFunction = 0x3D,
  ConstantPool = 0x88
}

function addElement(code: PCodeRep, element: any): void {
  if (Array.isArray(element)) {
    addArray(code, element);
  } else if (typeof element === 'object') {
    addObject(code, element);
  } else {
    if (!['string', 'number', 'boolean'].includes(typeof element)) {
      throw new Error('Invalid type for element');
    }
    code.push([Action.Push, element]);
  }
}

function addArray(code: PCodeRep, array: any[]): void {
  [...array].reverse().forEach(element => {
    addElement(code, element);
  });
  code.push(
    [Action.Push, array.length],
    Action.InitArray
  );
}

function addObject<T extends {}>(code: PCodeRep, obj: T): void {
  iterateEntries(obj, (key, value) => {
    code.push([Action.Push, key]);
    addElement(code, value);
  });
  code.push(
    [Action.Push, Object.keys(obj).length],
    Action.InitObject
  );
}

export function createJsonDeclaration(obj: any): PCodeRep {
  const code: PCodeRep = [];

  if (Array.isArray(obj)) {
    addArray(code, obj);
  } else {
    addObject(code, obj);
  }

  return code;
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
              bytes += (new TextEncoder().encode(arg)).length + 1;
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