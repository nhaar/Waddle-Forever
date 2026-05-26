import { WorldContext } from "./world";

import { CtxObj } from "@server/handlers";
import { handleAddItem, handleGetItems, handleJoinPlayerOld, handleJoinServer, handleSendCoins, joinRoom } from "@server/handlers/play/join";
import { XtCallbackInfo, XtHandler, XtParams } from "./xt-handler";
import { ArgumentsIndicator, GetArgumentsType } from "@server/handlers/arg-parser";
import { handleAddToy, handleAddToyOld, handleCloseToy, handleGetHockeyGame, handleGetTableGame, handleGetTables, handleGetWaddle, handleJoinTable, handleJoinTableGame, handleJoinWaddle, handleLeaveTable, handleLeaveTableGame, handleLeaveWaddle, handleMoveHockeyPuck, handleMoveHockeyPuckOld, handlePlayerTransform, handleSafeMessage, handleSendEmote, handleSendJoke, handleSendLine, handleSendMessage, handleSendTableMove, handleSetAction, handleSetFrame, handleSetPosition, handleSetSnowball, handleUpdateBackground, handleUpdateBody, handleUpdateColor, handleUpdateFace, handleUpdateFeet, handleUpdateHand, handleUpdateHead, handleUpdateHockeyGame, handleUpdateNeck, handleUpdatePenguinOld, handleUpdatePin, isHockeyGuard, isTableGuard, sendTeleportOld } from "@server/handlers/play/room";
import { doubleFilter } from "@common/utils";

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
  const [others, rest] = doubleFilter(i => i[0] === ext && i[1] === code, tail);
  return [
    [[ext, code].join('%'), [first, ...others].map(i => [i[2], i[3], i[4], i[5]])],
    ...groupCallbacks(rest)
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
    r.xt('z', 'gz', ['string'], handleGetTableGame, { guard: isTableGuard }),
    r.xt('z', 'jz', [], handleJoinTableGame),
    r.xt('z', 'lz', [], handleLeaveTableGame),
    r.xt('z', 'zm', 'number', handleSendTableMove, { guard: isTableGuard }),

    r.xt('z', 'gz', [], handleGetHockeyGame, { guard: isHockeyGuard }),
    r.xt('z', 'zm', ['number', 'number'], handleMoveHockeyPuckOld, { guard: isHockeyGuard }),
    r.xt('z', 'm', ['number', 'number', 'number', 'number', 'number'], handleMoveHockeyPuck, { guard: isHockeyGuard }),
    r.xt('z', 'uz', ['number'], handleUpdateHockeyGame, { guard: isHockeyGuard }),

    p.xt('s', 'j#js', [], handleJoinServer),
    r.xt('s', 'u#sp', ['number', 'number'], handleSetPosition),
    r.xt('s', 'u#sf', ['number'], handleSetFrame),
    r.xt('s', 'u#sa', ['string'], handleSetAction),
    r.xt('s', 'u#sb', ['string', 'string'], handleSetSnowball),
    r.xt('s', 'u#se', ['string'], handleSendEmote),
    r.xt('s', 'u#sj', ['string'], handleSendJoke),
    r.xt('s', 'm#sm', ['string', 'string'], handleSendMessage),
    r.xt('s', 'u#ss', ['string'], handleSafeMessage),
    r.xt('s', 'u#sl', ['string'], handleSendLine),
    r.xt('s', 't#at', ['string'], handleAddToy),
    r.xt('s', 't#rt', [], handleCloseToy),
    r.xt('s', 's#upc', ['number'], handleUpdateColor),
    r.xt('s', 's#uph', ['number'], handleUpdateHead),
    r.xt('s', 's#upn', ['number'], handleUpdateNeck),
    r.xt('s', 's#upf', ['number'], handleUpdateFace),
    r.xt('s', 's#upb', ['number'], handleUpdateBody),
    r.xt('s', 's#upa', ['number'], handleUpdateHand),
    r.xt('s', 's#upe', ['number'], handleUpdateFeet),
    r.xt('s', 's#upl', ['number'], handleUpdatePin),
    r.xt('s', 's#upp', ['number'], handleUpdateBackground),
    r.xt('s', 'pt#spts', ['number'], handlePlayerTransform)
  ];
  const grouped = groupCallbacks(callbacks);
  return new XtHandler(getFinalCallbacks(grouped), async () => {});
}