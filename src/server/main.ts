import { checkVersion } from '../common/version';
import startServer from './server';

checkVersion().then((value) => {
  if (value[0] === undefined) {
    console.log('No internet connection, could not check version')
  } else if (!value[0]) {
    console.log(`A new version is available (${value[1]})`)
  }
  startServer();
})
