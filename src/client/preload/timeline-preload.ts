import { ipcRenderer } from 'electron';
import { addDispatchEventListeners } from '../../common/utils';

addDispatchEventListeners([
  'get-timeline'
], ipcRenderer);

(window as any).api = {
  update: (obj: any) => ipcRenderer.send('update-version', obj)
};
