import { getJson, post } from "./common-static.js";

const modsApi = (window as any).api;

async function getMods() {
  return await getJson('mod/get');
}

async function updateMod(name: string, active: boolean) {
  await post('mod/update', { name, active })
}

async function setModActive(mod: string) {
  await updateMod(mod, true);
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
  
    const inputs = document.querySelectorAll('input');
    for (const input of inputs) {
      if (input instanceof HTMLInputElement) {
        input.addEventListener('change', (e) => {
          if (e.target instanceof HTMLInputElement) {
            if (e.target.checked) {
              setModActive(input.id);
            } else {
              setModInactive(input.id);
            }
            modsApi.updateMod();
          }
        })
      }
    }
  
    document.getElementById('open-mods-folder')?.addEventListener('click', () => {
      modsApi.openModsFolder();
    });
  
    document.getElementById('update-mods')?.addEventListener('click', () => {
      setupPage();
    });
  })
}

setupPage();