import { XtPacket } from '..';
import { HANDLE_ARGUMENTS, HandleName, HandleArguments, handlePacketNames, GetArgumentsType, ArgumentsIndicator } from './handles';
import { logdebug } from '../logger';
import { ClientSocket } from '@server/socket-server';

export interface MessageClient {
  socket: ClientSocket;
}

function hashType(a: string[]): string {
  return a.sort().join(';');
}

type GetCtxObj<
  T extends readonly (keyof M)[],
  M extends Record<string, any>
> = {
  [K in T[number]]: M[K];
};
type ValidCtxObj<M extends Record<string, any>> = Partial<GetCtxObj<readonly (keyof M)[], M>>;

type XTCallback<Client extends ClientSocket, ContextMap extends Record<string, any>> = (ctx: ValidCtxObj<ContextMap> & { client: Client }, ...args: string[]) => boolean;
type ClientCallback<Client extends ClientSocket> = (client: Client) => void
type XMLCallback<Client extends ClientSocket, ContextMap extends Record<string, any>> = (ctx: ValidCtxObj<ContextMap> & { client: Client }, data: string) => void;
// type XMLCallback<Client extends ClientSocket> = (client: Client, data: string) => void

type XtParams = {
  once?: boolean
  /**
   * In miliseconds, how much to wait before accepting the next packet
   * from the same client
   */
  cooldown?: number
}

// todo makes these methods
// function oncePerPacket<Client extends MessageClient>(handler: Handler<Client>, packetName: string, originalMethod: (client: Client, ...args: string[]) => boolean) {
//   return function (client: Client, ...args: string[]) {
//     if (!handler.clientAlreadyHandledMessage(client, packetName)) {
//       if (originalMethod(client, ...args)) {
//         handler.setClientHandled(client, packetName);
//         return true;
//       } else {
//         return false;
//       }
//     } else {
//       return true;
//     }
//   };
// }

// /** Wraps XT callback so that it respects the cooldown */
// function timestampWrapper<Client extends MessageClient>(handler: Handler<Client>, packetName: string, cooldown: number, originalMethod: XTCallback<Client>) {
//   return (client: Client, ...args: string[]): boolean => {
//     const now = Date.now()
//     // check if has a record or if we are past the allowed time
//     if (handler.isMessageOnCooldown(client, packetName, now)) {
//       logdebug(`Packet ${packetName} canceled due to spam`);
//       return true;
//     } else {
//       handler.setMessageCooldown(client, packetName, now + cooldown);
//       return originalMethod(client, ...args);
//     }
//   }
// }

type ListenerMap<Client extends ClientSocket, ContextMap extends Record<string, any>> = Map<
      string, // context id
      Map<
        string, // message name
        Array<( ctx: ValidCtxObj<ContextMap> & { client: Client }, data: string ) => Promise<void>> // array of callbacks
      >
    >;

type MessageParser = (message: string) => { name: string; data: string; } | null;

interface HandlerGenerator<Client extends ClientSocket, ContextMap extends Record<string, any>> {
  getMessageType: () => string;
  messageParser: MessageParser;
  getListeners: () => ListenerMap<Client, ContextMap>;
};

export class Handler<Client extends ClientSocket, ContextMap extends Record<string, any>> {
  private listeners = new Map<
    string, // message type
    ListenerMap<Client, ContextMap>
  >();

  private messageParsers = new Map<string, MessageParser>();

  // private listeners = new Map<string, Map<string, Array<( ctx: ValidCtxObj<ContextMap>, message: string ) => Promise<void>>>>();

  // listeners = new Map<string, Map<string, XTCallback<Client, ContextMap>[]>>();
  // xmlListeners: Map<string, XMLCallback<Client, ContextMap>>;
  // loginListeners: ClientCallback<Client>[];

  // private handledMessagesMap = new Map<Client, Set<string>>();
  // private handledMessageTimes = new Map<Client, Map<string, number>>();

  // private _commandHandler: ((client: Client, message: string) => void) | undefined;

  // private _types: ContextTypes;
  private getContext: ((client: Client) => ValidCtxObj<ContextMap> );

  constructor (getContext: (client: Client) => ValidCtxObj<ContextMap>) {
    // this.loginListeners = [];
    // this.xmlListeners = new Map<string, XMLCallback<Client, ContextMap>>();

    // this._types = types;
    this.getContext = getContext;
  }

  // public get types() {
  //   return this._types;
  // }

  // public clientAlreadyHandledMessage(client: Client, message: string): boolean {
  //   return this.handledMessagesMap.get(client)?.has(message) === true;
  // }

  // public setClientHandled(client: Client, message: string): void {
  //   const prev = this.handledMessagesMap.get(client);
  //   if (prev === undefined) {
  //     this.handledMessagesMap.set(client, new Set(message));
  //   } else {
  //     prev.add(message);
  //   }
  // }

  // public isMessageOnCooldown(client: Client, message: string, now: number): boolean {
  //   const cooldown = this.handledMessageTimes.get(client)?.get(message);

  //   if (cooldown === undefined) {
  //     return false;
  //   }

  //   return now < cooldown;
  // }

  // get hash() {
  //   return hashType(this._types);
  // }

  // public setMessageCooldown(client: Client, message: string, time: number): void {
  //   const prev = this.handledMessageTimes.get(client);
  //   if (prev === undefined) {
  //     this.handledMessageTimes.set(client, new Map<string, number>([[message, time]]));
  //   } else {
  //     prev.set(message, time);
  //   }
  // }

  // /**
  //  * Setup a listener to a XT packet
  //  * @param name Name of the packet - This defines the code and the arguments used in the callback
  //  * @param method Listener to be added
  //  * @param params Params that restrict when this listener will run
  //  */
  // xt<
  //   Name extends HandleName
  // >(
  //   name: Name,
  //   method: (ctx: GetCtxObj<ContextTypes, ContextMap> & { client: Client }, ...args: GetArgumentsType<HandleArguments[Name]>) => void | Promise<void>,
  //   params?: XtParams
  // ) {
  //   const xt = handlePacketNames.get(name);
  //   if (xt === undefined) {
  //     throw new Error(`Invalid XT name: ${name}`);
  //   }
  //   const argTypes = HANDLE_ARGUMENTS[name];
  //   const packetName = this.getPacketName(xt.code, xt.extension);

  //   let callback = getHandlerCallback<HandleArguments[Name], Client, ContextMap, ContextTypes>(argTypes, method)

  //   // if (params?.once === true) {
  //   //   callback = oncePerPacket(this, packetName, callback);
  //   // }
  //   // if (params?.cooldown !== undefined) {
  //   //   callback = timestampWrapper(this, packetName, params.cooldown, callback);
  //   // }

  //   const hash = this.hash;
  //   let ctxCallbacks = this.listeners.get(hash);
  //   if (ctxCallbacks === undefined) {
  //     ctxCallbacks = new Map();
  //     this.listeners.set(hash, ctxCallbacks);
  //     // this.listeners.set(packetName, [callback]);
  //   }
    
  //   let callbacks = ctxCallbacks.get(packetName);
  //   if (callbacks === undefined) {
  //     callbacks = [];
  //     ctxCallbacks.set(packetName, callbacks);
  //   }
  //   callbacks.push(callback as any);
  // }

  // /** Add listener for an XML action */
  // xml (action: string, method: (ctx: GetCtxObj<ContextTypes, ContextMap> & { client: Client }, data: string) => void): void {
  //   this.xmlListeners.set(action, method as any);
  // }

  // private getPacketName (code: string, extension: string): string {
  //   return `${extension}%${code}`;
  // }

  // getCallback (packet: XtPacket): (XTCallback<Client>[] | undefined) {
  //   return this.listeners.get(this.getPacketName(packet.code, packet.handler));
  // }

  /** Handles incoming raw data sent from a client */
  handle (client: Client, data: string) {
    const context = this.getContext(client);
    for (const [name, parser] of this.messageParsers.entries()) {
      const info = parser(data);
      if (info === null) {
        continue;
      }
      const hash = hashType(Object.entries(context).filter(([_, value]) => value !== undefined).map(([key]) => key));
      const callbacks = this.listeners.get(name)?.get(hash)?.get(info.name);
      callbacks?.forEach(callback => {
        callback({ ...context, client }, info.data);
      });
      return;
    }
  }

  // addCommandsHandler(handler: (client: Client, message: string) => void) {
  //   this._commandHandler = handler;
  // }

  // getCommandsHandler() {
  //   return this._commandHandler;
  // }

  // runCommand (client: Client, command: string) {
  //   if (this._commandHandler !== undefined) {
  //     this._commandHandler(client, command);
  //   }
  // }

  // /** Handles responding to XML data */
  // private handleXml (context: ValidCtxObj<ContextMap>, client: Client, data: string) {
  //   logdebug('Incoming XML data: ', data);
  //   if (data === '<policy-file-request/>') {
  //     // policy file request must terminate connection (not fully sure of the details for that)
  //     client.end('<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>');
  //   } else {
  //     // not very sophisticated XML handling, but it's sufficient
  //     const actionMatch = data.match(/action='(\w+)'/);
  //     if (actionMatch === null) {
  //       logdebug('Unknown XML request: ', data);
  //     } else {
  //       const action = actionMatch[1];
  //       const callback = this.xmlListeners.get(action);
  //       if (callback === undefined) {
  //         logdebug('Unhandled XML request: ', data);
  //       } else {
  //         callback({ ...context, client }, data);
  //       }
  //     }
  //   }
  // }

  // /** Handles responding to XT packets of data */
  // private handleXt(context: ValidCtxObj<ContextMap>, client: Client, data: string) {
  //   const packet = new XtPacket(data);
  //   logdebug('\x1b[33mIncoming XT:\x1b[0m ', packet);

    

  //   const ctxCallbacks = this.listeners.get(hash);
  //   let handled = false;

  //   if (ctxCallbacks !== undefined) {
  //     const callbacks = ctxCallbacks.get(this.getPacketName(packet.code, packet.handler));
  //     callbacks?.forEach((callback) => {
  //       if (callback({ ...context, client }, ...packet.args)) {
  //         handled = true;
  //       }
  //     });
  //   }

  //   if (!handled) {
  //     logdebug(`\x1b[31mUnhandled XT in the (${hash}) context:\x1b[0m`, packet);
  //   }
  // }

  use(generator: HandlerGenerator<Client, ContextMap>): void {
    const type = generator.getMessageType();
    let typeListeners = this.listeners.get(type);
    if (typeListeners === undefined) {
      this.messageParsers.set(type, generator.messageParser);
      typeListeners = new Map();
      this.listeners.set(type, typeListeners);
    }

    for (const [ctx, messageMap] of generator.getListeners().entries()) {
      let previousMessageMap = typeListeners.get(ctx);
      if (previousMessageMap === undefined) {
        previousMessageMap = new Map();
        typeListeners.set(ctx, previousMessageMap);
      }
      for (const [messageName, callbacks] of messageMap.entries()) {
        let prevCallbacks = previousMessageMap.get(messageName);
        if (prevCallbacks === undefined) {
          prevCallbacks = [];
          previousMessageMap.set(messageName, prevCallbacks);
        }
        for (const callback of callbacks) {
          prevCallbacks.push(callback);
        }
      }
    }
  }

  // use<T extends (keyof ContextMap & string)[]>(handler: Handler<Client, ContextMap, T>): void {
  //   handler.listeners.forEach((ctxCallbacks, ctx) => {
  //     let existingCtxCallbacks = this.listeners.get(ctx);
  //     if (existingCtxCallbacks === undefined) {
  //       existingCtxCallbacks = new Map();
  //       this.listeners.set(ctx, existingCtxCallbacks);
  //     }
  //     const ectxCallbacks = existingCtxCallbacks;
  //     ctxCallbacks.forEach((callbacks, name) => {
  //       const existingCallbacks = ectxCallbacks.get(name);
  //       if (existingCallbacks === undefined) {
  //         ectxCallbacks.set(name, callbacks);
  //       } else {
  //         ectxCallbacks.set(name, [...existingCallbacks, ...callbacks]);
  //       }
  //     })
  //   });
    
  //   // handler.listeners.forEach((callbacks, name) => {
  //   //   const existingCallbacks = this.listeners.get(name);
  //   //   if (existingCallbacks === undefined) {
  //   //     this.listeners.set(name, callbacks);
  //   //   } else {
  //   //     this.listeners.set(name, [...existingCallbacks, ...callbacks]);
  //   //   }
  //   // });
  //   this.loginListeners = [...this.loginListeners, ...handler.loginListeners];
  //   handler.xmlListeners.forEach((callback, action) => {
  //     this.xmlListeners.set(action, callback);
  //   });
  //   const comandsHandler = handler.getCommandsHandler();
  //   if (comandsHandler !== undefined) {
  //     this.addCommandsHandler(comandsHandler);
  //   }
  // }
}

export class XtHandler<Client extends ClientSocket, ContextMap extends Record<string, any>, ContextTypes extends (keyof ContextMap & string)[]> implements HandlerGenerator<Client, ContextMap> {
  private listeners: ListenerMap<Client, ContextMap> = new Map();
  private types: ContextTypes;
  private hash: string;

  constructor(types: ContextTypes) {
    this.types = types;
    // TODO hasher function
    this.hash = hashType(this.types);
  }

  public getListeners(): ListenerMap<Client, ContextMap> {
    return this.listeners;
  }

  public getMessageType(): string {
    return 'xt';
  }

  public messageParser(message: string) {
    try {
      const packet = new XtPacket(message);
      return {
        name: `${packet.handler}%${packet.code}`,
        data: packet.args.join('%')
      };  
    } catch (error) {
      return null;
    }
  }

/** Get a function that checks at runtime the types given so it can be used for a client callback */
getHandlerCallback<Arguments extends ArgumentsIndicator>(
  argTypes: Arguments,
  method: (ctx: GetCtxObj<ContextTypes, ContextMap> & { client: Client }, ...args: GetArgumentsType<Arguments>) => void
) {
  let callback = (ctx: GetCtxObj<ContextTypes, ContextMap> & { client: Client }, ...args: Array<string>): boolean => {
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
      method(ctx, ...validArgs as GetArgumentsType<Arguments>)
    }
    return valid;
  }

  return callback;
}

/**
   * Setup a listener to a XT packet
   * @param name Name of the packet - This defines the code and the arguments used in the callback
   * @param method Listener to be added
   * @param params Params that restrict when this listener will run
   */
  public xt<
    Name extends HandleName
  >(
    name: Name,
    method: (ctx: GetCtxObj<ContextTypes, ContextMap> & { client: Client }, ...args: GetArgumentsType<HandleArguments[Name]>) => void | Promise<void>,
    params?: XtParams
  ) {
    const xt = handlePacketNames.get(name);
    if (xt === undefined) {
      throw new Error(`Invalid XT name: ${name}`);
    }
    const argTypes = HANDLE_ARGUMENTS[name];
    // TODO unrepeat code
    const packetName = `${xt.extension}%${xt.code}`;

    const xtCallback = this.getHandlerCallback<HandleArguments[Name]>(argTypes, method);
    // TODO async, but no await
    const callback = async (ctx: ValidCtxObj<ContextMap> & { client: Client }, data: string) => {
      xtCallback(ctx as GetCtxObj<ContextTypes, ContextMap> & { client: Client }, ...data.split('%'));
    }
    // if (params?.once === true) {
    //   callback = oncePerPacket(this, packetName, callback);
    // }
    // if (params?.cooldown !== undefined) {
    //   callback = timestampWrapper(this, packetName, params.cooldown, callback);
    // }

    let ctxCallbacks = this.listeners.get(this.hash);
    if (ctxCallbacks === undefined) {
      ctxCallbacks = new Map();
      this.listeners.set(this.hash, ctxCallbacks);
      // this.listeners.set(packetName, [callback]);
    }
    
    let callbacks = ctxCallbacks.get(packetName);
    if (callbacks === undefined) {
      callbacks = [];
      ctxCallbacks.set(packetName, callbacks);
    }
    callbacks.push(callback);
  }
}

export class XmlHandler<Client extends ClientSocket, ContextMap extends Record<string, any>, ContextTypes extends (keyof ContextMap & string)[]> implements HandlerGenerator<Client, ContextMap> {
  private listeners: ListenerMap<Client, ContextMap> = new Map();
  private types: ContextTypes;
  private hash: string;

  constructor(types: ContextTypes) {
    this.types = types;
    // TODO hasher function
    this.hash = hashType(this.types);
  }

  public getListeners(): ListenerMap<Client, ContextMap> {
    return this.listeners;
  }

  public getMessageType(): string {
    return 'xml';
  }

  // logdebug('Incoming XML data: ', data);
  //   if (data === '<policy-file-request/>') {
  //     // policy file request must terminate connection (not fully sure of the details for that)
  //     client.end('<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>');
  //   } else {
  //     // not very sophisticated XML handling, but it's sufficient
  //     const actionMatch = data.match(/action='(\w+)'/);
  //     if (actionMatch === null) {
  //       logdebug('Unknown XML request: ', data);
  //     } else {
  //       const action = actionMatch[1];
  //       const callback = this.xmlListeners.get(action);
  //       if (callback === undefined) {
  //         logdebug('Unhandled XML request: ', data);
  //       } else {
  //         callback({ ...context, client }, data);
  //       }
  //     }

  public messageParser(message: string) {
    let name = '';
    let data = message;

    if (!message.startsWith('<')) {
      return null;
    }

    if (message === '<policy-file-request/>') {
      name = 'policy';
    } else {
      const actionMatch = data.match(/action='(\w+)'/)
      name = actionMatch === null ? '' : actionMatch[1];
    }
    if (name === null) {
      return null;
    } else {
      return { name, data };
    }
  }

/**
   * Setup a listener to a XT packet
   * @param name Name of the packet - This defines the code and the arguments used in the callback
   * @param method Listener to be added
   * @param params Params that restrict when this listener will run
   */
  public xml(
    name: string,
    method: (ctx: GetCtxObj<ContextTypes, ContextMap> & { client: Client }, data: string) => void | Promise<void>,
    params?: XtParams
  ) {
    // const xt = handlePacketNames.get(name);
    // if (xt === undefined) {
    //   throw new Error(`Invalid XT name: ${name}`);
    // }
    // const argTypes = HANDLE_ARGUMENTS[name];
    // TODO unrepeat code
    // const packetName = `${xt.extension}%${xt.code}`;

    // const xtCallback = this.getHandlerCallback<HandleArguments[Name]>(argTypes, method);
    // TODO async, but no await
    const callback = async (ctx: ValidCtxObj<ContextMap> & { client: Client }, data: string) => {
      method(ctx as GetCtxObj<ContextTypes, ContextMap> & { client: Client }, data);
    }
    // if (params?.once === true) {
    //   callback = oncePerPacket(this, packetName, callback);
    // }
    // if (params?.cooldown !== undefined) {
    //   callback = timestampWrapper(this, packetName, params.cooldown, callback);
    // }

    let ctxCallbacks = this.listeners.get(this.hash);
    if (ctxCallbacks === undefined) {
      ctxCallbacks = new Map();
      this.listeners.set(this.hash, ctxCallbacks);
      // this.listeners.set(packetName, [callback]);
    }
    
    let callbacks = ctxCallbacks.get(name);
    if (callbacks === undefined) {
      callbacks = [];
      ctxCallbacks.set(name, callbacks);
    }
    callbacks.push(callback);
  }
}

// (message: string) => { name: string; data: string; } | null