const commandsListElement = document.getElementById('commands-list')!;

interface CommandDisplayInfo {
  name: string
  description: string
  argNames: Array<string>
  examples: Array<string>
}

window.addEventListener('get-commands', (e: any) => {
  const commands = (e.detail as Array<CommandDisplayInfo>)
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const command of commands) {
    const name = [command.name, ...command.argNames.map(a => `[${a}]`)].join(' ');

    const examples = command.examples.length > 0
      ? `
        <p>
          <b>Examples:</b>
          <ul>
            ${command.examples.map(e => `<li>${e}</li>`).join('')}
          </ul>
        </p>
      `
      : '';

    commandsListElement.innerHTML += `
      <div class="command-box">
        <h2>${name}</h2>
        <p>
          <b>Description:</b> ${command.description}
        </p>
        ${examples}
      </div>
    `;
  }
});