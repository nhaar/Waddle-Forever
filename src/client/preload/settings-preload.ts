import { ipcRenderer } from 'electron';
import { addDispatchEventListeners } from '../../common/utils';

addDispatchEventListeners([
  'finish-download',
  'finish-deleting',
  'download-fail',
  'get-settings'
], ipcRenderer);

(window as any).api = {
  download: (pack: string) => ipcRenderer.send('download-package', pack),
  delete: (pack: string) => ipcRenderer.send('delete-package', pack),
  reload: () => ipcRenderer.send('reload-window'),
  clearCache: () => ipcRenderer.send('clear-cache'),
  reloadCacheless: () => ipcRenderer.send('reload-cache'),
  update: (obj: any) => ipcRenderer.send('update-settings', obj)
};
