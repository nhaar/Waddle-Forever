import fs from 'fs';
import path from 'path';
import { Router, Request } from "express";
import { MODS_DIRECTORY, SETTINGS_PATH } from '../common/paths';
import { isVersionValid, Version } from './routes/versions';
import { HTTP_PORT } from '../common/constants';
import { LOGIN_DELTA, WORLD_DELTA } from './servers';

export interface Settings {
  fps30: boolean
  thin_ice_igt: boolean
  clothing: boolean
  modern_my_puffle: boolean
  remove_idle: boolean
  jpa_level_selector: boolean
  swap_dance_arrow: boolean
  version: Version
  always_member: boolean
  minified_website: boolean
  no_rainbow_quest_wait: boolean
  /** Whether or not the user has answered if they want to install a package or not */
  answered_packages: string
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
      answered_packages: this.readString(settingsJson, 'answered_packages')
    };

    this.updateSettings({});

    this.targetIP = '127.0.0.1';
    this.targetPort = HTTP_PORT;
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