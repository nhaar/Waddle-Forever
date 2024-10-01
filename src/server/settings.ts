import fs from 'fs';
import path from 'path';

import toml from 'toml';

interface Settings {
  fps30: boolean
  thin_ice_igt: boolean
}

const settingsPath = path.join(process.cwd(), 'settings.toml');

if (!fs.existsSync(settingsPath)) {
  fs.writeFileSync(settingsPath, `[settings]
30fps=false
thin_ice_igt=false`);
}

const parsed = toml.parse(fs.readFileSync(settingsPath, { encoding: 'utf-8'})).settings;

const settings: Settings = {
  fps30: parsed['30fps'] ,
  thin_ice_igt: parsed['thin_ice_igt']
};

export default settings;