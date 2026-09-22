import { SnowContext } from "@server/socket-server/snow-data-handler";
import { MirrorMode, OriginMode } from "./snow-constants";
import { ActionCallback, ActionType, Asset, sleep, SnowGame, SnowPlayer, SnowWorld } from "./snow";

interface SpriteSettings {
  scaleX?: number
  scaleY?: number
  originMode?: OriginMode
  mirrorMode?: MirrorMode
}

type ObjectOnClick = (ctx: SnowContext, object: GameObject) => void;

type PlayStyle = 'play_once' | 'loop' | 'ping_pong';

interface AnimObjectSettings {
  playStyle: PlayStyle,
  duration: number | null,
  timeScale: number,
  reset: boolean,
  register: boolean,
  callback: ActionCallback
}

interface AnimSpriteSettings {
  backwards: boolean,
  playStyle: PlayStyle,
  duration: number
}

export function sfxName(name: string) {
  return `sfx_mg_2013_cjsnow_${name}`;
}

/**
 * Description from snowflake:
 * 
 * This class represents a game object. It is the base class for all objects in the game, such as ninjas and enemies.
 * The protocol allows for placing, moving and animating the object, as well as playing sounds.
 */
export class GameObject {

  public id: number = -1;
  public target: SnowPlayer | SnowGame;
  public onClick: ObjectOnClick = null;

  constructor(
    public game: SnowGame,
    public name: string,
    public x: number = 0,
    public y: number = 0,
    public grid: Boolean = false,
    public xOffset: number = 0,
    public yOffset: number = 0,
    private _originMode: OriginMode = OriginMode.NONE,
    private _mirrorMode: MirrorMode = MirrorMode.NONE,
    private _xScale: number = 1,
    private _yScale: number = 1
  ) {
    this.target = game;
    game?.objects.add(this);

    if (grid) {
      game.grid.add(this, x, y);
    }
  }

  /** Get the client(s) from the `target` to send stuff to  */
  protected get clients(): Array<SnowPlayer> {
    return (this.target instanceof SnowPlayer)
      ? [this.target]
      : [...this.target.players]
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
      this.clients,
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

  public async moveObject(ctx: SnowContext, x: number, y: number, duration: number = 600) {
    this.x = x;
    this.y = y;

    if (this.grid) {
      this.game.grid.move(this, x, y);
    }

    await ctx.msg.sendSnowData(
      this.clients,
      'O_SLIDE',
      this.id,
      this.x + this.xOffset,
      this.y + this.yOffset,
      128, // Z coordinate
      duration
    );
  }

  public async animateObject(
    ctx: SnowContext,
    name: string,
    settings: Partial<AnimObjectSettings> = {}
  ) {
    settings = {
      playStyle: 'play_once',
      duration: null,
      timeScale: 1,
      reset: false,
      register: true,
      callback: null,
      ...settings
    }

    const asset = ctx.world.assets.getByName(name);
    let handleId = -1;

    if (settings.reset) {
      this.removePendingActions();
    }

    if (settings.register) {
      handleId = this.game.callbacks.registerAction(name, ActionType.Animation, this.id, settings.callback);
    }

    await ctx.msg.sendSnowData(
      this.clients,
      'O_ANIM',
      this.id,
      `0:${asset.index}`,
      settings.playStyle,
      settings.duration ?? '',
      settings.timeScale,
      Number(!settings.reset),
      this.id,
      handleId
    );
  }

  public async placeSprite(ctx: SnowContext, name: string, target: SnowPlayer | null = null) {
    await ctx.msg.sendSnowData(
      target ?? this.clients,
      'O_SPRITE',
      this.id,
      `0:${ctx.world.assets.getByName(name).index}`,
      0, ''
    );
  }

  public async loadSprite(ctx: SnowContext, name: string) {
    await ctx.msg.sendSnowData(
      this.clients,
      'S_LOADSPRITE',
      `0:${ctx.world.assets.getByName(name).index}`
    );
  }

  public async animateSprite(
    ctx: SnowContext,
    start: number = 0,
    end: number = 0,
    settings: Partial<AnimSpriteSettings> = {}
  ) {
    settings = {
      backwards: false,
      playStyle: 'play_once',
      duration: 50,
      ...settings
    }

    await ctx.msg.sendSnowData(
      this.clients,
      'O_SPRITEANIM',
      this.id,
      start + 1,
      end + 1,
      Number(settings.backwards),
      settings.playStyle,
      settings.duration
    );
  }

  /** Use this to adjust the x/y scale or origin/mirror mode of this game object. */
  public async spriteSettings(ctx: SnowContext, s: SpriteSettings) {
    const scaleX = s.scaleX ?? this._xScale;
    const scaleY = s.scaleY ?? this._yScale;
    const originMode = s.originMode ?? this._originMode;
    const mirrorMode = s.mirrorMode ?? this._mirrorMode;

    await ctx.msg.sendSnowData(
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

  public async resetSpriteSettings(ctx: SnowContext) {
    if (this.mirrorMode !== MirrorMode.NONE
      || this.originMode !== OriginMode.NONE
      || this.xScale !== 1
      || this.yScale !== 1
    ) {
      await this.spriteSettings(ctx, { scaleX: 1, scaleY: 1, originMode: OriginMode.NONE, mirrorMode: MirrorMode.NONE });
    }
  }

  public async removeObject(ctx: SnowContext) {
    await ctx.msg.sendSnowData(this.clients, 'O_GONE', this.id);
    this.game.grid.remove(this);
    this.game.objects.delete(this);
    this.removePendingActions();
  }

  public async hide(ctx: SnowContext, player: SnowPlayer | null = null) {
    await this.placeSprite(ctx, 'blank_png', player);
    this.removePendingActions();
  }

  protected removePendingActions() {
    this.game.callbacks.remove(this.id);
  }

  public async playSound(
    ctx: SnowContext,
    name: string,
    target: SnowPlayer = null,
    looping: boolean = false,
    volume: number = 100,
    radius: number = 0,
    callback: ActionCallback = null
  ): Promise<Sound> {
    const sound = Sound.fromName(
      ctx.world,
      name,
      looping,
      volume,
      radius,
      this.id,
      this.id
    );
    await sound.play(ctx, target ?? this.game, this.id, callback);
    return sound;
  }

}

export class LocalGameObject extends GameObject {

  constructor(
    public client: SnowPlayer,
    name: string,
    x: number = 0,
    y: number = 0,
    xOffset: number = 0,
    yOffset: number = 0,
    _originMode: OriginMode = OriginMode.NONE,
    _mirrorMode: MirrorMode = MirrorMode.NONE,
    _xScale: number = 1,
    _yScale: number = 1
  ) {
    super(client.game, name, x, y, false, xOffset, yOffset, _originMode, _mirrorMode, _xScale, _yScale);

    this.target = client;

    this.client.localObjects.add(this);
  }

  public async removeObject(ctx: SnowContext) {
    await ctx.msg.sendSnowData(this.clients, 'O_GONE', this.id);
    this.client.localObjects.delete(this);
    this.removePendingActions();
  }

}

class Target extends LocalGameObject {

  private anims = {
    attackIntro: 'ui_target_red_attack_intro_anim',
    attackIdle: 'ui_target_red_attack_idle_anim',
    healIntro: 'ui_target_white_heal_intro_anim',
    healIdle: 'ui_target_white_heal_idle_anim',
    attackSelectedIntro: 'ui_target_green_attack_selected_intro_anim',
    attackSelectedIdle: 'ui_target_green_attack_selected_idle_anim',
    healSelectedIntro: 'ui_target_green_heal_selected_intro_anim',
    healSelectedIdle: 'ui_target_green_heal_selected_idle_anim',
  }

  private type: 'attack' | 'heal' = 'attack';
  public selected: boolean = false;

  constructor(private ninja: Ninja, x: number = -1, y: number = -1) {
    super(ninja.player, 'Target', x, y, 0.5, 1.05);
    this.onClick = this._onClick;
  }

  get object() {
    return this.game.grid.get(this.x, this.y);
  }

  public showAttack(ctx: SnowContext) {
    if (this.selected) return;

    this.type = 'attack';
    this.placeObject(ctx);
    this.animateObject(ctx, this.anims.attackIntro, { reset: true });
    this.animateObject(ctx, this.anims.attackIdle, { playStyle: 'loop' });
    this.playSound(ctx, sfxName('uitargetred'), this.client);
    // TODO: send tip
  }

  public showHeal(ctx: SnowContext) {
    if (this.selected) return;

    this.type = 'heal';
    this.placeObject(ctx);
    this.animateObject(ctx, this.anims.healIntro, { reset: true });
    this.animateObject(ctx, this.anims.healIdle, { playStyle: 'loop' });
    this.playSound(ctx, sfxName('uitargetred'), this.client);
    // TODO: send tip
  }

  private select(ctx: SnowContext) {
    if (this.selected) {
      this.deselect(ctx);
      return;
    }

    if (this.ninja.selectedTarget) this.ninja.selectedTarget.deselect(ctx);

    this.selected = true;
    this.animateObject(ctx, this.type === 'attack' ? this.anims.attackSelectedIntro : this.anims.healSelectedIntro, { reset: true });
    this.animateObject(ctx, this.type === 'attack' ? this.anims.attackSelectedIdle : this.anims.healSelectedIdle, { playStyle: 'loop' });
    this.playSound(ctx, sfxName(this.type === 'attack' ? 'uitargetselect' : 'uiselecttile'), this.client);
    // TODO: hide tip
  }

  private deselect(ctx: SnowContext) {
    this.selected = false;
    this.animateObject(ctx, this.type === 'attack' ? this.anims.attackIntro : this.anims.healIntro, { reset: true });
    this.animateObject(ctx, this.type === 'attack' ? this.anims.attackIdle : this.anims.healIdle, { playStyle: 'loop' });
  }

  private _onClick(ctx: SnowContext) {
    if (ctx.penguin.isReady) return;

    // TODO: return if game timer not running

    this.select(ctx);
  }

}

//
// Effects
//

abstract class Effect extends GameObject {
  constructor(
    game: SnowGame,
    name: string,
    x: number,
    y: number,
    xOffset: number = 0,
    yOffset: number = 0,
    // this is in SECONDS
    protected duration = 0,
    originMode: OriginMode = OriginMode.NONE,
    mirrorMode: MirrorMode = MirrorMode.NONE
  ) {
    super(game, name, x, y, false, xOffset, yOffset, originMode, mirrorMode);
  }

  public abstract play(ctx: SnowContext, ...args: unknown[]): void;
}


export class AttackTile extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'ui_tile_attack', x, y, 0.5, 0.9998);
  }

  async play(ctx: SnowContext, autoRemove: boolean = false) {
    if (this.game.grid.isValid(this.x, this.y)) {
      await this.placeObject(ctx);
      this.placeSprite(ctx, this.name);

      if (autoRemove) setTimeout(() => this.removeObject(ctx), 200);
    }
  }
}

export class HealTile extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'ui_tile_heal', x, y, 0.5, 0.9998);
  }

  async play(ctx: SnowContext, autoRemove: boolean = false) {
    if (this.game.grid.isValid(this.x, this.y)) {
      await this.placeObject(ctx);
      this.placeSprite(ctx, this.name);

      if (autoRemove) setTimeout(() => this.removeObject(ctx), 200);
    }
  }
}

export class HealParticles extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'ui_healfx_anim', x, y, 0.50005, 1.0005, 0.737);
  }

  async play(ctx: SnowContext) {
    await this.placeObject(ctx);
    await this.placeSprite(ctx, this.name);
    await this.animateSprite(ctx, 0, 10, { duration: this.duration * 1000 });
    setTimeout(() => this.removeObject(ctx), this.duration * 1000);
  }
}

export class DamageNumbers extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'ui_attack_numbers_anim', x, y, 0.5, 0.9995, 0.5);
  }

  private frames: Record<number, [number, number]> = {
    3: [0, 4],
    4: [5, 9],
    5: [10, 14],
    6: [15, 19],
    8: [20, 24],
    9: [25, 29],
    10: [30, 34],
    11: [35, 39],
    12: [40, 44],
    15: [45, 49],
    18: [50, 54],
    20: [55, 59],
    22: [60, 64],
    24: [65, 69]
  }

  async play(ctx: SnowContext, damage: number = 0) {
    const range = this.frames[damage];
    if (!range) return;
    await this.placeObject(ctx);
    await this.placeSprite(ctx, this.name);
    await this.animateSprite(ctx, ...range, { duration: this.duration * 1000 });
    setTimeout(() => this.removeObject(ctx), this.duration * 1000);
  }
}

export class HealNumbers extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'ui_heal_numbers_anim', x, y, 0.5, 0.9995, 0.5);
  }

  private frames: Record<number, [number, number]> = {
    1: [0, 4],
    6: [5, 9],
    9: [10, 14],
    10: [15, 19],
    11: [20, 24],
    12: [25, 29]
  }

  async play(ctx: SnowContext, hp: number = 0) {
    const range = this.frames[hp];
    if (!range) return;
    await this.placeObject(ctx);
    await this.placeSprite(ctx, this.name);
    await this.animateSprite(ctx, ...range, { duration: this.duration * 1000 });
    setTimeout(() => this.removeObject(ctx), this.duration * 1000);
  }
}

export class Explosion extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'effect_explosion_anim', x, y, 0.50005, 1.0005, 0.4);
  }

  async play(ctx: SnowContext) {
    await this.placeObject(ctx);
    await this.placeSprite(ctx, this.name);
    await this.animateSprite(ctx, 0, 4, { duration: this.duration * 260 });
    setTimeout(() => this.removeObject(ctx), this.duration * 1000);
  }
}

export class SnowProjectile extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'snow_projectile', x, y, 0.5, 1, 0.2);
  }

  async play(ctx: SnowContext, tx: number = 0, ty: number = 0) {
    this.setOffset(tx, ty);
    await this.placeObject(ctx);

    await this.setMirrorMode(ctx, tx, ty);
    await this.placeSprite(ctx, this.getAnimName(tx, ty));
    await this.moveObject(ctx, tx, ty, this.duration * 1000);
  }

  private async setMirrorMode(ctx: SnowContext, tx: number, ty: number) {
    const xDiff = tx - this.x;
    const yDiff = ty - this.y;
    
    let mirrorMode: MirrorMode = null;

    if (xDiff < 0 && yDiff > 0) {
      mirrorMode = MirrorMode.XY;
    } else if (xDiff < 0) {
      mirrorMode = MirrorMode.X;
    } else if (yDiff > 0) {
      mirrorMode = MirrorMode.Y;
    }

    if (mirrorMode !== null) {
      this.spriteSettings(ctx, { mirrorMode });
    }
  }

  private setOffset(tx: number, ty: number) {
    const xDiff = tx - this.x;
    const yDiff = ty - this.y;

    // If yDiff is <= 0, player is under target, otherwise above
    this.yOffset = yDiff <= 0 ? 2.2 : 1.5;
    // If xDiff is < 0, player is behind target, otherwise in front
    this.xOffset = xDiff < 0 ? 1 : 0.5;
  }

  private getAnimName(tx: number, ty: number) {
    const xDiff = Math.abs(tx - this.x);
    const yDiff = Math.abs(ty - this.y);

    if (xDiff > yDiff && yDiff === 0) {
      return 'snowninja_projectilehoriz_anim';
    }
    if (xDiff < yDiff && xDiff === 0) {
      return 'snowninja_projectilevert_anim';
    }
    return 'snowninja_projectileangle_anim';
  }
}

export class FireProjectile extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'fire_projectile', x, y, 0.5, 1);
  }

  async play(ctx: SnowContext, tx: number = 0, ty: number = 0) {
    if ((tx - this.x) < 0) this.xOffset = -1;
    await this.placeObject(ctx);
    if ((tx - this.x) < 0) await this.spriteSettings(ctx, { mirrorMode: MirrorMode.X });

    await this.placeSprite(ctx, this.getAnimName(tx, ty));
  }

  private getAnimName(tx: number, ty: number) {
    const xDiff = tx - this.x;
    const yDiff = ty - this.y;

    const dist = Math.abs(this.x - tx) + Math.abs(this.y - ty);

    const name = (n: string) => `fireninja_projectile_${n}_anim`;

    if (xDiff === 0 && yDiff < 0) {
      return name(dist === 1 ? 'up' : 'upfar');
    } else if (xDiff === 0 && yDiff > 0) {
      return name(dist === 1 ? 'down' : 'downfar');
    } else if (yDiff === 0) {
      return name(dist === 1 ? 'right' : 'rightfar');
    } else if (yDiff > 0) {
      return name('angledown');
    } else if (yDiff < 0) {
      return name('angleup');
    }
    return name('right');
  }
}

export class SlyProjectile extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'sly_projectile_anim', x, y, 0.5, 1, 0.5);
  }

  async play(ctx: SnowContext, tx: number, ty: number) {
    if (this.x > tx) {
      this.xOffset = 1;
      this.yOffset = 0.8;
    }
    await this.placeObject(ctx);
    await this.placeSprite(ctx, this.name);
  
    this.xOffset = 0.5;
    this.yOffset = 1;
    await this.moveObject(ctx, tx, ty, this.duration * 1000);
  }
}

export class ScrapImpact extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'scrap_attackeffect_anim', x, y, 0.5, 1, 0.4);
  }

  async play(ctx: SnowContext) {
    await this.placeObject(ctx);
    await this.placeSprite(ctx, this.name);
    setTimeout(() => this.removeObject(ctx), this.duration * 1000);
  }
}

export class ScrapImpactLittle extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'scrap_attacklittleeffect_anim', x, y, 0.5, 1, 0.4);
  }

  async play(ctx: SnowContext) {
    await this.placeObject(ctx);
    await this.placeSprite(ctx, this.name);
  }
}

export class ScrapImpactSurroundings {
  static async play(ctx: SnowContext, centerX: number, centerY: number) {
    const effects: (AttackTile | ScrapImpactLittle)[] = [];

    for (let xo = -1; xo < 2; xo++) {
      for (let yo = -1; yo < 2; yo++) {
        const x = centerX + xo;
        const y = centerY + yo;

        if (!ctx.game.grid.isValid(x, y)) continue;

        const tile = new AttackTile(ctx.game, x, y);
        const impact = new ScrapImpactLittle(ctx.game, x, y);
        tile.play(ctx);
        impact.play(ctx);
        effects.push(tile, impact);
      }
    }

    await sleep(350);

    effects.forEach(e => e.removeObject(ctx));
  }
}

class ScrapProjectile extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'scrap_projectile', x, y, 0.25, 1.5);
  }

  async play(ctx: SnowContext, tx: number, ty: number, anim: string) {
    if (tx < 0 || ty > 8 || ty < 0 || ty > 4) return;

    await this.placeObject(ctx);
    await this.placeSprite(ctx, `scrap_projectile${anim}_anim`);
    await this.moveObject(ctx, tx, ty);
  }

  async playEast(ctx: SnowContext, tx: number, ty: number) {
    await this.play(ctx, tx, ty, 'east');
  }

  async playNorth(ctx: SnowContext, tx: number, ty: number) {
    await this.play(ctx, tx, ty, 'north');
  }

  async playNortheast(ctx: SnowContext, tx: number, ty: number) {
    await this.play(ctx, tx, ty, 'northeast');
  }
}

export class ScrapProjectileImpact {
  static async play(ctx: SnowContext, x: number, y: number) {
    const p1 = new ScrapProjectile(ctx.game, x, y);
    p1.playEast(ctx, x + 1, y);

    const p2 = new ScrapProjectile(ctx.game, x, y);
    p2.playEast(ctx, x - 1, y);

    const p3 = new ScrapProjectile(ctx.game, x, y);
    p3.playNorth(ctx, x, y - 0.8);

    const p4 = new ScrapProjectile(ctx.game, x, y);
    p4.playNorth(ctx, x, y + 0.8);

    const p5 = new ScrapProjectile(ctx.game, x, y);
    p5.playNortheast(ctx, x + 1, y - 0.8);

    const p6 = new ScrapProjectile(ctx.game, x, y);
    p6.playNortheast(ctx, x - 1, y - 0.8);

    const p7 = new ScrapProjectile(ctx.game, x, y);
    p5.playNortheast(ctx, x + 1, y + 0.8);

    const p8 = new ScrapProjectile(ctx.game, x, y);
    p6.playNortheast(ctx, x - 1, y + 0.8);

    await sleep(400);

    [p1, p2, p3, p4, p5, p6, p7, p8].forEach(e => e.removeObject(ctx));
  }
}

export class TankSwipe extends Effect {
  constructor(game: SnowGame, x: number, y: number, dir: 'vert' | 'horiz') {
    super(game, `tank_swipe_${dir}_anim`, x, y, 0.5005, 1.005);
  }

  async play(ctx: SnowContext) {
    await this.placeObject(ctx);
    await this.placeSprite(ctx, this.name);
    await this.animateSprite(ctx, 0, 6, { duration: 400 });
  }
}

export class WaterPowerBeam extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'waterninja_powercard_water_loop_anim', x, y, 0.5, 1);
  }

  async play(ctx: SnowContext) {
    await this.placeObject(ctx);
    await this.placeSprite(ctx, this.name);
  }
}

export class FirePowerBeam extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    // TODO: is duration needed? its not used anywhere here(?)
    super(game, 'fireninja_powersky_anim', x, y, 0.5, 1, 1.35);
  }

  async play(ctx: SnowContext) {
    await this.placeObject(ctx);
    await this.placeSprite(ctx, this.name);
  }
}

export class SnowPowerBeam extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    // TODO: is duration needed? its not used anywhere here(?)
    super(game, 'snowninja_beam_anim', x, y, 0.5, 1.55);
  }

  async play(ctx: SnowContext) {
    await this.placeObject(ctx);
    await this.placeSprite(ctx, this.name);
  }
}

export class SnowIgloo extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    // TODO: is duration needed? its not used anywhere here(?)
    super(game, 'snowninja_igloodrop', x, y, 0.5, 2, 2, OriginMode.BOTTOM_MIDDLE);
  }

  async play(ctx: SnowContext, playSound: boolean = true) {
    await this.placeObject(ctx);
    await this.animateObject(ctx, 'snowninja_igloodrop_anim1', { reset: true });
    await this.animateObject(ctx, 'snowninja_igloodrop_anim2');
    await this.animateObject(ctx, 'blank_png', { playStyle: 'loop' });

    if (playSound) {
      setTimeout(() => this.playSound(ctx, sfxName('impactpowercardsnow')), 1200);
    }
  }
}

export class WaterFishDrop extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    // TODO: 1.8 duration?
    super(game, 'waterninja_powercard_fishdrop_anim', x, y, 0.5, 2.4, 1.7, OriginMode.BOTTOM_MIDDLE);
  }

  async play(ctx: SnowContext) {
    await this.placeObject(ctx);
    await this.animateObject(ctx, this.name);
    await this.animateSprite(ctx, 0, 26, { duration: this.duration * 1000 });
    await this.animateObject(ctx, 'blank_png');
  }
}

export class FirePowerBottle extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'fireninja_powerbottle_anim', x, y, 0.5, 2, 1.06, OriginMode.BOTTOM_MIDDLE);
  }

  async play(ctx: SnowContext) {
    await this.placeObject(ctx);
    await this.animateObject(ctx, this.name);
    await this.animateSprite(ctx, 0, 16, { duration: this.duration * 1000 });
    await this.animateObject(ctx, 'blank_png');
  }
}

export class Flame extends Effect {
  public roundsLeft: number = 2;

  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'effect_resisualfiredamage_anim', x, y, 0.5, 1.0025);
  }

  async play(ctx: SnowContext) {
    await this.placeObject(ctx);
    await this.placeSprite(ctx, this.name);
  }
}

export class Shield extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'effect_shield', x, y, 0.5, 1.0015);
  }

  async play(ctx: SnowContext) {
    await this.placeObject(ctx);
    await this.placeSprite(ctx, 'effect_shield_loop');
  }

  async pop(ctx: SnowContext) {
    await this.placeObject(ctx);
    await this.placeSprite(ctx, 'effect_shieldpop_anim');
    await this.animateSprite(ctx, 0, 3, { duration: 200 });
    setTimeout(() => this.removeObject(ctx), 200);
  }
}

export class Rage extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'effect_rage', x, y, 0.5, 1.0025);
  }

  async play(ctx: SnowContext) {
    await this.placeObject(ctx);
    await this.placeSprite(ctx, 'effect_rageloop_anim');
  }

  async use(ctx: SnowContext, x: number, y: number) {
    await this.moveObject(ctx, x, y);
    await this.placeSprite(ctx, 'effect_shieldpop_anim');
    await this.animateSprite(ctx, 0, 11, { duration: 750 });
    setTimeout(() => this.removeObject(ctx), 700);
  }
}

export class MemberReviveBeam extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'effect_revivebeam_anim', x, y, 0.5, 1, 0, OriginMode.BOTTOM_MIDDLE);
  }

  async play(ctx: SnowContext) {
    await this.placeObject(ctx);
    await this.placeSprite(ctx, this.name);
    await this.animateSprite(ctx, 0, 29, { duration: 1200 });
  }
}

// TODO: tusk effects

//
// Ninjas
//

export abstract class Ninja extends GameObject {
  hp: number;
  moveDuration: number = 600;

  heals: number = 0;
  ghost: GameObject;
  healthBar: GameObject;
  targets: Target[] = [];
  shield: Shield | null = null;
  rage: Rage | null = null;

  constructor(
    game: SnowGame,
    name: string,
    public player: SnowPlayer,
    x: number,
    y: number,
    public maxHp: number,
    public range: number,
    public attack: number,
    public move: number
  ) {
    super(game, name, x, y, true, 0.5, 1);

    this.hp = maxHp;

    this.ghost = new GameObject(
      game,
      `${this.name.toLowerCase()}ninja_move_ghost`,
      -1, -1,
      true,
      0.5, 1
    );

    this.ghost.onClick = this.onGhostClick;

    this.healthBar = new GameObject(
      game,
      'reghealthbar_animation',
      this.x, this.y,
      false,
      0.5, 1.005
    );
  }

  get selectedTarget(): Target | null {
    return this.targets.find(t => t.selected) ?? null;
  }

  get selectedObject(): GameObject | null {
    return this.selectedTarget !== null ? this.selectedTarget.object : null;
  }

  get isReviving() {
    return (this.selectedObject instanceof Ninja) && this.selectedObject.hp <= 0;
  }

  public moveNinja(ctx: SnowContext, x: number, y: number) {
    if (this.hp <= 0 || ctx.penguin.disconnected) {
      return;
    }
    
    if (this.x === x && this.y === y) {
      return;
    }

    if (x < 0 || y < 0) {
      return;
    }

    for (const ninja of this.game.ninjas) {
      if (ninja.selectedObject === this) {
        ninja.selectedTarget.moveObject(ctx, x, y);
      }
    }

    this.moveAnimation(ctx);
    this.moveObject(ctx, x, y);
    this.moveSound(ctx);
  }

  public placeHealthbar(ctx: SnowContext) {
    this.healthBar.placeObject(ctx);
    this.healthBar.placeSprite(ctx, this.healthBar.name);
    this.resetHealthbar(ctx);
  }

  public animateHealthbar(ctx: SnowContext, _startHp: number, _endHp: number, duration = 500) {
    const backwards = _endHp > _startHp;

    const startHp = backwards ? _endHp : _startHp;
    const endHp = backwards ? _startHp : _endHp;

    const start = 60 - Math.floor((startHp / this.maxHp) * 60) - 1;
    const end = 60 - Math.floor((endHp / this.maxHp) * 60) - 1;

    this.healthBar.animateSprite(ctx, start, end, { backwards, duration });
  }

  public resetHealthbar(ctx: SnowContext) {
    this.healthBar.animateSprite(ctx);
  }

  public setHealth(ctx: SnowContext, hp: number, showEffects: boolean = true) {
    if (hp < this.hp && this.shield !== null) {
      this.shield.pop(ctx);
      this.shield = null;
    }

    if (this.player.disconnected && this.hp <= 0) return;

    hp = Math.max(0, Math.min(hp, this.maxHp));

    this.animateHealthbar(ctx, this.hp, hp);

    if (hp >= this.hp) {
      new HealNumbers(this.game, this.x, this.y).play(ctx, hp - this.hp);
      this.reviveAnimation(ctx);
      this.hp = hp;
      return;
    }

    if (showEffects) {
      new AttackTile(this.game, this.x, this.y).play(ctx, true);
      new DamageNumbers(this.game, this.x, this.y).play(ctx, this.hp - hp);
    }

    if (hp > 0) {
      this.hitAnimation(ctx);
      // TODO: this.player.updateCards()
      this.hp = hp;
      return;
    }

    if (this.hp <= 0) return;

    // Ninja has become KO'd
    this.hp = hp;
    this.targets = [];
    this.koAnimation(ctx);

    this.rage?.removeObject(ctx);

    if (!this.player.disconnected) {
      this.player.wasKO = true;
      // TODO: update cards
      this.koSound(ctx);
    }

    // TODO: reset targets if we are any ninja's selected object
  }

  public get placedGhost() {
    return this.ghost.x !== 1 && this.ghost.y !== 1;
  }

  private onGhostClick(ctx: SnowContext, object: GameObject) {
    if (ctx.penguin.isReady) {
      return;
    }

    // TODO: check selected card

    if (ctx.penguin.element !== this.name.toLowerCase()) {
      // substitute for client.ninja != self, maybe good enough?
      return;
    }

    // TODO: if selected member card, return

    this.hideGhost(ctx);
    this.showTargets(ctx);
  }

  public async placeGhost(ctx: SnowContext, x: number, y: number) {
    if (ctx.penguin.isReady) {
      return; // TODO: also return if game timer is not running
    }

    if (this.hp <= 0) {
      this.hideGhost(ctx);
      return;
    }

    if (this.ghost.x === x && this.ghost.y === y) {
      this.hideGhost(ctx);
      this.showTargets(ctx);
      return;
    }

    if (!this.game.grid.canMove(x, y)) {
      return;
    }

    this.game.grid.move(this.ghost, x, y);
    await this.ghost.placeObject(ctx);
    await this.ghost.placeSprite(ctx, this.ghost.name);
    await this.ghost.playSound(ctx, sfxName('uiselecttile'));
    this.showTargets(ctx);
  }

  public async hideGhost(ctx: SnowContext, reset: boolean = true) {
    this.game.grid.remove(this.ghost);
    this.ghost.hide(ctx);

    if (reset) {
      this.ghost.x = -1;
      this.ghost.y = -1;
    }
  }

  public async showTargets(ctx: SnowContext) {
    this.removeTargets(ctx);

    const healable = this.healableTiles(
      this.placedGhost ? this.ghost.x : this.x,
      this.placedGhost ? this.ghost.y : this.y
    );

    for (const tile of healable) {
      const t = new Target(this, tile.x, tile.y);
      this.targets.push(t);
      t.showHeal(ctx);
    }

    const attackable = this.attackableTiles(
      this.placedGhost ? this.ghost.x : this.x,
      this.placedGhost ? this.ghost.y : this.y
    );

    for (const tile of attackable) {
      // TODO: handle tusk
      const t = new Target(this, tile.x, tile.y);
      this.targets.push(t);
      t.showAttack(ctx);
    }
  }

  public hideTargets(ctx: SnowContext) {
    this.targets.forEach(t => t.hide(ctx));
  }

  public removeTargets(ctx: SnowContext) {
    this.targets.forEach(t => t.removeObject(ctx));
    this.targets.length = 0;
  }

  private healableTiles(tx: number, ty: number) {
    const healable: GameObject[] = [];

    if (this.hp <= 0) return healable;

    for (const ninja of this.game.ninjas) {
      if (ninja.player.disconnected || ninja === this || ninja.hp === ninja.maxHp) continue;

      if (ninja.hp > 0 && this.name === 'Snow') {
        const distance = this.game.grid.distance([ninja.x, ninja.y], [tx, ty])

        if (distance <= this.range) {
          healable.push(this.game.grid.getTile(ninja.x, ninja.y));
        }
      } else {
        if (ninja.hp > 0) continue;

        const tiles = this.game.grid.surroundingTiles(ninja.x, ninja.y);

        if (tiles.includes(this.game.grid.getTile(tx, ty))) {
          healable.push(this.game.grid.getTile(ninja.x, ninja.y));
        }
      }
    }
    
    return healable;
  }

  private attackableTiles(tx: number, ty: number) {
    const attackable: GameObject[] = [];

    if (this.hp <= 0) return attackable;

    for (const tile of this.game.grid.tiles) {
      const target = this.game.grid.get(tile.x, tile.y);

      if (!(target instanceof Enemy)) continue;

      const distance = this.game.grid.distance([tile.x, tile.y], [target.x, target.y]);

      if (distance <= this.range) attackable.push(tile);

      // TODO if (target.tileRange <= 0) continue;

      /*const surrounding = this.game.grid.surroundingTiles(tile.x, tile.y, target.tileRange);

      for (const sTile of surrounding) {
        const distance = this.game.grid.distance([sTile.x, sTile.y], [tx, ty]);
        if (distance <= this.range) attackable.push(tile);
      }*/
    }
    
    return attackable;
  }

  public tilesInRange(target: GameObject = this) {
    return this.game.grid.tiles.filter(tile => {
      const distance = this.game.grid.distance([target.x, target.y], [tile.x, tile.y]);
      return distance <= this.move;
    });
  }

  public ghostTilesInRange() {
    return this.tilesInRange(this.placedGhost ? this.ghost : this);
  }

  public movableTiles() {
    return this.tilesInRange().filter(t => this.game.grid.canMove(t.x, t.y));
  }

  public movableGhostTiles() {
    return this.ghostTilesInRange().filter(t => this.game.grid.canMove(t.x, t.y));
  }

  public abstract idleAnimation(ctx: SnowContext): Promise<void>;
  public abstract moveAnimation(ctx: SnowContext): Promise<void>;
  public abstract koAnimation(ctx: SnowContext): Promise<void>;
  public abstract attackAnimation(ctx: SnowContext, ...rest: unknown[]): Promise<void>;
  public abstract winAnimation(ctx: SnowContext): Promise<void>;
  public abstract hitAnimation(ctx: SnowContext): Promise<void>;
  public abstract healAnimation(ctx: SnowContext): Promise<void>;
  public abstract reviveAnimation(ctx: SnowContext): Promise<void>;
  public abstract reviveOtherAnimation(ctx: SnowContext): Promise<void>;
  public abstract reviveOtherAnimationLoop(ctx: SnowContext): Promise<void>;
  public abstract reviveMemberCardAnimation(ctx: SnowContext): Promise<void>;
  public abstract powerAnimation(ctx: SnowContext): Promise<void>;

  public async koSound(ctx: SnowContext) {
    await this.playSound(ctx, sfxName('penguinground'));
  }
  public async moveSound(ctx: SnowContext) {
    await this.playSound(ctx, sfxName('footsteppenguin'));
  }
  public abstract attackSound(ctx: SnowContext): Promise<void>;
  public abstract powercardSound(ctx: SnowContext): Promise<void>;
}

export class FireNinja extends Ninja {

  constructor(game: SnowGame, player: SnowPlayer, x: number, y: number) {
    super(game, 'Fire', player, x, y, 30, 2, 8, 2);
  }

  async idleAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'fireninja_idle_anim', { playStyle: 'loop', register: false });
  }

  async moveAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'fireninja_move_anim', { reset: true });
    await this.idleAnimation(ctx);
  }

  async koAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'fireninja_kostart_anim', { reset: true });
    await this.animateObject(ctx, 'fireninja_koloop_anim', { playStyle: 'loop' });
  }

  async hitAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'fireninja_hit_anim', { reset: true });

    if (this.isReviving) {
      await this.reviveOtherAnimationLoop(ctx);
    } else {
      await this.idleAnimation(ctx);
    }
  }

  async attackAnimation(ctx: SnowContext, x: number, y: number) {
    if (this.x > x) this.spriteSettings(ctx, { mirrorMode: MirrorMode.X });

    this.attackSound(ctx);
    await this.animateObject(ctx, 'fireninja_attack_anim', { reset: true, callback: () => this.resetSpriteSettings(ctx) });
    this.idleAnimation(ctx);

    await sleep(1450);
    await this.projectileAnimation(ctx, x, y);
  }

  private async projectileAnimation(ctx: SnowContext, x: number, y: number) {
    const pro = new FireProjectile(this.game, this.x, this.y);
    await pro.play(ctx, x, y);
    setTimeout(() => pro.removeObject(ctx), 250);
  }

  async winAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'fireninja_celebratestart_anim', { reset: true });
    await this.animateObject(ctx, 'fireninja_celebrateloop_anim', { playStyle: 'loop' });
  }

  async reviveAnimation(ctx: SnowContext) {
    this.animateObject(ctx, 'fireninja_revived_anim', { reset: true });
    new HealParticles(this.game, this.x, this.y).play(ctx);

    if (this.isReviving) {
      await this.reviveOtherAnimationLoop(ctx);
    } else {
      await this.idleAnimation(ctx);
    }
  }

  async reviveOtherAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'fireninja_reviveother_anim', { reset: true });
    await this.reviveOtherAnimationLoop(ctx);
  }

  async reviveOtherAnimationLoop(ctx: SnowContext) {
    await this.animateObject(ctx, 'fireninja_reviveotherloop_anim', { playStyle: 'loop' });
  }

  async reviveMemberCardAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'fireninja_member_revive', { reset: true });
    await this.idleAnimation(ctx);
  }

  async powerAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'fireninja_power_anim', { reset: true });
    await this.idleAnimation(ctx);
    await this.powercardSound(ctx);
    await sleep(1000);
  }

  async healAnimation() {}

  async moveSound(ctx: SnowContext) {
    await this.playSound(ctx, sfxName('footsteppenguinfire'));
  }

  async attackSound(ctx: SnowContext) {
    await this.playSound(ctx, sfxName('attackfire'));
  }

  async powercardSound(ctx: SnowContext) {
    await this.playSound(ctx, sfxName('attackpowercardfire'));
  }

}

export class WaterNinja extends Ninja {

  constructor(game: SnowGame, player: SnowPlayer, x: number, y: number) {
    super(game, 'Water', player, x, y, 40, 1, 10, 2);
  }

  async idleAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'waterninja_idle_anim', { playStyle: 'loop', register: false });
  }

  async moveAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'waterninja_move_anim', { reset: true });
    await this.idleAnimation(ctx);
  }

  async koAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'waterninja_kostart_anim', { reset: true });
    await this.animateObject(ctx, 'waterninja_koloop_anim', { playStyle: 'loop' });
  }

  async hitAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'waterninja_hit_anim', { reset: true });

    if (this.isReviving) {
      await this.reviveOtherAnimationLoop(ctx);
    } else {
      await this.idleAnimation(ctx);
    }
  }

  async attackAnimation(ctx: SnowContext, x: number, y: number) {
    if (this.x > x) this.spriteSettings(ctx, { mirrorMode: MirrorMode.X });

    await this.animateObject(ctx, 'waterninja_attack_anim', { reset: true, callback: () => this.resetSpriteSettings(ctx) });
    this.idleAnimation(ctx);

    await sleep(450);
    this.attackSound(ctx);
  }

  async winAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'waterninja_celebrate_anim', { playStyle: 'ping_pong', reset: true });
  }

  async reviveAnimation(ctx: SnowContext) {
    this.animateObject(ctx, 'waterninja_revived_anim', { reset: true });
    new HealParticles(this.game, this.x, this.y).play(ctx);

    if (this.isReviving) {
      await this.reviveOtherAnimationLoop(ctx);
    } else {
      await this.idleAnimation(ctx);
    }
  }

  async reviveOtherAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'waterninja_revive_other_intro_anim', { reset: true });
    await this.reviveOtherAnimationLoop(ctx);
  }

  async reviveOtherAnimationLoop(ctx: SnowContext) {
    await this.animateObject(ctx, 'waterninja_revive_other_loop_anim', { playStyle: 'loop' });
  }

  async reviveMemberCardAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'waterninja_member_revive', { reset: true });
    await this.idleAnimation(ctx);
  }

  async powerAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'waterninja_powercard_summon_anim', { reset: true });
    await this.idleAnimation(ctx);
    await this.powercardSound(ctx);
    await sleep(650);
  }

  async healAnimation() {}

  async attackSound(ctx: SnowContext) {
    await this.playSound(ctx, sfxName('attackwater'));
  }

  async powercardSound(ctx: SnowContext) {
    await this.playSound(ctx, sfxName('attackpowercardwater'));
  }

}

export class SnowNinja extends Ninja {

  constructor(game: SnowGame, player: SnowPlayer, x: number, y: number) {
    super(game, 'Snow', player, x, y, 25, 3, 6, 3);
  }

  async idleAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'snowninja_idle_anim', { playStyle: 'loop', register: false });
  }

  async moveAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'snowninja_move_anim', { reset: true });
    await this.idleAnimation(ctx);
  }

  async koAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'snowninja_kostart_anim', { reset: true });
    await this.animateObject(ctx, 'snowninja_koloop_anim', { playStyle: 'loop' });
  }

  async hitAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'snowninja_hit_anim', { reset: true });

    if (this.isReviving) {
      await this.reviveOtherAnimationLoop(ctx);
    } else {
      await this.idleAnimation(ctx);
    }
  }

  async attackAnimation(ctx: SnowContext, x: number, y: number) {
    if (this.x > x) this.spriteSettings(ctx, { mirrorMode: MirrorMode.X });

    this.attackSound(ctx);
    await this.animateObject(ctx, 'snowninja_attack_anim', { reset: true, callback: () => this.resetSpriteSettings(ctx) });
    this.idleAnimation(ctx);

    await sleep(300);
    await this.projectileAnimation(ctx, x, y);
  }

  private async projectileAnimation(ctx: SnowContext, x: number, y: number) {
    // this is jank according to snowflake, and yeah it kinda is
    let pro = new SnowProjectile(this.game, this.x, this.y);
    await pro.play(ctx, x, y);
    await sleep(200);
    pro.removeObject(ctx);

    pro = new SnowProjectile(this.game, this.x, this.y);
    await pro.play(ctx, x, y);
    await sleep(200);
    setTimeout(() => pro.removeObject(ctx), 200);
  }

  async winAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'snowninja_celebrate_anim', { playStyle: 'ping_pong', reset: true });
  }

  async reviveAnimation(ctx: SnowContext) {
    this.animateObject(ctx, 'snowninja_revived_anim', { reset: true });
    new HealParticles(this.game, this.x, this.y).play(ctx);

    if (this.isReviving) {
      await this.reviveOtherAnimationLoop(ctx);
    } else {
      await this.idleAnimation(ctx);
    }
  }

  async reviveOtherAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'snowninja_reviveothersintro_anim', { reset: true });
    await this.reviveOtherAnimationLoop(ctx);
  }

  async reviveOtherAnimationLoop(ctx: SnowContext) {
    await this.animateObject(ctx, 'snowninja_reviveothersloop_anim', { playStyle: 'loop' });
  }

  async reviveMemberCardAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'snowninja_member_revive', { reset: true });
    await this.idleAnimation(ctx);
  }

  async powerAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'snowninja_powercard_anim', { reset: true });
    await this.idleAnimation(ctx);
    await this.powercardSound(ctx);
    await sleep(450);
  }

  async healAnimation(ctx: SnowContext) {
    await this.animateObject(ctx, 'snowninja_heal_anim', { reset: true });
    await this.idleAnimation(ctx);
  }

  async attackSound(ctx: SnowContext) {
    await this.playSound(ctx, sfxName('attacksnow'));
  }

  async powercardSound(ctx: SnowContext) {
    await this.playSound(ctx, sfxName('attackpowercardsnow'));
  }

}

//
// Enemies
//

export abstract class Enemy extends GameObject {

}

export class Sound implements Asset {
  constructor(
    public index: number,
    public name: string,
    private looping: boolean = false,
    private volume: number = 100,
    private radius: number = 0,
    private gameObjectId: number = -1,
    private resObjectId: number = -1
  ) {}

  static fromIndex(
    world: SnowWorld,
    index: number,
    looping: boolean = false,
    volume: number = 100,
    radius: number = 0,
    gameObjectId: number = -1,
    resObjectId: number = -1
  ) {
    const asset = world.soundAssets.getByIndex(index);
    return new Sound(asset.index, asset.name, looping, volume, radius, gameObjectId, resObjectId);
  }

  static fromName(
    world: SnowWorld,
    name: string,
    looping: boolean = false,
    volume: number = 100,
    radius: number = 0,
    gameObjectId: number = -1,
    resObjectId: number = -1
  ) {
    const asset = world.soundAssets.getByName(name);
    return new Sound(asset.index, asset.name, looping, volume, radius, gameObjectId, resObjectId);
  }

  // TODO: instead of 'target' param, grab either player
  // or game from ctx, have a boolean param to determine which one
  // (whether this is possible depends on how this is used)
  public async play(ctx: SnowContext, target: SnowGame | SnowPlayer, objectId: number = -1, callback: ActionCallback = null) {
    let handleId = -1;

    if (target instanceof SnowGame) {
      handleId = target.callbacks.registerAction(this.name, ActionType.Sound, objectId, callback);
    }

    const targets = (target instanceof SnowPlayer) ? [target] : [...target.players];

    await ctx.msg.sendSnowData(
      targets,
      'FX_PLAYSOUND',
      `0:${this.index}`,
      handleId,
      Number(this.looping),
      this.volume,
      this.gameObjectId,
      this.radius,
      this.resObjectId
    )
  }

  public stop(ctx: SnowContext, target: SnowGame) {
    const action = target.callbacks.byName(this.name);

    if (action) {
      ctx.msg.sendSnowData(
        target.players,
        'FX_STOPSOUND',
        `0:${action.handleId}`,
      );
    }
  }
}