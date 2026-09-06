import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";

import { replaceConstants } from "@common/flash/manipulate";

export async function overrideLoadSwf(_: GameData, s: SettingsManager, b: Buffer | string): Promise<Buffer | string> {
  if (typeof b === 'string') {
    b = Buffer.from(b);
  }

  return replaceConstants(b, {
    PORT: String(s.worldPort),
    IP: s.targetIP,
    URLPRE: `http://${s.targetIP.slice(0, 3)}`
  });
}
