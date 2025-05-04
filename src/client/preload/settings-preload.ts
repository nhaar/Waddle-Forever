import { ipcRenderer } from 'electron';
import { HTTP_PORT } from '../../common/constants';

function dispatchEvent(name: string) {
  ipcRenderer.on(name, (e, arg) => {
    const newEvent = new CustomEvent(name, { detail: arg });
    window.dispatchEvent(newEvent);
  });  
}

const events = [
  'finish-download',
  'finish-deleting',
  'download-fail'
];

events.forEach(dispatchEvent);

(window as any).api = {
  download: (pack: string) => ipcRenderer.send('download-package', pack),
  delete: (pack: string) => ipcRenderer.send('delete-package', pack),
  reload: () => ipcRenderer.send('reload-window'),
  clearCache: () => ipcRenderer.send('clear-cache'),
  reloadCacheless: () => ipcRenderer.send('reload-cache')
};

(window as any).websiteUrl = `http://localhost:${HTTP_PORT}/`;