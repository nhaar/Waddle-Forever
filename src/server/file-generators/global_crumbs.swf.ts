import { iterateEntries } from "@common/utils";
import { Action, addVarToStack, applyJsonToObject, callMethod, createBytecode, createEmptyObjectVar, createJsonDeclaration, defineLocal, defineLocalJson, getMemberChain, wrapPCode, PCodeRep } from "@common/flash/avm1";
import { emitCrumbSwf } from "@common/flash/emitter";
import { RoomName, ROOMS } from "../game-data/rooms";
import { IGLOO_FLOORING, IGLOO_TYPES } from "../game-logic/iglooItems";
import { PUFFLE_DATA } from "../game-logic/puffle";
import { FURNITURE } from "../game-logic/furniture";
import { ExclusiveType, ITEMS, ItemType } from "../game-logic/items";
import { FRAME_HACKS } from "../game-data/frame-hacks";
import { GLOBAL_PATHS, makeGlobalPathsComposite } from "../game-data/global-paths";
import serverList from "../servers";
import { GAME_CRUMBS } from "../game-data/game-crumbs";
import { GameName } from "@server/game-data/games";
import { GameData } from "@server/timelines/game-data";
import { SettingsManager } from "@server/settings";


function getIglooCrumbs(): PCodeRep {
  return applyJsonToObject("igloo_crumbs", Object.fromEntries(IGLOO_TYPES.rows.map(igloo => {
    return [igloo.id, { cost: igloo.cost }]
  })));
}

function getServerCrumbs(ip: string, loginPort: number, worldPort: number, modern: boolean): PCodeRep {
  const code: PCodeRep = [
    // normal servers
    ...createEmptyObjectVar("servers"),
    ...createEmptyObjectVar("login_server"),
  ]

  if (modern) {
    code.push(
      ...applyJsonToObject("login_server", { ip, port: loginPort })
    )
  } else {
    // login server: ip is array and even and odd ports
    code.push(
      ...applyJsonToObject("login_server", { ip: [ip, ip], even_port: loginPort, odd_port: worldPort })
    )
  }

  code.push(
    ...applyJsonToObject("servers", Object.fromEntries(serverList.map(server => {
      return [server.id, { ip, is_safe: false, port: worldPort, is_dumb: 67 }]
    })))
  )

  return code;
}

function getGameCrumbs(music: Map<GameName, number>): PCodeRep {
  return applyJsonToObject("game_crumbs", Object.fromEntries(Object.entries(GAME_CRUMBS).map(([game, crumb]) => {
    const musicId = music.get(game as GameName);
    return [game, { room_id: Number(crumb.room_id), music_id: musicId ?? Number(crumb.music_id), path: crumb.path }];
  })));
}

function getFloorCrumbs(): PCodeRep {
  return applyJsonToObject("floor_crumbs", Object.fromEntries(IGLOO_FLOORING.rows.map(floor => {
    return [floor.id, { cost: floor.cost }]
  })));
}

function getRoomCrumbs(music: Map<RoomName, number>, member: Map<RoomName, boolean>): PCodeRep {
  return applyJsonToObject("room_crumbs", Object.fromEntries(Object.entries(ROOMS).map(([room, info]) => {
    const data: any = { room_id: info.id, music_id: music.get(room as RoomName) ?? 0, path: `${room}.swf` };
    if (member.get(room as RoomName) === true) {
      data.is_member = true;
    }
    return [room, data];
  })));
}

function getPuffleCrumbs(): PCodeRep {
  return applyJsonToObject("puffle_crumbs", Object.fromEntries(PUFFLE_DATA.map((info, i) => {
    return [i, { colour: info.colour, max_health: info.max_health, max_hunger: info.max_hunger, max_rest: info.max_rest }]
  })));
}

function getFurnitureCrumbs(prices: Map<number, number>): PCodeRep {
  const types = {
    1: 'TYPE_ROOM',
    2: 'TYPE_WALL',
    3: 'TYPE_FLOOR',
    4: 'TYPE_WALL'
  };

  const sorts = {
    1: 'SORT_ROOM',
    2: 'SORT_WALL',
    3: 'SORT_FLOOR',
    4: 'SORT_PET'
  };

  const interactives = {
    0: 'INTERACTIVE_PLAY',
    1: 'INTERACTIVE_REST',
    2: 'INTERACTIVE_FEED'
  };

  return applyJsonToObject("furniture_crumbs", Object.fromEntries(FURNITURE.rows.map(row => {
    const typeVar = types[row.type];
    if (typeVar === undefined) {
      throw new Error('Invalid furniture type');
    }

    const sortVar = sorts[row.sort];
    if (sortVar === undefined) {
      throw new Error('Invalid sort type');
    }

    const data: any = {
      type: wrapPCode(addVarToStack(typeVar)),
      sort: wrapPCode(addVarToStack(sortVar)),
      cost: prices.get(row.id) ?? row.cost
    };

    if (row.interactive !== null) {
      const interactiveVar = interactives[row.interactive];
      if (interactiveVar === undefined) {
        throw new Error('Invalid interactive type');
      }
      data.interactive = wrapPCode(addVarToStack(interactiveVar));
    }

    return [row.id, data]
  })));
}

function getPaperCrumbs(prices: Map<number, number>): PCodeRep {
  const types = {
    [ItemType.Color]: 'COLOUR',
    [ItemType.Head]: 'HEAD',
    [ItemType.Face]: 'FACE',
    [ItemType.Neck]: 'NECK',
    [ItemType.Body]: 'BODY',
    [ItemType.Hand]: 'HAND',
    [ItemType.Feet]: 'FEET',
    [ItemType.Pin]: 'FLAG',
    [ItemType.Background]: 'PHOTO',
    [ItemType.Award]: 'OTHER'
  };

  const exclusiveTypes = {
    [ExclusiveType.Exclusive]: 'INVENTORY_EXCLUSIVE',
    [ExclusiveType.Super]: 'INVENTORY_SUPER_EXCLUSIVE',
    [ExclusiveType.Not]: null
  };

  return applyJsonToObject("paper_crumbs", Object.fromEntries(ITEMS.rows.map(item => {
    const data: any = {
      type: wrapPCode(addVarToStack(types[item.type])),
      cost: prices.get(item.id) ?? item.cost,
      is_member: item.isMember
    };

    if (item.makeAgent) data.make_secret_agent = true;
    if (item.isMedal) data.is_medal = true;
    if (item.isGift) data.is_gift = true;
    if (item.noPurchasePopup) data.noPurchasePopup = true;
    if (item.isTour) data.make_tour_guide = true;
    if (item.isBack) data.is_back = true;
    if (item.customDepth !== null) data.customDepth = item.customDepth;

    const exclusive = exclusiveTypes[item.exclusive];
    if (exclusive !== null) data.exclusive = wrapPCode(getMemberChain('shell', exclusive));

    return [item.id, data]
  })));
}

function getFrameHacks(): PCodeRep {
  return applyJsonToObject("frame_hacks", Object.fromEntries(FRAME_HACKS.getEntries()));
}

function getGlobalPath(paths: Map<string, string>, useCompositePaths: boolean): PCodeRep {
  const code: PCodeRep = [];

  // TODO put below code in version check. Currently all paths in GLOBAL_PATHS are written twice
  if (useCompositePaths) {
    code.push(
      ...defineLocal("global_content", callMethod(addVarToStack("shell"), "getGlobalContentPath", false)),
      ...defineLocal("game_path", callMethod(addVarToStack("shell"), "getGameContentPath", false))
    )
    const newPaths: Record<string, string> = {};
    paths.forEach((value, key) => {
      if (value !== undefined && value !== null) {
        newPaths[key] = value;
      }
    });
    const compositePaths = makeGlobalPathsComposite({ ...GLOBAL_PATHS, ...newPaths });
    iterateEntries(compositePaths, (key, value) => {
      const [base, path] = value;
      code.push(
        [Action.Push, "global_path"],
        Action.GetVariable,
        [Action.Push, key, base],
        Action.GetVariable,
        [Action.Push, path],
        Action.Add2,
        Action.SetMember
      )
    });
  } else {
    [...Object.entries(GLOBAL_PATHS), ...paths.entries()].forEach(([key, path]) => {
      if (path !== undefined && path !== null) {
        code.push(
          [Action.Push, "global_path"],
          Action.GetVariable,
          [Action.Push, key, path],
          Action.SetMember
        )
      }
    });
  }
  
  return code;
}

function getScavengerHunt(reward: number, member: boolean) {
  return [
    ...createEmptyObjectVar("scavenger_hunt_crumbs"),
    ...applyJsonToObject("scavenger_hunt_crumbs", {
      hunt_inactive: true, member_hunt: member, itemRewardID: reward
    })
  ];
}

export function getGlobalCrumbsSwf(d: GameData, s: SettingsManager): Buffer {
  const migrator = d.getMigrator();
  const hunt = d.getHunt();

  const code: PCodeRep = [
    ...defineLocal("shell", callMethod(addVarToStack("_global"), "getCurrentShell", false)),

    [Action.Push, "igloo_options", 0],
    Action.InitObject,
    Action.DefineLocal,
    ...applyJsonToObject("igloo_options", { contestRunning: false }),

    [Action.Push, "igloo_crumbs", 0],
    Action.InitObject,
    Action.DefineLocal,
    ...getIglooCrumbs(),

    ...createEmptyObjectVar("floor_crumbs"),
    ...getFloorCrumbs(),
    
    ...createEmptyObjectVar("room_crumbs"),
    ...getRoomCrumbs(d.getRoomsMusic(s.mods.getMusic()), d.getRoomsMember()),

    ...createEmptyObjectVar("puffle_crumbs"),
    ...getPuffleCrumbs(),

    ...createEmptyObjectVar("furniture_crumbs"),
    ...defineLocal("TYPE_ROOM", getMemberChain("shell", "FURNITURE_TYPE_ROOM")),
    ...defineLocal("TYPE_WALL", getMemberChain("shell", "FURNITURE_TYPE_WALL")),
    ...defineLocal("TYPE_FLOOR", getMemberChain("shell", "FURNITURE_TYPE_FLOOR")),
    ...defineLocal("SORT_ROOM", getMemberChain("shell", "FURNITURE_SORT_ROOM")),
    ...defineLocal("SORT_WALL", getMemberChain("shell", "FURNITURE_SORT_WALL")),
    ...defineLocal("SORT_FLOOR", getMemberChain("shell", "FURNITURE_SORT_FLOOR")),
    ...defineLocal("SORT_PET", getMemberChain("shell", "FURNITURE_SORT_PET")),
    ...defineLocal("INTERACTIVE_PLAY", getMemberChain("shell", "INTERACTIVE_PLAY")),
    ...defineLocal("INTERACTIVE_REST", getMemberChain("shell", "INTERACTIVE_REST")),
    ...defineLocal("INTERACTIVE_FEED", getMemberChain("shell", "INTERACTIVE_FEED")),

    ...getFurnitureCrumbs(d.getFurniturePrices()),

    ...createEmptyObjectVar("paper_crumbs"),
    ...defineLocal("COLOUR", getMemberChain("shell", "INVENTORY_TYPE_COLOUR")),
    ...defineLocal("HEAD", getMemberChain("shell", "INVENTORY_TYPE_HEAD")),
    ...defineLocal("FACE", getMemberChain("shell", "INVENTORY_TYPE_FACE")),
    ...defineLocal("NECK", getMemberChain("shell", "INVENTORY_TYPE_NECK")),
    ...defineLocal("BODY", getMemberChain("shell", "INVENTORY_TYPE_BODY")),
    ...defineLocal("HAND", getMemberChain("shell", "INVENTORY_TYPE_HAND")),
    ...defineLocal("FEET", getMemberChain("shell", "INVENTORY_TYPE_FEET")),
    ...defineLocal("FLAG", getMemberChain("shell", "INVENTORY_TYPE_FLAG")),
    ...defineLocal("PHOTO", getMemberChain("shell", "INVENTORY_TYPE_PHOTO")),
    ...defineLocal("OTHER", getMemberChain("shell", "INVENTORY_TYPE_OTHER")),
    ...defineLocalJson("PAPERDOLLDEPTH_TOP_LAYER", 7500),
    ...defineLocalJson("PAPERDOLLDEPTH_HAND_LAYER", 7000),
    ...defineLocalJson("PAPERDOLLDEPTH_BETWEEN_HAND_AND_HEAD", 6500),
    ...defineLocalJson("PAPERDOLLDEPTH_HEAD_LAYER", 6000),
    ...defineLocalJson("PAPERDOLLDEPTH_TOP_LAYER", 7500),
    ...defineLocalJson("PAPERDOLLDEPTH_BETWEEN_HEAD_AND_FACE", 5500),
    ...defineLocalJson("PAPERDOLLDEPTH_FACE_LAYER", 5000),
    ...defineLocalJson("PAPERDOLLDEPTH_BETWEEN_FACE_AND_NECK", 4500),
    ...defineLocalJson("PAPERDOLLDEPTH_NECK_LAYER", 4000),
    ...defineLocalJson("PAPERDOLLDEPTH_BETWEEN_NECK_AND_BODY", 3500),
    ...defineLocalJson("PAPERDOLLDEPTH_BODY_LAYER", 3000),
    ...defineLocalJson("PAPERDOLLDEPTH_BETWEEN_BODY_AND_FEET", 2500),
    ...defineLocalJson("PAPERDOLLDEPTH_FEET_LAYER", 2000),
    ...defineLocalJson("PAPERDOLLDEPTH_BETWEEN_FEET_AND_BACK", 1500),
    ...defineLocalJson("PAPERDOLLDEPTH_BACK_LAYER", 1000),
    ...defineLocalJson("PAPERDOLLDEPTH_BOTTOM_LAYER", 500),

    ...getPaperCrumbs(d.getItemPrices()),

    ...createEmptyObjectVar("player_colours"),
    ...applyJsonToObject("player_colours", {
      0: "0x003366",
      1: "0x003366",
      2: "0x009900",
      3: "0xFF3399",
      4: "0x333333",
      5: "0xCC0000",
      6: "0xFF6600",
      7: "0xFFCC00",
      8: "0x660099",
      9: "0x996600",
      10: "0xFF6666",
      11: "0x006600",
      12: "0x0099CC",
      13: "0x8AE302",
      14: "0x93A0A4",
      15: "0x02A797"
    }),

    ...createEmptyObjectVar("frame_hacks"),
    ...getFrameHacks(),

    ...createEmptyObjectVar("blocked_prefixes", "Array"),
    ...["sensei", "room_", "map"].flatMap(v => callMethod(addVarToStack("blocked_prefixes"), "push", true, createJsonDeclaration(v))),

    ...createEmptyObjectVar("blocked_suffixes", "Array"),
    ...createEmptyObjectVar("blocked_overrides", "Array"),
    ...callMethod(addVarToStack("blocked_overrides"), "push", true, createJsonDeclaration("room_dojo")),

    ...createEmptyObjectVar("global_path"),
    ...getGlobalPath(d.getGlobalPaths(), d.useCompositePaths()),

    ...createEmptyObjectVar("mascot_options"),
    ...applyJsonToObject("mascot_options", { migrator_active: migrator }),

    ...defineLocalJson("rockhopper", { name: "Rockhopper", gift_id: 959 }),
    ...defineLocalJson("auntArctic", { name: "Aunt Arctic", gift_id: 9021 }),
    ...defineLocalJson("cadence", { name: "Cadence", gift_id: 9015 }),
    ...defineLocalJson("gary", { name: "Gary", gift_id: 9007 }),
    ...defineLocalJson("franky", { name: "Franky", gift_id: 996 }),
    ...defineLocalJson("peteyK", { name: "Petey K", gift_id: 996 }),
    ...defineLocalJson("gBilly", { name: "G Billy", gift_id: 996 }),
    ...defineLocalJson("stompinBob", { name: "Stompin Bob", gift_id: 996 }),
    ...defineLocalJson("sensei", { name: "Sensei", gift_id: 9036 }),
    
    ...createEmptyObjectVar("mascot_crumbs"),
    ...applyJsonToObject("mascot_crumbs", {
      1: wrapPCode(addVarToStack("rockhopper")),
      2: wrapPCode(addVarToStack("auntArctic")),
      3: wrapPCode(addVarToStack("cadence")),
      4: wrapPCode(addVarToStack("gary")),
      5: wrapPCode(addVarToStack("franky")),
      6: wrapPCode(addVarToStack("peteyK")),
      7: wrapPCode(addVarToStack("gBilly")),
      8: wrapPCode(addVarToStack("stompinBob")),
      9: wrapPCode(addVarToStack("sensei"))
    }),

    ...getServerCrumbs(s.targetIP, s.loginPort, s.worldPort, d.isVanillaEngine()),

    ...createEmptyObjectVar("game_crumbs"),
    ...getGameCrumbs(d.getGamesMusic())
  ];

  if (hunt !== null) {
    code.push(...getScavengerHunt(hunt.global.reward, hunt.global.member));
  }

  return Buffer.from(emitCrumbSwf(createBytecode(code)));
}