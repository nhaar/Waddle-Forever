import { WorldContext } from "@server/socket-server/world/world";
import { CtxObj } from ".";

type HandlerFunction<ContextMap extends Record<string, any>, ContextTypes extends (keyof ContextMap & string)[], Args extends any[]> = (ctx: CtxObj<ContextTypes, ContextMap>, ...args: Args) => void | Promise<void>;

type GuardFunction<ContextMap extends Record<string, any>, ContextTypes extends (keyof ContextMap & string)[]> = (ctx: CtxObj<ContextTypes, ContextMap>) => boolean;

export type PenguinHandler<T extends any[]> = HandlerFunction<WorldContext, ['penguin', 'world', 'data', 'msg', 'prst', 'db', 'settings'], T>;
export type RoomHandler<T extends any[]> = HandlerFunction<WorldContext, ['penguin', 'world', 'data', 'msg', 'prst', 'db', 'room'], T>;
export type GameHandler<T extends any[]> = HandlerFunction<WorldContext, ['penguin', 'msg', 'game', 'data', 'prst'], T>;
export type CreateHandler<T extends any[]> = HandlerFunction<WorldContext, ['client', 'msg', 'db'], T>;
export type CardHandler<T extends any[]> = HandlerFunction<WorldContext, ['penguin', 'world', 'data', 'msg', 'prst', 'db', 'card', 'settings'], T>;
export type SledHandler<T extends any[]> = HandlerFunction<WorldContext, ['penguin', 'world', 'data', 'msg', 'prst', 'db', 'sled', 'settings'], T>;

export type PenguinGuard = GuardFunction<WorldContext, ['penguin', 'world', 'data', 'msg', 'prst', 'db']>;
export type RoomGuard = GuardFunction<WorldContext, ['penguin', 'world', 'data', 'msg', 'prst', 'db', 'room']>;
export type SledGuard = GuardFunction<WorldContext, ['world', 'penguin', 'sled', 'msg', 'prst', 'data']>;
export type CardGuard = GuardFunction<WorldContext, ['penguin', 'world', 'data', 'msg', 'prst', 'db', 'card']>
export type GameGuard = GuardFunction<WorldContext, ['penguin', 'msg', 'game', 'data', 'prst']>