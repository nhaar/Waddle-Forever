import { getMediaFile } from "@server/game-data/files";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";

export async function overrideMedievalSound(d: GameData, s: SettingsManager, b: Buffer | string): Promise<Buffer | string> {
  if (s.settings.medieval_sound_fix) {
    return await getMediaFile('archives:RoomsParty24-11Feb2014.swf');
  }

  return b;
}