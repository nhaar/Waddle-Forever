import fs from 'fs';
import path from 'path';

import toml from 'toml';

interface Settings {
  fps30: boolean
}

const settingsPath = path.join(process.cwd(), 'settings.toml');

if (!fs.existsSync(settingsPath)) {
  fs.writeFileSync(settingsPath, `[settings]
30fps=false`);
}

const parsed = toml.parse(fs.readFileSync(settingsPath, { encoding: 'utf-8'})).settings;

const settings: Settings = {
  fps30: parsed['30fps']
};

export default settings;