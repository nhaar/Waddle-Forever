import { iterateEntries } from "../../common/utils";
import { TimelineMap } from "../game-data";
import { Update } from "../game-data/updates";
import { FURNITURE } from "../game-logic/furniture";
import { ITEMS } from "../game-logic/items";
import { UPDATES } from "../updates/updates";

/** Get price object for a blank state */
export function getPricesTimeline() {
  const timeline = new TimelineMap<number, number>();
  ITEMS.rows.forEach((item) => {
    timeline.add(item.id, item.cost, Update.CPIP_UPDATE);
  });

  UPDATES.forEach(update => {
    if (update.update.prices !== undefined) {
      iterateEntries(update.update.prices, (id, cost) => {
        timeline.add(Number(id), cost, update.date, update.end);
      });
    }
  });

  return timeline.getVersionsMap();
}

export function getFurniturePricesTimeline() {
  const timeline = new TimelineMap<number, number>();
  FURNITURE.rows.forEach((furniture) => {
    timeline.add(furniture.id, furniture.cost, Update.CPIP_UPDATE);
  });

  UPDATES.forEach(update => {
    if (update.update.furniturePrices !== undefined) {
      iterateEntries(update.update.furniturePrices, (id, cost) => {
        timeline.add(Number(id), cost, update.date, update.end);
      });
    }
  })

  return timeline.getVersionsMap();
}