import joinHandler from './play/join';
import { worldLoginHandler } from './play/login';
import navigationHandler from './play/navigation';
import gameHandler from './play/game';
import sledHandler from './games/sled';
import cardHandler from './games/card';
import { Handler } from '.';
import { WorldClient, WorldContext } from '@server/new-client';

const handler = new Handler<WorldClient, WorldContext, []>([]);
handler.use(worldLoginHandler);
handler.use(joinHandler);
handler.use(navigationHandler);
handler.use(gameHandler);
handler.use(sledHandler);
handler.use(cardHandler);

export default handler;