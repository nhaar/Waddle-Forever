import { ClientSocket } from "@server/socket-server";
import { CallbackSignature, HandlerCallback, HandlerGenerator, ListenerMap } from ".";

export type CallbackParams = {
  once?: boolean
  /**
   * In miliseconds, how much to wait before accepting the next packet
   * from the same client
   */
  cooldown?: number
}

type HighLevelHandlerSignature<ContextMap extends Record<string, any>> = (ctx: ValidCtxObj<ContextMap>, data: string) => Promise<void>;

class HandlerCallbackManager<ContextMap extends Record<string, any>> implements HandlerCallback<ContextMap> {
  private handled = new Map<ClientSocket, boolean>();
  private timestamps = new Map<ClientSocket, number>();
  private fn: CallbackSignature<ContextMap>;

  constructor(fn: HighLevelHandlerSignature<ContextMap>, params: CallbackParams = {}) {
    this.fn = (_, c, d) => fn(c, d);
    if (params.cooldown !== undefined) {
      this.fn = this.wrapTimestap(this.fn, params.cooldown);
    }
    if (params.once !== undefined) {
      this.fn = this.wrapOncePerPacket(this.fn);
    }
  }

  private wrapOncePerPacket(originalMethod: CallbackSignature<ContextMap>) {
    const newCallback: CallbackSignature<ContextMap> = async (client, ctx, data) => {
      // technical flaw: can't know if this was succesful or not (previous system used boolean system)
      if (!this.handled.get(client)) {
        await originalMethod(client, ctx, data);
        this.handled.set(client, true);
      }
    }
    return newCallback;
  }

  private wrapTimestap(originalMethod: CallbackSignature<ContextMap>, cooldown: number) {
    const newCallback: CallbackSignature<ContextMap> = async (client, ctx, data) => {
      const lastTime = this.timestamps.get(client);
      const now = Date.now();
      if (lastTime === undefined || lastTime + cooldown < now) {
        this.timestamps.set(client, now);
        originalMethod(client, ctx, data);
      }
    }

    return newCallback;
  }

  async call(client: ClientSocket, ctx: ValidCtxObj<ContextMap>, data: string) {
    await this.fn(client, ctx, data);
    // TODO method to "garbage collect" dead client instances.
  }
}

export abstract class BaseHandler<ContextMap extends Record<string, any>, ContextTypes extends (keyof ContextMap & string)[]> implements HandlerGenerator<ContextMap> {
  private listeners: ListenerMap<ContextMap> = new Map();

  constructor(private types: ContextTypes) {}

  public getListeners(): ListenerMap<ContextMap> {
    return this.listeners;
  }

  public abstract getMessageType(): string;

  public abstract messageParser(message: string): { name: string; data: string } | null;

  protected addCallback(name: string, callback: (ctx: ValidCtxObj<ContextMap>, data: string) => Promise<void>, params: CallbackParams = {}) {
    const newCallback = new HandlerCallbackManager(callback, params);

    let previousCallbacks = this.listeners.get(name);
    if (previousCallbacks === undefined) {
      previousCallbacks = [];
      this.listeners.set(name, previousCallbacks);
    }
    previousCallbacks.push({
      context: this.types,
      callback: newCallback
    });
  }
}