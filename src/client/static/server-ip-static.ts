const ciApi = (window as any).api;

const serverIpInput = document.getElementById('ip-input')! as HTMLInputElement;
const serverIpButton = document.getElementById('send-ip')!;

serverIpButton.addEventListener('click', () => {
  ciApi.updateTargetIP(serverIpInput.value);
});
