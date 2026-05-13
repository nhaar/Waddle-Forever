type MapPrimitive<T> =
  T extends 'number' ? number :
  T extends 'string' ? string :
  never;

/** Strings used to represent primitive types that can be used as an argument */
export type TypePrimitiveIndicator = 'number' | 'string';

/** Primitive types that can be used as an argument */
export type PrimitiveTypes = number | string;

/**
 * Indicates the valid arguments for a callback, which is either a tuple of elements indicating the valid types,
 * or a single type indicating it is an array of that type
 */
export type ArgumentsIndicator = TypePrimitiveIndicator | readonly TypePrimitiveIndicator[];

/** Map a type indicator to its actual argument type */
export type GetArgumentsType<T extends ArgumentsIndicator> = T extends readonly TypePrimitiveIndicator[] ? {
  [K in keyof T]: MapPrimitive<T[K]>;
} : T extends 'number' ? number[] : string[];

export const parseArgs = <Arguments extends ArgumentsIndicator>(args: Array<string>, types: Arguments): GetArgumentsType<Arguments> | null => {
  let validArgs: unknown[] = [];
  let valid = true;

  const checkString = (type: string | undefined) => {
    if (type === undefined) {
      valid = false;
    } else {
      validArgs.push(type);
    }
  }

  const checkNumber = (type: string | undefined) => {
    const num = Number(type);
    if (isNaN(num)) {
      valid = false;
    } else {
      validArgs.push(num);
    }
  }

  args.forEach((arg, i) => {
    if (types === 'string') {
      checkString(arg);
    } else if (types === 'number') {
      checkNumber(arg);
    } else {
      switch (types[i]) {
        case 'number':
          checkNumber(arg)
          break;
        case 'string':
          checkString(arg)
          break;
      }
    }
  });

  if (valid) {
    return validArgs as GetArgumentsType<Arguments>;
  } else {
    return null;
  }
}