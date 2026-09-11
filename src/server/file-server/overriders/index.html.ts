import { getMediaFile } from "@server/game-data/files";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";

function socketInfo(host: string, port: number) {
  return { host, port, proxyUrl: `ws://${host}:${port}` }
}

export async function overrideIndexHtml(d: GameData, s: SettingsManager, b: Buffer | string): Promise<Buffer | string> {
  let newFileRef: string | null = null;

  if (s.settings.minified_website && !d.isVanillaEngine()) {
    if (d.getAs3()) {
      newFileRef = 'websites:minified/minified-classic-as3.html';
    } else if (d.isPreCpip()) {
      newFileRef = 'websites:minified/minified-precpip.html';
    } else if (d.useCompositePaths()) {
      newFileRef = 'websites:minified/minified-early-cpip.html'
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

  // For modern-as3.html, inject the correct url for media
  b = b.replaceAll('##MEDIA_URL##', `http://${s.targetIP}:${s.targetPort}`);

  // Ruffle socket proxy
  const socketProxy = JSON.stringify([
    socketInfo(s.targetIP, s.loginPort),
    socketInfo(s.targetIP, s.worldPort),
    socketInfo(s.targetIP, s.snowPort)
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

  return b.replace('</head>', `${injectedScript}</head>`);
}