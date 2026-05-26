import { CreateHandler } from "../handlers";

export const handleCheckName: CreateHandler<[string]> = async ({ client, msg, db }, name) => {
  const isInvalid = !(name.length > 2 && name.length <= 12 && !(await db.exists(name)));
  msg.send(client, 'checkName', isInvalid ? 1 : 0, name);
}