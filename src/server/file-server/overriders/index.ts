import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { overrideIndexHtml } from "./index.html";
import { overrideLoadSwf } from "./load.swf";

export type OverriderFunction = (d: GameData, s: SettingsManager, b: Buffer | string) => Promise<Buffer | string>;

export const OVERRIDERS: Record<string, OverriderFunction> = {
  '': overrideIndexHtml,
  'load.swf': overrideLoadSwf
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