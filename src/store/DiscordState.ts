import { Client } from "discord-rpc";

export type DiscordState = {
  currentLocation?: CPLocation,
  trackedLocations?: CPLocation[],
  client?: Client,
  gameName?: string,
  startTimestamp?: Date,
  windowReloadRegistered?: boolean,
}

export type CPLocation = {
  id: number,
  name: string,
  key?: string,
  type: CPLocationType,
  match: string,
}

export enum CPLocationType {
  Room = 0,
  Game = 1,
}