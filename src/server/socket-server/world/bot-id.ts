import { WorldPenguin } from './world-penguin';

/**
 * Bot ids start far above anything the penguin database will ever hand out,
 * so a bot can never collide with a real penguin.
 *
 * This lives in its own module with no other imports so that any file can ask
 * "is this a bot?" without creating an import cycle.
 */
export const BOT_ID_BASE = 9_000_000;

export const isBot = (p: WorldPenguin): boolean => p.id >= BOT_ID_BASE;
