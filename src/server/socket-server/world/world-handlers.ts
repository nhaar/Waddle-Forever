import { WorldContext } from "./world";

import { CtxObj } from "@server/handlers";
import { handleAddItem, handleGetItems, handleJoinPlayerOld, handleJoinServer, handleSendCoins, joinRoom } from "@server/handlers/play/join";
import { XtCallbackInfo, XtHandler, XtParams } from "./xt-handler";
import { ArgumentsIndicator, GetArgumentsType } from "@server/handlers/arg-parser";
import { handleAddToyOld, handleCloseToy, handleGetTableGame, handleGetTables, handleGetWaddle, handleJoinTable, handleJoinTableGame, handleJoinWaddle, handleLeaveTable, handleLeaveTableGame, handleLeaveWaddle, handleSafeMessage, handleSendEmote, handleSendJoke, handleSendMessage, handleSendTableMove, handleSetAction, handleSetFrame, handleSetPosition, handleSetSnowball, handleUpdatePenguinOld, sendTeleportOld } from "@server/handlers/play/room";

type PreProcessCallbackInfo = [
  [Array<keyof WorldContext & string>,
  ((ctx: Partial<WorldContext>) => boolean) | undefined],
  ArgumentsIndicator,
  (ctx: Partial<WorldContext>, ...args: Array<string | number>) => void | Promise<void>,
  params: XtParams
];

type IntermediateXtCallbackInfo = [string, string, ...PreProcessCallbackInfo];

class XtGenerator<CT extends Array<keyof WorldContext & string>> {
  constructor(private _types: CT) {}

  public xt<const T extends ArgumentsIndicator>(
    extension: string,
    code: string,
    signature: T,
    callback: (ctx: CtxObj<CT, WorldContext>, ...args: GetArgumentsType<T>) => Promise<void> | void,
    params?: { guard?: (ctx: CtxObj<CT, WorldContext>) => boolean, xt?: XtParams }
  ): IntermediateXtCallbackInfo {
    return [
      extension, code,
      [this._types, params?.guard === undefined ? (undefined) : (params.guard as (ctx: Partial<WorldContext>) => boolean)],
      signature,
      callback as (ctx: Partial<WorldContext>, ...args: Array<string | number>) => void | Promise<void>,
      params?.xt ?? {}
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
    [[ext, code].join('%'), [first, ...tail.filter(i => i[0] === ext && i[1] === code)].map(i => [i[2], i[3], i[4], i[5]])],
    ...groupCallbacks(tail)
  ];
}

const getFinalCallbacks = (grouped: GroupedCallbacks): Array<[string, XtCallbackInfo[]]> => {
  return grouped.map(([name, callbacks]) => {

    if (callbacks.length > 1 && callbacks.filter(([[_, guard]]) => guard === undefined).length > 0) {
      throw new Error(`Multiple functions for ${name}, but some had no guard`);
    }
    return [name, callbacks.map(([[types, guard], signature, callback, params]) =>
      [[types, guard === undefined ? (() => true) : guard as ((ctx: Partial<WorldContext>) => boolean)], signature, callback as (ctx: Partial<WorldContext>, ...args: Array<string | number>) => Promise<void> | void, params])];
  });
}

export const createWorldXtHandler = (): XtHandler => {
  const p = new XtGenerator(['penguin', 'world', 'data', 'msg', 'prst', 'db']);
  const r = new XtGenerator(['penguin', 'world', 'data', 'msg', 'prst', 'db', 'room']);

  const callbacks: IntermediateXtCallbackInfo[] = [
    p.xt('s', 'js', ['string', 'string', 'string'], handleJoinServer),
    p.xt('s', 'jr', ['number', 'number', 'number'], joinRoom),
    p.xt('s', 'gi', [], handleGetItems),
    p.xt('s', 'ai', ['number'], handleAddItem),
    p.xt('s', 'jp', ['number', 'number'], handleJoinPlayerOld),
    p.xt('s', 'ac', [], handleSendCoins),
    r.xt('s', 'sp', ['number', 'number'], handleSetPosition),
    r.xt('s', 'sf', ['number'], handleSetFrame),
    r.xt('s', 'sa', ['string'], handleSetAction),
    r.xt('s', 'sb', ['string', 'string'], handleSetSnowball),
    r.xt('s', 'se', ['string'], handleSendEmote),
    r.xt('s', 'sj', ['string'], handleSendJoke),
    r.xt('m', 'sm', ['string', 'string'], handleSendMessage),
    r.xt('s', 'ss', ['string'], handleSafeMessage),
    r.xt('m', 'ss', ['string'], handleSafeMessage),
    r.xt('s', 'at', ['string', 'string'], handleAddToyOld),
    r.xt('s', 'rt', [], handleCloseToy),
    r.xt('s', 'st', ['number', 'number', 'number'],  sendTeleportOld),
    r.xt('s', 'up', ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'], handleUpdatePenguinOld),
    r.xt('s', 'gt', 'number', handleGetTables),
    r.xt('s', 'jt', ['number'], handleJoinTable),
    r.xt('s', 'lt', [], handleLeaveTable),
    r.xt('z', 'gw', 'string', handleGetWaddle),
    r.xt('z', 'jw', ['number'], handleJoinWaddle),
    r.xt('z', 'lw', [], handleLeaveWaddle),
    r.xt('z', 'gz', ['number'], handleGetTableGame),
    r.xt('z', 'jz', [], handleJoinTableGame),
    r.xt('z', 'lz', [], handleLeaveTableGame),
    r.xt('z', 'zm', 'number', handleSendTableMove),

    p.xt('s', 'j#js', [], handleJoinServer)
  ];
  const grouped = groupCallbacks(callbacks);
  return new XtHandler(getFinalCallbacks(grouped), async () => {});
}