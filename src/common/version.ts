import https from 'https';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pjson = require('../../package.json');

const version = pjson.version;

export const checkVersion = async (): Promise<[boolean, string]> => {
  const latestRelease = await getJSON('api.github.com', '/repos/nhaar/CPSC-2/releases');
  const latestVersion = latestRelease[0]['tag_name'];
  const isUpToDate = latestVersion === `v${version}`;

  return [isUpToDate, latestVersion];
};

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
      reject(err);
    });
  
    req.end();
  });
};
