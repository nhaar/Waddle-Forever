import { logdebug } from "@server/logger";
import { CtxObj, ValidCtxObj } from ".";
import { BaseHandler, CallbackParams } from "./generator";
import { ArgumentsIndicator, GetArgumentsType, parseArgs } from "./arg-parser";

export class XtPacket {
  handler: string;
  code: string;
  args: string[];

  constructor (message: string) {
    const args = message.split('%');
    args.shift(); // initial ''
    if (args.shift() !== 'xt') {
      throw new Error(`Invalid XT message: ${message}`);
    }

    this.handler = args.shift() ?? '';
    this.code = args.shift() ?? '';
    args.shift(); // -1 that always exists
    args.pop(); // ends with % so has an empty string at the end
    this.args = [...args];
  }
}


export class XtHandler<ContextMap extends Record<string, any>, ContextTypes extends (keyof ContextMap & string)[]> extends BaseHandler<ContextMap, ContextTypes> {
  public override getMessageType(): string {
    return 'xt';
  }

  public override messageParser(message: string) {
    try {
      const packet = new XtPacket(message);
      logdebug('\x1b[33mIncoming XT:\x1b[0m ', packet);
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
  method: (ctx: CtxObj<ContextTypes, ContextMap>, ...args: GetArgumentsType<Arguments>) => void
) {
  let callback = (ctx: CtxObj<ContextTypes, ContextMap>, ...args: Array<string>): void => {
    const parsed = parseArgs(args, argTypes);
    if (parsed !== null) {
      method(ctx, ...parsed);
    }
  }

  return callback;
}

/**
   * Setup a listener to a XT packet
   * @param name Name of the packet - This defines the code and the arguments used in the callback
   * @param method Listener to be added
   * @param params Params that restrict when this listener will run
   */
  public xt<const T extends ArgumentsIndicator>(
    ext: string,
    code: string,
    args: T,
    method: (ctx: CtxObj<ContextTypes, ContextMap>, ...args: GetArgumentsType<T>) => void | Promise<void>,
    params?: CallbackParams
  ): void;
  public xt<const T extends ArgumentsIndicator>(
    packets: Array<[string, string]>,
    args: T,
    method: (ctx: CtxObj<ContextTypes, ContextMap>, ...args: GetArgumentsType<T>) => void | Promise<void>,
    params?: CallbackParams
  ): void;

  public xt<const T extends ArgumentsIndicator>(
    ...argArray: any[]
  ) {
    // TODO unrepeat code
    let packets: Array<[string, string]>;
    let args: T;
    let method: (ctx: CtxObj<ContextTypes, ContextMap>, ...args: GetArgumentsType<T>) => void | Promise<void>;
    let params: CallbackParams | undefined;

    if (typeof argArray[0] === 'string') {
      packets = [[argArray[0], argArray[1]]];
      args = argArray[2];
      method = argArray[3];
      params = argArray[4];
    } else {
      packets = argArray[0];
      args = argArray[1];
      method = argArray[2];
      params = argArray[3];
    }

    const names = packets.map(([ext, code]) => `${ext}%${code}`);

    const xtCallback = this.getHandlerCallback<T>(args, method);
    // TODO async, but no await
    const callback = async (ctx: ValidCtxObj<ContextMap>, data: string) => {
      xtCallback(ctx as CtxObj<ContextTypes, ContextMap>, ...data.split('%'));
    }
    
    names.forEach(name => this.addCallback(name, callback, params));
  }
}