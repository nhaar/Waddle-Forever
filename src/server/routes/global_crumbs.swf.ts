import { iterateEntries } from "../../common/utils";
import { Action, createBytecode, PCodeRep } from "../../common/flash/avm1";
import { emitSwf } from "../../common/flash/emitter";
import { ROOMS } from "../game-data/rooms";
import { IGLOO_FLOORING, IGLOO_TYPES } from "../game-logic/iglooItems";
import { Version } from "./versions";
import { PUFFLE_DATA } from "../game-logic/puffle";
import { FURNITURE } from "../game-logic/furniture";
import { ExclusiveType, ITEMS, ItemType } from "../game-logic/items";
import { FRAME_HACKS } from "../game-data/frame-hacks";
import { GLOBAL_PATHS } from "../game-data/global-paths";
import { findInVersionStrict } from "../game-data";
import { MIGRATOR_TIMELINE } from "../timelines/migrator";
import { getMapForDate } from "../timelines";
import { MUSIC_TIMELINE } from "../timelines/music";
import { MEMBER_TIMELINE } from "../timelines/member";
import { PRICES_TIMELINE, FURNITURE_PRICES_TIMELINE } from "../timelines/prices";
import { GLOBAL_PATHS_TIMELINE, HUNT_TIMELINE } from "../timelines/crumbs";
import serverList from "../servers";
import { isEngine3 } from "../timelines/dates";
import { GAME_CRUMBS } from "../game-data/game-crumbs";


function getIglooCrumbs(): PCodeRep {
  const code: PCodeRep = [];
  IGLOO_TYPES.rows.forEach(igloo => {
    code.push(
      [Action.Push, "igloo_crumbs"],
      Action.GetVariable,
      [Action.Push, igloo.id, "cost", igloo.cost, 1],
      Action.InitObject,
      Action.SetMember
    );
  });

  return code;
}

function getServerCrumbs(ip: string, loginPort: number, worldPort: number, modern: boolean): PCodeRep {
  const code: PCodeRep = [
    // normal servers
    [Action.Push, "servers"],
    [Action.Push, 0],
    [Action.Push, "Object"],
    Action.NewObject,
    Action.DefineLocal
  ]

  if (modern) {
    code.push(
      [Action.Push, "login_server"],
      [Action.Push, 0],
      [Action.Push, "Object"],
      Action.NewObject,
      Action.DefineLocal,
      [Action.Push, "login_server"],
      Action.GetVariable,
      [Action.Push, "ip"],
      Action.SetMember,
      [Action.Push, "login_server"],
      Action.GetVariable,
      [Action.Push, "port"],
      [Action.Push, loginPort],
      Action.SetMember
    )
  } else {
    // login server: ip is array and even and odd ports
    code.push(
      [Action.Push, "login_server"],
      [Action.Push, 0],
      [Action.Push, "Object"],
      Action.NewObject,
      Action.DefineLocal,
      [Action.Push, "login_server"],
      Action.GetVariable,
      [Action.Push, "ip"],
      [Action.Push, ip],
      [Action.Push, ip],
      [Action.Push, 2],
      Action.InitArray,
      Action.SetMember,
      [Action.Push, "login_server"],
      Action.GetVariable,
      [Action.Push, "even_port"],
      [Action.Push, loginPort],
      Action.SetMember,
      [Action.Push, "login_server"],
      Action.GetVariable,
      [Action.Push, "odd_port"],
      [Action.Push, worldPort],
      Action.SetMember
    )
  }

  serverList.forEach(server => {
    code.push(
      [Action.Push, "servers"],
      Action.GetVariable,
      [Action.Push, server.id],
      [Action.Push, "ip"],
      [Action.Push, ip],
      [Action.Push, "is_safe"],
      [Action.Push, false],
      [Action.Push, "port"],
      [Action.Push, worldPort],
      [Action.Push, 3],
      Action.InitObject,
      Action.SetMember
    )
  });



  return code;
}

function getGameCrumbs(): PCodeRep {
  const code: PCodeRep = [
    [Action.Push, "game_crumbs", 0, "Object"],
    Action.NewObject,
    Action.DefineLocal
  ];
  iterateEntries(GAME_CRUMBS, (game, crumb) => {
    code.push(
      [Action.Push, "game_crumbs"],
      Action.GetVariable,
      [Action.Push, game, "room_id", Number(crumb.room_id), "music_id", Number(crumb.music_id), "path", crumb.path, 3],
      Action.InitObject,
      Action.SetMember
    )
  });
  return code;
}

function getFloorCrumbs(): PCodeRep {
  const code: PCodeRep = [];
  IGLOO_FLOORING.rows.forEach(floor => {
    code.push(
      [Action.Push, "floor_crumbs"],
      Action.GetVariable,
      [Action.Push, floor.id, "cost", floor.cost, 1],
      Action.InitObject,
      Action.SetMember
    );
  });

  return code;
}

function getRoomCrumbs(version: Version): PCodeRep {
  const code: PCodeRep = [];

  const music = getMapForDate(MUSIC_TIMELINE, version);
  const member = getMapForDate(MEMBER_TIMELINE, version);
  
  iterateEntries(ROOMS, (room, info) => {
    let total = 3;
    let memberArgs: Array<string | boolean> = [];
    if (member[room] === true) {
      total += 1;
      memberArgs = ['is_member', true];
    }
    code.push(
      [Action.Push, "room_crumbs"],
      Action.GetVariable,
      [Action.Push, room, "room_id", info.id, "music_id", music[room] ?? 0, "path", `${room}.swf`, ...memberArgs, total],
      Action.InitObject,
      Action.SetMember,
    )
  });

  return code;
}

function getPuffleCrumbs(): PCodeRep {
  const code: PCodeRep = [];
  PUFFLE_DATA.forEach((info, i) => {
    code.push(
      [Action.Push, "puffle_crumbs"],
      Action.GetVariable,
      [Action.Push, i, "colour", info.colour, "max_health", info.max_health, "max_hunger", info.max_hunger, "max_rest", info.max_rest, 4],
      Action.InitObject,
      Action.SetMember
    )
  });
  return code;
}

function getFurnitureCrumbs(version: Version): PCodeRep {
  const code: PCodeRep = [];
  const prices = getMapForDate(FURNITURE_PRICES_TIMELINE, version);
  
  FURNITURE.rows.forEach(row => {
    let total = 3;
    const typeVar = {
      1: 'TYPE_ROOM',
      2: 'TYPE_WALL',
      3: 'TYPE_FLOOR',
      4: 'TYPE_WALL'
    }[row.type];
    if (typeVar === undefined) {
      throw new Error('Invalid furniture type');
    }
    const sortVar = {
      1: 'SORT_ROOM',
      2: 'SORT_WALL',
      3: 'SORT_FLOOR',
      4: 'SORT_PET'
    }[row.sort];
    if (sortVar === undefined) {
      throw new Error('Invalid sort type');
    }

    code.push(
      [Action.Push, "furniture_crumbs"],
      Action.GetVariable,
      [Action.Push, row.id, "type", typeVar],
      Action.GetVariable,
      [Action.Push, "sort", sortVar],
      Action.GetVariable
    )

    if (row.interactive !== null) {
      total += 1;
      const interactiveVar = {
        0: 'INTERACTIVE_PLAY',
        1: 'INTERACTIVE_REST',
        2: 'INTERACTIVE_FEED'
      }[row.interactive];
      if (interactiveVar === undefined) {
        throw new Error('Invalid interactive type');
      }
      code.push(
        [Action.Push, "interactive", interactiveVar],
        Action.GetVariable
      )
    }

    const cost = prices[row.id] ?? row.cost;
    code.push(
      [Action.Push, "cost", cost, total],
      Action.InitObject,
      Action.SetMember
    );
  })
  
  return code;
}

function getPaperCrumbs(version: Version): PCodeRep {
  const code: PCodeRep = [];

  const prices = getMapForDate(PRICES_TIMELINE, version);
  
  ITEMS.rows.forEach(item => {
    let total = 3;
    const type = {
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
    }[item.type];

    code.push(
      [Action.Push, "paper_crumbs"],
      Action.GetVariable,
      [Action.Push, item.id, "type", type],
      Action.GetVariable
    );

    if (item.makeAgent) {
      code.push(
        [Action.Push, "make_secret_agent", true]
      );
      total++;
    }
    if (item.isMedal) {
      code.push(
        [Action.Push, "is_medal", true]
      );
      total++;
    }
    if (item.isGift) {
      code.push(
        [Action.Push, "is_gift", true]
      );
      total++;
    }
    if (item.noPurchasePopup) {
      code.push(
        [Action.Push, "noPurchasePopup", true]
      );
      total++;
    }
    if (item.isTour) {
      code.push(
        [Action.Push, "make_tour_guide", true]
      );
      total++;
    }
    if (item.isBack) {
      code.push(
        [Action.Push, "is_back", true]
      );
      total++;
    }
    if (item.customDepth !== null) {
      code.push(
        [Action.Push, "customDepth", item.customDepth]
      );
      total++;
    }
    const exclusive = {
      [ExclusiveType.Exclusive]: 'INVENTORY_EXCLUSIVE',
      [ExclusiveType.Super]: 'INVENTORY_SUPER_EXCLUSIVE',
      [ExclusiveType.Not]: null
    }[item.exclusive];

    if (exclusive !== null) {
      code.push(
        [Action.Push, "exclusive", "shell"],
        Action.GetVariable,
        [Action.Push, exclusive],
        Action.GetMember
      );
      total++;
    }

    const cost = prices[item.id] ?? item.cost;

    code.push(
      [Action.Push, "cost", cost, "is_member", item.isMember, total],
      Action.InitObject,
      Action.SetMember,
    )
  })

  
  return code;
}

function getFrameHacks(): PCodeRep {
  const code: PCodeRep = [];

  const ids: ['25', '26'] = ['25', '26'];
  ids.forEach(value => {
    const frames = FRAME_HACKS[value];
    code.push(
      [Action.Push, "frame_hacks"],
      Action.GetVariable,
      [Action.Push, Number(value)]
    );
    [...frames].reverse().forEach(obj => {
      code.push(
        [Action.Push, "head", obj.head, "face", obj.face, "neck", obj.neck, "body", obj.body, "hand", obj.hand, "feet", obj.feet, "secret_frame", obj.secret_frame, 7],
        Action.InitObject
      )
    });
    code.push(
      [Action.Push, frames.length],
      Action.InitArray,
      Action.SetMember
    );
  });
  
  return code;
}

function getGlobalPath(version: Version): PCodeRep {
  const code: PCodeRep = [];
  const paths = getMapForDate(GLOBAL_PATHS_TIMELINE, version);

  iterateEntries({ ... GLOBAL_PATHS, ...paths }, (key, path) => {
    if (path !== undefined && path !== null) {
      code.push(
        [Action.Push, "global_path"],
        Action.GetVariable,
        [Action.Push, key, path],
        Action.SetMember
      )
    }
  });

  return code;
}

function getScavengerHunt(reward: number, member: boolean) {
  const code: PCodeRep = [
    [Action.Push, "scavenger_hunt_crumbs", 0, "Object"],
    Action.NewObject,
    Action.DefineLocal,
    [Action.Push, "scavenger_hunt_crumbs"],
    Action.GetVariable,
    [Action.Push, "hunt_active", true],
    Action.SetMember,
    [Action.Push, "scavenger_hunt_crumbs"],
    Action.GetVariable,
    [Action.Push, "member_hunt", member],
    Action.SetMember,
    [Action.Push, "scavenger_hunt_crumbs"],
    Action.GetVariable,
    [Action.Push, "itemRewardID", reward],
    Action.SetMember
  ];

  return code;
}

export function getGlobalCrumbsSwf(version: Version, ip: string, loginPort: number, worldPort: number): Buffer {
  const migrator = findInVersionStrict(version, MIGRATOR_TIMELINE);
  const hunt = findInVersionStrict(version, HUNT_TIMELINE);

  const code: PCodeRep = [
    [Action.Push, "shell", 0, "_global"],
    Action.GetVariable,
    [Action.Push, "getCurrentShell"],
    Action.CallMethod,
    Action.DefineLocal,
    [Action.Push, "igloo_options", 0],
    Action.InitObject,
    Action.DefineLocal,
    [Action.Push, "igloo_options"],
    Action.GetVariable,
    [Action.Push, "contestRunning", false],
    Action.SetMember,
    [Action.Push, "igloo_crumbs", 0],
    Action.InitObject,
    Action.DefineLocal,
    ...getIglooCrumbs(),
    [Action.Push, "floor_crumbs", 0, "Object"],
    Action.NewObject,
    Action.DefineLocal,
    ...getFloorCrumbs(),
    [Action.Push, "room_crumbs", 0, "Object"],
    Action.NewObject,
    Action.DefineLocal,
    ...getRoomCrumbs(version),
    [Action.Push, "puffle_crumbs", 0, "Object"],
    Action.NewObject,
    Action.DefineLocal,
    ...getPuffleCrumbs(),
    [Action.Push, "furniture_crumbs", 0, "Object"],
    Action.NewObject,
    Action.DefineLocal,
    [Action.Push, "TYPE_ROOM", "shell"],
    Action.GetVariable,
    [Action.Push, "FURNITURE_TYPE_ROOM"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "TYPE_WALL", "shell"],
    Action.GetVariable,
    [Action.Push, "FURNITURE_TYPE_WALL"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "TYPE_FLOOR", "shell"],
    Action.GetVariable,
    [Action.Push, "FURNITURE_TYPE_FLOOR"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "SORT_ROOM", "shell"],
    Action.GetVariable,
    [Action.Push, "FURNITURE_SORT_ROOM"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "SORT_WALL", "shell"],
    Action.GetVariable,
    [Action.Push, "FURNITURE_SORT_WALL"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "SORT_FLOOR", "shell"],
    Action.GetVariable,
    [Action.Push, "FURNITURE_SORT_FLOOR"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "SORT_PET", "shell"],
    Action.GetVariable,
    [Action.Push, "FURNITURE_SORT_PET"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "INTERACTIVE_PLAY", "shell"],
    Action.GetVariable,
    [Action.Push, "INTERACTIVE_PLAY"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "INTERACTIVE_REST", "shell"],
    Action.GetVariable,
    [Action.Push, "INTERACTIVE_REST"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "INTERACTIVE_FEED", "shell"],
    Action.GetVariable,
    [Action.Push, "INTERACTIVE_FEED"],
    Action.GetMember,
    Action.DefineLocal,
    ...getFurnitureCrumbs(version),
    [Action.Push, "paper_crumbs", 0, "Object"],
    Action.NewObject,
    Action.DefineLocal,
    [Action.Push, "COLOUR", "shell"],
    Action.GetVariable,
    [Action.Push, "INVENTORY_TYPE_COLOUR"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "HEAD", "shell"],
    Action.GetVariable,
    [Action.Push, "INVENTORY_TYPE_HEAD"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "FACE", "shell"],
    Action.GetVariable,
    [Action.Push, "INVENTORY_TYPE_FACE"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "NECK", "shell"],
    Action.GetVariable,
    [Action.Push, "INVENTORY_TYPE_NECK"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "BODY", "shell"],
    Action.GetVariable,
    [Action.Push, "INVENTORY_TYPE_BODY"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "HAND", "shell"],
    Action.GetVariable,
    [Action.Push, "INVENTORY_TYPE_HAND"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "FEET", "shell"],
    Action.GetVariable,
    [Action.Push, "INVENTORY_TYPE_FEET"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "FLAG", "shell"],
    Action.GetVariable,
    [Action.Push, "INVENTORY_TYPE_FLAG"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "PHOTO", "shell"],
    Action.GetVariable,
    [Action.Push, "INVENTORY_TYPE_PHOTO"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "OTHER", "shell"],
    Action.GetVariable,
    [Action.Push, "INVENTORY_TYPE_OTHER"],
    Action.GetMember,
    Action.DefineLocal,
    [Action.Push, "PAPERDOLLDEPTH_TOP_LAYER", 7500],
    Action.DefineLocal,
    [Action.Push, "PAPERDOLLDEPTH_HAND_LAYER", 7000],
    Action.DefineLocal,
    [Action.Push, "PAPERDOLLDEPTH_BETWEEN_HAND_AND_HEAD", 6500],
    Action.DefineLocal,
    [Action.Push, "PAPERDOLLDEPTH_HEAD_LAYER", 6000],
    Action.DefineLocal,
    [Action.Push, "PAPERDOLLDEPTH_BETWEEN_HEAD_AND_FACE", 5500],
    Action.DefineLocal,
    [Action.Push, "PAPERDOLLDEPTH_FACE_LAYER", 5000],
    Action.DefineLocal,
    [Action.Push, "PAPERDOLLDEPTH_BETWEEN_FACE_AND_NECK", 4500],
    Action.DefineLocal,
    [Action.Push, "PAPERDOLLDEPTH_NECK_LAYER", 4000],
    Action.DefineLocal,
    [Action.Push, "PAPERDOLLDEPTH_BETWEEN_NECK_AND_BODY", 3500],
    Action.DefineLocal,
    [Action.Push, "PAPERDOLLDEPTH_BODY_LAYER", 3000],
    Action.DefineLocal,
    [Action.Push, "PAPERDOLLDEPTH_BETWEEN_BODY_AND_FEET", 2500],
    Action.DefineLocal,
    [Action.Push, "PAPERDOLLDEPTH_FEET_LAYER", 2000],
    Action.DefineLocal,
    [Action.Push, "PAPERDOLLDEPTH_BETWEEN_FEET_AND_BACK", 1500],
    Action.DefineLocal,
    [Action.Push, "PAPERDOLLDEPTH_BACK_LAYER", 1000],
    Action.DefineLocal,
    [Action.Push, "PAPERDOLLDEPTH_BOTTOM_LAYER", 500],
    Action.DefineLocal,
    ...getPaperCrumbs(version),
    [Action.Push, "player_colours", 0, "Object"],
    Action.NewObject,
    Action.DefineLocal,
    [Action.Push, "player_colours"],
    Action.GetVariable,
    [Action.Push, 0, "0x003366"],
    Action.SetMember,
    [Action.Push, "player_colours"],
    Action.GetVariable,
    [Action.Push, 1, "0x003366"],
    Action.SetMember,
    [Action.Push, "player_colours"],
    Action.GetVariable,
    [Action.Push, 2, "0x009900"],
    Action.SetMember,
    [Action.Push, "player_colours"],
    Action.GetVariable,
    [Action.Push, 3, "0xFF3399"],
    Action.SetMember,
    [Action.Push, "player_colours"],
    Action.GetVariable,
    [Action.Push, 4, "0x333333"],
    Action.SetMember,
    [Action.Push, "player_colours"],
    Action.GetVariable,
    [Action.Push, 5, "0xCC0000"],
    Action.SetMember,
    [Action.Push, "player_colours"],
    Action.GetVariable,
    [Action.Push, 6, "0xFF6600"],
    Action.SetMember,
    [Action.Push, "player_colours"],
    Action.GetVariable,
    [Action.Push, 7, "0xFFCC00"],
    Action.SetMember,
    [Action.Push, "player_colours"],
    Action.GetVariable,
    [Action.Push, 8, "0x660099"],
    Action.SetMember,
    [Action.Push, "player_colours"],
    Action.GetVariable,
    [Action.Push, 9, "0x996600"],
    Action.SetMember,
    [Action.Push, "player_colours"],
    Action.GetVariable,
    [Action.Push, 10, "0xFF6666"],
    Action.SetMember,
    [Action.Push, "player_colours"],
    Action.GetVariable,
    [Action.Push, 11, "0x006600"],
    Action.SetMember,
    [Action.Push, "player_colours"],
    Action.GetVariable,
    [Action.Push, 12, "0x0099CC"],
    Action.SetMember,
    [Action.Push, "player_colours"],
    Action.GetVariable,
    [Action.Push, 13, "0x8AE302"],
    Action.SetMember,
    [Action.Push, "player_colours"],
    Action.GetVariable,
    [Action.Push, 14, "0x93A0A4"],
    Action.SetMember,
    [Action.Push, "player_colours"],
    Action.GetVariable,
    [Action.Push, 15, "0x02A797"],
    Action.SetMember,
    [Action.Push, "frame_hacks", 0, "Object"],
    Action.NewObject,
    Action.DefineLocal,
    ...getFrameHacks(),
    [Action.Push, "blocked_prefixes", 0, "Array"],
    Action.NewObject,
    Action.DefineLocal,
    [Action.Push, "sensei", 1, "blocked_prefixes"],
    Action.GetVariable,
    [Action.Push, "push"],
    Action.CallMethod,
    Action.Pop,
    [Action.Push, "room_", 1, "blocked_prefixes"],
    Action.GetVariable,
    [Action.Push, "push"],
    Action.CallMethod,
    Action.Pop,
    [Action.Push, "map", 1, "blocked_prefixes"],
    Action.GetVariable,
    [Action.Push, "push"],
    Action.CallMethod,
    Action.Pop,
    [Action.Push, "blocked_suffixes", 0, "Array"],
    Action.NewObject,
    Action.DefineLocal,
    [Action.Push, "blocked_overrides", 0, "Array"],
    Action.NewObject,
    Action.DefineLocal,
    [Action.Push, "room_dojo", 1, "blocked_overrides"],
    Action.GetVariable,
    [Action.Push, "push"],
    Action.CallMethod,
    Action.Pop,
    [Action.Push, "global_path", 0, "Object"],
    Action.NewObject,
    Action.DefineLocal,
    ...getGlobalPath(version),
    [Action.Push, "mascot_options", 0, "Object"],
    Action.NewObject,
    Action.DefineLocal,
    [Action.Push, "mascot_options"],
    Action.GetVariable,
    [Action.Push, "migrator_active", migrator],
    Action.SetMember,
    [Action.Push, "rockhopper", "name", "Rockhopper", "gift_id", 959, 2],
    Action.InitObject,
    Action.DefineLocal,
    [Action.Push, "auntArctic", "name", "Aunt Arctic", "gift_id", 9021, 2],
    Action.InitObject,
    Action.DefineLocal,
    [Action.Push, "cadence", "name", "Cadence", "gift_id", 9015, 2],
    Action.InitObject,
    Action.DefineLocal,
    [Action.Push, "gary", "name", "Gary", "gift_id", 9007, 2],
    Action.InitObject,
    Action.DefineLocal,
    [Action.Push, "franky", "name", "Franky", "gift_id", 996, 2],
    Action.InitObject,
    Action.DefineLocal,
    [Action.Push, "peteyK", "name", "Petey K", "gift_id", 996, 2],
    Action.InitObject,
    Action.DefineLocal,
    [Action.Push, "gBilly", "name", "G Billy", "gift_id", 996, 2],
    Action.InitObject,
    Action.DefineLocal,
    [Action.Push, "stompinBob", "name", "Stompin Bob", "gift_id", 996, 2],
    Action.InitObject,
    Action.DefineLocal,
    [Action.Push, "sensei", "name", "Sensei", "gift_id", 9036, 2],
    Action.InitObject,
    Action.DefineLocal,
    [Action.Push, "mascot_crumbs", 0, "Object"],
    Action.NewObject,
    Action.DefineLocal,
    [Action.Push, "mascot_crumbs"],
    Action.GetVariable,
    [Action.Push, 1, "rockhopper"],
    Action.GetVariable,
    Action.SetMember,
    [Action.Push, "mascot_crumbs"],
    Action.GetVariable,
    [Action.Push, 2, "auntArctic"],
    Action.GetVariable,
    Action.SetMember,
    [Action.Push, "mascot_crumbs"],
    Action.GetVariable,
    [Action.Push, 3, "cadence"],
    Action.GetVariable,
    Action.SetMember,
    [Action.Push, "mascot_crumbs"],
    Action.GetVariable,
    [Action.Push, 4, "gary"],
    Action.GetVariable,
    Action.SetMember,
    [Action.Push, "mascot_crumbs"],
    Action.GetVariable,
    [Action.Push, 5, "franky"],
    Action.GetVariable,
    Action.SetMember,
    [Action.Push, "mascot_crumbs"],
    Action.GetVariable,
    [Action.Push, 6, "peteyK"],
    Action.GetVariable,
    Action.SetMember,
    [Action.Push, "mascot_crumbs"],
    Action.GetVariable,
    [Action.Push, 7, "gBilly"],
    Action.GetVariable,
    Action.SetMember,
    [Action.Push, "mascot_crumbs"],
    Action.GetVariable,
    [Action.Push, 8, "stompinBob"],
    Action.GetVariable,
    Action.SetMember,
    [Action.Push, "mascot_crumbs"],
    Action.GetVariable,
    [Action.Push, 9, "sensei"],
    Action.GetVariable,
    Action.SetMember,
    ...getServerCrumbs(ip, loginPort, worldPort, isEngine3(version)),
    ...getGameCrumbs()
  ];

  if (hunt !== null) {
    code.push(...getScavengerHunt(hunt.global.reward, hunt.global.member));
  }

  return Buffer.from(emitSwf(createBytecode(code)));
}