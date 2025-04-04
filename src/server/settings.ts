import fs from 'fs';
import path from 'path';
import { Router, Request } from "express";
import { MODS_DIRECTORY, SETTINGS_PATH } from '../common/paths';

export type GameVersion = '2005-Aug-22'
  | '2005-Sep-12'
  | '2005-Sep-21'
  | '2005-Sep-22'
  | '2005-Oct-24'
  | '2005-Oct-27'
  | '2005-Oct-28'
  | '2005-Nov-01'
  | '2005-Nov-03'
  | '2005-Nov-08'
  | '2005-Nov-11'
  | '2005-Nov-15'
  | '2005-Nov-16'
  | '2005-Nov-18'
  | '2005-Nov-21'
  | '2005-Dec-01'
  | '2005-Dec-05'
  | '2005-Dec-08'
  | '2005-Dec-14'
  | '2005-Dec-15'
  | '2005-Dec-22'
  | '2005-Dec-26'
  | '2005-Dec-29'
  | '2006-Jan-01'
  | '2006-Jan-05'
  | '2006-Jan-12'
  | '2006-Jan-19'
  | '2006-Jan-26'
  | '2006-Feb-02'
  | '2006-Feb-03'
  | '2006-Feb-09'
  | '2006-Feb-14'
  | '2006-Feb-15'
  | '2006-Feb-16'
  | '2006-Feb-23'
  | '2006-Feb-24'
  | '2006-Feb-28'
  | '2006-Mar-02'
  | '2006-Mar-03'
  | '2006-Mar-09'
  | '2006-Mar-16'
  | '2006-Mar-17'
  | '2006-Mar-23'
  | '2006-Mar-29'
  | '2006-Mar-30'
  | '2006-Mar-31'
  | '2006-Apr-03'
  | '2006-Apr-06'
  | '2006-Apr-13'
  | '2006-Apr-07'
  | '2010-Sep-03'
  | '2010-Sep-10'
  | '2010-Sep-24'
  | '2010-Oct-23'
  | '2010-Oct-28'
  | '2010-Nov-24';

interface Settings {
  fps30: boolean
  thin_ice_igt: boolean
  clothing: boolean
  modern_my_puffle: boolean
  remove_idle: boolean
  jpa_level_selector: boolean
  swap_dance_arrow: boolean
  version: GameVersion
  always_member: boolean
  minified_website: boolean
}

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

function getMods(): string[] {
  return fs.readdirSync(MODS_DIRECTORY).filter((name) => name !== '.active_mods');
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


export class SettingsManager {
  settings: Settings;

  isEditting = false;

  usingMods = false;

  activeMods: string[] = [];

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
      minified_website: this.readBoolean(settingsJson, 'minified_website', false)
    };

    this.updateSettings({});
  }

  readVersion(object: any): GameVersion {
    const value = object['version'];
    if (value === undefined) {
      return '2010-Nov-24';
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
}

const settingsManager = new SettingsManager();

export default settingsManager;