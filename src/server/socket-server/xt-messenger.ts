import { getGreenString, getYellowString, logverbose } from "@server/logger";
import { ClientSocket } from "@server/socket-server/socket-server";
import { WorldPenguin } from "@server/socket-server/world/world-penguin";
import { Messenger } from "./messenger";

const getXtMessageLastless = (handler: string, ...args: Array<number | string>): string => {
  return `%xt%${handler}%-1%` + args.join('%');
}

const getXtMessage = (handler: string, ...args: Array<number | string>): string => {
  return getXtMessageLastless(handler, ...args) + '%';
}

export class XtMessenger extends Messenger<WorldPenguin> {
  constructor() {
    super('\0');
  }

  isPenguin(p: unknown): p is WorldPenguin {
    return p instanceof WorldPenguin;
  }
  
  public async send(penguins: WorldPenguin | ClientSocket | Array<ClientSocket | WorldPenguin>, message: string, ...args: Array<string | number>): Promise<void> {
    logverbose(getGreenString('sending XT: '), message, args);
    await this.write(penguins, getXtMessage(message, ...args));
  }

  public async sendXml(client: ClientSocket, action: string, body: string, room?: number) {
    const roomString = room === undefined ? '' : ` r="${room}"`;
    const xml = `<msg t="sys"><body action="${action}"${roomString}>${body}</body></msg>`;
    logverbose(getYellowString('Sending XML: '), xml);
    await this.write(client, xml);
  }
}