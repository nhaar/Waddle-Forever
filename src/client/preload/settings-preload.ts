import { ipcRenderer } from 'electron';

function dispatchEvent(name: string) {
  ipcRenderer.on(name, (e, arg) => {
    const newEvent = new CustomEvent(name, { detail: arg });
    window.dispatchEvent(newEvent);
  });  
}

const events = [
  'receive-settings',
  'finish-download',
  'finish-deleting'
];

events.forEach(dispatchEvent);

(window as any).api = {
  update: (updateSettings: any) => ipcRenderer.send('update-settings', updateSettings),
  download: (pack: string) => ipcRenderer.send('download-package', pack),
  delete: (pack: string) => ipcRenderer.send('delete-package', pack)
};
