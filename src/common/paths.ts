import path from 'path';
import os from 'os';
import fs from 'fs';

const IS_DEV = process.env.NODE_ENV === 'dev';

/**
 * This makes the user data be stored in the game folder itself.
 * It is useful for development (so that it doesn't interfere with local production values)
 * 
 * Given the existence of `.uselocal` file the user is granted the opportunity to isolate the
 * game data if they REALLY want to (just so that it can be possible for multipl versions to
 * exist in the same computer)
 */
const useGameFolder = IS_DEV || fs.existsSync(path.join(process.cwd(), '.uselocal'));

/** Get the data folder location for each OS */
function getOsDataFolder() {
  switch (process.platform) {
    case 'win32':
      return path.join(process.env.APPDATA, 'WaddleForever');
    case 'linux':
      return path.join(os.homedir(), '.waddleforever');
    default:
      break;
  }
}

/** Folder where all the WF user data is kept */
const USER_DATA_FOLDER = useGameFolder ? process.cwd() : getOsDataFolder();

export const DATABASE_DIRECTORY = path.join(USER_DATA_FOLDER, 'data');
export const MODS_DIRECTORY = path.join(USER_DATA_FOLDER, 'mods');
export const SETTINGS_PATH = path.join(USER_DATA_FOLDER, 'settings.json');

fs.mkdirSync(USER_DATA_FOLDER, { recursive: true });