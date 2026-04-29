import { iterateEntries, EventListener } from "@common/utils";
import { getNewspaperName } from "@server/file-generators/news.txt";
import { IdRefMap, RouteRefMap } from "@server/game-data";
import { AS3_STATIC_FILES } from "@server/game-data/as3-static";
import { ICONS, PAPER, PHOTOS, SPRITES } from "@server/game-data/clothing";
import { CPIP_AS3_STATIC_FILES } from "@server/game-data/cpip-as3-static";
import { CPIP_STATIC_FILES } from "@server/game-data/cpip-static";
import { FileRef, getMediaFilePath } from "@server/game-data/files";
import { FURNITURE_ICONS, FURNITURE_SPRITES } from "@server/game-data/furniture";
import { GameName } from "@server/game-data/games";
import { MUSIC_IDS } from "@server/game-data/music";
import { POSTCARD_IDS } from "@server/game-data/postcard";
import { PRE_CPIP_STATIC_FILES } from "@server/game-data/precpip-static";
import { RoomName } from "@server/game-data/rooms";
import { getStagePlayMusic, StageScript } from "@server/game-data/stage-plays";
import { ORIGINAL_STAMPBOOK, Stampbook } from "@server/game-data/stamps";
import { FURNITURE } from "@server/game-logic/furniture";
import { ItemTable } from "@server/game-logic/items";
import { isGreater, Version } from "@server/routes/versions";
import { SettingsManager } from "@server/settings";
import { CatalogItems, CPUpdateE, CrumbIndicator, GameUpdate, HuntCrumbs, IglooList, ListSongPatch, WorldStamp } from "@server/updates";
import path from "path";
import { SCAVENGER_ICON_PATH, TICKET_INFO_PATH } from "./crumbs";

export function getNewspaperDate(year: number, month: number, day: number) {
  return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
}

function isMusicList(arr: IglooList | ListSongPatch[]): arr is IglooList {
  return !('pos' in arr[0]);
}

/** Number of rows in a 2D music list */
export const ROWS = 7;
/** Number of columns in a 2D music list */
export const COLS = 2;

/** Applies a patch to a music list */
function applyPatch(list: IglooList, songs: ListSongPatch[]): void {
  // clear all previous "news"
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      list[i][j].new = undefined;
    }
  }
  songs.forEach((song) => {
    const [row, col] = song.pos;
    list[row - 1][col - 1] = { id: song.id, display: song.display, new: true };
  });
}

type GameState = {
  /** map of route -> path of file in media folder, meant for static files */
  files: Map<string, string | ((s: SettingsManager) => string)>;
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
  stageScript: StageScript;
  localPaths: Map<string, string>;
  compositePaths: boolean;
  newShell2009: boolean;
  roomMusic: Map<RoomName, number>;
  roomMember: Map<RoomName, boolean>;
  gameMusic: Map<GameName, number>;
  furniturePrices: Map<number, number>;
  itemPrices: Map<number, number>;
  globalPaths: Map<string, string>;
  school: boolean;
  mall: boolean;
  vr: boolean;
  issues: Array<{ year: number; month: number; day: number; edition: number | string; as3: boolean; title: string; }>;
  roomsFrame: Map<RoomName, number>;
  chatVersion: number;
  iglooVersion: number;
  startscreens: string[];
  as3Startscreen: boolean;
  worldStamps: WorldStamp[];
  gameStrings: Map<string, string>;
  iglooMusic: IglooList | null;
  egg: number;
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
    stamps: false,
    stageScript: [],
    localPaths: new Map<string, string>(),
    compositePaths: false,
    newShell2009: false,
    roomMusic: new Map<RoomName, number>(),
    roomMember: new Map<RoomName, boolean>(),
    gameMusic: new Map<GameName, number>(),
    furniturePrices: new Map<number, number>(),
    itemPrices: new Map<number, number>(),
    globalPaths: new Map<string, string>(),
    school: false,
    mall: false,
    vr: true,
    issues: [],
    roomsFrame: new Map<RoomName, number>(),
    chatVersion: 0,
    iglooVersion: 0,
    startscreens: [],
    as3Startscreen: false,
    worldStamps: [],
    gameStrings: new Map<string, string>(),
    iglooMusic: null,
    egg: 0
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

  private addDefaultInfo() {
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

    // furniture prices
    FURNITURE.rows.forEach((furniture) => {
      this.state.furniturePrices.set(furniture.id, furniture.cost);
    });

    this.items.rows.forEach((item) => {
      this.state.itemPrices.set(item.id, item.cost);
    });
  }

  public addListener(callback: () => void): void {
    this.updateListener.addListener(callback);
  }

  public update(date: Version): void {
    this.date = date;
    this.state = getFreshState();

    this.addDefaultInfo();

    let pinRoom: RoomName | null = null;
    const scripts = new Map<string, StageScript>();
    let currentList: IglooList | null = null;

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
          case 'composite-paths':
            this.state.compositePaths = false;
            break;
          case 'string-verify':
            this.state.newShell2009 = true;
            break;
          case 'placeholder-2016':
            this.state.school = true;
            break;
          case 'mall':
            this.state.mall = true;
            break;
          case 'vr-room':
            this.state.vr = false;
            break;
          case 'as3-startscreen':
            this.state.as3Startscreen = true;
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

        this.state.globalPaths.set('scavenger_hunt_icon', SCAVENGER_ICON_PATH);
      },
      'fairCpip': (v) => {
        if (!this.state.vanillaEngine) {
          this.addRoute('play/v2/client/fair.swf', 'tool:fair_icon_adder.swf');
        }
        this.state.fair = true;
        this.addRoute(`play/v2/content/global/${SCAVENGER_ICON_PATH}`, v.iconFileId);
        this.addRoute(`play/v2/content/local/en/${TICKET_INFO_PATH}`, v.infoFile);

        this.state.localPaths.set('tickets', TICKET_INFO_PATH);

        this.state.globalPaths.set('ticket_icon', SCAVENGER_ICON_PATH);
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
        const screenFiles: string[] = [];
        const resolvedScreens = v.map((screen, i) => {
          if (typeof screen === 'string') {
            screenFiles.push(screen);
            return `background${i}.swf`;
          } else {
            screenFiles.push(screen[1]);
            return screen[0];
          }
        });

        this.state.startscreens = resolvedScreens;
        screenFiles.forEach((file, i) => {
          const screen = resolvedScreens[i];
          this.addRoute(`play/v2/content/local/en/login/backgrounds/${screen}`, file);
          this.addRoute(`play/start/billboards/login/backgrounds/${screen}`, file);
        });
      },
      'localChanges': (v) => {
        iterateEntries(v, (route, languages) => {
          iterateEntries(languages, (language, info) => {
            // updating the route file
            this.addCrumbChange(path.join('play/v2/content/local', language), route, info);

            // updating the key -> route
            if (typeof info !== 'string') {
              const [_, ...paths] = info;
              paths.forEach((path) => {
                this.state.localPaths.set(path, route);
              })
            }
          })
        })
      },
      'globalChanges': (v) => {
        iterateEntries(v, (route, info) => {
          // add file to the routes
          this.addCrumbChange('play/v2/content/global', route, info);

          // add routes to the keys
          if (typeof info !== 'string') {
            const [_, ...paths] = info;
            paths.forEach((globalPath) => {
              this.state.globalPaths.set(globalPath, route);
            })
          }
        });
      },
      'iglooList': (v) => {
        // not boolean or string: is igloo list
        if (v !== true && typeof v !== 'string') {
          const route = 'play/v2/content/global/content/igloo_music.swf';
          
          // has file: non dynamic
          if ('file' in v) {
            this.addRoute(route, v.file);
          } else {
            // dynamic
            this.addRoute(route, 'tool:dynamic_igloo_music.swf');

            if (isMusicList(v)) {
              currentList = v;
            } else {
              if (currentList === null) {
                throw new Error('Patch came before a list');
              }
              applyPatch(currentList, v);
            }
          }
        }
      },
      'scavengerHunt2007': (v) => {
        this.addRoute('artwork/eggs/1.swf', v);

        this.state.egg = 1;
      },
      'scavengerHunt2010': (v) => {
        this.state.scavenger = true;
        this.addRoute(path.join('play/v2/content/global', v.iconFilePath ?? SCAVENGER_ICON_PATH), v.iconFileId);

        const huntIconPath = v.iconFilePath ?? SCAVENGER_ICON_PATH;
        this.state.globalPaths.set('scavenger_hunt_icon', huntIconPath);
      },
      'stagePlay': (v) => {
        // costume trunk
        this.addCatalog(v.costumeTrunk, [
          'artwork/catalogue/costume_0712.swf',
          'play/v2/content/local/en/catalogues/costume.swf'
        ]);

        // stage script
        let script = scripts.get(v.name);
        if (script === undefined) {
          script = v.script ?? []
          scripts.set(v.name, script);
        } else {
          if (v.script !== undefined) {
            script = v.script;
            scripts.set(v.name, script);
          }
        }

        this.state.stageScript = script;

        // room music
        this.state.roomMusic.set('stage', getStagePlayMusic(v.name));
      },
      'sportCatalog': (v) => {
        this.addCatalog(v, [
          'artwork/catalogue/sport_.swf',
          'play/v2/content/local/en/catalogues/sport.swf'
        ]);
      },
      'indexHtml': (v) => {
        this.addRoute('', `websites:${v}.html`);
      },
      'websiteFolder': (v) => {
        this.state.website = v;
      },
      'playScript': (v) => {
        this.state.stageScript = v;
      },
      'music': (v) => {
        iterateEntries(v, (room, music) => {
          this.state.roomMusic.set(room, music);
        });
      },
      'memberRooms': (v) => {
        iterateEntries(v, (room, member) => {
          this.state.roomMember.set(room, member);
        });
      },
      'gameMusic': (v) => {
        iterateEntries(v, (game, music) => {
          this.state.gameMusic.set(game, music);
        })
      },
      'furniturePrices': (v) => {
        iterateEntries(v, (key, value) => {
          this.state.furniturePrices.set(Number(key), value);
        });
      },
      'prices': (v) => {
        iterateEntries(v, (key, value) => {
          this.state.itemPrices.set(Number(key), value);
        })
      },
      'issue': (v) => {
        if (this.state.issues.length >= 7) {
          this.state.issues.pop();
        }
        this.state.issues.splice(0, 0, { ...v, as3: this.state.as3 });

        if (v.type === 'as2'
          // typeof update.info === 'string' || 'file' in update.info
        ) {
          const file = v.file;
          const issue = v.edition;


          // pre-cpip, before rewrite
          this.addRoute(`artwork/news/news${issue}.swf`, file);
          // pre-cpip, post rewrite
          const route2007 = getNewspaperName(v.year, v.month, v.day).replace('|', '/') + '.swf';
          this.addRoute(path.join('artwork/news', route2007), file);

          // 2006 boiler room (likely inaccurate, this artwork/archives was probably not a newspaper but a bundle of papers)
          if (typeof issue === 'number') {
            this.addRoute(path.join('artwork/archives', `news${issue + 1}.swf`), file);
          }

          // post-cpip
          const date = getNewspaperDate(v.year, v.month, v.day);
          this.addRoute(`play/v2/content/local/en/news/${date}/${date}.swf`, file);
        } else {
          const baseNewsPath = 'play/v2/content/local/en/news/';
          const oldNewsPath = `${baseNewsPath}${getNewspaperDate(v.year, v.month, v.day)}`;
          const newNewsPath = `${baseNewsPath}papers/${getNewspaperDate(v.year, v.month, v.day)}`;
          const configXmlPath = 'tool:news_config.xml';
          this.addRoute(path.join(oldNewsPath, 'config.xml'), configXmlPath);
          this.addRoute(path.join(newNewsPath, 'config.xml'), configXmlPath);
          const newspaperComponenets: Array<[string, string]> = [
            ['front/header.swf', v.headerFront ?? 'archives:News285HeaderFront.swf'],
            ['front/featureStory.swf', v.featureStory],
            ['front/supportStory.swf', v.supportStory],
            ['front/upcomingEvents.swf', v.upcomingEvents],
            ['front/newsFlash.swf', v.newsFlash],
            ['front/askAuntArctic.swf', v.askFront],
            ['front/dividers.swf', v.dividersFront ?? 'approximation:dividers_blank.swf'],
            ['front/navigation.swf', v.navigationFront ?? 'archives:News268NavigationFront.swf'],
            ['back/header.swf', v.headerBack ?? 'archives:News285HeaderBack.swf'],
            ['back/askAuntArctic.swf', v.askBack],
            ['back/secrets.swf', v.secrets ?? 'archives:News285Secrets.swf'],
            ['back/submitYourContent.swf', v.submit ?? 'archives:News268SubmitYourContent.swf'],
            ['back/jokesAndRiddles.swf', v.jokes ?? 'archives:News285JokesAndRiddles.swf'],
            ['back/dividers.swf', v.dividersBack ?? 'approximation:dividers_blank.swf'],
            ['back/navigation.swf', v.navigationBack ?? 'archives:News268NavigationBack.swf']
          ]
          if (v.answers !== undefined) {
            newspaperComponenets.push(['overlays/riddlesAnswers.swf', v.answers]);
          }
          if (v.extraJokes !== undefined) {
            newspaperComponenets.push(['overlays/extraJokes.swf', v.extraJokes]);
          }
          if (v.secret !== undefined && v.secret !== null) {
            newspaperComponenets.push(['overlays/secret.swf', v.secret]);
          }
          if (v.iglooWinners !== undefined) {
            newspaperComponenets.push(['overlays/iglooWinners.swf', v.iglooWinners]);
          }
          if (v.featureMore !== undefined) {
            newspaperComponenets.push(['overlays/featureMore.swf', v.featureMore ?? 'archives:News284FeatureMore.swf']);
          }
          if (v.supportMore !== undefined) {
            newspaperComponenets.push(['overlays/supportMore.swf', v.supportMore ?? 'archives:News282SupportMore.swf']);
          }
          if (v.extra !== undefined) {
            newspaperComponenets.push(['overlays/extra.swf', v.extra]);
          }
          
          newspaperComponenets.forEach((pair) => {
            const [route, file] = pair;
            this.addRoute(path.join(oldNewsPath, 'content', route), file);
            this.addRoute(path.join(newNewsPath, 'content', route), file);
          }) 
        }
      },
      'chatVersion': (v) => {
        this.state.chatVersion = v;
      },
      'iglooVersion': (v) => {
        this.state.iglooVersion = v;
      },
      'worldStamps': (v) => {
        v.forEach(e => this.state.worldStamps.push(e));
      },
      'gameStrings': (v) => {
        this.state.gameStrings = new Map(Object.entries(v));
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

  public lookupFile(route: string): string | ((s: SettingsManager) => string) | undefined {
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

  public getStageScript() {
    return this.state.stageScript;
  }

  public getLocalPaths() {
    return this.state.localPaths;
  }

  public useCompositePaths() {
    return this.state.compositePaths;
  }

  public isNewShell2009() {
    return this.state.newShell2009;
  }

  public getRoomsMusic() {
    return this.state.roomMusic;
  }

  public getRoomsMember() {
    return this.state.roomMember;
  }

  public getGamesMusic() {
    return this.state.gameMusic;
  }

  public getFurniturePrices() {
    return this.state.furniturePrices;
  }

  public getItemPrices() {
    return this.state.itemPrices;
  }

  public getGlobalPaths() {
    return this.state.globalPaths;
  }

  public hasSchool() {
    return this.state.school;
  }

  public hasMall() {
    return this.state.mall;
  }

  public hasVRRoom() {
    return this.state.vr;
  }

  public getIssue() {
    return this.state.issues[0].edition;
  }

  public getRoomsFrame() {
    return this.state.roomsFrame;
  }

  public getChatVersion() {
    return this.state.chatVersion;
  }

  public getIglooVersion() {
    return this.state.iglooVersion;
  }

  public getActiveIssues() {
    return this.state.issues;
  }

  public getStartScreens() {
    return this.state.startscreens;
  }

  public afterAs3Startscreen() {
    return this.state.as3Startscreen;
  }

  public getWorldStamps() {
    return this.state.worldStamps;
  }

  public getGameStrings() {
    return this.state.gameStrings;
  }

  public getIglooList() {
    return this.state.iglooMusic;
  }

  public getEgg() {
    return this.state.egg;
  }
}