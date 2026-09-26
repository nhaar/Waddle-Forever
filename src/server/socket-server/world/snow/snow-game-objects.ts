import { SnowContext, SnowPenguinContext } from "@server/socket-server/snow-data-handler";
import { MirrorMode, OriginMode, TipPhase, Windows } from "./snow-constants";
import { ActionCallback, ActionType, Asset, sleep, SnowGame, SnowPlayer, SnowWorld } from "./snow";
import { choose } from "@common/utils";
import { Card, CardColor, CardElement } from "@server/game-logic/cards";

interface SpriteSettings {
  scaleX?: number
  scaleY?: number
  originMode?: OriginMode
  mirrorMode?: MirrorMode
}

type ObjectOnClick = (ctx: SnowPenguinContext, object: GameObject) => void;

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
    private _yScale: number = 1,
    public target: SnowPlayer | SnowGame = game
  ) {
    if (target instanceof SnowGame) {
      this.game?.objects.add(this);
    } else {
      (this.target as SnowPlayer).localObjects.add(this);
    }

    if (this.grid) {
      this.game.grid.add(this, this.x, this.y);
    }
  }

  protected get ctx() {
    return this.game.ctx;
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

  public async placeObject() {
    await this.ctx.msg.sendSnowData(
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
      Number(Boolean(this.onClick)),
      0
    );
  }

  public async moveObject(x: number, y: number, duration: number = 600) {
    this.x = x;
    this.y = y;

    if (this.grid) {
      this.game.grid.move(this, x, y);
    }

    await this.ctx.msg.sendSnowData(
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
    name: string,
    settings: Partial<AnimObjectSettings> = {},
    target: SnowPlayer | null = null
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

    const asset = this.ctx.world.assets.getByName(name);
    let handleId = -1;

    if (settings.reset) {
      this.removePendingActions(false);
    }

    if (settings.register) {
      handleId = this.game.callbacks.registerAction(name, ActionType.Animation, this.id, settings.callback);
    }

    await this.ctx.msg.sendSnowData(
      target ?? this.clients,
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

  public async placeSprite(name: string = this.name, target: SnowPlayer | null = null) {
    await this.ctx.msg.sendSnowData(
      target ?? this.clients,
      'O_SPRITE',
      this.id,
      `0:${this.ctx.world.assets.getByName(name).index}`,
      0, ''
    );
  }

  public async loadSprite(name: string) {
    await this.ctx.msg.sendSnowData(
      this.clients,
      'S_LOADSPRITE',
      `0:${this.ctx.world.assets.getByName(name).index}`
    );
  }

  public async animateSprite(
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

    await this.ctx.msg.sendSnowData(
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
  // TODO: now that ctx doesn't need passed here,
  // we can use normal setters to change this
  public async spriteSettings(s: SpriteSettings) {
    const scaleX = s.scaleX ?? this._xScale;
    const scaleY = s.scaleY ?? this._yScale;
    const originMode = s.originMode ?? this._originMode;
    const mirrorMode = s.mirrorMode ?? this._mirrorMode;

    await this.ctx.msg.sendSnowData(
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

  public async resetSpriteSettings() {
    if (this.mirrorMode !== MirrorMode.NONE
      || this.originMode !== OriginMode.NONE
      || this.xScale !== 1
      || this.yScale !== 1
    ) {
      await this.spriteSettings({ scaleX: 1, scaleY: 1, originMode: OriginMode.NONE, mirrorMode: MirrorMode.NONE });
    }
  }

  public async removeObject() {
    await this.ctx.msg.sendSnowData(this.clients, 'O_GONE', this.id);
    this.game.grid.remove(this);
    this.game.objects.delete(this);
    this.removePendingActions();
  }

  public async hide(player: SnowPlayer | null = null) {
    await this.placeSprite('blank_png', player);
    await this.animateObject('blank_png', {}, player);
    this.removePendingActions();
  }

  protected removePendingActions(fireAnims: boolean = true) {
    this.game.callbacks.remove(this.id, fireAnims);
  }

  public async playSound(
    name: string,
    target: SnowPlayer = null,
    looping: boolean = false,
    volume: number = 100,
    radius: number = 0,
    callback: ActionCallback = null
  ): Promise<Sound> {
    const sound = Sound.fromName(
      this.ctx.world,
      name,
      looping,
      volume,
      radius,
      this.id,
      this.id
    );
    await sound.play(this.ctx, target ?? this.game, this.id, callback);
    return sound;
  }

}

export class LocalGameObject extends GameObject {

  constructor(
    public client: SnowPlayer,
    game: SnowGame,
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
    super(game, name, x, y, false, xOffset, yOffset, _originMode, _mirrorMode, _xScale, _yScale, client);
  }

  public async removeObject() {
    this.client.localObjects.delete(this);
    await this.ctx.msg.sendSnowData(this.clients, 'O_GONE', this.id);
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

  constructor(private ninja: Ninja, x: number, y: number) {
    super(ninja.player, ninja.game, 'Target', x, y, 0.5, 1.05);
  }

  get object() {
    return this.game.grid.get(this.x, this.y);
  }

  public showAttack() {
    if (this.selected) return;

    this.type = 'attack';
    this.placeObject();
    this.animateObject(this.anims.attackIntro, { reset: true });
    this.animateObject(this.anims.attackIdle, { playStyle: 'loop' });
    this.playSound(sfxName('uitargetred'), this.client);
    this.game.sendTip(TipPhase.ATTACK, this.client);
  }

  public showHeal() {
    if (this.selected) return;

    this.type = 'heal';
    this.placeObject();
    this.animateObject(this.anims.healIntro, { reset: true });
    this.animateObject(this.anims.healIdle, { playStyle: 'loop' });
    this.playSound(sfxName('uitargetred'), this.client);
    this.game.sendTip(TipPhase.HEAL, this.client);
  }

  private select() {
    if (this.selected) {
      this.deselect();
      return;
    }

    if (this.ninja.selectedTarget) this.ninja.selectedTarget.deselect();

    this.selected = true;
    this.animateObject(this.type === 'attack' ? this.anims.attackSelectedIntro : this.anims.healSelectedIntro, { reset: true });
    this.animateObject(this.type === 'attack' ? this.anims.attackSelectedIdle : this.anims.healSelectedIdle, { playStyle: 'loop' });
    this.playSound(sfxName(this.type === 'attack' ? 'uitargetselect' : 'uiselecttile'), this.client);
    
    if ([TipPhase.ATTACK, TipPhase.HEAL].includes(this.client.lastTip)) {
      this.client.hideTip();
    }
  }

  private deselect() {
    this.selected = false;
    this.animateObject(this.type === 'attack' ? this.anims.attackIntro : this.anims.healIntro, { reset: true });
    this.animateObject(this.type === 'attack' ? this.anims.attackIdle : this.anims.healIdle, { playStyle: 'loop' });
  }

  public onClick = (ctx: SnowPenguinContext) => {
    if (ctx.penguin.isReady || !this.game.timer.running) return;

    this.select();
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
    public duration = 0,
    originMode: OriginMode = OriginMode.NONE,
    mirrorMode: MirrorMode = MirrorMode.NONE
  ) {
    super(game, name, x, y, false, xOffset, yOffset, originMode, mirrorMode);
  }

  public abstract play(...args: unknown[]): void;
}


export class AttackTile extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'ui_tile_attack', x, y, 0.5, 0.9998);
  }

  async play(autoRemove: boolean = false) {
    if (this.game.grid.isValid(this.x, this.y)) {
      await this.placeObject();
      await this.placeSprite();

      if (autoRemove) setTimeout(() => this.removeObject(), 200);
    }
  }
}

export class HealTile extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'ui_tile_heal', x, y, 0.5, 0.9998);
  }

  async play(autoRemove: boolean = false) {
    if (this.game.grid.isValid(this.x, this.y)) {
      await this.placeObject();
      await this.placeSprite();

      if (autoRemove) setTimeout(() => this.removeObject(), 200);
    }
  }
}

export class HealParticles extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'ui_healfx_anim', x, y, 0.50005, 1.0005, 0.737);
  }

  async play() {
    await this.placeObject();
    await this.placeSprite();
    await this.animateSprite(0, 10, { duration: this.duration * 1000 });
    setTimeout(() => this.removeObject(), this.duration * 1000);
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

  async play(damage: number = 0) {
    const range = this.frames[damage];
    if (!range) return;
    await this.placeObject();
    await this.placeSprite();
    await this.animateSprite(...range, { duration: this.duration * 1000 });
    setTimeout(() => this.removeObject(), this.duration * 1000);
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

  async play(hp: number = 0) {
    const range = this.frames[hp];
    if (!range) return;
    await this.placeObject();
    await this.placeSprite();
    await this.animateSprite(...range, { duration: this.duration * 1000 });
    setTimeout(() => this.removeObject(), this.duration * 1000);
  }
}

export class Explosion extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'effect_explosion_anim', x, y, 0.50005, 1.0005, 0.4);
  }

  async play() {
    await this.placeObject();
    await this.placeSprite();
    await this.animateSprite(0, 4, { duration: this.duration * 260 });
    setTimeout(() => this.removeObject(), this.duration * 1000);
  }
}

export class SnowProjectile extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'snow_projectile', x, y, 0.5, 1, 0.2);
  }

  async play(tx: number = 0, ty: number = 0) {
    this.setOffset(tx, ty);
    await this.placeObject();

    await this.setMirrorMode(tx, ty);
    await this.placeSprite(this.getAnimName(tx, ty));
    await this.moveObject(tx, ty, this.duration * 1000);
  }

  private async setMirrorMode(tx: number, ty: number) {
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
      this.spriteSettings({ mirrorMode });
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

  async play(tx: number = 0, ty: number = 0) {
    if ((tx - this.x) < 0) this.xOffset = -1;
    await this.placeObject();
    if ((tx - this.x) < 0) await this.spriteSettings({ mirrorMode: MirrorMode.X });

    await this.placeSprite(this.getAnimName(tx, ty));
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

  async play(tx: number, ty: number) {
    if (this.x > tx) {
      this.xOffset = 1;
      this.yOffset = 0.8;
    }
    await this.placeObject();
    await this.placeSprite();
  
    this.xOffset = 0.5;
    this.yOffset = 1;
    await this.moveObject(tx, ty, this.duration * 1000);
  }
}

export class ScrapImpact extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'scrap_attackeffect_anim', x, y, 0.5, 1, 0.4);
  }

  async play() {
    await this.placeObject();
    await this.placeSprite();
    setTimeout(() => this.removeObject(), this.duration * 1000);
  }
}

export class ScrapImpactLittle extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'scrap_attacklittleeffect_anim', x, y, 0.5, 1, 0.4);
  }

  async play() {
    await this.placeObject();
    await this.placeSprite();
  }
}

export class ScrapImpactSurroundings {
  static async play(game: SnowGame, centerX: number, centerY: number) {
    const effects: (AttackTile | ScrapImpactLittle)[] = [];

    for (let xo = -1; xo < 2; xo++) {
      for (let yo = -1; yo < 2; yo++) {
        const x = centerX + xo;
        const y = centerY + yo;

        if (!game.grid.isValid(x, y)) continue;

        const tile = new AttackTile(game, x, y);
        const impact = new ScrapImpactLittle(game, x, y);
        tile.play();
        impact.play();
        effects.push(tile, impact);
      }
    }

    await sleep(350);

    effects.forEach(e => e.removeObject());
  }
}

class ScrapProjectile extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'scrap_projectile', x, y, 0.25, 1.5);
  }

  async play(tx: number, ty: number, anim: string) {
    if (tx < 0 || ty > 8 || ty < 0 || ty > 4) return;

    await this.placeObject();
    await this.placeSprite(`scrap_projectile${anim}_anim`);
    await this.moveObject(tx, ty);
  }

  async playEast(tx: number, ty: number) {
    await this.play(tx, ty, 'east');
  }

  async playNorth(tx: number, ty: number) {
    await this.play(tx, ty, 'north');
  }

  async playNortheast(tx: number, ty: number) {
    await this.play(tx, ty, 'northeast');
  }
}

export class ScrapProjectileImpact {
  static async play(game: SnowGame, x: number, y: number) {
    const p1 = new ScrapProjectile(game, x, y);
    p1.playEast(x + 1, y);

    const p2 = new ScrapProjectile(game, x, y);
    p2.playEast(x - 1, y);

    const p3 = new ScrapProjectile(game, x, y);
    p3.playNorth(x, y - 0.8);

    const p4 = new ScrapProjectile(game, x, y);
    p4.playNorth(x, y + 0.8);

    const p5 = new ScrapProjectile(game, x, y);
    p5.playNortheast(x + 1, y - 0.8);

    const p6 = new ScrapProjectile(game, x, y);
    p6.playNortheast(x - 1, y - 0.8);

    const p7 = new ScrapProjectile(game, x, y);
    p5.playNortheast(x + 1, y + 0.8);

    const p8 = new ScrapProjectile(game, x, y);
    p6.playNortheast(x - 1, y + 0.8);

    await sleep(400);

    [p1, p2, p3, p4, p5, p6, p7, p8].forEach(e => e.removeObject());
  }
}

export class TankSwipe extends Effect {
  constructor(game: SnowGame, x: number, y: number, dir: 'vert' | 'horiz') {
    super(game, `tank_swipe_${dir}_anim`, x, y, 0.5005, 1.005);
  }

  async play() {
    await this.placeObject();
    await this.placeSprite();
    await this.animateSprite(0, 6, { duration: 400 });
  }
}

export class WaterPowerBeam extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'waterninja_powercard_water_loop_anim', x, y, 0.5, 1);
  }

  async play() {
    await this.placeObject();
    await this.placeSprite();
  }
}

export class FirePowerBeam extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'fireninja_powerskyfire_anim', x, y, 0.5, 1, 1.35);
  }

  async play() {
    await this.placeObject();
    await this.placeSprite();
  }
}

export class SnowPowerBeam extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'snowninja_beam_anim_', x, y, 0.5, 1.55);
  }

  async play() {
    await this.placeObject();
    await this.placeSprite();
  }
}

export class SnowIgloo extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'snowninja_igloodrop', x, y, 0.5, 2, 2, OriginMode.BOTTOM_MIDDLE);
  }

  async play(playSound: boolean = true) {
    await this.placeObject();
    await this.animateObject('snowninja_igloodrop_anim1', { reset: true });
    await this.animateObject('snowninja_igloodrop_anim2');
    await this.animateObject('blank_png', { playStyle: 'loop' });

    if (playSound) {
      setTimeout(() => this.playSound(sfxName('impactpowercardsnow')), 1200);
    }
  }
}

export class WaterFishDrop extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'waterninja_powercard_fishdrop_anim', x, y, 0.5, 2.4, 1.8, OriginMode.BOTTOM_MIDDLE);
  }

  async play() {
    await this.placeObject();
    await this.animateObject(this.name);
    await this.animateSprite(0, 26, { duration: 1700 });
    await this.animateObject('blank_png');
  }
}

export class FirePowerBottle extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'fireninja_powerbottle_anim', x, y, 0.5, 2, 1, OriginMode.BOTTOM_MIDDLE);
  }

  async play() {
    await this.placeObject();
    await this.animateObject(this.name);
    await this.animateSprite(0, 16, { duration: 1060 });
    await this.animateObject('blank_png');
  }
}

export class Flame extends Effect {
  public roundsLeft: number = 2;

  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'effect_resisualfiredamage_anim', x, y, 0.5, 1.0025);
  }

  async play() {
    await this.placeObject();
    await this.placeSprite();
  }
}

export class Shield extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'effect_shield', x, y, 0.5, 1.0015);
  }

  async play() {
    await this.placeObject();
    await this.placeSprite('effect_shield_loop');
  }

  async pop() {
    await this.placeObject();
    await this.placeSprite('effect_shieldpop_anim');
    await this.animateSprite(0, 3, { duration: 200 });
    setTimeout(() => this.removeObject(), 200);
  }
}

export class Rage extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'effect_rage', x, y, 0.5, 1.0025);
  }

  async play() {
    await this.placeObject();
    await this.placeSprite('effect_rageloop_anim');
  }

  async use(x: number, y: number) {
    await this.moveObject(x, y);
    await this.placeSprite('effect_shieldpop_anim');
    await this.animateSprite(0, 11, { duration: 750 });
    setTimeout(() => this.removeObject(), 700);
  }
}

export class MemberReviveBeam extends Effect {
  constructor(game: SnowGame, x: number, y: number) {
    super(game, 'revivebeam_anim', x, y, 0.5, 1, 0, OriginMode.BOTTOM_MIDDLE);
  }

  async play() {
    await this.placeObject();
    await this.placeSprite();
    await this.animateSprite(0, 29, { duration: 1200 });
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
  targets: Set<Target> = new Set();
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

    this.ghost.onClick = this.onGhostClick.bind(this);

    this.healthBar = new GameObject(
      game,
      'reghealthbar_animation',
      this.x, this.y,
      false,
      0.5, 1.005
    );
  }

  get selectedTarget(): Target | null {
    return Array.from(this.targets).find(t => t.selected) ?? null;
  }

  get selectedObject(): GameObject | null {
    return this.selectedTarget !== null ? this.selectedTarget.object : null;
  }

  get isReviving() {
    return (this.selectedObject instanceof Ninja) && this.selectedObject.hp <= 0;
  }

  public async removeObject() {
    this.healthBar.removeObject();
    this.ghost.removeObject();
    await super.removeObject();
  }

  public async moveObject(x: number, y: number, duration: number = this.moveDuration) {
    this.healthBar.moveObject(x, y, duration);
    super.moveObject(x, y, duration);

    this.ghost.x = x;
    this.ghost.y = y;

    if (this.shield !== null) this.shield.moveObject(x, y, duration);
    if (this.rage !== null) this.rage.moveObject(x, y, duration);
  }

  public moveNinja(x: number, y: number) {
    if (this.hp <= 0 || this.player.disconnected) {
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
        ninja.selectedTarget.moveObject(x, y);
      }
    }

    this.moveAnimation();
    this.moveObject(x, y);
    this.moveSound();

    this.ghost.x = this.ghost.y = -1;
  }

  public placeHealthbar() {
    this.healthBar.placeObject();
    this.healthBar.placeSprite();
    this.resetHealthbar();
  }

  public animateHealthbar(_startHp: number, _endHp: number, duration = 500) {
    const backwards = _endHp > _startHp;

    const startHp = backwards ? _endHp : _startHp;
    const endHp = backwards ? _startHp : _endHp;

    const start = 60 - Math.floor((startHp / this.maxHp) * 60) - 1;
    const end = 60 - Math.floor((endHp / this.maxHp) * 60) - 1;

    this.healthBar.animateSprite(start, end, { backwards, duration });
  }

  public resetHealthbar() {
    this.healthBar.animateSprite();
  }

  public setHealth(hp: number, showEffects: boolean = true) {
    if (hp < this.hp && this.shield !== null) {
      this.shield.pop();
      this.shield = null;
    }

    if (this.player.disconnected && this.hp <= 0) return;

    hp = Math.max(0, Math.min(hp, this.maxHp));

    this.animateHealthbar(this.hp, hp);

    if (hp >= this.hp) {
      new HealNumbers(this.game, this.x, this.y).play(hp - this.hp);
      this.reviveAnimation();
      this.hp = hp;
      return;
    }

    if (showEffects) {
      new AttackTile(this.game, this.x, this.y).play(true);
      new DamageNumbers(this.game, this.x, this.y).play(this.hp - hp);
    }

    if (hp > 0) {
      this.hitAnimation();
      this.player.updateCards();
      this.hp = hp;
      return;
    }

    if (this.hp <= 0) return;

    // Ninja has become KO'd
    this.hp = hp;
    this.targets.clear();
    this.koAnimation();

    this.rage?.removeObject();

    if (!this.player.disconnected) {
      this.player.wasKO = true;
      this.player.updateCards();
      this.koSound();
    }

    this.game.ninjas.forEach(n => {
      if (n.selectedObject === this) n.targets.clear();
    });
  }

  public get placedGhost() {
    return this.ghost.x !== -1 && this.ghost.y !== -1;
  }

  private onGhostClick(ctx: SnowPenguinContext, object: GameObject) {
    if (ctx.penguin.isReady) return;

    if (ctx.penguin.selectedCard) {
      ctx.penguin.selectedCard.place(object.x, object.y);
      return;
    }

    if (ctx.penguin.element !== this.name.toLowerCase()) {
      return;
    }

    if (this.player.selectedMemberCard) return;

    this.hideGhost();
    this.showTargets();
  }

  public async placeGhost(ctx: SnowPenguinContext, x: number, y: number) {
    if (ctx.penguin.isReady || !ctx.game.timer.running) {
      return;
    }

    if (this.hp <= 0) {
      this.hideGhost();
      return;
    }

    if (this.ghost.x === x && this.ghost.y === y) {
      this.hideGhost();
      this.showTargets();
      return;
    }

    if (!this.game.grid.canMove(x, y)) {
      return;
    }

    this.game.grid.move(this.ghost, x, y);
    await this.ghost.placeObject();
    await this.ghost.placeSprite();
    await this.ghost.playSound(sfxName('uiselecttile'));
    this.showTargets();
  }

  public async hideGhost(reset: boolean = true) {
    this.game.grid.remove(this.ghost);
    this.ghost.hide();

    if (reset) {
      this.ghost.x = -1;
      this.ghost.y = -1;
    }
  }

  public async showTargets() {
    this.removeTargets();

    const healable = this.healableTiles(
      this.placedGhost ? this.ghost.x : this.x,
      this.placedGhost ? this.ghost.y : this.y
    );

    for (const tile of healable) {
      const t = new Target(this, tile.x, tile.y);
      this.targets.add(t);
      t.showHeal();
    }

    const attackable = this.attackableTiles(
      this.placedGhost ? this.ghost.x : this.x,
      this.placedGhost ? this.ghost.y : this.y
    );

    for (const tile of attackable) {
      // TODO: handle tusk
      const t = new Target(this, tile.x, tile.y);
      this.targets.add(t);
      t.showAttack();
    }
  }

  public hideTargets() {
    this.targets.forEach(t => t.hide());
  }

  public removeTargets() {
    this.targets.forEach(t => t.removeObject());
    this.targets.clear();
  }

  async attackTarget(target: Enemy) {
    if (target.hp <= 0) return;

    // fixes mirror mode, according to snowflake. check if this also applies to us
    await sleep(250);

    await this.attackAnimation(target.x, target.y);
    await this.player.updateCards();

    if (this.rage !== null) {
      this.rage.use(target.x, target.y);
      this.rage = null;
      await target.setHealth(target.hp - (this.attack * 1.5));
    } else {
      await target.setHealth(target.hp - this.attack);
    }
  }

  async healTarget(target: Ninja) {
    if (this.player.lastTip === TipPhase.HEAL) {
      this.player.hideTip();
    }

    if (target.hp <= 0) {
      this.reviveOtherAnimation();
      return;
    }

    if (this.name !== 'Snow') return;

    this.heals++;
    this.healAnimation();
    this.player.updateCards();
    await sleep(400);
 
    if (this.rage !== null) {
      this.rage.use(target.x, target.y);
      this.rage = null;
      target.setHealth(target.hp + (this.attack * 1.5));
    } else {
      target.setHealth(target.hp + this.attack);
    }
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

      const distance = this.game.grid.distance([tile.x, tile.y], [tx, ty]);

      if (distance <= this.range) attackable.push(tile);

      if (target.tileRange <= 0) continue;

      const surrounding = this.game.grid.surroundingTiles(tile.x, tile.y, target.tileRange);

      for (const sTile of surrounding) {
        const distance = this.game.grid.distance([sTile.x, sTile.y], [tx, ty]);
        if (distance <= this.range) attackable.push(tile);
      }
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

  public placePowerCard(x: number, y: number) {
    if (this.player.isReady || !this.game.timer.running) return;

    if (!this.game.grid.isValid(x, y)) return;

    if (this.hp <= 0) return;

    const tile = this.game.grid.getTile(x, y);

    if (!this.ghostTilesInRange().includes(tile)) return;

    this.player.selectedCard.place(x, y);
  }

  public async usePowerCard(isCombo: boolean = false) {
    if (this.player.selectedCard !== null) {
      await this.player.selectedCard.use(isCombo);
    }
  }

  public abstract idleAnimation(): Promise<void>;
  public abstract moveAnimation(): Promise<void>;
  public abstract koAnimation(): Promise<void>;
  public abstract attackAnimation(...rest: unknown[]): Promise<void>;
  public abstract winAnimation(): Promise<void>;
  public abstract hitAnimation(): Promise<void>;
  public abstract healAnimation(): Promise<void>;
  public abstract reviveAnimation(): Promise<void>;
  public abstract reviveOtherAnimation(): Promise<void>;
  public abstract reviveOtherAnimationLoop(): Promise<void>;
  public abstract reviveMemberCardAnimation(): Promise<void>;
  public abstract powerAnimation(): Promise<void>;

  public async koSound() {
    await this.playSound(sfxName('penguinground'));
  }
  public async moveSound() {
    await this.playSound(sfxName('footsteppenguin'));
  }
  public abstract attackSound(): Promise<void>;
  public abstract powercardSound(): Promise<void>;
}

export class FireNinja extends Ninja {

  constructor(game: SnowGame, player: SnowPlayer, x: number, y: number) {
    super(game, 'Fire', player, x, y, 30, 2, 8, 2);
  }

  async idleAnimation() {
    await this.animateObject('fireninja_idle_anim', { playStyle: 'loop', register: false });
  }

  async moveAnimation() {
    await this.animateObject('fireninja_move_anim', { reset: true });
    await this.idleAnimation();
  }

  async koAnimation() {
    await this.animateObject('fireninja_kostart_anim', { reset: true });
    await this.animateObject('fireninja_koloop_anim', { playStyle: 'loop' });
  }

  async hitAnimation() {
    await this.animateObject('fireninja_hit_anim', { reset: true });

    if (this.isReviving) {
      await this.reviveOtherAnimationLoop();
    } else {
      await this.idleAnimation();
    }
  }

  async attackAnimation(x: number, y: number) {
    if (this.x > x) this.spriteSettings({ mirrorMode: MirrorMode.X });

    this.attackSound();
    await this.animateObject('fireninja_attack_anim', { reset: true, callback: () => this.resetSpriteSettings() });
    this.idleAnimation();

    await sleep(1450);
    await this.projectileAnimation(x, y);
  }

  private async projectileAnimation(x: number, y: number) {
    const pro = new FireProjectile(this.game, this.x, this.y);
    await pro.play(x, y);
    setTimeout(() => pro.removeObject(), 250);
  }

  async winAnimation() {
    await this.animateObject('fireninja_celebratestart_anim', { reset: true });
    await this.animateObject('fireninja_celebrateloop_anim', { playStyle: 'loop' });
  }

  async reviveAnimation() {
    this.animateObject('fireninja_revived_anim', { reset: true });
    new HealParticles(this.game, this.x, this.y).play();

    if (this.isReviving) {
      await this.reviveOtherAnimationLoop();
    } else {
      await this.idleAnimation();
    }
  }

  async reviveOtherAnimation() {
    await this.animateObject('fireninja_reviveother_anim', { reset: true });
    await this.reviveOtherAnimationLoop();
  }

  async reviveOtherAnimationLoop() {
    await this.animateObject('fireninja_reviveotherloop_anim', { playStyle: 'loop' });
  }

  async reviveMemberCardAnimation() {
    await this.animateObject('fireninja_member_revive', { reset: true });
    await this.idleAnimation();
  }

  async powerAnimation() {
    await this.animateObject('fireninja_power_anim', { reset: true });
    await this.idleAnimation();
    await this.powercardSound();
    await sleep(1000);
  }

  async healAnimation() {}

  async moveSound() {
    await this.playSound(sfxName('footsteppenguinfire'));
  }

  async attackSound() {
    await this.playSound(sfxName('attackfire'));
  }

  async powercardSound() {
    await this.playSound(sfxName('attackpowercardfire'));
  }

}

export class WaterNinja extends Ninja {

  constructor(game: SnowGame, player: SnowPlayer, x: number, y: number) {
    super(game, 'Water', player, x, y, 40, 1, 10, 2);
  }

  async idleAnimation() {
    await this.animateObject('waterninja_idle_anim', { playStyle: 'loop', register: false });
  }

  async moveAnimation() {
    await this.animateObject('waterninja_move_anim', { reset: true });
    await this.idleAnimation();
  }

  async koAnimation() {
    await this.animateObject('waterninja_knockout_intro_anim', { reset: true });
    await this.animateObject('waterninja_knockout_loop_anim', { playStyle: 'loop' });
  }

  async hitAnimation() {
    await this.animateObject('waterninja_hit_anim', { reset: true });

    if (this.isReviving) {
      await this.reviveOtherAnimationLoop();
    } else {
      await this.idleAnimation();
    }
  }

  async attackAnimation(x: number, y: number) {
    if (this.x > x) this.spriteSettings({ mirrorMode: MirrorMode.X });

    await this.animateObject('waterninja_attack_anim', { reset: true, callback: () => this.resetSpriteSettings() });
    this.idleAnimation();

    await sleep(450);
    this.attackSound();
  }

  async winAnimation() {
    await this.animateObject('waterninja_celebrate_anim', { playStyle: 'ping_pong', reset: true });
  }

  async reviveAnimation() {
    this.animateObject('waterninja_revived_anim', { reset: true });
    new HealParticles(this.game, this.x, this.y).play();

    if (this.isReviving) {
      await this.reviveOtherAnimationLoop();
    } else {
      await this.idleAnimation();
    }
  }

  async reviveOtherAnimation() {
    await this.animateObject('waterninja_revive_other_intro_anim', { reset: true });
    await this.reviveOtherAnimationLoop();
  }

  async reviveOtherAnimationLoop() {
    await this.animateObject('waterninja_revive_other_loop_anim', { playStyle: 'loop' });
  }

  async reviveMemberCardAnimation() {
    await this.animateObject('waterninja_member_revive', { reset: true });
    await this.idleAnimation();
  }

  async powerAnimation() {
    await this.animateObject('waterninja_powercard_summon_anim', { reset: true });
    await this.idleAnimation();
    await this.powercardSound();
    await sleep(650);
  }

  async healAnimation() {}

  async attackSound() {
    await this.playSound(sfxName('attackwater'));
  }

  async powercardSound() {
    await this.playSound(sfxName('attackpowercardwater'));
  }

}

export class SnowNinja extends Ninja {

  constructor(game: SnowGame, player: SnowPlayer, x: number, y: number) {
    super(game, 'Snow', player, x, y, 25, 3, 6, 3);
  }

  async idleAnimation() {
    await this.animateObject('snowninja_idle_anim', { playStyle: 'loop', register: false });
  }

  async moveAnimation() {
    await this.animateObject('snowninja_move_anim', { reset: true });
    await this.idleAnimation();
  }

  async koAnimation() {
    await this.animateObject('snowninja_kointro_anim', { reset: true });
    await this.animateObject('snowninja_koloop_anim', { playStyle: 'loop' });
  }

  async hitAnimation() {
    await this.animateObject('snowninja_hit_anim', { reset: true });

    if (this.isReviving) {
      await this.reviveOtherAnimationLoop();
    } else {
      await this.idleAnimation();
    }
  }

  async attackAnimation(x: number, y: number) {
    if (this.x > x) this.spriteSettings({ mirrorMode: MirrorMode.X });

    this.attackSound();
    await this.animateObject('snowninja_attack_anim', { reset: true, callback: () => this.resetSpriteSettings() });
    this.idleAnimation();

    await sleep(300);
    await this.projectileAnimation(x, y);
  }

  private async projectileAnimation(x: number, y: number) {
    // this is jank according to snowflake, and yeah it kinda is
    let pro = new SnowProjectile(this.game, this.x, this.y);
    await pro.play(x, y);
    await sleep(200);
    pro.removeObject();

    pro = new SnowProjectile(this.game, this.x, this.y);
    await pro.play(x, y);
    await sleep(200);
    setTimeout(() => pro.removeObject(), 200);
  }

  async winAnimation() {
    await this.animateObject('snowninja_celebrate_anim', { playStyle: 'ping_pong', reset: true });
  }

  async reviveAnimation() {
    this.animateObject('snowninja_revive_anim_', { reset: true });
    new HealParticles(this.game, this.x, this.y).play();

    if (this.isReviving) {
      await this.reviveOtherAnimationLoop();
    } else {
      await this.idleAnimation();
    }
  }

  async reviveOtherAnimation() {
    await this.animateObject('snowninja_reviveothersintro_anim', { reset: true });
    await this.reviveOtherAnimationLoop();
  }

  async reviveOtherAnimationLoop() {
    await this.animateObject('snowninja_reviveothersloop_anim', { playStyle: 'loop' });
  }

  async reviveMemberCardAnimation() {
    await this.animateObject('snowninja_member_revive', { reset: true });
    await this.idleAnimation();
  }

  async powerAnimation() {
    await this.animateObject('snowninja_powercard_anim', { reset: true });
    await this.idleAnimation();
    await this.powercardSound();
    await sleep(450);
  }

  async healAnimation() {
    await this.animateObject('snowninja_heal_anim', { reset: true });
    await this.idleAnimation();
  }

  async attackSound() {
    await this.playSound(sfxName('attacksnow'));
  }

  async powercardSound() {
    await this.playSound(sfxName('attackpowercardsnow'));
  }

}

//
// Enemies
//

export abstract class Enemy extends GameObject {
  hp: number;
  healthBar: GameObject;
  flame: Flame | null = null;
  stunned: boolean = false;

  constructor(
    game: SnowGame,
    name: string,
    public maxHp: number,
    public range: number,
    public attack: number,
    public move: number,
    public moveDuration: number,
    public tileRange: number = 0
  ) {
    super(game, name, -1, -1, true, 0.5, 1);

    this.hp = maxHp;

    this.healthBar = new GameObject(
      game,
      'reghealthbar_animation',
      this.x, this.y,
      false,
      0.5, 1.005
    );
  }

  async removeObject() {
    await this.healthBar.removeObject();
    await super.removeObject();
    if (this.flame !== null) await this.flame.removeObject();
  }

  async moveObject(x: number, y: number) {
    await this.healthBar.moveObject(x, y, this.moveDuration);
    await super.moveObject(x, y, this.moveDuration);
    if (this.flame !== null) await this.flame.moveObject(x, y, this.moveDuration);
  }

  async moveEnemy(x: number, y: number) {
    if (this.hp <= 0) return;

    if (this.x === x && this.y === y) return;

    if (this.x < x) this.spriteSettings({ mirrorMode: MirrorMode.X });

    await this.moveAnimation();
    await this.moveObject(x, y);
    await this.moveSound();
  }

  public placeHealthbar() {
    this.healthBar.x = this.x;
    this.healthBar.y = this.y;
    this.healthBar.placeObject();
    this.healthBar.placeSprite();
    this.resetHealthbar();
  }

  public animateHealthbar(_startHp: number, _endHp: number, duration = 500) {
    const backwards = _endHp > _startHp;

    const startHp = backwards ? _endHp : _startHp;
    const endHp = backwards ? _startHp : _endHp;

    const start = 60 - Math.floor((startHp / this.maxHp) * 60) - 1;
    const end = 60 - Math.floor((endHp / this.maxHp) * 60) - 1;

    this.healthBar.animateSprite(start, end, { backwards, duration });
  }

  public resetHealthbar() {
    this.healthBar.animateSprite();
  }

  public async setHealth(hp: number, wait: boolean = true) {
    hp = Math.max(0, Math.min(hp, this.maxHp));

    this.animateHealthbar(this.hp, hp);

    new AttackTile(this.game, this.x, this.y).play(true);
    new DamageNumbers(this.game, this.x, this.y).play(this.hp - hp);

    this.hp = hp;
    
    if (this.hp <= 0) {
      this.koAnimation();

      if (this.game.round >= 3) {
        this.game.coins += 60;
        this.game.exp += 75;
      }

      if (!wait) {
        setTimeout(() => this.removeObject(), 2500);
      } else {
        await this.game.callbacks.waitForAnims();
        this.removeObject();
      }
    } else {
      this.hitAnimation();
    }
  }

  public abstract attackTarget(target: Ninja): Promise<void>;

  flameDamage() {
    if (this.hp > 0) {
      this.setHealth(this.hp - 3);
    }
  }

  updateFlame() {
    if (this.flame === null) return;

    this.flameDamage();

    if (this.flame.roundsLeft > 0) {
      this.flame.roundsLeft--;
      return;
    }

    this.flame.removeObject();
    this.flame = null;

    setTimeout(() => this.idleAnimation(true), 800);
  }

  protected attackableTiles(tx: number, ty: number, range = this.range) {
    const attackable: GameObject[] = [];

    for (const tile of this.game.grid.tiles) {
      const target = this.game.grid.get(tile.x, tile.y);

      if (!(target instanceof Ninja)) continue;

      if (target.hp <= 0) continue;

      const distance = this.game.grid.distanceWithObstacles([tx, ty], [tile.x, tile.y]);

      if (distance <= range) attackable.push(tile);
    }
    
    return attackable;
  }

  public movableTiles() {
    return this.game.grid.tiles.filter(tile => {
      if (!this.game.grid.canMove(tile.x, tile.y)) return false;

      const distance = this.game.grid.distanceWithObstacles([this.x, this.y], [tile.x, tile.y]);
      return distance <= this.move;
    });
  }

  /** Find the next move and attack */
  public nextTarget(): [GameObject, GameObject] {
    const availableMoves = [...this.movableTiles(), this.game.grid.getTile(this.x, this.y)];

    if (availableMoves.length === 0) return [null, null];

    // Map of what tiles can be attacked when moving to a specific tile
    const moves = new Map<GameObject, GameObject[]>();

    for (const move of availableMoves) {
      const attackable = this.attackableTiles(move.x, move.y);
      if (attackable.length > 0) {
        moves.set(move, attackable);
      }
    }

    if (moves.size === 0) {
      // no targets in range, move to closest possible tile
      return [this.closestMove(), null];
    }

    for (const [move, targets] of moves) {
      targets.sort((a, b) =>
        this.simulateDamage(move.x, move.y, b) -
        this.simulateDamage(move.x, move.y, a)
      );
    }

    const sortedMoves = Array.from(moves.entries()).sort((a, b) =>
      this.simulateDamage(b[0].x, b[0].y, b[1][0]) -
      this.simulateDamage(a[0].x, a[0].y, a[1][0])
    );

    const highest = this.simulateDamage(sortedMoves[0][0].x, sortedMoves[0][0].y, sortedMoves[0][1][0]);

    const [move, targets] = choose(sortedMoves.filter(([move, targets]) => {
      return this.simulateDamage(move.x, move.y, targets[0]) === highest
    }));

    return [move, targets[0]];
  }

  /** Get the closest tile to a ninja, that the enemy can move to */
  private closestMove() {
    /* note in snowflake:
    This method can sometimes lead to the enemy being stuck
    if the target is behind an obstacle. We should probably
    implement a pathfinding algorithm to fix this.
    */

    const tiles = this.movableTiles();

    if (tiles.length === 0) return null;

    const selectedTiles = this.game.ninjas
      .filter(ninja => ninja.hp > 0)
      .map(ninja => 
          tiles.reduce((closest, tile) => 
              (Math.abs(tile.x - ninja.x) + Math.abs(tile.y - ninja.y)) < 
              (Math.abs(closest.x - ninja.x) + Math.abs(closest.y - ninja.y)) 
              ? tile 
              : closest
          )
      );
    
    if (selectedTiles.length === 0) {
      return null;
    }

    return selectedTiles.reduce((closest, tile) => 
        (Math.abs(tile.x - this.x) + Math.abs(tile.y - this.y)) < 
        (Math.abs(closest.x - this.x) + Math.abs(closest.y - this.y)) 
        ? tile 
        : closest
    );
  }

  protected simulateDamage(xPos: number, y: number, target: GameObject) {
    return this.attack;
  }

  public abstract idleAnimation(reset?: boolean): Promise<void>;
  public abstract moveAnimation(): Promise<void>;
  public abstract koAnimation(): Promise<void>;
  public abstract attackAnimation(x: number, y: number): Promise<void>;
  public abstract dazeAnimation(reset: boolean): Promise<void>;
  public abstract hitAnimation(): Promise<void>;

  async spawnAnimation() {
    await this.animateObject('snowman_spawn_anim', { reset: true });
    this.playSound(sfxName('snowmenappear'));
  }

  async koSound() {
    await this.playSound(sfxName('snowmandeathexplode'));
  }
  public abstract moveSound(): Promise<void>;
  public abstract attackSound(): Promise<void>;
  public abstract hitSound(): Promise<void>;
  public abstract impactSound(): Promise<void>;

}

export class Sly extends Enemy {

  constructor(game: SnowGame) {
    super(game, 'Sly', 30, 3, 3, 3, 1200);
  }

  async attackTarget(target: Ninja) {
    if (target.hp <= 0) return;

    // fixes mirror mode, according to snowflake. check if this also applies to us
    await sleep(250);

    const distance = this.game.grid.distance([this.x, this.y], [target.x, target.y]);

    // Additional 1 damage per tile away
    const damage = this.attack + distance - 1;

    await this.attackAnimation(target.x, target.y);
    target.setHealth(target.hp - damage);
  }

  async idleAnimation(reset: boolean = false) {
    await this.animateObject('sly_idle_anim', { playStyle: 'loop', register: false, reset });
  }

  async moveAnimation() {
    this.animateObject('sly_move_anim', { playStyle: 'loop', reset: true });
    await this.idleAnimation();
  }

  async attackAnimation(x: number, y: number) {
    if (this.x < x) await this.spriteSettings({ mirrorMode: MirrorMode.X });

    await sleep(250);
    await this.animateObject('sly_attack_anim', { reset: true, callback: () => this.resetSpriteSettings() });
    this.idleAnimation();
    this.attackSound();

    await sleep(1450);
    const projectile = new SlyProjectile(this.game, this.x, this.y);
    projectile.play(x, y);

    await sleep(500);
    this.impactSound();
    projectile.removeObject();

    new Explosion(this.game, x, y).play();
  }

  async koAnimation() {
    await this.animateObject('sly_ko_anim', { reset: true });
    await this.animateObject('blank_png');
    await this.koSound();
  }

  async hitAnimation() {
    await this.animateObject('sly_hit_anim', { reset: true });
    await this.hitSound();

    if (this.stunned) {
      this.dazeAnimation(false)
    } else {
      this.idleAnimation();
    }
  }

  async dazeAnimation(reset: boolean = true) {
    await this.animateObject('sly_daze_anim', { playStyle: 'loop', reset });
  }

  async moveSound() {
    await this.playSound(sfxName('footstepsly_loop'));
  }

  async hitSound() {
    await this.playSound(sfxName('snowmanslyhit'));
  }

  async attackSound() {
    await this.playSound(sfxName('attacksly'));
  }

  async impactSound() {
    await this.playSound(sfxName('impactsly'));
  }

}

export class Scrap extends Enemy {

  constructor(game: SnowGame) {
    super(game, 'Scrap', 45, 2, 8, 2, 1200);
  }

  protected simulateDamage(xPos: number, yPos: number, target: GameObject) {
    const surrounding = this.attackableTiles(target.x, target.y, 1).filter(t => t !== target);

    return this.attack + (this.attack / 2) * surrounding.length;
  }

  async attackTarget(target: Ninja) {
    if (target.hp <= 0) return;

    // fixes mirror mode, according to snowflake. check if this also applies to us
    await sleep(250);

    await this.attackAnimation(target.x, target.y);
    target.setHealth(target.hp - this.attack);

    await ScrapProjectileImpact.play(this.game, target.x, target.y);

    const surrounding = this.game.grid.surroundingObjects(target.x, target.y)
      .filter(obj => (obj instanceof Ninja) && obj.hp > 0);

    if (surrounding.length > 0) this.impactSound();

    for (const obj of surrounding) {
      const ninja = obj as Ninja;

      ninja.setHealth(ninja.hp - (this.attack / 2));

      new Explosion(this.game, obj.x, obj.y).play();
    }

    await ScrapImpactSurroundings.play(this.game, target.x, target.y);
  }

  async idleAnimation(reset: boolean = false) {
    await this.animateObject('scrap_idle_anim', { playStyle: 'loop', register: false, reset });
  }

  async moveAnimation() {
    this.animateObject('scrap_move_anim', { playStyle: 'loop', reset: true });
    await this.idleAnimation();
    await this.moveSound();
  }

  async attackAnimation(x: number, y: number) {
    if (this.x < x) await this.spriteSettings({ mirrorMode: MirrorMode.X });

    await this.animateObject('scrap_attack_anim', { reset: true, callback: () => this.resetSpriteSettings() });
    this.idleAnimation();

    await sleep(700);
    this.attackSound();

    const distance = this.game.grid.distance([this.x, this.y], [x, y]);
    const impactTime = 0.9 + (distance * 0.1);

    await sleep(impactTime * 1000);
    this.impactSound();

    await new ScrapImpact(this.game, x, y).play();
  }

  async koAnimation() {
    await this.animateObject('scrap_ko_anim', { reset: true });
    await this.animateObject('blank_png');
    await this.koSound();
  }

  async hitAnimation() {
    await this.animateObject('scrap_hit_anim', { reset: true });
    await this.hitSound();

    if (this.stunned) {
      this.dazeAnimation(false)
    } else {
      this.idleAnimation();
    }
  }

  async dazeAnimation(reset: boolean = true) {
    await this.animateObject('scrap_dazed_anim', { playStyle: 'loop', reset });
  }

  async moveSound() {
    await this.playSound(sfxName('footstepscrap_loop'));
  }

  async hitSound() {
    await this.playSound(sfxName('snowmanscraphit'));
  }

  async attackSound() {
    await this.playSound(sfxName('attackscrap'));
  }

  async impactSound() {
    await this.playSound(sfxName('impactscrap'));
  }

}

export class Tank extends Enemy {

  constructor(game: SnowGame) {
    super(game, 'Tank', 60, 1, 10, 1, 1100);
  }

  protected simulateDamage(xPos: number, yPos: number, target: GameObject) {
    // Horizontal swipe
    if (xPos === target.x) {
      let total = this.attack;

      const left = this.game.grid.get(xPos - 1, yPos);
      const right = this.game.grid.get(xPos + 1, yPos);

      if (left !== null && left instanceof Ninja) {
        total += this.attack / 2;
      }
      if (right !== null && right instanceof Ninja) {
        total += this.attack / 2;
      }

      return total;
    }
    // Vertical swipe
    else if (yPos === target.y) {
      let total = this.attack;

      const above = this.game.grid.get(xPos, yPos - 1);
      const below = this.game.grid.get(xPos, yPos + 1);

      if (above !== null && above instanceof Ninja) {
        total += this.attack / 2;
      }
      if (below !== null && below instanceof Ninja) {
        total += this.attack / 2;
      }

      return total;
    }

    throw new Error('Impossible scenario with Tank attack');
  }

  async attackTarget(target: Ninja) {
    if (target.hp <= 0) return;

    // fixes mirror mode, according to snowflake. check if this also applies to us
    await sleep(250);

    await this.attackAnimation(target.x, target.y);
    target.setHealth(target.hp - this.attack);

    const effects: Effect[] = [];

    if (this.x === target.x) {
      const left = this.game.grid.get(target.x - 1, target.y);
      const right = this.game.grid.get(target.x + 1, target.y);

      if (left !== null && left instanceof Ninja) {
        left.setHealth(left.hp - (this.attack / 2));
      }
      if (right !== null && right instanceof Ninja) {
        right.setHealth(right.hp - (this.attack / 2));
      }

      effects.push(
        new TankSwipe(this.game, target.x, target.y, 'horiz'),
        new AttackTile(this.game, target.x - 1, target.y),
        new AttackTile(this.game, target.x, target.y),
        new AttackTile(this.game, target.x + 1, target.y),
      )
    } else if (this.y === target.y) {
      const above = this.game.grid.get(target.x, target.y - 1);
      const below = this.game.grid.get(target.x, target.y + 1);

      if (above !== null && above instanceof Ninja) {
        above.setHealth(above.hp - (this.attack / 2));
      }
      if (below !== null && below instanceof Ninja) {
        below.setHealth(below.hp - (this.attack / 2));
      }

      effects.push(
        new TankSwipe(this.game, target.x, target.y, 'vert'),
        new AttackTile(this.game, target.x, target.y - 1),
        new AttackTile(this.game, target.x, target.y),
        new AttackTile(this.game, target.x, target.y + 1),
      )
    }

    effects.forEach(e => e.play());

    await sleep(250);

    effects.forEach(e => e.removeObject());
  }

  async idleAnimation(reset: boolean = false) {
    await this.animateObject('tank_idle_anim', { playStyle: 'loop', register: false, reset });
  }

  async moveAnimation() {
    this.animateObject('tank_move_anim', { playStyle: 'loop', reset: true });
    await this.idleAnimation();
    await this.moveSound();
  }

  async attackAnimation(x: number, y: number) {
    if (this.x < x) await this.spriteSettings({ mirrorMode: MirrorMode.X });

    this.attackSound();
    await this.animateObject('tank_attack_anim', { reset: true, callback: () => this.resetSpriteSettings() });
    this.idleAnimation();
    await sleep(150);
  }

  async koAnimation() {
    await this.animateObject('tank_knockout_anim', { reset: true });
    await this.animateObject('blank_png');
    await this.koSound();
  }

  async hitAnimation() {
    await this.animateObject('tank_hit_anim', { reset: true });
    await this.hitSound();

    if (this.stunned) {
      this.dazeAnimation(false)
    } else {
      this.idleAnimation();
    }
  }

  async dazeAnimation(reset: boolean = true) {
    await this.animateObject('tank_daze_anim', { playStyle: 'loop', reset });
  }

  async moveSound() {
    await this.playSound(sfxName('footsteptank'));
  }

  async hitSound() {
    await this.playSound(sfxName('snowmantankhit'));
  }

  async attackSound() {
    await this.playSound(sfxName('attacktank'));
  }

  async impactSound() {}

}

//
// Cards
//

export class CardObject implements Card {
  id: number;
  name: string;
  set: number;
  powerId: number;
  element: CardElement;
  color: CardColor
  value: number;
  description: string;

  object: GameObject;
  pattern: LocalGameObject;

  constructor(card: Card, private game: SnowGame, private player: SnowPlayer) {
    Object.assign(this, card);

    this.object = new GameObject(game, card.name, -1, -1, false, 0.5, 1.015);
    this.pattern = new LocalGameObject(player, game, 'ui_card_pattern', 0, 0, 0.5, 1);
  }

  get x() {
    return this.object.x;
  }

  get y() {
    return this.object.y;
  }

  get targets() {
    return this.game.grid.objectsInRange(...this.patternRange(this.x, this.y));
  }

  get cardData() {
    return {
      card_id: this.id,
      color: this.color,
      description: this.description,
      element: this.element,
      label: this.name,
      name: this.name,
      power_id: this.powerId,
      prompt: this.name,
      set_id: this.set,
      value: this.value
    }
  }

  public async place(x: number, y: number) {
    await this.placeCardSprite(x, y);
    await this.placePatternSprite(x, y);

    if (this.player.tipMode && this.player.lastTip === TipPhase.CARD) {
      this.player.hideTip();
    }

    this.object.playSound(sfxName('uiselecttile'), this.player);
  }

  public async remove() {
    this.object.removeObject();
    this.pattern.removeObject();
  }

  private async placeCardSprite(x: number, y: number) {
    this.object.x = x;
    this.object.y = y;
    await this.object.placeObject();
    await this.object.placeSprite({
      'f': 'ui_card_fire',
      'w': 'ui_card_water',
      's': 'ui_card_snow',
    }[this.element]);
  }

  private async placePatternSprite(x: number, y: number) {
    this.pattern.xOffset = 0.5;
    this.pattern.yOffset = 1;

    const [minX, maxX, minY, maxY] = this.patternRange(x, y);

    this.pattern.x = x;
    this.pattern.y = y;
    await this.pattern.placeObject();
    await this.pattern.placeSprite(`ui_card_pattern${maxX - minX + 1}x${maxY - minY + 1}`);
  }

  /** Returns [minX, maxX, minY, maxY] for the pattern range, inclusive. */
  private patternRange(x: number, y: number): [number, number, number, number] {
    const gridMaxX = this.game.grid.maxX - 1;
    const gridMaxY = this.game.grid.maxY - 1;

    let minX = x - 1;
    let minY = y - 1;
    let maxX = x + 1;
    let maxY = y + 1;

    if (y === 0) {
      minY = y;
      this.pattern.yOffset = 1;
    }
    if (y === gridMaxY) {
      maxY = gridMaxY;
      this.pattern.yOffset = 0;
    }
    if (x === 0) {
      minX = x;
      this.pattern.xOffset = 1;
    }
    if (x === gridMaxX) {
      maxX = gridMaxX;
      this.pattern.xOffset = 0;
    }

    return [minX, maxX, minY, maxY];
  }

  async use(isCombo: boolean = false) {
    if (this.player.ninja.hp <= 0) return;

    if (this.player.selectedCard !== this) return;

    if (this.x === -1 && this.y === -1) return;

    this.consume();

    await this.game.callbacks.waitForClient('ConsumeCardResponse', this.player);

    await sleep(1200);

    await this.attackAnimation();
    this.applyHealth();

    if (isCombo) this.applyEffects();

    this.player.playedCards++;
    await this.game.callbacks.waitForAnims();
    // TODO: check stamps
  }

  async consume() {
    for (const player of this.game.players) {
      let payload = 'consumeCard';
      let data = {};

      if (player !== this.player) {
        payload = 'showCaseOthersCard';
        data = { cardData: this.cardData };
      }

      await player
        .getWindow(Windows.UI)
        .sendPayload(payload, data);
    }
  }

  async attackAnimation() {
    const ninja = this.player.ninja;

    await ninja.powerAnimation();

    const beamClass = {
      'f': FirePowerBeam,
      'w': WaterPowerBeam,
      's': SnowPowerBeam
    }[this.element];

    const beam = new beamClass(this.game, ninja.x, ninja.y);
    beam.play();

    const impactClass = {
      'f': FirePowerBottle,
      'w': WaterFishDrop,
      's': SnowIgloo
    }[this.element];

    if (this.element !== 's') {
      // wait for attack anim
      await sleep(200);
    }

    const impact = new impactClass(this.game, this.x, this.y);
    impact.play();

    if (this.element === 'f') {
      await sleep(impact.duration * 1000);
      await impact.removeObject();
      await sleep((beam.duration - impact.duration) * 100);
      await beam.removeObject();
      return;
    }

    const delay = 850;
    await sleep((impact.duration * 1000) - delay);
    await beam.removeObject();
    await sleep(delay);
    await impact.removeObject();
  }

  async applyHealth() {
    for (const target of this.targets) {
      if (target instanceof Ninja && this.element === 's') {
        if (!target.player.disconnected) {
          target.setHealth(target.hp + this.value);
        }
        continue;
      }

      if (target instanceof Enemy) {
        let attack = this.value;

        if (this.element === 'w') {
          attack *= 2;
        } else if (this.element === 'f') {
          target.stunned = true;
        }

        target.setHealth(target.hp - attack, false);
        new Explosion(this.game, target.x, target.y).play();
      }
    }
  }

  async applyEffects() {
    if (this.element === 's') {
      // Shield
      for (const ninja of this.game.ninjas) {
        if (ninja.player.disconnected || ninja.hp <= 0 || ninja.shield !== null) continue;

        ninja.shield = new Shield(this.game, ninja.x, ninja.y);
        ninja.shield.play();
      }
    } if (this.element === 'w') {
      // Rage effect
      for (const ninja of this.game.ninjas) {
        if (ninja.player.disconnected || ninja.hp <= 0 || ninja.rage !== null) continue;

        ninja.rage = new Rage(this.game, ninja.x, ninja.y);
        ninja.rage.play();
      }
    } else if (this.element === 'f') {
      // Flame for all enemy targets
      for (const target of this.targets) {
        if (!(target instanceof Enemy) || target.hp <= 0 || target.flame !== null) continue;

        target.flame = new Flame(this.game, target.x, target.y);
        target.flame.play();
      }
    }
  }
}

// TODO: this feature was only added in august 2013 (according to wiki).
// check the timeline to only make it available for then.
// (do we even have those assets? thats only like a 3 month window)
export class MemberCard extends GameObject {
  public selected: boolean = false;

  constructor(game: SnowGame, private player: SnowPlayer) {
    super(game, 'ui_card_member', -1, -1, false, 0.5, 1.01);
  }

  private get ninja() {
    return this.player.ninja;
  }

  async place() {
    this.x = this.ninja.placedGhost ? this.ninja.ghost.x : this.ninja.x;
    this.y = this.ninja.placedGhost ? this.ninja.ghost.y : this.ninja.y;

    await this.placeObject();
    await this.placeSprite(`ui_card_member_${this.player.element}`);
    this.selected = true;
  }

  async remove() {
    await this.removeObject();
    this.x = -1;
    this.y = -1;
  }

  async consume() {
    if (!this.selected) return;

    for (const player of this.game.players) {
      await player
        .getWindow(Windows.UI)
        .sendPayload(this.player === player ? 'consumeMemberCard' : 'showCaseMemberCard');
    }

    await sleep(2000);

    const beam = new MemberReviveBeam(this.game, this.ninja.x, this.ninja.y);
    beam.play();

    this.ninja.playSound('SFX_MG_CJSnow_PowercardReviveStart');
    this.ninja.setHealth(this.ninja.maxHp);
    this.ninja.reviveMemberCardAnimation();
    this.player.memberCard = null;

    await sleep(1200);
    this.ninja.playSound('SFX_MG_CJSnow_PowercardReviveEnd');
    beam.removeObject();
  }
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