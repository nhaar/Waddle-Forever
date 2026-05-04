import { logdebug } from '../logger';
import { ClientSocket } from '@server/socket-server';

type GetCtxObj<
  Types extends readonly (keyof ContextMap)[],
  ContextMap extends Record<string, any>
> = {
  [K in Types[number]]: ContextMap[K];
};

type ValidCtxObj<ContextMap extends Record<string, any>> = Partial<GetCtxObj<readonly (keyof ContextMap)[], ContextMap>>;

export type CallbackSignature<Client extends ClientSocket, ContextMap extends Record<string, any>> = ( ctx: ValidCtxObj<ContextMap> & { client: Client }, data: string ) => Promise<void>;

export interface HandlerCallback<Client extends ClientSocket, ContextMap extends Record<string, any>> {
  call: CallbackSignature<Client, ContextMap>;
}

export type ListenerMap<Client extends ClientSocket, ContextMap extends Record<string, any>> = Map<
  string, // message name
  Array<{
    context: Array<keyof ContextMap & string>,
    callback: HandlerCallback<Client, ContextMap>
  }> // array of callbacks
>;

type MessageParser = (message: string) => { name: string; data: string; } | null;

export interface HandlerGenerator<Client extends ClientSocket, ContextMap extends Record<string, any>> {
  getMessageType: () => string;
  messageParser: MessageParser;
  getListeners: () => ListenerMap<Client, ContextMap>;
};

export class Handler<Client extends ClientSocket, ContextMap extends Record<string, any>> {
  private listeners = new Map<
    string, // message type
    ListenerMap<Client, ContextMap>
  >();

  // parse a message until it finds a type of message
  private messageParsers = new Map<string, MessageParser>();

  constructor (private getContext: (client: Client) => ValidCtxObj<ContextMap>) {}

  /** Handles incoming raw data sent from a client */
  handle (client: Client, data: string) {
    const context = this.getContext(client);
    for (const [name, parser] of this.messageParsers.entries()) {
      const info = parser(data);
      if (info === null) {
        continue;
      }
      const contextEntities = new Set(Object.entries(context).filter(([_, value]) => value !== undefined).map(([key]) => key));
      // const hash = hashType();
      const callbacks = this.listeners.get(name)?.get(info.name);
      callbacks?.forEach(callbackInfo => {
        const { context: ctx, callback } = callbackInfo;
        ctx.every(entity => contextEntities.has(entity));
        callback.call({ ...context, client }, info.data);
      });
      if (callbacks === undefined || callbacks.length === 0) {
        logdebug(`\x1b[31mUnhandled message (context: ${[...contextEntities.values()].join(':')}):\x1b[0m`, info.name);
      }
      return;
    }
  }

  /** Uses a generator to increment the number of listeners */
  use(generator: HandlerGenerator<Client, ContextMap>): void {
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
  }
}