import { iterateEntries, EventListener } from "@common/utils";
import { getMediaFilePath } from "@server/game-data/files";
import { ORIGINAL_STAMPBOOK, Stampbook } from "@server/game-data/stamps";
import { ItemTable } from "@server/game-logic/items";
import { isGreater, isGreaterOrEqual, Version } from "@server/routes/versions";
import { SettingsManager } from "@server/settings";
import { GameUpdate } from "@server/updates";
import { getDate } from "./dates";

/** Manages all the data related to the game at a particular point in time */
export class GameData {
  /** map of route -> path of file in media folder, meant for static files */
  private files = new Map<string, string>();

  private updateListener = new EventListener();

  private stampbook: Stampbook = [];

  private date: string;

  constructor(private updates: GameUpdate[], private items: ItemTable, settings: SettingsManager) {
    this.date = settings.settings.version;
    this.update(settings.settings.version);
    settings.addListener(() => {
      this.update(settings.settings.version);
    });
  }

  public addListener(callback: () => void): void {
    this.updateListener.addListener(callback);
  }

  public update(date: Version): void {
    this.date = date;
    this.files = new Map<string, string>();
    this.stampbook = isGreaterOrEqual(date, getDate('stamps-release')) ? JSON.parse(JSON.stringify(ORIGINAL_STAMPBOOK)) as Stampbook : [];

    for (const update of this.updates) {
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

      if (update.update.stampUpdates !== undefined) {
        update.update.stampUpdates.forEach(u => {
          if ('category' in u) {
            this.stampbook.push(JSON.parse(JSON.stringify(u.category)));
          } else {
            for (let i = 0; i < this.stampbook.length; i++) {
              if (this.stampbook[i].group_id === u.categoryId) {
                this.stampbook[i].stamps.push(...u.stamps);
                break;
              }
            }
          }
        });
      }

      this.updateListener.fire();
    }
  }

  public lookupFile(route: string): string | undefined {
    return this.files.get(route);
  }

  public getDate() {
    return this.date;
  }

  public getStampbook() {
    return this.stampbook;
  }

  public getItems() {
    return this.items.rows;
  }
}