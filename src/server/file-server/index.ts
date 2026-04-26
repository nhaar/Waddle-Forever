import { Router, Request } from 'express';
import { GameData } from '@server/timelines/game-data';
import path from 'path';
import fs from 'fs';
import { MODS_DIRECTORY } from '@common/paths';
import { ModManager } from '@server/mods';
import { FileGenerator } from '@server/file-generators';
import { MEDIA_DIRECTORY } from '@common/utils';

/** Server that serves files to the game webpage and files in the game */
export class FileServer {
  /** Maps file route -> name of the mod that is using this route */
  private modFiles = new Map<string, string>();

  constructor(private gameData: GameData, private dynamicFiles: Map<string, FileGenerator>, modManager: ModManager) {
    this.updateModFiles(modManager);
    modManager.addListener(() => {
      this.updateModFiles(modManager);
    });
  }

  private updateModFiles(modManager: ModManager) {
    this.modFiles = new Map<string, string>();
    for (const mod of modManager.getActiveMods()) {
      mod.getFiles().forEach(file => {
        this.modFiles.set(file, mod.getName());
      })        
    }
  }

  private async getFile(route: string): Promise<Buffer | undefined> {
    let filePath;
    const modName = this.modFiles.get(route);
    if (modName !== undefined) {
      filePath = path.join(MODS_DIRECTORY, modName, route);
    } else {
      filePath = this.gameData.lookupFile(route);
      if (filePath !== undefined) {
        filePath = path.join(MEDIA_DIRECTORY, filePath);
      }
    }

    if (filePath === undefined) {
      const generator = this.dynamicFiles.get(route);
      if (generator !== undefined) {
        return generator(this.gameData);
      }
    } else {
      const fp = filePath;
      return await new Promise<Buffer>((resolve, reject) => {
        fs.readFile(fp, (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        }); 
      });
    }
    return undefined;
  }

  public getExpressRouter(): Router {
    const router = Router();

    router.get('/*', (req: Request, res) => {
      this.getFile(req.params[0]).then((binary) => {
        if (binary === undefined) {
          res.sendStatus(404);
        } else {
          res.status(200).send(binary);
        }
      });
    });

    return router;
  }
}