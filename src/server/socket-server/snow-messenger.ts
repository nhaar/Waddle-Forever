import { getGreenString, getYellowString, logverbose } from "@server/logger";
import { ClientSocket } from "@server/socket-server/socket-server";
import { SnowPlayer } from "./world/snow/snow";
import { Messenger } from "./messenger";

export class SnowMessenger extends Messenger<SnowPlayer> {
  constructor() {
    super('\r\n');
  }
  
  isPenguin(p: unknown): p is SnowPlayer {
    return p instanceof SnowPlayer;
  }
  
  public async send(client: ClientSocket | SnowPlayer | SnowPlayer[], message: string, ...args: Array<string | number>): Promise<void> {
    if (Array.isArray(client)) {
      client = client.filter(c => (c instanceof SnowPlayer) && !c.disconnected);
      if (client.length === 0) return;
    } else if ((client instanceof SnowPlayer) && client.disconnected) {
      return;
    }

    logverbose(getGreenString('sending snow data: '), message, args);
    const msg = `[${message}]|${args.join('|')}|`
    await this.write(client, msg);
  }
}