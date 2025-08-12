import { getSettings, post } from "./common-static.js";

const api = (window as any).api;

// TODO better system, less anys?

const fpsInput = document.querySelector<HTMLInputElement>('.js-fps-input')!;
const thinIceIgtInput = document.querySelector<HTMLInputElement>('.js-thin-ice-igt-input')!;
const clothingInput = document.querySelector<HTMLInputElement>('.js-clothing-input')!;
const myPuffleInput = document.querySelector<HTMLInputElement>('.js-my-puffle-input')!;
const jpaInput = document.querySelector<HTMLInputElement>('.js-jpa-level-input')!;
const danceInput = document.querySelector<HTMLInputElement>('.js-dance-arrow-input')!;
const memberInput = document.querySelector<HTMLInputElement>('.js-member-input')!;
const websiteInput = document.querySelector<HTMLInputElement>('.js-website-input')!;
const rainbowInput = document.querySelector<HTMLInputElement>('.rainbow-input')!;

/** Update the settings object with the partial settings given */
function update(settings: any) {
  post('update', settings);
}

getSettings().then((settings) => {
  fpsInput.checked = settings['fps30'];
  thinIceIgtInput.checked = settings['thin_ice_igt'];
  clothingInput.checked = settings['clothing'];
  myPuffleInput.checked = settings['modern_my_puffle'];
  jpaInput.checked = settings['jpa_level_selector'];
  danceInput.checked = settings['swap_dance_arrow'];
  memberInput.checked = settings['always_member'];
  websiteInput.checked = settings['minified_website'];
  rainbowInput.checked = settings['no_rainbow_quest_wait'];
});

fpsInput.addEventListener('change', (e) => {
  if (e.target instanceof HTMLInputElement) {
    update({ fps30: e.target.checked });
    api.reloadCacheless();
  }
});

thinIceIgtInput.addEventListener('change', (e) => {
  if (e.target instanceof HTMLInputElement) {
    update({ thin_ice_igt: e.target.checked });
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
    update({ modern_my_puffle: e.target.checked });
    api.clearCache();
  }
})

jpaInput.addEventListener('change', (e) => {
  if (e.target instanceof HTMLInputElement) {
    update({ jpa_level_selector: e.target.checked });
    api.clearCache();
  }
})

danceInput.addEventListener('change', (e) => {
  if (e.target instanceof HTMLInputElement) {
    update({ swap_dance_arrow: e.target.checked });
    api.clearCache();
  }
})

memberInput.addEventListener('change', (e) => {
  if (e.target instanceof HTMLInputElement) {
    update({ always_member: e.target.checked });
  }
})

websiteInput.addEventListener('change', (e) => {
  if (e.target instanceof HTMLInputElement) {
    update({ minified_website: e.target.checked });
    api.reload();
  }
})

rainbowInput.addEventListener('change', (e) => {
  if (e.target instanceof HTMLInputElement) {
    update({ no_rainbow_quest_wait: e.target.checked });
  }
});

window.addEventListener('finish-download', (e: any) => {
  const pack = e.detail;

  if (pack === 'clothing') {
    window.alert('Clothing downloaded successfully');
    clothingInput.checked = true;
    update({ clothing: true });
  }
})

window.addEventListener('finish-deleting', (e: any) => {
  const pack = e.detail;

  if (pack === 'clothing') {
    window.alert('Clothing removed succesfully');
    clothingInput.checked = false;
    update({ clothing: false });
  }
})

window.addEventListener('download-fail', () => {
  window.alert('Can\'t download the package. Please check your internet connection or if the Waddle Forever webservices are functioning.')
})