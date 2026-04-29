import { getMediaFile } from "@server/game-data/files";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";

export async function overrideBootsSwf(d: GameData, s: SettingsManager, b: Buffer | string): Promise<Buffer | string> {
  if (s.settings.fps30) {
    return await getMediaFile('tool:boots30.swf');
  }

  return b;
}