import path from "path";
import crypto from 'crypto';
import hash from 'object-hash';

import { PRE_CPIP_STATIC_FILES } from "../game-data/precpip-static";
import { isGreater, isGreaterOrEqual, isLower, processVersion, Version } from "./versions";
import { FileRef, getMediaFilePath, isPathAReference } from "../game-data/files";
import { RoomMap, RoomName, ROOMS } from "../game-data/rooms";
import { ORIGINAL_MAP, ORIGINAL_ROOMS } from "../game-data/release-features";
import { STANDALONE_CHANGE, STANDALONE_TEMPORARY_CHANGE, STANDALONE_UPDATES } from "../game-data/standalone-changes";
import { ROOM_MUSIC_TIMELINE, ROOM_OPENINGS, ROOM_UPDATES, TEMPORARY_ROOM_UPDATES } from "../game-data/room-updates";
import { MAP_PATH_07, MAP_UPDATES, PRECPIP_MAP_PATH } from "../game-data/game-map";
import { CrumbIndicator, PARTIES, PartyChanges, RoomChanges } from "../game-data/parties";
import { MUSIC_IDS } from "../game-data/music";
import { CPIP_STATIC_FILES } from "../game-data/cpip-static";
import { CPIP_CATALOGS, FURNITURE_CATALOGS, IGLOO_CATALOGS, PRE_CPIP_CATALOGS } from "../game-data/catalogues";
import { STAGE_PLAYS, STAGE_TIMELINE } from "../game-data/stage-plays";
import { IGLOO_LISTS } from "../game-data/igloo-lists";
import { BETA_RELEASE, CAVE_OPENING_START, CPIP_UPDATE, EPF_RELEASE, MODERN_AS3, PRE_CPIP_REWRITE_DATE } from "../game-data/updates";
import { STADIUM_UPDATES } from "../game-data/stadium-updates";
import { As2Newspaper, AS2_NEWSPAPERS, PRE_BOILER_ROOM_PAPERS, AS3_NEWSPAPERS } from "../game-data/newspapers";
import { CPIP_AS3_STATIC_FILES } from "../game-data/cpip-as3-static";
import { getNewspaperName } from "./news.txt";
import { PINS } from "../game-data/pins";
import { DateRefMap, findInVersion, VersionsMap, IdRefMap, processTimeline, RouteRefMap, TemporaryUpdateTimeline, TimelineEvent, TimelineMap, VersionsTimeline } from "../game-data/changes";
import { MIGRATOR_PERIODS } from "../game-data/migrator";
import { PRE_CPIP_GAME_UPDATES } from "../game-data/games";
import { ITEMS } from "../game-logic/items";
import { ICONS, PAPER, PHOTOS, SPRITES } from "../game-data/clothing";
import { AS3_STATIC_FILES } from "../game-data/as3-static";
import { FURNITURE_ICONS, FURNITURE_SPRITES } from "../game-data/furniture";
import { iterateEntries } from "../../common/utils";

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
    this.addPerm(route, BETA_RELEASE, file);
  }

  addIdMap(parentDir: string, directory: string, idMap: IdRefMap): void {
    iterateEntries(idMap, (id, file) => {
      this.addPerm(path.join(parentDir, directory, `${id}.swf`), BETA_RELEASE, file);
    });
  }
  
  addRouteMap(routeMap: RouteRefMap, date: Version): void {
    iterateEntries(routeMap, (route, file) => {
      this.addPerm(route, date, file);
    });
  }

  addDateRefMap(route: string, dateMap: DateRefMap): void {
    iterateEntries(dateMap, (date, fileRef) => {
      this.addPerm(route, date, fileRef);
    });
  }

  addGameMapUpdate (fileRef: string, date: Version, end: Version | undefined = undefined): void {

    const info = end === undefined ? { date, info: fileRef } : { date, end, info: fileRef };
    if (isLower(date, CPIP_UPDATE)) {
      this.add(PRECPIP_MAP_PATH, info);
      // TODO would be best to only include the maps that end up factually being used
      this.add(MAP_PATH_07, info);
    } else {
      this.add('play/v2/content/global/content/map.swf', info);
    }
  }

  addTemporaryUpdateTimeline<UpdateInfo, SubUpdateInfo>(
    timeline: TemporaryUpdateTimeline<UpdateInfo, SubUpdateInfo>,
    applyUpdate: (map: FileTimelineMap, update: UpdateInfo, start: Version, end: Version) => void,
    applySubUpdate: (map: FileTimelineMap, update: SubUpdateInfo, start: Version, end: Version | undefined) => void
  ) {
    timeline.forEach((tempUpdate) => {
      applyUpdate(this, tempUpdate, tempUpdate.date, tempUpdate.end);
      if (tempUpdate.updates !== undefined) {
        for (let i = 0; i < tempUpdate.updates.length; i++) {
          const subUpdate = tempUpdate.updates[i];
          const next = tempUpdate.updates[i + 1];
          let end = tempUpdate.end;
          if (next !== undefined && next.date !== undefined) {
            end = next.date;
          }
          applySubUpdate(this, subUpdate, subUpdate.date ?? tempUpdate.date, end);
        }
      }
      if (tempUpdate.permanentChanges !== undefined) {
        applySubUpdate(this, tempUpdate.permanentChanges, tempUpdate.date, undefined);
      }
      if (tempUpdate.consequences !== undefined) {
        applySubUpdate(this, tempUpdate.consequences, tempUpdate.end, undefined);
      }
    })
  }

  addPartyChanges(changes: PartyChanges, start: Version, end: Version | undefined = undefined) {
    const pushCrumbChange = (baseRoute: string, route: string, info: FileRef | CrumbIndicator) => {
      const fileRef = typeof info === 'string' ? info : info[0];
      const fullRoute = path.join(baseRoute, route);
      if (end === undefined) {
        this.addPerm(fullRoute, start, fileRef);
      } else {
        this.addTemp(fullRoute, start, end, fileRef);
      }
    }

    if (changes.roomChanges !== undefined) {
      this.addRoomChanges(changes.roomChanges, start, end);
    }
    if (changes.localChanges !== undefined) {
      iterateEntries(changes.localChanges, (route, languages) => {
        iterateEntries(languages, (language, info) => {
          pushCrumbChange(path.join('play/v2/content/local', language), route, info);
        })
      })
    }
    if (changes.globalChanges !== undefined) {
      iterateEntries(changes.globalChanges, (route, info) => {
        pushCrumbChange('play/v2/content/global', route, info);
      });
    }

    // adding just any route change in general for the party
    if (changes.generalChanges !== undefined) {
      iterateEntries(changes.generalChanges, (route, fileRef) => {
        if (end === undefined) {
          this.addPerm(route, start, fileRef);
        } else {
          this.addTemp(route, start, end, fileRef);
        }
      })
    }

    if (changes.map !== undefined) {
      this.addGameMapUpdate(changes.map, start, end);
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

function addMusicFiles(map: FileTimelineMap): void {
  ['play/v2/content/global', ''].forEach((parentDir) => map.addIdMap(parentDir, 'music', MUSIC_IDS));
}

function isNewspaperBeforeCPIP(newspaper: As2Newspaper): boolean {
  return isLower(newspaper.date, CPIP_UPDATE);
}

/** Check if a newspaper is accessible after CPIP, the argument is the newspaper after it or undefined if it's the "last" newspaper */
export function isNewspaperAfterCPIP(nextNewspaper: As2Newspaper | undefined) {
  return nextNewspaper === undefined || isGreaterOrEqual(nextNewspaper.date, CPIP_UPDATE);
}

export function getMinifiedDate(date: Version): string {
  return date.replaceAll('-', '');
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
    
    newspaperComponenets.forEach((pair) => {
      const [route, file] = pair;
      map.addDefault(path.join(newsPath, 'content', route), getMediaFilePath(file));
    }) 
  })
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

/** Maps for each route its file timeline */
// type TimelineMap = Map<string, FileTimeline>;

function sanitizePath(path: string): string {
  return path.replaceAll('\\', '/');
}

function addRoomRoute(map: FileTimelineMap, date: string, room: RoomName, file: string) {
  if (isLower(date, CPIP_UPDATE)) {
    const fileName = `${room}.swf`
    map.addPerm(path.join('artwork/rooms', fileName), date, file);
  } else {
    map.addPerm(path.join('play/v2/content/global/rooms', `${room}.swf`), date, file);
  }
}

const SCAVENGER_ICON_PATH = 'scavenger_hunt/scavenger_hunt_icon.swf';
const TICKET_ICON_PATH = 'tickets.swf';
const TICKET_INFO_PATH = 'ticket_info.swf';

function addTempRoomRoute(map: FileTimelineMap, start: string, end: string, room: RoomName, file: string) {
  if (isLower(start, CPIP_UPDATE)) {
    const fileName = `${room}.swf`
    map.addTemp(path.join('artwork/rooms', fileName), start, end, file);
  } else {
    map.addTemp(path.join('play/v2/content/global/rooms', `${room}.swf`), start, end, file);
  }
}

function addRoomInfo(map: FileTimelineMap): void {
  for (const roomName in ROOMS) {
    const originalRoomFile = ORIGINAL_ROOMS[roomName as RoomName];
    if (originalRoomFile !== undefined) {
      addRoomRoute(map, BETA_RELEASE, roomName as RoomName, originalRoomFile);
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

function addParties(map: FileTimelineMap): void {
  map.addTemporaryUpdateTimeline(PARTIES, (map, party, start, end) => {
    map.addPartyChanges(party, start, end);
    if (party.construction !== undefined) {
      const constructionStart = party.construction.date;
      map.addRoomChanges(party.construction.changes, constructionStart, start);
  
      if (party.construction.updates !== undefined) {
        party.construction.updates.forEach((update) => {
          map.addRoomChanges(update.changes, update.date, start);
        })
      }
    }

    if (party.scavengerHunt2010 !== undefined) {
      // enabling the scavenger hunt dependency file
      map.addTemp('play/v2/client/dependencies.json', start, end, 'tool:dependencies_scavenger_hunt.json');

      // serving the icon that will be loaded by the dependency
      const huntIconPath = party.scavengerHunt2010.iconFilePath ?? SCAVENGER_ICON_PATH;
      map.addTemp(path.join('play/v2/content/global', huntIconPath), start, end, party.scavengerHunt2010.iconFileId);
    }

    // all CPIP fair parties have the same dependency for loading the fair icon
    // this is possible to change if we can recreate the exact method it used
    if (party.fairCpip !== undefined) {
      map.addTemp('play/v2/client/fair.swf', start, end, 'tool:fair_icon_adder.swf');
      map.addTemp('play/v2/client/dependencies.json', start, end, 'tool:fair_dependencies.json');

      map.addTemp(path.join('play/v2/content/global', TICKET_ICON_PATH), start, end, party.fairCpip.iconFileId);
      map.addTemp(path.join('play/v2/content/global', TICKET_INFO_PATH), start, end, 'archives:Tickets-TheFair2009.swf');
    }

    if (party.scavengerHunt2007 !== undefined) {
      map.addTemp('artwork/eggs/1.swf', start, end, party.scavengerHunt2007);
    }
  }, (map, update, start, end) => {
    map.addPartyChanges(update, start, end);
  });
}

/** Converts a timeline of events into some */


/** Represents a unique global crumbs state */
export type GlobalCrumbContent = {
  prices: Record<number, number>;
  music: Partial<Record<RoomName, number>>;
  paths: Record<string, string>;
  newMigratorStatus: boolean;
}

export type LocalCrumbContent = {
  paths: Record<string, string>;
}

export const GLOBAL_CRUMBS_PATH = path.join('default', 'auto', 'global_crumbs');
export const LOCAL_CRUMBS_PATH = path.join('default', 'auto', 'local_crumbs');
export const NEWS_CRUMBS_PATH = path.join('default', 'auto', 'news_crumbs');
export function getCrumbFileName(hash: string, id: number): string {
  return `${hash}-${id}.swf`;
}

function getMd5(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex');
}

export type CrumbOutput<CrumbContent> = {
  hash: string;
  crumbs: Array<{
        date: Version;
        out: CrumbContent;
        id: number;
    }>;
};

export function getLocalCrumbsOutput() {
  return getBaseCrumbsOutput<LocalCrumbContent>((timeline) => {
    PARTIES.forEach((party) => {
      // crumbs dont exist before this date
      if (isGreaterOrEqual(party.date, CPIP_UPDATE)){
        const localPaths: Record<string, string> = {};
        if (party.localChanges !== undefined) {
          // only 'en' support
          Object.entries(party.localChanges).forEach((pair) => {
            const [route, langs] = pair;
            if (langs.en !== undefined) {
              if (typeof langs.en !== 'number') {
                const [_, ...paths] = langs.en;
                paths.forEach((path) => {
                  localPaths[path] = route;
                })
              }
            }
          })
        }
    
        if (Object.keys(localPaths).length > 0) {
          timeline.push({
            date: party.date,
            end: party.end,
            info: { paths: localPaths }
          });
        }
      }

    })
  }, (prev, cur) => {
    return {
      paths: { ...prev.paths, ...cur.paths }
    };
  }, () => {
    return {
      paths: {}
    }
  });
}

function getBaseCrumbsOutput<CrumbContent extends hash.NotUndefined>(
  timelineBuilder: (timeline: TimelineEvent<Partial<CrumbContent>>[]) => void,
  mergeCrumbs: (prev: CrumbContent, cur: Partial<CrumbContent>) => CrumbContent,
  getFirstCrumb: () => CrumbContent
) {
  const timeline: TimelineEvent<Partial<CrumbContent>>[] = [
    {
      date: CPIP_UPDATE,
      info: getFirstCrumb()
    }
  ];

  timelineBuilder(timeline);

  const crumbs = processTimeline(timeline, (input) => {
    return input
  }, getFirstCrumb, mergeCrumbs, (out) => {
    // this is a third party function that can properly hash objects
    // even if their property order isn't the same
    return hash(out);
  });

  const crumbsHash = getMd5(JSON.stringify(crumbs))
  return { hash: crumbsHash, crumbs };
}

export function getRoomFrameTimeline() {
  const timeline = new TimelineMap<RoomName, number>();

  // adding defaults
  // TODO, not fond of design?
  Object.keys(ROOMS).forEach((room) => {
    timeline.addPerm(room as RoomName, BETA_RELEASE, 0);
  })

  PINS.forEach((pin) => {
    if ('room' in pin && pin.frame !== undefined) {
      timeline.addTemp(pin.room, pin.date, pin.end, pin.frame);
    }
  });

  const addRoomFrames = (frames: Partial<Record<RoomName, number>>, start: Version, end: Version) => {
    Object.entries(frames).forEach((pair) => {
      const [room, frame] = pair;
      timeline.addTemp(room as RoomName, start, end, frame);
    })
  }
  
  PARTIES.forEach((party) => {
    if (party.roomFrames !== undefined) {
      addRoomFrames(party.roomFrames, party.date, party.end);
    }
  });

  Object.entries(TEMPORARY_ROOM_UPDATES).forEach((pair) => {
    const [room, updates] = pair;
    updates.forEach((update) => {
      if (update.frame !== undefined) {
        timeline.addTemp(room as RoomName, update.date, update.end, update.frame);
      }
    });
  });

  return timeline.getVersionsMap();
}

export function getMusicTimeline(includeParties: boolean = true) {
  const timeline = new TimelineMap<RoomName, number>();

  const addMusic = (music: RoomMap<number>, start: Version, end: Version | undefined = undefined) => {
    iterateEntries(music, (room, musicId) => {
      if (end === undefined) {
        timeline.addPerm(room, start, musicId);
      } else {
        timeline.addTemp(room, start, end, musicId);
      }
    })
  }

  Object.keys(ROOMS).forEach((room) => {
    timeline.addPerm(room as RoomName, BETA_RELEASE, 0);
  });
    
  // regular room IDs
  Object.entries(ROOM_MUSIC_TIMELINE).forEach((pair) => {
    const [room, musicTimeline] = pair;
    const roomName = room as RoomName;
    
    const [firstSong, ...otherSongs] = musicTimeline;
    timeline.addPerm(roomName, BETA_RELEASE, firstSong);
    otherSongs.forEach((song) => {
      timeline.addPerm(roomName, song.date, song.musicId);
    });
  });

  STAGE_TIMELINE.forEach((debut) => {
    const musicId = STAGE_PLAYS.find((stage) => stage.name === debut.name)?.musicId ?? 0;
    timeline.addPerm('stage', debut.date, musicId);
  });

  if (includeParties) {
    PARTIES.forEach((party) => {
      if (party.music !== undefined) {
        addMusic(party.music, party.date, party.end);
      }
    })
  }

  STANDALONE_UPDATES.forEach((update) => {
    if (update.music !== undefined) {
      addMusic(update.music, update.date);
    }
  });

  return timeline.getVersionsMap();
}

export function getMigratorTimeline() {
  const timeline = new VersionsTimeline<boolean>();
  timeline.add({
    date: BETA_RELEASE,
    info: false
  });

  PARTIES.forEach((party) => {
    if (party.activeMigrator === true) {
      timeline.add({
        date: party.date,
        end: party.end,
        info: true
      });
    }
  });

  MIGRATOR_PERIODS.forEach((period) => {
    timeline.add({
      date: period.date,
      end: period.end,
      info: true
    });
  });

  return timeline.getVersions();
}

export function getClothingTimeline() {
  const timeline = new VersionsTimeline<string>();
  Object.keys(PRE_CPIP_CATALOGS).forEach((date) => {
    const signature = getFileDateSignature(date);
    timeline.add({
      date,
      info: signature
    });
  });

  return timeline.getVersions();
}

function getMusicForDate(map: VersionsMap<RoomName, number>, date: Version): Partial<Record<RoomName, number>> {
  const music: Partial<Record<RoomName, number>> = {};
  map.forEach((versions, room) => {
    music[room] = findInVersion(date, versions);
  })
  return music;
}

/** Get price object for a blank state */
function getBasePriceObject(): Record<number, number> {
  const prices: Record<number, number> = {};
  ITEMS.rows.forEach((item) => {
    prices[item.id] = item.cost;
  });

  return prices;
}

/**
 * Get an output of the global crumbs timeline which includes a hash
 * identifying this timeline and the information of each version
 */
export function getGlobalCrumbsOutput() {
  return getBaseCrumbsOutput<GlobalCrumbContent>((timeline) => {
    PARTIES.forEach((party) => {
      const globalPaths: Record<string, string> = {};
      if (party.globalChanges !== undefined) {
        Object.entries(party.globalChanges).forEach((pair) => {
          const [route, info] = pair;
          if (typeof info !== 'number') {
            const [_, ...paths] = info;
            paths.forEach((globalPath) => {
              globalPaths[globalPath] = route;
            })
          }
        })
      }

      if (party.scavengerHunt2010 !== undefined) {
        const huntIconPath = party.scavengerHunt2010.iconFilePath ?? SCAVENGER_ICON_PATH;
        globalPaths['scavenger_hunt_icon'] = huntIconPath;
      }

      if (party.fairCpip !== undefined) {
        globalPaths['ticket_icon'] = TICKET_ICON_PATH;
        globalPaths['tickets'] = TICKET_INFO_PATH;
      }
  
      // we only want to add parties that are post CPIP and actually made changes
      // so we don't have excess crumb files
      // NOTE that this design can easily lead to new properties being added not being handled
      let crumbChanged = false;
      if (isGreaterOrEqual(party.date, CPIP_UPDATE)) {
        // change is detected if any of these is true
        crumbChanged = [
          party.music !== undefined,
          Object.keys(globalPaths).length > 0,
          party.activeMigrator === true,
          party.scavengerHunt2010 !== undefined,
          party.fairCpip !== undefined
        ].some((v) => v);
      }
  
      if (crumbChanged) {
        timeline.push({
          date: party.date,
          end: party.end,
          info: {
            music: party.music,
            paths: globalPaths,
            prices: {},
            newMigratorStatus: party.activeMigrator === true
          }
        });
      }
    });

    Object.entries(ROOM_MUSIC_TIMELINE).forEach((pair) => {
      const [room, musicTimeline] = pair;
      const [_, ...otherSongs] = musicTimeline;
      otherSongs.forEach((update) => {
        if (isGreater(update.date, CPIP_UPDATE)) {
          timeline.push({
            date: update.date,
            info: {
              music: {
                [room as RoomName]: update.musicId
              }
            }
          })
        }
      })
    })
  
    STAGE_TIMELINE.forEach((debut) => {
      const play = STAGE_PLAYS.find((play) => play.name === debut.name);
      if (play === undefined) {
        throw new Error(`Stage play has no music: ${debut.name}`);
      }
      timeline.push({
        date: debut.date,
        info: {
          music: {
            'stage': play.musicId
          }
        }
      });
    });
  }, (prev, cur) => {
    return {
      music: {
        ...prev.music,
        ...cur.music
      },
      prices: {
        ...prev.prices,
        ...cur.prices
      },
      paths: {
        ...prev.paths,
        ...cur.paths
      },
      newMigratorStatus: cur.newMigratorStatus === undefined ? prev.newMigratorStatus : cur.newMigratorStatus
    }
  }, () => {
    return {
      prices: getBasePriceObject(),
      music: getMusicForDate(getMusicTimeline(false), CPIP_UPDATE),
      newMigratorStatus: false,
      paths: {}
    }
  });
}

/** Adds listeners to the global crumbs files */
function addCrumbs(map: FileTimelineMap): void {
  const addCrumb = <T>(crumbPath: string, route: string, output: CrumbOutput<T>) => {
    const { hash, crumbs } = output;
    /** So that different crumb generations don't use the same files, we hash it in the name */
    crumbs.forEach((crumb) => {
      const filePath = path.join(crumbPath, getCrumbFileName(hash, crumb.id));
      map.addPerm(route, crumb.date, filePath);
    });
  }

  const output = getGlobalCrumbsOutput();

  addCrumb(GLOBAL_CRUMBS_PATH, 'play/v2/content/global/crumbs/global_crumbs.swf', getGlobalCrumbsOutput());
  addCrumb(LOCAL_CRUMBS_PATH, 'play/v2/content/local/en/crumbs/local_crumbs.swf', getLocalCrumbsOutput());

  // remove first 6 which have no crumbs
  [...AS2_NEWSPAPERS.slice(6), ...AS3_NEWSPAPERS].forEach((newspaper) => {
    map.addPerm('play/v2/content/local/en/news/news_crumbs.swf', newspaper.date, path.join(NEWS_CRUMBS_PATH, newspaper.date + '.swf'));
  });
}

function addStadiumUpdates(map: FileTimelineMap): void {
  STADIUM_UPDATES.forEach((update) => {
    const date = update.date;
  if (isGreaterOrEqual(date, CPIP_UPDATE) && isLower(date, EPF_RELEASE)) {
    const agent = 'play/v2/content/global/rooms/agent.swf';
    if (update.type === 'rink') {
      map.addPerm(agent, date, 'archives:RoomsAgent.swf');
    } else if (update.type === 'stadium') {
      map.addPerm(agent, date, 'archives:RoomsAgentFootball.swf');
    }
  }
  if (update.mapFileId !== undefined) {
    map.addPerm('play/v2/content/global/content/map.swf', date, update.mapFileId);
  }
    map.addPerm('play/v2/content/global/rooms/town.swf', date, update.townFileId);
    map.addPerm('play/v2/content/global/rooms/forts.swf', date, update.fortsFileId);
    map.addPerm('play/v2/content/global/rooms/rink.swf', date, update.rinkFileId);
    if (update.catalogFileId !== undefined) {
      map.addPerm('play/v2/content/local/en/catalogues/sport.swf', date, update.catalogFileId);
    }
  });
}

function addIngameMapInfo(map: FileTimelineMap): void {
  map.addPerm(PRECPIP_MAP_PATH, BETA_RELEASE, ORIGINAL_MAP);
}

function addStandaloneChanges(map: FileTimelineMap): void {
  Object.entries(STANDALONE_CHANGE).forEach((pair) => {
    const [route, updates] = pair;
    updates.forEach((update) => {
      map.addPerm(route, update.date, update.fileRef);
    })
  });

  Object.entries(STANDALONE_TEMPORARY_CHANGE).forEach((pair) => {
    const [route, updates] = pair;
    updates.forEach((update) => {
      map.addTemp(route, update.startDate, update.endDate, update.fileRef);
      if (update.updates !== undefined) {
        update.updates.forEach((newUpdate) => {
          map.addTemp(route, newUpdate.date, update.endDate, newUpdate.fileRef);
        })
      }
    })
  });

  STANDALONE_UPDATES.forEach((update) => {
    map.addPartyChanges(update, update.date);
  })
}

function addMapUpdates(map: FileTimelineMap): void {
  MAP_UPDATES.forEach((update) => {
    map.addGameMapUpdate(update.fileRef, update.date);
  });
}

export function getFileDateSignature(date: Version): string {
  const decomposed = processVersion(date);
  if (decomposed === undefined) {
    throw new Error(`Invalid version: ${date}`);
  }
  const [year, month] = decomposed;
  // the last 2 numbers of year, and month with a 0 on front if needed
  return `${String(year).slice(2)}${String(month).padStart(2, '0')}`;
}

function addCatalogues(map: FileTimelineMap): void {
  iterateEntries(PRE_CPIP_CATALOGS, (date, file) => {
    const signature = getFileDateSignature(date);
    map.addPerm(`artwork/catalogue/clothing_${signature}.swf`, date, file);
    map.addPerm(`artwork/catalogue/clothing${signature}.swf`, date, file);
  });

  map.addDateRefMap('play/v2/content/local/en/catalogues/clothing.swf', CPIP_CATALOGS);
  map.addDateRefMap('play/v2/content/local/en/catalogues/furniture.swf', FURNITURE_CATALOGS);
  map.addDateRefMap('play/v2/content/local/en/catalogues/igloo.swf', IGLOO_CATALOGS);
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
  map.addPerm(route, BETA_RELEASE, 'tool:dynamic_igloo_music.swf');
  for (let i = 0; i < IGLOO_LISTS.length; i++) {
    // using archived igloo lists as temporary updates on top of a single permanent one
    const cur = IGLOO_LISTS[i];
    if (typeof cur.fileRef === 'string') {
      const start = cur.date;
      if (i === IGLOO_LISTS.length) {
        map.addPerm(route, start, cur.fileRef);
      } else {
        map.addTemp(route, start, IGLOO_LISTS[i + 1].date, cur.fileRef);
      }
    }
  }
}

function addStagePlays(map: FileTimelineMap): void {
  STAGE_TIMELINE.forEach((debut) => {
    const date = debut.date;

    // Stage itself
    addRoomRoute(map, date, 'stage', debut.stageFileRef);

    if (debut.plazaFileRef !== null) {
      // Plaza
      addRoomRoute(map, date, 'plaza', debut.plazaFileRef);
    }

    if (debut.party1 !== undefined) {
      // for norman swarm
      addRoomRoute(map, date, 'party1', debut.party1);
    }

    // simply hardcoding every catalogue to be from 0712 for now
    map.addPerm('artwork/catalogue/costume_0712.swf', date, debut.costumeTrunkFileRef);
    // TODO only add costrume trunks to each specific engine
    map.addPerm('play/v2/content/local/en/catalogues/costume.swf', date, debut.costumeTrunkFileRef);
  })
}

function addGames(map: FileTimelineMap): void {
  Object.values(PRE_CPIP_GAME_UPDATES).forEach((updates) => {
    const [release, ...other] = updates;
    const fileRoute = path.join('games', release.directory);

    map.addPerm(fileRoute, BETA_RELEASE, release.fileRef);
  })
}

/** Get the object which knows all the file information needed to find the file for a given route */
export function getFileServer() {
  const timelines = new FileTimelineMap();

  const timelineProcessors = [
    addRoomInfo,
    addIngameMapInfo,
    addStandaloneChanges,
    addMapUpdates,
    addParties,
    addMusicFiles,
    addCatalogues,
    addStagePlays,
    addMusicLists,
    addStadiumUpdates,
    addPins,
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