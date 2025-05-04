import { ipcRenderer } from 'electron';
import { HTTP_PORT } from '../../common/constants';

(window as any).api = {
  updateMod: () => ipcRenderer.send('update-mod'),
  openModsFolder: () => ipcRenderer.send('open-mods-folder')
};

(window as any).websiteUrl = `http://localhost:${HTTP_PORT}/`;