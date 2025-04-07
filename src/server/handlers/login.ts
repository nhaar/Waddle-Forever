import connectHandler from './play/connect';
import { XtHandler } from '.';

const handler = new XtHandler();
handler.use(connectHandler);

export default handler;