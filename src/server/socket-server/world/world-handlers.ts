import { WorldContext } from "./world";

import { CtxObj } from "@server/handlers";
import { handleAddEpfItem, handleAddItem, handleBecomeAgent, handleBuddyAccept, handleBuddyDecline, handleBuddyMessage, handleBuddyRemove, handleBuddyRequest, handleDisconnect, handleEPFStamp, handleGetBuddyNew, handleGetCoins, handleGetEpfMedals, handleGetEpfStatus, handleGetFieldOps, handleGetItems, handleGetMissionStamps, handleGetPartyOp, handleGetPinInfo, handleGetPlayer, handleGetPuffleLaunchData, handleGetRecentStamps, handleGetSpyDrillsChallenge, handleGetSpyDrillsReward, handleGetStampbookCoverData, handleGetTotalCoins, handleGLR, handleGN, handleGrantAwards, handleHeartbeat, handleJoinPlayerCpip, handleJoinPlayerModern, handleJoinPlayerOld, handleJoinServer, handlePBI, handleReceiveInventory, handleSendCoins, handleSetPartyOp, handleSetPuffleLaunchData, handleSetStampbookCoverData, handleSetStampEarned, handleSpyRequest, isBackyardGuard, isPreBackyardGuard, joinRoom, sendBuddyOnlineList, sendGetBuddies, sendStamps } from "@server/handlers/play/join";
import { XtCallbackInfo, XtHandler, XtParams } from "./xt-handler";
import { ArgumentsIndicator, GetArgumentsType } from "@server/handlers/arg-parser";
import { handleAddToy, handleAddToyOld, handleCloseToy, handleGetHockeyGame, handleGetTableGame, handleGetTables, handleGetWaddle, handleJoinTable, handleJoinTableGame, handleJoinWaddle, handleLeaveTable, handleLeaveTableGame, handleLeaveWaddle, handleMoveHockeyPuck, handleMoveHockeyPuckOld, handlePlayerTransform, handleSafeMessage, handleSendEmote, handleSendJoke, handleSendLine, handleSendMessage, handleSendTableMove, handleSetAction, handleSetFrame, handleSetPosition, handleSetSnowball, handleUpdateBackground, handleUpdateBody, handleUpdateColor, handleUpdateFace, handleUpdateFeet, handleUpdateHand, handleUpdateHead, handleUpdateHockeyGame, handleUpdateNeck, handleUpdatePenguinOld, handleUpdatePin, isHockeyGuard, isTableGuard, sendTeleportOld } from "@server/handlers/play/room";
import { doubleFilter } from "@common/utils";
import { handleCardJitsuAction, handleEnterCardGame, handleQuitCard, handleUpdateCardSeats, isCardJitsuGuard } from "@server/handlers/play/card";
import { handleGetMail, handleMailTotal, handleSendCard, handleSetMailCheck } from "@server/handlers/play/mail";
import { handleCheckName } from "@server/handlers/play/create";
import { handleLeaveGame, handleRoomRefresh } from "@server/handlers/play/game";
import { getIglooOld, handleAddFlooring, handleAddFurniture, handleAddIgloo, handleAddIglooLayout, handleAddIglooLocation, handleCloseIgloo, handleGetAllIglooLayouts, handleGetDj3kTracks, handleGetFurniture, handleGetFurnitureNew, handleGetIglooCpip, handleGetIglooItems, handleGetIglooLikes, handleGetIglooTypes, handleGetMusicTracks, handleGetOpenIgloos, handleOpenIgloo, handleUpdateIgloo, handleUpdateIglooLayout, handleUpdateIglooNew, handleUpdateIglooOld, handleUpdateIglooType, handleUpdateMusic } from "@server/handlers/play/igloo";
import { handleBuyNinjaCards, handleGetNinjaCards, handleGetNinjaLevel, handleGetNinjaRanks, handleJoinMatchmaking, handleJoinSensei } from "@server/handlers/play/ninja";
import { handleDonateCoins, handleGetBakeryState, handleGetCookieInventory, handleRetrieveMedieval2012, handleSendEnterHopper, handleViewedMedieval2012 } from "@server/handlers/play/party";

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
  const c = new XtGenerator(['penguin', 'world', 'data', 'msg', 'prst', 'db', 'card']);
  const z = new XtGenerator(['client', 'msg', 'db']);
  const g = new XtGenerator(['penguin', 'world', 'data', 'msg', 'prst', 'db', 'game']);

  const callbacks: IntermediateXtCallbackInfo[] = [
    p.xt('s', 'js', ['string', 'string', 'string'], handleJoinServer),
    p.xt('s', 'jr', ['number', 'number', 'number'], joinRoom),
    p.xt('s', 'gi', [], handleGetItems),
    p.xt('s', 'ai', ['number'], handleAddItem),
    p.xt('s', 'jp', ['number', 'number'], handleJoinPlayerOld),
    p.xt('s', 'ac', [], handleSendCoins),
    p.xt('s', 'gc', [], handleGetCoins),
    p.xt('s', 'il', [], handleReceiveInventory),
    r.xt('s', 'sp', ['number', 'number'], handleSetPosition),
    r.xt('s', 'sf', ['number'], handleSetFrame),
    r.xt('s', 'sa', ['string'], handleSetAction),
    r.xt('s', 'sb', ['string', 'string'], handleSetSnowball),
    r.xt('s', 'se', ['string'], handleSendEmote),
    r.xt('s', 'sj', ['string'], handleSendJoke),
    r.xt('s', 'ss', ['string'], handleSafeMessage),
    r.xt('s', 'at', ['string', 'string'], handleAddToyOld),
    r.xt('s', 'rt', [], handleCloseToy),
    r.xt('s', 'st', ['number', 'number', 'number'],  sendTeleportOld),
    r.xt('s', 'up', ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'], handleUpdatePenguinOld),
    r.xt('s', 'gt', 'number', handleGetTables),
    r.xt('s', 'jt', ['number'], handleJoinTable),
    r.xt('s', 'lt', [], handleLeaveTable),
    p.xt('s', 'gb', [], sendGetBuddies),
    p.xt('s', 'go', [], sendBuddyOnlineList),
    p.xt('s', 'bq', ['number'], handleBuddyRequest),
    p.xt('s', 'ba', ['number'], handleBuddyAccept),
    p.xt('s', 'bd', ['number'], handleBuddyDecline),
    p.xt('s', 'br', ['number'], handleBuddyRemove),
    p.xt('s', 'bm', ['number', 'number'], handleBuddyMessage),
    p.xt('s', 'gp', ['number'], handleGetPlayer),
    p.xt('s', 'af', ['number'], handleAddFurniture),
    p.xt('s', 'au', ['number'], handleAddIgloo),
    p.xt('s', 'gf', [], handleGetFurniture),
    p.xt('s', 'ur', 'string', handleUpdateIglooOld),
    p.xt('s', 'sc', ['number', 'number', 'number'], handleSendCard),

    p.xt('r', 'gm', ['number'], getIglooOld),
    p.xt('r', 'af', ['number'], handleAddFurniture),
    p.xt('r', 'au', ['number'], handleAddIgloo),
    p.xt('r', 'ag', ['number'], handleAddFlooring),
    p.xt('r', 'ur', 'string', handleUpdateIgloo),
    p.xt('r', 'gf', [], handleGetFurniture),
    p.xt('r', 'or', ['number'], handleOpenIgloo),
    p.xt('r', 'cr', ['number'], handleCloseIgloo),
    p.xt('r', 'gr', [], handleGetOpenIgloos),
    p.xt('r', 'um', ['number'], handleUpdateMusic),

    p.xt('k', 'spy', [], handleSpyRequest),
    
    p.xt('b', 'gb', [], sendGetBuddies),
    p.xt('b', 'go', [], sendBuddyOnlineList),
    p.xt('b', 'br', ['number'], handleBuddyRequest),
    p.xt('b', 'ba', ['number'], handleBuddyAccept),
    p.xt('b', 'bd', ['number'], handleBuddyDecline),
    p.xt('b', 'rb', ['number'], handleBuddyRemove),
    p.xt('b', 'bm', ['number', 'number'], handleBuddyMessage),
    
    p.xt('p', 'gp', ['number'], handleGetPlayer),
    
    r.xt('z', 'gw', 'string', handleGetWaddle),
    r.xt('z', 'jw', ['number'], handleJoinWaddle),
    r.xt('z', 'lw', [], handleLeaveWaddle),
    r.xt('z', 'jz', [], handleJoinTableGame),
    r.xt('z', 'gz', ['string'], handleGetTableGame, { guard: isTableGuard }),
    r.xt('z', 'gz', [], handleGetHockeyGame, { guard: isHockeyGuard }),
    c.xt('z', 'gz', ['number'], handleEnterCardGame, { guard: isCardJitsuGuard }),
    r.xt('z', 'uz', ['number'], handleUpdateHockeyGame, { guard: isHockeyGuard }),
    c.xt('z', 'uz', [], handleUpdateCardSeats, { guard: isCardJitsuGuard }),
    r.xt('z', 'lz', [], handleLeaveTableGame, { guard: isTableGuard }),
    c.xt('z', 'lz', [], handleQuitCard, { guard: isCardJitsuGuard }),
    r.xt('z', 'zm', 'number', handleSendTableMove, { guard: isTableGuard }),
    r.xt('z', 'zm', ['number', 'number'], handleMoveHockeyPuckOld, { guard: isHockeyGuard }),
    c.xt('z', 'zm', ['string', 'number'], handleCardJitsuAction, { guard: isCardJitsuGuard }),
    r.xt('z', 'm', ['number', 'number', 'number', 'number', 'number'], handleMoveHockeyPuck, { guard: isHockeyGuard }),
    p.xt('z', 'ggd', [], handleGetPuffleLaunchData),
    p.xt('z', 'sgd', ['string'], handleSetPuffleLaunchData),
    g.xt('z', 'zo', ['number'], handleLeaveGame),
    p.xt('z', 'zr', [], handleGetSpyDrillsChallenge),
    p.xt('z', 'zc', ['number'], handleGetSpyDrillsReward),
    p.xt('z', 'epfsf', ['number'], handleEPFStamp),
    p.xt('z', 'jmm', [], handleJoinMatchmaking),
    p.xt('z', 'jsen', [], handleJoinSensei),
    
    p.xt('s', 'j#js', ['string', 'string', 'string'], handleJoinServer),
    p.xt('s', 'j#jr', ['number', 'number', 'number'], joinRoom),
    g.xt('s', 'j#grs', [], handleRoomRefresh),
    p.xt('s', 'j#jp', ['number'], handleJoinPlayerCpip, { guard: isPreBackyardGuard }),
    p.xt('s', 'j#jp', ['number', 'string'], handleJoinPlayerModern, { guard: isBackyardGuard }),
    
    p.xt('s', 'i#gi', [], handleGetItems),
    p.xt('s', 'i#ai', ['number'], handleAddItem),
    p.xt('s', 'i#qpp', ['number'], handleGetPinInfo),
    p.xt('s', 'i#qpa', [], handleGetMissionStamps),
    
    p.xt('s', 'l#mst', [], handleMailTotal),
    p.xt('s', 'l#mg', [], handleGetMail),
    p.xt('s', 'l#mc', [], handleSetMailCheck),
    
    p.xt('s', 'n#gn', [], handleGN),
    
    p.xt('s', 'b#gb', [], handleGetBuddyNew),
    
    r.xt('s', 'u#sp', ['number', 'number'], handleSetPosition),
    r.xt('s', 'u#sf', ['number'], handleSetFrame),
    r.xt('s', 'u#sa', ['string'], handleSetAction),
    r.xt('s', 'u#sb', ['string', 'string'], handleSetSnowball),
    r.xt('s', 'u#se', ['string'], handleSendEmote),
    r.xt('s', 'u#sj', ['string'], handleSendJoke),
    r.xt('s', 'u#ss', ['string'], handleSafeMessage),
    r.xt('s', 'u#sl', ['string'], handleSendLine),
    p.xt('s', 'u#glr', [], handleGLR),
    p.xt('s', 'u#pbi', ['string'], handlePBI),
    p.xt('s', 'u#h', [], handleHeartbeat),
    
    r.xt('s', 'm#sm', ['string', 'string'], handleSendMessage),
    
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

    p.xt('s', 'g#gm', ['number'], handleGetIglooCpip),
    p.xt('s', 'g#gii', [], handleGetIglooItems),
    p.xt('s', 'g#af', ['number'], handleAddFurniture),
    p.xt('s', 'g#au', ['number'], handleAddIgloo),
    p.xt('s', 'g#ag', ['number'], handleAddFlooring),
    p.xt('s', 'g#ur', 'string', handleUpdateIgloo),
    p.xt('s', 'g#ao', ['number'], handleUpdateIglooType),
    p.xt('s', 'g#gf', [], handleGetFurnitureNew),
    p.xt('s', 'g#go', [], handleGetIglooTypes),
    p.xt('s', 'g#or', ['number', 'string'], handleOpenIgloo),
    p.xt('s', 'g#cr', ['number'], handleCloseIgloo),
    p.xt('s', 'g#gr', [], handleGetOpenIgloos),
    p.xt('s', 'g#um', ['number'], handleUpdateMusic),
    p.xt('s', 'g#gili', [], handleGetIglooLikes),
    p.xt('s', 'g#ggd', [], handleGetDj3kTracks),
    p.xt('s', 'g#gail', [], handleGetAllIglooLayouts),
    p.xt('s', 'g#uic', ['number', 'number', 'number', 'number', 'number', 'string'], handleUpdateIglooNew),
    p.xt('s', 'g#al', [], handleAddIglooLayout),
    p.xt('s', 'g#uiss', ['number', 'string'], handleUpdateIglooLayout),
    p.xt('s', 'g#aloc', ['number'], handleAddIglooLocation),

    p.xt('s', 'musictrack#getmymusictracks', [], handleGetMusicTracks),

    r.xt('s', 'pt#spts', ['number'], handlePlayerTransform),
    
    p.xt('s', 'r#gtc', [], handleGetTotalCoins),
    
    p.xt('s', 'st#gsbcd', ['number'], handleGetStampbookCoverData),
    p.xt('s', 'st#gps', [], sendStamps),
    p.xt('s', 'st#gmres', [], handleGetRecentStamps),
    p.xt('s', 'st#ssbcd', 'string', handleSetStampbookCoverData),
    p.xt('s', 'st#sse', ['number'], handleSetStampEarned),
    
    p.xt('s', 'f#epfga', [], handleGetEpfStatus),
    p.xt('s', 'f#epfgf', [], handleGetFieldOps),
    p.xt('s', 'f#epfgr', [], handleGetEpfMedals),
    p.xt('s', 'f#epfai', ['number'], handleAddEpfItem),
    p.xt('s', 'f#epfsa', [], handleBecomeAgent),
    p.xt('s', 'f#epfgrantreward', ['number'], handleGrantAwards),
    p.xt('s', 'f#epfgp', [], handleGetPartyOp),
    p.xt('s', 'f#epfsp', ['number'], handleSetPartyOp),

    p.xt('s', 'ni#gnr', [], handleGetNinjaRanks),
    p.xt('s', 'ni#gnl', [], handleGetNinjaLevel),
    p.xt('s', 'ni#gcd', [], handleGetNinjaCards),

    p.xt('s', 'cd#bpc', [], handleBuyNinjaCards),

    p.xt('s', 'e#dc', ['string', 'number'], handleDonateCoins),

    p.xt('s', 'mdvl#retrieve', [], handleRetrieveMedieval2012),
    p.xt('s', 'mdvl#msgviewed', ['number'], handleViewedMedieval2012),

    p.xt('s', 'ba#barsu', [], handleGetBakeryState),
    p.xt('s', 'ba#seh', ['string'], handleSendEnterHopper),
    p.xt('s', 'ba#ctc', [], handleGetCookieInventory),
    
    r.xt('m', 'sm', ['string', 'string'], handleSendMessage),
    r.xt('m', 'ss', ['string'], handleSafeMessage),
    z.xt('m', 'checkName', ['string'], handleCheckName)
  ];
  const grouped = groupCallbacks(callbacks);
  return new XtHandler(getFinalCallbacks(grouped), handleDisconnect);
}