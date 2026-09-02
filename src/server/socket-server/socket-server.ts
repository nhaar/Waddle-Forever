import net from 'net';
import { WebSocketServer } from 'ws'

import { EffectService } from '@common/utils';

export interface MessageHandler {
  handle: (client: ClientSocket, message: string) => void;
  disconnect: (client: ClientSocket) => Promise<void>;
}

export interface ClientSocket {
  write: (data: string) => Promise<void>;
  end: (data?: string) => void;
  buffer: string;
}

const parseHeaders = (data: string): Record<string, string> => {
  const lines = data.split('\r\n');
  const entries = lines.slice(1)
    .map(line => line.split(': '))
    .filter(([key, value]) => key && value)
    .map(([key, value]) => [key.toLowerCase(), value]);
  
  return Object.fromEntries(entries);
}

export const setupSocketServer = async (name: string, port: number, handler: MessageHandler): Promise<EffectService<void>> => {
  await new Promise<void>((resolve, reject) => {
    const wsServer = new WebSocketServer({ noServer: true });
    
    wsServer.on('connection', (ws, req) => {
      console.log(`A client has connected to ${name} (WebSocket)`);

      const cs: ClientSocket = {
        write: async (message: string) => {
          return new Promise<void>((resolve, reject) => {
            ws.send(Buffer.from(message + '\0', 'utf8'), { binary: true }, (err) => {
              if (err) {
                reject(err);
                return;
              }
              resolve();
            });
          })
        },

        end: (d) => ws.close(undefined, d),
        buffer: ''
      }

      ws.on('message', (data) => {
        const str = data.toString();
        if (!str.startsWith('GET')) {
          handler.handle(cs, data.toString());
        }
      });

      ws.on('close', () => {
        handler.disconnect(cs).then(() => {
          cs.end()
          console.log('A client has disconnected (WebSocket)');
        });
      });

      ws.on('error', console.error);
    });
  
    net.createServer((socket) => {
      socket.once('data', (buffer) => {
        const dataStr = buffer.toString()

        if (dataStr.startsWith('GET')) {
          const headerEnd = dataStr.indexOf('\r\n\r\n');
          if (headerEnd === -1) {
            socket.destroy();
            return;
          }

          const requestText = dataStr.slice(0, headerEnd + 4);
          const head = Buffer.from(dataStr.slice(headerEnd + 4), 'binary');

          // This is a websocket connection.
          // Only the bytes after the HTTP upgrade headers belong in the ws "head" buffer.
          wsServer.handleUpgrade({
            headers: parseHeaders(requestText),
            method: 'GET',
            socket,
            url: '/',
          }, socket, head, (ws) => {
            wsServer.emit('connection', ws, { headers: parseHeaders(requestText), method: 'GET' });
          });
        } else {
          socket.setEncoding('utf8')
          console.log(`A client has connected to ${name}`);

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
            },
            buffer: ''
          }

          socket.on('data', (data: string | Buffer) => {
            const packets = (cs.buffer + data.toString()).split('\0');
            cs.buffer = packets.pop() ?? '';

            for (const packet of packets) {
              if (packet.length > 0) {
                handler.handle(cs, packet);
              }
            }
          });

          socket.on('close', () => {
            handler.disconnect(cs).then(() => {
              cs.end();
              console.log('A client has disconnected');
            });
          });

          // Re-emit the data so the TCP handler gets the first packet too
          socket.emit('data', buffer);

          socket.on('error', console.error);
        }
      });
    }).listen(port, () => {
      console.log(`${name} server listening on port ${port}`);
      resolve();
    }).on('error', (err) => {
      reject(err)
    });
  })
}
