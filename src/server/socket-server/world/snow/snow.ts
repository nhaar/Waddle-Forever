import { GameData } from "@server/timelines/game-data";
import { WorldGame } from "../world-game";
import { WorldPenguin } from "../world-penguin";
import { MATCHMAKERS } from "@server/game-data/games";
import { ClientSocket } from "../../socket-server";
import { PenguinMessenger } from "../../messenger";
import { SnowContext } from "../../snow-data-handler";
import { BuildType, EventType, MessageType, ServerType, ViewMode, WindowAction } from "./snow-constants";
import { Enemy, FireNinja, GameObject, Ninja, Scrap, Sly, SnowNinja, Sound, Tank, WaterNinja } from "./snow-game-objects";
import { MatchMaker } from "../matchmaker";
import { capitalize, choose, chooseN, EventListener, randomInt, shuffle } from "@common/utils";

export interface Asset {
  index: number;
  name: string;
}

class AssetCollection extends Set<Asset> {

  getByIndex(index: number) {
    return Array.from(this).find(a => a.index === index);
  }

  getByName(name: string) {
    return Array.from(this).find(a => a.name === name);
  }

}

class ObjectCollection extends Set<GameObject> {

  constructor(private offset: number = 0) {
    super();
  }

  add(obj: GameObject) {
    obj.id = this.getId();
    return super.add(obj);
  }

  getById(id: number): GameObject | null {
    return Array.from(this).find(a => a.id === id) ?? null;
  }

  getByName(name: string): GameObject | null {
    return Array.from(this).find(a => a.name === name) ?? null;
  }

  getAllByName(name: string): GameObject[] {
    return Array.from(this).filter(a => a.name === name);
  }

  private getId(): number {
    const ids = Array.from(this, obj => obj.id);
    const maxId = Math.max(...(ids.length > 0 ? ids : [this.offset]));

    return maxId + 1;
  }

}

export class SnowPlayer {
  penguin: WorldPenguin | null = null;
  ninja: Ninja | null = null; // TODO: can this be accessed in ctx instead?
  pid: number = -1;
  loggedIn: boolean = false;
  isReady: boolean = false;
  disconnected: boolean = false;
  wasKO = false;

  battleMode: number = 0;
  screenSize: string = '';
  baseUrl: string = '';
  place: Place | null = null;
  game: null = null; // TODO: see if this can be gotten in ctx, rn it's too early to say if it can

  element: string = '';
  tipMode: boolean = false;

  windowManager: WindowManager = new WindowManager();
  localObjects: ObjectCollection = new ObjectCollection();

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
    // TODO: returns true if we are in a game
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
      await ctx.msg.sendSnowData(ctx.penguin, 'S_LOADSPRITE', `0:${index}`);
    }
    for (const { index } of place.soundAssets.values()) {
      await ctx.msg.sendSnowData(ctx.penguin, 'S_LOADSPRITE', `0:${index}`);
    }

    await ctx.msg.sendSnowData(ctx.penguin, 'W_ASSETSCOMPLETE', this.pid);
  }

  public getWindow(game: SnowGame, name: string | null = null, url: string | null = null) {
    return this.windowManager.getWindow(game, this, name, url);
  }

  public async sendToRoom(ctx: SnowContext) {
    const win = this.getWindow(ctx.game, 'cardjitsu_snowexternalinterfaceconnector.swf');
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
  assets: AssetCollection = new AssetCollection();
  soundAssets: AssetCollection = new AssetCollection();
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
  zoom = 1;
  tileSize = 100;
  elevationScale = 0.031250;
}

class SnowLobby extends Place {
  id = 0;
  name = "snow_lobby";
  mapBlocks = new SnowMapBlocks();
  camera = new SnowCamera();
}

class SnowBattle extends SnowLobby {
  id = 10001;
  name = "snow_battle";
}

class TuskBattle extends SnowLobby {
  id = 10004;
  name = "tusk_battle";
}

class SWFWindow {

  private _loaded: boolean = false;
  onLoad: ((ctx: SnowContext) => void) | null = null;
  onClose: ((ctx: SnowContext) => void) | null = null;

  constructor(
    game: SnowGame,
    player: SnowPlayer,
    public url: string | null = null,
    private name: string | null = null,
    public layer: string = 'topLayer'
  ) {
    if (this.name === null) {
      if (this.url !== null) {
        this.name = this.url.split('/').pop();
      }
    } else if (this.url === null) {
      this.url = `${player.windowBaseUrl}/${this.name}`;
    }

    if (this.url === null && this.name === null) {
      throw new Error('You must provide either a url or a name for the window.');
    }

    this.setLoaded(false, game);
  }

  public get loaded() {
    return this._loaded;
  }

  public setLoaded(v: boolean, game: SnowGame) {
    this._loaded = v;
    if (game !== null) game.windowEvents.fire(this.name, v);
  }

  public async send(ctx: SnowContext, content: Record<string, any>, msgType: MessageType = MessageType.RECEIVED_JSON) {
    await ctx.msg.sendSnowData(ctx.penguin, 'UI_CLIENTEVENT', ctx.world.worldId, msgType, JSON.stringify(content));
  }

  public async load(ctx: SnowContext, initPayload: Record<string, any> | null = null, args: Record<string, any> = {}) {
    // TODO apply window manager offset, which is optional, dunno what its for
    /*args.xPercent = (args.xPercent ?? 0) - 0.5;
    args.yPercent = (args.yPercent ?? 0) - 0.5;*/

    await this.send(ctx, {
      windowUrl: this.url,
      layerName: this.layer,
      assetPath: '', // this is a TODO in snowflake
      initializationPayload: initPayload,
      action: WindowAction.LOAD_WINDOW,
      type: EventType.PLAY_ACTION,
      ...args
    });
  }

  public async close(ctx: SnowContext, args: Record<string, any> = {}) {
    await this.send(ctx, {
      targetWindow: this.url,
      action: WindowAction.CLOSE_WINDOW,
      type: EventType.PLAY_ACTION,
      ...args
    });
  }

  public async sendPayload(
    ctx: SnowContext,
    triggerName: string,
    payload: Record<string, any> = {},
    args: Record<string, any> = {},
    type: EventType = EventType.IMMEDIATE
  ) {
    await this.send(ctx, {
      jsonPayload: payload,
      targetWindow: this.url,
      triggerName,
      action: WindowAction.JSON_PAYLOAD,
      type,
      ...args
    });
  }

  public async sendAction(
    ctx: SnowContext,
    action: string,
    args: Record<string, any> = {},
    type: EventType = EventType.IMMEDIATE
  ) {
    await this.send(ctx, {
      action,
      type,
      ...args
    });
  }

}

class WindowManager {

  private _map: Record<string, SWFWindow> = {};
  loaded: boolean = false;
  ready: boolean = false;

  public getWindow(game: SnowGame, player: SnowPlayer, name: string | null = null, url: string | null = null): SWFWindow {
    if (name === null && url === null) {
      throw new Error('getWindow must have either a name or a url provided');
    }

    if (this._map[name]) {
      return this._map[name];
    }

    if (url !== null) {
      const splitUrl = url.split('/').pop();
      if (this._map[splitUrl]) {
        return this._map[splitUrl];
      }
    }

    this._map[name] = new SWFWindow(game, player, url, name);

    return this._map[name];
  }

  public async load(ctx: SnowContext) {
    await ctx.msg.sendSnowData(
      ctx.penguin,
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

    this._map['windowmanager.swf'] = new SWFWindow(ctx.game, ctx.penguin, ctx.penguin.windowManagerLocation, 'windowmanager.swf');
  }

  public delete(name: string) {
    delete this._map[name];
  }

}

class Grid {
  private _array: (GameObject | null)[][];
  public tiles: GameObject[] = [];

  constructor(private maxX: number, private maxY: number, private game: SnowGame) {
    this._array = Array.from({ length: maxX }, () =>
      Array<GameObject | null>(maxY).fill(null)
    );
  }

  private get obstacles() {
    return this.game.rocks.map(r => [r.x, r.y]);
  }

  public initTiles(ctx: SnowContext) {
    const frame = new GameObject(this.game, 'ui_tile_frame');
    frame.placeObject(ctx);

    for (let x = 0; x < this.maxX; x++) {
      for (let y = 0; y < this.maxY; y++) {
        const tile = new GameObject(this.game, `${x}-${y}`, x, y, false, 0.5, 0.9998);
        tile.onClick = this.onTileClick;
        this.tiles.push(tile);
        tile.placeObject(ctx);
      }
    }
  }

  private onTileClick({ penguin }: SnowContext, object: GameObject) {
    // TODO: if penguin selected card, place powercard

    const ninja = this.game.objects.getByName(capitalize(penguin.element)) as Ninja;
    
    // TODO: hide tip
  }

  /** Get the game object existing at the given x, y */
  public get(x: number, y: number) {
    return this._array[x][y];
  }

  /** Get the actual object for the tile at the given x, y */
  public getTile(x: number, y: number) {
    return this.tiles.find(t => t.x === x && t.y === y);
  }

  /** Add a game object to the grid at the given x/y */
  public add(obj: GameObject, x: number, y: number) {
    if (!this.isValid(x, y)) return;
    this._array[x][y] = obj;
    obj.x = x;
    obj.y = y;
  }

  /** Remove a game object from the grid */
  public remove(obj: GameObject) {
    const [x, y] = this.coordinates(obj);
    if (x > -1 && y > -1) {
      this._array[x][y] = null;
    }
  }

  /** Move a game object to a different spot in the grid */
  public move(obj: GameObject, x: number, y: number) {
    this.remove(obj);
    this._array[x][y] = obj;
  }

  /** Get the x and y of a game object on the grid */
  private coordinates(obj: GameObject): [number, number] {
    for (let x = 0; x < this.maxX; x++) {
      for (let y = 0; y < this.maxY; y++) {
        if (this._array[x][y] === obj) {
          return [x, y];
        }
      }
    }
    return [-1, -1];
  }

  public isValid(x: number, y: number) {
    return x >= 0 && x < this.maxX && y >= 0 && y < this.maxY;
  }

  /** Check if a given spot is empty */
  public canMove(x: number, y: number) {
    return this.isValid(x, y) && this._array[x][y] === null;
  }

  /** Check if a ninja can move to a tile */
  public canMoveToTile(ninja: Ninja, x: number, y: number) {
    const distance = Math.abs(x - ninja.x) + Math.abs(y - ninja.y);
    return this.canMove(x, y) && distance <= ninja.move;
  }

  /** Get manhattan distance between two tiles */
  public distance(start: [number, number], target: [number, number]) {
    return Math.abs(start[0] - target[0]) + Math.abs(start[1] - target[1]);
  }

  /** Get manhattan distance between two tiles, accounting for obstacles */
  public distanceWithObstacles(start: [number, number], target: [number, number]) {
    if (
      this.obstacles.some(([x, y]) => target[0] === x && target[1] === y)
      || this.obstacles.some(([x, y]) => this.isObstacleBetween(start, target, [x, y]))
    ) {
      return Infinity;
    }

    return this.distance(start, target);
  }

  /** Check if an obstacle lies on the line segment between start and target */
  private isObstacleBetween(start: [number, number], target: [number, number], obstacle: [number, number]) {
    const [x1, y1] = start;
    const [x2, y2] = target;
    const [x3, y3] = obstacle;

    if ((x2 - x1) * (y3 - y1) === (x3 - x1) * (y2 - y1)) {
      if (
        Math.min(x1, x2) <= x3 && x3 <= Math.max(x1, x2) &&
        Math.min(y1, y2) <= y3 && y3 <= Math.max(y1, y2)
      ) {
        return true;
      }
    }

    return false;
  }

  /** Get the surrounding tiles to the given x, y */
  public surroundingTiles(cx: number, cy: number, distance: number = 1) {
    const tiles: GameObject[] = [];
    for (let x = cx - distance; x <= cx + distance; x++) {
      for (let y = cy - distance; y <= cy + distance; y++) {
        if (!this.isValid(x, y)) continue;
        if (x === cx && y === cy) continue;

        tiles.push(this.getTile(x, y));
      }
    }
    return tiles;
  }

  public surroundingObjects(x: number, y: number, distance: number = 1) {
    return this.surroundingTiles(x, y, distance)
      .map(tile => this.get(tile.x, tile.y))
      .filter(Boolean);
  }

  /** Get a valid spawn x/y for a new enemy */
  public enemySpawnLocation(): [number, number] {
    for (let i = 0; i < 100; i++) {
      const x = randomInt(7, 8);
      const y = randomInt(0, 4);

      if (this.canMove(x, y)) {
        return [x, y];
      }
    }

    return [8, 4];
  }
}

export const sleep = (ms: number): Promise<void> => 
  new Promise((resolve) => setTimeout(resolve, ms));

export enum ActionType { Animation, Sound }

export type ActionCallback = null | ((obj: GameObject) => void);

interface Action {
  name: string
  handleId: number
  objectId: number,
  type: ActionType,
  callback: ActionCallback
}

class CallbackHandler {

  private _tick: number = 0;
  private _events: EventListener = new EventListener();
  private pendingActions: Record<number, Set<Action>> = {};

  constructor(private game: SnowGame) {}

  public get actions() {
    return Object.values(this.pendingActions).map(a => Array.from(a.values())).flat()
  }

  public get pendingAnimations() {
    return this.actions.filter(a => a.type === ActionType.Animation);
  }

  public async waitForAnims(): Promise<void> {
    return new Promise((resolve) => {
      if (this.pendingAnimations.length === 0) {
        resolve();
        return;
      }
      const callback = () => {
        this._events.removeListener(callback);
        resolve();
      }
      this._events.addListener(callback);
    });
  }

  public registerAction(name: string, type: ActionType, objectId: number, callback: ActionCallback) {
    if (!(objectId in this.pendingActions)) {
      this.pendingActions[objectId] = new Set();
    }

    const action = {
      name, objectId, handleId: ++this._tick, type, callback
    };

    this.pendingActions[objectId].add(action);

    return action.handleId;
  }

  public actionDone(handleId: number, objectId: number) {
    const obj = this.game.objects.getById(objectId);

    if (this.pendingActions[objectId] === undefined) return;

    for (const action of Array.from(this.pendingActions[objectId])) {
      if (action.handleId !== handleId) continue;

      if (action.callback !== null) action.callback(obj);

      this.pendingActions[objectId].delete(action);

      if (this.pendingAnimations.length === 0) {
        this._events.fire();
      }
    }

    if (this.pendingActions[objectId].size === 0) {
      delete this.pendingActions[objectId];
    }
  }

  public byName(name: string) {
    for (const actions of Object.values(this.pendingActions)) {
      for (const action of Array.from(actions)) {
        if (action.name === name) {
          return action;
        }
      }
    }
  }

  public remove(id: number) {
    delete this.pendingActions[id];
  }

}

class WindowEventListener {
  private listeners: Array<{
    name: string
    loaded: boolean
    callback: () => void
    once: boolean
  }> = [];

  public addListener(name: string, loaded: boolean, callback: () => void) {
    this.listeners.push({ name, loaded, callback, once: false });
  }

  public once(name: string, loaded: boolean, callback: () => void) {
    this.listeners.push({ name, loaded, callback, once: true });
  }

  public fire(n: string, l: boolean): void {
    this.listeners.forEach(({ name, loaded, callback, once }) => {
      if (name === n && loaded === l) {
        callback();
        if (once) {
          this.listeners = this.listeners.filter(({ callback: c }) => c !== callback);
        }
      }
    });
  }

  public removeListeners(): void {
    this.listeners.length = 0;
  }
}

export class SnowGame {
  private id: number = -1;
  private started: boolean = false;
  private _somePlayerReady: boolean = false;

  private bonusCriteria: string = choose(['no_ko', 'under_time', 'full_health']);
  private gameStart: number = Date.now();

  private map: number = randomInt(1, 3);
  private totalCombos: number = 0;
  public round: number = 0;
  public coins: number = 0;
  public exp: number = 0;

  public callbacks: CallbackHandler = new CallbackHandler(this);
  public objects: ObjectCollection = new ObjectCollection(1000);
  public windowEvents: WindowEventListener = new WindowEventListener();
  private backgrounds: GameObject[];
  public rocks: GameObject[];

  public grid = new Grid(9, 5, this);

  constructor(
    private fire: SnowPlayer | null,
    private water: SnowPlayer | null,
    private snow: SnowPlayer | null
  ) {

  }

  public get players() {
    return [this.fire, this.water, this.snow].filter(Boolean);
  }

  public get ninjas(): Ninja[] {
    return [
      this.objects.getByName('Fire') as Ninja,
      this.objects.getByName('Water') as Ninja,
      this.objects.getByName('Snow') as Ninja,
    ].filter(Boolean);
  }

  public get enemies(): Enemy[] {
    return [
      ...this.objects.getAllByName('Sly') as Enemy[],
      ...this.objects.getAllByName('Scrap') as Enemy[],
      ...this.objects.getAllByName('Tank') as Enemy[],
    ];
  }

  public async start(ctx: SnowContext) {
    this.players.forEach(player => {
      // TODO: set member card, set power cards
    });

    await sleep(3000);

    const battlePlace = ctx.world.places['snow_battle'];

    for (const player of this.players) {
      const pctx = { ...ctx, penguin: player };
      await player.getWindow(this, 'cardjitsu_snowplayerselect.swf').close(pctx);
      await player.switchPlace(pctx, battlePlace);
    }
  }

  public async somePlayerReady(ctx: SnowContext) {
    console.log('somePlayerReady called');
    if (this._somePlayerReady) return;
    this._somePlayerReady = true;
    await sleep(1000);
    this.playersReady(ctx);
  }

  public async playersReady(ctx: SnowContext) {
    console.log('playersReady called', this._somePlayerReady, this.players.some(p => !p.isReady));
    if (this.started || !this._somePlayerReady || this.players.some(p => !p.isReady)) {
      return;
    }

    this.started = true;

    Sound.fromName(ctx.world, 'mus_mg_201303_cjsnow_gamewindamb', true).play(ctx, this);

    await this.initObjects(ctx);
    await this.showEnvironment(ctx);
    await this.spawnNinjas(ctx);

    for (const player of this.players) {
      const pctx = { ...ctx, penguin: player }
      await player.getWindow(this, 'cardjitsu_snowplayerselect.swf').sendAction(pctx, 'closeCjsnowRoomToRoom');

      const btn = player.getWindow(this, 'cardjitsu_snowclose.swf');
      btn.layer = 'bottomLayer';
      await btn.load(ctx, null, {
        loadDescription: '',
        assetPath: '',
        xPercent: 1,
        yPercent: 0
      });
    }

    await sleep(1000);

    this.gameStart = Date.now();

    await this.displayRoundTitle(ctx);

    await sleep(1600);

    await this.spawnEnemies(ctx);
    await this.waitForWindow('cardjitsu_snowrounds.swf', false);
  }

  private async waitForWindow(name: string, loaded: boolean): Promise<void> {
    return new Promise((resolve) => {
      for (const penguin of this.players) {
        // Check if window is already loaded or not loaded
        if (penguin.getWindow(this, name).loaded === loaded) {
          resolve();
          return;
        }
      }

      this.windowEvents.once(name, loaded, resolve);
    });
  }

  private async initObjects(ctx: SnowContext) {
    this.grid.initTiles(ctx);
    await this.createEnvironment(ctx);
    await this.createEnemies(ctx);
    await this.createNinjas(ctx);
  }

  private async createEnvironment(ctx: SnowContext) {
    // TODO: if we ever do a settings option for beta, this.map is always 1
    this.backgrounds = {
      1: [new GameObject(this, 'env_mountaintop_bg', 4.5, -1.1)],
      2: [
        new GameObject(this, 'forest_bg', 4.5, -1.1),
        new GameObject(this, 'forest_fg', 4.5, 6.1)
      ],
      3: [
        new GameObject(this, 'cragvalley_bg', 4.5, -1.1),
        new GameObject(this, 'cragvalley_fg', 4.5, 6)
      ],
    }[this.map];

    this.backgrounds.forEach(b => b.placeObject(ctx));

    const rockName = this.map === 3 ? 'crag_rock' : 'rock_mountaintop';

    this.rocks = [[2, 0], [6, 0], [2, 4], [6, 4]].map(([x, y]) => {
      return new GameObject(this, rockName, x, y, true, 0.5, 1);
    });

    await Promise.all(this.rocks.map(r => r.placeObject(ctx)));
  }

  private async createEnemies(ctx: SnowContext) {
    if (this.round > 3) return;

    const maxEnemies = [
      [1, 3],
      [1, 3],
      [1, 3],
      [4, 4] // always 4 enemies for bonus round
    ][this.round];

    const amountEnemies = randomInt(maxEnemies[0], maxEnemies[1]);
    const enemyClasses = [Sly, Scrap, Tank];

    for (let i = 0; i < amountEnemies; i++) {
      while (true) {
        const enemyClass = choose(enemyClasses);

        const existing = this.enemies.filter(e => e instanceof enemyClass);

        // Can't have more than 3 enemies of the same type
        if (existing.length < 3) {
          new enemyClass(this);
          break;
        }
      }
    }
  }

  private async createNinjas(ctx: SnowContext) {
    const spawnPositions = [
      {'x': 0, 'y': 0},
      {'x': 0, 'y': 2},
      {'x': 0, 'y': 4}
    ];

    shuffle(spawnPositions);

    const ninjaClasses = {
      'fire': FireNinja,
      'water': WaterNinja,
      'snow': SnowNinja
    };

    this.players.forEach((player, index) => {
      const cls = ninjaClasses[player.element];

      const pos = spawnPositions[index];
      const ninja = new cls(this, player, pos.x, pos.y) as Ninja;
      ninja.placeObject(ctx);
      player.ninja = ninja;
    })
  }

  private async showEnvironment(ctx: SnowContext) {
    for (const { id, name } of [...this.backgrounds, ...this.rocks]) {
      const obj = this.objects.getById(id);
      await obj.placeSprite(ctx, name);
    }
  }

  private async spawnNinjas(ctx: SnowContext) {
    for (const ninja of this.ninjas) {
      await ninja.placeObject(ctx);
      await ninja.idleAnimation(ctx);
      ninja.placeHealthbar(ctx);
    }
  }

  private async spawnEnemies(ctx: SnowContext) {
    for (const enemy of this.enemies) {
      const [x, y] = this.grid.enemySpawnLocation();
      this.grid.add(enemy, x, y);
      enemy.placeObject(ctx);
      await enemy.spawnAnimation(ctx);
      await enemy.idleAnimation(ctx);
      enemy.placeHealthbar(ctx);
    }
  }

  private async displayRoundTitle(ctx: SnowContext) {
    const roundTime = (this.gameStart + 300000) - Date.now();

    for (const penguin of this .players) {
      const pctx = { ...ctx, penguin };
      const title = penguin.getWindow(this, 'cardjitsu_snowrounds.swf');
      title.load(pctx, {
        bonusCriteria: this.bonusCriteria,
        remainingTime: Math.max(0, roundTime),
        roundNumber: this.round
      }, {
        loadDescription: '',
        assetPath: '',
        xPercent: 0.15,
        yPercent: 0.15
      });
    }

    await this.waitForWindow('cardjitsu_snowrounds.swf', true);
  }

}

// TODO: could we just merge this with SnowServer?
// might make it easier to have things like the messenger more accessible
export class SnowWorld {
  private penguins = new Map<number, SnowPlayer>();

  worldId: number = 101;
  worldName: string = 'cjsnow_0';
  worldOwner: string = 'crowdcontrol';
  stylesheetId: string = '87.5309';
  serverType: ServerType = ServerType.LIVE;
  buildType: BuildType = BuildType.RELEASE;

  places: Record<string, Place> = {};

  soundAssets: AssetCollection = new AssetCollection();
  assets: AssetCollection = new AssetCollection();

  // TODO: temporary for testing, make this 3 later
  matchMaker: MatchMaker = new MatchMaker(1);

  games: SnowGame[] = [];

  constructor() {
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

  public disconnect(penguin: SnowPlayer) {
    this.penguins.delete(penguin.pid);
  }

  public getById(id: number) {
    return this.penguins.get(id);
  }

  public get players() {
    return [...this.penguins.values()];
  }

  public createGame(ctx: SnowContext, fire: SnowPlayer | null, water: SnowPlayer | null, snow: SnowPlayer | null) {
    const game = new SnowGame(fire, water, snow);
    this.games.push(game);
    game.start({ ...ctx, game });
  }
}
