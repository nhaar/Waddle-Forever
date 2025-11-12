import { ipcRenderer } from 'electron';
import { addDispatchEventListeners } from '../../common/utils';

addDispatchEventListeners([
  'get-info'
], ipcRenderer);

(window as any).api = {
  updateTargetIP: (ip: string | undefined, port: string | undefined) => ipcRenderer.send('update-ip', { ip, port }),
  reset: () => ipcRenderer.send('reset-ip')
};