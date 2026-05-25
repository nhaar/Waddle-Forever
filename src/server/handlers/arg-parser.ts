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
  if (types === 'string') {
    return args as GetArgumentsType<Arguments>;
  }
  if (types === 'number') {
    const numbers = args.map(arg => Number(arg));
    if (numbers.every(n => !Number.isNaN(n))) {
      return numbers as GetArgumentsType<Arguments>;
    } else {
      return null;
    }
  }
  if (args.length !== types.length) {
    return null;
  }

  const converted = args.map((arg, i) => types[i] === 'number' ? Number(arg) : arg);
  if (converted.every(arg => typeof arg === 'string' || !Number.isNaN(arg))) {
    return converted as GetArgumentsType<Arguments>;
  }

  return null;
}