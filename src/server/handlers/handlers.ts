import { BaseContext, CardContext, GameContext, PenguinContext, RoomContext, SledContext, WorldContext } from "@server/socket-server/world/world";

export type HandlerFunction<Ctx extends WorldContext, Args extends readonly any[]> = (ctx: Ctx, ...args: Args) => void | Promise<void>;

export type GuardFunction<Ctx extends WorldContext> = (ctx: Ctx) => boolean;

export type PenguinHandler<T extends any[]> = HandlerFunction<PenguinContext, T>;
export type RoomHandler<T extends any[]> = HandlerFunction<RoomContext, T>;
export type GameHandler<T extends any[]> = HandlerFunction<GameContext, T>;
export type CreateHandler<T extends any[]> = HandlerFunction<BaseContext, T>;
export type CardHandler<T extends any[]> = HandlerFunction<CardContext, T>;
export type SledHandler<T extends any[]> = HandlerFunction<SledContext, T>;

export type PenguinGuard = GuardFunction<PenguinContext>;
export type RoomGuard = GuardFunction<RoomContext>;
export type SledGuard = GuardFunction<SledContext>;
export type CardGuard = GuardFunction<CardContext>
export type GameGuard = GuardFunction<GameContext>