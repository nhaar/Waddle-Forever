import { getSettings, post } from "./common-static.js";

const api = (window as any).api;

/** Update the settings object with the partial settings given */
function update(settings: any, reset?: boolean) {
  post('update', { settings, reset });
}

interface Setting {
  /** The id for the setting from the settings api */
  key: string
  /** The query selector string for the input element controlling this setting */
  elementId: string
  /** The callback for when the "change" event is tripped. */
  onChange: (target: HTMLInputElement) => void
}

/** Main array of all settings */
const allSettings: Setting[] = [
  {
    key: 'fps30',
    elementId: 'js-fps-input',
    onChange: ({ checked }) => {
      update({ fps30: checked });
      api.reloadCacheless();
    }
  },
  {
    key: 'thin_ice_igt',
    elementId: 'js-thin-ice-igt-input',
    onChange: ({ checked }) => {
      update({ thin_ice_igt: checked });
      api.clearCache();
    }
  },
  {
    key: 'clothing',
    elementId: 'js-clothing-input',
    onChange: (target) => {
      if (target.checked) {
        const download = window.confirm('Do you want to download the clothing package (around 600 MB)?');
        if (download) {
          api.download('clothing')
        }
        target.checked = false;
      } else {
        const remove = window.confirm('Do you want to remove the clothing package (you will need to download it again if you wish to use it)');
        if (remove) {
          api.delete('clothing')
        }
        target.checked = true;
      }
    }
  },
  {
    key: 'modern_my_puffle',
    elementId: 'js-my-puffle-input',
    onChange: ({ checked }) => {
      update({ modern_my_puffle: checked });
      api.clearCache();
    }
  },
  {
    key: 'jpa_level_selector',
    elementId: 'js-jpa-level-input',
    onChange: ({ checked }) => {
      update({ jpa_level_selector: checked });
      api.clearCache();
    }
  },
  {
    key: 'swap_dance_arrow',
    elementId: 'js-dance-arrow-input',
    onChange: ({ checked }) => {
      update({ swap_dance_arrow: checked });
      api.clearCache();
    }
  },
  {
    key: 'always_member',
    elementId: 'js-member-input',
    onChange: ({ checked }) => {
      update({ always_member: checked });
    }
  },
  {
    key: 'minified_website',
    elementId: 'js-website-input',
    onChange: ({ checked }) => {
      update({ minified_website: checked });
      api.reload();
    }
  },
  {
    key: 'no_rainbow_quest_wait',
    elementId: 'rainbow-input',
    onChange: ({ checked }) => {
      update({ no_rainbow_quest_wait: checked });
    }
  },
  {
    key: 'no_create_via_login',
    elementId: 'createvialogin-input',
    onChange: ({ checked }) => {
      update({ no_create_via_login: checked });
    }
  }
]

for (const setting of allSettings) {
  const inputElement = document.getElementById(setting.elementId)! as HTMLInputElement;
  inputElement.addEventListener('change', (e) => {
    if (e.target instanceof HTMLInputElement) {
      setting.onChange(e.target);
    }
  })
}

getSettings().then((settings) => {
  for (const setting of allSettings) {
    if (settings[setting.key] === undefined) {
      console.log(`settings-static: Couldn't get setting "${setting.key}"!`)
      continue;
    }
    const inputElement = document.getElementById(setting.elementId)! as HTMLInputElement;
    inputElement.checked = settings[setting.key];
  }
});

const clothingInput = document.getElementById('js-clothing-input')! as HTMLInputElement;

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