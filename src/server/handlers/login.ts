import { loginHandler } from './play/login';
import { Handler } from '.';
import { LoginClient } from '@server/socket-server/login/login-client';

const handler = new Handler<LoginClient>();
handler.use(loginHandler);

export default handler;