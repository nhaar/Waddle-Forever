import fs from 'fs';
import path from 'path';

interface Settings {
  fps30: boolean
  thin_ice_igt: boolean
  clothing: boolean
  modern_my_puffle: boolean
  remove_idle: boolean
  jpa_level_selector: boolean
  swap_dance_arrow: boolean
}

type PartialSettings = Partial<Settings>

const settingsPath = path.join(process.cwd(), 'settings.json');

export class SettingsManager {
  settings: Settings;

  isEditting = false;

  constructor () {
    let settingsJson: any = {};

    if (fs.existsSync(settingsPath)) {
      settingsJson = JSON.parse(fs.readFileSync(settingsPath, { encoding: 'utf-8' }));
    }

    this.settings = {
      fps30: this.readBoolean(settingsJson, 'fps30', false),
      thin_ice_igt: this.readBoolean(settingsJson, 'thin_ice_igt', false),
      clothing: this.readBoolean(settingsJson, 'clothing', false),
      modern_my_puffle: this.readBoolean(settingsJson, 'modern_my_puffle', false),
      remove_idle: this.readBoolean(settingsJson, 'remove_idle', false),
      jpa_level_selector: this.readBoolean(settingsJson, 'jpa_level_selector', false),
      swap_dance_arrow: this.readBoolean(settingsJson, 'swap_dance_arrow', false)
    };

    this.updateSettings({});
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
    for (const key in partial) {
      this.settings[key as keyof Settings] = partial[key as keyof PartialSettings];
    }
    fs.writeFileSync(settingsPath, JSON.stringify(this.settings));
  }
}

const settingsManager = new SettingsManager();

export default settingsManager;