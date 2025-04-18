import path from "path";
import { PATHS, PRECPIP_MAP_PATH } from "../data/paths";
import { PRE_CPIP_STATIC_FILES } from "../data/precpip-static";
import { isEqual, isLower, Version } from "./versions";
import { FileCategory, FILES } from "../data/files";
import { PACKAGES } from "../data/packages";
import { FIRST_UPDATE, UPDATES } from "../data/updates";
import { RoomName, ROOMS } from "../data/rooms";
import { ORIGINAL_MAP, ORIGINAL_ROOMS } from "../data/release-features";
import { STANDALONE_CHANGE } from "../data/standalone-changes";
import { STATIC_SERVERS } from "../data/static-servers";

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
  if (map.has(cleanPath)) {
    throw new Error(`Path ${cleanPath} is being duplicated`);
  } else {
    map.set(cleanPath, info);
  }
}

/** Given a path id, get a full route */
function getRoutePath(pathId: number): string {
  let fullPath = '';
  let nextId: number | null = pathId;
  while (nextId !== null) {
    const currentPath = PATHS.get(nextId);
    if (currentPath === undefined) {
      throw new Error(`Incorrect path: ${nextId}`);
    }
    fullPath = path.join(currentPath.name, fullPath);
    nextId = currentPath.parentId;
  }
  return fullPath;
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

function addStaticFiles(map: RouteMap): void {
  PRE_CPIP_STATIC_FILES.rows.forEach((row) => {
    const route = getRoutePath(row.path);
    const filePath = getMediaFilePath(row.file);
    addToRouteMap(map, route, filePath);
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

function addRoomInfo(map: TimelineMap): void {
  const firstUpdate = UPDATES.getStrict(FIRST_UPDATE);
  
  for (const roomName in ROOMS) {
    const room = ROOMS[roomName as RoomName];
    const originalRoomFile = ORIGINAL_ROOMS[roomName as RoomName];
    if (originalRoomFile !== undefined) {
      // adding rooms that were there from the start
      addToTimeline(map, getRoutePath(room.preCpipPath), {
        type: 'permanent',
        date: firstUpdate.time,
        file: originalRoomFile
      })
    }
  }
}

/** Converts a timeline event to the information consumed by the file server */
function getFileInformation(timeline: TimelineEvent[]): DynamicRouteFileInformation {
  const unsorted: DynamicRouteUpdate[] = [];
  timeline.forEach((event) => {
    // not accounting for temporary yet
    if (event.type === 'permanent') {
      const file = getMediaFilePath(event.file);
      unsorted.push({
        date: event.date,
        file
      });
    }
  })

  const versions = unsorted.sort((a, b) => {
    const aVersion = a.date;
    const bVersion = b.date;
    if (isLower(aVersion, bVersion)) {
      return -1;
    } else if (isEqual(aVersion, bVersion)) {
      return 0;
    } else {
      return 1;
    }
  })

  return {
    type: 'dynamic',
    versions
  }
}

/** Given dynamic route updates that are sorted, find which file was served at a given date */
export function findFile(date: Version, info: DynamicRouteUpdate[]): string {
  let left = 0;
  let right = info.length;
  let index = -1;
  // this is a type of binary search implementation
  while (true) {
    // -1 because the rightmost shouldn't be included, since we look for ranges
    const middle = Math.floor((left + right - 1) / 2);
    if (middle === left) {
      index = left;
      break;
    } else if (middle === right) {
      index = -1;
      break;
    }
    const element = info[middle];
    if (isLower(date, element.date)) {
      right = middle;
    } else if (isLower(date, info[middle + 1].date)) {
      index = middle;
      break;
    } else {
      left = middle;
    }
  }

  if (index === -1) {
    throw new Error(`Version ${date} could not find a file in info: ${info}`);
  } else {
    return info[index].file;
  }
}

function AddIngameMapInfo(map: TimelineMap): void {
  const firstUpdate = UPDATES.getStrict(FIRST_UPDATE);
  const mapPath = getRoutePath(PATHS.getStrict(PRECPIP_MAP_PATH).id);

  addToTimeline(map, mapPath, {
    date: firstUpdate.time,
    file: ORIGINAL_MAP,
    type: 'permanent'
  })
}

function addStandaloneChanges(map: TimelineMap): void {
  const changes = STANDALONE_CHANGE.rows;
  changes.forEach((change) => {
    const route = getRoutePath(change.pathId);
    const update = UPDATES.getStrict(change.updateId);
    addToTimeline(map, route, {
      type: 'permanent',
      date: update.time,
      file: change.fileId
    })
  })
}

/** Get the object which knows all the file information needed to find the file for a given route */
export function getFileServer(): Map<string, RouteFileInformation> {
  const timelines = new Map<string, FileTimeline>();

  addRoomInfo(timelines);
  AddIngameMapInfo(timelines);
  addStandaloneChanges(timelines);

  const fileServer = new Map<string, RouteFileInformation>();
  addStaticFiles(fileServer);
  timelines.forEach((timeline, route) => {
    addToRouteMap(fileServer, route, getFileInformation(timeline))
  });

  return fileServer;
}