import http from 'http';
import https from 'https';
import path from 'path';
import fs from 'fs';
import { WEBSITE } from './constants';
import { exec } from 'child_process';
import { IpcRenderer } from 'electron';

/** Side-effect: Bind service to a port */
export type EffectService<T> = T;

type MultiplayerSettings = { type: 'local'; } | {
  type: 'guest';
  ip: string;
  port?: number;
} | { type: 'host' };

export type GlobalSettings = {
  multiplayer: MultiplayerSettings;
};

export function makeUrl(ip: string, port: number): string {
  return `http://${ip}:${port}`;
}

export function addDispatchEventListeners(events: string[], ipcRenderer: IpcRenderer) {
  events.forEach((eName) => {
    ipcRenderer.on(eName, (e, arg) => {
      const newEvent = new CustomEvent(eName, { detail: arg });
      window.dispatchEvent(newEvent);
    }); 
  });
}

export function parseURL(url: string): {
  protocol: 'http' | 'https',
  host: string,
  path: string,
  port: number
} {
  const [protocol, rest] = url.split('://')

  if (protocol !== 'http' && protocol !== 'https') {
    throw new Error('')
  }

  const slashSplit = rest.split('/')
  const urlBody = slashSplit.shift()

  if (urlBody === undefined) {
    throw new Error('This error should be impossible.');
  }

  const portSplit = urlBody.split(':')
  const host = portSplit[0]
  const portString = portSplit[1]

  let port: number
  if (portString === undefined) {
    port = protocol === 'http' ? 80 : 443;
  } else {
    port = Number(portString)
  }

  const path = '/' + slashSplit.join('/')

  return {
    protocol: protocol,
    host,
    path,
    port
  }
}

export const postJSON = async (path: string, body: any) => {
  const urlData = parseURL(`${WEBSITE}${path}`);

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await new Promise<any>((resolve, reject) => {
      let output = '';
  
      const requestModule = urlData.protocol === 'https' ? https : http;
  
      const req = requestModule.request({
        host: urlData.host,
        path: urlData.path,
        port: urlData.port,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Nodejs'
        }
      }, (res) => {
        res.setEncoding('utf8');
    
        res.on('data', (chunk) => {
          output += chunk;
        });
    
        res.on('end', () => {
          if (res.statusCode !== 200) {
            reject(new Error(`Request failed with status ${res.statusCode}: ${output}`));
            return;
          }
          try {
            const obj = JSON.parse(output);
            resolve(obj);
          } catch (error) {
            reject(`The endpoint was successful but returned invalid JSON data: ${output}`);
          }
        });
      });
    
      req.on('error', (err) => {
        reject(err);
      });
  
      req.write(JSON.stringify(body));
    
      req.end();
    });
  } catch (error) {
    console.log(`There was an error with the POST request to path ${path}: ${error}`);
    return undefined;
  }
};

export function getDateString(timestamp: number): string {
  const date = new Date(timestamp);

  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()

  return `${year}-${month}-${day}`
}

/** Runs a command in the current shell, asynchronously. */
export async function runCommand(command: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    exec(command, (err, stdout, stder) => {
      if (err === null) {
        resolve();
      } else {
        reject(err);
      }
    });
  });
}

/** Function for logging more silent errors in production */
export const logError = (message: string, error: any): void => {
  const logDir = process.platform == 'darwin' ? path.join(__dirname, '..', '..', 'logs') : path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  const logFile = path.join(logDir, 'logs.txt');
  fs.appendFileSync(logFile, `${message}: ${error}\n`);
}

export const MEDIA_DIRECTORY = process.platform == 'darwin' ? path.join(__dirname, '..', '..', 'media') : path.join(process.cwd(), 'media');

export const DEFAULT_DIRECTORY = path.join(MEDIA_DIRECTORY, 'default');

/** Gets a random integer between minimum and max, both included */
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(Math.min(value, max), min);
}

export function randomLogNormal(mu: number, sigma: number) {
  // this is called "Box-muller" transformation
  const u1 = Math.random();
  const u2 = Math.random();
  const standardNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

  
  const normalValue = standardNormal * sigma + mu;
  const logNormalValue = Math.exp(normalValue);

  return logNormalValue;
}

/** Gets random element from an array */
export function choose<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

export const modulo = (a: number, b: number): number => a - Math.floor(a / b) * b;

export function chooseN<T>(array: T[], n: number): T[] {
  const chosen: T[] = [];
  for (let i = 0; i < n; i++) {
    if (array.length === 0) {
      return chosen;
    }
    const randomIndex = randomInt(0, array.length - 1);
    const element = array.splice(randomIndex, 1)[0];
    chosen.push(element);
  }

  return chosen;
}

export function isPositiveInteger(n: number): boolean {
  return n > 0 && !isNaN(n) && Number.isInteger(n);
}


export function findFirstIndexEqualOrGreater<T, K>(value: T, array: K[], isGreaterOrEqual: (l: K, r: T) => boolean) {
  let left = 0;
  let right = array.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (isGreaterOrEqual(array[mid], value)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

/**
 * Given a directory, returns a list of all the files in the directory as paths relative to the given directory
 */
export function getFilesInDirectory(basePath: string, relativePath: string = ''): string[] {
  const fileNames: string[] = [];
  const absolutePath = path.join(basePath, relativePath);
  const files = fs.readdirSync(absolutePath);
  files.forEach((file) => {
    const fileAbsolutePath = path.join(absolutePath, file);
    const fileRelativePath = path.join(relativePath, file);
    if (fs.lstatSync(fileAbsolutePath).isDirectory()) {
      const childFiles = getFilesInDirectory(basePath, fileRelativePath);
      fileNames.push(...childFiles);
    } else {
      fileNames.push(fileRelativePath);
    }
  })

  return fileNames;
}

/**
 * Iterate through all entries of an object, calling a function that takes the key and value as arguments
 */
export function iterateEntries<Key extends string, Value>(obj: Partial<Record<Key, Value>> | Record<Key, Value>, callback: (key: Key, value: Value) => void) {
  Object.entries(obj).forEach((pair) => {
    const [key, value] = pair;
    callback(key as Key, value as Value);
  });
}

/** 2-Dimensional vector */
export class Vector {
  private _vector: [number, number];

  constructor(x: number, y: number) {
    this._vector = [x, y];
  }

  get vector() {
    return this._vector;
  }

  get length() {
    return this._vector.length;
  }

  copy(): Vector {
    return new Vector(...this.vector);
  }

  add(other: Vector): Vector {
    const vector = this.copy();
    for (let i = 0; i < this._vector.length; i++) {
      vector.vector[i] += other.vector[i];
    }

    return vector;
  }
}

/** Helper class for building an event with functions to fire when the event happens */
export class EventListener {
  private listeners: Array<() => void> = [];

  public addListener(callback: () => void) {
    this.listeners.push(callback);
  }

  public fire(): void {
    this.listeners.forEach(callback => callback());
  }
}

export async function readFile(filePath: string) {
  return new Promise<Buffer>((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

export async function writeFile(filePath: string, content: string | Uint8Array<ArrayBufferLike>): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

export function toForwardSlash(s: string): string {
  return s.replaceAll('\\', '/')
}

/**
 * If a string does not equate to NaN when turned into a number,
 * then it returs the number, otherwise returns the original string.
*/
export function tryToNumber(s: string) {
  const num = Number(s);
  return isNaN(num) ? s : num
}

export const doubleFilter = <T>(predicate: (e: T) => boolean, arr: T[]): [T[], T[]] => {
  const include: T[] = [];
  const exclude: T[] = [];
  arr.forEach(e => predicate(e) ? include.push(e) : exclude.push(e));
  return [include, exclude];
}

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];