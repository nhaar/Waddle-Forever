import { ipcRenderer } from 'electron';

(window as any).api = {
  updateMod: () => ipcRenderer.send('update-mod'),
  openModsFolder: () => ipcRenderer.send('open-mods-folder')
};
