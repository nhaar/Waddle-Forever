import { Version } from "@server/routes/versions";
import { UPDATES } from "@server/updates/updates";

const TESTING_ITEMS: Array<{ date: Version; items: number[]; }> = [];

UPDATES.forEach(u => {
  if (u.update.testingItems !== undefined) {
    TESTING_ITEMS.push({
      date: u.date,
      items: [...u.update.testingItems]
    })
  }
});

export function getTestingItems() {
  return TESTING_ITEMS;
}