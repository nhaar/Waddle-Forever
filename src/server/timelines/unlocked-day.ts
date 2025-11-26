import { newVersionsTimeline } from ".";
import { UPDATES } from "../updates/updates";

export const UNLOCKED_DAY_TIMELINE = newVersionsTimeline<number>(timeline => {
  UPDATES.forEach(update => {
    if (update.update.unlockedDay !== undefined) {
      timeline.addInfo(update.update.unlockedDay, update.date);
    }
  });
});