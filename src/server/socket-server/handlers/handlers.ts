import { CardJitsu } from "@server/socket-server/world/card";
import { SledRace } from "@server/socket-server/world/sled";
import { PenguinEnvironment, World } from "@server/socket-server/world/world";
import { WorldGame } from "@server/socket-server/world/world-game";
import { UserPenguin, WorldPenguin } from "@server/socket-server/world/world-penguin";
import { WorldRoom } from "@server/socket-server/world/world-room";
import { PenguinMessenger } from "../messenger";
import { GameData } from "@server/timelines/game-data";
import { SettingsManager } from "@server/settings";
import { PenguinRepository } from "@server/database/database";
import { ClientSocket } from "@server/socket-server/socket-server";
import { OfflineWorld } from "../offline-world";
import { FireGame } from "../world/fire";

export type PenguinPersister = (p: UserPenguin, force?: boolean) => Promise<void>;

type Ctx<Global, AlwaysSingular, EventuallySingular, EventuallyCommon> = Global & AlwaysSingular & ({} | (EventuallySingular & ({} | EventuallyCommon)));

export type WorldContext = Ctx<GlobalContext, AlwaysSingularContext, EventuallySingularContext, PenguinEnvironment>;

export type BaseContext = GlobalContext & AlwaysSingularContext & ({} | EventuallySingularContext);
export type PenguinContext = BaseContext & EventuallySingularContext & (PenguinEnvironment | {});
export type RoomContext = PenguinContext & { room: WorldRoom };
export type GameContext = PenguinContext & { game: WorldGame };
export type CardContext = PenguinContext & { card: CardJitsu };
export type SledContext = PenguinContext & { sled: SledRace };
export type FireContext = PenguinContext & { fire: FireGame };

type GlobalContext = {
  world: World;
  msg: PenguinMessenger;
  data: GameData;
  settings: SettingsManager;
  db: PenguinRepository;
  prst: PenguinPersister;
  off: OfflineWorld;
}

type AlwaysSingularContext = {
  client: ClientSocket;
}

type EventuallySingularContext = {
  penguin: WorldPenguin;
}

export type HandlerFunction<Ctx extends WorldContext, Args extends readonly any[]> = (ctx: Ctx, ...args: Args) => void | Promise<void>;

export type GuardFunction<Ctx extends WorldContext> = (ctx: Ctx) => boolean;

export type PenguinHandler<T extends any[]> = HandlerFunction<PenguinContext, T>;
export type RoomHandler<T extends any[]> = HandlerFunction<RoomContext, T>;
export type GameHandler<T extends any[]> = HandlerFunction<GameContext, T>;
export type CreateHandler<T extends any[]> = HandlerFunction<BaseContext, T>;
export type CardHandler<T extends any[]> = HandlerFunction<CardContext, T>;
export type SledHandler<T extends any[]> = HandlerFunction<SledContext, T>;
export type FireHandler<T extends any[]> = HandlerFunction<FireContext, T>;

export type PenguinGuard = GuardFunction<PenguinContext>;
export type RoomGuard = GuardFunction<RoomContext>;
export type SledGuard = GuardFunction<SledContext>;
export type CardGuard = GuardFunction<CardContext>
export type GameGuard = GuardFunction<GameContext>
export type FireGuard = GuardFunction<FireContext>;
