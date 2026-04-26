import { iterateEntries, EventListener } from "@common/utils";
import { getMediaFilePath } from "@server/game-data/files";
import { isGreater, Version } from "@server/routes/versions";
import { SettingsManager } from "@server/settings";
import { UPDATES } from "@server/updates/updates";

/** Manages all the data related to the game at a particular point in time */
export class GameData {
  /** map of route -> path of file in media folder, meant for static files */
  private files = new Map<string, string>();

  private updateListener = new EventListener();

  constructor(settings: SettingsManager) {
    this.update(settings.settings.version);
    settings.addListener(() => {
      this.update(settings.settings.version);
    });
  }

  public addListener(callback: () => void): void {
    this.updateListener.addListener(callback);
  }

  public update(date: Version): void {
    this.files = new Map<string, string>();

    for (const update of UPDATES) {
      // check every update until the current date
      if (isGreater(update.date, date)) {
        break;
      }
      // don't include temporary events that finished already
      if (update.end !== undefined && isGreater(date, update.end)) {
        continue;
      }

      if (update.update.fileChanges !== undefined) {
        iterateEntries(update.update.fileChanges, (route, fileRef) => {
          this.files.set(route, getMediaFilePath(fileRef));
        });
      }

      this.updateListener.fire();
    }
  }

  public lookupFile(route: string): string | undefined {
    return this.files.get(route);
  }
}