import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";

import { getMediaFile } from "@server/game-data/files";
import { changeFrameRate, replaceConstants } from "@common/flash/manipulate";

export async function overrideLoadSwf(_: GameData, s: SettingsManager, b: Buffer | string): Promise<Buffer | string> {
  
  if (s.settings.fps30) {
    b = await getMediaFile('tool:load30.swf');
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

export async function overrideNewLoadSwf(_: GameData, s: SettingsManager, b: Buffer | string): Promise<Buffer | string> {
  if (typeof b === 'string') {
    b = Buffer.from(b);
  }
  
  if (s.settings.fps30) {
    b = changeFrameRate(b, 30);
  }

  return b;
}