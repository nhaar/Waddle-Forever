import http from 'http';
import https from 'https';
import path from 'path';
import fs from 'fs';
import { WEBSITE } from './website';
import { exec } from 'child_process';

export type GlobalSettings = {
  isEditting: boolean
};

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

export const MEDIA_DIRECTORY = path.join(process.cwd(), 'media');

export const DEFAULT_DIRECTORY = path.join(MEDIA_DIRECTORY, 'default');

/** Gets a random integer between minimum and max, both included */
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/** Gets random element from an array */
export function choose<T>(array: T[]): T {
  return array[randomInt(0, array.length)];
}