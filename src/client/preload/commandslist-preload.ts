import { addDispatchEventListeners } from '@common/utils';
import { ipcRenderer } from 'electron';

addDispatchEventListeners(['get-commands'], ipcRenderer);