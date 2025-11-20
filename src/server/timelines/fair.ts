import { VersionsTimeline } from "../game-data";
import { isGreaterOrEqual } from "../routes/versions";
import { UPDATES } from "../updates/updates";
import { MODERN_AS3, START_DATE } from "./dates";

export function getFairTimeline() {
  const timeline = new VersionsTimeline<boolean>();

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

  return timeline.getVersions();
}