import path from 'path';
import fs from 'fs';
import { Request, Router } from "express";
import { SettingsManager } from "./settings";

export class HttpServer {
  settingsManager: SettingsManager
  router: Router

  constructor (settingsManager: SettingsManager) {
    this.settingsManager = settingsManager;
    this.router = Router();
  }

  get (route: string, handler: (settings: SettingsManager) => string) {
    this.router.get(route, (_, res) => {
      res.sendFile(path.join(process.cwd(), 'media', handler(this.settingsManager)))
    })
  }

  dir (route: string, handler: (settings: SettingsManager, dirPath: string) => string | undefined) {
    this.router.get(`${route}/*`, (req: Request, res, next) => {
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
}