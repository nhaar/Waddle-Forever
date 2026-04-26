import { iterateEntries } from "@common/utils";
import { GameData } from "@server/timelines/game-data";
import { getChunkingMapJson } from "./chunking_map.json";
import { getGeneralJson } from "./general.json";
import { getStampsJson } from "./stamps.json";

export type FileGenerator = (d: GameData) => Buffer | string;

const GENERATORS: Record<string, FileGenerator> = {
  'en/web_service/stamps.json': getStampsJson,
  'play/en/web_service/game_configs/stamps.json': getStampsJson,
  'play/en/web_service/game_configs/chunking_map.json': getChunkingMapJson,
  'play/en/web_service/game_configs/general.json': getGeneralJson
};

export function getGeneratorsMap(): Map<string, FileGenerator> {
  const map = new Map<string, FileGenerator>();
  iterateEntries(GENERATORS, (key, value) => map.set(key, value));
  return map;
}