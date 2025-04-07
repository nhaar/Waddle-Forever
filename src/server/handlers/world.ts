import loginHandler from './play/login';
import connectHandler from './play/connect';
import navigationHandler from './play/navigation';
import commandsHandler from './commands';
import itemHandler from './play/item';
import stampHandler from './play/stamp';
import puffleHandler from './play/puffle';
import iglooHandler from './play/igloo';
import epfHandler from './play/epf';
import mailHandler from './play/mail';
import gameHandler from './play/game';
import { Handler } from '.';

const handler = new Handler();
handler.use(connectHandler);
handler.use(loginHandler);
handler.use(navigationHandler);
handler.use(commandsHandler);
handler.use(itemHandler);
handler.use(stampHandler);
handler.use(puffleHandler);
handler.use(iglooHandler);
handler.use(epfHandler);
handler.use(mailHandler);
handler.use(gameHandler);

export default handler;