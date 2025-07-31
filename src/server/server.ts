import express, { Express } from 'express';
import net from 'net';

import { Handler } from './handlers';
import { WORLD_PORT } from './servers';
import worldHandler from './handlers/world'
import oldHandler from './handlers/old'
import loginHandler from './handlers/login'
import { Client, Server } from './client';
import { SettingsManager } from './settings';
import { createHttpServer } from './routes/game';
import db from './database';
import { getModRouter } from './settings';
import { setApiServer } from './settings-api';
import { HTTP_PORT } from '../common/constants';

const createServer = async (type: string, port: number, handler: Handler, settingsManager: SettingsManager, server: Express): Promise<Server> => {
  handler.useEndpoints(server);

  const gameServer = new Server(settingsManager);
  gameServer.bootHandler = handler;

  handler.bootServer(gameServer);

  await new Promise<void>((resolve) => {
    net.createServer((socket) => {
      socket.setEncoding('utf8');
  
      console.log(`A client has connected to ${type}`);

      const client = new Client(
        gameServer,
        socket,
        type === 'Login' ? 'Login' : 'World'
      );
      socket.on('data', (data: Buffer) => {
        const dataStr = data.toString().split('\0')[0];
        handler.handle(client, dataStr);
      });
  
      socket.on('close', () => {
        for (const method of handler.disconnectListeners) {
          method(client);
        }
        console.log('A client has disconnected');
      });
  
      socket.on('error', (error) => {
        console.error(error);
      });
    }).listen(port, () => {
      console.log(`${type} server listening on port ${port}`);
      resolve();
    });
  })

  return gameServer;
};

const startServer = async (settingsManager: SettingsManager): Promise<void> => {
  db.loadDatabase();

  const server = express();

  server.use(getModRouter(settingsManager));

  const httpServer = createHttpServer(settingsManager);

  server.use(httpServer.router);

  
  // TODO in the future, "world" and "old" should be merged somewhat
  await createServer('Login', 6112, loginHandler, settingsManager, server);
  const world = await createServer('World', WORLD_PORT, worldHandler, settingsManager, server);
  const oldWorld = await createServer('Old', 6114, oldHandler, settingsManager, server);
  
  setApiServer(settingsManager, server, [world, oldWorld]);

  await new Promise<void>((resolve, reject) => {
    server.listen(HTTP_PORT, () => {
      console.log(`HTTP server listening on port ${HTTP_PORT}`);
      resolve();
    }).on('error', (err) => {
      reject(err)
    })
  })
};

export default startServer;