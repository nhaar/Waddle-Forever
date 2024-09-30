import { App } from "electron";
import path = require("path");

const getPluginName = () => {
  let pluginName: string;

  switch (process.platform) {
    case 'win32':
      switch (process.arch) {
        case 'ia32':
          pluginName = 'assets/flash/pepflashplayer32_32_0_0_303.dll';
          break;

        default:
        case 'x64':
          pluginName = 'assets/flash/pepflashplayer64_32_0_0_303.dll';
          break;
      }
      break;
    case 'darwin':
      pluginName = 'assets/flash/PepperFlashPlayer.plugin';
      break;
    case 'linux':
      pluginName = 'assets/flash/libpepflashplayer.so';
      break;
  }

  return pluginName;
};

const loadFlashPlugin = (app: App) => {
  const pluginName = getPluginName();

  app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, '..', pluginName));
};

export default loadFlashPlugin;