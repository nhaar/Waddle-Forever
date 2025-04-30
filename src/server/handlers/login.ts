import loginHandler from './play/login';
import { Handler } from '.';

const handler = new Handler();
handler.use(loginHandler);

export default handler;