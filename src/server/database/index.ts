import path from 'path';
import fs, { writeFileSync } from 'fs';
import { VERSION } from '../../common/version';

export enum Databases {
  Penguins = 'penguins'
}

type JsonProperty = string | number | boolean

const databaseFolder = path.join(process.cwd(), 'data');

const versionFile = path.join(databaseFolder, '.version');

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
    if (fs.existsSync(databaseFolder)) { // migrate or leave it
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
    const penguinsDir = path.join(databaseFolder, 'penguins')
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

  private migrateVersion(version: string): string | undefined {
    switch (version) {
      case '0.2.0':
        this.migrate_0_2_0()
        return '0.2.1';
      case '0.2.1':
        return '0.2.2';
      case '0.2.2':
        return '0.2.3';
      default:
        throw new Error('Invalid database version: ' + version);
    }
  }

  migrateDatabase(version: string): void {
    let curVersion = version
    while (curVersion !== VERSION) {
      curVersion = this.migrateVersion(version);
    }
    fs.writeFileSync(versionFile, VERSION);
  }

  createDatabase(): void {
    if (!fs.existsSync(databaseFolder)) {
      fs.mkdirSync(databaseFolder)
    }
    db.createSubDatabase(Databases.Penguins);
    fs.writeFileSync(versionFile, VERSION);
  }

  createSubDatabase(database: Databases) {
    const subDir = this.getSubDatabaseDir(database);
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir);
    }
    const seqDir = this.getSeqDir(database);
    if (!fs.existsSync(seqDir)) {
      fs.writeFileSync(seqDir, '0');
    }
  }

  update<T>(database: Databases, id: number, data: T): void {
    const subDir = this.getSubDatabaseDir(database);
    fs.writeFileSync(path.join(subDir, `${id}.json`), JSON.stringify(data));
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
      const id = Number(file.match(/\d+/)[0]);
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
    this.update(database, id, { id, ...value });
    writeFileSync(seqDir, String(id));
    return [value, id];
  }
}

const db = new JsonDatabase(databaseFolder);

export interface Puffle {
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
type ItemId = number

export interface Penguin {
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
  inventory: Record<ItemId, 1>,
  stamps: number[],
  pins: number[],
  stampbook: {
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
  },
  puffleSeq: number
  puffles: Puffle[],
  igloo: {
    type: number,
    music: number,
    flooring: number,
    furniture: IglooFurniture
  },
  furniture: Record<FurnitureId, FurnitureAmount>
  iglooTypes: Record<string, 1>
  mail: Array<{
    sender: { name: string, id: number },
    postcard: {
      postcardId: number
      details: string
      timestamp: number
      uid: number
      read: boolean
    }
  }>,
  mailSeq: number,
  puffleLaunchGameData: string
}

export default db;
// TODO proper minute incrementing
