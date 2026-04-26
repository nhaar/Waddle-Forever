import { iterateEntries, EventListener } from "@common/utils";
import { FileRef, getMediaFilePath } from "@server/game-data/files";
import { RoomName } from "@server/game-data/rooms";
import { ORIGINAL_STAMPBOOK, Stampbook } from "@server/game-data/stamps";
import { ItemTable } from "@server/game-logic/items";
import { isGreater, Version } from "@server/routes/versions";
import { SettingsManager } from "@server/settings";
import { CatalogItems, CPUpdateE, CrumbIndicator, GameUpdate, HuntCrumbs } from "@server/updates";
import path from "path";
import { SCAVENGER_ICON_PATH, TICKET_INFO_PATH } from "./crumbs";

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
  vanillaEngine: boolean;
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
    preCpip: true,
    vanillaEngine: false
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
    this.addRoute(roomRoute, file);
  }

  private addRoute(route: string, file: FileRef) {
    this.state.files.set(route, getMediaFilePath(file));
  }

  private addCatalog(input: FileRef | CatalogItems, paths: string[]) {
    const file = typeof input === 'string' ? input : input.file;
    if (file !== undefined) {
      paths.forEach(p => this.addRoute(p, file));
    }
  }

  private addCrumbChange(baseRoute: string, route: string, info: FileRef | CrumbIndicator) {
    const fileRef = typeof info === 'string' ? info : info[0];
    const fullRoute = path.join(baseRoute, route);
    this.addRoute(fullRoute, fileRef);
  }

  public addListener(callback: () => void): void {
    this.updateListener.addListener(callback);
  }

  public update(date: Version): void {
    this.date = date;
    this.state = getFreshState();

    let pinRoom: RoomName | null = null;

    const actions: {
      [K in keyof CPUpdateE]: (v: Exclude<CPUpdateE[K], undefined>) => void
    } = {
     'dateReference': (v) => {
        switch (v) {
          case 'stamps-release':
            this.state.stampbook = JSON.parse(JSON.stringify(ORIGINAL_STAMPBOOK));
            break;
          case 'cpip':
            this.state.preCpip = false;
            break;
          case 'vanilla-engine':
            this.state.vanillaEngine = true;
          default:
            break;
        }
      },
      'fileChanges': (v) => {
        iterateEntries(v, (route, fileRef) => {
          this.state.files.set(route, getMediaFilePath(fileRef));
        });
      },
      'stampUpdates': (v) => {
        v.forEach(u => {
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
      },
      'scavengerHunt2011': (v) => {
        this.state.hunt = v;
        this.addRoute(path.join('play/v2/content/global', SCAVENGER_ICON_PATH), v.icon);
      },
      'fairCpip': (v) => {
        if (this.state.vanillaEngine) {
          this.state.fair = true;
        } else {
          this.addRoute('play/v2/client/fair.swf', 'tool:fair_icon_adder.swf');
        }
        this.addRoute(`play/v2/content/global/${SCAVENGER_ICON_PATH}`, v.iconFileId);
        this.addRoute(`play/v2/content/local/en/${TICKET_INFO_PATH}`, v.infoFile);
      },
      'partyIconFile': (v) => {
        this.state.partyIcon = true;
        this.addRoute(`play/v2/content/global/${SCAVENGER_ICON_PATH}`, v);
      },
      'migrator': (v) => {
        this.state.migrator = v === false ? false : true;
        if (typeof v === 'string') {
          this.addRoute('play/v2/content/local/en/catalogues/pirate.swf', v);
        }
      },
      'mapNote': (v) => {
        this.state.mapNote = true;
        this.addRoute('play/v2/content/local/en/close_ups/party_map_note.swf', v);
      },
      'unlockedDay': (v) => {
        this.state.unlockedDay = v;
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
      },
      'map': (v) => {
        if (this.state.preCpip) {
          this.addRoute('artwork/maps/island5.swf', v);
          this.addRoute('artwork/maps/16_forest.swf', v);
        } else {
          this.addRoute('play/v2/content/global/content/map.swf', v);
        }
      },
      'clothingCatalog': (v) => {
        this.addCatalog(v, this.state.preCpip ? ['artwork/catalogue/clothing.swf', 'artwork/catalogue/clothing_.swf'] : ['play/v2/content/local/en/catalogues/clothing.swf'])
      },
      'postcardCatalog': (v) => {
        this.addRoute('artwork/catalogue/cards.swf', v);
        this.addRoute('artwork/catalogue/cards_0712.swf', v);
      },
      'hairCatalog': (v) => {
        this.addRoute('play/v2/content/local/en/catalogues/hair.swf', v);
      },
      'petFurniture': (v) => {
        if (this.state.preCpip) {
          this.addRoute('artwork/catalogue/pets_.swf', v);
        } else {
          this.addRoute('play/v2/content/local/en/catalogues/pets.swf', v);
        }
      },
      'puffleCatalog': (v) => {
        if (this.state.preCpip) {
          this.addRoute('artwork/catalogue/adopt_.swf', v);
          this.addRoute('artwork/catalogue/puffle_.swf', v);
        } else {
          this.addRoute('play/v2/content/local/en/catalogues/adopt.swf', v);
        }
      },
      'martialArtworks': (v) => {
        this.addCatalog(v, ['play/v2/content/local/en/catalogues/ninja.swf']);
      },
      'furnitureCatalog': (v) => {
        if (this.state.preCpip) {
          this.addRoute('artwork/catalogue/furniture.swf', v);
          this.addRoute('artwork/catalogue/furniture_.swf', v);
        } else {
          this.addRoute('play/v2/content/local/en/catalogues/furniture.swf', v);
        }
      },
      'iglooCatalog': (v) => {
        if (this.state.preCpip) {
          this.addRoute('artwork/catalogue/igloo_.swf', v);
          this.addRoute('play/v2/content/local/en/catalogues/igloo.swf', v);
        }
      },
      'startscreens': (v) => {
        v.forEach((screen, i) => {
          if (typeof screen === 'string') {
            this.addRoute(`play/v2/content/local/en/login/backgrounds/background${i}.swf`, screen);
            this.addRoute(`play/start/billboards/login/backgrounds/background${i}.swf`, screen);
          } else {
            this.addRoute(`play/v2/content/local/en/login/backgrounds/${screen[0]}`, screen[1]);
            this.addRoute(`play/start/billboards/login/backgrounds/${screen[0]}`, screen[1]);
          }
        });
      },
      'localChanges': (v) => {
        iterateEntries(v, (route, languages) => {
          iterateEntries(languages, (language, info) => {
            this.addCrumbChange(path.join('play/v2/content/local', language), route, info);
          })
        })
      },
      'globalChanges': (v) => {
        iterateEntries(v, (route, info) => {
          this.addCrumbChange('play/v2/content/global', route, info);
        });
      },
      'iglooList': (v) => {
        if (v !== true && typeof v !== 'string') {
          const route = 'play/v2/content/global/content/igloo_music.swf';
          if ('file' in v) {
            this.addRoute(route, v.file);
          } else {
            this.addRoute(route, 'tool:dynamic_igloo_music.swf');
          }
        }
      },
      'scavengerHunt2007': (v) => {
        this.addRoute('artwork/eggs/1.swf', v);
      },
      'scavengerHunt2010': (v) => {
        this.addRoute(path.join('play/v2/content/global', v.iconFilePath ?? SCAVENGER_ICON_PATH), v.iconFileId);
      },
      'stagePlay': (v) => {
        this.addCatalog(v.costumeTrunk, [
          'artwork/catalogue/costume_0712.swf',
          'play/v2/content/local/en/catalogues/costume.swf'
        ]);
      },
      'sportCatalog': (v) => {
        this.addCatalog(v, [
          'artwork/catalogue/sport_.swf',
          'play/v2/content/local/en/catalogues/sport.swf'
        ]);
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