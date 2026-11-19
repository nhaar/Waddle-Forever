import { iterateEntries, tryToNumber } from "../utils";
import { to2BytesLittleEndian, to4BytesLittleEndian } from "./bytes";

type JsonProp = string | number | boolean | JsonLikeObj | PCodeWrap;

interface JsonLikeObj {
  [x: string | number]: PCodeElement;
};

export type PCodeRep = Array<[Action, ...Array<string | number | boolean>] | Action>;
type PCodeTag = '##PCODE##';
type PCodeWrap = [PCodeTag, PCodeRep];
/** A legal unit of a value in a JSON Object inside ActionScript represented as PCode or a primitive type */
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
 * Wrap PCode to differentiate PCodeRep from normal arrays in objects
 */
export function wrapPCode(v: PCodeRep): PCodeWrap {
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

/** Creates a PCode representation of a primitive value (string, number, boolean) or an array/object. */
export function createJsonDeclaration(obj: PCodeElement): PCodeRep {
  const code: PCodeRep = [];

  addElement(code, obj);

  return code;
}

/**
 * Will apply the given JSON record to the variable of 'name'.
 * For example, if `{ foo: "bar", hello: "world" }` is given for 'obj', then the resulting ActionScript will be:
 * ```
 * name.foo = "bar";
 * name.hello = "world";
 * ```
 * 
 * To use PCode as a value, wrap it in `wrapPCode()`. For example, if `{ foo: wrapPCode(getMemberChain("shell", "test")) }` is given, then:
 * ```
 * name.foo = shell.test;
 * ```
 */
export function applyJsonToObject(name: string, obj: JsonLikeObj): PCodeRep {
  const code: PCodeRep = [];

  const v = getVar(name);
  iterateEntries(obj, (key, value) => {
    code.push(...setMember(v, tryToNumber(key), createJsonDeclaration(value)));
  });

  return code;
}

/**
 * Equivalent to `new cls();`
 * @param cls - Name of the class. Default is `Object`
 * @param args - Args to give the constructor
 */
export const newObject = (cls: string = "Object", ...args: PCodeRep[]): PCodeRep => {
  return [
    ...[...args].reverse().flat() as PCodeRep,
    [Action.Push, args.length, cls],
    Action.NewObject
  ];
}

/** Pushes `name` to the stack, then gets it as a variable with `GetVariable`. */
export const getVar = (name: string): PCodeRep => {
  return [
    [Action.Push, name],
    Action.GetVariable
  ];
}

/** Add multiple values together with `+` */
export const add2 = (...values: PCodeRep[]): PCodeRep => {
  return values.map((v, i) => i > 0 ? [...v, Action.Add2] : [...v]).flat();
}

/**
 * Similar to `getVar`, but gets a whole chain of variables/members.
 * e.g. `getMemberChain("foo", "bar")` is `foo.bar` in ActionScript
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
 * Equivalent to a member assignment `name.member = something` or `name[1] = something`
 * @param v - The PCode for the variable on which the member will be set
 * @param member - Name of member that will be set (e.g. a property of object or index of array)
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

/** Equivalent to `var name = ...` */
export function defineLocal(name: string, v: PCodeRep): PCodeRep {
  return [
    [Action.Push, name],
    ...v,
    Action.DefineLocal
  ];
}

/** Same as `defineLocal`, but `obj` is put through `createJsonDeclaration`. To use PCode as a value in the obj, use wrapPCode */
export function defineLocalJson(name: string, obj: PCodeElement): PCodeRep {
  return defineLocal(name, createJsonDeclaration(obj));
}

/**
 * Call a method or function.
 * @param v - PCode representation of what value to call the method on.
 * Make this null to invoke `CallFunction` instead of `CallMethod` (calling a local function instead of an object method).
 * @param name - The name of the method
 * @param pop - Whether to append `Action.Pop` at the end of the returned PCode.
 * Make this true when calling a method on its own, and false when used with `DefineLocal`.
 * @param args - The args to give to the method
 */
export const callMethod = (v: PCodeRep | null, name: string, pop: boolean = true, ...args: PCodeRep[]): PCodeRep => {
  const code: PCodeRep = [
    ...[...args].reverse().flat(),
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

/**
 * Combines any consecutive `Push` actions in PCode to be in one line.
 * e.g. `[Action.Push, "a"], [Action.Push, "b"]` becomes `[Action.Push, "a", "b"]`.
 * This helps reduce the file size of the output SWF.
 */
function combinePushActions(code: PCodeRep): PCodeRep {
  const combined: PCodeRep = [];

  code.forEach(line => {
    const previous = combined[combined.length - 1];
    if (
      typeof line !== 'number' && line[0] === Action.Push &&
      typeof previous !== 'number' && previous?.[0] === Action.Push
    ) {
      combined[combined.length - 1] = [Action.Push, ...previous.slice(1), ...line.slice(1)];
    } else {
      combined.push(line);
    }
  });

  return combined;
}

export function createBytecode(code: PCodeRep): Uint8Array {
  const numbers: number[] = [];

  combinePushActions(code).forEach(line => {
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