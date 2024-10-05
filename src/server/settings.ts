import fs from 'fs';
import path from 'path';

interface Settings {
  fps30: boolean
  thin_ice_igt: boolean
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
      thin_ice_igt: this.readBoolean(settingsJson, 'thin_ice_igt', false)
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