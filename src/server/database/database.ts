import path from "path";
import fs from 'fs';
import { readFile, writeFile } from "@common/utils";

export type StampbookCover = {
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

export interface PlayerPuffle {
  id: number
  name: string
  type: number
  clean: number
  food: number
  rest: number
}

export type RainbowPuffleStage = '0' | '1' | '2' | '3' | 'bonus';

export type IglooFurniture = Array<{
  id: number,
  x: number,
  y: number,
  rotation: number,
  frame: number
}>

export type Igloo = {
  id: number,
  type: number,
  music: number,
  flooring: number,
  furniture: IglooFurniture,
  locked: boolean,
  location: number
};

type FurnitureId = number
type FurnitureAmount = number

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

export interface PenguinJson {
// PROFILE
  name: string
  mascot: number

// MEMBERSHIP
  is_member: boolean

// PSA
  is_agent: boolean
  
// INVENTORY
  color: number
  head: number
  face: number
  neck: number
  body: number
  hand: number
  feet: number
  pin: number
  background: number
  inventory: number[],
  
// CURRENCY
  coins: number

// UNUSED - Meta information
  registration_date: number

// TIME
  minutes_played: number,
  virtualRegistrationTimestamp: number
  
// BUDDIES
  buddies?: number[],

// STAMPBOOK
  stamps: number[],
  stampbook: StampbookCover,

// PUFFLES
  puffleSeq: number
  puffles: PlayerPuffle[],
  backyard: number[],  
  puffleItems: Record<number, number>,

// PUFFLE DIGGING
  hasDug: boolean, // if has dug with puffle
  treasureFinds: number[], // array to keep track of the times a treasure was found in the last 24hrs
  
// RAINBOW QUEST
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

// IGLOO
  igloo: number,
  igloos: Igloo[],
  iglooSeq: number,
  furniture: Record<FurnitureId, FurnitureAmount>
  iglooTypes: number[],
  iglooLocations: number[],
  iglooFloorings: number[],

// MAIL
  mail: Array<Mail>,
  mailSeq: number,
  
// PUFFLE LAUNCH
  puffleLaunchGameData?: string // undefined: hasn't played
  
// EPF
  careerMedals: number
  ownedMedals: number
  
// GOLD PUFFLE
  nuggets: number // Total number of golden nuggets in the gold puffle quest
  
// CARD-JITSU
  cards: Record<number, number>
  cardProgress: number
  isNinja: boolean;
  senseiAttempts: number;
  cardWins: number;
  /** Temporary data for cheaters who want the amulet to be completed */
  fireNinja?: boolean;
  waterNinja?: boolean;
  snowNinja?: boolean;
  

// BATTLE OF DOOM
  battleOfDoom: boolean;

// MEDIEVAL PARTY 2012
  medieval2012Message?: number;

// USER PREFERENCE
  noSave?: boolean;
  safeChat?: boolean;
}

export class DataFolder {
  private _folderPath: string;

  constructor(userFolder: string) {
    this._folderPath = path.join(userFolder, 'data');
  }

  public getPath() {
    return this._folderPath;
  }

  public init(version: string) {
    let exists = true;
    if (!fs.existsSync(this._folderPath)) {
      exists = false;
      fs.mkdirSync(this._folderPath);
    }
    
    const migrator = new DatabaseMigrator(this._folderPath, version);
    if (exists) {
      migrator.migrateDatabase();
    } else {
      migrator.cache();
    }
  }
}

class DatabaseMigrator {
  private _versionPath: string

  constructor(private _folderPath: string, private _currentVersion: string) {
    this._versionPath = path.join(_folderPath, '.version');
  }

  private writeVersion() {
    fs.writeFileSync(this._versionPath, this._currentVersion);
  }

  public cache() {
    this.writeVersion();
  }

  private migrate_0_2_0(): void {
    const penguinsDir = path.join(this._folderPath, 'penguins')
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
    const penguinsDir = path.join(this._folderPath, 'penguins')
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
    const penguinsDir = path.join(this._folderPath, 'penguins')
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
    const penguinsDir = path.join(this._folderPath, 'penguins')
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

  private migrate_1_3_0() {
    const penguinsDir = path.join(this._folderPath, 'penguins')
    const penguins = fs.readdirSync(penguinsDir)
    for (const penguin of penguins) {
      if (penguin.match(/\d+\.json/) !== null) {
        const penguinDir = path.join(penguinsDir, penguin)
        const content = JSON.parse(fs.readFileSync(penguinDir, { encoding: 'utf-8' }))

        content.virtualRegistrationTimestamp = content.registration_date;

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
      case '1.3.0':
        this.migrate_1_3_0();
        return '1.3.1';
      case '1.3.1':
        return '1.3.2';
      case '1.3.2':
        return '1.3.3';
      case '1.3.3':
        return '1.4.0';
      case '1.4.0':
        return '1.4.1';
      case '1.4.1':
        return '1.4.2';
      case '1.4.2':
        return '1.4.3';
      case '1.4.3':
        return '1.4.4';
      case '1.4.4':
        return '1.4.5';
      default:
        throw new Error('Invalid database version: ' + version);
    }
  }

  migrateDatabase(): void {
    let curVersion = fs.existsSync(this._versionPath) ? fs.readFileSync(this._versionPath, 'utf-8').trim() : '0.2.0';
      // version 0.2.0 didnt have a .version file
      // any version before is not compatible with migration


    while (curVersion !== this._currentVersion) {
      curVersion = this.migrateVersion(curVersion);
    }
    this.writeVersion();
  }
}

export class PenguinRepository {
  private _path: string;
  private _seq: SeqFile;
  
  constructor(userFolder: string) {
    this._path = path.join(userFolder, 'penguins');
    
    if (!fs.existsSync(this._path)) {
      fs.mkdirSync(this._path);
    }

    this._seq = new SeqFile(this._path, 100);
  }

  private getFolderPath(id: number): string {
    return path.join(this._path, `${id}.json`);
  }

  public async get(id: number): Promise<PenguinJson | null> {
    const file = this.getFolderPath(id);
    if (fs.existsSync(file)) {
      return JSON.parse((await readFile(file)).toString('utf-8'));
    } else {
      return null;
    }
  }

  public async create(data: PenguinJson): Promise<number> {
    const id = this._seq.reserve();
    await new Promise<void>((resolve, reject) => {
      fs.writeFile(this.getFolderPath(id), JSON.stringify(data), (err) => {
        if (err) {
          reject();
        }
        resolve();
      });
    });

    return id;
  }

  public async write(id: number, data: PenguinJson): Promise<void> {
    await writeFile(this.getFolderPath(id), JSON.stringify(data));
  }

  public async fromName(name: string): Promise<[number, PenguinJson] | null> {
    const files = await new Promise<string[]>((resolve, reject) => {
      fs.readdir(this._path, (err, files) => {
        if (err) {
          reject(err);
        }
        resolve(files);
      });
    });
    for (const file of files) {
      const idMatch = file.match(/(\d+)\.json/)
      if (idMatch !== null) {
        const content = JSON.parse((await readFile(path.join(this._path, file))).toString('utf-8'));
        const n = content?.name;
        if (typeof n === 'string' && n.toLowerCase() === name.toLowerCase()) {
          return [Number(idMatch[1]), content];
        }
      }
    }
    return null;
  }

  public async exists(name: string): Promise<boolean> {
    return await this.fromName(name) !== null;
  }
}

class SeqFile {
  private _seq: number;
  private _path: string;

  constructor(databaseFolder: string, initialValue: number) {
    this._path = path.join(databaseFolder, 'seq');
    
    if (fs.existsSync(this._path)) {
      this._seq = Number(fs.readFileSync(this._path, 'utf-8'));
    } else {
      this._seq = initialValue;
      this.writeFile();
    }
  }

  private writeFile() {
    writeFile(this._path, String(this._seq)).catch(err => { throw err });
  }

  public reserve(): number {
    this._seq++;
    this.writeFile();
    return this._seq;
  }
}