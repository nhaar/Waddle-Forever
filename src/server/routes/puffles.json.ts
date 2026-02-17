import { PuffleJson } from "@server/updates";
import { UPDATES } from "@server/updates/updates";
import { isGreater, Version } from "./versions";

export function getPufflesJsons(version: Version) {
  const puffles: PuffleJson[] = [];

  for (let i = 0; i < UPDATES.length; i++) {
    if (isGreater(UPDATES[i].date, version)) {
      break;
    }
    const update = UPDATES[i].update;

    if (update.newPuffleJson !== undefined) {
      puffles.push(...update.newPuffleJson);
    }
  }

  return JSON.stringify(puffles);
}