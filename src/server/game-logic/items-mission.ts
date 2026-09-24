import { Version } from "@server/routes/versions";
import { UPDATES } from "@server/updates/updates";

const MISSION_ITEMS: Array<{ date: Version; items: number[]; }> = [];

UPDATES.forEach(u => {
  if (u.update.missionItems !== undefined) {
    MISSION_ITEMS.push({
      date: u.date,
      items: [...u.update.missionItems]
    })
  }
});

export function getMissionItems() {
  return MISSION_ITEMS;
}
