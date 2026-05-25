import { PenguinMessenger } from "@server/handlers/messenger"
import { World } from "./world"
import { GameData } from "@server/timelines/game-data"
import { SettingsManager } from "@server/settings"
import { PenguinRepository } from "@server/database/database"
import { ClientSocket } from ".."

export type LoginContext = {
  msg: PenguinMessenger,
  world?: World,
  data: GameData,
  settings: SettingsManager,
  db: PenguinRepository,
  client: ClientSocket
}

const parseXmlMessage = (message: string): [string, string] => {
  if (message === '<policy-file-request/>') {
    return ['policy', message];
  } else {
    const actionMatch = message.match(/action='(\w+)'/);
    const action = actionMatch === null ? '' : actionMatch[1];
    return [action, message];
  }
}

export class XmlHandler {
  constructor(private _callbacks: Map<string, (ctx: LoginContext, data: string) => void | Promise<void>>) {}

  public handle(context: LoginContext, message: string) {
    const [action, data] = parseXmlMessage(message);
    const callback = this._callbacks.get(action);
    if (callback !== undefined) {
      callback(context, data);
    }
  }
}