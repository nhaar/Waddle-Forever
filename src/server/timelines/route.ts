import { iterateEntries } from "../../common/utils";
import { DateRefMap, IdRefMap, RouteRefMap, ComplexTemporaryUpdateTimeline, TimelineMap } from "../game-data";
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
import { AS2_NEWSPAPERS, AS3_NEWSPAPERS, PRE_BOILER_ROOM_PAPERS } from "../game-data/newspapers";
import { getNewspaperName } from "../routes/news.txt";
import { CPIP_STATIC_FILES } from "../game-data/cpip-static";
import { AS3_STATIC_FILES } from "../game-data/as3-static";
import { PRE_CPIP_STATIC_FILES } from "../game-data/precpip-static";
import { CPIP_AS3_STATIC_FILES } from "../game-data/cpip-as3-static";
import { ORIGINAL_ROOMS } from "../game-data/release-features";
import { ROOM_OPENINGS, ROOM_UPDATES, TEMPORARY_ROOM_UPDATES } from "../game-data/room-updates";
import { CrumbOutput, getCrumbFileName, getGlobalCrumbsOutput, getLocalCrumbsOutput, GLOBAL_CRUMBS_PATH, LOCAL_CRUMBS_PATH, NEWS_CRUMBS_PATH, SCAVENGER_ICON_PATH, TICKET_INFO_PATH } from "./crumbs";
import { STADIUM_UPDATES } from "../game-data/stadium-updates";
import { STANDALONE_CHANGE, STANDALONE_TEMPORARY_CHANGE, STANDALONE_TEMPORARY_UPDATES, STANDALONE_UPDATES } from "../game-data/standalone-changes";
import { MAP_UPDATES } from "../game-data/game-map";
import { CPIP_CATALOGS, FURNITURE_CATALOGS, IGLOO_CATALOGS, PRE_CPIP_CATALOGS } from "../game-data/catalogues";
import { STANDALONE_MIGRATOR_VISITS } from "../game-data/migrator-visits";
import { PINS } from "../game-data/pins";
import { IGLOO_LISTS } from "../game-data/igloo-lists";
import { STAGE_TIMELINE } from "../game-data/stage-plays";
import { PRE_CPIP_GAME_UPDATES } from "../game-data/games";
import { getFileDateSignature } from "./clothing";

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

  addDateRefMap(route: string, dateMap: DateRefMap): void {
    iterateEntries(dateMap, (date, fileRef) => {
      this.add(route, fileRef, date);
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
  AS2_NEWSPAPERS.forEach((news, index) => {
    if (news.fileReference !== undefined) {
      const issueNumber = index + PRE_BOILER_ROOM_PAPERS.length + 1;
      // pre-cpip, before rewrite
      map.addDefault(`artwork/news/news${issueNumber}.swf`, news.fileReference);
      // pre-cpip, post rewrite
      const route2007 = getNewspaperName(news.date).replace('|', '/') + '.swf';
      map.addDefault(path.join('artwork/news', route2007), news.fileReference);

      // 2006 boiler room (likely inaccurate, this artwork/archives was probably not a newspaper but a bundle of papers)
      map.addDefault(path.join('artwork/archives', `news${issueNumber + 1}.swf`), news.fileReference);

      // post-cpip
      const date = getMinifiedDate(news.date);
      map.addDefault(`play/v2/content/local/en/news/${date}/${date}.swf`, news.fileReference);
    }
  })
  
  const configXmlPath = getMediaFilePath('tool:news_config.xml');
  AS3_NEWSPAPERS.forEach((news) => {
    const newsPath = `play/v2/content/local/en/news/${getMinifiedDate(news.date)}`;
    map.addDefault(path.join(newsPath, 'config.xml'), configXmlPath);
    const newspaperComponenets: Array<[string, string]> = [
      ['front/header.swf', news.headerFront],
      ['front/featureStory.swf', news.featureStory],
      ['front/supportStory.swf', news.supportStory],
      ['front/upcomingEvents.swf', news.upcomingEvents],
      ['front/newsFlash.swf', news.newsFlash],
      ['front/askAuntArctic.swf', news.askFront],
      ['front/dividers.swf', news.dividersFront ?? 'archives:News268DividersFront.swf'],
      ['front/navigation.swf', news.navigationFront ?? 'archives:News268NavigationFront.swf'],
      ['back/header.swf', news.headerBack],
      ['back/askAuntArctic.swf', news.askBack],
      ['back/secrets.swf', news.secrets],
      ['back/submitYourContent.swf', news.submit ?? 'archives:News268SubmitYourContent.swf'],
      ['back/jokesAndRiddles.swf', news.jokes],
      ['back/dividers.swf', news.dividersBack ?? 'archives:News268DividersBack.swf'],
      ['back/navigation.swf', news.navigationBack ?? 'archives:News268NavigationBack.swf'],
      ['overlays/riddlesAnswers.swf', news.answers],
    ]
    if (news.extraJokes !== undefined) {
      newspaperComponenets.push(['overlays/extraJokes.swf', news.extraJokes]);
    }
    if (news.secret !== undefined) {
      newspaperComponenets.push(['overlays/secret.swf', news.secret]);
    }
    if (news.iglooWinners !== undefined) {
      newspaperComponenets.push(['overlays/iglooWinners.swf', news.iglooWinners]);
    }
    if (news.featureMore !== undefined) {
      newspaperComponenets.push(['overlays/featureMore.swf', news.featureMore]);
    }
    if (news.extra !== undefined) {
      newspaperComponenets.push(['overlays/extra.swf', news.extra]);
    }
     
    newspaperComponenets.forEach((pair) => {
      const [route, file] = pair;
      map.addDefault(path.join(newsPath, 'content', route), getMediaFilePath(file));
    }) 
  })
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

  // remove first 6 which have no crumbs
  [...AS2_NEWSPAPERS.slice(6), ...AS3_NEWSPAPERS].forEach((newspaper) => {
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
  Object.entries(STANDALONE_CHANGE).forEach((pair) => {
    const [route, updates] = pair;
    updates.forEach((update) => {
      map.add(route, update.fileRef, update.date);
    })
  });

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

  STANDALONE_UPDATES.forEach((update) => {
    map.addPartyChanges(update, update.date);
  });

  map.addComplexTemporaryUpdateTimeline(STANDALONE_TEMPORARY_UPDATES, (map, update, start, end) => {
    map.addPartyChanges(update, start, end);
  });
}

function addMapUpdates(map: FileTimelineMap): void {
  MAP_UPDATES.forEach((update) => {
    map.addGameMapUpdate(update.fileRef, update.date);
  });
}

function addCatalogues(map: FileTimelineMap): void {
  iterateEntries(PRE_CPIP_CATALOGS, (date, file) => {
    const signature = getFileDateSignature(date);
    map.add(`artwork/catalogue/clothing_${signature}.swf`, file, date);
    map.add(`artwork/catalogue/clothing${signature}.swf`, file, date);
  });

  map.addDateRefMap('play/v2/content/local/en/catalogues/clothing.swf', CPIP_CATALOGS);
  map.addDateRefMap('artwork/catalogue/furniture.swf', FURNITURE_CATALOGS);
  map.addDateRefMap('play/v2/content/local/en/catalogues/furniture.swf', FURNITURE_CATALOGS);
  map.addDateRefMap('play/v2/content/local/en/catalogues/igloo.swf', IGLOO_CATALOGS);


  const addRockhoperCatalog = (date: string, file: FileRef) => {
    map.add('play/v2/content/local/en/catalogues/pirate.swf', file, date);
  }

  STANDALONE_MIGRATOR_VISITS.forEach((visit) => {
    if (typeof visit.info === 'string') {
      addRockhoperCatalog(visit.date, visit.info);
    }
  });

  PARTIES.forEach(party => {
    if (typeof party.activeMigrator === 'string') {
      addRockhoperCatalog(party.date, party.activeMigrator);
    }
  })
}

function addPins(map: FileTimelineMap): void {
  PINS.forEach((pin) => {
    if ('room' in pin && pin.fileRef !== undefined) {
      addTempRoomRoute(map, pin.date, pin.end, pin.room, pin.fileRef);
    }
  });
}

function addMusicLists(map: FileTimelineMap): void {
  const route = 'play/v2/content/global/content/igloo_music.swf';
  map.addDefault(route, 'tool:dynamic_igloo_music.swf');
  for (let i = 0; i < IGLOO_LISTS.length; i++) {
    // using archived igloo lists as temporary updates on top of a single permanent one
    const cur = IGLOO_LISTS[i];
    if (typeof cur.fileRef === 'string') {
      const start = cur.date;
      if (i === IGLOO_LISTS.length) {
        map.add(route, cur.fileRef, start);
      } else {
        map.add(route, cur.fileRef, start, IGLOO_LISTS[i + 1].date);
      }
    }
  }
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

function addGames(map: FileTimelineMap): void {
  Object.values(PRE_CPIP_GAME_UPDATES).forEach((updates) => {
    const [release] = updates;
    const fileRoute = path.join('games', release.directory);

    map.addDefault(fileRoute, release.fileRef);
    if (release.roomChanges !== undefined && release.date !== undefined) {
      map.addRoomChanges(release.roomChanges, release.date);
    }
    if (release['2006'] !== undefined) {
      map.addDefault(path.join('games', release['2006']), release.fileRef);
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
    addParties,
    addFilesWithIds,
    addCatalogues,
    addStagePlays,
    addMusicLists,
    addStadiumUpdates,
    addCrumbs,
    addClothing,
    addTimeSensitiveStaticFiles,
    addFurniture,
    addGames,
    addStaticFiles,
    addNewspapers
  ];

  timelineProcessors.forEach((fn) => fn(timelines));
  
  const fileServer = timelines.getVersionsMap();

  return fileServer;
}