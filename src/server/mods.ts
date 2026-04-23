import fs from 'fs';
import path from 'path';
import { MODS_DIRECTORY, MOD_ITEMS_FILE } from '@common/paths';
import { CustomItem, ITEMS } from './game-logic/items';
import { iterateEntries } from '@common/utils';
import { Router, Request } from "express";

// type declarations that are used to validate the properties of the custom item object

// map of the possible property types and the result of typeof
type ItemTypeName<T> =
  T extends number ? 'number' :
  T extends string ? 'string' :
  T extends boolean ? 'boolean' :
  'unknown';

// record type to enforce the object below to be complete
type ItemKeyTypes = {
  [K in keyof CustomItem]: ItemTypeName<CustomItem[K]>;
};

// object used for validating a custom item
const customItemKeys: ItemKeyTypes = {
  cost: 'number',
  id: 'number',
  'isBack': 'boolean',
  'isMember': 'boolean',
  'layer': 'number',
  'name': 'string',
  'type': 'number'
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

/** Errors raised from incorrect items declaration for mods */
export class ModItemsError extends Error {}

/** Manages all of the integration of the user mods */
export class ModManager {
  /** Cache flag that becomes true whenever the game detects any mod in the game folder */
  public usingMods = false;

  private _activeMods: Set<string>;

  constructor() {
    this._activeMods = new Set<string>(fs.readFileSync(modsSettingsPath, { encoding: 'utf-8'} ).split('\n').map((value) => value.trim()).filter((value) => value !== ''));
    
    // initializing usingMods cache
    this.getMods();
  }

  getMods(): string[] {
    const mods = fs.readdirSync(MODS_DIRECTORY).filter((name) => !FORBIDDEN_NAMES.has(name));
    this.usingMods = mods.length > 0
    return mods;
  }

  getActiveMods() {
    return this._activeMods.values();
  }

  /** Get list of items defined by a mod */
  static getModItems(modName: string): CustomItem[] {
    const modItemsFile = path.join(MODS_DIRECTORY, modName, MOD_ITEMS_FILE);
    if (fs.existsSync(modItemsFile)) {
      const items = JSON.parse(fs.readFileSync(modItemsFile, { encoding: 'utf-8' }));

      if (!Array.isArray(items)) {
        throw new ModItemsError('Your mod contains invalid JSON, there should be an array (square brackets) with items inside.');
      }

      items.forEach(item => {
        if (typeof item !== 'object' || item === null) {
          throw new ModItemsError('Invalid JSON member inside the array (square brackets). It should contain an item which is defined with curly brackets');
        }

        iterateEntries(customItemKeys, (key, type) => {
          if (!(key in item) || typeof item[key] !== type) {
            throw new ModItemsError(`Invalid value for the ${key} of the item: ${key} must be a ${type}`);
          }
        });
      })

      items as CustomItem[];
      return items;
    }
    return [];
  }

  /** Add items from a mod to memory */
  static loadCustomItems(modName: string): void {
    const modItems = ModManager.getModItems(modName);
    const conflicts = modItems.filter(item => {
      return ITEMS.has(item.id);
    });
    // only add items if there are no errors
    if (conflicts.length === 0) {
      modItems.forEach(item => ITEMS.addCustomItem(item));
    } else {
      throw new ModItemsError(`There was a conflict of item IDs, either with another mod, or with an item from the original game. Conflicting item IDs: ${conflicts.map(item => item.id).join(', ')}`);
    }
  }

  /** Remove from memory items defined by a mod */
  static unloadCustomItems(modName: string): void {
    ModManager.getModItems(modName).forEach(item => {
      ITEMS.removeCustomItem(item.id);
    });
  }

  /** Load all custom items and set to inactive mods that caused an issue (and return them) */
  initializeModItems(): string[] {
    const failedMods: string[] = [];
    for (const modName of this.getActiveMods()) {
      try {
        ModManager.loadCustomItems(modName);
      } catch (e) {
        if (e instanceof ModItemsError) {
          failedMods.push(modName);
        }
      }
    }

    failedMods.forEach(mod => {
      this.setModInactive(mod);
    });

    return failedMods;
  }

  writeActiveMods() {
    fs.writeFileSync(modsSettingsPath, [...this.getActiveMods()].join('\n'));
  }

  setModActive(name: string): void {
    this._activeMods.add(name);
    this.writeActiveMods();
  }

  setModInactive(name: string): void {
    this._activeMods.delete(name);
    this.writeActiveMods();
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