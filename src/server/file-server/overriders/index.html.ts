import { getMediaFile } from "@server/game-data/files";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";

function injectRuffleIntoHtml(html: string, ip: string, loginPort: number, worldPort: number) {
  const socketProxy = JSON.stringify([
    {
      host: ip,
      port: loginPort,
      proxyUrl: `ws://${ip}:${loginPort}`,
    },
    {
      host: ip,
      port: worldPort,
      proxyUrl: `ws://${ip}:${worldPort}`,
    },
  ]);

  const injectedScript = `
    <script>
      window.RufflePlayer = window.RufflePlayer || {};
      window.RufflePlayer.config = {
        ...window.RufflePlayer.config,
        socketProxy: ${socketProxy}
      };
    </script>
  `;

  return html.replace('</head>', `${injectedScript}</head>`);
}

export async function overrideIndexHtml(d: GameData, s: SettingsManager, b: Buffer | string): Promise<Buffer | string> {
  let newFileRef: string | null = null;

  if (s.settings.minified_website) {
    if (d.getAs3()) {
      newFileRef = 'websites:minified/minified-classic-as3.html';
    } else if (d.isPreCpip()) {
      newFileRef = 'websites:minified/minified-precpip.html';
    } else {
      newFileRef = 'websites:minified/minified-cpip.html'
    }
  }

  if (newFileRef !== null) {
    b = await getMediaFile(newFileRef);
  }

  if (typeof b !== 'string') {
    b = b.toString();
  }

  return injectRuffleIntoHtml(b, s.targetIP, s.loginPort, s.worldPort);
}