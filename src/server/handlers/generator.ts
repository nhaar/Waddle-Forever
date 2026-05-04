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

class HandlerCallbackManager<Client extends ClientSocket, ContextMap extends Record<string, any>> implements HandlerCallback<Client, ContextMap> {
  private handled = new Map<Client, boolean>();
  private timestamps = new Map<Client, number>();

  constructor(private fn: CallbackSignature<Client, ContextMap>, params: CallbackParams = {}) {
    if (params.cooldown !== undefined) {
      this.fn = this.wrapTimestap(this.fn, params.cooldown);
    }
    if (params.once !== undefined) {
      this.fn = this.wrapOncePerPacket(this.fn);
    }
  }

  private wrapOncePerPacket(originalMethod: CallbackSignature<Client, ContextMap>) {
    const newCallback: CallbackSignature<Client, ContextMap> = async (ctx, data) => {
      // technical flaw: can't know if this was succesful or not (previous system used boolean system)
      if (!this.handled.get(ctx.client)) {
        await originalMethod(ctx, data);
        this.handled.set(ctx.client, true);
      }
    }
    return newCallback;
  }

  private wrapTimestap(originalMethod: CallbackSignature<Client, ContextMap>, cooldown: number) {
    const newCallback: CallbackSignature<Client, ContextMap> = async (ctx, data) => {
      const lastTime = this.timestamps.get(ctx.client);
      const now = Date.now();
      if (lastTime === undefined || lastTime + cooldown < now) {
        this.timestamps.set(ctx.client, now);
        originalMethod(ctx, data);
      }
    }

    return newCallback;
  }

  async call(ctx: ValidCtxObj<ContextMap> & { client: Client }, data: string) {
    await this.fn(ctx, data);
    // TODO method to "garbage collect" dead client instances.
  }
}

export abstract class BaseHandler<Client extends ClientSocket, ContextMap extends Record<string, any>, ContextTypes extends (keyof ContextMap & string)[]> implements HandlerGenerator<Client, ContextMap> {
  private listeners: ListenerMap<Client, ContextMap> = new Map();

  constructor(private types: ContextTypes) {}

  public getListeners(): ListenerMap<Client, ContextMap> {
    return this.listeners;
  }

  public abstract getMessageType(): string;

  public abstract messageParser(message: string): { name: string; data: string } | null;

  protected addCallback(name: string, callback: CallbackSignature<Client, ContextMap>, params: CallbackParams = {}) {
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