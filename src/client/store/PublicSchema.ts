export type PublicSchema = {
  disableAds: boolean;
  enableDiscordRPC: boolean;
  enableDiscordRPCTracker: boolean;
  lastLanguage: string;
  lastMultiplayerGuest?: {
    ip: string;
    port?: number;
  };
}
