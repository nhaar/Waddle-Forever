import net from 'net';
import { WebSocketServer } from 'ws'

interface MessageHandler {
  handle: (client: ClientSocket, message: string) => void;
  disconnect: (client: ClientSocket) => void;
}

export interface ClientSocket {
  write: (data: string) => Promise<void>;
  end: (data?: string) => void;
}

// export interface XtSocket extends ClientSocket {
//   sendXt: (message: string, ...args: Array<string | number>) => void;
// }

export abstract class SocketServer {
  protected handler: MessageHandler;

  constructor(private name: string, private port: number) {
    this.handler = this.createHandler();
  }

  async setupServer() {
    await new Promise<void>((resolve, reject) => {
      const wsServer = new WebSocketServer({ noServer: true });
      
      wsServer.on('connection', (ws, req) => {
        console.log(`A client has connected to ${this.name} (WebSocket)`);

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

        ws.on('message', (data) => {
          this.handler.handle(cs, data.toString());
        });

        ws.on('close', () => {
          this.handler.disconnect(cs);
          cs.end();
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
            console.log(`A client has connected to ${this.name}`);

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

            socket.on('data', (data: Buffer) => {
              const dataStr = data.toString().split('\0')[0];
              this.handler.handle(cs, dataStr);
            });

            socket.on('close', () => {
              this.handler.disconnect(cs);
              cs.end();
              console.log('A client has disconnected');
            });

            // Re-emit the data so the TCP handler gets the first packet too
            socket.emit('data', buffer);

            socket.on('error', console.error)
          }
        });
      }).listen(this.port, () => {
        console.log(`${this.name} server listening on port ${this.port}`);
        resolve();
      }).on('error', (err) => {
        reject(err)
      });
    })

  }

  abstract createHandler(): MessageHandler;
}