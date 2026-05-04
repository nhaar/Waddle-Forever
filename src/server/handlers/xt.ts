import { logdebug } from "@server/logger";
import { ClientSocket } from "@server/socket-server";
import { BaseHandler, CallbackParams } from "./generator";
import { HANDLE_ARGUMENTS, HandleName, HandleArguments, handlePacketNames, GetArgumentsType, ArgumentsIndicator } from './handles';

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


export class XtHandler<Client extends ClientSocket, ContextMap extends Record<string, any>, ContextTypes extends (keyof ContextMap & string)[]> extends BaseHandler<Client, ContextMap, ContextTypes> {
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
    params?: CallbackParams
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
    
    this.addCallback(packetName, callback, params);
  }
}