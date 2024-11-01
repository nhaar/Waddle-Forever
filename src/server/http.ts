import path from 'path';
import fs from 'fs';
import { Request, Router } from "express";
import { SettingsManager } from "./settings";

type GetCallback = (settings: SettingsManager, route: string) => string

type DirCallback = (settings: SettingsManager, dirPath: string) => string | undefined

export class HttpRouter {
  gets: Map<string, GetCallback>
  dirs: Map<string, DirCallback>

  constructor() {
    this.gets = new Map<string, GetCallback>();
    this.dirs = new Map<string, DirCallback>();
  }

  get (route: string, handler: GetCallback) {
    this.gets.set(route, handler);
  }

  dir (route: string, handler: DirCallback) {
    this.dirs.set(route, handler);
  }

  use (route: string, router: HttpRouter) {
    router.dirs.forEach((handler, key) => {
      this.dirs.set(route + key, handler);
    })
    router.gets.forEach((handler, key) => {
      this.gets.set(route + key, handler);
    })
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
        const filePath = path.join(process.cwd(), 'media', specialPath);
        if (fs.existsSync(filePath)) {
          res.sendFile(filePath);
        } else {
          next();
        }
      }
    })
  }

  use (path: string, router: HttpRouter) {
    router.dirs.forEach((handler, route) => {
      this.dir(path + route, handler);
    })
    router.gets.forEach((handler, route) => {
      this.get(path + route, handler);
    })
  }
}