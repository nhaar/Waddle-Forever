import { ipcRenderer } from 'electron';
import { HTTP_PORT } from '../../common/constants';

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

(window as any).websiteUrl = `http://localhost:${HTTP_PORT}/`;