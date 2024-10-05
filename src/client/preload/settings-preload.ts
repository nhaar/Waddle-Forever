import { ipcRenderer } from 'electron'

(window as any).api = {
  update: (updateSettings: any) => ipcRenderer.send('update-settings', updateSettings)
}
