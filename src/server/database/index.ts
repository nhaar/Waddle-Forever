import path from 'path';
import fs, { writeFileSync } from 'fs';

export enum Databases {
  Penguins = 'penguins'
}

type JsonProperty = string | number | boolean

const databaseFolder = path.join(process.cwd(), 'data');
if (!fs.existsSync(databaseFolder)) {
  fs.mkdirSync(databaseFolder, {});
}

/**
 * A replacement to sqlite since it was not working with the electron dependencies
 * 
 * This also allows to edit the database easily and the performance is not an issue
 */
class JsonDatabase {
  /** Absolute path to the database folder */
  root: string;

  constructor (rootDir: string) {
    if (!fs.existsSync(rootDir)) {
      fs.mkdirSync(rootDir);
    }
    this.root = rootDir;
  }

  private getSubDatabaseDir (name: string): string {
    return path.join(this.root, name);
  }

  private getSeqDir (name: string): string {
    return path.join(this.root, name, 'seq');
  }

  createDatabase(database: Databases) {
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

db.createDatabase(Databases.Penguins);

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
  mailSeq: number
}

export default db;
// TODO proper minute incrementing
