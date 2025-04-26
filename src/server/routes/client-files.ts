import path from "path";
import crypto from 'crypto';
import hash from 'object-hash';

import { PRE_CPIP_STATIC_FILES } from "../data/precpip-static";
import { isEqual, isGreater, isGreaterOrEqual, isLower, isLowerOrEqual, Version } from "./versions";
import { FileCategory, FILES } from "../data/files";
import { PACKAGES } from "../data/packages";
import { RoomName, ROOMS } from "../data/rooms";
import { ORIGINAL_MAP, ORIGINAL_ROOMS } from "../data/release-features";
import { STANDALONE_CHANGE, STANDALONE_TEMPORARY_CHANGE } from "../data/standalone-changes";
import { STATIC_SERVERS } from "../data/static-servers";
import { ROOM_MUSIC_TIMELINE, ROOM_OPENINGS, ROOM_UPDATES, TEMPORARY_ROOM_UPDATES } from "../data/room-updates";
import { MAP_PATH_07, MAP_UPDATES, PRECPIP_MAP_PATH } from "../data/game-map";
import { CrumbIndicator, PARTIES, Party, PartyChanges, RoomChanges } from "../data/parties";
import { MUSIC_IDS, PRE_CPIP_MUSIC_PATH } from "../data/music";
import { CPIP_STATIC_FILES } from "../data/cpip-static";
import { FALLBACKS } from "../data/fallbacks";
import { CPIP_CATALOGS, FURNITURE_CATALOGS, IGLOO_CATALOGS } from "../data/catalogues";
import { STAGE_PLAYS, STAGE_TIMELINE } from "../game/stage-plays";
import { IGLOO_LISTS } from "../game/igloo-lists";
import { BETA_RELEASE, CAVE_OPENING_START, CPIP_UPDATE, EPF_RELEASE, PRE_CPIP_REWRITE_DATE } from "../data/updates";
import { STADIUM_UPDATES } from "../data/stadium-updates";
import { As2Newspaper, AS2_NEWSPAPERS, PRE_BOILER_ROOM_PAPERS, AS3_NEWSPAPERS } from "../data/newspapers";
import { CPIP_AS3_STATIC_FILES } from "../data/cpip-as3-static";
import { getNewspaperName } from "../game/news.txt";
import { PINS } from "../data/pins";

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
    const fileName = String(musicId) + '.swf';
    const route = path.join(PRE_CPIP_MUSIC_PATH, fileName);
    map.addPerm(route, BETA_RELEASE, fileId);
    map.addPerm(path.join('media', route), BETA_RELEASE, fileId);
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

function addNewspapers(map: RouteMap): void {
  const preBoilerPapers = PRE_BOILER_ROOM_PAPERS.length;
  AS2_NEWSPAPERS.forEach((news, index) => {
    if (news.fileId !== undefined) {
      const filePath = getMediaFilePath(news.fileId);
      const issueNumber = index + preBoilerPapers + 1;
      if (isNewspaperBeforeCPIP(news)) {
        addToRouteMap(map, `artwork/news/news${issueNumber}.swf`, filePath);
        const route2007 = getNewspaperName(news.date).replace('|', '/') + '.swf';
        addToRouteMap(map, path.join('media/artwork/news', route2007), filePath);
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

function addStaticFiles(map: RouteMap): void {
  const addStatic = (stat: Record<string, number>) => {
    Object.entries(stat).forEach((pair) => {
      const [route, fileId] = pair;
      const filePath = getMediaFilePath(fileId);
      addToRouteMap(map, route, filePath);
    })
  }

  addStatic(PRE_CPIP_STATIC_FILES);
  addStatic(CPIP_STATIC_FILES);
  addStatic(CPIP_AS3_STATIC_FILES);
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

function addRoomRoute(map: TimelineMap, date: string, room: RoomName, file: number) {
  if (isLower(date, CPIP_UPDATE)) {
    const roomInfo = ROOMS[room];
    const fileName = `${room}${roomInfo.preCpipFileNumber}.swf`
    map.addPerm(path.join('media/artwork/rooms', `${room}.swf`), date, file);
    map.addPerm(path.join('artwork/rooms', fileName), date, file);
  } else {
    map.addPerm(path.join('play/v2/content/global/rooms', `${room}.swf`), date, file);
  }
}

const SCAVENGER_ICON_PATH = 'scavenger_hunt/scavenger_hunt_icon.swf';
const TICKET_ICON_PATH = 'tickets.swf';
const TICKET_INFO_PATH = 'ticket_info.swf';

function addTempRoomRoute(map: TimelineMap, start: string, end: string, room: RoomName, file: number) {
  if (isLower(start, CPIP_UPDATE)) {
    const roomInfo = ROOMS[room];
    const fileName = `${room}${roomInfo.preCpipFileNumber}.swf`
    map.addTemp(path.join('media/artwork/rooms', `${room}.swf`), start, end, file);
    map.addTemp(path.join('artwork/rooms', fileName), start, end, file);
  } else {
    map.addTemp(path.join('play/v2/content/global/rooms', `${room}.swf`), start, end, file);
  }
}

function addRoomInfo(map: TimelineMap): void {
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
  })

  ROOM_UPDATES.forEach((update) => {
    addRoomChange(update.room, update.date, update.fileId);
  });

  Object.entries(TEMPORARY_ROOM_UPDATES).forEach((pair) => {
    const [room, updates] = pair;
    const roomName = room as RoomName;
    updates.forEach((update) => {
      addTempRoomRoute(map, update.date, update.end, roomName, update.fileId);
    })
  })
}

function addParties(map: TimelineMap): void {
  const addRoomChanges = (roomChanges: RoomChanges, start: Version, end: Version) => {
    for (const room in roomChanges) {
      const fileId = roomChanges[room as RoomName]!;
      addTempRoomRoute(map, start, end, room as RoomName, fileId);
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

    // adding just any route change in general for the party
    if (changes.generalChanges !== undefined) {
      Object.entries(changes.generalChanges).forEach((pair) => {
        const [route, fileId] = pair;
        map.addTemp(route, start, end, fileId);
      });
    }
  }
  
  PARTIES.forEach((party) => {
    const startDate = party.startDate;
    const endDate = party.endDate;
    addPartyChanges(startDate, endDate, {
      roomChanges: party.roomChanges,
      localChanges: party.localChanges,
      globalChanges: party.globalChanges,
      generalChanges: party.generalChanges
    });
    if (party.construction !== undefined) {
      const constructionStart = party.construction.date;
      addRoomChanges(party.construction.changes, constructionStart, endDate);
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
        addPartyChanges(update.date, endDate, {
          roomChanges: update.roomChanges,
          localChanges: update.localChanges,
          globalChanges: update.globalChanges,
          generalChanges: update.generalChanges
        });
      })
    }

    if (party.scavengerHunt2007 !== undefined) {
      map.addTemp('media/artwork/eggs/1.swf', startDate, endDate, party.scavengerHunt2007);
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
 * @param hashOutput A function that creates a unique identifier for a given output, to be able to hash it
 * @returns 
 */
function processTimeline<EventInformation, EventInput, EventOutput>(
  timeline: TimelineEvent<EventInformation>[],
  getInput: <T extends EventInformation>(input: T) => EventInput,
  getOutput: (prev: EventInput | undefined, cur: EventInput) => EventOutput,
  hashOutput: (out: EventOutput) => string
): Array<{
  date: Version,
  out: EventOutput,
  id: number
}> {
  // first part of this altgothrm:
  // labeling what each update is and breaking everything down
  // to events
  
  // get id of event input so we can find them later
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

  // sort needs to be a bit more than just the date;
  // if on the same day, the priority is permanent->temp end->temp start
  const sorted = eventsTimeline.sort((a, b) => {
    const aVersion = a.date;
    const bVersion = b.date;
    if (isLower(aVersion, bVersion)) {
      return -1;
    } else if (isEqual(aVersion, bVersion)) {
      if (a.type === b.type) {
        return 0;
      }
      if (a.type === 'permanent') {
        return -1;
      }
      if (b.type === 'permanent') {
        return 1;
      }
      if (a.type === 'temp_end') {
        return -1;
      }
      if (b.type === 'temp_end') {
        return 1;
      }
      return 0;
    } else {
      return 1;
    }
  });

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

  // we will assign IDs to the output so that we can tell which of the outputs
  // represent the exact same state (discerned via the "hashing" function)
  let outputId = 0;
  const outputs = new Map<string, number>();

  const getOutputId = (output: EventOutput) => {
    const hash = hashOutput(output);
    const id = outputs.get(hash);
    
    if (id === undefined) {
      outputId++;
      outputs.set(hash, outputId);
      return outputId;
    } else {
      return id;
    }
  }

  const pushPermanent = (date: string) => {
    const input = permanentMapping.get(currentPermanent);
    if (input !== undefined) {
      // no permanent room means there isn't one. So no changes will be used
      const output = getOutput(permanentMapping.get(previousPermanent), input);
      const id = getOutputId(output);
      versions.push({
        date,
        out: output,
        id
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
    const id = getOutputId(output);
    versions.push({
      date,
      out: output,
      id
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

function getBaseCrumbsOutput<CrumbPatch>(
  timelineBuilder: (timeline: TimelineEvent<{
    crumb: Partial<CrumbPatch>
  }>[]) => void,
  mergeCrumbs: (prev: Partial<CrumbPatch>, cur: Partial<CrumbPatch>) => Partial<CrumbPatch>,
  getFirstCrumb?: () => Partial<CrumbPatch>
) {
  const timeline: TimelineEvent<{
    crumb: Partial<CrumbPatch>
  }>[] = [
    {
      type: 'permanent',
      date: CPIP_UPDATE,
      crumb: getFirstCrumb === undefined ? {} : getFirstCrumb()
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
  }, (out) => {
    // this is a third party function that can properly hash objects
    // even if their property order isn't the same
    return hash(out);
  });

  const crumbsHash = getMd5(JSON.stringify(crumbs))
  return { hash: crumbsHash, crumbs };
}

export function getMusicForDate(date: Version): Partial<Record<RoomName, number>> {
  const music: Partial<Record<RoomName, number>> = {};
  // regular room IDs
  Object.entries(ROOM_MUSIC_TIMELINE).forEach((pair) => {
    const [room, timeline] = pair;
    const roomName = room as RoomName;
    const [firstSong, ...otherSongs] = timeline;
    let song = firstSong;
    const songIndex = findEarliestDateHitIndex(date, otherSongs);
    if (songIndex > -1) {
      song = otherSongs[songIndex].musicId;
    }
    music[roomName] = song;
  });
  return music;
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

    Object.entries(ROOM_MUSIC_TIMELINE).forEach((pair) => {
      const [room, musicTimeline] = pair;
      const [_, ...otherSongs] = musicTimeline;
      otherSongs.forEach((update) => {
        if (isGreater(update.date, CPIP_UPDATE)) {
          timeline.push({
            type: 'permanent',
            date: update.date,
            crumb: {
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
  }, () => {
    return {
      music: getMusicForDate(CPIP_UPDATE)
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
  [...AS2_NEWSPAPERS.slice(6), ...AS3_NEWSPAPERS].forEach((newspaper) => {
    map.addPerm('play/v2/content/local/en/news/news_crumbs.swf', newspaper.date, path.join(NEWS_CRUMBS_PATH, newspaper.date + '.swf'));
  });
}

/** Converts a timeline event to the information consumed by the file server */
function getFileInformation(timeline: FileTimelineEvent[]): DynamicRouteFileInformation {
  return {
    type: 'dynamic',
    versions: processTimeline(timeline, (input) => {
      return input.file;
    }, (_, c) => c, (out) => out).map((version) => ({ date: version.date, file: version.out }))
  }
}

export function findEarliestDateHitIndex<T extends { date: Version }>(date: Version, array: T[]): number {
  if (array.length < 2) {
    if (array.length === 1) {
      if (isLower(date, array[0].date)) {
        return -1
      } else {
        return 0;
      }
    } else {
      // empty array
      return -1;
    }
  }

  let left = 0;
  // the last index is not allowed since we search in pairs
  // and then -1 because length is last index + 1
  let right = array.length - 2;
  let index = -1;
  
  // this is a type of binary search implementation
  while (true) {
    // this means that was lower than index 0
    if (right === -1) {
      index = -1;
      break
    } else if (left === array.length - 1) {
      // this means that was higher than last index
      index = left;
      break;
    }
    const middle = Math.floor((left + right) / 2);
    const element = array[middle];
    if (isLower(date, element.date)) {
      // middle can't be it, but middle - 1 could still be
      right = middle - 1;
    } else if (isLower(date, array[middle + 1].date)) {
      index = middle;
      break;
    } else {
      left = middle + 1;
    }
  }

  return index;
}

export function findCurrentParty(date: Version): Party | null {
  const partyIndex = findEarliestDateHitIndex(date, PARTIES.map((p) => ({ ...p, date: p.startDate })));

  if (partyIndex > -1) {
    if (isLowerOrEqual(PARTIES[partyIndex].startDate, date) && isLower(date, PARTIES[partyIndex].endDate)) {
      return PARTIES[partyIndex];
    }
  }


  return null;
}

/** Given dynamic route updates that are sorted, find which file was served at a given date */
export function findFile(date: Version, info: DynamicRouteUpdate[]): string {
  if (info.length === 1) {
    return info[0].file;
  }

  const index = findEarliestDateHitIndex(date, info);
  if (index === -1) {
    console.log(info);
    throw new Error(`Version ${date} could not find in array`);
  }

  return info[index].file;
}

function addStadiumUpdates(map: TimelineMap): void {
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
      if (update.updates !== undefined) {
        update.updates.forEach((newUpdate) => {
          map.addTemp(route, newUpdate.date, update.endDate, newUpdate.fileId);
        })
      }
    })
  });
}

function addMapUpdates(map: TimelineMap): void {
  MAP_UPDATES.forEach((update) => {
    if (isLower(update.date, CPIP_UPDATE)) {
      map.addPerm(PRECPIP_MAP_PATH, update.date, update.fileId);
      // TODO would be best to only include the maps that end up factually being used
      map.addPerm(MAP_PATH_07, update.date, update.fileId);
    } else {
      map.addPerm('play/v2/content/global/content/map.swf', update.date, update.fileId);
    }
  });
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

function addPins(map: TimelineMap): void {
  PINS.forEach((pin) => {
    if ('room' in pin && pin.fileId !== undefined) {
      addTempRoomRoute(map, pin.date, pin.end, pin.room, pin.fileId);
    }
  });
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

export function getPinFrames(date: Version): [RoomName, number] | null {
  const pinIndex = findEarliestDateHitIndex(date, PINS);
  if (pinIndex === -1) {
    return null;
  }
  const pin = PINS[pinIndex];
  if ('room' in pin && pin.frame !== undefined && isLower(date, pin.end)) {
    return [pin.room, pin.frame];
  }
  return null;
}

function addStagePlays(map: TimelineMap): void {
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
    map.addPerm('media/artwork/catalogue/costume_0712.swf', date, debut.costumeTrunkFileId);
    // TODO only add costrume trunks to each specific engine
    map.addPerm('play/v2/content/local/en/catalogues/costume.swf', date, debut.costumeTrunkFileId);
  })
}

/** Get the object which knows all the file information needed to find the file for a given route */
export function getFileServer(): Map<string, RouteFileInformation> {
  const timelines = new TimelineMap();

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
    addCrumbs
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