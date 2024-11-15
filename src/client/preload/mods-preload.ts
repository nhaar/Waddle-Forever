import { ipcRenderer } from 'electron';

function dispatchEvent(name: string) {
  ipcRenderer.on(name, (e, arg) => {
    const newEvent = new CustomEvent(name, { detail: arg });
    window.dispatchEvent(newEvent);
  });  
}

const events: string[] = [
  'receive-mods'
];

events.forEach(dispatchEvent);

(window as any).api = {
  setActive: (mod: string) => ipcRenderer.send('set-mod-active', mod),
  setInactive: (mod: string) => ipcRenderer.send('set-mod-inactive', mod),
  openModsFolder: () => ipcRenderer.send('open-mods-folder')
};
