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