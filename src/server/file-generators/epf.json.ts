import { FIELD_OPS } from "@server/game-data/field-ops";
import { GameData } from "@server/timelines/game-data";

/** Field-Ops data */
export function getEpfJson(d: GameData): string {
  return JSON.stringify(FIELD_OPS[d.fieldOp()]);
}