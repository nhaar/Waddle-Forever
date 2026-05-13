import { WorldContext } from "@server/socket-server/world/world";
import { XtHandler } from "../xt";

const handler = new XtHandler<WorldContext, ['client', 'msg', 'db']>(['client', 'msg', 'db']);

handler.xt('m', 'checkName', ['string'], async ({ client, msg, db }, name) => {
  const isInvalid = !(name.length > 2 && name.length <= 12 && !(await db.exists(name)));
  msg.send(client, 'checkName', isInvalid ? 1 : 0, name);
});

export {
  handler as createHandler
};