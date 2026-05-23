import { logdebug } from '../logger';
import { ClientSocket } from '@server/socket-server';

type CtxObjWithTypes<
  Types extends readonly (keyof ContextMap)[],
  ContextMap extends Record<string, any>
> = {
  [K in Types[number]]: ContextMap[K];
} & {
  [K in Exclude<keyof ContextMap, Types[number]>]?: ContextMap[K] | null;
};

export type ValidCtxObj<ContextMap extends Record<string, any>> = Partial<ContextMap>;

export type CtxObj<
  Types extends readonly (keyof ContextMap)[],
  ContextMap extends Record<string, any>
> = CtxObjWithTypes<Types, ContextMap> & Partial<ContextMap>;

export type CallbackSignature<ContextMap extends Record<string, any>> = ( client: ClientSocket, ctx: ValidCtxObj<ContextMap>, data: string ) => Promise<void>;

export interface HandlerCallback<ContextMap extends Record<string, any>> {
  call: CallbackSignature<ContextMap>;
}

export type ListenerMap<ContextMap extends Record<string, any>> = Map<
  string, // message name
  Array<{
    context: Array<keyof ContextMap & string>,
    callback: HandlerCallback<ContextMap>
  }> // array of callbacks
>;

type MessageParser = (message: string) => { name: string; data: string; } | null;

export interface HandlerGenerator<ContextMap extends Record<string, any>> {
  getMessageType: () => string;
  messageParser: MessageParser;
  getListeners: () => ListenerMap<ContextMap>;
  disconnect: ((ctx: ValidCtxObj<ContextMap>) => Promise<void>) | null;
};

export class Handler<ContextMap extends Record<string, any>> {
  private listeners = new Map<
    string, // message type
    ListenerMap<ContextMap>
  >();

  // parse a message until it finds a type of message
  private messageParsers = new Map<string, MessageParser>();

  private _disconnect: ((ctx: ValidCtxObj<ContextMap>) => Promise<void>) | null = null;

  constructor (
    private getContext: (client: ClientSocket) => ValidCtxObj<ContextMap>
  ) {}

  async disconnect(client: ClientSocket): Promise<void> {
    if (this._disconnect !== null) {
      const context = this.getContext(client); 
      await this._disconnect(context);
    }
  }

  /** Handles incoming raw data sent from a client */
  handle (client: ClientSocket, data: string) {
    const context = this.getContext(client);
    for (const [name, parser] of this.messageParsers.entries()) {
      const info = parser(data);
      if (info === null) {
        continue;
      }
      const contextEntities = new Set(Object.entries(context).filter(([_, value]) => value !== undefined).map(([key]) => key));
      const callbacks = this.listeners.get(name)?.get(info.name);
      callbacks?.forEach(callbackInfo => {
        const { context: ctx, callback } = callbackInfo;
        if(ctx.every(entity => contextEntities.has(entity))) {
          callback.call(client, { ...context }, info.data);
        }
      });
      if (callbacks === undefined || callbacks.length === 0) {
        logdebug(`\x1b[31mUnhandled message (context: ${[...contextEntities.values()].join(':')}):\x1b[0m`, info.name);
      }
      return;
    }
  }

  /** Uses a generator to increment the number of listeners */
  use(generator: HandlerGenerator<ContextMap>): void {
    const type = generator.getMessageType();
    let typeListeners = this.listeners.get(type);
    if (typeListeners === undefined) {
      this.messageParsers.set(type, generator.messageParser);
      typeListeners = new Map();
      this.listeners.set(type, typeListeners);
    }

    for (const [name, callbacks] of generator.getListeners().entries()) {
      let previousCallbacks = typeListeners.get(name);
      if (previousCallbacks === undefined) {
        previousCallbacks = [];
        typeListeners.set(name, previousCallbacks);
      }
      for (const callback of callbacks) {
          previousCallbacks.push(callback);
        }
      
    }

    if (generator.disconnect !== null) {
      if (this._disconnect === null) {
        this._disconnect = generator.disconnect;
      } else {
        throw new Error('Conflict with disconnect handlers');
      }
    }
  }
}