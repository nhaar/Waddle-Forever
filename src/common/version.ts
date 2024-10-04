import https from 'https';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pjson = require('../../package.json');

const version = pjson.version;

export const checkVersion = async (): Promise<[boolean | undefined, string]> => {
  const latestRelease = await getJSON('api.github.com', '/repos/nhaar/Waddle-Forever/releases');

  try {
    // no internet connection
    if (latestRelease === undefined) {
      return [undefined, ''];
    }
    const latestVersion = latestRelease[0]['tag_name'];
    const isUpToDate = latestVersion === `v${version}`;
  
    return [isUpToDate, latestVersion];
  } catch (error) {
    console.log(error);
    return [false, '?'];
  }
};

/**
 * Fetch a JSON using a HTTPS GET request
 * @returns Fetched JSON parsed as object or undefined if no internet connection
 */
const getJSON = async (host: string, path: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await new Promise<any>((resolve, reject) => {
    let output = '';

    const req = https.request({
      host,
      path,
      method: 'GET',
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
        const code = (err as any).code;
        if (code === 'ENOTFOUND') {
          resolve(undefined);
        } else {
          throw new Error('Error not expected');
        }
      } catch {
        reject(err);
      }
    });
  
    req.end();
  });
};
