import { randomInt } from "@common/utils";
import { ClientSocket } from "../../socket-server";
import { SnowPlayer } from "./snow";
import { Enemy, GameObject, Ninja } from "./snow-game-objects";
import { SnowWriteFunction } from "../bot";

const windowsAutoClose = ['cardjitsu_snowrevive.swf', 'cardjitsu_snowrounds.swf', 'stampearned.swf'];

/**
 * A bot specifically for Card-Jitsu snow,
 * to properly handle the different packet format
 */
export class SnowBot implements ClientSocket {
  private _timers = new Set<NodeJS.Timeout>();

  private _simulate: (code: string, ...args: Array<string | number>) => void;

  private _player: SnowPlayer;

  constructor(
    writeFn: SnowWriteFunction,
    private _disconnect: () => void
  ) {
    this._simulate = (c, ...a) => writeFn(this, c, ...a);
  }

  public setPlayer(p: SnowPlayer) {
    this._player = p;
  }

  private get ninja() {
    return this._player.ninja;
  }

  private get game() {
    return this.ninja.game;
  }

  public schedule(fn: () => void, seconds: number): NodeJS.Timeout {
    const t = setTimeout(() => {
      this._timers.delete(t);
      fn();
    }, seconds * 1000);

    this._timers.add(t);
    return t;
  }

  private clearAllTimers() {
    this._timers.forEach(clearTimeout);
    this._timers.clear();
  }

  public async write(message: string): Promise<void> {
    const split = message.split('|');
    split.pop(); // last element is always empty
    const name = split[0];
    const args = split.slice(1);

    this.handle(name.slice(1, name.length - 1), args);
  }

  private framework(triggerName: string, json: Record<string, unknown> = {}) {
    this._simulate('framework', JSON.stringify({ ...json, triggerName }));
  }

  private handle(name: string, args: string[]): void {
    switch (name) {
      case 'W_PLACE':
        // switch place - this happens when the round starts
        // tell the server that we're ready
        this.schedule(() => this.framework('roomToRoomComplete'), 2);
        break;

      case 'UI_CLIENTEVENT':
        // got a payload for a swf window
        const win = JSON.parse(args[2]);
        if (win.action === 'loadWindow') {
          if (win.windowUrl.includes('cardjitsu_snowpayout')) {
            // loading the payout window, meaning the game is over
            // so we can disconnect now
            this.clearAllTimers();
            this._disconnect();
          } else {
            // visually this means nothing for bots, but the game will expect
            // a signal for when a window is loaded (or closed)
            this.framework('windowReady', { windowUrl: win.windowUrl });
            if (windowsAutoClose.includes(win.windowUrl.split('/').pop())) {
              this.schedule(() => this.framework('windowClosed', { windowUrl: win.windowUrl }), 2);
            }
          }
        } else if (win.action === 'jsonPayload') {
          if (win.triggerName === 'Timer_Start') {
            // round started - decide a move
            this.schedule(() => {
              if (this.ninja.isKO) {
                // if we're dead, try to revive
                // TODO: should have a chance to use this card earlier,
                // when health is getting low
                if (this._player.memberCard) {
                  this.framework('memberCardClick');
                }
                return;
              }

              for (const ninja of this.game.ninjas.filter(n => n.isKO)) {
                // they'll revive themselves if they have a member card
                if (ninja.player.memberCard) continue;

                // this ninja is going to be revived by someone else
                if (this.game.ninjas.some(n => n.selectedObject === ninja)) continue;

                // we will try to move to a tile where we can heal
                if (!this.canHealNinja(ninja)) continue;

                // we can heal this ninja!
                this.selectTarget(ninja.x, ninja.y);
                this.confirmMove();
              }

              switch (this._player.element) {
                case 'snow':
                  this.snowActions();
                  break;
                case 'water':
                  this.waterActions();
                  break;
                case 'fire':
                  this.fireActions();
                  break;
              }
              this.confirmMove();
            }, randomInt(1000, 5000) / 1000)
          }
        }
        break;
    }
  }

  public joinMatchmaker(element: string, battleMode: number) {
    this._simulate('place_context', JSON.stringify('snow_lobby'), `battleMode=${battleMode}&base_asset_url=""`)
    this.framework('mmElementSelected', { element, tipMode: false })
  }

  public end() {}

  private confirmMove() {
    this.schedule(() => this.framework('confirmClicked'), randomInt(500, 2000) / 1000);
  }

  private snowActions() {
    // Snow ninja should focus on healing others
    // and keep distance from enemies
    const injuredNinjas = this.game.ninjas.filter(n => {
      return n !== this.ninja && !n.isKO && n.hp < n.maxHp && !n.player.disconnected;
    });

    if (injuredNinjas.length > 0) {
      const [move, target] = this.bestMoveForHeal();

      if (move) this._simulate('use', move.id);
      if (target) {
        this.selectTarget(target.x, target.y);
        return;
      }

      // if we can't heal yet, move closer to them
      // so we can try to heal next turn
      const move2 = this.bestMoveTowardAllies(injuredNinjas);

      if (move2) this._simulate('use', move2.id);
    }

    const enemies = this.livingEnemies();

    if (enemies.length <= 0) return;

    // no one needs healed, so try to attack an enemy
    // while staying as far away as possible
    const [move, target] = this.bestMoveForAttack(enemies, false);

    if (target !== null) {
      if (move !== null) this._simulate('use', move.id);
      this.selectTarget(target.x, target.y);
      return;
    }

    const move2 = this.bestTileToMoveTo(true);

    if (move2 !== null) this._simulate('use', move2.id);
  }

  private fireActions() {
    // Fire ninja should keep their distance
    // and focus on attacking enemies
    const enemies = this.livingEnemies();

    if (enemies.length <= 0) return;

    const [move, target] = this.bestMoveForAttack(enemies, false);

    if (target !== null) {
      if (move !== null) this._simulate('use', move.id);
      this.selectTarget(target.x, target.y);
      return;
    }

    const move2 = this.bestStandoffTile();

    if (move2 !== null) this._simulate('use', move2.id);
  }

  private waterActions() {
    // Water ninja should move as close to enemies as possible
    // and focus on attacking them
    const enemies = this.livingEnemies();

    if (enemies.length <= 0) return;

    const [move, target] = this.bestMoveForAttack(enemies, true);

    if (target !== null) {
      if (move !== null) this._simulate('use', move.id);
      this.selectTarget(target.x, target.y);
      return;
    }

    const move2 = this.bestTileToMoveTo(false);

    if (move2 !== null) this._simulate('use', move2.id);
  }

  private selectTarget(x: number, y: number) {
    const target = Array.from(this.ninja.targets).find(t => t.x === x && t.y === y);

    if (!target) {
      console.log('Unable to find target!');
      return;
    }

    this._simulate('use', target.id);
  }

  /** Returns [tile to move to, tile to attack] */
  private bestMoveForAttack(enemies: Enemy[], preferClosest: boolean) {
    let bestMove: GameObject = null;
    let bestTargets: GameObject[] = [];
    let bestScore: [number, number] = null;

    for (const tile of this.availableTiles()) {
      const targets = this.ninja.attackableTiles(tile.x, tile.y);

      if (targets.length <= 0) continue;

      const nearest = this.nearestEnemyDistance(tile, enemies);

      const score: [number, number] = [targets.length, preferClosest ? -nearest : nearest];

      if (!bestScore || score[0] > bestScore[0] || score[1] > bestScore[1]) {
        bestMove = tile;
        bestTargets = targets;
        bestScore = score;
      }
    }

    // either no attack candidates or no move picked
    if (!bestMove) return [null, null];

    const target = this.bestEnemyTarget(bestTargets, bestMove, preferClosest);
    return [bestMove, target];
  }

  private bestMoveForHeal() {
    let bestScore: [number, number] = null;
    let bestMove: GameObject = null;
    let bestTarget: GameObject = null;

    for (const tile of this.availableTiles()) {
      const healTiles = this.ninja.healableTiles(tile.x, tile.y);

      if (healTiles.length <= 0) continue;

      for (const hTile of healTiles) {
        const ninja = this.game.grid.get(hTile.x, hTile.y);

        if (!(ninja instanceof Ninja)) continue;

        const score: [number, number] = ninja.hp <= 0 ? [2, 0] : [1, ninja.maxHp - ninja.hp];

        if (!bestScore || score[0] > bestScore[0] || score[1] > bestScore[1]) {
          bestMove = tile;
          bestTarget = hTile;
          bestScore = score;
        }
      }
    }

    return [bestMove, bestTarget];
  }

  private bestEnemyTarget(targets: GameObject[], fromTile: GameObject, preferClosest: boolean) {
    const enemies = targets.map(t => this.game.grid.get(t.x, t.y)).filter(e => e instanceof Enemy);

    if (enemies.length <= 0) return null;

    const score = (e: Enemy) => {
      const dist = this.game.grid.distance([e.x, e.y], [fromTile.x, fromTile.y]);
      return preferClosest ? [e.hp, dist] : [e.hp, -dist];
    }

    const enemy = enemies.reduce((minEnemy, currentEnemy) => {
        const scoreMin = score(minEnemy);
        const scoreCurrent = score(currentEnemy);

        // compare HP
        if (scoreCurrent[0] !== scoreMin[0]) {
            return scoreCurrent[0] < scoreMin[0] ? currentEnemy : minEnemy;
        }
        
        // if HPs are equal, compare distance
        return scoreCurrent[1] < scoreMin[1] ? currentEnemy : minEnemy;
    }, enemies[0]);

    return this.game.grid.getTile(enemy.x, enemy.y);
  }

  private bestTileToMoveTo(preferFar: boolean) {
    const enemies = this.livingEnemies();

    if (enemies.length <= 0) return null;

    const tiles = this.availableTiles();

    if (tiles.length <= 0) return null;

    const getDist = (tile: GameObject) => (preferFar ? 1 : -1) * this.nearestEnemyDistance(tile, enemies);

    return tiles.reduce((best, tile) => 
        getDist(tile) > getDist(best) ? tile : best
    );
  }

  /** Choose a tile that keeps the ninja near their max range from enemies */
  private bestStandoffTile() {
    const enemies = this.livingEnemies();

    if (enemies.length <= 0) return null;

    const tiles = this.availableTiles();

    if (tiles.length <= 0) return null;

    const current = this.game.grid.getTile(this.ninja.x, this.ninja.y);
    const targetDist = this.ninja.range;

    const scoredTiles = tiles.map(tile => {
      const nearestDist = this.nearestEnemyDistance(tile, enemies);
      return {
        tile,
        score: [
          Math.abs(nearestDist - targetDist),
          -nearestDist,
          tile !== current ? 0 : 1
        ] as [number, number, number]
      };
    });

    scoredTiles.sort((a, b) => {
      if (a.score[0] !== b.score[0]) return a.score[0] - b.score[0];
      if (a.score[1] !== b.score[1]) return a.score[1] - b.score[1];
      return a.score[2] - b.score[2];
    });

    return scoredTiles[0]?.tile ?? null;
  }

  private bestMoveTowardAllies(ninjas: Ninja[]) {
    if (ninjas.length <= 0) return null;

    const tiles = this.availableTiles();

    if (tiles.length <= 0) return null;

    const current = this.game.grid.getTile(this.ninja.x, this.ninja.y);

    const scoredTiles = tiles.map(tile => {
      // calculate average distance to all allies
      const totalDistance = ninjas.reduce(
        (sum, ally) => sum + this.game.grid.distance([tile.x, tile.y], [ally.x, ally.y]),
        0
      );
      const avgDistance = ninjas.length > 0 ? totalDistance / ninjas.length : 0;

      const priority = tile !== current ? 0 : 1;

      return { tile, avgDistance, priority };
    });

    // sort by average distance first, then by priority (lowest values first)
    scoredTiles.sort((a, b) => {
      if (a.avgDistance !== b.avgDistance) {
        return a.avgDistance - b.avgDistance; // Ascending distance
      }
      return a.priority - b.priority;       // Ascending priority tie-breaker
    });

    return scoredTiles[0].tile;
  }

  private availableTiles() {
    const tiles = this.ninja.movableTiles();
    const current = this.game.grid.getTile(this.ninja.x, this.ninja.y);
    if (current) tiles.push(current);
    return tiles;
  }

  private livingEnemies() {
    return this.game.enemies.filter(e => e.hp > 0);
  }

  private canHealNinja(ninja: Ninja) {
    const surrounding = this.game.grid.surroundingTiles(ninja.x, ninja.y);
    const currentTile = this.game.grid.getTile(this.ninja.x, this.ninja.y);

    // We are already on a tile where we can heal
    if (surrounding.includes(currentTile)) return true;

    // See if any of the surrounding tiles will allow us to heal
    for (const tile of surrounding) {
      if (this.game.grid.canMoveToTile(this.ninja, tile.x, tile.y)) {
        // "Click" the tile
        this._simulate('use', tile.id);
        return true;
      }
    }

    return false;
  }

  private nearestEnemyDistance(tile: GameObject, enemies: Enemy[]) {
    return Math.min(...enemies.map(e => this.game.grid.distance([tile.x, tile.y], [e.x, e.y])));
  }
}
