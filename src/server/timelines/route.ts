import { iterateEntries } from "../../common/utils";
import { IdRefMap, RouteRefMap, ComplexTemporaryUpdateTimeline, TimelineMap } from "../game-data";
import { FileRef, getMediaFilePath, isPathAReference } from "../game-data/files";
import { Update } from "../game-data/updates";
import path from "path";
import { isGreaterOrEqual, isLower, Version } from "../routes/versions";
import { getSubUpdateDates } from ".";
import { PARTIES, IslandChanges, RoomChanges, CrumbIndicator, LocalChanges } from "../game-data/parties";
import { RoomName, ROOMS } from "../game-data/rooms";
import { FURNITURE_ICONS, FURNITURE_SPRITES } from "../game-data/furniture";
import { ICONS, PAPER, PHOTOS, SPRITES } from "../game-data/clothing";
import { MUSIC_IDS } from "../game-data/music";
import { POSTCARD_IDS } from "../game-data/postcard";
import { getNewspaperName } from "../routes/news.txt";
import { CPIP_STATIC_FILES } from "../game-data/cpip-static";
import { AS3_STATIC_FILES } from "../game-data/as3-static";
import { PRE_CPIP_STATIC_FILES } from "../game-data/precpip-static";
import { CPIP_AS3_STATIC_FILES } from "../game-data/cpip-as3-static";
import { ORIGINAL_ROOMS } from "../game-data/release-features";
import { ROOM_OPENINGS, ROOM_UPDATES, TEMPORARY_ROOM_UPDATES } from "../game-data/room-updates";
import { CrumbOutput, getCrumbFileName, getGlobalCrumbsOutput, getLocalCrumbsOutput, GLOBAL_CRUMBS_PATH, LOCAL_CRUMBS_PATH, NEWS_CRUMBS_PATH, SCAVENGER_ICON_PATH, TICKET_INFO_PATH } from "./crumbs";
import { STADIUM_UPDATES } from "../game-data/stadium-updates";
import { STANDALONE_TEMPORARY_CHANGE } from "../game-data/standalone-changes";
import { STAGE_TIMELINE } from "../game-data/stage-plays";
import { UPDATES } from "../updates/updates";
import { PIN_TIMELINE } from "./pins";
import { NEWSPAPER_TIMELINE } from "./newspapers";

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
    this.add(route, file, Update.BETA_RELEASE);
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


  addGameMapUpdate (fileRef: string, date: Version, end: Version | undefined = undefined): void {
    if (isLower(date, Update.CPIP_UPDATE)) {
      this.add('artwork/maps/island5.swf', fileRef, date, end);
      // TODO would be best to only include the maps that end up factually being used
      this.add('artwork/maps/16_forest.swf', fileRef, date, end);
    } else {
      this.add('play/v2/content/global/content/map.swf', fileRef, date, end);
    }
  }

  addComplexTemporaryUpdateTimeline<UpdateInfo>(
    timeline: ComplexTemporaryUpdateTimeline<UpdateInfo>,
    applyUpdate: (map: FileTimelineMap, update: UpdateInfo, start: Version, end: Version | undefined) => void
  ) {
    timeline.forEach((tempUpdate) => {
      applyUpdate(this, tempUpdate, tempUpdate.date, tempUpdate.end);
      if (tempUpdate.updates !== undefined) {
        for (let i = 0; i < tempUpdate.updates.length; i++) {
          const { date, end } = getSubUpdateDates(tempUpdate, i);
          applyUpdate(this, tempUpdate.updates[i], date, end);
        }
      }
      if (tempUpdate.permanentChanges !== undefined) {
        applyUpdate(this, tempUpdate.permanentChanges, tempUpdate.date, undefined);
      }
      if (tempUpdate.consequences !== undefined) {
        applyUpdate(this, tempUpdate.consequences, tempUpdate.end, undefined);
      }
    })
  }

  pushCrumbChange = (baseRoute: string, route: string, info: FileRef | CrumbIndicator, start: Version, end: Version | undefined = undefined) => {
    const fileRef = typeof info === 'string' ? info : info[0];
    const fullRoute = path.join(baseRoute, route);
    if (end === undefined) {
      this.add(fullRoute, fileRef, start);
    } else {
      this.add(fullRoute, fileRef, start, end);
    }
  }

  addLocalChanges(changes: LocalChanges, start: Version, end: Version | undefined = undefined) {
    iterateEntries(changes, (route, languages) => {
      iterateEntries(languages, (language, info) => {
        this.pushCrumbChange(path.join('play/v2/content/local', language), route, info, start, end);
      })
    })
  }

  addPartyChanges(changes: IslandChanges, start: Version, end: Version | undefined = undefined) {

    if (changes.roomChanges !== undefined) {
      this.addRoomChanges(changes.roomChanges, start, end);
    }
    if (changes.localChanges !== undefined) {
      this.addLocalChanges(changes.localChanges, start, end);
    }
    if (changes.construction?.localChanges !== undefined) {
      this.addLocalChanges(changes.construction.localChanges, changes.construction.date, start);
    }
    if (changes.globalChanges !== undefined) {
      iterateEntries(changes.globalChanges, (route, info) => {
        this.pushCrumbChange('play/v2/content/global', route, info, start, end);
      });
    }

    // adding just any route change in general for the party
    if (changes.generalChanges !== undefined) {
      iterateEntries(changes.generalChanges, (route, fileRef) => {
        if (end === undefined) {
          this.add(route, fileRef, start);
        } else {
          this.add(route, fileRef, start, end);
        }
      })
    }

    if (changes.map !== undefined) {
      this.addGameMapUpdate(changes.map, start, end);
    }

    if (changes.scavengerHunt2010 !== undefined) {
      this.add('play/v2/client/dependencies.json', 'tool:dependencies_scavenger_hunt.json', start, end);
      this.add(path.join('play/v2/content/global', changes.scavengerHunt2010.iconFilePath ?? SCAVENGER_ICON_PATH), changes.scavengerHunt2010.iconFileId, start, end);
    }
    if (changes.scavengerHunt2011 !== undefined) {
      this.add(path.join('play/v2/content/global', SCAVENGER_ICON_PATH), changes.scavengerHunt2011.icon, start, end);
    }

    if (changes.fairCpip !== undefined) {
      if (isLower(start, Update.MODERN_AS3)) {
        this.add('play/v2/client/dependencies.json', 'tool:fair_dependencies.json', start, end);
        this.add('play/v2/client/fair.swf', 'tool:fair_icon_adder.swf', start, end);
      }
      this.add(`play/v2/content/global/${SCAVENGER_ICON_PATH}`, changes.fairCpip.iconFileId, start, end);
      this.add(`play/v2/content/local/en/${TICKET_INFO_PATH}`, changes.fairCpip.infoFile, start, end);
    }
    if (changes.scavengerHunt2007 !== undefined && typeof changes.scavengerHunt2007 === 'string') {
      // theoretically you would have static egg files and signal the number
      // but in practice for eggs where the number isn't known, we use 1 and thus
      // we manage multiple egg files of ID 1
      this.add('artwork/eggs/1.swf', changes.scavengerHunt2007, start, end);
    }

    if (changes.startscreens !== undefined) {
      addStartscreens(changes.startscreens, this, start, end);
    }

    if (changes.mapNote !== undefined) {
      this.add('play/v2/content/local/en/close_ups/party_map_note.swf', changes.mapNote, start, end);
    }
  }

  addRoomChanges(roomChanges: RoomChanges, start: Version, end: Version | undefined = undefined) {
    for (const room in roomChanges) {
      const roomName = room as RoomName;
      const fileId = roomChanges[roomName]!;
      if (end === undefined) {
        addRoomRoute(this, start, roomName, fileId);
      } else {
        addTempRoomRoute(this, start, end, roomName, fileId);
      }
    }
  }
}

function addRoomRoute(map: FileTimelineMap, date: string, room: RoomName, file: string) {
  if (isLower(date, Update.CPIP_UPDATE)) {
    const fileName = `${room}.swf`
    map.add(path.join('artwork/rooms', fileName), file, date);
  } else {
    map.add(path.join('play/v2/content/global/rooms', `${room}.swf`), file, date);
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
  map.addRouteMap(CPIP_STATIC_FILES, Update.CPIP_UPDATE);
  map.addRouteMap(AS3_STATIC_FILES, Update.MODERN_AS3);
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

/** Maps for each route its file timeline */
// type TimelineMap = Map<string, FileTimeline>;

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

function addStadiumUpdates(map: FileTimelineMap): void {
  STADIUM_UPDATES.forEach((update) => {
    const date = update.date;
  if (isGreaterOrEqual(date, Update.CPIP_UPDATE) && isLower(date, Update.EPF_RELEASE)) {
    const agent = 'play/v2/content/global/rooms/agent.swf';
    if (update.type === 'rink') {
      map.add(agent, 'archives:RoomsAgent.swf', date);
    } else if (update.type === 'stadium') {
      map.add(agent, 'archives:RoomsAgentFootball.swf', date);
    }
  }
  if (update.mapFileId !== undefined) {
    map.add('play/v2/content/global/content/map.swf', update.mapFileId, date);
  }
    map.add('play/v2/content/global/rooms/town.swf', update.townFileId, date);
    map.add('play/v2/content/global/rooms/forts.swf', update.fortsFileId, date);
    map.add('play/v2/content/global/rooms/rink.swf', update.rinkFileId, date);
    if (update.catalogFileId !== undefined) {
      map.add('play/v2/content/local/en/catalogues/sport.swf', update.catalogFileId, date);
    }
  });
}

function addStandaloneChanges(map: FileTimelineMap): void {
  Object.entries(STANDALONE_TEMPORARY_CHANGE).forEach((pair) => {
    const [route, updates] = pair;
    updates.forEach((update) => {
      map.add(route, update.fileRef, update.startDate, update.endDate);
      if (update.updates !== undefined) {
        update.updates.forEach((newUpdate) => {
          map.add(route, newUpdate.fileRef, newUpdate.date, update.endDate);
        })
      }
    })
  });
}

function addMapUpdates(map: FileTimelineMap): void {
  UPDATES.forEach((update) => {
    if (update.update.map !== undefined) {
      map.addGameMapUpdate(update.update.map, update.date, update.end);
    }
  })
}

function addCatalogues(map: FileTimelineMap): void {
  const addRockhoperCatalog = (date: string, file: FileRef) => {
    map.add('play/v2/content/local/en/catalogues/pirate.swf', file, date);
  }

  PARTIES.forEach(party => {
    if (typeof party.activeMigrator === 'string') {
      addRockhoperCatalog(party.date, party.activeMigrator);
    }
  })
}

function addPins(map: FileTimelineMap): void {
  PIN_TIMELINE.forEach(pin => {
    if ('room' in pin) {
      addTempRoomRoute(map, pin.date, pin.end, pin.room, pin.file);
    }
  });
}

function addStagePlays(map: FileTimelineMap): void {
  STAGE_TIMELINE.forEach((debut, i) => {
    const date = debut.date;
    const end = i === STAGE_TIMELINE.length - 1 ? undefined : STAGE_TIMELINE[i + 1].date;

    if (debut.stageFileRef !== null) {
      // Stage itself
      addRoomRoute(map, date, 'stage', debut.stageFileRef);
    }

    if (debut.plazaFileRef !== null) {
      // Plaza
      addRoomRoute(map, date, 'plaza', debut.plazaFileRef);
    }

    // temporary changes in other rooms
    if (debut.roomChanges !== undefined) {
      map.addRoomChanges(debut.roomChanges, date, end);
    }

    if (debut.costumeTrunkFileRef !== null) {
      // simply hardcoding every catalogue to be from 0712 for now
      map.add('artwork/catalogue/costume_0712.swf', debut.costumeTrunkFileRef, date);
      // TODO only add costrume trunks to each specific engine
      map.add('play/v2/content/local/en/catalogues/costume.swf', debut.costumeTrunkFileRef, date);
    }
  })
}

function addTempRoomRoute(map: FileTimelineMap, start: string, end: string, room: RoomName, file: string) {
  if (isLower(start, Update.CPIP_UPDATE)) {
    const fileName = `${room}.swf`
    map.add(path.join('artwork/rooms', fileName), file, start, end);
  } else {
    map.add(path.join('play/v2/content/global/rooms', `${room}.swf`), file, start, end);
  }
}

function addRoomInfo(map: FileTimelineMap): void {
  for (const roomName in ROOMS) {
    const originalRoomFile = ORIGINAL_ROOMS[roomName as RoomName];
    if (originalRoomFile !== undefined) {
      addRoomRoute(map, Update.BETA_RELEASE, roomName as RoomName, originalRoomFile);
    }
  }

  const addRoomChange = (room: RoomName, date: string, fileRef: string) => {
    addRoomRoute(map, date, room, fileRef);
  }

  ROOM_OPENINGS.forEach((opening) => {
    if (opening.fileRef !== null) {
      addRoomChange(opening.room, opening.date, opening.fileRef);
    }
    if (opening.otherRooms !== undefined) {
      Object.entries(opening.otherRooms).forEach((pair) => {
        const [room, fileRef] = pair;
        addRoomChange(room as RoomName, opening.date, fileRef);
      });
    }
    if (opening.map !== undefined) {
      map.addGameMapUpdate(opening.map, opening.date);
    }
  })

  Object.entries(ROOM_UPDATES).forEach((pair) => {
    const [room, updates] = pair;
    updates.forEach((update) => {
      addRoomChange(room as RoomName, update.date, update.fileRef);
    })
  })

  Object.entries(TEMPORARY_ROOM_UPDATES).forEach((pair) => {
    const [room, updates] = pair;
    const roomName = room as RoomName;
    updates.forEach((update) => {
      addTempRoomRoute(map, update.date, update.end, roomName, update.fileRef);
    })
  })
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
    if (update.update.clothingCatalog !== undefined) {
      map.add('artwork/catalogue/clothing.swf', update.update.clothingCatalog, update.date, update.end);
      map.add('artwork/catalogue/clothing_.swf', update.update.clothingCatalog, update.date, update.end);
      map.add('play/v2/content/local/en/catalogues/clothing.swf', update.update.clothingCatalog, update.date, update.end);
    }
    if (update.update.furnitureCatalog !== undefined) {
      map.add('artwork/catalogue/furniture.swf', update.update.furnitureCatalog, update.date, update.end);
      map.add('play/v2/content/local/en/catalogues/furniture.swf', update.update.furnitureCatalog, update.date, update.end);
    }
    if (update.update.iglooCatalog !== undefined) {
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
    if (update.update.iglooList !== undefined && update.update.iglooList !== true) {
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
  });
}

function addParties(map: FileTimelineMap): void {
  map.addComplexTemporaryUpdateTimeline(PARTIES, (map, party, start, end) => {
    map.addPartyChanges(party, start, end);
    if (party.construction !== undefined) {
      const constructionStart = party.construction.date;
      map.addRoomChanges(party.construction.changes, constructionStart, start);
  
      if (party.construction.updates !== undefined) {
        party.construction.updates.forEach((update) => {
          map.addRoomChanges(update.changes, update.date, start);
        })
      }

      if (party.construction.startscreens !== undefined) {
        addStartscreens(party.construction.startscreens, map, constructionStart, start);
      }
    }
  });
}

/** Get the object which knows all the file information needed to find the file for a given route */
export function getRoutesTimeline() {
  const timelines = new FileTimelineMap();

  const timelineProcessors = [
    addRoomInfo,
    addStandaloneChanges,
    addMapUpdates,
    // pins are specifically before party so that pins that update with a party don't override the party room
    addPins,
    addUpdates,
    addParties,
    addFilesWithIds,
    addCatalogues,
    addStagePlays,
    addStadiumUpdates,
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