import { WorldContext } from "@server/socket-server/world/world";

type CtxObjWithTypes<
  Types extends readonly (keyof ContextMap)[],
  ContextMap extends Record<string, any>
> = {
  [K in Types[number]]: ContextMap[K];
} & {
  [K in Exclude<keyof ContextMap, Types[number]>]?: ContextMap[K] | null;
};

type CtxObj<
  Types extends readonly (keyof ContextMap)[],
  ContextMap extends Record<string, any>
> = CtxObjWithTypes<Types, ContextMap> & Partial<ContextMap>;

export type HandlerFunction<ContextTypes extends (keyof WorldContext & string)[], Args extends readonly any[]> = (ctx: CtxObj<ContextTypes, WorldContext>, ...args: Args) => void | Promise<void>;

export type GuardFunction<ContextTypes extends (keyof WorldContext & string)[]> = (ctx: CtxObj<ContextTypes, WorldContext>) => boolean;

export type PenguinHandler<T extends any[]> = HandlerFunction<['penguin', 'world', 'data', 'msg', 'prst', 'db', 'settings'], T>;
export type RoomHandler<T extends any[]> = HandlerFunction<['penguin', 'world', 'data', 'msg', 'prst', 'db', 'room'], T>;
export type GameHandler<T extends any[]> = HandlerFunction<['penguin', 'msg', 'game', 'data', 'prst'], T>;
export type CreateHandler<T extends any[]> = HandlerFunction<['client', 'msg', 'db'], T>;
export type CardHandler<T extends any[]> = HandlerFunction<['penguin', 'world', 'data', 'msg', 'prst', 'db', 'card', 'settings'], T>;
export type SledHandler<T extends any[]> = HandlerFunction<['penguin', 'world', 'data', 'msg', 'prst', 'db', 'sled', 'settings'], T>;

export type PenguinGuard = GuardFunction<['penguin', 'world', 'data', 'msg', 'prst', 'db']>;
export type RoomGuard = GuardFunction<['penguin', 'world', 'data', 'msg', 'prst', 'db', 'room']>;
export type SledGuard = GuardFunction<['world', 'penguin', 'sled', 'msg', 'prst', 'data']>;
export type CardGuard = GuardFunction<['penguin', 'world', 'data', 'msg', 'prst', 'db', 'card']>
export type GameGuard = GuardFunction<['penguin', 'msg', 'game', 'data', 'prst']>