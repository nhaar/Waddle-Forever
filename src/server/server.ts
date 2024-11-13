import path from 'path';
import fs from 'fs';
import express, { Request } from 'express';
import net from 'net';

import { XtPacket } from '.';
import { XtHandler } from './handlers';
import loginHandler from './handlers/play/login';
import navigationHandler from './handlers/play/navigation';
import serverList, { getServerPopulation, WORLD_PORT } from './servers';
import commandsHandler from './handlers/commands';
import itemHandler from './handlers/play/item';
import stampHandler from './handlers/play/stamp';
import puffleHandler from './handlers/play/puffle';
import iglooHandler from './handlers/play/igloo';
import epfHandler from './handlers/play/epf';
import mailHandler from './handlers/play/mail';
import { Client } from './penguin';
import { SettingsManager } from './settings';
import { createHttpServer } from './routes/game';
import db from './database';
import { getModRouter } from './settings';
import as1Handler from './handlers/play/as1';

const createServer = async (type: string, port: number, handlers: XtHandler, settingsManager: SettingsManager): Promise<void> => {
  await new Promise<void>((resolve) => {
    net.createServer((socket) => {
      socket.setEncoding('utf8');
  
      const client = new Client(socket, settingsManager.settings.version, settingsManager.settings.always_member);
  
      socket.on('data', (data: Buffer) => {
        const dataStr = data.toString().split('\0')[0];
        console.log('incoming data!', dataStr);
        if (dataStr.startsWith('<')) {
          if (dataStr === '<policy-file-request/>') {
            socket.end('<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>');
          } else if (dataStr.includes('verChk')) {
            client.send('<msg t="sys"><body action="apiOK" r="0"></body></msg>');
          } else if (dataStr === "<msg t='sys'><body action='rndK' r='-1'></body></msg>") {
            client.send('<msg t="sys"><body action="rndK" r="-1"><k>key</k></body></msg>');
          } else if (dataStr.includes('login')) {
            const dataMatch = dataStr.match(/<nick><!\[CDATA\[(.*)\]\]><\/nick>/);
            if (dataMatch === null) {
              socket.end('');
            } else {
              const name = dataMatch[1];
              client.setPenguinFromName(name);
              /*
              TODO
              will key be required?
              buddies
              how will server size be handled after NPCs?
              */
              // information regarding how many populations are in each server
              client.sendXt('l', client.id, client.id, '', serverList.map((server) => {
                const population = server.name === 'Blizzard' ? 5 : getServerPopulation()
                return `${server.id},${population}`;
              }).join('|'));
  
              /** TODO puffle stuff */
              client.sendXt('pgu');
            }
          }
        } else {
          const packet = new XtPacket(dataStr);
          const callbacks = handlers.getCallback(packet);
          if (callbacks === undefined) {
            console.log('unhandled XT: ', packet, port);
          } else {
            callbacks.forEach((callback) => {
              callback(client, ...packet.args);
            });
          }
        }
      });
  
      socket.on('close', () => {
        for (const method of handlers.disonnectListeners) {
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

  if (settingsManager.usingMods) {
    server.use(getModRouter(settingsManager));
  }

  const httpServer = createHttpServer(settingsManager);

  server.use(httpServer.router);

  await new Promise<void>((resolve, reject) => {
    const HTTP_PORT = 80
    server.listen(HTTP_PORT, () => {
      console.log(`HTTP server listening on port ${HTTP_PORT}`);
      resolve();
    }).on('error', (err) => {
      reject(err)
    })
  })

  const worldListener = new XtHandler();
  worldListener.use(loginHandler);
  worldListener.use(navigationHandler);
  worldListener.use(commandsHandler);
  worldListener.use(itemHandler);
  worldListener.use(stampHandler);
  worldListener.use(puffleHandler);
  worldListener.use(iglooHandler);
  worldListener.use(epfHandler);
  worldListener.use(mailHandler);

  const as1Listener = new XtHandler();
  as1Listener.use(as1Handler);

  as1Handler.useEndpoints(server);

  await createServer('Login', 6112, new XtHandler(), settingsManager);
  await createServer('World', WORLD_PORT, worldListener, settingsManager);
  await createServer('Old', 6114, as1Listener, settingsManager);
};

export default startServer;