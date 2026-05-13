export interface CommandResponse<Ctx> {
  getCallback: (args: Array<string>) => ((ctx: Ctx, ...args: Array<string | number>) => void) | undefined;
}

export class CommandsHandler<Ctx> {
  private _listeners: Map<
    string,
    CommandResponse<Ctx>
  >;

  constructor(listeners: Array<[string, CommandResponse<Ctx>]>) {
    this._listeners = new Map(listeners);
  }

  public run(ctx: Ctx, name: string, args: Array<string>) {
    const callback = this._listeners.get(name)?.getCallback(args);

    if (callback !== undefined) {
      callback(ctx, ...args);
    }
  }
}