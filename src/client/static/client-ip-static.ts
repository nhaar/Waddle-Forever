const siApi = (window as any).api;

const ipInput = document.getElementById('ip-input')! as HTMLInputElement;
const portInput = document.getElementById('port-input')! as HTMLInputElement;
const resetButton = document.getElementById('reset-ip')!;
const sendIpButton = document.getElementById('send-ip')!;

window.addEventListener('get-info', (e: any) => {
  const detail = e.detail as { ip?: string; port?: string; };
  ipInput.value = detail.ip ?? '';
  portInput.value = detail.port ?? '';
});

function makeEmptyUndefined(str: string): string | undefined {
  return str === '' ? undefined : str;
}

sendIpButton.addEventListener('click', () => {
  siApi.updateTargetIP(makeEmptyUndefined(ipInput.value), makeEmptyUndefined(portInput.value));
});

resetButton.addEventListener('click', () => {
  siApi.reset();
})