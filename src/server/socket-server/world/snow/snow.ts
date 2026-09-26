import { WorldPenguin } from "../world-penguin";
import { SnowContext, SnowPenguinContext } from "../../snow-data-handler";
import { BuildType, EventType, ExpRequirements, MessageType, MirrorMode, ServerType, TipPhase, ViewMode, WindowAction } from "./snow-constants";
import { CardObject, Enemy, FireNinja, GameObject, MemberCard, Ninja, Scrap, Sly, SnowNinja, Sound, Tank, WaterNinja } from "./snow-game-objects";
import { MatchMaker } from "../matchmaker";
import { choose, EventListener, randomInt, shuffle } from "@common/utils";
import { CardColor, CARDS } from "@server/game-logic/cards";
import { getYellowString, logverbose } from "@server/logger";

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

  constructor(public maxX: number, public maxY: number, private game: SnowGame) {
    this._array = Array.from({ length: maxX }, () =>
      Array<GameObject | null>(maxY).fill(null)
    );
  }

  private get obstacles() {
    return this.game.rocks.map(r => [r.x, r.y]);
  }

  private get objects() {
    const objects: GameObject[] = [];
    for (let x = 0; x < this.maxX; x++) {
      for (let y = 0; y < this.maxY; y++) {
        if (this._array[x][y] !== null) {
          objects.push(this._array[x][y]);
        }
      }
    }
    return objects;
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

  public showTiles(penguin: SnowPlayer | null = null) {
    const frame = this.game.objects.getByName('ui_tile_frame');
    frame.placeSprite();

    for (const player of (penguin ? [penguin] : this.game.players)) {
      if (player.ninja.hp <= 0) continue;

      for (const tile of player.ninja.tilesInRange()) {
        if (!this.canMove(tile.x, tile.y)) {
          // Cannot move to the tile
          let tileName = 'ui_tile_no_move';

          const ninja = this.get(tile.x, tile.y);
          if (ninja instanceof Ninja) {
            if (ninja === player.ninja) {
              tileName = 'ui_tile_move';
            } else if (ninja.hp <= 0 && !ninja.player.disconnected) {
              // Player can revive ninja
              tileName = 'ui_tile_heal';
            } else if (ninja.hp < ninja.maxHp && player.element === 'snow') {
              // Player can heal ninja
              tileName = 'ui_tile_heal';
            }
          } else if (ninja === player.ninja.ghost) {
            tileName = 'ui_tile_move';
          }

          tile.placeSprite(tileName, player);
        } else {
          tile.placeSprite('ui_tile_move', player);
        }
      }
    }
  }

  public hideTiles(player: SnowPlayer = null) {
    if (player === null) {
      this.game.objects.getByName('ui_tile_frame').hide();
    }
    this.tiles.forEach(t => t.hide(player))
  }

  public changeTiles(player: SnowPlayer, name: string, ghost: boolean = false, ignoreObjects: boolean = false) {
    if (ignoreObjects) {
      const tiles = ghost ? player.ninja.ghostTilesInRange() : player.ninja.tilesInRange();
      this.tiles.forEach(t => tiles.includes(t) ? t.placeSprite(name, player) : t.hide(player));
    } else {
      const tiles = [
        ...(ghost ? player.ninja.movableGhostTiles() : player.ninja.movableTiles()),
        ...(player.ninja.placedGhost ? [this.getTile(player.ninja.ghost.x, player.ninja.ghost.y)] : [])
      ]
      this.tiles.forEach(t => tiles.includes(t) ? t.placeSprite(name, player) : t.hide(player));
    }
  }

  private onTileClick(ctx: SnowPenguinContext, object: GameObject) {
    if (ctx.penguin.selectedCard) {
      ctx.penguin.ninja.placePowerCard(object.x, object.y);
      return;
    }

    ctx.penguin.ninja.placeGhost(ctx, object.x, object.y);
    
    if (ctx.penguin.tipMode && ctx.penguin.lastTip === TipPhase.MOVE) {
      ctx.penguin.hideTip();
    }
  }

  /** Get the game object existing at the given x, y */
  public get(x: number, y: number) {
    if (!this.isValid(x, y)) return null;
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
    this.add(obj, x, y);
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

  public objectsInRange(minX: number, maxX: number, minY: number, maxY: number) {
    const objects: GameObject[] = [];
    for (const object of this.objects) {
      if (object.x >= minX && object.x <= maxX && object.y >= minY && object.y <= maxY) {
        objects.push(object);
        continue;
      }

      if (object instanceof Enemy && object.tileRange > 0) {
        const enemyMinX = object.x - object.tileRange;
        const enemyMaxX = object.x + object.tileRange;
        const enemyMinY = object.y - object.tileRange;
        const enemyMaxY = object.y + object.tileRange;

        const overlapsX = minX <= enemyMaxX && maxX >= enemyMinX;
        const overlapsY = minY <= enemyMaxY && maxY >= enemyMinY;

        if (overlapsX && overlapsY) {
          objects.push(object);
        }
      }
    }

    return objects;
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

class Timer {
  private tick: number = 10;
  private interval: NodeJS.Timer = null;
  private intervalDivisor: number = 4;
  private loaded: boolean = false;
  public running: boolean = false;

  constructor(private game: SnowGame) {}

  public async run(onComplete: () => void) {
    if (!this.loaded) {
      await this.load();
      this.loaded = true;
    }

    if (this.running) return;

    this.tick = 10;
    this.running = true;
    this.show();

    if (this.interval !== null) clearInterval(this.interval);

    let sec = this.intervalDivisor;
    this.interval = setInterval(() => {
      sec -= 1;

      if (this.game.players.every(p => p.disconnected)) {
        this.stopInterval();
        this.game.close();
        return;
      }

      if (this.game.players.every(p => p.isReady && !p.disconnected)) {
        // Everyone is ready, so finish early
        this.stopInterval();
        this.hide();
        onComplete();
        return;
      }

      if (sec === 0) {
        // 1 full second has passed
        sec = this.intervalDivisor;
        this.tick -= 1;
        this.update();
      }

      if (this.tick === 0) {
        // Finished
        this.stopInterval();
        this.tick = 10;
        this.hide();
        onComplete();
      }
    }, 1000 / this.intervalDivisor)
  }

  private stopInterval() {
    clearInterval(this.interval);
    this.interval = null;
    this.running = false;
  }

  private async load() {
    for (const player of this.game.players) {
      const timer = player.getWindow('cardjitsu_snowtimer.swf');
      timer.layer = 'bottomLayer';
      timer.load({ element: player.element }, {
        loadDescription: '', assetPath: '',
        xPercent: 0.5, yPercent: 0
      });
    }

    await this.game.waitForWindow('cardjitsu_snowtimer.swf', true);
  }

  private async update() {
    for (const player of this.game.players) {
      player
        .getWindow('cardjitsu_snowtimer.swf')
        .sendPayload('update', { tick: this.tick });
    }
  }

  private async show() {
    for (const player of this.game.players) {
      const timer = player.getWindow('cardjitsu_snowtimer.swf');
      timer.sendPayload('Timer_Start');
      timer.sendPayload('enableConfirm');
    }
  }

  private async hide() {
    for (const player of this.game.players) {
      const timer = player.getWindow('cardjitsu_snowtimer.swf');
      timer.sendPayload('skipToTransitionOut');
      timer.sendPayload('disableConfirm');
    }
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
  private _animEvents: EventListener = new EventListener();
  private _frameworkEvents: FrameworkEventListener = new FrameworkEventListener();
  private pendingActions: Record<number, Set<Action>> = {};
  private pendingEvents: Map<SnowGame | SnowPlayer, string[]> = new Map();

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
        this._animEvents.removeListener(callback);
        resolve();
      }
      const timer = setTimeout(() => {
        clearTimeout(timer);
        callback();
      }, 8000);
      this._animEvents.addListener(callback);
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
        this._animEvents.fire();
      }
    }

    if (this.pendingActions[objectId].size === 0) {
      delete this.pendingActions[objectId];
    }
  }

  private registerEvent(name: string, target: SnowGame | SnowPlayer) {
    if (!this.pendingEvents.has(target)) {
      this.pendingEvents.set(target, []);
    }
    this.pendingEvents.get(target).push(name);
  }

  public eventDone(name: string, target: SnowGame | SnowPlayer) {
    const events = this.pendingEvents.get(target);

    if (events === undefined) return;

    this._frameworkEvents.fire(name, target);

    this.pendingEvents.set(target, events.filter(n => n !== name));

    if (this.pendingEvents.get(target).length === 0) {
      this.pendingEvents.delete(target);
    }
  }

  public async waitForClient(name: string, target: SnowPlayer): Promise<void> {
    this.registerEvent(name, target);
    // TODO: resolve when penguin becomes disconnected, also timeout
    return new Promise((resolve) => {
      this._frameworkEvents.addListener(name, target, resolve);
    });
  }

  public async waitForEvent(name: string): Promise<void> {
    this.registerEvent(name, this.game);
    return new Promise((resolve) => {
      this._frameworkEvents.addListener(name, this.game, resolve);
    });
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

  public remove(id: number, fireAnims: boolean = true) {
    delete this.pendingActions[id];

    // fire anim listeners now, in case an object we were waiting on
    // was removed before it had a chance to fire it
    if (fireAnims && this.pendingAnimations.length === 0) {
      this._animEvents.fire();
    }
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

class FrameworkEventListener {
  private listeners: Array<{
    name: string
    target: SnowGame | SnowPlayer
    callback: () => void
  }> = [];

  public addListener(name: string, target: SnowGame | SnowPlayer, callback: () => void) {
    this.listeners.push({ name, target, callback });
  }

  public fire(n: string, t: SnowPlayer | SnowGame): void {
    this.listeners.forEach(({ name, target, callback }) => {
      if (name === n && target === t) {
        callback();
        this.listeners = this.listeners.filter(({ callback: c }) => c !== callback);
      }
    });
  }

  public removeListeners(): void {
    this.listeners.length = 0;
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
  baseUrl: string = '';
  place: Place | null = null;
  element: string = '';

  tipMode: boolean = false;
  displayedTips: Set<TipPhase> = new Set();
  lastTip: TipPhase | null = null;

  memberCard: MemberCard | null = null;
  powerCards: Set<CardObject> = new Set();
  powerCardSlots: Set<CardObject> = new Set();
  selectedCard: CardObject | null = null;
  powerCardStamina: number = 0;
  playedCards: number = 0;

  windowManager: WindowManager;
  localObjects: ObjectCollection = new ObjectCollection();

  constructor(private ctx: SnowContext) {
    this.windowManager = new WindowManager(this, ctx);
  }

  public get selectedMemberCard() {
    return this.memberCard !== null && this.memberCard.selected;
  }

  public get hasPowerCards() {
    return this.powerCardSlots.size > 0 || this.powerCards.size > 0;
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
    
    await Promise.all([
      ...Array.from(place.assets).map(({ index }) => 
        this.ctx.msg.sendSnowData(this, 'S_LOADSPRITE', `0:${index}`)
      ),
      ...Array.from(place.soundAssets).map(({ index }) => 
        this.ctx.msg.sendSnowData(this, 'S_LOADSPRITE', `0:${index}`)
      )
    ]);

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

  public async sendTip(phase: TipPhase) {
    const infotip = this.getWindow('cardjitsu_snowinfotip.swf');
    infotip.layer = 'topLayer';
    await infotip.load({
      element: this.element,
      phase
    }, {
      loadDescription: '',
      assetPath: '',
      xPercent: 0.1,
      yPercent: 0
    });
    this.lastTip = phase;
    infotip.onClose = ({ penguin }) => penguin.lastTip = null;
  }

  public async hideTip() {
    await this
      .getWindow('cardjitsu_snowinfotip.swf')
      .sendPayload('disable');
  }

  public powerCardById(id: number) {
    return Array.from(this.powerCardSlots).find(card => card.id === id);
  }

  public async initPowerCards(game: SnowGame) {
    const cardColor = {
      'snow': 'p',
      'water': 'b',
      'fire': 'r'
    }[this.element];

    const powerCards = this.penguin.ninja.getDeck().map(id => CARDS.get(id)).filter(card => {
      return card.powerId > 0 && card.element === this.element.charAt(0);
    });

    for (const card of powerCards) {
      const obj = new CardObject(card, game, this);
      obj.color = cardColor as CardColor;
      this.powerCards.add(obj);
    }
  }

  public nextPowerCard(): CardObject | null {
    if (this.powerCards.size === 0) {
      // Out of cards, maybe you should buy more from the martial artworks catalog #ad
      return null;
    }

    if (this.powerCardSlots.size >= 4) {
      // Cannot hold more than 4 cards at a time
      return null;
    }

    const next = choose(Array.from(this.powerCards));
    this.powerCardSlots.add(next);
    this.powerCards.delete(next);
    return next;
  }

  public async updateCards() {
    if (this.disconnected) return;

    this.powerCardStamina += 2;

    const update = {
      cardData: null,
      cycle: false,
      stamina: this.powerCardStamina
    };

    if (this.powerCardStamina >= 10) {
      this.powerCardStamina = 0;
      update.stamina = 0;

      const next = this.nextPowerCard();
      if (next !== null) {
        update.cardData = next.cardData;
      }

      if (this.powerCardSlots.size >= 4) {
        update.cycle = true;
      }
    }

    await this
      .getWindow('cardjitsu_snowui.swf')
      .sendPayload('updateStamina', update);
  }
}

export class SnowGame {
  private started: boolean = false;
  private roomMinTimeReceived: boolean = false;

  private bonusCriteria: 'no_ko' | 'under_time' | 'full_health' = choose(['no_ko', 'under_time', 'full_health']);
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
  public timer = new Timer(this);

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

  private get bonusCriteriaMet() {
    switch (this.bonusCriteria) {
      case 'no_ko':
        return this.players.filter(p => !p.disconnected).every(p => !p.wasKO);
      case 'full_health':
        return this.players.filter(p => !p.disconnected).every(p => p.ninja.hp === p.ninja.maxHp);
      case 'under_time':
        return Date.now() < (this.gameStart + (300 * 1000));
    }
  }

  public async start() {
    this.players.forEach(player => {
      player.memberCard = new MemberCard(this, player);
      player.initPowerCards(this);
    });

    await sleep(3000);

    const battlePlace = this.ctx.world.places['snow_battle'];

    for (const player of this.players) {
      await player.getWindow('cardjitsu_snowplayerselect.swf').close();
      await player.switchPlace(battlePlace);
    }

    await this.callbacks.waitForEvent('roomToRoomMinTime');

    this.roomMinTimeReceived = true;
    await sleep(1000);
    this.playersReady();
  }

  public async playersReady() {
    if (this.started || !this.roomMinTimeReceived || this.players.some(p => !p.isReady)) {
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
    await this.sendTip(TipPhase.MOVE);

    this.players.filter(p => p.disconnected).forEach(p => p.ninja.setHealth(0));

    for (const player of this.players.filter(p => !p.hasPowerCards)) {
      player
        .getWindow('cardjitsu_snowui.swf')
        .sendPayload('noCards');
    }

    this.startNextLoop();
  }

  private async startNextLoop() {
    if (this.players.every(p => p.disconnected)) {
      this.close();
      return;
    }
    for (const player of this.players) {
      player.selectedCard = null;
      player.isReady = false;
      player.ninja.resetSpriteSettings();
      if (player.powerCardSlots.size > 0) this.sendTip(TipPhase.CARD, player);
    }
    this.showTargets();
    this.grid.showTiles();
    this.enableCards();
    this.timer.run(() => this.timerDone());
  }

  private async timerDone() {
    this.grid.hideTiles();
    this.disableCards();
    this.hideGhosts();
    this.removeUI();
    this.hideTargets();

    await sleep(1250);

    // according to snowflake, targets can sometimes still be visible
    // see if this still happens to us

    await this.moveNinjas();
    await this.doNinjaActions();
    await this.doEnemyActions();

    // Check if any ninjas are being revived
    for (const ninja of this.ninjas) {
      if (!(ninja.selectedObject instanceof Ninja)) continue;

      if (ninja.selectedObject.hp > 0 || ninja.player.disconnected) {
        // They were already revived, or left
        ninja.idleAnimation();
        continue;
      }

      for (const player of this.players.filter(p => !p.disconnected)) {
        if (player.ninja.selectedObject === ninja.selectedObject) {
          // TODO: unlock revive stamp for everyone who was reviving
        }
      }

      await this.callbacks.waitForAnims();
      ninja.selectedObject.setHealth(1);
      ninja.targets.clear();
      ninja.idleAnimation();
    }

    this.enemies.forEach(e => e.updateFlame());

    await this.callbacks.waitForAnims();

    if (this.checkRoundComplete()) {
      // Moving onto the next round
      
      for (const player of this.players.filter(p => p.disconnected)) {
        // remove disconnected players
        player.ninja.removeObject();
      }

      if (this.ninjas.every(n => n.hp <= 0)) {
        this.postGame();
        return;
      }

      const coins = {
        0: 60,
        1: 120,
        2: 120,
        3: 120
      }
      const exp = {
        0: 100,
        1: 200,
        2: 300,
        3: 180
      }

      this.coins += coins[this.round];
      this.exp += exp[this.round];

      if (this.round >= 2 && !this.bonusCriteriaMet) {
        // Bonus criteria not met on round 3
        this.postGame();
        return;
      }

      if (this.round >= 3) {
        // Bonus round complete
        this.postGame();
        return;
      }

      this.round++;

      if (this.round >= 3 && this.bonusCriteria === 'full_health') {
        // TODO: full health stamp
      }

      this.enemies.forEach(e => e.removeObject());

      await this.displayRoundTitle();
      await sleep(1600);

      await this.createEnemies();
      await this.spawnEnemies();
      await this.waitForWindow('cardjitsu_snowrounds.swf', false);
    }

    this.startNextLoop();
  }

  private checkRoundComplete() {
    if (this.players.every(p => p.disconnected)) {
      this.close();
      return;
    }

    if (this.enemies.length === 0) {
      // All enemies defeated
      return true;
    }

    if (this.ninjas.every(n => n.hp <= 0)) {
      // Everyone died
      return true;
    }

    return false;
  }

  private async postGame() {
    this.removeUI();
    this.removeTargets();
    await this.displayWinSequence();

    if (this.enemies.length === 0) {
      for (const player of this.players) {
        if (!player.wasKO) continue;

        // TODO: up and at em stamp
      }

      if (this.players.every(p => p.wasKO)) {
        // TODO: team revival stamp
      }

      if (this.round >= 3) {
        // TODO: bonus win stamp
      }
    }

    this.displayPayout();
    this.removeObjects();
    this.close();
  }

  public close() {
    this.ctx.world.removeGame(this);
  }

  public async waitForWindow(name: string, loaded: boolean): Promise<void> {
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

  private async removeUI() {
    this.objects.getAllByName('confirm').forEach(o => o.removeObject());

    for (const player of this.players) {
      player.selectedCard?.remove();
      if (player.selectedMemberCard) player.memberCard.remove();
    }
  }

  private async enableCards() {
    for (const player of this.players) {
      player
        .getWindow('cardjitsu_snowui.swf')
        .sendPayload('enableCards');
    }
  }

  private async disableCards() {
    for (const player of this.players) {
      player
        .getWindow('cardjitsu_snowui.swf')
        .sendPayload('disableCards');
    }
  }

  private async moveNinjas() {
    for (const ninja of this.ninjas) {
      if (ninja.placedGhost) ninja.player.updateCards();
      ninja.moveNinja(ninja.ghost.x, ninja.ghost.y);
    }

    await this.callbacks.waitForAnims();
  }

  private async doNinjaActions() {
    await this.doNinjaAttacks();
    await this.doPowerCardAttacks();
    await this.doNinjaRevive();
  }

  private async doNinjaAttacks() {
    const ninjasWithoutCards = this.ninjas.filter(n => !n.player.selectedCard && !n.player.selectedMemberCard);

    for (const ninja of ninjasWithoutCards) {
      if (!ninja.selectedTarget) continue;

      const target = ninja.selectedObject;

      if (target === null) continue; // Target is defeated or removed

      if (target instanceof Enemy) {
        await ninja.attackTarget(target);
      } else if (target instanceof Ninja) {
        await ninja.healTarget(target);
      }

      if (ninja.heals >= 15) {
        // TODO: heal 15 stamp
      }

      await sleep(1000);
    }
  }

  private async doPowerCardAttacks() {
    const ninjasWithCards = this.ninjas.filter(n => n.player.selectedCard !== null);

    const isCombo = ninjasWithCards.length > 1;

    if (isCombo) {
      this.totalCombos++;

      if (ninjasWithCards.length === 3) {
        // TODO: 3 ninja combo stamp
      }

      if (this.totalCombos >= 3) {
        // TODO: 3 combos stamp
      }

      await this.displayComboTitle(ninjasWithCards.map(n => n.player.element));

      await this.callbacks.waitForEvent('comboScreenComplete');
    }

    for (const ninja of ninjasWithCards) {
      await ninja.usePowerCard(isCombo);
      await sleep(1000);
    }
  }

  private async doNinjaRevive() {
    const ninjas = this.ninjas.filter(n => n.player.selectedMemberCard);

    if (ninjas.length === 0) return;

    for (const player of this.players) {
      if (player.disconnected) continue;

      player
        .getWindow('cardjitsu_snowrevive.swf')
        .load(null, { xPercent: 0.2, yPercent: 0 });
    }

    // Wait for it to open and close
    await this.waitForWindow('cardjitsu_snowrevive.swf', true);
    await this.waitForWindow('cardjitsu_snowrevive.swf', false);

    for (const ninja of ninjas) {
      await ninja.player.memberCard.consume();
      await sleep(1000);
    }
  }

  private async doEnemyActions() {
    for (const enemy of this.enemies) {
      await sleep(500);

      if (enemy.hp <= 0) continue;

      const [nextMove, target] = enemy.nextTarget();

      if (nextMove === null && target === null) continue; // Enemy is stuck

      if (enemy.stunned) continue; // Stunned by a fire ninja, can't attack

      if (nextMove !== null) {
        enemy.moveEnemy(nextMove.x, nextMove.y);
        await this.callbacks.waitForAnims();
      }

      if (target === null) {
        enemy.resetSpriteSettings();
        continue;
      }

      const targetObject = this.grid.get(target.x, target.y);

      if (targetObject === null) {
        logverbose(getYellowString('Enemy tried to attack a null object'));
        continue;
      }

      const ninja = targetObject as Ninja;

      if (ninja.hp <= 0) continue;

      // Enemy sprite might be flipped to the wrong direction
      if (targetObject.x < enemy.x) enemy.resetSpriteSettings();

      await enemy.attackTarget(ninja);

      if (targetObject.x > enemy.x) {
        // Flip ninja sprite to face enemy
        targetObject.spriteSettings({ mirrorMode: MirrorMode.X });
      }

      await this.callbacks.waitForAnims();
      targetObject.resetSpriteSettings();
    }

    // Reset stunned state
    for (const enemy of this.enemies.filter(e => e.stunned)) {
      enemy.stunned = false;
      enemy.idleAnimation();
    }
  }

  private async showTargets() {
    this.ninjas.forEach(n => n.showTargets());
  }

  private async hideTargets() {
    this.ninjas.forEach(n => n.hideTargets());
  }

  private async removeTargets() {
    this.ninjas.forEach(n => n.removeTargets());
  }

  private async hideGhosts() {
    this.ninjas.forEach(n => n.hideGhost(false));
  }

  private async removeObjects() {
    this.removeTargets();
    this.removeUI();

    for (const ninja of this.ninjas) {
      ninja.removeObject();
      ninja.shield?.removeObject();
      ninja.rage?.removeObject();
    }

    for (const enemy of this.enemies) {
      enemy.removeObject();
      enemy.flame?.removeObject();
    }

    this.rocks.forEach(r => r.removeObject());
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

  private async displayComboTitle(elements: string[]) {
    for (const penguin of this.players) {
      const title = penguin.getWindow('cardjitsu_snowcombos.swf');
      title.layer = 'bottomLayer';
      title.load({
        data: elements
      }, {
        loadDescription: '',
        assetPath: '',
        xPercent: 0.5,
        yPercent: 0.5
      });
    }

    await this.waitForWindow('cardjitsu_snowcombos.swf', true);
  }

  public async sendTip(phase: TipPhase, player: SnowPlayer | null = null) {
    const players = player ? [player] : this.players;

    for (const player of players) {
      if (!player.tipMode || player.displayedTips.has(phase)) continue;

      player.displayedTips.add(phase);

      if (player.lastTip === null) {
        player.sendTip(phase);
        continue;
      }

      player
        .getWindow('cardjitsu_snowinfotip.swf')
        .onClose = ({ penguin }) => penguin.sendTip(phase);
    }
  }

  private getPayoutRound() {
    if (this.round >= 3) {
      // Bonus round entered
      return 9 - this.enemies.length;
    }
    if (this.enemies.length === 0 && this.round === 2) {
      // All enemies defeated
      return 4;
    }
    // Players were defeated
    return this.round + 1;
  }

  private async displayPayout() {
    // TODO: beta payout (if we do an option for that)

    for (const player of this.players) {
      if (player.disconnected) continue;

      let resultRank = 24;
      let expPercent = 100;

      if (true) { // TODO: check if snow rank < 24
        // TODO: replace 0 with snow rank
        const requiredExp = ExpRequirements[0 + 1] ?? 3000;
        const currentExp = 0 // TODO: get actual current exp

        const resultExp = currentExp + this.exp;
        expPercent = Math.round(resultExp / requiredExp * 100);

        const ranksGained = Math.floor(expPercent / 100);
        // TODO: replace 0 with snow rank
        resultRank = Math.round(0 + ranksGained);
      }

      const doubleCoins = false; // TODO: check if all stamps gotten
      const coins = this.coins * (doubleCoins ? 2 : 1);

      if (resultRank >= 13) {
        // TODO: snow pro stamp
      }

      // TODO: get update stuff for db
      /*const updates = {
        coins: player.penguin.currency.coins + coins,
        snow_ninja_rank: resultRank,
        snow_ninja_progress: ((expPercent % 100) + 100) % 100
      }

      if (this.enemies.length <= 0) {
        const key = 
      }*/

      // TODO: update db and add items

      const payout = player.getWindow('cardjitsu_snowpayout.swf');
      payout.layer = 'bottomLayer';
      payout.load({
        coinsEarned: coins,
        doubleCoins: Number(doubleCoins),
        damage: 0,
        isBoss: 0,
        rank: 1, // TODO: actual rank + 1
        round: this.getPayoutRound(),
        showItems: 0,
        stampList: [], // TODO: full list of cjs stamps
        stamps: [], // TODO: get client's list of unlocked stamps
        xpStart: 0, // TODO: client's exp progress (updated?)
        xpEnd: resultRank < 24 ? expPercent : 100
      }, {
        loadDescription: '',
        assetPath: '',
        xPercent: 0.08,
        yPercent: 0.05
      });
    }
  }

  private async displayWinSequence() {
    await sleep(2000);

    if (this.ninjas.every(n => n.hp <= 0)) return;

    for (const ninja of this.ninjas) {
      if (ninja.player.disconnected) continue;

      if (ninja.hp <= 0) ninja.setHealth(1);

      ninja.winAnimation();
    }

    await sleep(3500);
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
  matchMaker: MatchMaker = new MatchMaker(2);

  games: Set<SnowGame> = new Set();

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
    this.games.add(game);
    game.start();
  }

  public removeGame(game: SnowGame) {
    this.games.delete(game);
  }
}
