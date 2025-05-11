import { XtPacket } from '..';
import { Client, Server } from '../client';
import express, { Express } from 'express';
import { HANDLE_ARGUMENTS, HandleName, HandleArguments, handlePacketNames, GetArgumentsType, ArgumentsIndicator } from './handles';
import { logdebug } from '../logger';

type XTCallback = (client: Client, ...args: string[]) => void
type XMLCallback = (client: Client, data: string) => void

type PostCallback = (body: any) => string

type XtParams = {
  once?: boolean
  /**
   * In miliseconds, how much to wait before accepting the next packet
   * from the same client
   */
  cooldown?: number
}

/** Get a function that checks at runtime the types given so it can be used for a client callback */
export function getHandlerCallback<Arguments extends ArgumentsIndicator>(
  argTypes: Arguments,
  method: (client: Client, ...args: GetArgumentsType<Arguments>) => void
) {
  let callback = (client: Client, ...args: Array<string>) => {
    let validArgs: unknown[] = [];
    let valid = true;

    const checkString = (type: string | undefined) => {
      if (type === undefined) {
        valid = false;
      } else {
        validArgs.push(type);
      }
    }

    const checkNumber = (type: string | undefined) => {
      const num = Number(type);
      if (isNaN(num)) {
        valid = false;
      } else {
        validArgs.push(num);
      }
    }

    args.forEach((arg, i) => {
      if (argTypes === 'string') {
        checkString(arg);
      } else if (argTypes === 'number') {
        checkNumber(arg);
      } else {
        switch (argTypes[i]) {
          case 'number':
            checkNumber(arg)
            break;
          case 'string':
            checkString(arg)
            break;
        }
      }

    });

    if (valid) {
      method(client, ...validArgs as GetArgumentsType<Arguments>)
    }
  }

  return callback;
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

/** Wraps XT callback so that it respects the cooldown */
function timestampWrapper(packetName: string, cooldown: number, originalMethod: XTCallback) {
  return (client: Client, ...args: string[]) => {
    const now = Date.now()
    const timestamp = client.xtTimestamps.get(packetName);
    // check if has a record or if we are past the allowed time
    if (timestamp === undefined || timestamp < now) {
      client.xtTimestamps.set(packetName, now + cooldown);
      originalMethod(client, ...args);
    } else {
      logdebug(`Packet ${packetName} canceled due to spam`);
    }
  }
}

export class Handler {
  listeners: Map<string, XTCallback[]>;
  disconnectListeners: XTCallback[];
  loginListeners: XTCallback[];
  phpListeners: Map<string, PostCallback>;
  xmlListeners: Map<string, XMLCallback>;
  onBoot: Array<(s: Server) => void>;

  constructor () {
    this.listeners = new Map<string, XTCallback[]>();
    this.disconnectListeners = [];
    this.loginListeners = [];
    this.phpListeners = new Map<string, PostCallback>();
    this.xmlListeners = new Map<string, XMLCallback>();
    this.onBoot = [];
  }

  /**
   * Setup a listener to a XT packet
   * @param name Name of the packet - This defines the code and the arguments used in the callback
   * @param method Listener to be added
   * @param params Params that restrict when this listener will run
   */
  xt<
    Name extends HandleName
  >(
    name: Name,
    method: (client: Client, ...args: GetArgumentsType<HandleArguments[Name]>) => void,
    params?: XtParams
  ) {
    const xt = handlePacketNames.get(name);
    if (xt === undefined) {
      throw new Error(`Invalid XT name: ${name}`);
    }
    const argTypes = HANDLE_ARGUMENTS[name];
    const packetName = this.getPacketName(xt.code, xt.extension);

    let callback = getHandlerCallback<HandleArguments[Name]>(argTypes, method)

    if (params?.once === true) {
      callback = oncePerPacket(packetName, callback);
    }
    if (params?.cooldown !== undefined) {
      callback = timestampWrapper(packetName, params.cooldown, callback);
    }

    const callbacks = this.listeners.get(packetName);
    if (callbacks === undefined) {
      this.listeners.set(packetName, [callback]);
    } else {
      this.listeners.set(packetName, [...callbacks, callback]);
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

  boot(callback: (s: Server) => void) {
    this.onBoot.push(callback);
  }

  bootServer(s: Server): void {
    this.onBoot.forEach((callback) => callback(s));
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
    logdebug('Incoming XML data: ', data);
    if (data === '<policy-file-request/>') {
      // policy file request must terminate connection (not fully sure of the details for that)
      client.socket.end('<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>');
    } else {
      // not very sophisticated XML handling, but it's sufficient
      const actionMatch = data.match(/action='(\w+)'/);
      if (actionMatch === null) {
        logdebug('Unknown XML request: ', data);
      } else {
        const action = actionMatch[1];
        const callback = this.xmlListeners.get(action);
        if (callback === undefined) {
          logdebug('Unhandled XML request: ', data);
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
      logdebug('\x1b[31mUnhandled XT:\x1b[0m ', packet);
    } else {
      logdebug('\x1b[33mHandled XT:\x1b[0m ', packet);
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
    this.onBoot = [...handler.onBoot, ...this.onBoot];
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
