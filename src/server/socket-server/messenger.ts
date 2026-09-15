import { getGreenString, getYellowString, logverbose } from "@server/logger";
import { ClientSocket } from "@server/socket-server/socket-server";
import { WorldPenguin } from "@server/socket-server/world/world-penguin";

const getXtMessageLastless = (handler: string, ...args: Array<number | string>): string => {
  return `%xt%${handler}%-1%` + args.join('%');
}

const getXtMessage = (handler: string, ...args: Array<number | string>): string => {
  return getXtMessageLastless(handler, ...args) + '%';
}

export class PenguinMessenger<Penguin extends object = WorldPenguin> {
  private _clients = new Map<Penguin, ClientSocket>();
  private _penguins = new Map<ClientSocket, Penguin>();

  private isPenguin: (value: Penguin | ClientSocket) => value is Penguin;

  constructor(isPenguin?: (value: Penguin | ClientSocket) => value is Penguin) {
    this.isPenguin = isPenguin ?? ((value) => value instanceof WorldPenguin) as (value: Penguin | ClientSocket) => value is Penguin;
  }

  public getPenguin(client: ClientSocket): Penguin | undefined {
    return this._penguins.get(client);
  }

  public linkClient(client: ClientSocket, penguin: Penguin) {
    this._clients.set(penguin, client);
    this._penguins.set(client, penguin);
  }

  public unlinkClient(penguin: Penguin): void {
    const client = this._clients.get(penguin);
    if (client !== undefined) {
      this._penguins.delete(client);
    }
    this._clients.delete(penguin);
  }

  private async write(ps: Penguin | ClientSocket | Array<ClientSocket | Penguin>, message: string, delimiter: string = '\0'): Promise<void> {
    if (!Array.isArray(ps)) {
      ps = [ps];
    }

    await Promise.all(ps.map(p => (this.isPenguin(p) ? this._clients.get(p) : p)?.write(message + delimiter)));
  }

  public async send(penguins: Penguin | ClientSocket | Array<ClientSocket | Penguin>, message: string, ...args: Array<string | number>): Promise<void> {
    logverbose(getGreenString('sending XT: '), message, args);
    await this.write(penguins, getXtMessage(message, ...args));
  }

  public async sendXml(client: ClientSocket, action: string, body: string, room?: number) {
    const roomString = room === undefined ? '' : ` r="${room}"`;
    const xml = `<msg t="sys"><body action="${action}"${roomString}>${body}</body></msg>`;
    logverbose(getYellowString('Sending XML: '), xml);
    await this.write(client, xml);
  }

  public async sendSnowData(client: ClientSocket | Penguin, message: string, ...args: Array<string | number>): Promise<void> {
    logverbose(getGreenString('sending snow data: '), message, args);
    const msg = `[${message}]|${args.join('|')}|`
    await this.write(client, msg, '\r\n');
  }

  public close() {
    for (const client of this._clients.values()) {
      client.end();
    }
  }

  public getClients(): ClientSocket[] {
    return [...this._clients.values()];
  }

  public getClient(p: Penguin): ClientSocket {
    const cs = this._clients.get(p);
    if (cs === undefined) {
      throw new Error('No client socket bound to penguin');
    }
    return cs;
  }
}