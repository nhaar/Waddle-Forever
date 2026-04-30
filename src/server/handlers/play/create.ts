import { Handler } from "..";
import { Handle } from "../handles";

const handler = new Handler();

handler.xt(Handle.CheckNameOld, (client, name) => {
  const isValid = (name.length > 2 && name.length <= 12 && !client.server.penguinExists(name)) ? 0 : 1;
  client.sendXt('checkName', isValid, name);
});

export default handler;
