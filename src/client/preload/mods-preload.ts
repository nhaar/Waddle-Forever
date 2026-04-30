import { addDispatchEventListeners } from '@common/utils';
import { ipcRenderer } from 'electron';
import { HTTP_PORT } from '../../common/constants';

addDispatchEventListeners(['mod-error'], ipcRenderer);

(window as any).api = {
  updateMod: (name: string, state: boolean) => ipcRenderer.send('update-mod', { name, state }),
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