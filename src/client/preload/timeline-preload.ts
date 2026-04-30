import { ipcRenderer } from 'electron';
import { HTTP_PORT } from '../../common/constants';
import { addDispatchEventListeners } from '../../common/utils';

addDispatchEventListeners([
  'get-timeline'
], ipcRenderer);

(window as any).api = {
  update: (obj: any) => ipcRenderer.send('update-version', obj)
};

(window as any).websiteUrl = `http://localhost:${HTTP_PORT}/`;