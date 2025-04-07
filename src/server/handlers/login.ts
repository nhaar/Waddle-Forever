import connectHandler from './play/connect';
import { Handler } from '.';

const handler = new Handler();
handler.use(connectHandler);

export default handler;