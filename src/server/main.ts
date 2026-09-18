import { startServices } from './boot';


startServices().then(({ failedMods }) => {
  // load user data
  if (failedMods.length > 0) {
    console.log('Error turning on the following mods:');
    failedMods.forEach(mod => console.log(`- ${mod}`));
  }
})
