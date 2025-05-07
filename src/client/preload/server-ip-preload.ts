import { ipcRenderer } from 'electron';

(window as any).api = {
  updateTargetIP: (ip: string) => ipcRenderer.send('update-ip', ip)
};