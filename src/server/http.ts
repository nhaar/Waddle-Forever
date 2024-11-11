import path from 'path';
import fs from 'fs';
import { Request, Router } from "express";
import { GameVersion, SettingsManager } from "./settings";
import { isGreaterOrEqual, isLower } from './routes/versions';

type GetCallback = (settings: SettingsManager, route: string) => string

type DirCallback = (settings: SettingsManager, dirPath: string) => string | undefined

type DataCallback = (settings: SettingsManager) => string

type PathRepresentation = string | string[]

type RouteMap = Array<[HttpRouter, string]>

type Alternator = [GameVersion, ...string[]]

type AlternatorMap = Array<[GameVersion, string]>

type Spacer = [GameVersion, GameVersion, ...string[]]

type SpacerMap = Array<[GameVersion, GameVersion, string]>

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
    return [repr];
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

export class HttpServer {
  settingsManager: SettingsManager
  router: Router

  constructor (settingsManager: SettingsManager) {
    this.settingsManager = settingsManager;
    this.router = Router();
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
        res.sendFile(path.join(process.cwd(), 'media', handled))
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
        const filePath = path.join(process.cwd(), 'media', specialPath, dirPath);
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