const modsApi = (window as any).api;

window.addEventListener('receive-mods', (e: any) => {
  let html = ''
  for (const mod in e.detail) {
    html += `
    <input type="checkbox" id="${mod}" checked="${e.detail[mod]}" />
    <span>${mod}</span>
    `;
  }

  document.querySelector('.mods').innerHTML = html;

  const inputs = document.querySelectorAll('input');
  for (const input of inputs) {
    if (input instanceof HTMLInputElement) {
      input.addEventListener('change', (e) => {
        if (e.target instanceof HTMLInputElement) {
          if (e.target.checked) {
            modsApi.setActive(input.id);
          } else {
            modsApi.setInactive(input.id);
          }
        }
      })
    }
  }
})
