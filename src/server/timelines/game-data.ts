import { iterateEntries, EventListener, toForwardSlash } from "@common/utils";
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
import { PRE_CPIP_STATIC_FILES } from "@server/game-data/precpip-static";
import { RoomName } from "@server/game-data/rooms";
import { getStagePlayMusic, StageScript } from "@server/game-data/stage-plays";
import { ORIGINAL_STAMPBOOK, Stampbook, StampCategory, StampRoom, STAMP_ROOMS } from "@server/game-data/stamps";
import { FURNITURE } from "@server/game-logic/furniture";
import { CustomItem, getItemsTable, Item, ItemTable, ItemType } from "@server/game-logic/items";
import { ITEMS_DATA } from "@server/game-logic/items-data";
import { WaddleRoomInfo } from "@server/game-logic/waddles";
import { isGreater, isGreaterOrEqual, Version } from "@server/routes/versions";
import { CPUpdateE, CrumbIndicator, GameFlag, GameUpdate, HuntCrumbs, IglooList, ListSongPatch, PartyOp, WorldStamp } from "@server/updates";
import { getUpdates } from "@server/updates/updates";
import path from "path";

const SCAVENGER_ICON_PATH = 'scavenger_hunt/scavenger_hunt_icon.swf';
const TICKET_INFO_PATH = 'close_ups/tickets.swf';

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
  files: Map<string, string>;
  stampbook: Stampbook;
  hunt: HuntCrumbs | null;
  fair: boolean;
  partyIcon: boolean;
  migrator: boolean;
  mapNote: boolean;
  unlockedDay: number | null;
  indexHtml: string;
  website: string;
  scavenger: boolean;
  stageScript: StageScript;
  localPaths: Map<string, string>;
  roomMusic: Map<RoomName, number>;
  roomMember: Map<RoomName, boolean>;
  gameMusic: Map<GameName, number>;
  furniturePrices: Map<number, number>;
  itemPrices: Map<number, number>;
  globalPaths: Map<string, string>;
  issues: Array<{ year: number; month: number; day: number; edition: number | string; as3: boolean; title: string; }>;
  roomsFrame: Map<RoomName, number>;
  chatVersion: number;
  iglooVersion: number;
  startscreens: string[];
  worldStamps: WorldStamp[];
  gameStrings: Map<string, string>;
  iglooMusic: IglooList | null;
  egg: number;
  activeFeatures: string | null;
  coinsForChange: boolean;
  bakery: boolean;
  cfcValues: [number, number, number] | null;
  clientItems: Set<number>;
  partyOp: PartyOp | null;
  freeBrownPuffle: boolean;
  gameStamps: Map<StampRoom, Set<number>>;
  releasedStamps: Set<number>;
  extraWaddleRooms: WaddleRoomInfo[];
  flags: Record<GameFlag, boolean>;
  available: Set<number>;
  itemMemberStatus: Map<number, boolean>;
  availableRooms: Set<RoomName>;
  starterColors: Set<number>;
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
    flags: {
      'preCpip': true,
      'as3': false,
      vanillaEngine: false,
      stamps: false,
      compositePaths: true,
      newShell2009: false,
      school: false,
      mall: false,
      vr: true,
      as3Startscreen: false,
      iglooMusicReleased: false,
      ownedIgloos: false,
      isSpOnJr: false,
      puffleHandItems: true,
      nestAvailable: false,
      holdAvailable: false,
      quartersAvailable: false,
      memberElementalGames: true
    },
    indexHtml: '',
    website: '',
    scavenger: false,
    stageScript: [],
    localPaths: new Map<string, string>(),
    roomMusic: new Map<RoomName, number>(),
    roomMember: new Map<RoomName, boolean>(),
    gameMusic: new Map<GameName, number>(),
    furniturePrices: new Map<number, number>(),
    itemPrices: new Map<number, number>(),
    globalPaths: new Map<string, string>(),
    issues: [],
    roomsFrame: new Map<RoomName, number>(),
    chatVersion: 0,
    iglooVersion: 0,
    startscreens: [],
    worldStamps: [],
    gameStrings: new Map<string, string>(),
    iglooMusic: null,
    egg: 0,
    activeFeatures: null,
    coinsForChange: false,
    bakery: false,
    cfcValues: null,
    clientItems: new Set<number>(),
    partyOp: null,
    freeBrownPuffle: false,
    gameStamps: new Map<StampRoom, Set<number>>(),
    releasedStamps: new Set<number>(),
    extraWaddleRooms: [],
    available: new Set(),
    itemMemberStatus: new Map(),
    availableRooms: new Set(),
    starterColors: new Set()
  };
}


/** Manages all the data related to the game at a particular point in time */
export class GameData {
  private state = getFreshState();

  private updateListener = new EventListener();

  private date: string;

  private updates: GameUpdate[]

  private items: ItemTable;

  constructor(date: Version) {
    this.updates = getUpdates();
    // todo: remove global state
    this.items = getItemsTable(ITEMS_DATA);
    this.date = date;
    this.update(date);
  }

  private addRoom(room: RoomName, file: FileRef) {
    const roomRoute = (this.state.flags.preCpip ? 'artwork/rooms/' : 'play/v2/content/global/rooms/') + room + '.swf';
    this.addRoute(roomRoute, file);
  }

  private addRoute(route: string, file: FileRef) {
    this.state.files.set(toForwardSlash(route), getMediaFilePath(file));
  }

  private addCatalog(input: FileRef | { file?: string; }, paths: string[]) {
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

  private addStampCategory(category: StampCategory) {
    const stampRoom = STAMP_ROOMS[category.group_id];
    if (stampRoom !== undefined) {
      this.state.gameStamps.set(stampRoom, new Set(category.stamps.map(s => s.stamp_id)));
    }
    
    category.stamps.forEach(stamp => {
      this.state.releasedStamps.add(stamp.stamp_id);
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
      'flags': (v) => {
        iterateEntries(v, (flag, value) => {
          this.state.flags[flag] = value;
          if (flag === 'preCpip' && !value) {
            this.addRouteMap(CPIP_STATIC_FILES);
            this.addRouteMap(CPIP_AS3_STATIC_FILES);
          } else if (flag === 'stamps' && value) {
            this.state.stampbook = JSON.parse(JSON.stringify(ORIGINAL_STAMPBOOK));
            ORIGINAL_STAMPBOOK.forEach(category => {
              this.addStampCategory(category);
            });
          } else if (flag === 'vanillaEngine' && value) {
            this.addRouteMap(AS3_STATIC_FILES);
          }
        });
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

            this.addStampCategory(u.category);
          } else {
            for (let i = 0; i < this.state.stampbook.length; i++) {
              if (this.state.stampbook[i].group_id === u.categoryId) {
                this.state.stampbook[i].stamps.push(...u.stamps);
                break;
              }
            }

            const stampRoom = STAMP_ROOMS[u.categoryId];
            const gameStampSet = this.state.gameStamps.get(stampRoom);
            if (gameStampSet !== undefined) {
              u.stamps.forEach(stamp => gameStampSet.add(stamp.stamp_id));
            }
            u.stamps.forEach(stamp => {
              this.state.releasedStamps.add(stamp.stamp_id);
            });
          }
        });
      },
      'scavengerHunt2011': (v) => {
        this.state.hunt = v;
        this.addRoute(path.join('play/v2/content/global', SCAVENGER_ICON_PATH), v.icon);

        this.state.globalPaths.set('scavenger_hunt_icon', SCAVENGER_ICON_PATH);
      },
      'fairCpip': (v) => {
        if (!this.state.flags.vanillaEngine) {
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
        if (this.state.flags.holdAvailable) {
          this.state.availableRooms.add('shiphold');
        }
        if (this.state.flags.nestAvailable) {
          this.state.availableRooms.add('shipnest');
        }
        if (this.state.flags.quartersAvailable) {
          this.state.availableRooms.add('shipquarters');
        }
        this.state.availableRooms.add('ship');
      },
      'mapNote': (v) => {
        this.state.mapNote = true;
        this.addRoute('play/v2/content/local/en/close_ups/party_map_note.swf', v);
      },
      'unlockedDay': (v) => {
        this.state.unlockedDay = v;
      },
      'pinRoom': (v) => {
        pinRoom = v.room;
        if (v.frame !== undefined) {
          this.state.roomsFrame.set(v.room, v.frame);
        }
      },
      'rooms': (v) => {
        iterateEntries(v, (room, value) => {
          if (room.startsWith('party') || room === 'pitch') {
            this.state.availableRooms.add(room);
          }
          this.addRoom(room, value);
        });
      },
      'pinRoomUpdate': (v) => {
        if (pinRoom !== null) {
          this.addRoom(pinRoom, v);
        }
      },
      'map': (v) => {
        if (this.state.flags.preCpip) {
          this.addRoute('artwork/maps/island5.swf', v);
          this.addRoute('artwork/maps/16_forest.swf', v);
        } else {
          this.addRoute('play/v2/content/global/content/map.swf', v);
        }
      },
      'clothingCatalog': (v) => {
        this.addCatalog(v, this.state.flags.preCpip ? ['artwork/catalogue/clothing.swf', 'artwork/catalogue/clothing_.swf'] : ['play/v2/content/local/en/catalogues/clothing.swf'])
        v.newItems.forEach(i => {
          if (this.getItem(i)?.type === ItemType.Color) {
            this.state.starterColors.add(i);
          }
          this.state.available.add(i)
        });
        v.removedItems.forEach(i => this.state.available.delete(i));
      },
      'postcardCatalog': (v) => {
        this.addRoute('artwork/catalogue/cards.swf', v);
        this.addRoute('artwork/catalogue/cards_0712.swf', v);
      },
      'hairCatalog': (v) => {
        this.addRoute('play/v2/content/local/en/catalogues/hair.swf', v);
      },
      'petFurniture': (v) => {
        if (this.state.flags.preCpip) {
          this.addRoute('artwork/catalogue/pets_.swf', v);
        } else {
          this.addRoute('play/v2/content/local/en/catalogues/pets.swf', v);
        }
      },
      'puffleCatalog': (v) => {
        if (this.state.flags.preCpip) {
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
        if (this.state.flags.preCpip) {
          this.addRoute('artwork/catalogue/furniture.swf', v);
          this.addRoute('artwork/catalogue/furniture_.swf', v);
        } else {
          this.addRoute('play/v2/content/local/en/catalogues/furniture.swf', v);
        }
      },
      'iglooCatalog': (v) => {
        if (this.state.flags.preCpip) {
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
        this.state.issues.splice(0, 0, { ...v, as3: this.state.flags.as3 });

        if (v.type === 'as2'
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
      },
      'activeFeatures': (v) => {
        this.state.activeFeatures = v;
      },
      'coinsForChange': () => {
        this.state.coinsForChange = true;
      },
      'bakery': () => {
        this.state.bakery = true;
      },
      'cfcValues': (v) => {
        this.state.cfcValues = v;
      },
      'clientFiles': (v) => {
        v.forEach(id => this.state.clientItems.add(id));
      },
      'removeClientFiles': (v) => {
        v.forEach(id => this.state.clientItems.delete(id));
      },
      'battleOp': (v) => {
        this.state.partyOp = v;
      },
      'frames': (v) => {
        iterateEntries(v, (room, frame) => {
          this.state.roomsFrame.set(room, frame);
        });
      },
      'freeBrownPuffle': (v) => {
        this.state.freeBrownPuffle = v;
      },
      'newWaddleRooms': (v) => {
        this.state.extraWaddleRooms = v;
      },
      'memberItems': (v) => {
        iterateEntries(v, (item, value) => {
          this.state.itemMemberStatus.set(Number(item), value);
        })
      },
      'availableRooms': (v) => {
        v.forEach(r => this.state.availableRooms.add(r));
      }
    }

    for (const update of this.updates) {
      // check every update until the current date
      if (isGreater(update.date, date)) {
        break;
      }
      // don't include temporary events that finished already
      if (update.end !== undefined && isGreaterOrEqual(date, update.end)) {
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

  private updateRawItem(item: Item): Item {
    const isMember = this.state.itemMemberStatus.get(item.id);
    return {
      ...item,
      isMember: isMember === undefined ? item.isMember : isMember,
      cost: this.state.itemPrices.get(item.id) ?? item.cost
    };
  }

  public addCustomItem(item: CustomItem) {
    this.items.addCustomItem(item);
  }

  public removeCustomItem(id: number) {
    this.items.removeCustomItem(id);
  }

  public getItems() {
    return this.items.rows.map(item => this.updateRawItem(item));
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
    return this.state.flags.as3;
  }

  public isPreCpip() {
    return this.state.flags.preCpip;
  }

  public getWebsite() {
    return this.state.website;
  }

  public isHuntActive() {
    return this.state.scavenger;
  }

  public isVanillaEngine() {
    return this.state.flags.vanillaEngine;
  }

  public stampsReleased() {
    return this.state.flags.stamps;
  }

  public getStageScript() {
    return this.state.stageScript;
  }

  public getLocalPaths() {
    return this.state.localPaths;
  }

  public useCompositePaths() {
    return this.state.flags.compositePaths;
  }

  public isNewShell2009() {
    return this.state.flags.newShell2009;
  }

  public getRoomsMusic(overrides: Map<RoomName, number>) {
    return new Map([...this.state.roomMusic, ...overrides]);
  }

  public getRoomsMember() {
    return this.state.roomMember;
  }

  public isRoomMember(room: RoomName): boolean {
    return this.state.roomMember.get(room) === true;
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
    return this.state.flags.school;
  }

  public hasMall() {
    return this.state.flags.mall;
  }

  public hasVRRoom() {
    return this.state.flags.vr;
  }

  public getIssue(): string | number | undefined {
    if (this.state.issues.length === 0) {
      return undefined;
    }
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
    return this.state.flags.as3Startscreen;
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

  public getActiveFeatures() {
    return this.state.activeFeatures;
  }

  public hasCoinsForChange() {
    return this.state.coinsForChange;
  }

  public hasBakery() {
    return this.state.bakery;
  }

  public getCoinsForChangeDonations() {
    return this.state.cfcValues;
  }

  public getClientItems() {
    return this.state.clientItems;
  }

  public getPartyOp() {
    return this.state.partyOp;
  }

  public isBrownPuffleFree() {
    return this.state.freeBrownPuffle;
  }

  public getGameStamps(room: number) {
    return this.state.gameStamps.get(room) ?? new Set<number>();
  }

  public isStampAvailable(stamp: number): boolean {
    return this.state.releasedStamps.has(stamp);
  }

  public getExtraWaddleRooms() {
    return this.state.extraWaddleRooms;
  }

  public getItem(id: number): Item | undefined {
    const item = this.items.get(id);
    return item === undefined ? undefined : this.updateRawItem(item);
  }

  public hasIglooMusicReleased() {
    return this.state.flags.iglooMusicReleased;
  }

  public isAfterOwnedIgloos() {
    return this.state.flags.ownedIgloos;
  }

  public isSpOnJr() {
    return this.state.flags.isSpOnJr;
  }

  public puffleHandItems() {
    return this.state.flags.puffleHandItems;
  }

  public getAvailableItems() {
    return new Set(this.state.available);
  }

  public getAvailableRooms() {
    return [...this.state.availableRooms.values()];
  }

  public getStarterColors() {
    return [...this.state.starterColors.values()];
  }

  public isElementalMember() {
    return this.state.flags.memberElementalGames;
  }
}