import { getJson, post } from "./common-static.js";

const refreshButton = document.getElementById('refresh-button')!;
const playerSelect = document.getElementById('player-select')! as HTMLSelectElement;
const commandInput = document.getElementById('command-input')! as HTMLInputElement;
const commandButton = document.getElementById('command-button')!;

async function updatePlayerSelect() {
  const players = await getJson('players') as Array<{ name: string; id: number; }>;

  playerSelect.innerHTML = players.map(p => {
    return `<option value="${p.id}">${p.name}</option>`
  }).join('');
}

function runCommand() {
  post('command', {
    id: Number(playerSelect.value),
    command: commandInput.value
  });
}

refreshButton.addEventListener('click', updatePlayerSelect);

commandButton.addEventListener('click', runCommand);

window.addEventListener('load', () => {
  commandInput.focus();
})

commandInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    runCommand();
  }
})

updatePlayerSelect();