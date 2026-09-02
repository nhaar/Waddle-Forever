import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";

import { getMediaFile } from "@server/game-data/files";
import { replaceConstants } from "@common/flash/manipulate";

export async function overrideLoadSwf(_: GameData, s: SettingsManager, b: Buffer | string): Promise<Buffer | string> {
  
  if (s.settings.fps30) {
    b = await getMediaFile('tools:load30.swf');
  }

  if (typeof b === 'string') {
    b = Buffer.from(b);
  }

  return replaceConstants(b, {
    PORT: String(s.worldPort),
    IP: s.targetIP,
    URLPRE: `http://${s.targetIP.slice(0, 3)}`
  });
}