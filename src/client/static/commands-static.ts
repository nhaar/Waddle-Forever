const refreshButton = document.getElementById('refresh-button')!;
const playerSelect = document.getElementById('player-select')! as HTMLSelectElement;
const commandInput = document.getElementById('command-input')! as HTMLInputElement;
const commandButton = document.getElementById('command-button')!;

const commandsApi = (window as any).api;

window.addEventListener('get-players', (e: any) => {
  const players = e.detail as Array<{ name: string; id: number; }>;

  playerSelect.innerHTML = players.map(p => {
    return `<option value="${p.id}">${p.name}</option>`
  }).join('');
});

function updatePlayerSelect() {
  commandsApi.fetchPlayers();
}

function runCommand() {
  commandsApi.runCommand({
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