import { ArgumentsIndicator, parseArgs } from "@server/handlers/arg-parser";
import { WorldContext } from "./world";

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
  (ctx: Partial<WorldContext>, ...args: Array<string | number>) => void | Promise<void>
];

type XtCallbacks = XtCallbackInfo[];

export class XtHandler {
  constructor(private _callbacks: Map<string, XtCallbacks>, private _disconnect: (ctx: Partial<WorldContext>) => Promise<void>) {}

  public handle(context: Partial<WorldContext>, message: string) {
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
        callback(context, ...parsedArgs);
      }
    }
  }

  public async disconnect(context: Partial<WorldContext>) {
    await this._disconnect(context);
  }
}