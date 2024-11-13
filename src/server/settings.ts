import fs from 'fs';
import path from 'path';
import { Router, Request } from "express";

export type GameVersion = '2005-Aug-22'
  | '2005-Sep-21'
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

const settingsPath = path.join(process.cwd(), 'settings.json');

const modsPath = path.join(process.cwd(), 'mods');

const modsSettingsPath = path.join(modsPath, '.active_mods');

if (!fs.existsSync(modsPath)) {
  fs.mkdirSync(modsPath);
}
if (!fs.existsSync(modsSettingsPath)) {
  fs.writeFileSync(modsSettingsPath, '');
}

function getActiveMods(): string[] {
  return fs.readFileSync(modsSettingsPath, { encoding: 'utf-8'} ).split('\n').map((value) => value.trim()).filter((value) => value !== '')
}

function getMods(): string[] {
  return fs.readdirSync(modsPath).filter((name) => name !== '.active_mods');
}

export function getModRouter(s: SettingsManager): Router {
  const router = Router();
  
  router.get('/*', (req: Request, res, next) => {
    for (const mod of s.activeMods) {
      const modFilePath = path.join(modsPath, mod, req.params[0]);
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

  installedMods: string[];

  constructor () {
    let settingsJson: any = {};

    if (fs.existsSync(settingsPath)) {
      settingsJson = JSON.parse(fs.readFileSync(settingsPath, { encoding: 'utf-8' }));
    }

    this.activeMods = getActiveMods();
    this.installedMods = getMods();
    this.usingMods = this.installedMods.length > 0;

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
    fs.writeFileSync(settingsPath, JSON.stringify(this.settings));
  }

  setModActive(name: string): void {
    this.activeMods.push(name);
    fs.writeFileSync(modsSettingsPath, this.activeMods.join('\n'));
  }

  setModInactive(name: string): void {
    this.activeMods = this.activeMods.filter((mod) => mod !== name);
    fs.writeFileSync(modsSettingsPath, this.activeMods.join('\n'));
 }
}

const settingsManager = new SettingsManager();

export default settingsManager;