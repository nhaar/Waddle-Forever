import fs from 'fs';
import path from 'path';
import { Router, Request } from "express";
import { MODS_DIRECTORY, MOD_ITEMS_FILE, SETTINGS_PATH } from '../common/paths';
import { isVersionValid, Version } from './routes/versions';
import { HTTP_PORT } from '../common/constants';
import { LOGIN_DELTA, WORLD_DELTA } from './servers';
import { CustomItem, ITEMS } from './game-logic/items';
import { iterateEntries } from '@common/utils';


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

export type BooleanSettingKey = 
  'fps30' | 
  'thin_ice_igt' |
  'clothing' |
  'modern_my_puffle' |
  'remove_idle' |
  'jpa_level_selector' |
  'swap_dance_arrow' |
  'always_member' |
  'minified_website' |
  'no_rainbow_quest_wait' |
  'medieval_sound_fix' |
  'inventory_accuracy' |
  'no_create_via_login' |
  'faq_warning';

export type Settings = {
  version: Version
  /** Whether or not the user has answered if they want to install a package or not */
  answered_packages: string
  ignored_version: string
} & Record<BooleanSettingKey, boolean>;

type PartialSettings = Partial<Settings>

const modsSettingsPath = path.join(MODS_DIRECTORY, '.active_mods');

if (!fs.existsSync(MODS_DIRECTORY)) {
  fs.mkdirSync(MODS_DIRECTORY);
}
if (!fs.existsSync(modsSettingsPath)) {
  fs.writeFileSync(modsSettingsPath, '');
}

function getActiveMods(): string[] {
  return fs.readFileSync(modsSettingsPath, { encoding: 'utf-8'} ).split('\n').map((value) => value.trim()).filter((value) => value !== '')
}

const FORBIDDEN_NAMES = new Set([
  '.active_mods', // mod tracker for WF
  '.DS_Store'   // macOS folder file
]);

function getMods(): string[] {
  return fs.readdirSync(MODS_DIRECTORY).filter((name) => !FORBIDDEN_NAMES.has(name));
}

export function getModRouter(s: SettingsManager): Router {
  const router = Router();
  
  router.get('/*', (req: Request, res, next) => {
    if (!s.usingMods) {
      next();
      return;
    }
    for (const mod of s.activeMods) {
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

/** Errors raised from incorrect items declaration for mods */
export class ModItemsError extends Error {}

export class SettingsManager {
  settings: Settings;

  usingMods = false;

  activeMods: string[] = [];

  /** IP used by the server */
  targetIP: string;

  /** HTTP port used by the server, undefined if default */
  private _targetPort: number | undefined;

  set targetPort(port: number | undefined) {
    this._targetPort = port;
  }

  get targetPort(): number {
    return this._targetPort ?? HTTP_PORT;
  }

  constructor () {
    let settingsJson: any = {};

    if (fs.existsSync(SETTINGS_PATH)) {
      settingsJson = JSON.parse(fs.readFileSync(SETTINGS_PATH, { encoding: 'utf-8' }));
    }

    this.activeMods = getActiveMods();
    this.getMods();

    this.settings = {
      fps30: this.readBoolean(settingsJson, 'fps30', false),
      thin_ice_igt: this.readBoolean(settingsJson, 'thin_ice_igt', false),
      clothing: this.readBoolean(settingsJson, 'clothing', false),
      modern_my_puffle: this.readBoolean(settingsJson, 'modern_my_puffle', false),
      remove_idle: this.readBoolean(settingsJson, 'remove_idle', false),
      jpa_level_selector: this.readBoolean(settingsJson, 'jpa_level_selector', false),
      swap_dance_arrow: this.readBoolean(settingsJson, 'swap_dance_arrow', false),
      version: this.readVersion(settingsJson),
      always_member: this.readBoolean(settingsJson, 'always_member', true),
      minified_website: this.readBoolean(settingsJson, 'minified_website', false),
      no_rainbow_quest_wait: this.readBoolean(settingsJson, 'no_rainbow_quest_wait', false),
      no_create_via_login: this.readBoolean(settingsJson, 'no_create_via_login', false),
      answered_packages: this.readString(settingsJson, 'answered_packages'),
      ignored_version: this.readString(settingsJson, 'ignored_version'),
      medieval_sound_fix: this.readBoolean(settingsJson, 'medieval_sound_fix', true),
      inventory_accuracy: this.readBoolean(settingsJson, 'inventory_accuracy', true),
      faq_warning: this.readBoolean(settingsJson, 'faq_warning', false)
    };

    this.updateSettings({});

    this.targetIP = '127.0.0.1';
    this.targetPort = HTTP_PORT;
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
    const modItems = SettingsManager.getModItems(modName);
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
    SettingsManager.getModItems(modName).forEach(item => {
      ITEMS.removeCustomItem(item.id);
    });
  }

  /** Load all custom items and set to inactive mods that caused an issue (and return them) */
  initializeModItems(): string[] {
    const failedMods: string[] = [];
    for (const modName of this.activeMods) {
      try {
        SettingsManager.loadCustomItems(modName);
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

  readString(object: any, property: string): string {
    const value = object[property];
    if (typeof value === 'string') {
      return value;
    } else {
      return '';
    }
  }

  readVersion(object: any): Version {
    const value = object['version'];
    if (value === undefined || !isVersionValid(value)) {
      return '2010-10-25';
    } else {
      return value;
    }
  }

  readBoolean(object: any, property: string, default_value: boolean): boolean {
    const value = object[property];
    if (typeof value === 'boolean') {
      return value;
    } else {
      return default_value;
    }
  }

  updateSettings(partial: PartialSettings): void {
    this.settings = { ...this.settings, ...partial};
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(this.settings));
  }

  setModActive(name: string): void {
    this.activeMods.push(name);
    fs.writeFileSync(modsSettingsPath, this.activeMods.join('\n'));
  }

  setModInactive(name: string): void {
    this.activeMods = this.activeMods.filter((mod) => mod !== name);
    fs.writeFileSync(modsSettingsPath, this.activeMods.join('\n'));
 }

  getMods(): string[] {
    const mods = getMods();
    this.usingMods = mods.length > 0
    return mods;
  }

  get loginPort() {
    return this.targetPort + LOGIN_DELTA;
  }

  get worldPort() {
    return this.targetPort + WORLD_DELTA;
  }
}

const settingsManager = new SettingsManager();

export default settingsManager;