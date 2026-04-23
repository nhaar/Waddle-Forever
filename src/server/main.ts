import startServer from './server';
import settingsManager from './settings';

startServer(settingsManager).then(errors => {
  errors.forEach(error => {
    console.log(error.message);
  })
});
