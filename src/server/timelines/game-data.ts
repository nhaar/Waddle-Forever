import { iterateEntries, EventListener } from "@common/utils";
import { getMediaFilePath } from "@server/game-data/files";
import { ORIGINAL_STAMPBOOK, Stampbook } from "@server/game-data/stamps";
import { ItemTable } from "@server/game-logic/items";
import { isGreater, isGreaterOrEqual, Version } from "@server/routes/versions";
import { SettingsManager } from "@server/settings";
import { GameUpdate, HuntCrumbs } from "@server/updates";
import { getDate } from "./dates";

type GameState = {
  /** map of route -> path of file in media folder, meant for static files */
  files: Map<string, string>;
  stampbook: Stampbook;
  hunt: HuntCrumbs | null;
  fair: boolean;
  partyIcon: boolean;
  migrator: boolean;
  mapNote: boolean;
  unlockedDay: number | null;
}

function getFreshState(): GameState {
  return {
    files: new Map<string, string>(),
    stampbook: [],
    hunt: null,
    fair: false,
    partyIcon: false,
    migrator: false,
    mapNote: false,
    unlockedDay: null
  };
}

/** Manages all the data related to the game at a particular point in time */
export class GameData {
  private state = getFreshState();

  private updateListener = new EventListener();

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
    this.state = getFreshState();

    for (const update of this.updates) {
      // check every update until the current date
      if (isGreater(update.date, date)) {
        break;
      }
      // don't include temporary events that finished already
      if (update.end !== undefined && isGreater(date, update.end)) {
        continue;
      }

      if (update.update.dateReference !== undefined) {
        switch (update.update.dateReference) {
          case 'stamps-release':
            this.state.stampbook = JSON.parse(JSON.stringify(ORIGINAL_STAMPBOOK));
            break;
          default:
            break;
        }
      }

      if (update.update.fileChanges !== undefined) {
        iterateEntries(update.update.fileChanges, (route, fileRef) => {
          this.state.files.set(route, getMediaFilePath(fileRef));
        });
      }

      if (update.update.stampUpdates !== undefined) {
        update.update.stampUpdates.forEach(u => {
          if ('category' in u) {
            this.state.stampbook.push(JSON.parse(JSON.stringify(u.category)));
          } else {
            for (let i = 0; i < this.state.stampbook.length; i++) {
              if (this.state.stampbook[i].group_id === u.categoryId) {
                this.state.stampbook[i].stamps.push(...u.stamps);
                break;
              }
            }
          }
        });
      }

      if (update.update.scavengerHunt2011 !== undefined) {
        this.state.hunt = update.update.scavengerHunt2011;
      }

      if (update.update.fairCpip !== undefined && isGreaterOrEqual(update.date, getDate('vanilla-engine'))) {
        this.state.fair = true;
      }

      if (update.update.partyIconFile !== undefined) {
        this.state.partyIcon = true;
      }

      if (update.update.migrator !== undefined) {
        this.state.migrator = update.update.migrator === false ? false : true;
      }

      if (update.update.mapNote !== undefined) {
        this.state.mapNote = true;
      }
      if (update.update.unlockedDay !== undefined) {
        this.state.unlockedDay = update.update.unlockedDay;
      }
      this.updateListener.fire();
    }
  }

  public lookupFile(route: string): string | undefined {
    return this.state.files.get(route);
  }

  public getDate() {
    return this.date;
  }

  public getStampbook() {
    return this.state.stampbook;
  }

  public getItems() {
    return this.items.rows;
  }

  public getHunt() {
    return this.state.hunt;
  }

  public getFair() {
    return this.state.fair;
  }

  public getMigrator() {
    return this.state.migrator;
  }

  public getPartyIcon() {
    return this.state.partyIcon;
  }

  public getMapNote() {
    return this.state.mapNote;
  }

  public getUnlockedDay() {
    return this.state.unlockedDay;
  }
}