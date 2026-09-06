import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { makeSwf30Fps } from "./30fps";
import { overrideIndexHtml } from "./index.html";
import { overrideLoadSwf } from "./load.swf";
import { overrideDanceContest, overrideJPALevelSelector, overrideThinIce } from "./mods";
import { overrideMyPuffle } from "./mypuffle";
import { overrideMedievalSound } from "./sound-fix";

export type OverriderFunction = (d: GameData, s: SettingsManager, b: Buffer | string) => Promise<Buffer | string>;

export const OVERRIDERS: Record<string, OverriderFunction> = {
  '': overrideIndexHtml,
  'load.swf': overrideLoadSwf,
  'play/v2/client/load.swf': makeSwf30Fps,
  'play/v2/load.swf': makeSwf30Fps,
  'boots.swf': makeSwf30Fps,
  'play/v2/games/book1/bootstrap.swf': overrideMyPuffle,
  'play/v2/games/dancing/dance.swf': overrideDanceContest,
  'play/v2/games/jetpack/JetpackAdventures.swf': overrideJPALevelSelector,
  'play/v2/games/thinice/ThinIce.swf': overrideThinIce,
  'play/v2/content/global/rooms/party24.swf': overrideMedievalSound
};

const REGEX_OVERRIDERS: Array<[RegExp, OverriderFunction]> = [
  [/^chat\d+\.swf$/, makeSwf30Fps]
];

export class FileOverrider {
  private overriders: Map<string | RegExp, OverriderFunction>;
  
  constructor(public gameData: GameData, public settings: SettingsManager, overriders: Record<string, OverriderFunction>) {
    this.overriders = new Map(Object.entries(overriders));

    for (const [regex, overrider] of REGEX_OVERRIDERS) {
      this.overriders.set(regex, overrider);
    }
  }

  async override(route: string, binary: Buffer | string): Promise<Buffer | string> {
    let func: OverriderFunction | undefined;
    for (const [key, overrider] of this.overriders) {
      if (key instanceof RegExp && key.test(route)) {
        func = overrider;
        break;
      }
    }

    func ??= this.overriders.get(route);
    if (func === undefined) {
      return binary;
    } else {
      return await func(this.gameData, this.settings, binary);
    }
  }
}