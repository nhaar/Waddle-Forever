import { newVersionsTimeline } from ".";
import { isGreaterOrEqual } from "../routes/versions";
import { UPDATES } from "../updates/updates";
import { MODERN_AS3, START_DATE } from "./dates";

export const FAIR_TIMELINE = newVersionsTimeline<boolean>((timeline) => {
  timeline.add({
    date: START_DATE,
    info: false
  });

  UPDATES.forEach(update => {
    if (update.date !== undefined && update.update.fairCpip !== undefined && isGreaterOrEqual(update.date, MODERN_AS3)) {
      timeline.add({
        date: update.date,
        end: update.end,
        info: true
      });
    }
  });
});