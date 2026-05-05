import { logverbose } from "@server/logger";
import { ClientSocket, getXtMessage } from "..";

export class PenguinMessenger {
  constructor(private socket: ClientSocket) {}
  
  public async send(message: string, ...args: Array<string | number>): Promise<void> {
    logverbose('\x1b[32mSending XT:\x1b[0m ', message, args);
    await this.socket.write(getXtMessage(false, message, ...args));
  }

  public async sendXml(action: string, body: string, room?: number): Promise<void> {
    const roomString = room === undefined ? '' : ` r="${room}"`
    console.log('Sending the XML', `<msg t="sys"><body action="${action}"${roomString}>${body}</body></msg>`);
    await this.socket.write(`<msg t="sys"><body action="${action}"${roomString}>${body}</body></msg>`);
  }

  public async sendLastless(message: string, ...args: Array<string | number>): Promise<void> {
    await this.socket.write(getXtMessage(true, message, ...args));
  }

  public sendDomainPolicy() {
    // TODO socket ending: this needs to be "garbage collected?"
    this.socket.end('<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>');
  }
}

