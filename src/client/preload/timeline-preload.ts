import { ipcRenderer } from 'electron';

function dispatchEvent(name: string) {
  ipcRenderer.on(name, (e, arg) => {
    const newEvent = new CustomEvent(name, { detail: arg });
    window.dispatchEvent(newEvent);
  });  
}

const events: string[] = [
  'receive-version'
];

events.forEach(dispatchEvent);

(window as any).api = {
  update: (version: any) => ipcRenderer.send('update-version', version)
};
