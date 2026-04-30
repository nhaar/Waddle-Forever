import { addDispatchEventListeners } from '@common/utils';
import { ipcRenderer } from 'electron';
import { HTTP_PORT } from '../../common/constants';

addDispatchEventListeners(['get-players'], ipcRenderer);

(window as any).api = {
  fetchPlayers: () => ipcRenderer.send('get-players'),
  runCommand: (obj: any) => ipcRenderer.send('run-command', obj)
};

(window as any).websiteUrl = `http://localhost:${HTTP_PORT}/`;