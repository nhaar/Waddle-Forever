const api = (window as any).api;

// TODO better system, less anys?

const fpsInput = document.querySelector<HTMLInputElement>('.js-fps-input');
const thinIceIgtInput = document.querySelector<HTMLInputElement>('.js-thin-ice-igt-input');
const clothingInput = document.querySelector<HTMLInputElement>('.js-clothing-input');
const myPuffleInput = document.querySelector<HTMLInputElement>('.js-my-puffle-input');
const idleInput = document.querySelector<HTMLInputElement>('.js-idle-input');
const jpaInput = document.querySelector<HTMLInputElement>('.js-jpa-level-input');

fpsInput.addEventListener('change', (e) => {
  if (e.target instanceof HTMLInputElement) {
    api.update({ fps30: e.target.checked });
    api.reloadCacheless();
  }
});

thinIceIgtInput.addEventListener('change', (e) => {
  if (e.target instanceof HTMLInputElement) {
    api.update({ thin_ice_igt: e.target.checked });
    api.clearCache();
  }
});

clothingInput.addEventListener('change', (e) => {
  if (e.target instanceof HTMLInputElement) {
    if (e.target.checked) {
      const download = window.confirm('Do you want to download the clothing package (around 600 MB)?');
      if (download) {
        api.download('clothing')
      }
      e.target.checked = false;
    } else {
      const remove = window.confirm('Do you want to remove the clothing package (you will need to download it again if you wish to use it)');
      if (remove) {
        api.delete('clothing')
      }
      e.target.checked = true;
    }
  }
})

myPuffleInput.addEventListener('change', (e) => {
  if (e.target instanceof HTMLInputElement) {
    api.update({ modern_my_puffle: e.target.checked });
    api.clearCache();
  }
})

idleInput.addEventListener('change', (e) => {
  if (e.target instanceof HTMLInputElement) {
    api.update({ remove_idle: e.target.checked });
    api.reloadCacheless();
  }
})

jpaInput.addEventListener('change', (e) => {
  if (e.target instanceof HTMLInputElement) {
    api.update({ jpa_level_selector: e.target.checked })
    api.clearCache();
  }
})

window.addEventListener('receive-settings', (e: any) => {
  const settings = e.detail;
  fpsInput.checked = settings['fps30'];
  thinIceIgtInput.checked = settings['thin_ice_igt'];
  clothingInput.checked = settings['clothing'];
  myPuffleInput.checked = settings['modern_my_puffle'];
  idleInput.checked = settings['remove_idle'];
  jpaInput.checked = settings['jpa_level_selector']
});

window.addEventListener('finish-download', (e: any) => {
  const pack = e.detail;

  if (pack === 'clothing') {
    window.alert('Clothing downloaded successfully');
    clothingInput.checked = true;
  }
})

window.addEventListener('finish-deleting', (e: any) => {
  const pack = e.detail;

  if (pack === 'clothing') {
    window.alert('Clothing removed succesfully');
    clothingInput.checked = false;
  }
})

window.addEventListener('download-fail', () => {
  window.alert('Can\'t download the package. Please check your internet connection or if the Waddle Forever webservices are functioning.')
})