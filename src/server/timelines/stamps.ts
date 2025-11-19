import { ORIGINAL_STAMPBOOK } from "../game-data/stamps";
import { Version } from "../routes/versions";
import { UPDATES } from "../updates/updates";

export const STAMP_DATES: Record<number, Version> = {};

let first = true;

for (let i = 0; i < UPDATES.length; i++) {
  const update = UPDATES[i];

  // original stamps
  if (first && update.update.worldStamps !== undefined) {
    ORIGINAL_STAMPBOOK.forEach(category => {
      category.stamps.forEach(stamp => {
        STAMP_DATES[stamp.stamp_id] = update.date;
      });
    });
    first = false;
  }

  if (update.update.stampUpdates !== undefined) {
    update.update.stampUpdates.forEach(stampUpdate => {
      if ('category' in stampUpdate) {
        stampUpdate.category.stamps.forEach(stamp => {
          STAMP_DATES[stamp.stamp_id] = update.date;
        })
      } else {
        stampUpdate.stamps.forEach(stamp => {
          STAMP_DATES[stamp.stamp_id] = update.date;
        });
      }
    });
  }
}