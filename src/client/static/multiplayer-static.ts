const mApi = (window as any).api;

const localButton = document.getElementById('local')! as HTMLInputElement;
const guestButton = document.getElementById('guest')! as HTMLInputElement;
const hostButton = document.getElementById('host')! as HTMLInputElement;
const ipInput = document.getElementById('ip-input')! as HTMLInputElement;
const portInput = document.getElementById('port-input')! as HTMLInputElement;
const info = document.getElementById('info-input')! as HTMLDivElement;
const sendButton = document.getElementById('send')! as HTMLButtonElement;

function getPort(port: string): number | undefined {
  return port === '' ? undefined : Number(port);
}

window.addEventListener('get-info', (e: any) => {
  const detail = e.detail;
  switch (detail.type) {
    case 'local':
      localButton.checked = true;
      break;
    case 'host':
      hostButton.checked = true;
      info.style.display = 'block';
      ipInput.value = detail.ip;
      portInput.value = detail.port;
      break;
    case 'guest':
      guestButton.checked = true;
      info.style.display = 'block';
      ipInput.value = detail.ip;
      portInput.value = detail.port;
      break;
  }
});

localButton.addEventListener('change', () => {
  if (localButton.checked) {
    info.style.display = 'none';
    mApi.update('local');
  }
});

guestButton.addEventListener('change', () => {
  if (guestButton.checked) {
    info.style.display = 'block';
  }
});

hostButton.addEventListener('change', () => {
  if (hostButton.checked) {
    info.style.display = 'block';
  }
});

sendButton.addEventListener('click', () => {
  if (ipInput.value === '') {
    window.alert('Please provide an IP!');
  } else {
    if (guestButton.checked) {
      mApi.update('guest', ipInput.value, getPort(portInput.value));
    } else {
      mApi.update('host', ipInput.value, getPort(portInput.value));
    }
  }
});