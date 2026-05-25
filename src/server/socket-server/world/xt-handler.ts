import { ArgumentsIndicator, parseArgs } from "@server/handlers/arg-parser";
import { WorldContext } from "./world";
import { ClientSocket } from "..";

const parseXtMessage = (message: string): [string, string[]] => {
  const values = message.split('%');
  if (values[1] !== 'xt') {
    throw new Error(`Invalid XT message: ${message}`);
  }

  const name = values.slice(2, 4).join('%');
  const args = values.slice(5, values.length - 1); // last is empty

  return [name, args];
}

export type XtCallbackInfo = [
  [Array<keyof WorldContext & string>,
  (ctx: Partial<WorldContext>) => boolean],
  ArgumentsIndicator,
  (ctx: Partial<WorldContext>, ...args: Array<string | number>) => void | Promise<void>,
  XtParams
];

type XtCallbackInfoWrapped = [
  [Array<keyof WorldContext & string>,
  (ctx: Partial<WorldContext>) => boolean],
  ArgumentsIndicator,
  CallbackManager
];

export type XtParams = {
  once?: boolean
  /**
   * In miliseconds, how much to wait before accepting the next packet
   * from the same client
   */
  cooldown?: number
}

class CallbackManager {
  private _cooldown: number | null = null;
  private _once: boolean = false;
  private _handled = new Map<ClientSocket, boolean>();
  private _timestamps = new Map<ClientSocket, number>();

  constructor(private _callback: (ctx: Partial<WorldContext>, ...args: Array<string | number>) => Promise<void> | void, params?: XtParams) {
    if (params?.cooldown !== undefined) {
      this._cooldown = params.cooldown;
    }
    if (params?.once !== undefined) {
      this._once = params.once;
    }
  }

  call(client: ClientSocket, ctx: Partial<WorldContext>, ...args: Array<string | number>) {
    if (this._cooldown !== null) {
      const last = this._timestamps.get(client);

      if (last !== undefined && last + this._cooldown > Date.now()) {
        console.log('Rate limited');
        return;
      }
    }

    if (this._once) {
      if (this._handled.get(client)) {
        console.log('Already handled');
        return;
      }
    }

    this._callback(ctx, ...args);
  }
}

export class XtHandler {
  private _callbacks: Map<string, XtCallbackInfoWrapped[]>;

  constructor(callbacks: Array<[string, XtCallbackInfo[]]>, private _disconnect: (ctx: Partial<WorldContext>) => Promise<void>) {
    this._callbacks = new Map(
      callbacks.map(
        ([key, value]) => [key, value.map(
          ([pair, args, callback, params]) => [pair, args, new CallbackManager(callback, params)]
        )]
      )
    );
  }

  public handle(client: ClientSocket, context: Partial<WorldContext>, message: string) {
    const [name, args] = parseXtMessage(message);
    
    console.log('incoming XT:', name, args);

    const callbacks = this._callbacks.get(name);

    if (callbacks !== undefined) {
      const callbackInfo = callbacks.find(([[contextTypes, guard]]) => {
        return contextTypes.every(prop => context[prop] !== undefined) && guard(context);
      });
      if (callbackInfo === undefined) {
        console.log('Unhandled XT for given context: ', context);
        return;
      }

      const [_, signature, callback] = callbackInfo;
      const parsedArgs = parseArgs(args, signature);
      if (parsedArgs === null) {
        console.log('Incorrect type signature');
      } else {
        callback.call(client, context, ...parsedArgs);
      }
    }
  }

  public async disconnect(context: Partial<WorldContext>) {
    await this._disconnect(context);
  }
}