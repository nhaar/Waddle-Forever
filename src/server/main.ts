import { startMods, startServices } from './boot';

// load user data
const failedMods = startMods();
if (failedMods.length > 0) {
  console.log('Error turning on the following mods:');
  failedMods.forEach(mod => console.log(`- ${mod}`));
}

startServices();
