import connectHandler from './play/connect';
import as1 from './play/as1';
import { XtHandler } from '.';

const handler = new XtHandler();
handler.use(connectHandler);
handler.use(as1);

export default handler;