import { ClientSocket } from "@server/socket-server";
import { BaseHandler } from "./generator";

export class XmlHandler<ContextMap extends Record<string, any>, ContextTypes extends (keyof ContextMap & string)[]> extends BaseHandler<ContextMap, ContextTypes> {
  public override getMessageType(): string {
    return 'xml';
  }

  public override messageParser(message: string) {
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

  public xml(
    name: string,
    method: (ctx: GetCtxObj<ContextTypes, ContextMap>, data: string) => void | Promise<void>
  ) {
    const callback = async (ctx: ValidCtxObj<ContextMap>, data: string) => {
      method(ctx as GetCtxObj<ContextTypes, ContextMap>, data);
    }
    
    this.addCallback(name, callback);
  }
}