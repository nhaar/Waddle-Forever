import { ipcRenderer } from 'electron'

ipcRenderer.on('receive-settings', (e, arg) => {
  const newEvent = new CustomEvent('receive-settings', { detail: arg })
  window.dispatchEvent(newEvent)
});

(window as any).api = {
  update: (updateSettings: any) => ipcRenderer.send('update-settings', updateSettings)
}
