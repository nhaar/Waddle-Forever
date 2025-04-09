import path from 'path';
import fs from 'fs';
import { Request, Router } from "express";
import { GameVersion, SettingsManager } from "./settings";
import { isGreaterOrEqual, isLower, sortVersions } from './routes/versions';
import { DEFAULT_DIRECTORY, MEDIA_DIRECTORY } from '../common/utils';

type GetCallback = (settings: SettingsManager, route: string) => string | undefined

type DirCallback = (settings: SettingsManager, dirPath: string) => string | undefined

type DataCallback = (settings: SettingsManager) => string

type PathRepresentation = string | string[]

type RouteMap = Array<[HttpRouter, string]>

type Alternator = [string, ...string[]]

type AlternatorMap = Array<[string, string]>

type Spacer = [GameVersion, GameVersion, ...string[]]

type SpacerMap = Array<[GameVersion, GameVersion, string]>

const SEASONAL_NAME = 'seasonal';

/** Assigns files to date intervals that start when the previous ends */
export function alternating(routers: HttpRouter[], alternators: Alternator[]) {
  const getHandler = (map: AlternatorMap) =>  {
    return (s: SettingsManager): string | undefined => {
      if (isLower(s.settings.version, map[0][0])) {
        return undefined;
      }
      for (let i = 0; i < map.length - 1; i++) {
        if (isLower(s.settings.version, map[i + 1][0])) {
          return map[i][1];
        }
      }

      return map.slice(-1)[0][1];
    }
  }
  const map = new Map<HttpRouter, AlternatorMap>()
  for (const alternator of alternators) {
    const targetPaths = alternator.slice(1);
    if (routers.length !== targetPaths.length) {
      throw new Error('Number of routers doesn\'t match number of specified targets');
    }
    for (let i = 0; i < targetPaths.length; i++) {
      let currentMap = map.get(routers[i]);
      if (currentMap === undefined) {
        currentMap = []
      }
      currentMap.push([alternator[0], targetPaths[i]]);
      map.set(routers[i], currentMap);
    }
  }

  map.forEach((value, key) => {
    if (key.file) {
      key.get('', getHandler(value))
    } else {
      key.dir('', getHandler(value))
    }
  })
}

/** Assigns files in a date intervals in which you can leave space out between them */
export function spaced(routers: HttpRouter[], spacers: Spacer[]) {
  const getHandler = (map: SpacerMap) =>  {
    return (s: SettingsManager): string | undefined => {
      for (const interval of map) {
        if (isLower(s.settings.version, interval[0])) {
          return undefined
        }
        if (isLower(s.settings.version, interval[1])) {
          return interval[2];
        }
      }
      
      return undefined;
    }
  }
  const map = new Map<HttpRouter, SpacerMap>()
  for (const spacer of spacers) {
    const targetPaths = spacer.slice(2);
    if (routers.length !== targetPaths.length) {
      throw new Error('Number of routers doesn\'t match number of specified targets');
    }
    for (let i = 0; i < targetPaths.length; i++) {
      let currentMap = map.get(routers[i]);
      if (currentMap === undefined) {
        currentMap = []
      }
      currentMap.push([spacer[0], spacer[1], targetPaths[i]]);
      map.set(routers[i], currentMap);
    }
  }

  map.forEach((value, key) => {
    if (key.file) {
      key.get('', getHandler(value))
    } else {
      key.dir('', getHandler(value))
    }
  })
}

/** Assigns files to routers in a given date interval */
export function range(start: GameVersion, end: GameVersion, routeMaps: RouteMap) {
  const routers: HttpRouter[] = [];
  const targets: string[] = [];

  for (const routeMap of routeMaps) {
    routers.push(routeMap[0]);
    targets.push(routeMap[1]);
  }
  
  spaced(routers, [
    [start, end, ...targets]
  ])
}

function processPathRepresentation(repr: PathRepresentation): string[] {
  if (typeof repr === 'string') {
    // considering both forward and backward slashes
    return repr.split(/[/\\]/);
  }
  return repr;
}

function getExpressRoute(route: string[]): string {
  // filter emptys to avoid extraneous routes like '//'
  return '/' + route.filter((value) => value !== '').join('/');
}

export class HttpRouter {
  parent: HttpServer | HttpRouter
  route: string[]
  file: boolean

  constructor(route: PathRepresentation, parent: HttpServer | HttpRouter, file: boolean = false) {
    this.parent = parent;
    this.route = processPathRepresentation(route);
    this.file = file
  }

  get (route: PathRepresentation, handler: GetCallback) {
    this.parent.get([...this.route, ...processPathRepresentation(route)], handler);
  }

  dir (route: PathRepresentation, handler: DirCallback) {
    this.parent.dir([...this.route, ...processPathRepresentation(route)], handler);
  }

  hash (): string {
    return this.parent.hash() + '/' + this.route.join('/')
  }
}

/**
 * First element is the path of the folder for the event files inside the events folder
 * 
 * Second element is the start date (event includes start)
 * 
 * Third element is the end date (event doesn't include end)
 */
type EventInfo = [string, string, string];

/**
 * First element is the path to the file in the media server
 * 
 * Second element is a function that takes the settings object and returns
 * the file name (no extension) depending on the settings
 */
type SpecialInfo = [string, (s: SettingsManager) => string];

export class HttpServer {
  settingsManager: SettingsManager
  router: Router

  constructor (settingsManager: SettingsManager) {
    this.settingsManager = settingsManager;
    this.router = Router();
  }

  /** Supplies all the files for an event in its date range */
  private addEvent(event: EventInfo) {
    const rootPath = 'default/event/' + event[0];
    this.dir('', (s) => {
      if (isGreaterOrEqual(s.settings.version, event[1]) && isLower(s.settings.version, event[2])) {
        return rootPath;
      } else {
        return undefined;
      }
    });
  }

  /**
   * Sets up a list of events each with its info.
   * 
   * Events are periods of time where a static folder is served with most priority,
   * it is used mostly for parties, and they are stored in the default/event directory
   * of the media folders
   */
  addEvents(...events: Array<EventInfo>) {
    for (const event of events) {
      this.addEvent(event);
    }
  }

  /**
   * Redirect many directories to other paths in the media folder
   * 
   * Supply a list of tuples, where the first element is the path for a route
   * in the media server that serves a directory (eg play/v2/games),
   * and the second element is the path inside the media folder
   */
  redirectDirs(...redirects: Array<[string, string]>) {
    for (const redirect of redirects) {
      const [origin, destination] = redirect;
      this.dir(origin, () => destination);
    }
  }

  /** Set handler for a special file */
  private addSpecial(special: SpecialInfo) {
    let origin = special[0];
    const callback = special[1];
    const extension = '.' + origin.split('.').pop();
    const destiny = origin;

    // exceptional case because can't provide a non empty folder path
    if (origin === 'index.html') {
      origin = '';
    }

    this.get(origin, () => {
      const specialPath = callback(this.settingsManager);
      return path.join('default/special', destiny, specialPath + extension);
    })
  }

  /**
   * Sets up special handled media
   * 
   * These media are files in which depending on the settings,
   * different files are served
   */
  addSpecials(...specials: Array<SpecialInfo>) {
    for (const special of specials) {
      this.addSpecial(special);
    }
  }
  
  /** Given the route to a file, sets up a seasonal handler */
  private addSeasonal(route: string) {
    const extension = '.' + route.split('.').pop();
    const files = fs.readdirSync(path.join(DEFAULT_DIRECTORY, SEASONAL_NAME, route));
    const fileDates = files.filter((f) => f.endsWith(extension)).map((f) => f.slice(0, -extension.length));
    try {
      sortVersions(fileDates);
    } catch {
      throw Error(`Seasonal included files not named after versions in path ${route}`);
    }

    const router = new HttpRouter(route, this);
    alternating(
      [router],
      fileDates.map((fileDate) => {
        return [fileDate, path.join('default', SEASONAL_NAME, route, fileDate + extension)]
      })
    )
  }

  /**
   * Automatically set up all seasonals, which are files which change frequently
   * and are stored in the default/seasonal media folder
   */
  addSeasonals() {
    // use current dir to carry a relative path, original dir to maintain the absolute path
    const walk = (originDir: string, currentDir: string = ''): string[] => {
        const entries = fs.readdirSync(path.join(originDir, currentDir), { withFileTypes: true });

        // if children are directories, recursively reach out to everything
        // if the children arent, then we reached where we wanted to reach (the file path)
        const isDirChildren = entries.every((value) => value.isDirectory());
        let files: string[];
        if (isDirChildren) {
          const recursiveFiles = entries.map((entry => {
            const newRelativePath = path.join(currentDir, entry.name);
            return walk(originDir, newRelativePath);
          }));
          files = recursiveFiles.flat(); 
        } else {
          files = [currentDir];
        }
        return files;
    }

    const dirs = walk(path.join(DEFAULT_DIRECTORY, SEASONAL_NAME));
    for (const dir of dirs) {
      this.addSeasonal(dir);
    }
  }

  getData (route: PathRepresentation, handler: DataCallback) {
    this.router.get(getExpressRoute(processPathRepresentation(route)), (_, res) => {
      res.send(handler(this.settingsManager));
    })
  }

  get (route: PathRepresentation, handler: GetCallback) {
    const expressRoute = getExpressRoute(processPathRepresentation(route))
    this.router.get(expressRoute, (_, res, next) => {
      const handled = handler(this.settingsManager, expressRoute);
      if (handled === undefined) {
        next();
      } else {
        res.sendFile(path.join(MEDIA_DIRECTORY, handled))
      }
    })
  }

  dir (route: PathRepresentation, handler: DirCallback) {
    this.router.get(`${getExpressRoute(processPathRepresentation(route))}*`, (req: Request, res, next) => {
      const dirPath = req.params[0];
      const specialPath = handler(this.settingsManager, dirPath);
      if (specialPath === undefined) {
        next();
      } else {
        const filePath = path.join(MEDIA_DIRECTORY, specialPath, dirPath);
        if (fs.existsSync(filePath)) {
          res.sendFile(filePath);
        } else {
          next();
        }
      }
    })
  }

  hash (): string {
    return ''
  }
}