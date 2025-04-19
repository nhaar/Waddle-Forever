import path from "path";
import { PRE_CPIP_STATIC_FILES } from "../data/precpip-static";
import { isEqual, isLower, Version } from "./versions";
import { FileCategory, FILES } from "../data/files";
import { PACKAGES } from "../data/packages";
import { CPIP_UPDATE, FIRST_UPDATE, UPDATES } from "../data/updates";
import { RoomName, ROOMS } from "../data/rooms";
import { ORIGINAL_MAP, ORIGINAL_ROOMS } from "../data/release-features";
import { STANDALONE_CHANGE } from "../data/standalone-changes";
import { STATIC_SERVERS } from "../data/static-servers";
import { ROOM_OPENINGS, ROOM_UPDATES } from "../data/room-updates";
import { MAP_UPDATES, PRECPIP_MAP_PATH } from "../data/game-map";
import { CrumbIndicator, PARTIES, RoomChanges } from "../data/parties";
import { MUSIC_IDS, PRE_CPIP_MUSIC_PATH } from "../data/music";
import { CPIP_STATIC_FILES } from "../data/cpip-static";
import { FALLBACKS } from "../data/fallbacks";
import { CPIP_CATALOGS } from "../game/catalogues";
import { STAGE_TIMELINE } from "../game/stage-plays";

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
  const cleanPath = route.replaceAll('\\', '/');
  const previousValue = map.get(cleanPath);
  if (previousValue === undefined) {
    map.set(cleanPath, info);
  } else {
    if (typeof previousValue === 'string' || typeof info === 'string') {
      console.log(previousValue, info);
      throw new Error(`Path ${cleanPath} is being duplicated`);
    } else {
      if (info.type === 'dynamic' && previousValue.type === 'dynamic') {
        map.set(cleanPath, {
          type: 'dynamic',
          versions: sortOnProperty([...info.versions, ...previousValue.versions])
        })
      } else if (info.type === 'special' && previousValue.type === 'special') {
        map.set(cleanPath, {
          type: 'special',
          versions: sortOnProperty([...info.versions, ...previousValue.versions])
        })
      } else {
        console.log(previousValue, info);
        throw new Error('Incompatible dynamic and special types being assigned');
      }
    }
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
    const date = getUpdateDate(FIRST_UPDATE);
    addToTimeline(map, route, {
      type: 'permanent',
      date,
      file: fileId
    });
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
  const firstUpdate = UPDATES.getStrict(FIRST_UPDATE).time;
  FALLBACKS.forEach((pair) => {
    const [route, fileId] = pair;
    addToTimeline(map, route, {
      type: 'permanent',
      date: firstUpdate,
      file: fileId
    });
  })
}

/** A single event in a timeline of updates of a file */
type TimelineEvent = {
  type: 'temporary';
  start: Version;
  end: Version;
  file: number;
} | {
  type: 'permanent',
  date: Version,
  file: number;
};

type FileTimeline = Array<TimelineEvent>;

/** Maps for each route its file timeline */
type TimelineMap = Map<string, FileTimeline>;

/** Add a file update event to a timeline map for a given route */
function addToTimeline(map: TimelineMap, route: string, event: TimelineEvent): void {
  const prev = map.get(route);
  if (prev === undefined) {
    map.set(route, [event]);
  } else {
    prev.push(event);
  }
}

function getUpdateDate(updateId: number): string {
  const update = UPDATES.getStrict(updateId);
  return update.time;
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
  const cpipUpdate = UPDATES.getStrict(CPIP_UPDATE).time;
  return isLower(date, cpipUpdate) ? getPreCpipRoomRoute(room) : getCpipRoomRoute(room);
}

function addRoomInfo(map: TimelineMap): void {
  const firstUpdate = UPDATES.getStrict(FIRST_UPDATE);
  
  for (const roomName in ROOMS) {
    const originalRoomFile = ORIGINAL_ROOMS[roomName as RoomName];
    if (originalRoomFile !== undefined) {
      // adding rooms that were there from the start
      addToTimeline(map, getPreCpipRoomRoute(roomName as RoomName), {
        type: 'permanent',
        date: firstUpdate.time,
        file: originalRoomFile
      })
    }
  }

  const addRoomChange = (room: RoomName, updateId: number, fileId: number) => {
    const date = getUpdateDate(updateId);
    const route = getRoomRoute(date, room);
    addToTimeline(map, route, {
      type: 'permanent',
      date,
      file: fileId
    })
  }

  ROOM_OPENINGS.forEach((opening) => {
    addRoomChange(opening.room, opening.updateId, opening.fileId);
  })

  ROOM_UPDATES.forEach((update) => {
    addRoomChange(update.room, update.updateId, update.fileId);
  });
}

function addParties(map: TimelineMap): void {
  const addRoomChanges = (roomChanges: RoomChanges, start: Version, end: Version) => {
    for (const room in roomChanges) {
      const fileId = roomChanges[room as RoomName]!;
      const roomRoute = getRoomRoute(start, room as RoomName);
      addToTimeline(map, roomRoute, {
        type: 'temporary',
        start,
        end,
        file: fileId
      })
    }
  }
  
  PARTIES.forEach((party) => {
    const startDate = getUpdateDate(party.startUpdateId);
    const endDate = getUpdateDate(party.endUpdateId);
    const pushCrumbChange = (baseRoute: string, route: string, info: number | CrumbIndicator) => {
      const fileId = typeof info === 'number' ? info : info[0];
      addToTimeline(map, path.join(baseRoute, route), {
        type: 'temporary',
        start: startDate,
        end: endDate,
        file: fileId
      });
    }

    addRoomChanges(party.roomChanges, startDate, endDate);
    if (party.localChanges !== undefined) {
      Object.entries(party.localChanges).forEach((pair) => {
        const [route, languages] = pair;
        Object.entries(languages).forEach((changePair) => {
          const [language, info] = changePair;
          pushCrumbChange(path.join('play/v2/content/local', language), route, info);
        });
      })
    }
    if (party.globalChanges !== undefined) {
      Object.entries(party.globalChanges).forEach((pair) => {
        const [route, info] = pair;
        pushCrumbChange('play/v2/content/global', route, info);
      })
    }
    if (party.construction !== undefined) {
      const constructionStart = getUpdateDate(party.construction.updateId);
      addRoomChanges(party.construction.changes, constructionStart, endDate);
    }

    if (party.scavengerHunt2010) {
      // enabling the scavenger hunt dependency file
      addToTimeline(map, 'play/v2/client/dependencies.json', {
        type: 'temporary',
        start: startDate,
        end: endDate,
        file: 2384
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

/** Converts a timeline event to the information consumed by the file server */
function getFileInformation(timeline: TimelineEvent[]): DynamicRouteFileInformation {
  // first part of this altgothrm:
  // labeling what each update is and breaking everything down
  // to events
  
  // maps id -> fileId
  const permanentMapping = new Map<number, string>();
  const temporaryMapping = new Map<number, string>();

  const eventsTimeline: Array<{
    type: 'permanent' | 'temp_start' | 'temp_end',
    id: number;
    date: Version;
  }> = [];

  let permanentId = 0;
  let temporaryId = 0;

  timeline.forEach((event) => {
    if (event.type === 'permanent') {
      permanentId++;
      permanentMapping.set(permanentId, getMediaFilePath(event.file));
      eventsTimeline.push({
        type: 'permanent',
        id: permanentId,
        date: event.date
      });
    } else {
      temporaryId++;
      temporaryMapping.set(temporaryId, getMediaFilePath(event.file));
      eventsTimeline.push({
        type: 'temp_start',
        id: temporaryId,
        date: event.start
      }, {
        type: 'temp_end',
        id: temporaryId,
        date: event.end
      });
    }
  });

  const sorted = sortOnProperty(eventsTimeline);

  // second part of this algorithm: going through the events
  // and judging which file is to be used at each date

  const versions: DynamicRouteUpdate[] = [];

  let currentPermanent = -1;
  // this acts as a queue, so there can be multiple temporary events
  let currentTemporaries: number[] = [];

  const pushPermanent = (date: string) => {
    const file = permanentMapping.get(currentPermanent);
    if (file !== undefined) {
      // no permanent room means there isn't one. So no changes will be used
      versions.push({
        date,
        file
      });
    }
  }

  const pushTemporary = (date: string) => {
    const currentTemporary = currentTemporaries[0];
    const file = temporaryMapping.get(currentTemporary);
    if (file === undefined) {
      throw new Error('Logic error');
    }
    versions.push({
      date,
      file
    });
  }

  sorted.forEach((event) => {
    if (event.type === 'permanent') {
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

  return {
    type: 'dynamic',
    versions
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
    throw new Error(`Version ${date} could not find a file in info: ${info}`);
  } else {
    return info[index].file;
  }
}

function addIngameMapInfo(map: TimelineMap): void {
  const firstUpdate = UPDATES.getStrict(FIRST_UPDATE);

  addToTimeline(map, PRECPIP_MAP_PATH, {
    date: firstUpdate.time,
    file: ORIGINAL_MAP,
    type: 'permanent'
  })
}

function addStandaloneChanges(map: TimelineMap): void {
  STANDALONE_CHANGE.forEach((change) => {
    const update = UPDATES.getStrict(change.updateId);
    addToTimeline(map, change.route, {
      type: 'permanent',
      date: update.time,
      file: change.fileId
    })
  })
}

function addMapUpdates(map: TimelineMap): void {
  MAP_UPDATES.forEach((update) => {
    const time = getUpdateDate(update.updateId);
    addToTimeline(map, PRECPIP_MAP_PATH, {
      type: 'permanent',
      date: time,
      file: update.fileId
    })
  })
}

function addCatalogues(map: TimelineMap): void {
  Object.entries(CPIP_CATALOGS).forEach((pair) => {
    const [updateId, fileId] = pair;
    
    addToTimeline(map, 'play/v2/content/local/en/catalogues/clothing.swf', {
      type: 'permanent',
      date: getUpdateDate(Number(updateId)),
      file: fileId
    });
  })
}

function addStagePlays(map: TimelineMap): void {
  STAGE_TIMELINE.forEach((debut) => {
    const date = getUpdateDate(debut.updateId);

    // Stage itself
    addToTimeline(map, 'play/v2/content/global/rooms/stage.swf', {
      type: 'permanent',
      date,
      file: debut.stageFileId
    });

    if (debut.plazaFileId !== null) {
      // Plaza
      addToTimeline(map, 'play/v2/content/global/rooms/plaza.swf', {
        type: 'permanent',
        date,
        file: debut.plazaFileId
      });
    }

    addToTimeline(map, 'play/v2/content/local/en/catalogues/costume.swf', {
      type: 'permanent',
      date,
      file: debut.costumeTrunkFileId
    });
  })
}

/** Get the object which knows all the file information needed to find the file for a given route */
export function getFileServer(): Map<string, RouteFileInformation> {
  const timelines = new Map<string, FileTimeline>();

  addRoomInfo(timelines);
  addIngameMapInfo(timelines);
  addStandaloneChanges(timelines);
  addMapUpdates(timelines);
  addParties(timelines);
  addMusicFiles(timelines);
  addFallbacks(timelines);
  addCatalogues(timelines);
  addStagePlays(timelines);
  
  const fileServer = new Map<string, RouteFileInformation>();
  addStaticFiles(fileServer);
  timelines.forEach((timeline, route) => {
    addToRouteMap(fileServer, route, getFileInformation(timeline))
  });

  return fileServer;
}