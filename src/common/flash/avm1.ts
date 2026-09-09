import { iterateEntries, tryToNumber } from "../utils";
import { to2BytesLittleEndian, to4BytesLittleEndian } from "./bytes";

type JsonProp = string | number | boolean | JsonLikeObj | PCodeWrap;

interface JsonLikeObj {
  [x: string | number]: JsonProp[] | JsonProp;
};

type PCodeTag = '##PCODE##';
type PCodeWrap = [PCodeTag, PCodeRep];
type PCodeElement = PCodeElement[] | JsonProp;

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

const IS_PCODE: PCodeTag = '##PCODE##';

function isPCodeWrap(v: unknown[]): v is PCodeWrap {
  return v.length === 2 && v[0] === IS_PCODE;
}

/**
 * For use with `applyJsonToObject` or `defineLocalJson`. When you need to add PCode as a JSON value,
 * wrap the PCode in this, to tell the parser that it is in fact PCode and not a normal array.
 */
export function jsonPCode(v: PCodeRep): PCodeWrap {
  return [IS_PCODE, v]
}

function addElement(code: PCodeRep, element: PCodeElement): void {
  if (Array.isArray(element)) {
    if (isPCodeWrap(element)) {
      code.push(...element[1]);
      return;
    }
    addArray(code, element);
  } else if (typeof element === 'object') {
    addObject(code, element);
  } else {
    code.push([Action.Push, element]);
  }
}

function addArray(code: PCodeRep, array: PCodeElement[]): void {
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

export function createJsonDeclaration(obj: PCodeElement): PCodeRep {
  const code: PCodeRep = [];

  addElement(code, obj);

  return code;
}

/** Same as `defineLocal`, but `obj` is put through `createJsonDeclaration`.
 * To use PCode as a value in the obj, wrap it in `jsonPCode()`. */
export function defineLocalJson(name: string, obj: PCodeElement): PCodeRep {
  return defineLocal(name, createJsonDeclaration(obj));
}

/**
 * Will apply the given JSON record to the variable of 'name'.
 * For example, if `{ foo: "bar", hello: "world" }` is given for 'obj', then the resulting ActionScript will be:
 * ```
 * name.foo = "bar";
 * name.hello = "world";
 * ```
 * 
 * To use PCode as a value, wrap it in `jsonPCode()`. For example, if `{ foo: jsonPCode(getMemberChain("shell", "test")) }` is given, then:
 * ```
 * name.foo = shell.test;
 * ```
 */
export function applyJsonToObject(name: string, obj: JsonLikeObj): PCodeRep {
  const code: PCodeRep = [];

  iterateEntries(obj, (key, value) => {
    code.push(
      [Action.Push, name],
      Action.GetVariable,
      [Action.Push, tryToNumber(key)],
      ...createJsonDeclaration(value),
      Action.SetMember
    )
  });

  return code;
}

export type PCodeRep = Array<[Action, ...Array<string | number | boolean>] | Action>;

/** Equiv to `var name = new Object();`, or whatever `cls` is instead of "Object". */
export const createEmptyObjectVar = (name: string, cls: string = "Object"): PCodeRep => {
  return [
    [Action.Push, name],
    [Action.Push, 0],
    [Action.Push, cls],
    Action.NewObject,
    Action.DefineLocal
  ];
}

/** Add var of a name to the AVM1 stack */
export const addVarToStack = (name: string): PCodeRep => {
  return [
    [Action.Push, name],
    Action.GetVariable
  ];
}

/**
 * Similar to `addVarToStack`, but gets a whole chain of variables/members.
 * e.g. `getMemberChain("foo", "bar")` returns `foo.bar` in ActionScript
 */
export const getMemberChain = (...names: Array<string | number>): PCodeRep => {
  const code: PCodeRep = [];

  names.forEach((name, i) => {
    code.push(
      [Action.Push, name],
      i > 0 ? Action.GetMember : Action.GetVariable
    )
  });

  return code;
}

/**
 * Equiv to a member assingment `name.member = something` or `name[1] = something`
 * @param v - PCode that pushes a vairable to stack
 * @param member - Name of member that will be set (eg a property of object or index of array)
 * @param value - PCode that pushes the value to the stack, which will be assigned to member
 */
export const setMember = (v: PCodeRep, member: number | string, value: PCodeRep): PCodeRep => {
  return [
    ...v,
    [Action.Push, member],
    ...value,
    Action.SetMember
  ];
}

/** Equivalent of `var name = ...` */
export function defineLocal(name: string, v: PCodeRep): PCodeRep {
  return [
    [Action.Push, name],
    ...v,
    Action.DefineLocal
  ];
}

/**
 * Call a method or function.
 * @param v - PCode representation of what value to call the method on. Make this null to invoke `CallFunction` instead of `CallMethod`.
 * @param name - The name of the method
 * @param pop - Whether to append `Action.Pop` at the end of the returned PCode.
 * Make this true when calling a method on its own, and false when used with `DefineLocal`.
 * @param args - The args to give to the method
 * @returns The PCode
 */
export const callMethod = (v: PCodeRep | null, name: string, pop: boolean = true, ...args: Array<PCodeRep>): PCodeRep => {
  const code: PCodeRep = [
    ...[...args].reverse().flat() as PCodeRep,
    [Action.Push, args.length]
  ];

  if (v === null) {
    code.push(
      [Action.Push, name],
      Action.CallFunction
    )
  } else {
    if (v.length === 0) {
      throw new Error("PCode length is 0! You probably want to set it to null instead.")
    }
    code.push(
      ...v,
      [Action.Push, name],
      Action.CallMethod
    )
  }

  if (pop) code.push(Action.Pop);

  return code;
}

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
          throw new Error(`Unimplemented bytecode with arguments: ${action}`);
      }
    }
  })

  return new Uint8Array(numbers);
}