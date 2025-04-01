import http from 'http';
import https from 'https';
import path from 'path';
import { WEBSITE } from './website';

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

export const postJSON = async (path: string, body: any, errorCallback?: (data: any) => any) => {
  const urlData = parseURL(`${WEBSITE}${path}`);

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
        const obj = JSON.parse(output);
  
        resolve(obj);
      });
    });
  
    req.on('error', (err) => {
      try {
        resolve(errorCallback(err));
      } catch {
        reject(err);
      }
    });

    req.write(JSON.stringify(body));
  
    req.end();
  });
};

export function getDateString(timestamp: number): string {
  const date = new Date(timestamp);

  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()

  return `${year}-${month}-${day}`
}

export const MEDIA_DIRECTORY = path.join(process.cwd(), 'media');

export const DEFAULT_DIRECTORY = path.join(MEDIA_DIRECTORY, 'default');