import { BrowserWindow, dialog } from "electron";

const openDevTools = async (mainWindow: BrowserWindow) => {
  const confirmationResult = await dialog.showMessageBox(mainWindow, {
    buttons: ['Sim', 'Não', 'Cancelar'],
    title: 'Você realmente deseja abrir o Dev Tools?',
    message: `O Dev Tools pode conter informações sensíveis sobre sua sessão do jogo.`,
  });

  if (confirmationResult.response !== 0) {
    return;
  }
  
  mainWindow.webContents.openDevTools();
};

export default openDevTools;