import { checkVersion } from '../common/version';
import startServer from './server';

checkVersion().then((value) => {
  if (!value[0]) {
    console.log(`A new version is available (${value[1]})`)
    console.log('\n\n\n')
  }
  startServer();
})
