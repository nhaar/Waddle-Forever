import { newVersionsTimeline } from ".";
import { isGreaterOrEqual } from "../routes/versions";
import { UPDATES } from "../updates/updates";
import { START_DATE, getDate } from "./dates";

export const FAIR_TIMELINE = newVersionsTimeline<boolean>((timeline) => {
  timeline.add({
    date: START_DATE,
    info: false
  });

  UPDATES.forEach(update => {
    if (update.date !== undefined && update.update.fairCpip !== undefined && isGreaterOrEqual(update.date, getDate('vanilla-engine'))) {
      timeline.add({
        date: update.date,
        end: update.end,
        info: true
      });
    }
  });
});