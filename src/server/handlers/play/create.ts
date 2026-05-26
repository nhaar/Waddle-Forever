import { WorldContext } from "@server/socket-server/world/world";
import { HandlerFunction } from "../xt";

type CreateHandler<T extends any[]> = HandlerFunction<WorldContext, ['client', 'msg', 'db'], T>;

export const handleCheckName: CreateHandler<[string]> = async ({ client, msg, db }, name) => {
  const isInvalid = !(name.length > 2 && name.length <= 12 && !(await db.exists(name)));
  msg.send(client, 'checkName', isInvalid ? 1 : 0, name);
}