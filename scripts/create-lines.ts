import { FILES } from '../src/server/data/files';
import fs from 'fs';


let startId = FILES.rows.slice(-1)[0].id;

let string = '';

for (let i = 0; i < 100; i++) {
  string += `[${startId + i + 1}, '', 1, FileCategory.Archives, null, null],\n`
}

fs.writeFileSync('output.txt', string);