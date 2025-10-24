import fs from 'fs';
import { getRoutesTimeline } from '../src/server/timelines/route';

const fileServer = getRoutesTimeline();

let output = '';

fileServer.forEach((versions, route) => {
  output += `route: ${route}\n`
  versions.forEach((update) => {
    output += `${update.date}:${update.info}\n`;
  });
  output += '\n';
});

fs.writeFileSync('versions-dump.txt', output);