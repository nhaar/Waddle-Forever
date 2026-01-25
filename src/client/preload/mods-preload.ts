import { ipcRenderer } from 'electron';
import { HTTP_PORT } from '../../common/constants';

(window as any).api = {
  updateMod: () => ipcRenderer.send('update-mod'),
  openModsFolder: () => ipcRenderer.send('open-mods-folder'),
  makeModFromPath: (modName: string, path: string) => ipcRenderer.send('mod-from-path', modName, path)
};

(window as any).websiteUrl = `http://localhost:${HTTP_PORT}/`;

ipcRenderer.on('mod-created', (_, error) => {
  if (error !== null) {
    return (window as any).alert(`There was an error making the mod: ${error}`)
  }
  (window as any).setupPage();
})