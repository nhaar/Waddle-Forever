import { iterateEntries, EventListener } from "@common/utils";
import { IdRefMap, RouteRefMap } from "@server/game-data";
import { AS3_STATIC_FILES } from "@server/game-data/as3-static";
import { ICONS, PAPER, PHOTOS, SPRITES } from "@server/game-data/clothing";
import { CPIP_AS3_STATIC_FILES } from "@server/game-data/cpip-as3-static";
import { CPIP_STATIC_FILES } from "@server/game-data/cpip-static";
import { FileRef, getMediaFilePath } from "@server/game-data/files";
import { FURNITURE_ICONS, FURNITURE_SPRITES } from "@server/game-data/furniture";
import { MUSIC_IDS } from "@server/game-data/music";
import { POSTCARD_IDS } from "@server/game-data/postcard";
import { PRE_CPIP_STATIC_FILES } from "@server/game-data/precpip-static";
import { RoomName } from "@server/game-data/rooms";
import { ORIGINAL_STAMPBOOK, Stampbook } from "@server/game-data/stamps";
import { ItemTable } from "@server/game-logic/items";
import { getNewspaperName } from "@server/routes/news.txt";
import { isGreater, Version } from "@server/routes/versions";
import { SettingsManager } from "@server/settings";
import { CatalogItems, CPUpdateE, CrumbIndicator, GameUpdate, HuntCrumbs } from "@server/updates";
import path from "path";
import { SCAVENGER_ICON_PATH, TICKET_INFO_PATH } from "./crumbs";
import { NEWSPAPER_TIMELINE } from "./newspapers";

export function getMinifiedDate(date: Version): string {
  return date.replaceAll('-', '');
}

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
  indexHtml: string;
  as3: boolean;
  website: string;
  scavenger: boolean;
  stamps: boolean;
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
    vanillaEngine: false,
    indexHtml: '',
    as3: false,
    website: '',
    scavenger: false,
    stamps: false
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
    this.state.files.set(route.replaceAll('\\', '/'), getMediaFilePath(file));
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

  private addIdMap(parentDir: string, directory: string, idMap: IdRefMap): void {
    iterateEntries(idMap, (id, file) => {
      this.addRoute(path.join(parentDir, directory, `${id}.swf`), file);
    });
  }

  private addRouteMap(routeMap: RouteRefMap): void {
    iterateEntries(routeMap, (route, file) => {
      this.addRoute(route, file);
    });
  }

  private addNewspapers(): void {
    const configXmlPath = 'tool:news_config.xml';
    NEWSPAPER_TIMELINE.forEach((update, i) => {
      if (typeof update.info === 'string' || 'file' in update.info) {
        const file = typeof update.info === 'string' ? update.info : update.info.file;
        const issue = i + 1;

        // pre-cpip, before rewrite
        this.addRoute(`artwork/news/news${issue}.swf`, file);
        // pre-cpip, post rewrite
        const route2007 = getNewspaperName(update.date).replace('|', '/') + '.swf';
        this.addRoute(path.join('artwork/news', route2007), file);

        // 2006 boiler room (likely inaccurate, this artwork/archives was probably not a newspaper but a bundle of papers)
        this.addRoute(path.join('artwork/archives', `news${issue + 1}.swf`), file);

        // post-cpip
        const date = getMinifiedDate(update.date);
        this.addRoute(`play/v2/content/local/en/news/${date}/${date}.swf`, file);
      } else {
        const baseNewsPath = 'play/v2/content/local/en/news/';
        const oldNewsPath = `${baseNewsPath}${getMinifiedDate(update.date)}`;
        const newNewsPath = `${baseNewsPath}papers/${getMinifiedDate(update.date)}`;
        this.addRoute(path.join(oldNewsPath, 'config.xml'), configXmlPath);
        this.addRoute(path.join(newNewsPath, 'config.xml'), configXmlPath);
        const newspaperComponenets: Array<[string, string]> = [
          ['front/header.swf', update.info.headerFront ?? 'archives:News285HeaderFront.swf'],
          ['front/featureStory.swf', update.info.featureStory],
          ['front/supportStory.swf', update.info.supportStory],
          ['front/upcomingEvents.swf', update.info.upcomingEvents],
          ['front/newsFlash.swf', update.info.newsFlash],
          ['front/askAuntArctic.swf', update.info.askFront],
          ['front/dividers.swf', update.info.dividersFront ?? 'approximation:dividers_blank.swf'],
          ['front/navigation.swf', update.info.navigationFront ?? 'archives:News268NavigationFront.swf'],
          ['back/header.swf', update.info.headerBack ?? 'archives:News285HeaderBack.swf'],
          ['back/askAuntArctic.swf', update.info.askBack],
          ['back/secrets.swf', update.info.secrets ?? 'archives:News285Secrets.swf'],
          ['back/submitYourContent.swf', update.info.submit ?? 'archives:News268SubmitYourContent.swf'],
          ['back/jokesAndRiddles.swf', update.info.jokes ?? 'archives:News285JokesAndRiddles.swf'],
          ['back/dividers.swf', update.info.dividersBack ?? 'approximation:dividers_blank.swf'],
          ['back/navigation.swf', update.info.navigationBack ?? 'archives:News268NavigationBack.swf']
        ]
        if (update.info.answers !== undefined) {
          newspaperComponenets.push(['overlays/riddlesAnswers.swf', update.info.answers]);
        }
        if (update.info.extraJokes !== undefined) {
          newspaperComponenets.push(['overlays/extraJokes.swf', update.info.extraJokes]);
        }
        if (update.info.secret !== undefined && update.info.secret !== null) {
          newspaperComponenets.push(['overlays/secret.swf', update.info.secret]);
        }
        if (update.info.iglooWinners !== undefined) {
          newspaperComponenets.push(['overlays/iglooWinners.swf', update.info.iglooWinners]);
        }
        if (update.info.featureMore !== undefined) {
          newspaperComponenets.push(['overlays/featureMore.swf', update.info.featureMore ?? 'archives:News284FeatureMore.swf']);
        }
        if (update.info.supportMore !== undefined) {
          newspaperComponenets.push(['overlays/supportMore.swf', update.info.supportMore ?? 'archives:News282SupportMore.swf']);
        }
        if (update.info.extra !== undefined) {
          newspaperComponenets.push(['overlays/extra.swf', update.info.extra]);
        }
        
        newspaperComponenets.forEach((pair) => {
          const [route, file] = pair;
          this.addRoute(path.join(oldNewsPath, 'content', route), file);
          this.addRoute(path.join(newNewsPath, 'content', route), file);
        }) 
        }
    });
  }

  private addDefaultFiles() {
    ['play/v2/content/global', ''].forEach((parentDir) => this.addIdMap(parentDir, 'music', MUSIC_IDS));

    this.addIdMap('play/v2/content/local/en', 'postcards', POSTCARD_IDS);
  
    const clothingDir = 'play/v2/content/global/clothing';
    const preCpipClothingDir = 'artwork';

    this.addIdMap(clothingDir, 'icons', ICONS);
    this.addIdMap(clothingDir, 'paper', PAPER);

    const preCpipPhotos: IdRefMap = {};
    iterateEntries(PHOTOS, (id, file) => {
      preCpipPhotos[Number(id) - 900] = file;
    });

    this.addIdMap(clothingDir, 'photos', PHOTOS);
    this.addIdMap(preCpipClothingDir, 'photos', preCpipPhotos);

    this.addIdMap(clothingDir, 'sprites', SPRITES);
    this.addIdMap(preCpipClothingDir, 'items', SPRITES);

    const furnitureDir = 'play/v2/content/global/furniture';
    this.addIdMap(furnitureDir, 'icons', FURNITURE_ICONS);
    this.addIdMap(furnitureDir, 'sprites', FURNITURE_SPRITES);

    this.addRouteMap(PRE_CPIP_STATIC_FILES);

    this.addNewspapers();
  }

  public addListener(callback: () => void): void {
    this.updateListener.addListener(callback);
  }

  public update(date: Version): void {
    this.date = date;
    this.state = getFreshState();

    this.addDefaultFiles();

    let pinRoom: RoomName | null = null;

    const actions: {
      [K in keyof CPUpdateE]: (v: Exclude<CPUpdateE[K], undefined>) => void
    } = {
     'dateReference': (v) => {
        switch (v) {
          case 'stamps-release':
            this.state.stampbook = JSON.parse(JSON.stringify(ORIGINAL_STAMPBOOK));
            this.state.stamps = true;
            break;
          case 'cpip':
            this.state.preCpip = false;
            this.addRouteMap(CPIP_STATIC_FILES);
            this.addRouteMap(CPIP_AS3_STATIC_FILES);
            break;
          case 'vanilla-engine':
            this.state.vanillaEngine = true;
            this.addRouteMap(AS3_STATIC_FILES);
            break;
          case 'as3':
            this.state.as3 = true;
            break;
          default:
            break;
        }
      },
      'fileChanges': (v) => {
        iterateEntries(v, (route, fileRef) => {
          this.addRoute(route, fileRef);
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
        if (!this.state.vanillaEngine) {
          this.addRoute('play/v2/client/fair.swf', 'tool:fair_icon_adder.swf');
        }
        this.state.fair = true;
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
        this.state.scavenger = true;
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
      },
      'indexHtml': (v) => {
        this.state.indexHtml = v;
      },
      'websiteFolder': (v) => {
        this.state.website = v;
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

  public getIndexHtml() {
    return this.state.indexHtml;
  }

  public getAs3() {
    return this.state.as3;
  }

  public isPreCpip() {
    return this.state.preCpip;
  }

  public getWebsite() {
    return this.state.website;
  }

  public isHuntActive() {
    return this.state.scavenger;
  }

  public isVanillaEngine() {
    return this.state.vanillaEngine;
  }

  public stampsReleased() {
    return this.state.stamps;
  }
}