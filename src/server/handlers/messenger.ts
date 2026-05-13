import { logverbose } from "@server/logger";
import { ClientSocket } from "@server/socket-server";
import { WorldPenguin } from "@server/socket-server/world/world-penguin";

function getXtMessageLastless(handler: string, ...args: Array<number | string>): string {
  return `%xt%${handler}%-1%` + args.join('%');
}

export function getXtMessage(handler: string, ...args: Array<number | string>): string {
  return getXtMessageLastless(handler, ...args) + '%';
}

export class PenguinMessenger {
  private _clients = new Map<WorldPenguin, ClientSocket>();
  private _penguins = new Map<ClientSocket, WorldPenguin>();

  public getPenguin(client: ClientSocket) {
    return this._penguins.get(client);
  }

  public linkClient(client: ClientSocket, penguin: WorldPenguin) {
    this._clients.set(penguin, client);
    this._penguins.set(client, penguin);
  }

  public async write(ps: WorldPenguin | ClientSocket | Array<ClientSocket | WorldPenguin>, message: string): Promise<void> {
    if (!Array.isArray(ps)) {
      ps = [ps];
    }

    await Promise.all(ps.map(p => (p instanceof WorldPenguin ? this._clients.get(p) : p)?.write(message)));
  }

  public async send(penguins: WorldPenguin | ClientSocket | Array<ClientSocket | WorldPenguin>, message: string, ...args: Array<string | number>): Promise<void> {
    logverbose('Sending XT: ', message, args);
    await this.write(penguins, getXtMessage(message, ...args));
  }

  public async sendXml(client: ClientSocket, action: string, body: string, room?: number) {
    const roomString = room === undefined ? '' : ` r="${room}"`;
    const xml = `<msg t="sys"><body action="${action}"${roomString}>${body}</body></msg>`;
    logverbose('Sending XML: ', xml);
    await this.write(client, xml);
  }
}