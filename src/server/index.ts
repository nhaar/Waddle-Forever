export class XtPacket {
  handler: string;
  code: string;
  args: string[];

  constructor (message: string) {
    const args = message.split('%');
    args.shift(); // initial ''
    if (args.shift() !== 'xt') {
      console.log('wrong xt:' + message);
      this.handler = '';
      this.code = '';
      this.args = [];
    }

    this.handler = args.shift() ?? '';
    this.code = args.shift() ?? '';
    args.shift(); // -1 that always exists
    args.pop(); // ends with % so has an empty string at the end
    this.args = [...args];
  }
}
