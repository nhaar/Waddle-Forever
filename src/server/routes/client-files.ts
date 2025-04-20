import path from "path";
import crypto from 'crypto';
import { PRE_CPIP_STATIC_FILES } from "../data/precpip-static";
import { isEqual, isGreaterOrEqual, isLower, Version } from "./versions";
import { FileCategory, FILES } from "../data/files";
import { PACKAGES } from "../data/packages";
import { RoomName, ROOMS } from "../data/rooms";
import { ORIGINAL_MAP, ORIGINAL_ROOMS } from "../data/release-features";
import { STANDALONE_CHANGE, STANDALONE_TEMPORARY_CHANGE } from "../data/standalone-changes";
import { STATIC_SERVERS } from "../data/static-servers";
import { ROOM_OPENINGS, ROOM_UPDATES } from "../data/room-updates";
import { MAP_UPDATES, PRECPIP_MAP_PATH } from "../data/game-map";
import { CrumbIndicator, PARTIES, PartyChanges, RoomChanges } from "../data/parties";
import { MUSIC_IDS, PRE_CPIP_MUSIC_PATH } from "../data/music";
import { CPIP_STATIC_FILES } from "../data/cpip-static";
import { FALLBACKS } from "../data/fallbacks";
import { CPIP_CATALOGS, FURNITURE_CATALOGS, IGLOO_CATALOGS } from "../game/catalogues";
import { STAGE_PLAYS, STAGE_TIMELINE } from "../game/stage-plays";
import { IGLOO_LISTS } from "../game/igloo-lists";
import { BETA_RELEASE, CPIP_UPDATE } from "../data/updates";
import { STADIUM_UPDATES } from "../data/stadium-updates";
import { NEWSPAPERS } from "../data/newspapers";

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

/** For a route that updates dynamically */
type DynamicRouteFileInformation = {
  type: 'dynamic';
  versions: Array<DynamicRouteUpdate>;
};

/** For a route that is special */
type SpecialRouteFileInformation = {
  type: 'special';
  versions: Array<SpecialRouteUpdate>;
};

type RouteFileInformation = string | DynamicRouteFileInformation | SpecialRouteFileInformation;

/** Maps a route to all the file information related to it */
type RouteMap = Map<string, RouteFileInformation>;

/** Given a route map, adds file information to a given route */
function addToRouteMap(map: RouteMap, route: string, info: RouteFileInformation): void {
  const cleanPath = sanitizePath(route);
  const previousValue = map.get(cleanPath);
  if (previousValue === undefined) {
    map.set(cleanPath, info);
  } else {
    console.log(previousValue, info);
    throw new Error(`Path ${cleanPath} is being duplicated`);
  }
}

/** Get the path to a file */
function getMediaFilePath(fileId: number): string {
  const file = FILES.getStrict(fileId);
  const packageInfo = PACKAGES.getStrict(file.packageId);
  const categoryName = {
    [FileCategory.Archives]: 'archives',
    [FileCategory.Fix]: 'fix',
    [FileCategory.Approximation]: 'approximation',
    [FileCategory.Recreation]: 'recreation',
    [FileCategory.Mod]: 'mod',
    [FileCategory.StaticServer]: 'ss',
    [FileCategory.Tool]: 'tool',
    [FileCategory.Unknown]: 'unknown'
  }[file.category];

  let filePath = file.path;
  if (file.category === FileCategory.StaticServer && file.staticId !== null) {
    const server = STATIC_SERVERS.getStrict(file.staticId);
    filePath = path.join(server.name, filePath);
  }

  return path.join(packageInfo.name, categoryName, filePath);
}

function addMusicFiles(map: TimelineMap): void {
  // pre-cpip there's no reason to believe updates happened

  Object.entries(MUSIC_IDS).forEach((pair) => {
    const [musicId, fileId] = pair;
    const route = path.join(PRE_CPIP_MUSIC_PATH, String(musicId) + '.swf')
    map.addPerm(route, BETA_RELEASE, fileId);
  })
}

function addStaticFiles(map: RouteMap): void {
  Object.entries(PRE_CPIP_STATIC_FILES).forEach((pair) => {
    const [route, fileId] = pair;
    const filePath = getMediaFilePath(fileId);
    addToRouteMap(map, route, filePath);
  })

  Object.entries(CPIP_STATIC_FILES).forEach((pair) => {
    const [route, fileId] = pair;
    const filePath = getMediaFilePath(fileId);
    addToRouteMap(map, route, filePath);
  });
}

function addFallbacks(map: TimelineMap): void {
  FALLBACKS.forEach((pair) => {
    const [route, fileId] = pair;
    map.addPerm(route, BETA_RELEASE, fileId);
  })
}

/** Abstraction of a type that represents either a temporary event or permanent one in a timeline */
type TimelineEvent<EventInformation> = ({
  type: 'temporary';
  start: Version;
  end: Version;
} | {
  type: 'permanent',
  date: Version,
}) & EventInformation;

/** A single event in a timeline of updates of a file */
type FileTimelineEvent = TimelineEvent<{
  file: string
}>;

type FileTimeline = Array<FileTimelineEvent>;

/** Maps for each route its file timeline */
// type TimelineMap = Map<string, FileTimeline>;

function sanitizePath(path: string): string {
  return path.replaceAll('\\', '/');
}

class TimelineMap {
  private _map: Map<string, FileTimeline>;
  
  constructor() {
    this._map = new Map<string, FileTimeline>;
  }

  addTemp(route: string, start: Version, end: Version, file: number) {
    this.add(route, {
      type: 'temporary',
      start,
      end,
      file: getMediaFilePath(file)
    });
  }
  addPerm(route: string, date: Version, file: number): void;
  addPerm(route: string, date: Version, file: string): void;

  addPerm(route: string, date: Version, file: number | string) {
    const filePath = typeof file === 'number' ? getMediaFilePath(file) : file;
    this.add(route, {
      type: 'permanent',
      date,
      file: filePath
    });
  }

  /** Add a file update event to a timeline map for a given route */
  private add(route: string, event: FileTimelineEvent): void {
    route = sanitizePath(route);
    const prev = this._map.get(route);
    if (prev === undefined) {
      this._map.set(route, [event]);
    } else {
      prev.push(event);
    }
  }

  getRouteMap(): RouteMap {
    const routeMap = new Map<string, RouteFileInformation>();
    this._map.forEach((timeline, route) => {
      addToRouteMap(routeMap, route, getFileInformation(timeline))
    });

    return routeMap;
  }
}

function getPreCpipRoomRoute(room: RoomName): string {
  const roomInfo = ROOMS[room];
  return path.join('artwork/rooms', `${room}${roomInfo.preCpipFileNumber}.swf`);
}

function getCpipRoomRoute(room: RoomName): string {
  const roomInfo = ROOMS[room];
  return path.join('play/v2/content/global/rooms', `${room}.swf`);
}

function getRoomRoute(date: string, room: RoomName): string {
  return isLower(date, CPIP_UPDATE) ? getPreCpipRoomRoute(room) : getCpipRoomRoute(room);
}

function addRoomInfo(map: TimelineMap): void {
  for (const roomName in ROOMS) {
    const originalRoomFile = ORIGINAL_ROOMS[roomName as RoomName];
    if (originalRoomFile !== undefined) {
      // adding rooms that were there from the start
      map.addPerm(getPreCpipRoomRoute(roomName as RoomName), BETA_RELEASE, originalRoomFile);
    }
  }

  const addRoomChange = (room: RoomName, date: string, fileId: number) => {
    const route = getRoomRoute(date, room);
    map.addPerm(route, date, fileId);
  }

  ROOM_OPENINGS.forEach((opening) => {
    addRoomChange(opening.room, opening.date, opening.fileId);
  })

  ROOM_UPDATES.forEach((update) => {
    addRoomChange(update.room, update.date, update.fileId);
  });
}

function addParties(map: TimelineMap): void {
  const addRoomChanges = (roomChanges: RoomChanges, start: Version, end: Version) => {
    for (const room in roomChanges) {
      const fileId = roomChanges[room as RoomName]!;
      const roomRoute = getRoomRoute(start, room as RoomName);
      map.addTemp(roomRoute, start, end, fileId);
    }
  }

  const addPartyChanges = (start: Version, end: Version, changes: PartyChanges) => {
    const pushCrumbChange = (baseRoute: string, route: string, info: number | CrumbIndicator) => {
      const fileId = typeof info === 'number' ? info : info[0];
      map.addTemp(path.join(baseRoute, route), start, end, fileId);
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
  }
  
  PARTIES.forEach((party) => {
    const startDate = party.startDate;
    const endDate = party.endDate;
    addPartyChanges(startDate, endDate, {
      roomChanges: party.roomChanges,
      localChanges: party.localChanges,
      globalChanges: party.globalChanges
    });
    if (party.construction !== undefined) {
      const constructionStart = party.construction.date;
      addRoomChanges(party.construction.changes, constructionStart, endDate);
    }

    if (party.scavengerHunt2010) {
      // enabling the scavenger hunt dependency file
      map.addTemp('play/v2/client/dependencies.json', startDate, endDate, 2384);
    }

    if (party.updates !== undefined) {
      party.updates.forEach((update) => {
        addPartyChanges(update.date, endDate, {
          roomChanges: update.roomChanges,
          localChanges: update.localChanges,
          globalChanges: update.globalChanges
        });
      })
    }

    // adding just any route change in general for the party
    if (party.generalChanges !== undefined) {
      Object.entries(party.generalChanges).forEach((pair) => {
        const [route, fileId] = pair;
        map.addTemp(route, startDate, endDate, fileId);
      });
    }
  })
}

function sortOnProperty<T extends { date: string }>(array: T[]): T[] {
  return array.sort((a, b) => {
    const aVersion = a.date;
    const bVersion = b.date;
    if (isLower(aVersion, bVersion)) {
      return -1;
    } else if (isEqual(aVersion, bVersion)) {
      return 0;
    } else {
      return 1;
    }
  });
}
/** Converts a timeline of events into some */

/**
 * Processes a timeline of events into some form of output
 * @param timeline The timeline of events
 * @param getInput A function that takes each event and gets characteristic input data that is meant to be particular of each event
 * @param getOutput A function that takes a previous' event input data, or none if nothing previous, and the current event input data and outputs a final output
 * @returns 
 */
function processTimeline<EventInformation, EventInput, EventOutput>(timeline: TimelineEvent<EventInformation>[], getInput: <T extends EventInformation>(input: T) => EventInput, getOutput: (prev: EventInput | undefined, cur: EventInput) => EventOutput): Array<{
  date: Version,
  out: EventOutput,
  id: number
}> {
  // first part of this altgothrm:
  // labeling what each update is and breaking everything down
  // to events
  
  // maps id -> fileId
  const permanentMapping = new Map<number, EventInput>();
  const temporaryMapping = new Map<number, EventInput>();

  const eventsTimeline: Array<{
    type: 'permanent' | 'temp_start' | 'temp_end',
    id: number;
    date: Version;
  }> = [];

  let currentId = 0;

  timeline.forEach((event) => {
    if (event.type === 'permanent') {
      currentId++;
      permanentMapping.set(currentId, getInput(event));
      eventsTimeline.push({
        type: 'permanent',
        id: currentId,
        date: event.date
      });
    } else {
      currentId++;
      temporaryMapping.set(currentId, getInput(event));
      eventsTimeline.push({
        type: 'temp_start',
        id: currentId,
        date: event.start
      }, {
        type: 'temp_end',
        id: currentId,
        date: event.end
      });
    }
  });

  const sorted = sortOnProperty(eventsTimeline);

  // second part of this algorithm: going through the events
  // and judging which file is to be used at each date

  const versions: Array<{ 
    date: Version
    out: EventOutput
    id: number
  }> = [];

  let previousPermanent = -1;
  let currentPermanent = -1;
  // this acts as a queue, so there can be multiple temporary events
  let currentTemporaries: number[] = [];

  const pushPermanent = (date: string) => {
    const input = permanentMapping.get(currentPermanent);
    if (input !== undefined) {
      // no permanent room means there isn't one. So no changes will be used
      const output = getOutput(permanentMapping.get(previousPermanent), input);
      versions.push({
        date,
        out: output,
        id: currentPermanent
      });
    }
  }

  const pushTemporary = (date: string) => {
    const currentTemporary = currentTemporaries[0];
    const input = temporaryMapping.get(currentTemporary);
    if (input === undefined) {
      throw new Error('Logic error');
    }
    const permanentInput = permanentMapping.get(currentPermanent);
    const output = getOutput(permanentInput, input);
    versions.push({
      date,
      out: output,
      id: currentTemporary
    });
  }

  sorted.forEach((event) => {
    if (event.type === 'permanent') {
      previousPermanent = currentPermanent;
      currentPermanent = event.id;
      // permanent changes take effect once the temporaries are gone
      if (currentTemporaries.length === 0) {
        pushPermanent(event.date);
      }
    } else if (event.type === 'temp_start') {
      currentTemporaries.unshift(event.id);
      pushTemporary(event.date);
    } else if (event.type === 'temp_end') {
      currentTemporaries = currentTemporaries.filter((id) => id !== event.id);
      if (currentTemporaries.length === 0) {
        pushPermanent(event.date);
      } else {
        pushTemporary(event.date);
      }
    }
  });

  return versions;
}

/** Represents a singular change to the global crumbs object */
export type GlobalCrumbPatch = {
  prices?: Record<number, number>;
  music?: Partial<Record<RoomName, number>>;
  paths?: Record<string, string>;
  newMigratorStatus?: boolean;
};

export type LocalCrumbPatch = {
  paths?: Record<string, string>;
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

export type CrumbOutput<CrumbPatch> = {
  hash: string;
 crumbs: Array<{
      date: Version;
      out: Partial<CrumbPatch>;
      id: number;
  }>;
};

export function getLocalCrumbsOutput() {
  return getBaseCrumbsOutput<LocalCrumbPatch>((timeline) => {
    PARTIES.forEach((party) => {
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
          type: 'temporary',
          start: party.startDate,
          end: party.endDate,
          crumb: { paths: localPaths }
        });
      }
    })
  }, (prev, cur) => {
    return {
      paths: { ...prev.paths, ...cur.paths }
    };
  });
}

function getBaseCrumbsOutput<CrumbPatch>(timelineBuilder: (timeline: TimelineEvent<{
  crumb: Partial<CrumbPatch>
}>[]) => void, mergeCrumbs: (prev: Partial<CrumbPatch>, cur: Partial<CrumbPatch>) => Partial<CrumbPatch>) {
  const timeline: TimelineEvent<{
    crumb: Partial<CrumbPatch>
  }>[] = [
    {
      type: 'permanent',
      date: CPIP_UPDATE,
      crumb: {}
    }
  ];

  timelineBuilder(timeline);

  const crumbs = processTimeline(timeline, (input) => {
    return input.crumb
  }, (previous, current) => {
    if (previous === undefined) {
      return current;
    } else {
      return mergeCrumbs(previous, current);
    }
  });

  const hash = getMd5(JSON.stringify(crumbs))
  return { hash, crumbs };
}

/**
 * Get an output of the global crumbs timeline which includes a hash
 * identifying this timeline and the information of each version
 */
export function getGlobalCrumbsOutput() {
  return getBaseCrumbsOutput<GlobalCrumbPatch>((timeline) => {
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
  
      // we only want to add parties that are post CPIP and actually made changes
      // so we don't have excess crumb files
      let crumbChanged = false;
      if (isGreaterOrEqual(party.startDate, CPIP_UPDATE)) {
        if (party.music !== undefined) {
          crumbChanged = true;
        } else if (Object.keys(globalPaths).length > 0) {
          crumbChanged = true;
        } else if (party.activeMigrator) {
          crumbChanged = true;
        }
      }
  
      if (crumbChanged) {
        timeline.push({
          type: 'temporary',
          start: party.startDate,
          end: party.endDate,
          crumb: {
            music: party.music,
            paths: globalPaths,
            prices: {},
            newMigratorStatus: party.activeMigrator === true
          }
        });
      }
    });
  
    STAGE_TIMELINE.forEach((debut) => {
      const play = STAGE_PLAYS.find((play) => play.name === debut.name);
      if (play === undefined) {
        throw new Error(`Stage play has no music: ${debut.name}`);
      }
      timeline.push({
        type: 'permanent',
        date: debut.date,
        crumb: {
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
  });
}

/** Adds listeners to the global crumbs files */
function addCrumbs(map: TimelineMap): void {
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
  NEWSPAPERS.slice(6).forEach((newspaper) => {
    map.addPerm('play/v2/content/local/en/news/news_crumbs.swf', newspaper.date, path.join(NEWS_CRUMBS_PATH, newspaper.date + '.swf'));
  });
}

/** Converts a timeline event to the information consumed by the file server */
function getFileInformation(timeline: FileTimelineEvent[]): DynamicRouteFileInformation {
  return {
    type: 'dynamic',
    versions: processTimeline(timeline, (input) => {
      return input.file;
    }, (_, c) => c).map((version) => ({ date: version.date, file: version.out }))
  }
}

/** Given dynamic route updates that are sorted, find which file was served at a given date */
export function findFile(date: Version, info: DynamicRouteUpdate[]): string {
  if (info.length === 1) {
    return info[0].file;
  }

  let left = 0;
  // the last index is not allowed since we search in pairs
  // and then -1 because length is last index + 1
  let right = info.length - 2;
  let index = -1;
  
  // this is a type of binary search implementation
  while (true) {
    // this means that was lower than index 0
    if (right === -1) {
      index = -1;
      break
    } else if (left === info.length - 1) {
      // this means that was higher than last index
      index = left;
      break;
    }
    const middle = Math.floor((left + right) / 2);
    const element = info[middle];
    if (isLower(date, element.date)) {
      // middle can't be it, but middle - 1 could still be
      right = middle - 1;
    } else if (isLower(date, info[middle + 1].date)) {
      index = middle;
      break;
    } else {
      left = middle + 1;
    }
  }

  if (index === -1) {
    console.log(info);
    throw new Error(`Version ${date} could not find a file in info`);
  } else {
    return info[index].file;
  }
}

function addStadiumUpdates(map: TimelineMap): void {
  STADIUM_UPDATES.forEach((update) => {
    const date = update.date;
    map.addPerm('play/v2/content/global/content/map.swf', date, update.mapFileId);
    map.addPerm('play/v2/content/global/rooms/town.swf', date, update.townFileId);
    map.addPerm('play/v2/content/global/rooms/forts.swf', date, update.fortsFileId);
    map.addPerm('play/v2/content/global/rooms/rink.swf', date, update.rinkFileId);
    map.addPerm('play/v2/content/local/en/catalogues/sport.swf', date, update.catalogFileId);
  });
}

function addIngameMapInfo(map: TimelineMap): void {

  map.addPerm(PRECPIP_MAP_PATH, BETA_RELEASE, ORIGINAL_MAP);
}

function addStandaloneChanges(map: TimelineMap): void {
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
    })
  });
}

function addMapUpdates(map: TimelineMap): void {
  MAP_UPDATES.forEach((update) => {
    map.addPerm(PRECPIP_MAP_PATH, update.date, update.fileId);
  })
}

function addCatalogues(map: TimelineMap): void {
  const addCatalogue = (route: string, catalogs: Record<string, number>) => {
    Object.entries(catalogs).forEach((pair) => {
      const [date, fileId] = pair;
      
      map.addPerm(route, date, fileId);
    })
  }

  addCatalogue('play/v2/content/local/en/catalogues/clothing.swf', CPIP_CATALOGS);
  addCatalogue('play/v2/content/local/en/catalogues/furniture.swf', FURNITURE_CATALOGS);
  addCatalogue('play/v2/content/local/en/catalogues/igloo.swf', IGLOO_CATALOGS);
}

function addMusicLists(map: TimelineMap): void {
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

function addStagePlays(map: TimelineMap): void {
  STAGE_TIMELINE.forEach((debut) => {
    const date = debut.date;

    // Stage itself
    map.addPerm('play/v2/content/global/rooms/stage.swf', date, debut.stageFileId);

    if (debut.plazaFileId !== null) {
      // Plaza
      map.addPerm('play/v2/content/global/rooms/plaza.swf', date, debut.plazaFileId);
    }

    map.addPerm('play/v2/content/local/en/catalogues/costume.swf', date, debut.costumeTrunkFileId);
  })
}

/** Get the object which knows all the file information needed to find the file for a given route */
export function getFileServer(): Map<string, RouteFileInformation> {
  const timelines = new TimelineMap();

  const processors = [
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
    addCrumbs
  ];

  processors.forEach((fn) => fn(timelines));
  
  const fileServer = timelines.getRouteMap();
  addStaticFiles(fileServer);

  return fileServer;
}