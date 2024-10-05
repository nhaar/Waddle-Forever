const api = (window as any).api

const fpsInput = document.querySelector<HTMLInputElement>('.js-fps-input')
const thinIceIgtInput = document.querySelector<HTMLInputElement>('.js-thin-ice-igt-input')

fpsInput.addEventListener('change', (e) => {
  if (e.target instanceof HTMLInputElement) {
    api.update({ fps30: e.target.checked })
  }
})

thinIceIgtInput.addEventListener('change', (e) => {
  if (e.target instanceof HTMLInputElement) {
    api.update({ thin_ice_igt: e.target.checked })
  }
})

window.addEventListener('receive-settings', (e: any) => {
  const settings = e.detail
  fpsInput.checked = settings['fps30']
  thinIceIgtInput.checked = settings['thin_ice_igt']
})