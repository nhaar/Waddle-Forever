import fs from 'fs';
import { SETTINGS_PATH } from '../common/paths';
import { isVersionValid, processVersion, Version } from './routes/versions';
import { HTTP_PORT } from '../common/constants';
import { LOGIN_DELTA, WORLD_DELTA } from './servers';
import { ModManager } from './mods';
import { EventListener } from '@common/utils';

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

export class SettingsManager {
  settings: Settings;

  public mods: ModManager;

  /** IP used by the server */
  targetIP: string;

  /** HTTP port used by the server, undefined if default */
  private _targetPort: number | undefined;

  private updateListener = new EventListener();

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

    this.mods = new ModManager();

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

    this.updateListener.fire();
  }

  public addListener(callback: () => void) {
    this.updateListener.addListener(callback);
  }

  get loginPort() {
    return this.targetPort + LOGIN_DELTA;
  }

  get worldPort() {
    return this.targetPort + WORLD_DELTA;
  }

  getVirtualDate(offset: number): Date {
    const [year, month, day] = processVersion(this.settings.version);
    // simulating PST time for the current day
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    // date generates this time thinking in the same timezone as the user
    // an arbitrary offset may be applied depending on how each client behaves
    return new Date(year, month - 1, day, hour + offset, minute, second);
  }
}

const settingsManager = new SettingsManager();

export default settingsManager;