import { Version } from "../routes/versions";
import { UPDATES } from "../updates/updates";

export const ITEM_RELEASES: Map<number, Version> = new Map<number, Version>();

function addItemReleases(date: Version, items: number[]) {
  items.forEach(item => {
    const entry = ITEM_RELEASES.get(item);
    if (entry === undefined) {
      ITEM_RELEASES.set(item, date);
    }
  });
}

UPDATES.forEach(update => {
  if (update.update.clothingCatalog !== undefined) {
    addItemReleases(update.date, update.update.clothingCatalog.newItems);
  }
  if (update.update.sportCatalog !== undefined) {
    addItemReleases(update.date, update.update.sportCatalog.items);
  }
  if (update.update.eliteGearItems !== undefined) {
    addItemReleases(update.date, update.update.eliteGearItems);
  }
});