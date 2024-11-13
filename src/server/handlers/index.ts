import { XtPacket } from '..';
import { Client } from '../penguin';
import express, { Express } from 'express';

type XTCallback = (client: Client, ...args: string[]) => void

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

export class XtHandler {
  listeners: Map<string, XTCallback[]>;
  disonnectListeners: XTCallback[];
  phpListeners: Map<string, PostCallback>;

  constructor () {
    this.listeners = new Map<string, XTCallback[]>();
    this.disonnectListeners = [];
    this.phpListeners = new Map<string, PostCallback>();
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

  post (path: string, method: PostCallback): void {
    this.phpListeners.set(path, method);
  }

  disconnect (method: XTCallback): void {
    this.disonnectListeners.push(method);
  }

  private getPacketName (code: string, extension: string): string {
    return `${extension}%${code}`;
  }

  getCallback (packet: XtPacket): (XTCallback[] | undefined) {
    return this.listeners.get(this.getPacketName(packet.code, packet.handler));
  }

  use (handler: XtHandler): void {
    handler.listeners.forEach((callbacks, name) => {
      const existingCallbacks = this.listeners.get(name);
      if (existingCallbacks === undefined) {
        this.listeners.set(name, callbacks);
      } else {
        this.listeners.set(name, [...existingCallbacks, ...callbacks]);
      }
    });
    this.disonnectListeners = [...this.disonnectListeners, ...handler.disonnectListeners];
    handler.phpListeners.forEach((callback, name) => {
      this.phpListeners.set(name, callback);
    })
  }

  useEndpoints (server: Express) {
    server.use(express.urlencoded({ extended: true }))
    this.phpListeners.forEach((callback, path) => {
      server.post(path, (req, res) => {
        res.send(callback(req.body))
      })
    })
  }
}
