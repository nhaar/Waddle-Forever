const winName = (n: string) => {
  return `cardjitsu_snow${n}.swf`;
}

export const Windows = {
  CLOSE: winName('close'),
  COMBOS: winName('combos'),
  ERRORS: winName('errorhandler'),
  EI_CONNECTOR: winName('externalinterfaceconnector'),
  INFOTIP: winName('infotip'),
  PAYOUT: winName('payout'),
  PLAYER_SELECT: winName('playerselect'),
  REVIVE: winName('revive'),
  ROUNDS: winName('rounds'),
  TIMER: winName('timer'),
  UI: winName('ui'),
  STAMPS: 'stampearned.swf'
} as const;

export const SnowRewards: Readonly<Record<number, number | null>> = {
  0: null,
  1: null,  // Movie 1
  2: 6163,  // Glacial Sandals
  3: null,  // Movie 2
  4: null,  // Movie 3
  5: 4834,  // Coat of Frost
  6: null,  // Movie 4
  7: null,  // Movie 5
  8: 2119,  // Icy Mask
  9: null,  // Movie 6
  10: null, // Movie 7
  11: 1581, // Blizzard Helmet
  12: null, // Movie 8
  13: null, // Snow Gem (not awarded within the snow server)
  14: 1582, // Black Ice Headband
  15: 4835, // Frozen Armor
  16: 5223, // Ice Cap Cuffs
  17: 4836, // Black Ice Training Plates
  18: 1583, // The Flurry
  19: 6164, // Cold Snap Sandals
  20: 4837, // Snowstorm Gi
  21: 5224, // Storm Cloud Bracers,
  22: 5225, // Snow Shuriken
  23: 5226, // Fire Nunchaku
  24: 5227  // Water Hammer
};

export const ExpRequirements: Readonly<Record<number, number>> = {
  0: 600,
  1: 600,
  2: 600,
  3: 1130,
  4: 1130,
  5: 1130,
  6: 1500,
  7: 1500,
  8: 2000,
  9: 2000,
  10: 2000,
  11: 3000,
  12: 3000,
  13: 3000,
  14: 3000,
  15: 3000,
  16: 3000,
  17: 3000,
  18: 3000,
  19: 3000,
  20: 3000,
  21: 3000,
  22: 3000,
  23: 3000,
  24: 3000
};

export const Stamps: Readonly<Array<number>> = [
  467,
  468,
  469,
  470,
  471,
  472,
  473,
  474,
  475,
  476,
  477,
  478,
  479,
  480,
  481,
  482,
  483,
  484,
  485,
  486,
  487
];

export enum InputType {
  UP = 1,
  DOWN = 2,
  MOUSE_CLICK = 3,
  MOUSE_BOX = 4,
  MOUSE_DOUBLE_CLICK = 5,
  MOUSE_UP = 6
};

export enum InputModifier {
  NONE = 0,
  SHIFT = 1,
  CTRL = 2,
  ALT = 3
};

export enum InputTarget {
  TILE = 1,
  GOB = 2
};

export enum ServerType {
  LIVE = 0,
  DEV = 1
};

export enum BuildType {
  DEBUG = 0,
  RELEASE = 1,
  PROFILE = 2,
  MEMORY = 3
};

export enum TipPhase {
  MOVE = "Move",
  ATTACK = "Attack",
  CARD = "Card",
  HEAL = "Heal",
  CONFIRM = "Confirm",
  MEMBER_CARD = "MemberCard"
};

export enum MirrorMode {
  NONE = 0,
  X = 1,
  Y = 2,
  XY = 3
};

export enum OriginMode {
  NONE = 0,
  CENTER = 1,
  BOTTOM_MIDDLE = 2,
  TOP_LEFT = 3
};

export enum ViewMode {
  OVERHEAD = 0,
  OVERHEAD_ROTATED = 1,
  ISO_STEPPED = 2,
  ISO_SLOPED = 3,
  ISO = 4,
  SIDE = 5,
  VIEW_3D = 6,
  FREE = 7
};

export enum MapblockType {
  HEIGHTMAP = "h",
  TILEMAP = "t",
  MAP = "ht"
};

export enum ScaleMode {
  WIDTH = "scale_width",
  HEIGHT = "scale_height",
  BOTH = "scale_both",
  NONE = "scale_none",
};

export enum AlignMode {
  TOP_LEFT = "top_left",
  TOP = "top",
  TOP_RIGHT = "top_right",
  RIGHT = "right",
  BOTTOM_RIGHT = "bottom_right",
  BOTTOM = "bottom",
  BOTTOM_LEFT = "bottom_left",
  LEFT = "left",
  CENTER = "center"
};

export enum MessageType {
  CONFIGURE_CALLBACK               = "configureCallBack",
  RECEIVED_JSON                    = "receivedJson",
  CONFIGURE_TRACK_OBJECT_INFO      = "configureTrackObjectInfo",
  CONFIGURE_STOP_TRACK_OBJECT_INFO = "configureStopTrackObjectInfo",
  SEND_STRING                      = "sendString",
  USING_FULL_SCREEN_CHANGED        = "usingFullScreenChanged",
  SCREEN_SIZE                      = "screenSize"
};

export enum WindowAction {
  ADD_LAYER = "addLayer",
  LOAD_WINDOW = "loadWindow",
  LOAD_GAME = "loadGame",
  LOAD_FONT = "loadFont",
  CLOSE_WINDOW = "closeWindow",
  MOVE_WINDOW = "moveWindow",
  LINK_WINDOW_CACHE = "linkWindowCache",
  SHOW_TOOLTIP = "showTooltip",
  HIDE_TOOLTIP = "hideTooltip",
  SKIN_TOOLTIP = "skinTooltip",
  SKIN_PROGRESS_BAR = "skinProgressBar",
  SKIN_ROOM_TO_ROOM = "skinRoomToRoom",
  MOUSE_POSITION = "mousePosition",
  SUPPRESS_LOG_ALERTS = "suppressLogAlerts",
  JSON_PAYLOAD = "jsonPayload",
  JSON_PAYLOAD_UNFINISHED_ACTION = "jsonPayloadUnfinishedAction",
  DISPLAY_COINS_AWARDED = "displayCoinsAwarded",
  START_MULTIGAME = "startMultigame",
  PLAYER_EXITED = "playerExited",
  UPDATE_PLAYER_VO = "updatePlayerVO",
  SHOW_LAYER = "showLayer",
  HIDE_LAYER = "hideLayer",
  SHOW_WINDOW = "showWindow",
  HIDE_WINDOW = "hideWindow",
  SHOW_EDGE_BLOCKER = "showEdgeBlocker",
  HIDE_EDGE_BLOCKER = "hideEdgeBlocker",
  ATTACH_METAPLACE_OBJECT = "attachMetaplaceObject",
  DETACH_METAPLACE_OBJECT = "detachMetaplaceObject",
  SET_FONT_PATH = "setFontPath",
  SET_WORLD_ID = "setWorldId",
  SET_BASE_ASSET_URL = "setBaseAssetUrl",
  SET_CURSOR = "setCursor",
  SET_PSEUDOLOCALIZE = "setPseudolocalize",
  CHANGE_LANGUAGE = "changeLanguage",
  PUSH_LOCALIZATION_DATA_TO_MP = "pushLocalizationDataToMP",
  PUSH_DEVON_DATA_TO_MP = "pushDevonDataToMp",
  INITIALIZE_BUSINESS_INTELLIGENCE = "initializeBusinessIntelligence"
};

export enum EventType {
  PLAY_ACTION  = "playAction",
  IMMEDIATE    = "immediateAction",
  SIMULTANEOUS = "playSimultaneousActions",
  CLEAR        = "clearActionQueue"
};