import path from 'path';
import fs from 'fs';
import { Request, Router } from "express";
import { SettingsManager } from "./settings";
import { MEDIA_DIRECTORY } from '../common/utils';
import { findInVersion } from './game-data';
import { specialServer } from './game-data/specials';
import { logdebug } from './logger';
import { getRoutesTimeline } from './timelines/route';

type GetCallback = (settings: SettingsManager, route: string) => string | undefined

type DirCallback = (settings: SettingsManager, dirPath: string) => string | undefined

type DataCallback = (settings: SettingsManager) => string | Buffer

type PathRepresentation = string | string[]

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
export class HttpServer {
  settingsManager: SettingsManager
  router: Router

  constructor (settingsManager: SettingsManager) {
    this.settingsManager = settingsManager;
    this.router = Router();
  }
  
  addFileServer() {
    const routesTimeline = getRoutesTimeline();
  
    this.router.get('/*', (req: Request, res, next) => {
      const route = req.params[0];
      const special = specialServer.get(route);
      const specialCheck = special?.check(this.settingsManager);
      if (special === undefined || specialCheck === undefined) {
        const info = routesTimeline.get(route);
        if (info === undefined) {
          next();
        } else {
          const filePath = findInVersion(this.settingsManager.settings.version, info);
          if (filePath === undefined) {
            console.log(info);
            throw new Error('Could not find file, log output is above')
          }
  
          logdebug(`Requested: ${route}, sending: ${filePath}`);
          res.sendFile(path.join(MEDIA_DIRECTORY, filePath));
        }
      } else {
        res.sendFile(path.join(MEDIA_DIRECTORY, special.files[specialCheck]));
      }
    });
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