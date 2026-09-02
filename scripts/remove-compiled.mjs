import { rm } from 'node:fs/promises';

await rm('./compiled', { recursive: true, force: true });
