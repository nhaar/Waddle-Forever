import { addDispatchEventListeners } from '@common/utils';
import { ipcRenderer } from 'electron';

addDispatchEventListeners(['mod-error', 'get-mods'], ipcRenderer);

(window as any).api = {
  updateMod: (name: string, state: boolean) => ipcRenderer.send('update-mod', { name, state }),
  openModsFolder: () => ipcRenderer.send('open-mods-folder'),
  makeModFromPath: (modName: string, path: string) => ipcRenderer.send('mod-from-path', modName, path),
  getMods: () => ipcRenderer.send('get-mods')
};

ipcRenderer.on('mod-created', (_, error) => {
  if (error !== null) {
    return (window as any).alert(`There was an error making the mod: ${error}`)
  }
  ipcRenderer.send('get-mods');
})