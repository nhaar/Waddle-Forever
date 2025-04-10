import express, { Express } from 'express';
import net from 'net';

import { Handler } from './handlers';
import { WORLD_PORT } from './servers';
import worldHandler from './handlers/world'
import oldHandler from './handlers/old'
import loginHandler from './handlers/login'
import { Client } from './penguin';
import { SettingsManager } from './settings';
import { createHttpServer } from './routes/game';
import db from './database';
import { getModRouter } from './settings';
import { setApiServer } from './settings-api';

const createServer = async (type: string, port: number, handler: Handler, settingsManager: SettingsManager, server: Express): Promise<void> => {
  handler.useEndpoints(server);

  await new Promise<void>((resolve) => {
    net.createServer((socket) => {
      socket.setEncoding('utf8');
  
      console.log(`A client has connected to ${type}`);

      const client = new Client(
        socket,
        type === 'Login' ? 'Login' : 'World',
        settingsManager
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
};

const startServer = async (settingsManager: SettingsManager): Promise<void> => {
  db.loadDatabase();

  const server = express();

  server.use(getModRouter(settingsManager));

  const httpServer = createHttpServer(settingsManager);

  server.use(httpServer.router);

  setApiServer(settingsManager, server);

  await new Promise<void>((resolve, reject) => {
    const HTTP_PORT = 80
    server.listen(HTTP_PORT, () => {
      console.log(`HTTP server listening on port ${HTTP_PORT}`);
      resolve();
    }).on('error', (err) => {
      reject(err)
    })
  })

  // TODO in the future, "world" and "old" should be merged somewhat
  await createServer('Login', 6112, loginHandler, settingsManager, server);
  await createServer('World', WORLD_PORT, worldHandler, settingsManager, server);
  await createServer('Old', 6114, oldHandler, settingsManager, server);
};

export default startServer;