import { iterateEntries, EventListener } from "@common/utils";
import { FileRef, getMediaFilePath } from "@server/game-data/files";
import { RoomName } from "@server/game-data/rooms";
import { ORIGINAL_STAMPBOOK, Stampbook } from "@server/game-data/stamps";
import { ItemTable } from "@server/game-logic/items";
import { isGreater, Version } from "@server/routes/versions";
import { SettingsManager } from "@server/settings";
import { CPUpdateE, GameUpdate, HuntCrumbs } from "@server/updates";

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
  preCpip: boolean;
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
    unlockedDay: null,
    preCpip: true
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

  private addRoom(room: RoomName, file: FileRef) {
    const roomRoute = (this.state.preCpip ? 'artwork/rooms/' : 'play/v2/content/global/rooms/') + room + '.swf';
    this.state.files.set(roomRoute, getMediaFilePath(file));
  }

  public addListener(callback: () => void): void {
    this.updateListener.addListener(callback);
  }

  public update(date: Version): void {
    this.date = date;
    this.state = getFreshState();

    let pinRoom: RoomName | null = null;

    const actions: {
      [K in keyof CPUpdateE]: (v: Exclude<CPUpdateE[K], undefined>, s: GameState) => void
    } = {
     'dateReference': (v, s) => {
        switch (v) {
          case 'stamps-release':
            s.stampbook = JSON.parse(JSON.stringify(ORIGINAL_STAMPBOOK));
            break;
          case 'cpip':
            s.preCpip = false;
            break;
          default:
            break;
        }
      },
      'fileChanges': (v, s) => {
        iterateEntries(v, (route, fileRef) => {
          s.files.set(route, getMediaFilePath(fileRef));
        });
      },
      'stampUpdates': (v, s) => {
        v.forEach(u => {
          if ('category' in u) {
            s.stampbook.push(JSON.parse(JSON.stringify(u.category)));
          } else {
            for (let i = 0; i < s.stampbook.length; i++) {
              if (s.stampbook[i].group_id === u.categoryId) {
                s.stampbook[i].stamps.push(...u.stamps);
                break;
              }
            }
          }
        });
      },
      'scavengerHunt2011': (v, s) => {
        s.hunt = v;
      },
      'fairCpip': (_, s) => {
        s.fair = true;
      },
      'partyIconFile': (_, s) => {
        s.partyIcon = true;
      },
      'migrator': (v, s) => {
        s.migrator = v === false ? false : true;
      },
      'mapNote': (_, s) => {
        s.mapNote = true;
      },
      'unlockedDay': (v, s) => {
        s.unlockedDay = v;
      },
      'pinRoom': (v) => {
        pinRoom = v;
      },
      'rooms': (v) => {
        iterateEntries(v, (room, value) => {
          this.addRoom(room, value);
        });
      },
      'pinRoomUpdate': (v) => {
        if (pinRoom !== null) {
          this.addRoom(pinRoom, v);
        }
      }
    }

    for (const update of this.updates) {
      // check every update until the current date
      if (isGreater(update.date, date)) {
        break;
      }
      // don't include temporary events that finished already
      if (update.end !== undefined && isGreater(date, update.end)) {
        continue;
      }

      for (const key in actions) {
        const value = update.update[key as keyof CPUpdateE];
        if (value !== undefined) {
          const callback = actions[key as keyof CPUpdateE] as (v: typeof value, s: GameState) => void;
          callback(value, this.state);
        }
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