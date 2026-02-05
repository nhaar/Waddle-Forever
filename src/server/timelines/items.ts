import { Version } from "../routes/versions";
import { UPDATES } from "../updates/updates";

export const ITEM_RELEASES: Map<number, Version> = new Map<number, Version>();

UPDATES.forEach(update => {
  if (update.update.clothingCatalog !== undefined && typeof update.update.clothingCatalog !== 'string') {
    update.update.clothingCatalog.newItems.forEach(item => {
      const entry = ITEM_RELEASES.get(item);
      if (entry === undefined) {
        ITEM_RELEASES.set(item, update.date);
      }
    });
  }
});