import path from 'path';
import fs from 'fs';
import { Request, Router } from "express";
import { SettingsManager } from "./settings";

type GetCallback = (settings: SettingsManager, route: string) => string

type DirCallback = (settings: SettingsManager, dirPath: string) => string | undefined

type DataCallback = (settings: SettingsManager) => string

type PathRepresentation = string | string[]

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

  constructor(route: PathRepresentation, parent: HttpServer | HttpRouter) {
    this.parent = parent;
    this.route = processPathRepresentation(route);
  }

  get (route: PathRepresentation, handler: GetCallback) {
    this.parent.get([...this.route, ...processPathRepresentation(route)], handler);
  }

  dir (route: PathRepresentation, handler: DirCallback) {
    this.parent.dir([...this.route, ...processPathRepresentation(route)], handler);
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
      console.log(dirPath)
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
}