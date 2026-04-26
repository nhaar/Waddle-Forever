import { iterateEntries } from "@common/utils";
import { GameData } from "@server/timelines/game-data";

export type FileGenerator = (d: GameData) => Buffer;

const GENERATORS: Record<string, FileGenerator> = {
  
};

export function getGeneratorsMap(): Map<string, FileGenerator> {
  const map = new Map<string, FileGenerator>();
  iterateEntries(GENERATORS, (key, value) => map.set(key, value));
  return map;
}