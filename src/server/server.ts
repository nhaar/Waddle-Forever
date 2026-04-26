import express, { Express } from 'express';
import net from 'net';
import { WebSocketServer } from 'ws'

import { Handler } from './handlers';
import { LOGIN_PORT, WORLD_PORT } from './servers';
import worldHandler from './handlers/world'
import loginHandler from './handlers/login'
import { Client, Server, ClientSocket } from './client';
import { SettingsManager } from './settings';
import db from './database';
import { getModRouter } from './mods';
import { setApiServer } from './settings-api';
import { HTTP_PORT } from '../common/constants';
import { FileServer } from './file-server';
import { GameData } from './timelines/game-data';
import { getGeneratorsMap } from './file-generators';
import { getUpdates } from './updates/updates';

type StartServerError = {
  type: 'mods';
  message: string;
};

const createServer = async (type: string, port: number, handler: Handler, settingsManager: SettingsManager, server: Express): Promise<Server> => {  
  const gameServer = new Server(settingsManager);

  handler.useEndpoints(gameServer, server);

  handler.bootServer(gameServer);

  function makeClient(cs: ClientSocket) {
    return new Client(
      gameServer,
      cs,
      type === 'Login' ? 'Login' : 'World'
    );
  }

  await new Promise<void>((resolve, reject) => {
    const wsServer = new WebSocketServer({ noServer: true });
    
    wsServer.on('connection', (ws, req) => {
      console.log(`A client has connected to ${type} (WebSocket)`);

      const cs: ClientSocket = {
        write: async (message: string) => {
          return new Promise<void>((resolve, reject) => {
            ws.send(Buffer.from(message + '\0', 'utf8'), { binary: true }, (err) => {
              if (err !== undefined) {
                reject(err);
              }
              resolve();
            });
          })
        },

        end: (d) => ws.close(undefined, d)
      }

      const client = makeClient(cs)

      ws.on('message', (data) => {
        handler.handle(client, data.toString());
      });

      ws.on('close', () => {
        for (const method of handler.disconnectListeners) {
          method(client);
        }
        console.log('A client has disconnected (WebSocket)');
      });

      ws.emit('message', req)

      ws.on('error', console.error)
    });

    function parseHeaders(data: string) {
      const lines = data.split('\r\n');
      const headers: Record<string, string> = {};
      for (let i = 1; i < lines.length; i++) {
        const [key, value] = lines[i].split(': ');
        if (key && value) {
          headers[key.toLowerCase()] = value;
        }
      }
      return headers;
    }
  
    net.createServer((socket) => {
      socket.once('data', (buffer) => {
        const dataStr = buffer.toString()

        if (dataStr.startsWith('GET')) {
          // This is a websocket connection
          wsServer.handleUpgrade({ headers: parseHeaders(dataStr), method: 'GET' } as any, socket, buffer, (ws) => {
            wsServer.emit('connection', ws, dataStr);
          });
        } else {
          socket.setEncoding('utf8')
          console.log(`A client has connected to ${type}`);

          const cs: ClientSocket = {
            write: async (message: string) => {
              return new Promise<void>((resolve, reject) => {
                socket.write(message + '\0', (err) => {
                  if (err) {
                    reject(err);
                  }
                  resolve();
                });
              })
            },
            end: (d) => {
              if (d === undefined) {
                socket.end();
              } else {
                socket.end(d);
              }
            }
          }

          const client = makeClient(cs)

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

          // Re-emit the data so the TCP handler gets the first packet too
          socket.emit('data', buffer);

          socket.on('error', console.error)
        }
      });
    }).listen(port, () => {
      console.log(`${type} server listening on port ${port}`);
      resolve();
    }).on('error', (err) => {
      reject(err)
    });
  })

  return gameServer;
};

/** Returns a list of relevant errors with the startup */
const startServer = async (settingsManager: SettingsManager): Promise<StartServerError[]> => {
  const errors: StartServerError[] = [];

  db.loadDatabase();

  const server = express();

  server.use(getModRouter(settingsManager.mods));

  const gameData = new GameData(getUpdates(), settingsManager);

  const fileServer = new FileServer(gameData, getGeneratorsMap(), settingsManager.mods);

  server.use(fileServer.getExpressRouter());

  
  // TODO in the future, "world" and "old" should be merged somewhat
  await createServer('Login', LOGIN_PORT, loginHandler, settingsManager, server);
  const world = await createServer('World', WORLD_PORT, worldHandler, settingsManager, server);
  
  setApiServer(settingsManager, server, world, worldHandler);

  await new Promise<void>((resolve, reject) => {
    server.listen(HTTP_PORT, () => {
      console.log(`HTTP server listening on port ${HTTP_PORT}`);
      resolve();
    }).on('error', (err) => {
      reject(err)
    })
  })

  // mods that fail to initialize are turned off and the user must be warned about
  const failedMods = settingsManager.mods.initializeMods();
  if (failedMods.length > 0) {
    errors.push({
      type: 'mods',
      message: `The following mods had an issue during startup: ${failedMods.join(', ')}. They have been turned off.`
    });
  }
  
  return errors;
};

export default startServer;