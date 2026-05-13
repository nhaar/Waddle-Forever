export interface CommandResponse<Ctx> {
  runCallback: (ctx: Ctx, args: Array<string>) => void;
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
    this._listeners.get(name)?.runCallback(ctx, args);
  }
}