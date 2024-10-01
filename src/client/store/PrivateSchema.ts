import { DiscordState } from "./DiscordState";

export type PrivateSchema = {
  discordState?: DiscordState;
  fullScreen: boolean;
  darwinUrl: string | undefined;
}