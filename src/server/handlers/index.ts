import { XtPacket } from '..';
import { Client } from '../penguin';
import express, { Express } from 'express';

type XTCallback = (client: Client, ...args: string[]) => void
type XMLCallback = (client: Client, data: string) => void

type PostCallback = (body: any) => string

type XtParams = {
  once?: boolean
}

function oncePerPacket(packetName: string, originalMethod: (client: Client, ...args: string[]) => void) {
  return function (client: Client, ...args: string[]) {
    const handled = client.handledXts.get(packetName);
    if (handled !== true) {
      client.handledXts.set(packetName, true);
      originalMethod(client, ...args);
    }
  };
}

export class Handler {
  listeners: Map<string, XTCallback[]>;
  disconnectListeners: XTCallback[];
  loginListeners: XTCallback[];
  phpListeners: Map<string, PostCallback>;
  xmlListeners: Map<string, XMLCallback>;

  constructor () {
    this.listeners = new Map<string, XTCallback[]>();
    this.disconnectListeners = [];
    this.loginListeners = [];
    this.phpListeners = new Map<string, PostCallback>();
    this.xmlListeners = new Map<string, XMLCallback>();
  }
  xt (extension: string, code: string, method: XTCallback, params?: XtParams): void
  xt (code: string, method: XTCallback, params?: XtParams): void

  /* Add listener for XT packet */
  xt (...args: Array<string | XTCallback | XtParams | undefined>): void {
    let extension = 's';
    let code: string;
    let method: XTCallback;
    let params: XtParams = {};
    if (typeof args[1] === 'string') {
      if (typeof args[0] !== 'string') {
        throw new Error('');
      }
      if (typeof args[1] !== 'string') {
        throw new Error('');
      }
      if (typeof args[2] !== 'function') {
        throw new Error();
      }
      extension = args[0];
      code = args[1];
      method = args[2];
    } else {
      if (typeof args[0] !== 'string') {
        throw new Error('');
      }
      if (typeof args[1] !== 'function') {
        throw new Error('');
      }
      code = args[0];
      method = args[1];
    }
    const last = args.slice(-1)[0]
    if (last !== undefined) {
      params = last as XtParams;
    }

    const packetName = this.getPacketName(code, extension);
    if (params.once === true) {
      method = oncePerPacket(packetName, method);
    }

    const callbacks = this.listeners.get(packetName);
    if (callbacks === undefined) {
      this.listeners.set(packetName, [method]);
    } else {
      this.listeners.set(packetName, [...callbacks, method]);
    }
  }

  /** Add listener for an XML action */
  xml (action: string, method: XMLCallback): void {
    this.xmlListeners.set(action, method);
  }

  post (path: string, method: PostCallback): void {
    this.phpListeners.set(path, method);
  }

  disconnect (method: XTCallback): void {
    this.disconnectListeners.push(method);
  }

  private getPacketName (code: string, extension: string): string {
    return `${extension}%${code}`;
  }

  getCallback (packet: XtPacket): (XTCallback[] | undefined) {
    return this.listeners.get(this.getPacketName(packet.code, packet.handler));
  }

  /** Handles incoming raw data sent from a client */
  handle (client: Client, data: string) {
    if (data.startsWith('<')) {
      this.handleXml(client, data);
    } else {
      this.handleXt(client, data);
    }
  }

  /** Handles responding to XML data */
  private handleXml (client: Client, data: string) {
    console.log('Incoming XML data: ', data);
    if (data === '<policy-file-request/>') {
      // policy file request must terminate connection (not fully sure of the details for that)
      client.socket.end('<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>');
    } else {
      // not very sophisticated XML handling, but it's sufficient
      const actionMatch = data.match(/action='(\w+)'/);
      if (actionMatch === null) {
        console.log('Unknown XML request: ', data);
      } else {
        const action = actionMatch[1];
        const callback = this.xmlListeners.get(action);
        if (callback === undefined) {
          console.log('Unhandled XML request: ', data);
        } else {
          callback(client, data);
        }   
      }
    }
  }

  /** Handles responding to XT packets of data */
  private handleXt(client: Client, data: string) {
    const packet = new XtPacket(data);
    const callbacks = this.getCallback(packet);
    if (callbacks === undefined) {
      console.log('\x1b[31mUnhandled XT:\x1b[0m ', packet);
    } else {
      console.log('\x1b[33mHandled XT:\x1b[0m ', packet);
      callbacks.forEach((callback) => {
        callback(client, ...packet.args);
      });
    }
  }

  use (handler: Handler): void {
    handler.listeners.forEach((callbacks, name) => {
      const existingCallbacks = this.listeners.get(name);
      if (existingCallbacks === undefined) {
        this.listeners.set(name, callbacks);
      } else {
        this.listeners.set(name, [...existingCallbacks, ...callbacks]);
      }
    });
    this.disconnectListeners = [...this.disconnectListeners, ...handler.disconnectListeners];
    this.loginListeners = [...this.loginListeners, ...handler.loginListeners];
    handler.phpListeners.forEach((callback, name) => {
      this.phpListeners.set(name, callback);
    })
    handler.xmlListeners.forEach((callback, action) => {
      this.xmlListeners.set(action, callback);
    });
  }

  /** Handlers that listen for POST requests in the HTTP server */
  useEndpoints (server: Express) {
    server.use(express.urlencoded({ extended: true }))
    // this is currently only required because of .php routes
    this.phpListeners.forEach((callback, path) => {
      server.post(path, (req, res) => {
        res.send(callback(req.body))
      })
    })
  }
}
