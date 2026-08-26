import fs from 'fs';
import path from 'path';
import { MODS_DIRECTORY, MOD_HACKS_FILE, MOD_ITEMS_FILE, MOD_MUSIC_FILE } from '@common/paths';
import { CustomItem, ITEMS } from './game-logic/items';
import { getFilesInDirectory, iterateEntries, EventListener } from '@common/utils';
import { Router, Request } from "express";
import { CustomHack, FRAME_HACKS } from './game-data/frame-hacks';
import { RoomName, ROOMS } from './game-data/rooms';

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

/** Name of file that tracks the active mods */
const ACTIVE_MODS_FILE = '.active_mods'

const modsSettingsPath = path.join(MODS_DIRECTORY, ACTIVE_MODS_FILE);

if (!fs.existsSync(MODS_DIRECTORY)) {
  fs.mkdirSync(MODS_DIRECTORY);
}
if (!fs.existsSync(modsSettingsPath)) {
  fs.writeFileSync(modsSettingsPath, '');
}

// macOS folder file
const MAC_FOLDER_FILE = '.DS_Store'

const FORBIDDEN_FOLDER_NAMES = new Set([
  ACTIVE_MODS_FILE,
  MAC_FOLDER_FILE
]);

const FORBIDDEN_FILE_NAMES = new Set([
  MOD_ITEMS_FILE,
  MOD_HACKS_FILE,
  MAC_FOLDER_FILE
]);

/** Errors raised from incorrect JSON in mods */
export class ModError extends Error {}

function getModFile(file: string, mod: string): ({
  type: 'exists', content: any
} | {
  type: 'none'
} | {
  type: 'parseerror'
}) {
  const filePath = path.join(MODS_DIRECTORY, mod, file);
  if (fs.existsSync(filePath)) {
    try {
      return {
        type: 'exists',
        content: JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }))
      }
    } catch (error) {
      if (!(error instanceof SyntaxError)) {
        throw error;
      }
      return {
        type: 'parseerror'
      };
    }

  }
  return {
    type: 'none'
  };
}

/** Helper function that parses a JSON file for an array of objects */
function parseObjectArrayJSON<T extends {}>(file: string, mod: string, name: string, keyTypes: KeyTypes<T>): T[] {
  const modContent = getModFile(file, mod);

  if (modContent.type !== 'none') {
    const objs = modContent.type === 'exists' ? modContent.content : undefined;

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
  private music: Map<RoomName, number>;
  // all file routes that this mod serves
  private files: string[];
  
  constructor(private name: string) {
    this.items = this.getItems();
    this.hacks = this.getHacks();
    this.music = this.getMusic();
    this.files = getFilesInDirectory(path.join(MODS_DIRECTORY, this.name)).filter(file => {
      return !FORBIDDEN_FILE_NAMES.has(file);
    });
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

  public getFiles() {
    return this.files;
  }

  public getName() {
    return this.name;
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

  private getMusic(): Map<RoomName, number> {
    const fileContent = getModFile(MOD_MUSIC_FILE, this.name);
    if (fileContent.type === 'none') {
      return new Map();
    }

    if (fileContent.type === 'parseerror') {
      throw new ModError('Your mod contains an error in the music file. Please review the syntax of your JSON file');
    }

    const content = fileContent.content;
    const map = new Map<RoomName, number>();
    
    if (Array.isArray(content)) {
      throw new ModError('Your mod contains incorrect JSON for the music file. It contains an array (square brackets) when it should include an object (curly brackets). Please review the syntax of the file');
    }

    for (const key of Object.keys(content)) {
      if (!(key in ROOMS)) {
        throw new ModError(`Unknown room name in music file: ${key}. Check the list of valid room names if you are unsure`);
      }
      if (typeof content[key] !== 'number') {
        throw new ModError(`Non number music found for room ${key} in the music file. Please change it to be the ID of a music file`);
      }
      map.set(key as RoomName, content[key]);
    }

    return map;
  }

  public getRoomsMusic(): Map<RoomName, number> {
    return this.music;
  }
}

/** Manages all of the integration of the user mods */
export class ModManager {
  /** Cache flag that becomes true whenever the game detects any mod in the game folder */
  public usingMods = false;

  private _activeMods: Map<string, Mod>;

  private updateListener = new EventListener();

  constructor() {
    this._activeMods = new Map<string, Mod>();
    
    // initializing usingMods cache
    this.getMods();
  }

  getMods(): string[] {
    const mods = fs.readdirSync(MODS_DIRECTORY).filter((name) => !FORBIDDEN_FOLDER_NAMES.has(name));
    this.usingMods = mods.length > 0
    return mods;
  }

  getActiveMods() {
    return this._activeMods.values();
  }

  getActiveModNames() {
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

  addListener(callback: () => void) {
    this.updateListener.addListener(callback);
  }

  writeActiveMods() {
    this.updateListener.fire();
    fs.writeFileSync(modsSettingsPath, [...this.getActiveModNames()].join('\n'));
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

  public getMusic(): Map<RoomName, number> {
    return [...this._activeMods.values()].map(m => m.getRoomsMusic()).reduce((previous, current) => new Map([...previous, ...current]), new Map<RoomName, number>());
  }
}
