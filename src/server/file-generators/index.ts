import { iterateEntries } from "@common/utils";
import { GameData } from "@server/timelines/game-data";
import { getStampsJson } from "./stamps.json";

export type FileGenerator = (d: GameData) => Buffer | string;

const GENERATORS: Record<string, FileGenerator> = {
  'en/web_service/stamps.json': getStampsJson,
  'play/en/web_service/game_configs/stamps.json': getStampsJson
};

export function getGeneratorsMap(): Map<string, FileGenerator> {
  const map = new Map<string, FileGenerator>();
  iterateEntries(GENERATORS, (key, value) => map.set(key, value));
  return map;
}