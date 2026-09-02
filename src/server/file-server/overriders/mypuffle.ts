import { getMediaFile } from "@server/game-data/files";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";

export async function overrideMyPuffle(d: GameData, s: SettingsManager, b: Buffer | string): Promise<Buffer | string> {
  if (s.settings.modern_my_puffle) {
    return getMediaFile('unknown:my_puffle_2013.swf');
  }

  return b;
} 