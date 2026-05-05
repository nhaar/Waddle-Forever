import { choose, randomInt } from "@common/utils";
import { WorldRoom } from "./world-room";

type BakeryState = 'IngredientsStation' | 'CheerStation' | 'MultiplierStation' | 'ResetStation';
type BakeryMultiplier = 'Small' | 'Medium' | 'Large';
type Ingredient = 'Candy' | 'Eggs' | 'Flour' | 'Milk' | 'Tire' | 'Hay';

export class Bakery {
  private _state: BakeryState = 'IngredientsStation';
  
  static MAGIC_INGREDIENTS: Ingredient[] = ['Hay', 'Tire', 'Candy'];
  private _ingredients: Ingredient[] = [];
  private _currentIngredient: number = 0;

  private _currentEmote: number = 1;
  static CHEER_CAPACITY = 7;
  private _cheerCount: number = 0;

  private _multiplierPenguins: Set<number> = new Set();
  private _multiplierCount: number = 0;
  private _countInterval: NodeJS.Timeout | null = null;

  private _room: WorldRoom;

  constructor(room: WorldRoom) {
    this._room = room;
    this.startIngredients();
  }

  get room() {
    return this._room;
  }
  
  get emote() {
    return this._currentEmote;
  }

  get cheerCount() {
    return this._cheerCount;
  }

  incrementCheer() {
    this._cheerCount++;
    this.sendBakeryState();
  
    // only if exact, in order to only start the timeout once
    if (this._cheerCount === Bakery.CHEER_CAPACITY) {
      // takes about 3 seconds to proceed
      setTimeout(() => {
        this.startMultiplier();
      }, 3000);
    }
  }

  updateMultiplierPenguins(): void {
    for (const [p, state] of this.room.getPlayerStates()) {
      if (state.x >= 610) {
        this._multiplierPenguins.add(p.id);
      } else {
        this._multiplierPenguins.delete(p.id);
      }
    }
  }

  startIngredients() {
    this._state = 'IngredientsStation';
    this._currentIngredient = 0;
    const magicIngredient = choose(Bakery.MAGIC_INGREDIENTS);
    const ingredients: Ingredient[] = [];
    const possibleIngredients: Ingredient[] = [magicIngredient, 'Milk', 'Eggs', 'Flour'];
    while (possibleIngredients.length > 0) {
      const i = randomInt(0, possibleIngredients.length - 1);
      ingredients.push(...possibleIngredients.splice(i, 1));
    }
    this._ingredients = ingredients;
    this.sendBakeryState();
  }

  startCheer() {
    this._state = 'CheerStation';
    this._cheerCount = 0;
    this._currentEmote = choose([1, 2, 7]);
    this.sendBakeryState();
  }

  startMultiplier() {
    this._state = 'MultiplierStation';
    this._multiplierCount = 9;
    this.updateMultiplierPenguins();
    this.sendBakeryState();

    this._countInterval = setInterval(() => {
      this._multiplierCount--;

      // use < 0 to give a full second before switching to next station
      if (this._multiplierCount < 0 && this._countInterval !== null) {
        clearInterval(this._countInterval);
        this.startReset();
      } else {
        this.updateMultiplierPenguins();
        this.sendBakeryState();
      }
    }, 1000);
  }

  startReset(): void {
    this._state = 'ResetStation';
    this.sendBakeryState();

    // estimate based on videos
    setTimeout(() => {
      this.startIngredients();
    }, 6000);
  }

  get currentIngredient() {
    return this._ingredients[this._currentIngredient];
  }

  nextIngredient() {
    this._currentIngredient++;
    this.sendBakeryState();
    if (this._currentIngredient >= this._ingredients.length) {
      this.startCheer();
    }
  }

  getMultiplier(): BakeryMultiplier {
    // none of these are confirmed values
    if (this._multiplierPenguins.size >= 10) {
      return 'Large';
    }
    if (this._multiplierPenguins.size >= 5) {
      return 'Medium';
    }
    return 'Small';
  }

  get bakeryState() {
    return JSON.stringify({
      CurrentStation: this._state,
      IngredientsStation: this._ingredients.map((ingredient, i) => {
        return {
          IngredientType: ingredient,
          // unknown if this total ever changed
          TotalRequired: 1,
          CurrentCount: this._currentIngredient > i ? 1 : 0
        }
      }),
      CheerStation: {
        CheerCapacity: Bakery.CHEER_CAPACITY,
        CurrentCheerCount: this.cheerCount,
        Emote: this.emote
      },
      MultiplierStation: {
        Counter: this._multiplierCount,
        Multiplier: this.getMultiplier()
      }
    })
  }

  sendBakeryState() {
    this.room.sendXt('barsu', this.bakeryState);
  }
}