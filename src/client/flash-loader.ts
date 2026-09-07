import { App } from "electron";
import path = require("path");

const loadFlashPlugin = (app: App) => {
  let pluginName: string;

  switch (process.platform) {
    case 'win32':
      switch (process.arch) {
        case 'ia32':
          pluginName = 'pepflashplayer32_32_0_0_303.dll';
          break;

        default:
        case 'x64':
          pluginName = 'pepflashplayer64_32_0_0_303.dll';
          break;
      }
      break;
    case 'darwin':
      pluginName = 'PepperFlashPlayer.plugin';
      break;
    case 'linux':
      pluginName = 'libpepflashplayer.so';
      break;
    default:
      throw new Error(`Unsupported OS for flash: ${process.platform}`);
  }

  app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, '..', 'assets', 'flash', pluginName));
};

export default loadFlashPlugin;