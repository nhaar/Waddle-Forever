import { getMediaFile } from "@server/game-data/files";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";

export async function overrideDanceContest(d: GameData, s: SettingsManager, b: Buffer | string): Promise<Buffer | string> {
  if (s.settings.swap_dance_arrow) {
    return getMediaFile('mod:dance_contest_swapped.swf');
  }

  return b;
}

export async function overrideJPALevelSelector(d: GameData, s: SettingsManager, b: Buffer | string): Promise<Buffer | string> {
  if (s.settings.jpa_level_selector) {
    return getMediaFile('mod:jpa_level_selector.swf');
  }

  return b;
}

export async function overrideThinIce(d: GameData, s: SettingsManager, b: Buffer | string): Promise<Buffer | string> {
  if (s.settings.thin_ice_igt) {
    if (s.settings.fps30) {
      return getMediaFile('mod:thinice_igt30.swf');
    } else {
      return getMediaFile('mod:thinice_igt24.swf');
    }
  }

  return b;
}