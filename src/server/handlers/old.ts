import loginHandler from './play/login';
import as1 from './play/as1';
import { Handler } from '.';

const handler = new Handler();
handler.use(loginHandler);
handler.use(as1);

export default handler;