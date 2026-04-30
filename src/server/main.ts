import startServer from './server';
import settingsManager from './settings';

startServer(settingsManager).then(r => {
  r.errors.forEach(error => {
    console.log(error.message);
  })
});
