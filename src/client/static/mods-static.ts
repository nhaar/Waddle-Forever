import { getJson, post } from "./common-static.js";

const modsApi = (window as any).api;

async function getMods() {
  return await getJson('mod/get');
}

// attempt to update a mod, returns server response
async function updateMod(name: string, active: boolean) {
  return await post('mod/update', { name, active })
}

// return whether or not the mod was succesfully set to active
async function setModActive(mod: string): Promise<boolean> {
  const response = await updateMod(mod, true);
  if (response.status === 400) {
    window.alert(`Error with your mod: ${await response.text()}

Please fix the error and then attempt to turn the mod on again.`);
    return false;
  } else {
    return true;
  }
}

async function setModInactive(mod: string) {
  await updateMod(mod, false);
}

function setupPage() {
  getMods().then((mods) => {
    let html = ''
    for (const mod in mods) {
      html += `
      <div>
        <input type="checkbox" id="${mod}" ${mods[mod] ? 'checked="true"' : ''} />
        <label for="${mod}">${mod}</span>
      </div>
      `;
    }
  
    document.querySelector('.mods')!.innerHTML = html;

    const inputs = document.querySelectorAll('input[type="checkbox"]');
    for (const input of inputs) {
      if (input instanceof HTMLInputElement) {
        input.addEventListener('change', (e) => {
          if (e.target instanceof HTMLInputElement) {
            // will attempt to see if the mod has problems, if it has it will uncheck and won't update
            if (e.target.checked) {
              setModActive(input.id).then(activate => {
                if (activate) {
                  modsApi.updateMod();
                } else {
                  if (e.target instanceof HTMLInputElement) {
                    e.target.checked = false;
                  }
                }
              });
            } else {
              setModInactive(input.id);
              modsApi.updateMod();
            }
          }
        })
      }
    }
  })
}

// so that it can be called from the preload
(window as any).setupPage = setupPage;

document.getElementById('open-mods-folder')?.addEventListener('click', () => {
  modsApi.openModsFolder();
});

document.getElementById('update-mods')?.addEventListener('click', () => {
  setupPage();
});

const createModPrompt = document.getElementById('mods-clipboard-prompt')!;

document.getElementById('mod-from-clipboard')?.addEventListener('click', () => {
  createModPrompt.style.visibility = 'visible';
});

const createModNameInput = document.getElementById('create-mod-name-input')! as HTMLInputElement;
const createModPathInput = document.getElementById('create-mod-path-input')! as HTMLInputElement;

const createModButton = document.getElementById('create-mod-btn')!;

function sendMakeMod() {
  if (createModNameInput.value.length > 0) {
    modsApi.makeModFromPath(createModNameInput.value, createModPathInput.value);
    createModPrompt.style.visibility = 'hidden';
    createModNameInput.value = '';
    createModPathInput.value = '';
  } else {
    alert('Please enter a name for the mod.')
  }
}

createModButton.addEventListener('click', () => sendMakeMod());

createModNameInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') createModPathInput.focus();
})

createModPathInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') sendMakeMod();
})

createModPathInput.addEventListener('input', () => {
  let text = createModPathInput.value;

  if (text.startsWith("http://") || text.startsWith("https://")) {
    try {
      text = new URL(text).pathname;
    } catch {
      return;
    }
  }

  const parts = text.split('/').filter(Boolean);

  // don't include any file names
  if (parts.length > 0 && /\.[^\/]+$/.test(parts[parts.length - 1])) {
    parts.pop();
  }

  let normalized = parts.join('/');

  // let slashes be typed normally
  if (text.endsWith('/') && text.length > 1) {
    normalized += '/';
  }
  if (normalized !== createModPathInput.value) {
    const pos = createModPathInput.selectionStart;
    createModPathInput.value = normalized;
    createModPathInput.selectionStart = createModPathInput.selectionEnd = pos;
  }

  if (normalized !== createModPathInput.value) {
    createModPathInput.value = normalized;
  }
});

setupPage();