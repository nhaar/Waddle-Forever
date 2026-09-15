import { GameData } from "@server/timelines/game-data";
import { WorldGame } from "../world-game";
import { WorldPenguin } from "../world-penguin";
import { MATCHMAKERS } from "@server/game-data/games";
import { ClientSocket } from "../../socket-server";
import { PenguinMessenger } from "../../messenger";
import { SnowContext } from "../../snow-data-handler";
import { BuildType, EventType, MessageType, ServerType, ViewMode, WindowAction } from "./snow-constants";
import { GameObject } from "./snow-game-objects";

export interface Asset {
  index: number;
  name: string;
}

type AssetCollection = Set<Asset>;
type ObjectCollection = Set<GameObject>;

export class SnowPlayer {
  penguin: WorldPenguin | null = null;
  pid: number = -1;

  battleMode: number = 0;
  screenSize: string = '';
  baseUrl: string = '';
  place: Place | null = null;
  game: null = null; // TODO: see if this can be gotten in ctx, rn it's too early to say if it can

  loggedIn: boolean = false;
  isReady: boolean = false;

  windowManager: WindowManager = new WindowManager();
  localObjects: ObjectCollection = new Set();

  public get assetBaseUrl() {
    return this.baseUrl + 'minigames/cjsnow/en_US/deploy/swf/ui/assets';
  }

  public get windowBaseUrl() {
    return this.baseUrl + 'minigames/cjsnow/en_US/deploy/swf/ui/windows';
  }

  public get windowManagerLocation() {
    return this.baseUrl + 'minigames/cjsnow/en_US/deploy/swf/windowManager/windowmanager.swf';
  }

  public get inGame() {
    // returns true if we are in a game
    return false;
  }

  public async sendLoginMessage({ msg }: SnowContext, message: string) {
    await msg.sendSnowData(this, 'S_LOGINDEBUG', message);
  }

  public async sendLoginError({ msg }: SnowContext, code: number = 900) {
    await this.sendLoginMessage({ msg } as SnowContext, `user code ${code}`);
  }

  public async sendLoginReply({ msg }: SnowContext) {
    await msg.sendSnowData(this, 'S_LOGIN', this.penguin.id);
  }

  public async setPlace({ msg, world }: SnowContext, name: string, objectId: number = 0, instanceId: number = 0) {
    this.place = world.places[name];
    await msg.sendSnowData(this, 'W_PLACE', this.place.id, objectId, instanceId);
  }
  
  public async switchPlace(ctx: SnowContext, place: Place) {
    await this.setPlace(ctx, place.name);
    
    // TODO use Promise.all() instead
    for (const { index } of place.assets.values()) {
      await ctx.msg.sendSnowData(ctx.client, 'S_LOADSPRITE', `0:${index}`);
    }
    for (const { index } of place.soundAssets.values()) {
      await ctx.msg.sendSnowData(ctx.client, 'S_LOADSPRITE', `0:${index}`);
    }

    await ctx.msg.sendSnowData(ctx.client, 'W_ASSETSCOMPLETE', this.pid);
  }

  public getWindow(ctx: SnowContext, name: string | null = null, url: string | null = null) {
    return this.windowManager.getWindow(ctx, name, url);
  }

  public async sendToRoom(ctx: SnowContext) {
    const win = this.getWindow(ctx, 'cardjitsu_snowexternalinterfaceconnector.swf');
    win.layer = 'toolLayer';
    await win.load(ctx, null, { type: EventType.IMMEDIATE });
  }
}

// TODO: see if most of these can just be objects instead

class MapBlocks {
  tileMap: string;
  heightMap: string;
}

class Render {
  alphaCutoff: number = 48;
  occludeTiles: boolean = false;
}

class Camera {
  position: [number, number, number] = [0, 0, 0];
  viewMode: ViewMode = ViewMode.SIDE;
  tileSize: number = 64;
  elevationScale: number = -1;
  terrainLighting: boolean = true;

  lockView: boolean = false;
  lockZoom: boolean = false;
  lockScroll: boolean = true;

  zoom: number = 1;
  zoomLock: [number, number] = [-1, -1];

  moveRadius: number = 0;
  moveRate: number = 0;
  moveRecenter: number = 0;

  heightMapDivisions: number = 1;
  heightMapScale: number = 0.5;

  marginTopLeftX: number = 0;
  marginTopLeftY: number = 0;
  marginBottomRightX: number = 0;
  marginBottomRightY: number = 0;
}

class Camera3D {
  near: number = 0;
  far: number = 0;
  position: [number, number, number] = [0, 0, 0];
  angle: [number, number, number] = [0, 0, 0];
  cameraView: number = 0;
  left: number = 0;
  right: number = 0;
  top: number = 0;
  bottom: number = 0;
  aspect: number = 0;
  vFov: number = 0;
  focalLength: number = 864397819904;
  unknown: number = 0;
  cameraWidth: number = 1024;
  cameraHeight: number = 768;
}

class Physics {
  gravity: boolean = false;
  collision: boolean = false;
  friction: boolean = false;
  tileFriction: boolean = false;
  safetyNet: boolean = false;
  netHeight: number = 0;
  netFriction: boolean = false;
  netBounce: boolean = true;
}

class Place {
  id: number = 0;
  name: string = "";
  mapBlocks: MapBlocks = new MapBlocks();
  render: Render = new Render();
  camera: Camera = new Camera();
  camera3d: Camera3D = new Camera3D();
  physics: Physics = new Physics();
  assets: AssetCollection = new Set();
  soundAssets: AssetCollection = new Set();
  draggable: boolean = false;
  objectLock: boolean = false;
}

class SnowMapBlocks extends MapBlocks {
  tileMap = "iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAADklEQVQImWNghgEGIlkADWEAiDEh28IAAAAASUVORK5CYII";
  heightMap = "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAAAAADfm1AaAAAADklEQVQImWOohwMG8pgA1rMdxRJRFewAAAAASUVORK5CYII";
}

class SnowCamera extends Camera {
  position: [number, number, number] = [4.5, 2.5, 0];
  lockZoom = true;
  lockView = true;
  zoom = 1.0;
  tileSize = 100;
  elevationScale = 0.031250;
}

class SnowLobby extends Place {
  id = 0;
  name = "snow_lobby";
  mapBlocks = new SnowMapBlocks();
  camera = new SnowCamera();
}

class SnowBattle extends Place {
  id = 10001;
  name = "snow_battle";
}

class TuskBattle extends Place {
  id = 10004;
  name = "tusk_battle";
}

class SWFWindow {

  loaded: Boolean = false;
  onLoad: ((ctx: SnowContext) => void) | null = null;
  onClose: ((ctx: SnowContext) => void) | null = null;

  constructor(
    ctx: SnowContext,
    public url: string | null = null,
    private name: string | null = null,
    public layer: string = 'topLayer'
  ) {
    if (this.name === null) {
      if (this.url !== null) {
        this.name = this.url.split('/').pop();
      }
    } else if (this.url === null) {
      this.url = `${ctx.penguin.windowBaseUrl}/${this.name}`;
    }

    if (this.url === null && this.name === null) {
      throw new Error('You must provide either a url or a name for the window.');
    }

    this.loaded = false
  }

  public async send(ctx: SnowContext, content: Record<string, any>, msgType: MessageType = MessageType.RECEIVED_JSON) {
    await ctx.msg.sendSnowData(ctx.client, 'UI_CLIENTEVENT', ctx.world.worldId, msgType, JSON.stringify(content));
  }

  public async load(ctx: SnowContext, initPayload: Record<string, any> | null = null, kwargs: Record<string, any> = {}) {
    // TODO apply window manager offset, which is optional, dunno what its for
    await this.send(ctx, {
      windowUrl: this.url,
      layerName: this.layer,
      assetPath: '', // this is a TODO in snowflake
      initializationPayload: initPayload,
      action: WindowAction.LOAD_WINDOW,
      type: EventType.PLAY_ACTION,
      ...kwargs
    });
  }

  public async close(ctx: SnowContext, kwargs: Record<string, any> = {}) {
    await this.send(ctx, {
      targetWindow: this.url,
      action: WindowAction.CLOSE_WINDOW,
      type: EventType.PLAY_ACTION,
      ...kwargs
    });
  }

  public async sendPayload(
    ctx: SnowContext,
    triggerName: string,
    payload: Record<string, any> = {},
    kwargs: Record<string, any> = {},
    type: EventType = EventType.IMMEDIATE
  ) {
    await this.send(ctx, {
      jsonPayload: payload,
      targetWindow: this.url,
      triggerName,
      action: WindowAction.JSON_PAYLOAD,
      type,
      ...kwargs
    });
  }

  public async sendAction(
    ctx: SnowContext,
    action: string,
    kwargs: Record<string, any> = {},
    type: EventType = EventType.IMMEDIATE
  ) {
    await this.send(ctx, {
      action,
      type,
      ...kwargs
    });
  }

}

class WindowManager {

  private _map: Record<string, SWFWindow> = {};
  loaded: boolean = false;
  ready: boolean = false;

  public getWindow(ctx: SnowContext, name: string | null = null, url: string | null = null): SWFWindow {
    if (name === null && url === null) {
      throw new Error('getWindow must have either a name or a url provided');
    }

    if (this._map[name]) {
      return this._map[name];
    }

    if (url !== null) {
      //url = url.split('/').pop();
      // this doesn't seem correct, but it is snowflake's logic
      // we'll see if this causes problems later
      if (this._map[url.split('/').pop()]) {
        return this._map[url];
      }
    }

    this._map[name] = new SWFWindow(ctx, url, name);

    return this._map[name];
  }

  public async load(ctx: SnowContext) {
    await ctx.msg.sendSnowData(
      ctx.client,
      'UI_CROSSWORLDSWFREF',
      ctx.world.worldId, // element id
      0, // parent id
      'WindowManagerSwf', // element name
      0, // swf x
      0, // swf y
      0, // swf width
      0, // swf height
      0, // unknown
      ctx.penguin.windowManagerLocation,
      '/framework' // command prefix
    );

    this.loaded = true;

    this._map['windowmanager.swf'] = new SWFWindow(ctx, ctx.penguin.windowManagerLocation, 'windowmanager.swf');
  }

}

export class SnowWorld {
  private penguins = new Map<number, SnowPlayer>();

  worldId: number = 101;
  worldName: string = 'cjsnow_0';
  worldOwner: string = 'crowdcontrol';
  stylesheetId: string = '87.5309';
  serverType: ServerType = ServerType.LIVE;
  buildType: BuildType = BuildType.RELEASE;

  places: Record<string, Place> = {};

  soundAssets: AssetCollection = new Set();
  assets: AssetCollection = new Set();

  constructor() {
    this.init();

    this.registerPlace(new SnowLobby());
    this.registerPlace(new SnowBattle());
    this.registerPlace(new TuskBattle());
  }

  private registerPlace(place: Place) {
    this.places[place.name] = place;
  }

  public addPenguin(p: SnowPlayer): void {
    this.penguins.set(p.pid, p);
  }

  public getPenguin(id: number): SnowPlayer | undefined {
    return this.penguins.get(id);
  }

  public disconnect(penguin: WorldPenguin) {
    this.penguins.delete(penguin.id);
  }

  public init() {

  }

  public getById(id: number) {
    return this.penguins.get(id);
  }

  public get players() {
    return [...this.penguins.values()];
  }
}
