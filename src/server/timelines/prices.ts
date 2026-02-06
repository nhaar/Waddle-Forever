import { newTimelineMap } from ".";
import { iterateEntries } from "@common/utils";
import { addRecordToNumberMap, TimelineMap } from "../game-data";
import { FURNITURE } from "../game-logic/furniture";
import { ITEMS } from "../game-logic/items";
import { UPDATES } from "../updates/updates";
import { getDate } from "./dates";

/** Get price object for a blank state */
export const PRICES_TIMELINE = newTimelineMap<number, number>(timeline => {
  ITEMS.rows.forEach((item) => {
    timeline.add(item.id, item.cost, getDate('cpip'));
  });
  
  UPDATES.forEach(update => {
    if (update.update.prices !== undefined) {
      addRecordToNumberMap(timeline, update.update.prices, update.date, update.end);
    }
  });
});

export const FURNITURE_PRICES_TIMELINE = newTimelineMap<number, number>(timeline => {
  FURNITURE.rows.forEach((furniture) => {
    timeline.add(furniture.id, furniture.cost, getDate('cpip'));
  });
  
  UPDATES.forEach(update => {
    if (update.update.furniturePrices !== undefined) {
      addRecordToNumberMap(timeline, update.update.furniturePrices, update.date, update.end);
    }
  })
});