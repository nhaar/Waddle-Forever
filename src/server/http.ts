import path from 'path';
import fs from 'fs';
import { Request, Router } from "express";
import { SettingsManager } from "./settings";

type GetCallback = (settings: SettingsManager, route: string) => string

type DirCallback = (settings: SettingsManager, dirPath: string) => string | undefined

export class HttpRouter {
  parent: HttpServer | HttpRouter
  route: string

  constructor(route: string, parent: HttpServer | HttpRouter) {
    this.parent = parent;
    this.route = route;
  }

  get (route: string, handler: GetCallback) {
    this.parent.get(this.route + route, handler);
  }

  dir (route: string, handler: DirCallback) {
    this.parent.dir(this.route + route, handler);
  }
}

export class HttpServer {
  settingsManager: SettingsManager
  router: Router

  constructor (settingsManager: SettingsManager) {
    this.settingsManager = settingsManager;
    this.router = Router();
  }

  get (route: string, handler: GetCallback) {

    this.router.get(route, (_, res, next) => {
      const handled = handler(this.settingsManager, route);
      if (handled === undefined) {
        next();
      } else {
        res.sendFile(path.join(process.cwd(), 'media', handled))
      }
    })
  }

  dir (route: string, handler: DirCallback) {
    this.router.get(`${route}*`, (req: Request, res, next) => {
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
}