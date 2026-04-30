import express from 'express';

import { FileServer } from "@server/file-server";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { HTTP_PORT } from '@common/constants';
import { PhpServer } from './php-server';
import { JsonDatabase } from '@server/database';
import { Server } from '@server/client';

export class HttpServer {
  private fileServer: FileServer;
  private phpServer: PhpServer;

  constructor(gameData: GameData, settings: SettingsManager, db: JsonDatabase, server: Server) {
    this.fileServer = new FileServer(gameData, settings);
    this.phpServer = new PhpServer(settings, db, server);
  }

  public async setupServer() {
    const app = express();
    app.use(this.fileServer.getExpressRouter());
    app.use(this.phpServer.getExpressRouter());

    await new Promise<void>((resolve, reject) => {
      app.listen(HTTP_PORT, () => {
        console.log(`HTTP server listening on port ${HTTP_PORT}`);
        resolve();
      }).on('error', (err) => {
        reject(err)
      })
    })
  }
}