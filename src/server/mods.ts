import fs from 'fs';
import path from 'path';
import { MODS_DIRECTORY, MOD_HACKS_FILE, MOD_ITEMS_FILE } from '@common/paths';
import { CustomItem, ITEMS } from './game-logic/items';
import { iterateEntries } from '@common/utils';
import { Router, Request } from "express";
import { CustomHack, FRAME_HACKS } from './game-data/frame-hacks';

// type declarations that are used to validate the properties of the JSON parsed objects from mods

// map of the possible property types used in the JSON objects and the result of typeof
type ItemTypeName<T> =
  T extends number ? 'number' :
  T extends string ? 'string' :
  T extends boolean ? 'boolean' :
  'unknown';

// record type to enforce at compile time that the validator objects below are complete
type KeyTypes<T extends {}> = {
  [K in keyof T]: ItemTypeName<T[K]>;
}

// object used for validating objects at runtime
const customItemKeys: KeyTypes<CustomItem> = {
  cost: 'number',
  id: 'number',
  'isBack': 'boolean',
  'isMember': 'boolean',
  'layer': 'number',
  'name': 'string',
  'type': 'number'
};
const customHackKeys: KeyTypes<CustomHack> = {
  'body': 'number',
  'face': 'number',
  'feet': 'number',
  'frame': 'number',
  'hand': 'number',
  'head': 'number',
  'neck': 'number',
  'secret_frame': 'number'
};

const modsSettingsPath = path.join(MODS_DIRECTORY, '.active_mods');

if (!fs.existsSync(MODS_DIRECTORY)) {
  fs.mkdirSync(MODS_DIRECTORY);
}
if (!fs.existsSync(modsSettingsPath)) {
  fs.writeFileSync(modsSettingsPath, '');
}

const FORBIDDEN_NAMES = new Set([
  '.active_mods', // mod tracker for WF
  '.DS_Store'   // macOS folder file
]);

/** Errors raised from incorrect JSON in mods */
export class ModError extends Error {}

/** Helper function that parses a JSON file for an array of objects */
function parseObjectArrayJSON<T extends {}>(file: string, mod: string, name: string, keyTypes: KeyTypes<T>): T[] {
  const filePath = path.join(MODS_DIRECTORY, mod, file);
  if (fs.existsSync(filePath)) {
    let objs;
    try {
      objs = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }));
    } catch (error) {
      // if syntax error, there was an error parsing, objs will be undefined
      // which is fine
      if (!(error instanceof SyntaxError)) {
        throw error;
      }
    }

    if (!Array.isArray(objs)) {
      throw new ModError(`Your mod contains invalid JSON in the ${name} file, there should be an array (square brackets) with items inside.`);
    }

    objs.forEach((obj, i) => {
      if (typeof obj !== 'object' || obj === null) {
        throw new ModError(`Invalid JSON member inside the array (square brackets) inside the ${name} file (element at index ${i}). It should contain an object which is defined with curly brackets`);
      }

      iterateEntries(keyTypes, (key, type) => {
        if (!(key in obj) || typeof obj[key] !== type) {
          throw new ModError(`Invalid value for the ${key} of the item at index ${i}: ${key} must be a ${type}`);
        }
      });
    })

    return objs;
  }
  return [];
}

/** Abstraction for a mod and its extensions. Will raise an error in the constructor if any of the JSONs are faulty */
class Mod {
  private items: CustomItem[];
  private hacks: CustomHack[];
  
  constructor(private name: string) {
    this.items = this.getItems();
    this.hacks = this.getHacks();
  }

  loadCustomItems() {
    this.items.forEach(item => ITEMS.addCustomItem(item));
  }

  unloadCustomItems() {
    this.items.forEach(item => {
      ITEMS.removeCustomItem(item.id);
    });
  }

  loadCustomFrameHacks(): void {
    FRAME_HACKS.addCustom(this.name, this.hacks);
  }

  unloadCustomFrameHacks(): void {
    FRAME_HACKS.removeCustom(this.name);
  }

  private getItems(): CustomItem[] {
    const items = parseObjectArrayJSON<CustomItem>(MOD_ITEMS_FILE, this.name, 'items', customItemKeys);
    
    // mods can't override items that already exist
    const conflicts = items.filter(obj => {
      return ITEMS.has(obj.id);
    });
    if (conflicts.length > 0) {
      throw new ModError(`There was a conflict of item IDs, either with another mod, or with an item from the original game. Conflicting item IDs: ${conflicts.map(item => item.id).join(', ')}`);
    }

    return items;
  }

  private getHacks(): CustomHack[] {
    return parseObjectArrayJSON<CustomHack>(MOD_HACKS_FILE, this.name, 'frames', customHackKeys);
  }
}

/** Manages all of the integration of the user mods */
export class ModManager {
  /** Cache flag that becomes true whenever the game detects any mod in the game folder */
  public usingMods = false;

  private _activeMods: Map<string, Mod>;

  constructor() {
    this._activeMods = new Map<string, Mod>();
    
    // initializing usingMods cache
    this.getMods();
  }

  getMods(): string[] {
    const mods = fs.readdirSync(MODS_DIRECTORY).filter((name) => !FORBIDDEN_NAMES.has(name));
    this.usingMods = mods.length > 0
    return mods;
  }

  getActiveMods() {
    return this._activeMods.keys();
  }

  /** Enables all the mods that the active mods file said are supposed to be active, filtering and returning the mods that raised an error */
  initializeMods(): string[] {
    const activeMods = fs.readFileSync(modsSettingsPath, { encoding: 'utf-8'} ).split('\n').map((value) => value.trim()).filter((value) => value !== '');

    const failedMods: string[] = [];
    for (const modName of activeMods) {
      try {
        const mod = new Mod(modName);

        mod.loadCustomItems();
        mod.loadCustomFrameHacks();
        this._activeMods.set(modName, mod);
      } catch (e) {
        if (e instanceof ModError) {
          failedMods.push(modName);
        }
      }
    }

    this.writeActiveMods();

    return failedMods;
  }

  writeActiveMods() {
    fs.writeFileSync(modsSettingsPath, [...this.getActiveMods()].join('\n'));
  }

  /** Attempts to enable a mod. Will raise an error if the mod is incorrect */
  setModActive(name: string): void {
    const mod = new Mod(name);
    mod.loadCustomItems();
    mod.loadCustomFrameHacks();

    this._activeMods.set(name, mod);
    this.writeActiveMods();
  }

  setModInactive(name: string): void {
    const mod = this._activeMods.get(name);
    if (mod !== undefined) {
      mod.unloadCustomItems();
      mod.unloadCustomFrameHacks();
      this._activeMods.delete(name);
      this.writeActiveMods();
    }
  }

  isModActive(name: string): boolean {
    return this._activeMods.has(name);
  }
}

export function getModRouter(m: ModManager): Router {
  const router = Router();
  
  router.get('/*', (req: Request, res, next) => {
    if (!m.usingMods) {
      next();
      return;
    }
    for (const mod of m.getActiveMods()) {
      const modFilePath = path.join(MODS_DIRECTORY, mod, req.params[0]);
      if (fs.existsSync(modFilePath)) {
        res.sendFile(modFilePath);
        return;
      }
    } 
    next();
  })

  return router
}