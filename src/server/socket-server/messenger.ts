import { ClientSocket } from "./socket-server";

export abstract class Messenger<Penguin> {
  private _clients = new Map<Penguin, ClientSocket>();
  private _penguins = new Map<ClientSocket, Penguin>();

  public constructor(
    private _delimiter: string
  ) {
  }

  abstract isPenguin(p: unknown): p is Penguin;

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

  protected async write(ps: Penguin | ClientSocket | Array<ClientSocket | Penguin>, message: string): Promise<void> {
    if (!Array.isArray(ps)) {
      ps = [ps];
    }

    await Promise.all(ps.map(p => (this.isPenguin(p) ? this._clients.get(p) : p)?.write(message + this._delimiter)));
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