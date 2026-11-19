import { iterateEntries } from "@common/utils";
import { Action, getVar, createBytecode, newObject, createJsonDeclaration, applyJsonToObject, PCodeRep, callMethod, defineLocal, defineLocalJson, wrapPCode, getMemberChain, add2, setMember } from "@common/flash/avm1";
import { emitCrumbSwf } from "@common/flash/emitter";
import { LOCAL_PATHS, makeLocalPathsComposite } from "../game-data/local-paths";
import { SAFE_MESSAGES } from "../game-data/safe-messages";
import { MASCOT_MESSAGES } from "../game-data/mascot-messages";
import { TOUR_GUIDE_MESSAGES } from "../game-data/tour-guide-messages";
import { LANG } from "../game-data/lang";
import { ERROR_LANG } from "../game-data/error-lang";
import { FURNITURE } from "../game-logic/furniture";
import { IGLOO_FLOORING, IGLOO_TYPES } from "../game-logic/iglooItems";
import serverList from "../servers";
import { GameData } from "@server/timelines/game-data";
import { StageScript } from "@server/game-data/stage-plays";
import { HuntCrumbs } from "@server/updates";
import { POSTCARD_CATALOGUE, POSTCARDS } from "@server/game-data/postcards";

function getLocalPaths(paths: Map<string, string>, useCompositePaths: boolean) {
  const code: PCodeRep = [];

  if (useCompositePaths) {
    const newPaths: Record<string, string> = {};
    paths.forEach((value, key) => {
      if (value !== undefined && value !== null) {
        newPaths[key] = value;
      }
    })
    const compositePaths = makeLocalPathsComposite({ ...LOCAL_PATHS, ...newPaths });
    iterateEntries(compositePaths, (key, value) => {
      const [base, path] = value;
      code.push(...setMember(getVar("local_paths"), key, add2(
        getVar(base),
        createJsonDeclaration(path)
      )));
    });
  } else {
    code.push(
      ...applyJsonToObject("local_paths", Object.fromEntries(
        [...Object.entries(LOCAL_PATHS), ...paths.entries()]
      ))
    );
  }

  return code;
}

function getLinkPaths(isNewShell2009: boolean) {
  const code: PCodeRep = [];
  const useAffiliateLinks = !isNewShell2009;

  const linkPaths = useAffiliateLinks ? "master_link_paths" : "link_paths";

  if (useAffiliateLinks){
    code.push(
      ...defineLocal(linkPaths, newObject()),
      // miniclip paths would go here (see Apr 2009 local crumbs)
      ...setMember(getVar("link_paths"), 0, getVar(linkPaths))
    )
  }

  code.push(
    ...applyJsonToObject(linkPaths, {
      main_web: "http://www.clubpenguin.com/",
      client_web: "http://play.clubpenguin.com/",
      cache_web: "http://support.clubpenguin.com/help/technical/clear_my_cache.htm",
      connection_web: "http://support.clubpenguin.com/help/technical/lost_connection.htm",
      cant_connect_web: "http://support.clubpenguin.com/help/technical/cant_connect_server.htm",
      support_web: "http://support.clubpenguin.com/help/",
      member_web: "http://www.clubpenguin.com/membership/",
      manage_web: "https://secure.clubpenguin.com/manage_account/login.php",
      community_web: "http://community.clubpenguin.com/",
      guide_web: "http://www.clubpenguin.com/parents/club_penguin_guide.htm",
      parents_web: "http://www.clubpenguin.com/parents/",
      create_account_web: "http://play.clubpenguin.com/create_account/",
      forgot_password_web: "http://support.clubpenguin.com/lost-password.php",
      player_safety: "http://www.clubpenguin.com/parents/player_safety.htm",
      fire_path_video_flv: "/play/card-jitsu/fire/videos/card-jitsu-fire-path.flv",
      toys_web: "http://www.clubpenguin.com/toys/",
      water_path_video_flv: "/play/card-jitsu/water/videos/card-jitsu-water-trailer.flv"
    })
  );

  return code;
}

function getStageScript(script: StageScript) {
  return defineLocalJson('script_messages', script);
}

function getHuntCrumbs(hunt: HuntCrumbs | null) {
  const code: PCodeRep = [];

  if (hunt !== null) {
    const lang = hunt.lang.en;
    code.push(
      ...applyJsonToObject("lang", {
        scavenger_hunt: lang.loading,
        title: lang.title,
        start_string: lang.start,
        scavenger_items_found: lang.itemsFound,
        scavenger_items_found_plural: lang.itemsFoundPlural,
        claim_prize: lang.claim,
        continue: lang.continue,
        clue0: lang.clues[0],
        clue1: lang.clues[1],
        clue2: lang.clues[2],
        clue3: lang.clues[3],
        clue4: lang.clues[4],
        clue5: lang.clues[5],
        clue6: lang.clues[6],
        clue7: lang.clues[7],
      })
    );
  }

  return code;
}

function getLang(d: GameData): PCodeRep {
  return applyJsonToObject("lang", {
    ...LANG,
    ...Object.fromEntries(d.getLangStrings().entries())
  });
}

function getFurnitureCrumbs() {
  return applyJsonToObject("furniture_crumbs", Object.fromEntries(FURNITURE.rows.map(row => {
    return [row.id, { name: row.name }]
  })));
}

function getFloorCrumbs() {
  return applyJsonToObject("floor_crumbs", Object.fromEntries(IGLOO_FLOORING.rows.map(row => {
    return [row.id, { name: row.name }]
  })));
}

function getPaperCrumbs(d: GameData) {
  return applyJsonToObject("paper_crumbs", Object.fromEntries(d.getItems().map(row => {
    return [row.id, { name: row.name }]
  })));
}

function getIglooCrumbs() {
  return applyJsonToObject("igloo_crumbs", Object.fromEntries(IGLOO_TYPES.rows.map(row => {
    return [row.id, { name: row.name }]
  })));
}

function getServerCrumbs() {
  return applyJsonToObject("servers", Object.fromEntries(serverList.map(server => {
    return [server.id, { name: server.name }]
  })))
}

function getLangError(): PCodeRep {
  const code: PCodeRep = [];

  iterateEntries(ERROR_LANG, (key, lang) => {
    code.push(
      ...getVar("error_lang"),
      ...getMemberChain("shell", key),
      [Action.Push, lang],
      Action.SetMember
    );
  });

  return code;
}

const getPostcardCrumbs = (): PCodeRep => {
  const catalogue = new Set(POSTCARD_CATALOGUE);
  const toUse = POSTCARDS.filter(p => catalogue.has(p.id));
  return [
    new Array(8).fill(0).flatMap((_, index) => {
      const category = index + 1;
      const postcards = toUse.filter(p => p.category === category);
      const varName = `category_0${category}`;
      return [
        ...defineLocal(varName, newObject()),
        ...applyJsonToObject(varName, Object.fromEntries(postcards.map(postcard => {
          return [postcard.id, { subject: postcard.subject, in_catalog: true }]
        })))
      ];
    }),
    defineLocal('pc_crumbs', newObject()),
    applyJsonToObject('pc_crumbs', {
      'EPF': wrapPCode(getVar('category_01')),
      'Featured Postcards': wrapPCode(getVar('category_02')),
      'Friendship': wrapPCode(getVar('category_03')),
      'Puffles': wrapPCode(getVar('category_04')),
      'Party': wrapPCode(getVar('category_05')),
      'Games': wrapPCode(getVar('category_06')),
      'Rooms': wrapPCode(getVar('category_07')),
      'From us': wrapPCode(getVar('category_08')),
    })
  ].flat();
}

export function getLocalCrumbsSwf(d: GameData): Buffer {
  // hardcoded hex dump of the function's bytecode
  const treverseMessages = [
    0x8e, 0x1e, 0x00, 0x74, 0x72, 0x65, 0x76, 0x65, 
    0x72, 0x73, 0x65, 0x4d, 0x65, 0x73, 0x73, 0x61, 
    0x67, 0x65, 0x73, 0x00, 0x01, 0x00, 0x04, 0x2a, 
    0x00, 0x01, 0x6e, 0x6f, 0x64, 0x65, 0x00, 0xbf, 
    0x00, 0x96, 0x02, 0x00, 0x04, 0x01, 0x55, 0x87, 
    0x01, 0x00, 0x00, 0x96, 0x01, 0x00, 0x02, 0x49, 
    0x9d, 0x02, 0x00, 0xab, 0x00, 0x96, 0x02, 0x00, 
    0x04, 0x00, 0x87, 0x01, 0x00, 0x03, 0x17, 0x96, 
    0x04, 0x00, 0x04, 0x01, 0x04, 0x03, 0x4e, 0x96, 
    0x04, 0x00, 0x00, 0x69, 0x64, 0x00, 0x4e, 0x87, 
    0x01, 0x00, 0x02, 0x17, 0x96, 0x1d, 0x00, 0x00, 
    0x74, 0x72, 0x65, 0x76, 0x65, 0x72, 0x65, 0x73, 
    0x65, 0x64, 0x5f, 0x73, 0x61, 0x66, 0x65, 0x5f, 
    0x6d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x5f, 
    0x6f, 0x62, 0x6a, 0x00, 0x1c, 0x96, 0x06, 0x00, 
    0x04, 0x02, 0x04, 0x01, 0x04, 0x03, 0x4e, 0x4f, 
    0x96, 0x04, 0x00, 0x04, 0x01, 0x04, 0x03, 0x4e, 
    0x96, 0x06, 0x00, 0x00, 0x6d, 0x65, 0x6e, 0x75, 
    0x00, 0x4e, 0x96, 0x08, 0x00, 0x00, 0x6c, 0x65, 
    0x6e, 0x67, 0x74, 0x68, 0x00, 0x4e, 0x96, 0x05, 
    0x00, 0x07, 0x00, 0x00, 0x00, 0x00, 0x67, 0x12, 
    0x9d, 0x02, 0x00, 0x2e, 0x00, 0x96, 0x04, 0x00, 
    0x04, 0x01, 0x04, 0x03, 0x4e, 0x96, 0x06, 0x00, 
    0x00, 0x6d, 0x65, 0x6e, 0x75, 0x00, 0x4e, 0x96, 
    0x17, 0x00, 0x07, 0x01, 0x00, 0x00, 0x00, 0x00, 
    0x74, 0x72, 0x65, 0x76, 0x65, 0x72, 0x73, 0x65, 
    0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x73, 
    0x00, 0x3d, 0x17, 0x99, 0x02, 0x00, 0x47, 0xff
  ];

  const code: PCodeRep = [
    ...defineLocal("shell", callMethod(getVar("_global"), "getCurrentShell", false)),
    ...defineLocal("root_path", callMethod(getVar("shell"), "getRootPath", false)),
    ...defineLocal("language_folder", callMethod(getVar("shell"), "getLocalizedFolder", false)),
    ...defineLocal("local_content", add2(
      getVar("root_path"),
      createJsonDeclaration("content/local/"),
      getVar("language_folder")
    )),

    ...defineLocal("website_content", getVar("root_path")),

    ...defineLocalJson("blocked_prefixes", []),
    ...defineLocalJson("blocked_suffixes", []),
    ...defineLocalJson("blocked_overrides", []),

    ...[
      "sensei", "room_", "map", "login", "igloo",
      "select", "archive", "current_news", "old_news", "mission",
      "card", "ninja", "cart", "sled", "waves",
      "firesensi", "fire", "hyrdo", "pizzatron", "dancing",
      "library", "fish", "beans", "jetpack", "thinice",
      "mixmaster", "aqua", "roundup", "astro"
    ].flatMap(v => callMethod(getVar("blocked_prefixes"), "push", true, createJsonDeclaration(v))),
    ...callMethod(getVar("blocked_suffixes"), "push", true, createJsonDeclaration("_catalogue")),
    
    ...defineLocal("local_paths", newObject()),
    ...getLocalPaths(d.getLocalPaths(), d.useCompositePaths()),
  
    ...defineLocal("link_paths", newObject()),
    ...getLinkPaths(d.isNewShell2009()),

    ...defineLocal("lang", newObject()),
    ...defineLocal("error_lang", newObject()),
    ...getLangError(),
    ...getLang(d),

    ...defineLocal("quick_messages", newObject("Array",
      ...["Ok", "No", "Yes", "Bye", "Hello"].map(createJsonDeclaration)
    )),

    ...defineLocalJson("safe_messages", SAFE_MESSAGES),

    ...defineLocal("treveresed_safe_message_obj", newObject()),
    ...callMethod(null, "treverseMessages", true, getVar("safe_messages")),

    ...defineLocalJson("bandScript1", {
      category: "Band Script 1",
      categoryActive: false,
      sharedScript: true,
      script:[
        {name:"G Billy",message:"Good work guys.  We really rocked out there!"},
        {name:"Petey K",message:"That gig was unbelievable.  And I was brilliant!"},
        {name:"Franky",message:"It was awesome.  The crowd was really getting into it!"},
        {name:"Stompin Bob",message:"Yeah, I could feel the rhythm in my flippers."},
        {name:"Franky",message:"What are you going to do now?"},
        {name:"Stompin Bob",message:"Probably just chillax for a while."},
        {name:"Petey K",message:"It\'s been an emotional day."},
        {name:"Franky",message:"I need to spend a bit of time with my guitar."},
        {name:"G Billy",message:"I\'m going to start planning our next recording session."}
      ]
    }),

    ...defineLocalJson("mascot_messages", MASCOT_MESSAGES),
    ...defineLocalJson("tour_guide_messages", TOUR_GUIDE_MESSAGES),

    ...defineLocal("jokes", newObject("Array",
      ...[
        "What do you call a fish with no eyes?|FSH",
        "Why do penguins eat fish?|Because donuts get soggy before they can catch them",
        "What lies at the bottom of the sea and shakes?|A nervous wreck!",
        "Why is it so easy to weigh fish?|They have their own scales",
        "What do Penguins sing on a birthday?|Freeze a jolly good fellow",
        "How do you communicate with a fish?|You drop him a line",
        "What is a penguin's favourite party game?|Sardines",
        "Why are igloos round?|So that penguins can't hide in the corners",
        "How does a penguin build its house?|Igloos it together",
        "Why are penguins so popular on the Internet?|Because they have Web feet!",
        "What do you call a penguin in the desert?|Lost",
        "Why don´t you see Penguins in Britain?|Because they´re afraid of Wales",
        "What´s black and white and goes round and round?|A penguin in a revolving door",
        "What bird can write underwater?|A ball point PENguin!",
        "What's the best way to catch a fish?|Have someone throw it at you"
      ].map(createJsonDeclaration)
    )),
    
    ...defineLocal("furniture_crumbs", newObject()),
    ...getFurnitureCrumbs(),
    
    ...defineLocal("floor_crumbs", newObject()),
    ...getFloorCrumbs(),

    ...defineLocal("paper_crumbs", newObject()),
    ...getPaperCrumbs(d),

    ...defineLocal("igloo_crumbs", newObject()),
    ...getIglooCrumbs(),

    ...defineLocal("puffle_crumbs", newObject()),
    ...applyJsonToObject("puffle_crumbs", {
      0: { name: "Blue" },
      1: { name: "Pink" },
      2: { name: "Black" },
      3: { name: "Green" },
      4: { name: "Purple" },
      5: { name: "Red" },
      6: { name: "Yellow" },
      7: { name: "White" },
      8: { name: "Orange" },
    }),

    ...getPostcardCrumbs(),

    ...defineLocal("hunt_crumbs", newObject("Array")),
    ...applyJsonToObject("hunt_crumbs", {
      0: {name:"cave",is_found:false,is_required:true},
      1: {name:"cove",is_found:false,is_required:true},
      2: {name:"dock",is_found:false,is_required:true},
      3: {name:"forts",is_found:false,is_required:true},
      4: {name:"berg",is_found:false,is_required:true},
      5: {name:"plaza",is_found:false,is_required:true},
      6: {name:"beach",is_found:false,is_required:true},
      7: {name:"forest",is_found:false,is_required:true}
    }),

    ...defineLocal("achievement_crumbs", newObject()),
    ...applyJsonToObject("achievement_crumbs", {
      0: [{id:0,active:false,name:"start_panel"},{id:1,active:false,name:"light_01"}],
      1: [{id:0,active:false,name:"light_01"},{id:1,active:false,name:"light_02"},{id:2,active:false,name:"light_03"}],
      2: [{id:0,active:false,name:"light_01"},{id:1,active:false,name:"light_02"},{id:2,active:false,name:"light_03"},{id:3,active:false,name:"light_04"}],
      3: [{id:0,active:false,name:"light_01"},{id:1,active:false,name:"light_02"}],
      4: [{id:0,active:false,name:"light_01"},{id:1,active:false,name:"light_02"},{id:2,active:false,name:"light_03"},{id:3,active:false,name:"light_04"},{id:4,active:false,name:"light_05"}],
      5: [{id:0,active:false,name:"light_01"},{id:1,active:false,name:"light_02"}],
      6: [{id:0,active:false,name:"light_01"},{id:1,active:false,name:"light_02"},{id:2,active:false,name:"light_03"}],
      7: [{id:0,active:false,name:"light_01"},{id:1,active:false,name:"light_02"},{id:2,active:false,name:"light_03"},{id:3,active:false,name:"light_04"},{id:4,active:false,name:"finish"}],
      8: [{id:0,active:false,name:"pad_01"},{id:1,active:false,name:"pad_02"},{id:2,active:false,name:"pad_03"},{id:3,active:false,name:"pad_04"}],
      9: [{id:0,active:false,name:"pad_01"},{id:1,active:false,name:"pad_02"},{id:2,active:false,name:"pad_03"},{id:3,active:false,name:"pad_04"}],
      10: [{id:0,active:false,name:"pad_01"},{id:1,active:false,name:"pad_02"},{id:2,active:false,name:"pad_03"},{id:3,active:false,name:"pad_04"}],
      11: [{id:0,active:false,name:"laps"}]
    }),

    ...defineLocal("servers", newObject()),
    ...getServerCrumbs(),

    ...getStageScript(d.getStageScript()),
    ...getHuntCrumbs(d.getHunt())
  ];

  const bytecode = [...treverseMessages, ...createBytecode(code)];

  return Buffer.from(emitCrumbSwf(new Uint8Array(bytecode)));
}