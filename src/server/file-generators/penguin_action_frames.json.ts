import { FRAME_HACKS } from "@server/game-data/frame-hacks";
import { GameData } from "@server/timelines/game-data";

export function getPenguinActionFramesJson(d: GameData) {
  return FRAME_HACKS.getJSON();
}