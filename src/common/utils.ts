import http from 'http';
import https from 'https';
import path from 'path';
import fs from 'fs';
import { WEBSITE } from './website';
import { exec } from 'child_process';
import { IpcRenderer } from 'electron';
import { HTTP_PORT } from './constants';

export type GlobalSettings = {
  /** In order to limit the number of setting windows */
  isEditting: boolean
  /** IP the client is targetting, undefined if using the local server */
  targetIP: string | undefined;
};

export function makeURL(ip: string): string {
  return `http://${ip}:${HTTP_PORT}`;
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
  const logDir = path.join(process.cwd(), 'logs');
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

/** Gets random element from an array */
export function choose<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

export function isPositiveInteger(n: number): boolean {
  return n > 0 && !isNaN(n) && Number.isInteger(n);
}

/**
 * Find in an array that is sorted, the first index that corresponds to a value which is the last one that is "smaller"
 * than the value being compared.
 * 
 * For example, with numbers, if you had [1, 3, 5, 8], and you search for the value "4", it would return index 1 since 4 >= 3, 4 < 5.
 * @param value Value to compare
 * @param array Array that is sorted to some capacity
 * @param isGreaterOrEqual Function that evaluates if the value is greater or equal to the given index of the array
 * @returns Index found, or -1 if the value given is "smaller" than everything in the array
 */
export function findIndexLeftOf<T, K>(value: T, array: K[], isGreaterOrEqual: (value: T, array: K[], index: number) => boolean) {
  let index = -1;
  // TODO binary searching instead of this
  for (let i = 0; i < array.length; i++) {
    if (!isGreaterOrEqual(value, array, i)) {
      break;
    }
    index = i;
  } 
  return index;
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