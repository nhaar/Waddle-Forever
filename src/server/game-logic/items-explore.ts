import { Version } from "@server/routes/versions";
import { UPDATES } from "@server/updates/updates";

const EXPLORE_ITEMS: Array<{ date: Version; items: number[]; }> = [];

UPDATES.forEach(u => {
  if (u.update.exploreItems !== undefined) {
    EXPLORE_ITEMS.push({
      date: u.date,
      items: [...u.update.exploreItems]
    })
  }
});

export function getExploreItems() {
  return EXPLORE_ITEMS;
}
