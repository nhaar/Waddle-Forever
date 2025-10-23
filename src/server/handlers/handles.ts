import { iterateEntries } from "../../common/utils";

/** Strings used to represent primitive types that can be used as an argument */
export type TypePrimitiveIndicator = 'number' | 'string';

/** Primitive types that can be used as an argument */
export type PrimitiveTypes = number | string;

type HandleLink = HandleName | HandleName[];

/**
 * A map of all the handle extensions in the game.
 * The topmost level begins with the highest level extension, pointing to
 * "directories" (the code before the #), being '' if the code has no #,
 * and then pointing to all the remaining codes, which point to the handles used by it
 */
type HandlerMapping = Record<string, 
  Record<string, HandleLink | Record<string, 
    HandleLink
  >>
>

/** All individual handles. Represent a handle which has a specific extension and argument signature */
export enum Handle {
  SetPosition,
  JoinRoom,
  JoinRoomOld,
  LeaveGame,
  JoinIgloo,
  JoinIglooNew,
  SendAction,
  SendFrame,
  Snowball,
  SendEmote,
  PBI,
  RoomRefresh,
  GetWaddle,
  GetTotalCoins,
  JoinWaddle,
  JoinServerOld,
  GetCoins,
  AddItemOld,
  UpdatePenguinOld,
  BecomeAgent,
  GetInventoryOld,
  SendMessageOld,
  SetPositionOld,
  SendEmoteOld,
  SnowballOld,
  GetInventory2007,
  SetFrameOld,
  GetEpfStatus,
  GetFieldOps,
  GetEpfMedals,
  AddEpfItem,
  BecomeEpfAgent,
  GrantEpfMedals,
  GetPuffleLaunchData,
  SetPuffleLaunchData,
  RollSpyDrills,
  SpyDrillsReward,
  GetIgloo,
  GetIglooTypes,
  GetFurniture,
  AddFurniture,
  UpdateIgloo,
  UpdateIglooMusic,
  AddFlooring,
  AddIgloo,
  UpdateIglooType,
  GetMusicTracks,
  GetIglooLikes,
  GetDj3kTracks,
  GetAllIglooLayouts,
  UpdateIglooNew,
  AddIglooLayout,
  UpdateIglooLayout,
  AddIglooLocation,
  OpenIgloo,
  CloseIgloo,
  GetOpenIgloos,
  GetInventory,
  AddItem,
  UpdateColor,
  UpdateHead,
  UpdateFace,
  UpdateNeck,
  UpdateBody,
  UpdateHand,
  UpdateFeet,
  UpdatePin,
  UpdateBackground,
  JoinServer,
  JoinServerNew,
  GetBuddies,
  GN,
  GLR,
  Heartbeat,
  GetIglooInventory,
  GetMail,
  GetAllMail,
  SetMailCheck,
  LeaveWaddle,
  DonateCoins,
  AdoptPuffle,
  AdoptPuffleNew,
  GetIglooPuffles,
  WalkPuffle,
  CheckPuffleName,
  CheckPuffleNameAlt,
  GetPuffleInventory,
  PuffleBackyardSwap,
  PuffleDigRandom,
  PuffleDigOnCommand,
  EatPuffleItem,
  RevealGoldPuffle,
  GetRainbowQuestData,
  SetRainbowQuestTaskComplete,
  RainbowQuestCollectCoins,
  RainbowQuestItemCollect,
  RainbowQuestCollectBonus,
  GetPinInformation,
  GetMissionStamps,
  GetStampbookCoverData,
  GetPlayerStamps,
  GetRecentStamps,
  SetStampbookCoverData,
  SetStampEarned,
  EnterWaddleGame,
  UpdateWaddleGameSeats,
  CardJitsuDeal,
  CardJitsuPick,
  JoinMatchMaking,
  GetNinjaRanks,
  GetNinjaLevel,
  GetCards,
  JoinSled,
  SledRaceAction,
  LeaveWaddleGame,
  HandleSendMessage,
  SendJokeOld,
  SendSafeMessageOld,
  SendActionOld,
  SendJoke,
  SendSafeMessage,
  JoinSensei,
  JoinTemporaryWaddle,
  LeaveWaddleMatch,
  GetFireLevel,
  CardJitsuFireClickSpinner,
  CardJitsuFireChooseTile,
  CardJitsuFireChooseCard,
  CardJitsuFireInfoReady,
  CardJitsuFireChooseElement,
  EPFStamps,
  OpenBook,
  CloseBook
};

/** Map of all the handles and their valid arguments */
export type HandleArguments = typeof HANDLE_ARGUMENTS;
export const HANDLE_ARGUMENTS = {
  [Handle.SetPosition]: ['number', 'number'],
  [Handle.JoinRoom]: ['number', 'number', 'number'],
  [Handle.JoinRoomOld]: ['number'],
  [Handle.LeaveGame]: ['number'],
  [Handle.JoinIgloo]: ['number'],
  [Handle.JoinIglooNew]: ['number', 'string'],
  [Handle.SendAction]: ['string'],
  [Handle.SendFrame]: ['number'],
  [Handle.Snowball]: ['string', 'string'],
  [Handle.SendEmote]: ['string'],
  [Handle.PBI]: ['string'],
  [Handle.RoomRefresh]: [],
  [Handle.GetWaddle]: 'number',
  [Handle.GetTotalCoins]: [],
  [Handle.JoinWaddle]: ['number'],
  [Handle.JoinServerOld]: [],
  [Handle.GetCoins]: [],
  [Handle.AddItemOld]: ['number'],
  [Handle.UpdatePenguinOld]: ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
  [Handle.BecomeAgent]: [],
  [Handle.GetInventoryOld]: [],
  [Handle.SendMessageOld]: ['string', 'string'],
  [Handle.SetPositionOld]: ['number', 'number'],
  [Handle.SendEmoteOld]: ['string'],
  [Handle.SnowballOld]: ['string', 'string'],
  [Handle.GetInventory2007]: [],
  [Handle.SetFrameOld]: ['number'],
  [Handle.GetEpfStatus]: [],
  [Handle.GetFieldOps]: [],
  [Handle.GetEpfMedals]: [],
  [Handle.AddEpfItem]: ['number'],
  [Handle.BecomeEpfAgent]: [],
  [Handle.GrantEpfMedals]: ['number'],
  [Handle.GetPuffleLaunchData]: [],
  [Handle.SetPuffleLaunchData]: ['string'],
  [Handle.RollSpyDrills]: [],
  [Handle.SpyDrillsReward]: ['number'],
  [Handle.GetIgloo]: ['number'],
  [Handle.GetIglooTypes]: [],
  [Handle.GetFurniture]: [],
  [Handle.AddFurniture]: ['number'],
  [Handle.UpdateIgloo]: 'string',
  [Handle.UpdateIglooMusic]: ['number'],
  [Handle.AddFlooring]: ['number'],
  [Handle.AddIgloo]: ['number'],
  [Handle.UpdateIglooType]: ['number'],
  [Handle.GetMusicTracks]: [],
  [Handle.GetIglooLikes]: [],
  [Handle.GetDj3kTracks]: [],
  [Handle.GetAllIglooLayouts]: [],
  [Handle.UpdateIglooNew]: ['number', 'number', 'number', 'number', 'number', 'string'],
  [Handle.AddIglooLayout]: [],
  [Handle.UpdateIglooLayout]: ['number'],
  [Handle.AddIglooLocation]: ['number'],
  [Handle.OpenIgloo]: ['string', 'string'],
  [Handle.CloseIgloo]: ['string'],
  [Handle.GetOpenIgloos]: [],
  [Handle.GetInventory]: [],
  [Handle.AddItem]: ['number'],
  [Handle.UpdateColor]: ['number'],
  [Handle.UpdateHead]: ['number'],
  [Handle.UpdateFace]: ['number'],
  [Handle.UpdateNeck]: ['number'],
  [Handle.UpdateBody]: ['number'],
  [Handle.UpdateHand]: ['number'],
  [Handle.UpdateFeet]: ['number'],
  [Handle.UpdatePin]: ['number'],
  [Handle.UpdateBackground]: ['number'],
  [Handle.JoinServer]: [],
  [Handle.JoinServerNew]: ['number'],
  [Handle.GetBuddies]: [],
  [Handle.GN]: [],
  [Handle.GLR]: [],
  [Handle.Heartbeat]: [],
  [Handle.GetIglooInventory]: [],
  [Handle.GetMail]: [],
  [Handle.GetAllMail]: [],
  [Handle.SetMailCheck]: [],
  [Handle.LeaveWaddle]: [],
  [Handle.DonateCoins]: ['string', 'number'],
  [Handle.AdoptPuffle]: ['number', 'string'],
  [Handle.AdoptPuffleNew]: ['number', 'string', 'number'],
  [Handle.GetIglooPuffles]: ['number', 'string'],
  [Handle.WalkPuffle]: ['number', 'number'],
  [Handle.CheckPuffleName]: ['string'],
  [Handle.CheckPuffleNameAlt]: ['string'],
  [Handle.GetPuffleInventory]: [],
  [Handle.PuffleBackyardSwap]: ['number', 'string'],
  [Handle.PuffleDigRandom]: [],
  [Handle.PuffleDigOnCommand]: [],
  [Handle.EatPuffleItem]: ['number', 'number'],
  [Handle.RevealGoldPuffle]: [],
  [Handle.GetRainbowQuestData]: [],
  [Handle.SetRainbowQuestTaskComplete]: ['number'],
  [Handle.RainbowQuestCollectCoins]: ['string'],
  [Handle.RainbowQuestItemCollect]: ['number'],
  [Handle.RainbowQuestCollectBonus]: [],
  [Handle.GetPinInformation]: ['string'],
  [Handle.GetMissionStamps]: [],
  [Handle.GetStampbookCoverData]: ['string'],
  [Handle.GetPlayerStamps]: ['string'],
  [Handle.GetRecentStamps]: [],
  [Handle.SetStampbookCoverData]: ['number', 'number', 'number', 'number'],
  [Handle.SetStampEarned]: ['number'],
  [Handle.EnterWaddleGame]: [],
  [Handle.UpdateWaddleGameSeats]: [],
  [Handle.CardJitsuDeal]: ['string', 'number'],
  [Handle.CardJitsuPick]: ['string', 'number', 'number'],
  [Handle.JoinMatchMaking]: [],
  [Handle.GetNinjaRanks]: [],
  [Handle.GetNinjaLevel]: [],
  [Handle.GetCards]: [],
  [Handle.JoinSled]: [],
  [Handle.SledRaceAction]: ['string', 'string', 'string', 'string'],
  [Handle.LeaveWaddleGame]: [],
  [Handle.HandleSendMessage]: ['string', 'string'],
  [Handle.SendJokeOld]: ['string'],
  [Handle.SendSafeMessageOld]: ['string'],
  [Handle.SendActionOld]: ['string'],
  [Handle.SendJoke]: ['string'],
  [Handle.SendSafeMessage]: ['string'],
  [Handle.JoinSensei]: [],
  [Handle.JoinTemporaryWaddle]: ['number', 'number', 'number'],
  [Handle.LeaveWaddleMatch]: [],
  [Handle.GetFireLevel]: [],
  [Handle.CardJitsuFireClickSpinner]: ['string', 'number', 'number'],
  [Handle.CardJitsuFireChooseTile]: ['string', 'number'],
  [Handle.CardJitsuFireChooseCard]: ['string', 'number'],
  [Handle.CardJitsuFireInfoReady]: ['string'],
  [Handle.CardJitsuFireChooseElement]: ['string', 'string'],
  [Handle.EPFStamps]: ['number'],
  [Handle.OpenBook]: ['number'],
  [Handle.CloseBook]: []
} as const;

const HANDLER_MAPPING: HandlerMapping = {
  's': {
    'jr': Handle.JoinRoomOld,
    'js': Handle.JoinServerOld,
    'ac': Handle.GetCoins,
    'ai': Handle.AddItemOld,
    'up': Handle.UpdatePenguinOld,
    'il': Handle.GetInventoryOld,
    'sp': Handle.SetPositionOld,
    'se': Handle.SendEmoteOld,
    'sb': Handle.SnowballOld,
    'gi': Handle.GetInventory2007,
    'sf': Handle.SetFrameOld,
    'sj': Handle.SendJokeOld,
    'ss': Handle.SendSafeMessageOld,
    'sa': Handle.SendActionOld,
    'j': {
      'jr': Handle.JoinRoom,
      'jp': [Handle.JoinIgloo, Handle.JoinIglooNew],
      'grs': Handle.RoomRefresh,
      'js': [Handle.JoinServer, Handle.JoinServerNew]
    },
    'i': {
      'gi': Handle.GetInventory,
      'ai': Handle.AddItem,
      'qpp': Handle.GetPinInformation,
      'qpa': Handle.GetMissionStamps
    },
    'm': {
      'sm': Handle.HandleSendMessage
    },
    'u': {
      'sa': Handle.SendAction,
      'sf': Handle.SendFrame,
      'sp': Handle.SetPosition,
      'sb': Handle.Snowball,
      'se': Handle.SendEmote,
      'sj': Handle.SendJoke,
      'ss': Handle.SendSafeMessage,
      'pbi': Handle.PBI,
      'glr': Handle.GLR,
      'h': Handle.Heartbeat
    },
    'r': {
      'gtc': Handle.GetTotalCoins
    },
    's': {
      'upc': Handle.UpdateColor,
      'uph': Handle.UpdateHead,
      'upf': Handle.UpdateFace,
      'upn': Handle.UpdateNeck,
      'upb': Handle.UpdateBody,
      'upa': Handle.UpdateHand,
      'upe': Handle.UpdateFeet,
      'upl': Handle.UpdatePin,
      'upp': Handle.UpdateBackground
    },
    'b': {
      'gb': Handle.GetBuddies
    },
    'f': {
      'epfga': Handle.GetEpfStatus,
      'epfgf': Handle.GetFieldOps,
      'epfgr': Handle.GetEpfMedals,
      'epfai': Handle.AddEpfItem,
      'epfsa': Handle.BecomeEpfAgent,
      'epfgrantreward': Handle.GrantEpfMedals
    },
    'g': {
      'gm': Handle.GetIgloo,
      'go': Handle.GetIglooTypes,
      'gf': Handle.GetFurniture,
      'af': Handle.AddFurniture,
      'ur': Handle.UpdateIgloo,
      'um': Handle.UpdateIglooMusic,
      'ag': Handle.AddFlooring,
      'au': Handle.AddIgloo,
      'ao': Handle.UpdateIglooType,
      'gili': Handle.GetIglooLikes,
      'ggd': Handle.GetDj3kTracks,
      'gail': Handle.GetAllIglooLayouts,
      'uic': Handle.UpdateIglooNew,
      'al': Handle.AddIglooLayout,
      'uiss': Handle.UpdateIglooLayout,
      'aloc': Handle.AddIglooLocation,
      'or': Handle.OpenIgloo,
      'cr': Handle.CloseIgloo,
      'gr': Handle.GetOpenIgloos,
      'gii': Handle.GetIglooInventory
    },
    'p': {
      'pn': [Handle.AdoptPuffle, Handle.AdoptPuffleNew],
      'pg': Handle.GetIglooPuffles,
      'pw': Handle.WalkPuffle,
      'checkpufflename': Handle.CheckPuffleName,
      'pcn': Handle.CheckPuffleNameAlt,
      'pgpi': Handle.GetPuffleInventory,
      'puffleswap': Handle.PuffleBackyardSwap,
      'puffledig': Handle.PuffleDigRandom,
      'puffledigoncommand': Handle.PuffleDigOnCommand,
      'pcid': Handle.EatPuffleItem,
      'revealgoldpuffle': Handle.RevealGoldPuffle,
      'rpqtc': Handle.SetRainbowQuestTaskComplete
    },
    't': {
      'at': Handle.OpenBook,
      'rt': Handle.CloseBook
    },
    'st': {
      'gsbcd': Handle.GetStampbookCoverData,
      'gps': Handle.GetPlayerStamps,
      'gmres': Handle.GetRecentStamps,
      'ssbcd': Handle.SetStampbookCoverData,
      'sse': Handle.SetStampEarned
    },
    'rpq': {
      'rpqd': Handle.GetRainbowQuestData,
      'rpqtc': Handle.SetRainbowQuestTaskComplete,
      'rpqcc': Handle.RainbowQuestCollectCoins,
      'rpqic': Handle.RainbowQuestItemCollect,
      'rpqbc': Handle.RainbowQuestCollectBonus
    },
    'l': {
      'mst': Handle.GetMail,
      'mg': Handle.GetAllMail,
      'mc': Handle.SetMailCheck
    },
    'n': {
      'gn': Handle.GN
    },
    'musictrack': {
      'getmymusictracks': Handle.GetMusicTracks
    },
    'e': {
      'dc': Handle.DonateCoins
    },
    'ni': {
      'gnr': Handle.GetNinjaRanks,
      'gnl': Handle.GetNinjaLevel,
      'gcd': Handle.GetCards,
      'gfl': Handle.GetFireLevel
    },
    'w': {
      'jx': Handle.JoinTemporaryWaddle
    }
  },
  'z': {
    'zo': [Handle.LeaveGame, Handle.LeaveWaddleGame],
    'gw': Handle.GetWaddle,
    'jw': Handle.JoinWaddle,
    'ggd': Handle.GetPuffleLaunchData,
    'sgd': Handle.SetPuffleLaunchData,
    'zr': Handle.RollSpyDrills,
    'zc': Handle.SpyDrillsReward,
    'lw': Handle.LeaveWaddle,
    'gz': Handle.EnterWaddleGame,
    'uz': Handle.UpdateWaddleGameSeats,
    'zm': [
      Handle.SledRaceAction,
      Handle.CardJitsuDeal,
      Handle.CardJitsuPick,
      Handle.CardJitsuFireClickSpinner,
      Handle.CardJitsuFireChooseTile,
      Handle.CardJitsuFireChooseCard,
      Handle.CardJitsuFireInfoReady,
      Handle.CardJitsuFireChooseElement
    ],
    'jmm': Handle.JoinMatchMaking,
    'jz': Handle.JoinSled,
    'jsen': Handle.JoinSensei,
    'lz': Handle.LeaveWaddleMatch,
    'epfsf': Handle.EPFStamps
  },
  'k': {
    'spy': Handle.BecomeAgent
  },
  'm': {
    'sm': Handle.SendMessageOld
  }
}

type XtName = {
  extension: string;
  code: string;
}


export const handlePacketNames = new Map<HandleName, XtName>();

function iterateHandles(ext: string, code: string, handles: Handle | Handle[], dir?: string) {
  let array = typeof handles === 'number' ? [handles] : handles;
  array.forEach(handle => {
    handlePacketNames.set(handle, { extension: ext, code: dir === undefined ? code : `${dir}#${code}` });
  });
}

iterateEntries(HANDLER_MAPPING, (ext, dirs) => {
  iterateEntries(dirs, (dir, codes) => {
    if (typeof codes === 'number' || Array.isArray(codes)) {
      iterateHandles(ext, dir, codes);
    } else {
      iterateEntries(codes, (code, names) => {
        iterateHandles(ext, code, names, dir);
      })
    }
  });
});

export type HandleName = keyof typeof HANDLE_ARGUMENTS;

type MapPrimitive<T> =
  T extends 'number' ? number :
  T extends 'string' ? string :
  never;

/**
 * Indicates the valid arguments for a callback, which is either a tuple of elements indicating the valid types,
 * or a single type indicating it is an array of that type
 */
export type ArgumentsIndicator = TypePrimitiveIndicator | readonly TypePrimitiveIndicator[];

/** Map a type indicator to its actual argument type */
export type GetArgumentsType<T extends ArgumentsIndicator> = T extends readonly TypePrimitiveIndicator[] ? {
  [K in keyof T]: MapPrimitive<T[K]>;
} : T extends 'number' ? number[] : string[];