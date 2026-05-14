import { WorldContext } from "@server/socket-server/world/world";
import { XtHandler } from "../xt";

const handler = new XtHandler<WorldContext, ['penguin', 'msg']>(['penguin', 'msg']);

handler.xt('z', 'ggd', [], ({ msg, penguin }) => {
  msg.send(penguin, 'ggd', penguin.puffleLaunch.data === null ? '' : penguin.puffleLaunch.data.toString('utf-8') );
}); 

export {
  handler as gameHandler
};