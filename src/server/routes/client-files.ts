import path from "path";
import crypto from 'crypto';
import hash from 'object-hash';

import { PRE_CPIP_STATIC_FILES } from "../data/precpip-static";
import { isGreater, isGreaterOrEqual, isLower, processVersion, Version } from "./versions";
import { FileCategory, FILES, getMediaFilePath } from "../data/files";
import { PACKAGES } from "../data/packages";
import { RoomName, ROOMS } from "../data/rooms";
import { ORIGINAL_MAP, ORIGINAL_ROOMS } from "../data/release-features";
import { STANDALONE_CHANGE, STANDALONE_TEMPORARY_CHANGE } from "../data/standalone-changes";
import { STATIC_SERVERS } from "../data/static-servers";
import { ROOM_MUSIC_TIMELINE, ROOM_OPENINGS, ROOM_UPDATES, TEMPORARY_ROOM_UPDATES } from "../data/room-updates";
import { MAP_PATH_07, MAP_UPDATES, PRECPIP_MAP_PATH } from "../data/game-map";
import { CrumbIndicator, PARTIES, PartyChanges, RoomChanges } from "../data/parties";
import { MUSIC_IDS, PRE_CPIP_MUSIC_PATH } from "../data/music";
import { CPIP_STATIC_FILES } from "../data/cpip-static";
import { FALLBACKS } from "../data/fallbacks";
import { CPIP_CATALOGS, FURNITURE_CATALOGS, IGLOO_CATALOGS, PRE_CPIP_CATALOGS } from "../data/catalogues";
import { STAGE_PLAYS, STAGE_TIMELINE } from "../game/stage-plays";
import { IGLOO_LISTS } from "../game/igloo-lists";
import { BETA_RELEASE, CAVE_OPENING_START, CPIP_UPDATE, EPF_RELEASE, MODERN_AS3, PRE_CPIP_REWRITE_DATE } from "../data/updates";
import { STADIUM_UPDATES } from "../data/stadium-updates";
import { As2Newspaper, AS2_NEWSPAPERS, PRE_BOILER_ROOM_PAPERS, AS3_NEWSPAPERS } from "../data/newspapers";
import { CPIP_AS3_STATIC_FILES } from "../data/cpip-as3-static";
import { getNewspaperName } from "../game/news.txt";
import { PINS } from "../data/pins";
import { findInVersion, IdentifierMap, processTimeline, TimelineEvent, TimelineMap, VersionsTimeline } from "../data/changes";
import { MIGRATOR_PERIODS } from "../data/migrator";
import { PRE_CPIP_GAME_UPDATES } from "../data/games";
import { ITEMS } from "../game/items";
import { ICONS, PAPER, PHOTOS, SPRITES } from "../data/clothing";
import { AS3_STATIC_FILES } from "../data/as3-static";
import { FURNITURE_ICONS, FURNITURE_SPRITES } from "../data/furniture";

/** Information for the update of a route that is dynamic */
type DynamicRouteUpdate = {
  /** The date in which this route changed */
  date: string;
  /** The path to the file that this route now serves */
  file: string;
}

/** Information for the update of a route that is special */
type SpecialRouteUpdate = {
  /** The date in which this update happens */
  date: string;
  /** Maps a special condition to the file server on that day under that condition */
  files: Record<string, string>;
}

type RouteFileInformation = string | Array<DynamicRouteUpdate>;

class FileTimelineMap {
  private _map: TimelineMap<string, string>;

  constructor() {
    this._map = new TimelineMap<string, string>();
  }


  addPerm(route: string, date: Version, file: string): void;
  addPerm(route: string, date: Version, file: number): void;

  
  addPerm(route: string, date: Version, file: string | number) {
    this._map.addPerm(sanitizePath(route), date, typeof file === 'string' ? file : getMediaFilePath(file));
  }

  addTemp(route: string, date: Version, end: Version, file: string): void;
  addTemp(route: string, date: Version, end: Version, file: number): void;

  addTemp(route: string, date: Version, end: Version, file: string | number) {
    this._map.addTemp(sanitizePath(route), date, end, typeof file === 'string' ? file : getMediaFilePath(file));
  }

  getRouteMap(): RouteMap {
    const routeMap = new Map<string, RouteFileInformation>();
    const idMap = this._map.getIdentifierMap();

    idMap.forEach((versions, route) => {
      addToRouteMap(routeMap, route, versions.map((v) => ({ date: v.date, file: v.info })))
    });

    return routeMap;
  }
}

function addFurniture(map: FileTimelineMap): void {
  const pushFurniture = (id: string, fileId: number, directory: string) => {
    const filePath = getMediaFilePath(fileId)
    map.addPerm(`play/v2/content/global/clothing/${directory}/${id}.swf`, BETA_RELEASE, filePath);
  }

  Object.entries(FURNITURE_ICONS).forEach((pair) => {
    const [id, fileId] = pair;
    pushFurniture(id, fileId, 'icons');
  });

  Object.entries(FURNITURE_SPRITES).forEach((pair) => {
    const [id, fileId] = pair;
    pushFurniture(id, fileId, 'icons');
  });
}

function addClothing(map: FileTimelineMap): void {
  const pushClothing = (id: number | string, fileId: number, directory: string) => {
    const filePath = getMediaFilePath(fileId)
    map.addPerm(`play/v2/content/global/clothing/${directory}/${id}.swf`, BETA_RELEASE, filePath);
  }

  const preCpipClothing = (id: number | string, fileId: number, directory: string) => {
    map.addPerm(`artwork/${directory}/${id}.swf`, BETA_RELEASE, getMediaFilePath(fileId));
  }

  Object.entries(ICONS).forEach((pair) => {
    const [id, fileId] = pair;
    pushClothing(id, fileId, 'icons');
  });

  Object.entries(PAPER).forEach((pair) => {
    const [id, fileId] = pair;
    pushClothing(id, fileId, 'paper');
  });

  Object.entries(PHOTOS).forEach((pair) => {
    const [id, fileId] = pair;
    pushClothing(id, fileId, 'photos');
    // in the old engine backgrounds were served with this ID phase
    preCpipClothing(Number(id) - 900, fileId, 'photos');
  });

  Object.entries(SPRITES).forEach((pair) => {
    const [id, fileId] = pair;
    pushClothing(id, fileId, 'sprites');
    preCpipClothing(id, fileId, 'items');
  });
}

function addMusicFiles(map: FileTimelineMap): void {
  // pre-cpip there's no reason to believe updates happened

  Object.entries(MUSIC_IDS).forEach((pair) => {
    const [musicId, fileId] = pair;
    const fileName = String(musicId) + '.swf';
    const route = path.join(PRE_CPIP_MUSIC_PATH, fileName);
    map.addPerm(route, BETA_RELEASE, fileId);
    map.addPerm(path.join('play/v2/content/global/music', fileName), CPIP_UPDATE, fileId);
  })
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

/** Maps a route to all the file information related to it */
type RouteMap = Map<string, RouteFileInformation>;

/** Given a route map, adds file information to a given route */
function addToRouteMap(map: RouteMap, route: string, info: RouteFileInformation): void {
  const cleanPath = sanitizePath(route);
  if (map.has(cleanPath)) {
    throw new Error(`Duplicated path: ${cleanPath}`);
  }
  map.set(cleanPath, info);
}

function addNewspapers(map: RouteMap): void {
  const preBoilerPapers = PRE_BOILER_ROOM_PAPERS.length;
  AS2_NEWSPAPERS.forEach((news, index) => {
    if (news.fileId !== undefined) {
      const filePath = getMediaFilePath(news.fileId);
      const issueNumber = index + preBoilerPapers + 1;
      if (isNewspaperBeforeCPIP(news)) {
        addToRouteMap(map, `artwork/news/news${issueNumber}.swf`, filePath);
        const route2007 = getNewspaperName(news.date).replace('|', '/') + '.swf';
        addToRouteMap(map, path.join('artwork/news', route2007), filePath);
      }
      // for all the 2006 boiler rooms we have archived,
      // they seem to only show a singular newspaper, presumed
      // to maybe be the previous newspaper?

      // if index + 2 is after boiler room is available, then index + 1 was readable after boiler room was available
      // and thus index was a predecessor to a newspaper available after boiler room
      if (isGreaterOrEqual(AS2_NEWSPAPERS[index + 2].date, CAVE_OPENING_START) && isLower(news.date, PRE_CPIP_REWRITE_DATE)) {
        // I am a bit unsure of why the client is handled like this, but the name of the archive and
        // regular newspaper are the same for some reason? So we have to increment the issue number
        // this is definitely a mystery however, maybe if more files or footage is found light can be shed
        // upon this issue
        addToRouteMap(map, path.join('artwork/archives', `news${issueNumber + 1}.swf`), filePath);
      }
      if (isNewspaperAfterCPIP(AS2_NEWSPAPERS[index + 1])) {
        const date = getMinifiedDate(news.date);
        addToRouteMap(map, `play/v2/content/local/en/news/${date}/${date}.swf`, filePath);
      }
    }
  })

  
  const configXmlPath = getMediaFilePath(4755);
  AS3_NEWSPAPERS.forEach((news) => {
    const newsPath = `play/v2/content/local/en/news/${getMinifiedDate(news.date)}`;
    addToRouteMap(map, path.join(newsPath, 'config.xml'), configXmlPath);
    const newspaperComponenets: Array<[string, number]> = [
      ['front/header.swf', news.headerFront],
      ['front/featureStory.swf', news.featureStory],
      ['front/supportStory.swf', news.supportStory],
      ['front/upcomingEvents.swf', news.upcomingEvents],
      ['front/newsFlash.swf', news.newsFlash],
      ['front/askAuntArctic.swf', news.askFront],
      ['front/dividers.swf', news.dividersFront ?? 4767],
      ['front/navigation.swf', news.navigationFront ?? 4768],
      ['back/header.swf', news.headerBack],
      ['back/askAuntArctic.swf', news.askBack],
      ['back/secrets.swf', news.secrets],
      ['back/submitYourContent.swf', news.submit ?? 4770],
      ['back/jokesAndRiddles.swf', news.jokes],
      ['back/dividers.swf', news.dividersBack ?? 4771],
      ['back/navigation.swf', news.navigationBack ?? 4772],
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
      addToRouteMap(map, path.join(newsPath, 'content', route), getMediaFilePath(file));
    }) 
  })
}

function addTimeSensitiveStaticFiles(map: FileTimelineMap): void {
  Object.entries(CPIP_STATIC_FILES).forEach((pair) => {
    const [route, fileId] = pair;
    map.addPerm(route, CPIP_UPDATE, fileId);
  });
  Object.entries(AS3_STATIC_FILES).forEach((pair) => {
    const [route, fileId] = pair;
    map.addPerm(route, MODERN_AS3, fileId);
  });
}

function addStaticFiles(map: RouteMap): void {
  const addStatic = (stat: Record<string, number>) => {
    Object.entries(stat).forEach((pair) => {
      const [route, fileId] = pair;
      const filePath = getMediaFilePath(fileId);
      addToRouteMap(map, route, filePath);
    })
  }

  addStatic(PRE_CPIP_STATIC_FILES);
  addStatic(CPIP_AS3_STATIC_FILES);
}

function addFallbacks(map: FileTimelineMap): void {
  FALLBACKS.forEach((pair) => {
    const [route, fileId] = pair;
    map.addPerm(route, BETA_RELEASE, fileId);
  })
}


/** Maps for each route its file timeline */
// type TimelineMap = Map<string, FileTimeline>;

function sanitizePath(path: string): string {
  return path.replaceAll('\\', '/');
}

function addRoomRoute(map: FileTimelineMap, date: string, room: RoomName, file: number) {
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

function addTempRoomRoute(map: FileTimelineMap, start: string, end: string, room: RoomName, file: number) {
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

  const addRoomChange = (room: RoomName, date: string, fileId: number) => {
    addRoomRoute(map, date, room, fileId);
  }

  ROOM_OPENINGS.forEach((opening) => {
    if (opening.fileId !== null) {
      addRoomChange(opening.room, opening.date, opening.fileId);
    }
    if (opening.otherRooms !== undefined) {
      Object.entries(opening.otherRooms).forEach((pair) => {
        const [room, fileId] = pair;
        addRoomChange(room as RoomName, opening.date, fileId);
      });
    }
    if (opening.map !== undefined) {
      addMapUpdate(map, opening.date, opening.map);
    }
  })

  Object.entries(ROOM_UPDATES).forEach((pair) => {
    const [room, updates] = pair;
    updates.forEach((update) => {
      addRoomChange(room as RoomName, update.date, update.fileId);
    })
  })

  Object.entries(TEMPORARY_ROOM_UPDATES).forEach((pair) => {
    const [room, updates] = pair;
    const roomName = room as RoomName;
    updates.forEach((update) => {
      addTempRoomRoute(map, update.date, update.end, roomName, update.fileId);
    })
  })
}

function addParties(map: FileTimelineMap): void {
  const addRoomChanges = (roomChanges: RoomChanges, start: Version, end: Version | undefined = undefined) => {
    for (const room in roomChanges) {
      const roomName = room as RoomName;
      const fileId = roomChanges[roomName]!;
      if (end === undefined) {
        addRoomRoute(map, start, roomName, fileId);
      } else {
        addTempRoomRoute(map, start, end, roomName, fileId);
      }
    }
  }

  const addPartyChanges = (changes: PartyChanges, start: Version, end: Version | undefined = undefined) => {
    const pushCrumbChange = (baseRoute: string, route: string, info: number | CrumbIndicator) => {
      const fileId = typeof info === 'number' ? info : info[0];
      const fullRoute = path.join(baseRoute, route);
      if (end === undefined) {
        map.addPerm(fullRoute, start, fileId);
      } else {
        map.addTemp(fullRoute, start, end, fileId);
      }
    }

    addRoomChanges(changes.roomChanges, start, end);
    if (changes.localChanges !== undefined) {
      Object.entries(changes.localChanges).forEach((pair) => {
        const [route, languages] = pair;
        Object.entries(languages).forEach((changePair) => {
          const [language, info] = changePair;
          pushCrumbChange(path.join('play/v2/content/local', language), route, info);
        });
      })
    }
    if (changes.globalChanges !== undefined) {
      Object.entries(changes.globalChanges).forEach((pair) => {
        const [route, info] = pair;
        pushCrumbChange('play/v2/content/global', route, info);
      })
    }

    // adding just any route change in general for the party
    if (changes.generalChanges !== undefined) {
      Object.entries(changes.generalChanges).forEach((pair) => {
        const [route, fileId] = pair;
        console.log('adding general changes', route, fileId, getMediaFilePath(fileId));
        if (end === undefined) {
          map.addPerm(route, start, fileId);
        } else {
          map.addTemp(route, start, end, fileId);
        }
      });
    }
  }
  
  PARTIES.forEach((party) => {
    const startDate = party.startDate;
    const endDate = party.endDate;
    addPartyChanges({
      roomChanges: party.roomChanges,
      localChanges: party.localChanges,
      globalChanges: party.globalChanges,
      generalChanges: party.generalChanges
    }, startDate, endDate);
    if (party.construction !== undefined) {
      const constructionStart = party.construction.date;
      addRoomChanges(party.construction.changes, constructionStart, startDate);

      if (party.construction.updates !== undefined) {
        party.construction.updates.forEach((update) => {
          addRoomChanges(update.changes, update.date, startDate);
        })
      }
    }

    if (party.scavengerHunt2010 !== undefined) {
      // enabling the scavenger hunt dependency file
      map.addTemp('play/v2/client/dependencies.json', startDate, endDate, 2384);

      // serving the icon that will be loaded by the dependency
      const huntIconPath = party.scavengerHunt2010.iconFilePath ?? SCAVENGER_ICON_PATH;
      map.addTemp(path.join('play/v2/content/global', huntIconPath), startDate, endDate, party.scavengerHunt2010.iconFileId);
    }

    // all CPIP fair parties have the same dependency for loading the fair icon
    // this is possible to change if we can recreate the exact method it used
    if (party.fairCpip !== undefined) {
      map.addTemp('play/v2/client/fair.swf', startDate, endDate, 2513);
      map.addTemp('play/v2/client/dependencies.json', startDate, endDate, 2514);

      map.addTemp(path.join('play/v2/content/global', TICKET_ICON_PATH), startDate, endDate, party.fairCpip.iconFileId);
      map.addTemp(path.join('play/v2/content/global', TICKET_INFO_PATH), startDate, endDate, 2506);
    }

    if (party.updates !== undefined) {
      party.updates.forEach((update) => {
        addPartyChanges({
          roomChanges: update.roomChanges,
          localChanges: update.localChanges,
          globalChanges: update.globalChanges,
          generalChanges: update.generalChanges
        }, update.date, endDate);
      })
    }

    if (party.scavengerHunt2007 !== undefined) {
      map.addTemp('artwork/eggs/1.swf', startDate, endDate, party.scavengerHunt2007);
    }

    if (party.permanentChanges !== undefined) {
      addPartyChanges(party.permanentChanges, party.startDate);
    }
    if (party.consequences !== undefined) {
      addPartyChanges(party.consequences, party.endDate);
    }
  })
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
      if (isGreaterOrEqual(party.startDate, CPIP_UPDATE)){
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
            date: party.startDate,
            end: party.endDate,
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
      addRoomFrames(party.roomFrames, party.startDate, party.endDate);
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

  return timeline.getIdentifierMap();
}

export function getMusicTimeline(includeParties: boolean = true) {
  const timeline = new TimelineMap<RoomName, number>();

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
        Object.entries(party.music).forEach(pair => {
          const [room, music] = pair;
          timeline.addTemp(room as RoomName, party.startDate, party.endDate, music);
        })
      }
    })
  }
  return timeline.getIdentifierMap();
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
        date: party.startDate,
        end: party.endDate,
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

  return timeline.getVersion();
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

  return timeline.getVersion();
}

function getMusicForDate(map: IdentifierMap<RoomName, number>, date: Version): Partial<Record<RoomName, number>> {
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
      if (isGreaterOrEqual(party.startDate, CPIP_UPDATE)) {
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
          date: party.startDate,
          end: party.endDate,
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
      map.addPerm(agent, date, 2651);
    } else if (update.type === 'stadium') {
      map.addPerm(agent, date, 4935);
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
      map.addPerm(route, update.date, update.fileId);
    })
  });

  Object.entries(STANDALONE_TEMPORARY_CHANGE).forEach((pair) => {
    const [route, updates] = pair;
    updates.forEach((update) => {
      map.addTemp(route, update.startDate, update.endDate, update.fileId);
      if (update.updates !== undefined) {
        update.updates.forEach((newUpdate) => {
          map.addTemp(route, newUpdate.date, update.endDate, newUpdate.fileId);
        })
      }
    })
  });
}

function addMapUpdate(map: FileTimelineMap, date: Version, fileId: number): void {
  if (isLower(date, CPIP_UPDATE)) {
    map.addPerm(PRECPIP_MAP_PATH, date, fileId);
    // TODO would be best to only include the maps that end up factually being used
    map.addPerm(MAP_PATH_07, date, fileId);
  } else {
    map.addPerm('play/v2/content/global/content/map.swf', date, fileId);
  }
}

function addMapUpdates(map: FileTimelineMap): void {
  MAP_UPDATES.forEach((update) => {
    addMapUpdate(map, update.date, update.fileId);
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
  const addCatalogue = (route: string, catalogs: Record<string, number>) => {
    Object.entries(catalogs).forEach((pair) => {
      const [date, fileId] = pair;
      
      map.addPerm(route, date, fileId);
    })
  }

  Object.entries(PRE_CPIP_CATALOGS).forEach((pair) => {
    const [date, file] = pair;
    const signature = getFileDateSignature(date);
    map.addPerm(`artwork/catalogue/clothing_${signature}.swf`, date, file);
    map.addPerm(`artwork/catalogue/clothing${signature}.swf`, date, file);
  })

  addCatalogue('play/v2/content/local/en/catalogues/clothing.swf', CPIP_CATALOGS);
  addCatalogue('play/v2/content/local/en/catalogues/furniture.swf', FURNITURE_CATALOGS);
  addCatalogue('play/v2/content/local/en/catalogues/igloo.swf', IGLOO_CATALOGS);
}

function addPins(map: FileTimelineMap): void {
  PINS.forEach((pin) => {
    if ('room' in pin && pin.fileId !== undefined) {
      addTempRoomRoute(map, pin.date, pin.end, pin.room, pin.fileId);
    }
  });
}

function addMusicLists(map: FileTimelineMap): void {
  const route = 'play/v2/content/global/content/igloo_music.swf';
  map.addPerm(route, BETA_RELEASE, 2635);
  for (let i = 0; i < IGLOO_LISTS.length; i++) {
    // using archived igloo lists as temporary updates on top of a single permanent one
    const cur = IGLOO_LISTS[i];
    if (typeof cur.fileId === 'number') {
      const start = cur.date;
      if (i === IGLOO_LISTS.length) {
        map.addPerm(route, start, cur.fileId);
      } else {
        map.addTemp(route, start, IGLOO_LISTS[i + 1].date, cur.fileId);
      }
    }
  }
}

function addStagePlays(map: FileTimelineMap): void {
  STAGE_TIMELINE.forEach((debut) => {
    const date = debut.date;

    // Stage itself
    addRoomRoute(map, date, 'stage', debut.stageFileId);

    if (debut.plazaFileId !== null) {
      // Plaza
      addRoomRoute(map, date, 'plaza', debut.plazaFileId);
    }

    if (debut.party1 !== undefined) {
      // for norman swarm
      addRoomRoute(map, date, 'party1', debut.party1);
    }

    // simply hardcoding every catalogue to be from 0712 for now
    map.addPerm('artwork/catalogue/costume_0712.swf', date, debut.costumeTrunkFileId);
    // TODO only add costrume trunks to each specific engine
    map.addPerm('play/v2/content/local/en/catalogues/costume.swf', date, debut.costumeTrunkFileId);
  })
}

function addGames(map: FileTimelineMap): void {
  Object.values(PRE_CPIP_GAME_UPDATES).forEach((updates) => {
    const [release, ...other] = updates;
    const fileRoute = path.join('games', release.directory);

    map.addPerm(fileRoute, BETA_RELEASE, release.fileId);
  })
}

/** Get the object which knows all the file information needed to find the file for a given route */
export function getFileServer(): Map<string, RouteFileInformation> {
  const timelines = new FileTimelineMap();

  const timelineProcessors = [
    addRoomInfo,
    addIngameMapInfo,
    addStandaloneChanges,
    addMapUpdates,
    addParties,
    addMusicFiles,
    addFallbacks,
    addCatalogues,
    addStagePlays,
    addMusicLists,
    addStadiumUpdates,
    addPins,
    addCrumbs,
    addClothing,
    addTimeSensitiveStaticFiles,
    addFurniture,
    addGames
  ];

  timelineProcessors.forEach((fn) => fn(timelines));
  
  const fileServer = timelines.getRouteMap();

  const staticProcessors = [
    addStaticFiles,
    addNewspapers
  ];

  staticProcessors.forEach((fn) => fn(fileServer));

  return fileServer;
}