import { ElectronBlocker } from "@cliqz/adblocker-electron";
import { DiscordState } from "./DiscordState";

export type PrivateSchema = {
  blocker?: ElectronBlocker;
  discordState?: DiscordState;
  fullScreen: boolean;
  darwinUrl: string | undefined;
}