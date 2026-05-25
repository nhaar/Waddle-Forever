import { WorldContext } from "./world";

import { CtxObj } from "@server/handlers";
import { handleJoinServer } from "@server/handlers/play/join";
import { XtCallbackInfo, XtHandler } from "./xt-handler";
import { ArgumentsIndicator, GetArgumentsType } from "@server/handlers/arg-parser";

type PreProcessCallbackInfo = [
  [Array<keyof WorldContext & string>,
  ((ctx: Partial<WorldContext>) => boolean) | undefined],
  ArgumentsIndicator,
  (ctx: Partial<WorldContext>, ...args: Array<string | number>) => void | Promise<void>
];

type IntermediateXtCallbackInfo = [string, string, ...PreProcessCallbackInfo];

class XtGenerator<CT extends Array<keyof WorldContext & string>> {
  constructor(private _types: CT) {}

  public xt<const T extends ArgumentsIndicator>(
    extension: string,
    code: string,
    signature: T,
    callback: (ctx: CtxObj<CT, WorldContext>, ...args: GetArgumentsType<T>) => Promise<void> | void,
    guard?: (ctx: CtxObj<CT, WorldContext>) => boolean
  ): IntermediateXtCallbackInfo {
    return [
      extension, code,
      [this._types, guard === undefined ? (undefined) : (guard as (ctx: Partial<WorldContext>) => boolean)],
      signature,
      callback as (ctx: Partial<WorldContext>, ...args: Array<string | number>) => void | Promise<void>
    ]
  }
}

type GroupedCallbacks = Array<[string, PreProcessCallbackInfo[]]>;

const groupCallbacks = (callbacks: IntermediateXtCallbackInfo[]): GroupedCallbacks => {
  if (callbacks.length === 0) {
    return [];
  }
  const first = callbacks[0];
  const tail = callbacks.slice(1);
  const [ext, code] = first;
  return [
    [[ext, code].join('%'), [first, ...tail.filter(i => i[0] === ext && i[1] === code)].map(i => [i[2], i[3], i[4]])],
    ...groupCallbacks(tail)
  ];
}

const getFinalCallbacks = (grouped: GroupedCallbacks): Array<[string, XtCallbackInfo[]]> => {
  return grouped.map(([name, callbacks]) => {

    if (callbacks.length > 1 && callbacks.filter(([[_, guard]]) => guard === undefined).length > 0) {
      throw new Error(`Multiple functions for ${name}, but some had no guard`);
    }
    return [name, callbacks.map(([[types, guard], signature, callback]) =>
      [[types, guard === undefined ? (() => true) : guard as ((ctx: Partial<WorldContext>) => boolean)], signature, callback as (ctx: Partial<WorldContext>, ...args: Array<string | number>) => Promise<void> | void])];
  });
}

export const createWorldXtHandler = (): XtHandler => {
  const p = new XtGenerator(['penguin', 'world', 'data', 'msg', 'prst', 'db']);

  const callbacks: IntermediateXtCallbackInfo[] = [
    p.xt('s', 'js', ['string', 'string', 'string'], handleJoinServer),
    p.xt('s', 'j#js', [], handleJoinServer)
  ];
  const grouped = groupCallbacks(callbacks);
  return new XtHandler(new Map(getFinalCallbacks(grouped)), async () => {});
}