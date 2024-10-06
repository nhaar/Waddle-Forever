import path from 'path';
import express from 'express';
import net from 'net';

import { XtPacket } from '.';
import { XtHandler } from './handlers';
import loginHandler from './handlers/play/login';
import navigationHandler from './handlers/play/navigation';
import serverList from './servers';
import commandsHandler from './handlers/commands';
import itemHandler from './handlers/play/item';
import stampHandler from './handlers/play/stamp';
import { Client } from './penguin';
import { SettingsManager } from './settings';

const createServer = (type: string, port: number, handlers: XtHandler): void => {
  net.createServer((socket) => {
    socket.setEncoding('utf8');

    const client = new Client(socket);

    socket.on('data', (data: Buffer) => {
      const dataStr = data.toString().split('\0')[0];
      console.log('incoming data!', dataStr);
      if (dataStr.startsWith('<')) {
        if (dataStr === '<policy-file-request/>') {
          socket.end('<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>');
        } else if (dataStr === "<msg t='sys'><body action='verChk' r='0'><ver v='153' /></body></msg>") {
          client.send('<msg t="sys"><body action="apiOK" r="0"></body></msg>');
        } else if (dataStr === "<msg t='sys'><body action='rndK' r='-1'></body></msg>") {
          client.send('<msg t="sys"><body action="rndK" r="-1"><k>key</k></body></msg>');
        } else if (dataStr.includes('login')) {
          const dataMatch = dataStr.match(/<nick><!\[CDATA\[(.*)\]\]><\/nick>/);
          if (dataMatch === null) {
            socket.end('');
          } else {
            const name = dataMatch[1];
            client.create(name);
            /*
            TODO
            will key be required?
            buddies
            how will server size be handled after NPCs?
            */
            // information regarding how many populations are in each server
            client.sendXt('l', client.id, client.id, '', serverList.map((server) => {
              return `${server.id},5`;
            }).join('|'));

            /** TODO puffle stuff */
            client.sendXt('pgu');
          }
        }
      } else {
        const packet = new XtPacket(dataStr);
        const callbacks = handlers.getCallback(packet);
        if (callbacks === undefined) {
          console.log('unhandled XT: ', packet);
        } else {
          callbacks.forEach((callback) => {
            callback(client, ...packet.args);
          });
        }
      }
    });

    socket.on('close', () => {
      console.log('A client has disconnected');
    });

    socket.on('error', (error) => {
      console.error(error);
    });
  }).listen(port, () => {
    console.log(`${type} server listening on port ${port}`);
  });
};

const startServer = (settingsManager: SettingsManager): void => {
  const server = express();

  // entrypoint for as2 client
  server.get('/boots.swf', (_, res) => {
    const fps = settingsManager.settings.fps30 ? '30' : '24';
    res.sendFile(path.join(process.cwd(), `media/special/boots${fps}.swf`));
  });

  // TODO a better system for handling these special medias

  // TODO thin ice IGT without font issues and insane number of decimals
  server.get('/play/v2/games/thinice/ThinIce.swf', (_, res) => {
    let suffix = settingsManager.settings.thin_ice_igt ? 'IGT' : 'Vanilla';
    if (settingsManager.settings.thin_ice_igt) {
      suffix += settingsManager.settings.fps30 ? '30' : '24';
    }
    res.sendFile(path.join(process.cwd(), `media/special/ThinIce${suffix}.swf`));
  });

  server.get('/', (_, res) => {
    res.sendFile(path.join(process.cwd(), 'media/index.html'));
  });

  server.use(express.static('media/static'));

  server.listen(80, () => console.log('HTTP server running in port 80'));

  const worldListener = new XtHandler();
  worldListener.use(loginHandler);
  worldListener.use(navigationHandler);
  worldListener.use(commandsHandler);
  worldListener.use(itemHandler);
  worldListener.use(stampHandler);
  createServer('Login', 6112, new XtHandler());
  serverList.forEach((server) => {
    createServer(server.name, Number(server.port), worldListener);
  });
};

export default startServer;