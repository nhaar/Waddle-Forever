import { ipcRenderer } from 'electron';

function dispatchEvent(name: string) {
  ipcRenderer.on(name, (e, arg) => {
    const newEvent = new CustomEvent(name, { detail: arg });
    window.dispatchEvent(newEvent);
  });  
}

const events = [
  'get-timeline'
];

events.forEach(dispatchEvent);

(window as any).api = {
  update: () => ipcRenderer.send('update-version')
};
