import connectHandler from './play/connect';
import as1 from './play/as1';
import { Handler } from '.';

const handler = new Handler();
handler.use(connectHandler);
handler.use(as1);

export default handler;