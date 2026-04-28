import { Router, Request } from 'express';
import { GameData } from '@server/timelines/game-data';
import path from 'path';
import fs from 'fs';
import { MODS_DIRECTORY } from '@common/paths';
import { ModManager } from '@server/mods';
import { FileGenerator } from '@server/file-generators';
import { MEDIA_DIRECTORY } from '@common/utils';
import { SettingsManager } from '@server/settings';

function injectRuffleIntoHtml(s: SettingsManager, html: string) {
  const ruffleConfig = JSON.stringify({
    socketProxy: [
      {
        host: s.targetIP,
        port: s.loginPort,
        proxyUrl: `ws://${s.targetIP}:${s.loginPort}`,
      },
      {
        host: s.targetIP,
        port: s.worldPort,
        proxyUrl: `ws://${s.targetIP}:${s.worldPort}`,
      },
    ]
  });

  const injectedScript = `
    <script>
      window.RufflePlayer = window.RufflePlayer || {};
      window.RufflePlayer.config = ${ruffleConfig};
    </script>
  `;

  return html.replace('</head>', `${injectedScript}</head>`);
}

/** Server that serves files to the game webpage and files in the game */
export class FileServer {
  /** Maps file route -> name of the mod that is using this route */
  private modFiles = new Map<string, string>();

  constructor(private gameData: GameData, private dynamicFiles: Map<string, FileGenerator>, private settings: SettingsManager, private postGenerators: Map<string, FileGenerator>, modManager: ModManager) {
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

  private async getFile(route: string): Promise<Buffer | string | undefined> {
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
        return generator(this.gameData, this.settings);
      }
    } else {
      return await this.readFile(filePath);
    }
    return undefined;
  }

  private async getIndexHtml(): Promise<string> {
    const name = this.gameData.getIndexHtml();
    let fileName = '';

    if (this.settings.settings.minified_website && name !== 'modern-as3') {
      if (this.gameData.getAs3()) {
        fileName = 'default/websites/minified/minified-classic-as3.html';
      } else if (this.gameData.isPreCpip()) {
        fileName = 'default/websites/minified/minified-precpip.html';
      } else {
        fileName = 'default/websites/minified/minified-cpip.html';
      }
    } else {
      fileName = `default/websites/${name}.html`;
    }

    return (await this.getMediaFile(fileName)).toString('utf-8');
  }

  private async readFile(filePath: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  private async getMediaFile(route: string): Promise<Buffer> {
    return await this.readFile(path.join(MEDIA_DIRECTORY, route));
  }

  public getExpressRouter(): Router {
    const router = Router();

    // generic files (swfs, json, etc.)
    router.get('/*', (req: Request, res, next) => {
      this.getFile(req.params[0]).then((binary) => {
        if (binary === undefined) {
          next();
        } else {
          res.status(200).send(binary);
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

    // html file
    router.get('/', (_, res) => {
      this.getIndexHtml().then(file => {
        res.type('html').send(injectRuffleIntoHtml(this.settings, file));
      });
    });

    // website files
    router.get('/*', (req: Request, res, next) => {
      const route = path.join(MEDIA_DIRECTORY, `default/websites/${this.gameData.getWebsite()}/${req.params[0]}`);
      if (fs.existsSync(route)) {
        res.sendFile(route);
      } else {
        next();
      }
    });

    return router;
  }
}