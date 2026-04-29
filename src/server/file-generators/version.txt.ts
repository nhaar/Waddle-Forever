import { GameData } from "@server/timelines/game-data";

/** Get the version.txt file used in preCPIP */
export function getVersionTxt(d: GameData): string {
  const version = d.getChatVersion();
  return `&v=${version}\n`;
}