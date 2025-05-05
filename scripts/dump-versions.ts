import fs from 'fs';
import { getFileServer } from '../src/server/routes/client-files';

const fileServer = getFileServer();

let output = '';

fileServer.forEach((versions, route) => {
  output += `route: ${route}\n`
  versions.forEach((update) => {
    output += `${update.date}:${update.info}\n`;
  });
  output += '\n';
});

fs.writeFileSync('versions-dump.txt', output);