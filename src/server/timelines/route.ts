import { iterateEntries } from "../../common/utils";
import { IdRefMap, RouteRefMap, TimelineMap, findEarliestDateHitIndex, addRecordToMap } from "../game-data";
import { FileRef, getMediaFilePath, isPathAReference } from "../game-data/files";
import path from "path";
import { isLower, Version } from "../routes/versions";
import { RoomName } from "../game-data/rooms";
import { FURNITURE_ICONS, FURNITURE_SPRITES } from "../game-data/furniture";
import { ICONS, PAPER, PHOTOS, SPRITES } from "../game-data/clothing";
import { MUSIC_IDS } from "../game-data/music";
import { POSTCARD_IDS } from "../game-data/postcard";
import { getNewspaperName } from "../routes/news.txt";
import { CPIP_STATIC_FILES } from "../game-data/cpip-static";
import { AS3_STATIC_FILES } from "../game-data/as3-static";
import { PRE_CPIP_STATIC_FILES } from "../game-data/precpip-static";
import { CPIP_AS3_STATIC_FILES } from "../game-data/cpip-as3-static";
import { CrumbOutput, getCrumbFileName, getGlobalCrumbsOutput, getLocalCrumbsOutput, GLOBAL_CRUMBS_PATH, LOCAL_CRUMBS_PATH, NEWS_CRUMBS_PATH, SCAVENGER_ICON_PATH, TICKET_INFO_PATH } from "./crumbs";
import { UPDATES } from "../updates/updates";
import { PIN_TIMELINE } from "./pins";
import { NEWSPAPER_TIMELINE } from "./newspapers";
import { CrumbIndicator, LocalChanges, RoomChanges } from "../updates";
import { CPIP_UPDATE, MODERN_AS3, START_DATE } from "./dates";

class FileTimelineMap extends TimelineMap<string, string> {
  protected override processKey(identifier: string): string {
    return sanitizePath(identifier);
  }

  protected override processInformation(info: string): string {
    if (isPathAReference(info)) {
      return getMediaFilePath(info);
    } else {
      return info;
    }
  }

  addDefault(route: string, file: string): void {
    this.add(route, file, START_DATE);
  }

  addIdMap(parentDir: string, directory: string, idMap: IdRefMap): void {
    iterateEntries(idMap, (id, file) => {
      this.addDefault(path.join(parentDir, directory, `${id}.swf`), file);
    });
  }
  
  addRouteMap(routeMap: RouteRefMap, date: Version): void {
    iterateEntries(routeMap, (route, file) => {
      this.add(route, file, date);
    });
  }

  pushCrumbChange = (baseRoute: string, route: string, info: FileRef | CrumbIndicator, start: Version, end: Version | undefined = undefined) => {
    const fileRef = typeof info === 'string' ? info : info[0];
    const fullRoute = path.join(baseRoute, route);
    this.add(fullRoute, fileRef, start, end);
  }

  addLocalChanges(changes: LocalChanges, start: Version, end: Version | undefined = undefined) {
    iterateEntries(changes, (route, languages) => {
      iterateEntries(languages, (language, info) => {
        this.pushCrumbChange(path.join('play/v2/content/local', language), route, info, start, end);
      })
    })
  }

  addRoomChanges(roomChanges: RoomChanges, start: Version, end: Version | undefined = undefined) {
    for (const room in roomChanges) {
      const roomName = room as RoomName;
      const fileId = roomChanges[roomName]!;
      addRoomRoute(this, roomName, fileId, start, end);
    }
  }
}

function addRoomRoute(map: FileTimelineMap, room: RoomName, file: string, date: string, end?: string) {
  if (isLower(date, CPIP_UPDATE)) {
    const fileName = `${room}.swf`
    map.add(path.join('artwork/rooms', fileName), file, date, end);
  } else {
    map.add(path.join('play/v2/content/global/rooms', `${room}.swf`), file, date, end);
  }
}

export function getMinifiedDate(date: Version): string {
  return date.replaceAll('-', '');
}

function addFurniture(map: FileTimelineMap): void {
  const furnitureDir = 'play/v2/content/global/furniture';
  map.addIdMap(furnitureDir, 'icons', FURNITURE_ICONS);
  map.addIdMap(furnitureDir, 'sprites', FURNITURE_SPRITES);
}

function addClothing(map: FileTimelineMap): void {
  const clothingDir = 'play/v2/content/global/clothing';
  const preCpipClothingDir = 'artwork';

  map.addIdMap(clothingDir, 'icons', ICONS);
  map.addIdMap(clothingDir, 'paper', PAPER);

  const preCpipPhotos: IdRefMap = {};
  iterateEntries(PHOTOS, (id, file) => {
    preCpipPhotos[Number(id) - 900] = file;
  });

  map.addIdMap(clothingDir, 'photos', PHOTOS);
  map.addIdMap(preCpipClothingDir, 'photos', preCpipPhotos);

  map.addIdMap(clothingDir, 'sprites', SPRITES);
  map.addIdMap(preCpipClothingDir, 'items', SPRITES);
}

function addFilesWithIds(map: FileTimelineMap): void {
  ['play/v2/content/global', ''].forEach((parentDir) => map.addIdMap(parentDir, 'music', MUSIC_IDS));

  map.addIdMap('play/v2/content/local/en', 'postcards', POSTCARD_IDS);
}

function addNewspapers(map: FileTimelineMap): void {
  const configXmlPath = getMediaFilePath('tool:news_config.xml');
  NEWSPAPER_TIMELINE.forEach((update, i) => {
    if (typeof update.info === 'string' || 'file' in update.info) {
      const file = typeof update.info === 'string' ? update.info : update.info.file;
      const issue = i + 1;

      // pre-cpip, before rewrite
      map.addDefault(`artwork/news/news${issue}.swf`, file);
      // pre-cpip, post rewrite
      const route2007 = getNewspaperName(update.date).replace('|', '/') + '.swf';
      map.addDefault(path.join('artwork/news', route2007), file);

      // 2006 boiler room (likely inaccurate, this artwork/archives was probably not a newspaper but a bundle of papers)
      map.addDefault(path.join('artwork/archives', `news${issue + 1}.swf`), file);

      // post-cpip
      const date = getMinifiedDate(update.date);
      map.addDefault(`play/v2/content/local/en/news/${date}/${date}.swf`, file);
    } else {
      const baseNewsPath = 'play/v2/content/local/en/news/';
      const oldNewsPath = `${baseNewsPath}${getMinifiedDate(update.date)}`;
      const newNewsPath = `${baseNewsPath}papers/${getMinifiedDate(update.date)}`;
      map.addDefault(path.join(oldNewsPath, 'config.xml'), configXmlPath);
      map.addDefault(path.join(newNewsPath, 'config.xml'), configXmlPath);
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
        map.addDefault(path.join(oldNewsPath, 'content', route), getMediaFilePath(file));
        map.addDefault(path.join(newNewsPath, 'content', route), getMediaFilePath(file));
      }) 
      }
  });
}

function addTimeSensitiveStaticFiles(map: FileTimelineMap): void {
  map.addRouteMap(CPIP_STATIC_FILES, CPIP_UPDATE);
  map.addRouteMap(AS3_STATIC_FILES, MODERN_AS3);
}

function addStaticFiles(map: FileTimelineMap): void {
  const addStatic = (stat: Record<string, string>) => {
    iterateEntries(stat, (route, fileRef) => {
      map.addDefault(route, fileRef);
    });
  }

  addStatic(PRE_CPIP_STATIC_FILES);
  addStatic(CPIP_AS3_STATIC_FILES);
}

function sanitizePath(path: string): string {
  return path.replaceAll('\\', '/');
}

/** Adds listeners to the global crumbs files */
function addCrumbs(map: FileTimelineMap): void {
  const addCrumb = <T>(crumbPath: string, route: string, output: CrumbOutput<T>) => {
    const { hash, crumbs } = output;
    /** So that different crumb generations don't use the same files, we hash it in the name */
    crumbs.forEach((crumb) => {
      const filePath = path.join(crumbPath, getCrumbFileName(hash, crumb.id));
      map.add(route, filePath, crumb.date);
    });
  }

  addCrumb(GLOBAL_CRUMBS_PATH, 'play/v2/content/global/crumbs/global_crumbs.swf', getGlobalCrumbsOutput());
  addCrumb(LOCAL_CRUMBS_PATH, 'play/v2/content/local/en/crumbs/local_crumbs.swf', getLocalCrumbsOutput());

  NEWSPAPER_TIMELINE.forEach((newspaper) => {
    map.add('play/v2/content/local/en/news/news_crumbs.swf', path.join(NEWS_CRUMBS_PATH, newspaper.date + '.swf'), newspaper.date);
  });
}

function addPins(map: FileTimelineMap): void {
  PIN_TIMELINE.forEach(pin => {
    if ('file' in pin) {
      addRoomRoute(map, pin.room, pin.file, pin.date, pin.end);
    }
  });
}

function addStartscreens(screens: Array<string | [string, string]>, map: FileTimelineMap, date: Version, end?: Version): void {
  screens.forEach((screen, i) => {
    if (typeof screen === 'string') {
      map.add(`play/v2/content/local/en/login/backgrounds/background${i}.swf`, screen, date, end);
      map.add(`play/start/billboards/login/backgrounds/background${i}.swf`, screen, date, end);
    } else {
      map.add(`play/v2/content/local/en/login/backgrounds/${screen[0]}`, screen[1], date, end);
      map.add(`play/start/billboards/login/backgrounds/${screen[0]}`, screen[1], date, end);
    }
  })
}

function addUpdates(map: FileTimelineMap): void {
  UPDATES.forEach(update => {
    if (update.update.map !== undefined) {
      map.add('artwork/maps/island5.swf', update.update.map, update.date, update.end);
      map.add('artwork/maps/16_forest.swf', update.update.map, update.date, update.end);
      map.add('play/v2/content/global/content/map.swf', update.update.map, update.date, update.end);
    }
    if (update.update.clothingCatalog !== undefined) {
      map.add('artwork/catalogue/clothing.swf', update.update.clothingCatalog, update.date, update.end);
      map.add('artwork/catalogue/clothing_.swf', update.update.clothingCatalog, update.date, update.end);
      map.add('play/v2/content/local/en/catalogues/clothing.swf', update.update.clothingCatalog, update.date, update.end);
    }
    if (update.update.postcardCatalog !== undefined) {
      map.add('artwork/catalogue/cards.swf', update.update.postcardCatalog, update.date, update.end);
      map.add('artwork/catalogue/cards_0712.swf', update.update.postcardCatalog, update.date, update.end);
    }
    if (update.update.hairCatalog !== undefined) {
      map.add('play/v2/content/local/en/catalogues/hair.swf', update.update.hairCatalog, update.date, update.end);
    }

    if (update.update.furnitureCatalog !== undefined) {
      map.add('artwork/catalogue/furniture.swf', update.update.furnitureCatalog, update.date, update.end);
      map.add('artwork/catalogue/furniture_.swf', update.update.furnitureCatalog, update.date, update.end);
      map.add('play/v2/content/local/en/catalogues/furniture.swf', update.update.furnitureCatalog, update.date, update.end);
    }
    if (update.update.iglooCatalog !== undefined) {
      map.add('artwork/catalogue/igloo0604.swf', update.update.iglooCatalog, update.date, update.end);
	    map.add('artwork/catalogue/igloo_0712.swf', update.update.iglooCatalog, update.date, update.end);
      map.add('play/v2/content/local/en/catalogues/igloo.swf', update.update.iglooCatalog, update.date, update.end);
    }
    if (update.update.rooms !== undefined) {
      map.addRoomChanges(update.update.rooms, update.date, update.end);
    }
    if (update.update.fileChanges !== undefined) {
      iterateEntries(update.update.fileChanges, (route, fileRef) => {
        map.add(route, fileRef, update.date, update.end);
      })
    }
    if (update.update.startscreens !== undefined) {
      addStartscreens(update.update.startscreens, map, update.date, update.end);
    }
    if (update.update.localChanges !== undefined) {
      map.addLocalChanges(update.update.localChanges, update.date, update.end);
    }
    if (update.update.globalChanges !== undefined) {
      iterateEntries(update.update.globalChanges, (route, info) => {
        map.pushCrumbChange('play/v2/content/global', route, info, update.date, update.end);
      });
    }
    if (update.update.iglooList !== undefined && update.update.iglooList !== true && typeof update.update.iglooList !== 'string') {
      const route = 'play/v2/content/global/content/igloo_music.swf';
      if ('file' in update.update.iglooList) {
        map.add(route, update.update.iglooList.file, update.date);
      } else {
        map.add(route, 'tool:dynamic_igloo_music.swf', update.date);
      }
    }
    if (typeof update.update.migrator === 'string') {
      map.add('play/v2/content/local/en/catalogues/pirate.swf', update.update.migrator, update.date);
    }
    if (update.end !== undefined) {
      if (update.update.scavengerHunt2007 !== undefined) {
        map.add('artwork/eggs/1.swf', update.update.scavengerHunt2007, update.date, update.end);
      }
    }
    if (update.update.scavengerHunt2010 !== undefined) {
      map.add('play/v2/client/dependencies.json', 'tool:dependencies_scavenger_hunt.json', update.date, update.end);
      map.add(path.join('play/v2/content/global', update.update.scavengerHunt2010.iconFilePath ?? SCAVENGER_ICON_PATH), update.update.scavengerHunt2010.iconFileId, update.date, update.end);
    }
    if (update.update.fairCpip !== undefined) {
      if (isLower(update.date, MODERN_AS3)) {
        map.add('play/v2/client/dependencies.json', 'tool:fair_dependencies.json', update.date, update.end);
        map.add('play/v2/client/fair.swf', 'tool:fair_icon_adder.swf', update.date, update.end);
      }
      map.add(`play/v2/content/global/${SCAVENGER_ICON_PATH}`, update.update.fairCpip.iconFileId, update.date, update.end);
      map.add(`play/v2/content/local/en/${TICKET_INFO_PATH}`, update.update.fairCpip.infoFile, update.date, update.end);
    }
    if (update.update.partyIconFile !== undefined) {
      map.add(`play/v2/content/global/${SCAVENGER_ICON_PATH}`, update.update.partyIconFile, update.date, update.end);
    }
    if (update.update.scavengerHunt2011 !== undefined) {
      map.add(path.join('play/v2/content/global', SCAVENGER_ICON_PATH), update.update.scavengerHunt2011.icon, update.date, update.end);
    }
    if (update.update.mapNote !== undefined) {
      map.add('play/v2/content/local/en/close_ups/party_map_note.swf', update.update.mapNote, update.date, update.end);
    }
    if (update.update.stagePlay !== undefined) {
      if (update.update.stagePlay.costumeTrunk !== null) {

        // simply hardcoding every catalogue to be from 0712 for now
        map.add('artwork/catalogue/costume_0712.swf', update.update.stagePlay.costumeTrunk, update.date);
        map.add('play/v2/content/local/en/catalogues/costume.swf', update.update.stagePlay.costumeTrunk, update.date);
      }
    }
    if (update.update.pinRoomUpdate !== undefined) {
      const pin = PIN_TIMELINE[findEarliestDateHitIndex(update.date, PIN_TIMELINE)];
      if ('room' in pin && pin.room !== undefined) {
        addRoomRoute(map, pin.room, update.update.pinRoomUpdate, update.date, pin.end);
      } else {
        throw Error('Pin doesn\'t declare room, but is trying to change its SWF');
      }
    }
    if (update.update.sportCatalog !== undefined) {
      map.add('play/v2/content/local/en/catalogues/sport.swf', update.update.sportCatalog, update.date);
    }
  });
}

/** Get the object which knows all the file information needed to find the file for a given route */
export function getRoutesTimeline() {
  const timelines = new FileTimelineMap();

  const timelineProcessors = [
    // pins are specifically before party so that pins that update with a party don't override the party room
    addPins,
    addUpdates,
    addFilesWithIds,
    addCrumbs,
    addClothing,
    addTimeSensitiveStaticFiles,
    addFurniture,
    addStaticFiles,
    addNewspapers
  ];

  timelineProcessors.forEach((fn) => fn(timelines));
  
  const fileServer = timelines.getVersionsMap();

  return fileServer;
}