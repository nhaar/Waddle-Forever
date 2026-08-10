import { addDispatchEventListeners } from '@common/utils';
import { ipcRenderer } from 'electron';

addDispatchEventListeners(['get-players'], ipcRenderer);

(window as any).api = {
  fetchPlayers: () => ipcRenderer.send('get-players'),
  openCommandsList: () => ipcRenderer.send('open-commands-list'),
  runCommand: (obj: any) => ipcRenderer.send('run-command', obj)
};
