import path from 'path';
import fs, { writeFileSync } from 'fs';
import { VERSION } from '../../common/version';
import { DATABASE_DIRECTORY } from '../../common/paths';

export enum Databases {
  Penguins = 'penguins'
}

type JsonProperty = string | number | boolean

const versionFile = path.join(DATABASE_DIRECTORY, '.version');

/**
 * A replacement to sqlite since it was not working with the electron dependencies
 * 
 * This also allows to edit the database easily and the performance is not an issue
 */
class JsonDatabase {
  /** Absolute path to the database folder */
  root: string;

  constructor (rootDir: string) {
    this.root = rootDir;
  }

  private getSubDatabaseDir (name: string): string {
    return path.join(this.root, name);
  }

  private getSeqDir (name: string): string {
    return path.join(this.root, name, 'seq');
  }

  loadDatabase() {
    if (fs.existsSync(DATABASE_DIRECTORY)) { // migrate or leave it
      const version = fs.existsSync(versionFile) ? (
        fs.readFileSync(versionFile, { encoding: 'utf-8' }).trim()
      ) : '0.2.0' // version 0.2.0 didnt have a .version file
      // any version before is not compatible with
      if (version !== VERSION) {
        this.migrateDatabase(version);
      }
    } else { // create
      this.createDatabase();
    }
  }

  private migrate_0_2_0(): void {
    const penguinsDir = path.join(DATABASE_DIRECTORY, 'penguins')
    const penguins = fs.readdirSync(penguinsDir)
    for (const penguin of penguins) {
      if (penguin.match(/\d+\.json/) !== null) {
        const penguinDir = path.join(penguinsDir, penguin)
        const content = JSON.parse(fs.readFileSync(penguinDir, { encoding: 'utf-8' }))
        content.is_member = true;
        const inventory: any = {}
        for (const item of content.inventory) {
          inventory[item] = 1
        }
        content.inventory = inventory
        content.furniture = {}
        content.iglooTypes = { 1: 1 }
        fs.writeFileSync(penguinDir, JSON.stringify(content))
      }
    }
  }

  private migrate_0_3_3() {
    const penguinsDir = path.join(DATABASE_DIRECTORY, 'penguins')
    const penguins = fs.readdirSync(penguinsDir)

    const penguinIds: number[] = [];

    const hashMapToArray = (hashMap: any) => {
      const array: number[] = [];
      for (const item in hashMap) {
        array.push(Number(item));
      }
      return array;
    }

    for (const penguin of penguins) {
      const penguinmatch = penguin.match(/(\d+)\.json/);
      if (penguinmatch !== null) {
        penguinIds.push(Number(penguinmatch[1]));
        const penguinDir = path.join(penguinsDir, penguin)
        const content = JSON.parse(fs.readFileSync(penguinDir, { encoding: 'utf-8' }))
        content.inventory = hashMapToArray(content.inventory);
        content.iglooTypes = hashMapToArray(content.iglooTypes);

        const previousIgloo = content.igloo;
        const newIgloo = {
          ...previousIgloo,
          id: 1,
          locked: true,
          location: 1,
          type: previousIgloo.type === 0 ? 1 : previousIgloo.type
        }
        content.igloo = 1;
        content.igloos = [newIgloo];
        content.iglooSeq = 1;
        content.iglooFloorings = [];
        content.iglooLocations = [1];
        content.careerMedals = 0;
        content.ownedMedals = 0;
        content.nuggets = 0;
        content.backyard = [];
        content.puffleItems = {};
        content.hasDug = false;
        content.treasureFinds = [];
        content.rainbow = {
          adoptability: false,
          currentTask: 0,
          coinsCollected: []
        }
        content.id = undefined;

        fs.writeFileSync(penguinDir, JSON.stringify(content))
      }
    }

    penguinIds.forEach((penguinId) => {
      fs.renameSync(path.join(penguinsDir, `${penguinId}.json`), path.join(penguinsDir, `${penguinId + 100}.json`));
    });

    // in this versions, penguins seq now starts at 100 instead of 0 (fix mascot IDs)
    const seqDir = path.join(penguinsDir, 'seq');
    const previousSeq = fs.readFileSync(seqDir, { encoding: 'utf-8' });
    fs.writeFileSync(seqDir, String(Number(previousSeq) + 100));
  }

  private migrate_1_1_2() {
    const penguinsDir = path.join(DATABASE_DIRECTORY, 'penguins')
    const penguins = fs.readdirSync(penguinsDir)
    for (const penguin of penguins) {
      if (penguin.match(/\d+\.json/) !== null) {
        const penguinDir = path.join(penguinsDir, penguin)
        const content = JSON.parse(fs.readFileSync(penguinDir, { encoding: 'utf-8' }))

        content.cards = {};
        content.cardProgress = 0;
        content.isNinja = false;
        content.senseiAttempts = 0;
        content.cardWins = 0;

        fs.writeFileSync(penguinDir, JSON.stringify(content))
      }
    }
  }

  private migrate_1_2_2() {
    const penguinsDir = path.join(DATABASE_DIRECTORY, 'penguins')
    const penguins = fs.readdirSync(penguinsDir)
    for (const penguin of penguins) {
      if (penguin.match(/\d+\.json/) !== null) {
        const penguinDir = path.join(penguinsDir, penguin)
        const content = JSON.parse(fs.readFileSync(penguinDir, { encoding: 'utf-8' }))

        content.battleOfDoom = false;

        fs.writeFileSync(penguinDir, JSON.stringify(content))
      }
    }
  }

  private migrateVersion(version: string): string {
    switch (version) {
      case '0.2.0':
        this.migrate_0_2_0()
        return '0.2.1';
      case '0.2.1':
        return '0.2.2';
      case '0.2.2':
        return '0.2.3';
      case '0.2.3':
        return '0.3.0';
      case '0.3.0':
        return '0.3.1';
      case '0.3.1':
        return '0.3.2';
      case '0.3.2':
        return '0.3.3';
      case '0.3.3':
        this.migrate_0_3_3();
        return '1.0.0';
      case '1.0.0':
        return '1.1.0';
      case '1.1.0':
        return '1.1.1';
      case '1.1.1':
        return '1.1.2';
      case '1.1.2':
        this.migrate_1_1_2();
        return '1.2.0';
      case '1.2.0':
        return '1.2.1';
      case '1.2.1':
        return '1.2.2';
      case '1.2.2':
        this.migrate_1_2_2();
        return '1.3.0';
      default:
        throw new Error('Invalid database version: ' + version);
    }
  }

  migrateDatabase(version: string): void {
    let curVersion = version
    while (curVersion !== VERSION) {
      curVersion = this.migrateVersion(curVersion);
    }
    fs.writeFileSync(versionFile, VERSION);
  }

  createDatabase(): void {
    if (!fs.existsSync(DATABASE_DIRECTORY)) {
      fs.mkdirSync(DATABASE_DIRECTORY)
    }
    db.createSubDatabase(Databases.Penguins, 100);
    fs.writeFileSync(versionFile, VERSION);
  }

  createSubDatabase(database: Databases, initialSeq: number = 0) {
    const subDir = this.getSubDatabaseDir(database);
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir);
    }
    const seqDir = this.getSeqDir(database);
    if (!fs.existsSync(seqDir)) {
      fs.writeFileSync(seqDir, String(initialSeq));
    }
  }

  update<T>(database: Databases, id: number, data: T): void {
    const subDir = this.getSubDatabaseDir(database);
    fs.writeFileSync(path.join(subDir, `${id}.json`), JSON.stringify(data));
  }

  getById<T>(database: Databases, id: number): T | undefined {
    const subDir = this.getSubDatabaseDir(database);
    const filePath = path.join(subDir, String(id) + '.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
      return JSON.parse(content);
    } else {
      return undefined;
    }
  }

  get<T>(database: Databases, property: string, value: JsonProperty): [T, number] | undefined {
    const isString = typeof value === 'string';
    const subDir = this.getSubDatabaseDir(database);
    const files = fs.readdirSync(subDir);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file === 'seq') {
        continue;
      }
      const idMatch = file.match(/\d+/);
      if (idMatch === null) {
        // invalid file, not an ID
        continue;
      }
      const id = Number(idMatch[0]);
      const content = fs.readFileSync(path.join(subDir, file), { encoding: 'utf-8' });
      const data = JSON.parse(content);
      if (isString && data[property].toLowerCase() === value.toLowerCase()) {
        return [data, id];
      } else if (data[property] === value) {
        return [data, id];
      }
    }

    return undefined;
  }

  add<T>(database: Databases, value: T): [T, number] {
    const seqDir = this.getSeqDir(database);
    const seq = Number(fs.readFileSync(seqDir, { encoding: 'utf-8' }));
    const id = seq + 1;
    this.update(database, id, { ...value });
    writeFileSync(seqDir, String(id));
    return [value, id];
  }
}

const db = new JsonDatabase(DATABASE_DIRECTORY);

export function parseJsonSet<T>(array: T[]): Set<T> {
  return new Set<T>(array);
}

export function dumpJsonSet<T>(set: Set<T>): T[] {
  return Array.from(set.values());
}

export function parseJsonMap<
  T extends string | number,
  K,
  IsNumber extends boolean = T extends number ? true : false
>(obj: Record<T, K>, isNumber: IsNumber): Map<T, K> {
  const map = new Map<T, K>();
  for (const [key, value] of Object.entries(obj)) {
    const parsedKey = isNumber ? Number(key) : key;
    map.set(parsedKey as T, value as K);
  }
  return map;
}
export function dumpJsonMap<T extends string | number, K>(map: Map<T, K>): Record<T, K> {
  const obj: Record<string | number, K> = {};
  map.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

export function parseJsonRows<T extends { id: number }>(rows: T[]): Map<number, T> {
  const map = new Map<number, T>();
  for (const row of rows) {
    map.set(row.id, row);
  }
  return map;
}

export function dumpJsonRows<T extends { id: number }>(map: Map<number, T>): T[] {
  return Array.from(map.values());
}

export function isRainbowStage(str: string): str is RainbowPuffleStage {
  return str === '0' || str === '1' || str === '2' || str === '3' || str === 'bonus';
}

export interface PlayerPuffle {
  id: number
  name: string
  type: number
  clean: number
  food: number
  rest: number
}

export type IglooFurniture = Array<{
  id: number,
  x: number,
  y: number,
  rotation: number,
  frame: number
}>

type FurnitureId = number
type FurnitureAmount = number

export type Stampbook = {
  color: number,
  highlight: number,
  pattern: number,
  icon: number,
  stamps: Array<{
    stamp: number,
    x: number,
    y: number,
    rotation: number,
    depth: number
  }>,
  recent_stamps: number[]
};

export type Mail = {
  sender: { name: string, id: number },
  postcard: {
    postcardId: number
    details: string
    timestamp: number
    uid: number
    read: boolean
  }
};

export type Igloo = {
  id: number,
  type: number,
  music: number,
  flooring: number,
  furniture: IglooFurniture,
  locked: boolean,
  location: number
};

export type RainbowPuffleStage = '0' | '1' | '2' | '3' | 'bonus';

export interface PenguinData {
  name: string
  is_member: boolean
  is_agent: boolean
  mascot: number
  color: number
  head: number
  face: number
  neck: number
  body: number
  hand: number
  feet: number
  pin: number
  background: number
  coins: number
  registration_date: number
  minutes_played: number,
  // these records act as hash sets
  inventory: number[],
  stamps: number[],
  stampbook: Stampbook,
  puffleSeq: number
  puffles: PlayerPuffle[],
  backyard: number[],
  puffleItems: Record<number, number>,
  hasDug: boolean, // if has dug with puffle
  treasureFinds: number[], // array to keep track of the times a treasure was found in the last 24hrs
  rainbow: {
    /** If can adopt rainbow puffle */
    adoptability: boolean
    /** Current rainbow puffle task */
    currentTask: number
    /** Timestamp of when last task was completed */
    latestTaskCompletionTime?: number
    /** Saves if have collected coins for each task and for the bonus */
    coinsCollected: RainbowPuffleStage[]
  },
  igloo: number,
  igloos: Igloo[],
  iglooSeq: number,
  furniture: Record<FurnitureId, FurnitureAmount>
  iglooTypes: number[],
  iglooLocations: number[],
  iglooFloorings: number[],
  mail: Array<Mail>,
  mailSeq: number,
  puffleLaunchGameData?: string // undefined: hasn't played
  careerMedals: number
  ownedMedals: number
  nuggets: number // Total number of golden nuggets in the gold puffle quest
  cards: Record<number, number>
  cardProgress: number
  isNinja: boolean;
  senseiAttempts: number;
  cardWins: number;
  /** If completed battle of doom or not */
  battleOfDoom: boolean;
}

export default db;
// TODO proper minute incrementing
