import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { overrideBootsSwf } from "./30fps";
import { overrideIndexHtml } from "./index.html";
import { overrideLoadSwf } from "./load.swf";
import { overrideDanceContest, overrideJPALevelSelector, overrideThinIce } from "./mods";
import { overrideMyPuffle } from "./mypuffle";
import { overrideMedievalSound } from "./sound-fix";

export type OverriderFunction = (d: GameData, s: SettingsManager, b: Buffer | string) => Promise<Buffer | string>;

export const OVERRIDERS: Record<string, OverriderFunction> = {
  '': overrideIndexHtml,
  'load.swf': overrideLoadSwf,
  'boots.swf': overrideBootsSwf,
  'play/v2/games/book1/bootstrap.swf': overrideMyPuffle,
  'play/v2/games/dancing/dance.swf': overrideDanceContest,
  'play/v2/games/jetpack/JetpackAdventures.swf': overrideJPALevelSelector,
  'play/v2/games/thinice/ThinIce.swf': overrideThinIce,
  'play/v2/content/global/rooms/party24.swf': overrideMedievalSound
};

export class FileOverrider {
  private overriders: Map<string, OverriderFunction>;
  
  constructor(public gameData: GameData, public settings: SettingsManager, overriders: Record<string, OverriderFunction>) {
    this.overriders = new Map(Object.entries(overriders));
  }

  async override(route: string, binary: Buffer | string): Promise<Buffer | string> {
    const func = this.overriders.get(route);
    if (func === undefined) {
      return binary;
    } else {
      return await func(this.gameData, this.settings, binary);
    }
  }
}