const siApi = (window as any).api;

const ipInput = document.getElementById('ip-input')! as HTMLInputElement;
const resetButton = document.getElementById('reset-ip')!;
const sendIpButton = document.getElementById('send-ip')!;

sendIpButton.addEventListener('click', () => {
  siApi.updateTargetIP(ipInput.value);
});

resetButton.addEventListener('click', () => {
  siApi.reset();
})