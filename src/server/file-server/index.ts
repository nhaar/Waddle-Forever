import { Router, Request } from 'express';
import { GameData } from '@server/timelines/game-data';
import path from 'path';
import fs from 'fs';
import { MODS_DIRECTORY } from '@common/paths';
import { FileGenerator, getGeneratorsMap, postGeneratorsMap } from '@server/file-generators';
import { MEDIA_DIRECTORY, readFile, toForwardSlash } from '@common/utils';
import { SettingsManager } from '@server/settings';
import { FileOverrider, OVERRIDERS } from './overriders';
import { getYellowString, logverbose } from '@server/logger';

/** Server that serves files to the game webpage and files in the game */
export class FileServer {
  /** Maps file route -> name of the mod that is using this route */
  private modFiles = new Map<string, string>();

  private overrider: FileOverrider;

  private dynamicFiles: Map<string, FileGenerator>

  private postGenerators: Map<string, FileGenerator>

  constructor(private gameData: GameData, private settings: SettingsManager) {
    this.dynamicFiles = getGeneratorsMap();
    this.postGenerators = postGeneratorsMap();

    this.updateModFiles();
    settings.mods.addListener(() => {
      this.updateModFiles();
    });

    // todo remove global state
    this.overrider = new FileOverrider(gameData, settings, OVERRIDERS);
  }

  private updateModFiles() {
    this.modFiles = new Map<string, string>();
    for (const mod of this.settings.mods.getActiveMods()) {
      mod.getFiles().forEach(file => {
        this.modFiles.set(toForwardSlash(file), mod.getName());
      })        
    }
  }

  private async getFile(route: string): Promise<Buffer | string | undefined> {
    let filePath;
    const modName = this.modFiles.get(route);
    if (modName !== undefined) {
      logverbose(getYellowString(`requesting ${route}, sending MODDED file`));
      filePath = path.join(MODS_DIRECTORY, modName, route);
    } else {
      filePath = this.gameData.lookupFile(route);
      if (filePath !== undefined) {
        if (typeof filePath !== 'string') {
          filePath = filePath(this.settings);
        }
        logverbose(`req ${route} -> send ${filePath}`);
        filePath = path.join(MEDIA_DIRECTORY, filePath);
      }
    }

    if (filePath === undefined) {
      const generator = this.dynamicFiles.get(route);
      if (generator !== undefined) {
        return generator(this.gameData, this.settings);
      }
    } else {
      return await readFile(filePath);
    }

    const websiteFile = path.join(MEDIA_DIRECTORY, `default/websites/${this.gameData.getWebsite()}/${route}`);
    if (fs.existsSync(websiteFile)) {
      return await readFile(websiteFile);
    }

    return undefined;
  }

  public getExpressRouter(): Router {
    const router = Router();

    // generic files (swfs, json, etc.)
    router.get('/*', (req: Request, res, next) => {
      const route = req.params[0];
      this.getFile(route).then((binary) => {
        if (binary === undefined) {
          next();
        } else {
          const split = route.split('.');
          // if less than 1, then there was no file extension
          // route with no file extension -> a GET request for an HTML file
          const type = split.length < 2 ? '.html' : route.split('.').pop();
          if (type === undefined) {
            throw new Error('Split somehow returned empty list');
          }
          
          this.overrider.override(route, binary).then((value) => {
            res.status(200).type(type).send(value);
          });
        }
      });
    });
    router.post('/*', (req: Request, res, next) => {
      const generator = this.postGenerators.get(req.params[0]);
      if (generator === undefined) {
        next();
      } else {
        res.send(generator(this.gameData, this.settings));
      }
    });

    return router;
  }
}