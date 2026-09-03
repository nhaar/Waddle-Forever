import { changeFrameRate } from "@common/flash/manipulate";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";

export async function overrideBootsSwf(d: GameData, s: SettingsManager, b: Buffer | string): Promise<Buffer | string> {
  if (typeof b === 'string') {
    b = Buffer.from(b);
  }
  
  if (s.settings.fps30) {
    b = changeFrameRate(b, 30);
  }

  return b;
}