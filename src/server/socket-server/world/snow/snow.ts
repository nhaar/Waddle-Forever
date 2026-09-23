import { WorldPenguin } from "../world-penguin";
import { ClientSocket } from "../../socket-server";
import { PenguinMessenger } from "../../messenger";
import { SnowContext, SnowPenguinContext } from "../../snow-data-handler";
import { BuildType, EventType, MessageType, ServerType, ViewMode, WindowAction } from "./snow-constants";
import { Enemy, FireNinja, GameObject, Ninja, Scrap, Sly, SnowNinja, Sound, Tank, WaterNinja } from "./snow-game-objects";
import { MatchMaker } from "../matchmaker";
import { capitalize, choose, EventListener, randomInt, shuffle } from "@common/utils";

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
  ninja: Ninja | null = null;
  pid: number = -1;
  loggedIn: boolean = false;
  isReady: boolean = false;
  disconnected: boolean = false;
  wasKO = false;

  battleMode: number = 0;
  screenSize: string = '';
  baseUrl: string = '';
  place: Place | null = null;

  element: string = '';
  tipMode: boolean = false;

  windowManager: WindowManager;
  localObjects: ObjectCollection = new ObjectCollection();

  constructor(private ctx: SnowContext) {
    this.windowManager = new WindowManager(this, ctx);
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

  public async setPlace(name: string, objectId: number = 0, instanceId: number = 0) {
    this.place = this.ctx.world.places[name];
    await this.ctx.msg.sendSnowData(this, 'W_PLACE', this.place.id, objectId, instanceId);
  }
  
  public async switchPlace(place: Place) {
    await this.setPlace(place.name);
    
    // TODO use Promise.all() instead
    for (const { index } of place.assets.values()) {
      await this.ctx.msg.sendSnowData(this, 'S_LOADSPRITE', `0:${index}`);
    }
    for (const { index } of place.soundAssets.values()) {
      await this.ctx.msg.sendSnowData(this, 'S_LOADSPRITE', `0:${index}`);
    }

    await this.ctx.msg.sendSnowData(this, 'W_ASSETSCOMPLETE', this.pid);
  }

  public getWindow(name: string | null = null, url: string | null = null) {
    return this.windowManager.getWindow(name, url);
  }

  public async sendToRoom() {
    const win = this.getWindow('cardjitsu_snowexternalinterfaceconnector.swf');
    win.layer = 'toolLayer';
    await win.load(null, { type: EventType.IMMEDIATE });
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
  onLoad: ((ctx: SnowPenguinContext) => void) | null = null;
  onClose: ((ctx: SnowPenguinContext) => void) | null = null;

  constructor(
    private ctx: SnowContext,
    private _player: SnowPlayer,
    public url: string | null = null,
    private name: string | null = null,
    public layer: string = 'topLayer'
  ) {
    if (this.name === null) {
      if (this.url !== null) {
        this.name = this.url.split('/').pop();
      }
    } else if (this.url === null) {
      this.url = `${ctx.world.locations.windowBase}/${this.name}`;
    }

    if (this.url === null && this.name === null) {
      throw new Error('You must provide either a url or a name for the window.');
    }
  }

  public get loaded() {
    return this._loaded;
  }

  public setLoaded(v: boolean, game: SnowGame) {
    this._loaded = v;
    if (game !== null) game.windowEvents.fire(this.name, v);
  }

  public async send(content: Record<string, any>, msgType: MessageType = MessageType.RECEIVED_JSON) {
    await this.ctx.msg.sendSnowData(this._player, 'UI_CLIENTEVENT', this.ctx.world.worldId, msgType, JSON.stringify(content));
  }

  public async load(initPayload: Record<string, any> | null = null, args: Record<string, any> = {}) {
    // TODO apply window manager offset, which is optional, dunno what its for
    /*args.xPercent = (args.xPercent ?? 0) - 0.5;
    args.yPercent = (args.yPercent ?? 0) - 0.5;*/

    await this.send({
      windowUrl: this.url,
      layerName: this.layer,
      assetPath: '', // this is a TODO in snowflake
      initializationPayload: initPayload,
      action: WindowAction.LOAD_WINDOW,
      type: EventType.PLAY_ACTION,
      ...args
    });
  }

  public async close(args: Record<string, any> = {}) {
    await this.send({
      targetWindow: this.url,
      action: WindowAction.CLOSE_WINDOW,
      type: EventType.PLAY_ACTION,
      ...args
    });
  }

  public async sendPayload(
    triggerName: string,
    payload: Record<string, any> = {},
    args: Record<string, any> = {},
    type: EventType = EventType.IMMEDIATE
  ) {
    await this.send({
      jsonPayload: payload,
      targetWindow: this.url,
      triggerName,
      action: WindowAction.JSON_PAYLOAD,
      type,
      ...args
    });
  }

  public async sendAction(
    action: string,
    args: Record<string, any> = {},
    type: EventType = EventType.IMMEDIATE
  ) {
    await this.send({
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

  constructor(private _player: SnowPlayer, private ctx: SnowContext) {}

  public getWindow(name: string | null = null, url: string | null = null): SWFWindow {
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

    this._map[name] = new SWFWindow(this.ctx, this._player, url, name);

    return this._map[name];
  }

  public async load() {
    await this.ctx.msg.sendSnowData(
      this._player,
      'UI_CROSSWORLDSWFREF',
      this.ctx.world.worldId, // element id
      0, // parent id
      'WindowManagerSwf', // element name
      0, // swf x
      0, // swf y
      0, // swf width
      0, // swf height
      0, // unknown
      this.ctx.world.locations.windowManager,
      '/framework' // command prefix
    );

    this.loaded = true;

    this._map['windowmanager.swf'] = new SWFWindow(this.ctx, this._player, this.ctx.world.locations.windowManager, 'windowmanager.swf');
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

  public initTiles() {
    const frame = new GameObject(this.game, 'ui_tile_frame');
    frame.placeObject();

    for (let x = 0; x < this.maxX; x++) {
      for (let y = 0; y < this.maxY; y++) {
        const tile = new GameObject(this.game, `${x}-${y}`, x, y, false, 0.5, 0.9998);
        tile.onClick = this.onTileClick;
        this.tiles.push(tile);
        tile.placeObject();
      }
    }
  }

  private onTileClick(ctx: SnowPenguinContext, object: GameObject) {
    // TODO: if penguin selected card, place powercard

    const ninja = this.game.objects.getByName(capitalize(ctx.penguin.element)) as Ninja;
    ninja.placeGhost(ctx, object.x, object.y);
    
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
    public ctx: SnowContext,
    private fire: SnowPlayer | null,
    private water: SnowPlayer | null,
    private snow: SnowPlayer | null
  ) {}

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

  public async start() {
    this.players.forEach(player => {
      // TODO: set member card, set power cards
    });

    await sleep(3000);

    const battlePlace = this.ctx.world.places['snow_battle'];

    for (const player of this.players) {
      await player.getWindow('cardjitsu_snowplayerselect.swf').close();
      await player.switchPlace(battlePlace);
    }
  }

  public async somePlayerReady() {
    if (this._somePlayerReady) return;
    this._somePlayerReady = true;
    await sleep(1000);
    this.playersReady();
  }

  public async playersReady() {
    if (this.started || !this._somePlayerReady || this.players.some(p => !p.isReady)) {
      return;
    }

    this.started = true;

    Sound.fromName(this.ctx.world, 'mus_mg_201303_cjsnow_gamewindamb', true).play(this.ctx, this);

    await this.initObjects();
    await this.showEnvironment();
    await this.spawnNinjas();

    for (const player of this.players) {
      await player.getWindow('cardjitsu_snowplayerselect.swf').sendAction('closeCjsnowRoomToRoom');

      const btn = player.getWindow('cardjitsu_snowclose.swf');
      btn.layer = 'bottomLayer';
      await btn.load(null, {
        loadDescription: '',
        assetPath: '',
        xPercent: 1,
        yPercent: 0
      });
    }

    await sleep(1000);

    this.gameStart = Date.now();

    await this.displayRoundTitle();

    await sleep(1600);

    await this.spawnEnemies();
    await this.waitForWindow('cardjitsu_snowrounds.swf', false);

    await this.showUI();
  }

  private async waitForWindow(name: string, loaded: boolean): Promise<void> {
    return new Promise((resolve) => {
      for (const penguin of this.players) {
        // Check if window is already loaded or not loaded
        if (penguin.getWindow(name).loaded === loaded) {
          resolve();
          return;
        }
      }

      this.windowEvents.once(name, loaded, resolve);
    });
  }

  private async initObjects() {
    this.grid.initTiles();
    await this.createEnvironment();
    await this.createEnemies();
    await this.createNinjas();
  }

  private async createEnvironment() {
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

    this.backgrounds.forEach(b => b.placeObject());

    const rockName = this.map === 3 ? 'crag_rock' : 'rock_mountaintop';

    this.rocks = [[2, 0], [6, 0], [2, 4], [6, 4]].map(([x, y]) => {
      return new GameObject(this, rockName, x, y, true, 0.5, 1);
    });

    await Promise.all(this.rocks.map(r => r.placeObject()));
  }

  private async createEnemies() {
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

  private async createNinjas() {
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
      ninja.placeObject();
      player.ninja = ninja;
    })
  }

  private async showEnvironment() {
    for (const { id, name } of [...this.backgrounds, ...this.rocks]) {
      const obj = this.objects.getById(id);
      await obj.placeSprite(name);
    }
  }

  private async spawnNinjas() {
    for (const ninja of this.ninjas) {
      await ninja.placeObject();
      await ninja.idleAnimation();
      ninja.placeHealthbar();
    }
  }

  private async spawnEnemies() {
    for (const enemy of this.enemies) {
      const [x, y] = this.grid.enemySpawnLocation();
      this.grid.add(enemy, x, y);
      enemy.placeObject();
      await enemy.spawnAnimation();
      await enemy.idleAnimation();
      enemy.placeHealthbar();
    }
  }

  private async showUI() {
    for (const player of this.players) {
      const ui = player.getWindow('cardjitsu_snowui.swf');
      ui.layer = 'bottomLayer';
      ui.load({
        cardsAssetPath: this.ctx.world.locations.cards,
        element: player.element,
        isMember: player.penguin.membership.isMember
      }, {
        loadDescription: '',
        assetPath: '',
        xPercent: 0.5,
        yPercent: 1
      });
    }
  }

  private async displayRoundTitle() {
    const roundTime = (this.gameStart + 300000) - Date.now();

    for (const penguin of this.players) {
      const title = penguin.getWindow('cardjitsu_snowrounds.swf');
      title.load({
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
  private ctx: SnowContext = null;

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

  locations: {
    base: string,
    cards: string,
    windowManager: string,
    windowBase: string,
    assetBase: string
  };

  constructor() {
    this.registerPlace(new SnowLobby());
    this.registerPlace(new SnowBattle());
    this.registerPlace(new TuskBattle());
  }

  public init(ctx: SnowContext) {
    if (this.ctx !== null) {
      throw new Error('World context is already set!');
    }

    this.ctx = ctx;

    const base = `http://${ctx.settings.targetIP}:${ctx.settings.targetPort}`;
    this.locations = {
      base: `${base}/game/mpassets/`,
      cards: `${base}/game/mpassets/minigames/cjsnow/en_US/deploy/`,
      windowManager: `${base}/game/mpassets/minigames/cjsnow/en_US/deploy/swf/windowManager/windowmanager.swf`,
      windowBase: `${base}/game/mpassets/minigames/cjsnow/en_US/deploy/swf/ui/windows`,
      assetBase: `${base}/game/mpassets/minigames/cjsnow/en_US/deploy/swf/ui/assets`
    }
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

  public createGame(fire: SnowPlayer | null, water: SnowPlayer | null, snow: SnowPlayer | null) {
    const game = new SnowGame(this.ctx, fire, water, snow);
    this.games.push(game);
    game.start();
  }
}
