import { app, dialog, BrowserWindow } from "electron";
import path = require("path");
import { Store } from "./store";
import { IS_DEV } from "@common/constants";
import { getYellowString } from "@server/logger";
import fs from 'fs'

const loadFlashPlugin = (store: Store) => {
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

  if (store.public.get('flashTracing')) {
    app.commandLine.appendSwitch('ppapi-flash-args', 'enable_trace_to_console=1');
  }
};

export const toggleFlashTracing = async (store: Store, window: BrowserWindow) => {
  const tracingCurrentlyOn = store.public.get('flashTracing');

  const confirmationEnableResult = await dialog.showMessageBox(window, {
    buttons: ['Yes', 'No', 'Cancel'],
    title: 'Toggle Flash Player Tracing',
    message: `SWF tracing is currently ${tracingCurrentlyOn ? 'ON' : 'OFF'}. Would you like to turn it ${tracingCurrentlyOn ? 'OFF' : 'ON'}?

When enabled, trace() statements from SWFs will appear in the browser console. This is only recommended for debugging.

Waddle Forever will be restarted after clicking 'Yes'.`,
  });

  if (confirmationEnableResult.response !== 0) {
    return;
  }

  const mmCfgPath = path.join(app.getPath('userData'), 'Pepper Data', 'Shockwave Flash', 'System', 'mm.cfg');
  const newValue = Number(!store.public.get('flashTracing'));

  if (fs.existsSync(mmCfgPath)) {
    const config = fs.readFileSync(mmCfgPath, 'utf8');
    const newline = config.includes('\r\n') ? '\r\n' : '\n';
    const hasTrailingNewline = /(?:\r\n|\n|\r)$/.test(config);
    const lines = config.split(/\r\n|\n|\r/);

    if (hasTrailingNewline) lines.pop();
    if (lines.length === 1 && lines[0] === '') lines.pop();

    // get the lines that have the TraceOutputFileEnable setting
    const settingLines = lines
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => /^\s*TraceOutputFileEnable\s*=/.test(line));

    if (settingLines.length > 0) {
      // if the line was in there already, change its value
      settingLines.forEach(l => lines[l.index] = `TraceOutputFileEnable=${newValue}`);
    } else {
      // otherwise, add it in
      lines.push(`TraceOutputFileEnable=${newValue}`);
    }

    fs.writeFileSync(mmCfgPath, lines.join(newline) + (hasTrailingNewline ? newline : ''));
  } else {
    // file doesnt exist, so make it with the TraceOutputFileEnable setting
    fs.mkdirSync(path.dirname(mmCfgPath), { recursive: true });
    fs.writeFileSync(mmCfgPath, `TraceOutputFileEnable=${newValue}`);
  }

  store.public.set('flashTracing', !store.public.get('flashTracing'));

  if (!IS_DEV) {
    app.relaunch({ args: process.argv.slice(1).concat(['--reloaded']) });
  } else {
    console.log(getYellowString(`The app will not relaunch, because it's being run in development. Run "yarn start" again.`))
  }
  app.quit();
};

export default loadFlashPlugin;