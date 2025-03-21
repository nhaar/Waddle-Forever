import { ipcRenderer } from 'electron';

(window as any).api = {
  update: () => ipcRenderer.send('update-version')
};
