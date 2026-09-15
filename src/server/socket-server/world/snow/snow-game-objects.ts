import { SnowContext } from "@server/socket-server/snow-data-handler";
import { MirrorMode, OriginMode } from "./snow-constants";
import { SnowPlayer } from "./snow";

interface SpriteSettings {
  scaleX?: number
  scaleY?: number
  originMode?: OriginMode
  mirrorMode?: MirrorMode
}

/**
 * Description from snowflake:
 * 
 * This class represents a game object. It is the base class for all objects in the game, such as ninjas and enemies.
 * The protocol allows for placing, moving and animating the object, as well as playing sounds.
 */
export class GameObject {

  public id: number = -1;
  public target: SnowPlayer; // TODO: | SnowGame

  constructor(
    public game: null,
    public name: string,
    public x: number = 0,
    public y: number = 0,
    public onClick: () => void | null = null,
    public grid: Boolean = false,
    public xOffset: number = 0,
    public yOffset: number = 0,
    private _originMode: OriginMode = OriginMode.NONE,
    private _mirrorMode: MirrorMode = MirrorMode.NONE,
    private _xScale: number = 1,
    private _yScale: number = 1
  ) {
    //this.target = game;

    if (grid) {
      // place on game grid
    }
  }

  /** Get the clients from the `target` to send stuff to  */
  protected get clients(): Array<SnowPlayer> {
    return (this.target instanceof SnowPlayer)
      ? [this.target]
      : [this.target] // TODO: get clients from game
  }

  public get originMode() {
    return this._originMode;
  }

  public get mirrorMode() {
    return this._mirrorMode;
  }

  public get xScale() {
    return this._xScale;
  }

  public get yScale() {
    return this._yScale;
  }

  public async placeObject(ctx: SnowContext) {
    await ctx.msg.sendSnowData(
      ctx.client,
      'O_HERE',
      this.id,
      '0:1',
      this.x + this.xOffset,
      this.y + this.yOffset,
      0, 1, 0, 0, 0,
      this.name,
      '0:1',
      0,
      Boolean(this.onClick) ? 0 : 1,
      0
    );
  }

  /** Use this to adjust the x/y scale or origin/mirror mode of this game object. */
  public async spriteSettings(ctx: SnowContext, s: SpriteSettings) {
    const scaleX = s.scaleX ?? this._xScale;
    const scaleY = s.scaleY ?? this._yScale;
    const originMode = s.originMode ?? this._originMode;
    const mirrorMode = s.mirrorMode ?? this._mirrorMode;

    await ctx.msg.send(
      this.clients,
      'O_SPRITESETTINGS',
      this.id,
      'none', // sprite layers
      scaleX, scaleY,
      '', '', '',
      originMode, mirrorMode
    );

    this._xScale = scaleX;
    this._yScale = scaleY;
    this._originMode = originMode;
    this._mirrorMode = mirrorMode;
  }

  public async removeObject(ctx: SnowContext) {
    await ctx.msg.send(this.clients, 'O_GONE', this.id);
    // TODO: remove from game.objects and game.grid
    this.removePendingActions();
  }

  protected removePendingActions() {
    // TODO
  }

}

export class LocalGameObject extends GameObject {

  constructor(
    public client: SnowPlayer,
    name: string,
    x: number = 0,
    y: number = 0,
    onClick: () => void | null = null,
    xOffset: number = 0,
    yOffset: number = 0,
    _originMode: OriginMode = OriginMode.NONE,
    _mirrorMode: MirrorMode = MirrorMode.NONE,
    _xScale: number = 1,
    _yScale: number = 1
  ) {
    super(client.game, name, x, y, onClick, false, xOffset, yOffset, _originMode, _mirrorMode, _xScale, _yScale);

    this.target = client;

    this.client.localObjects.add(this);
  }

  public async removeObject(ctx: SnowContext) {
    await ctx.msg.send(this.clients, 'O_GONE', this.id);
    this.client.localObjects.delete(this);
    this.removePendingActions();
  }

}