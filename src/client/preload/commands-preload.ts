import { addDispatchEventListeners } from '@common/utils';
import { ipcRenderer } from 'electron';

addDispatchEventListeners(['get-players'], ipcRenderer);

(window as any).api = {
  fetchPlayers: () => ipcRenderer.send('get-players'),
  runCommand: (obj: any) => ipcRenderer.send('run-command', obj)
};
