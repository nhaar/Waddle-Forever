import { VersionsTimeline } from "../game-data";
import { Update } from "../game-data/updates";
import { isGreaterOrEqual } from "../routes/versions";
import { UPDATES } from "../updates/updates";

export function getFairTimeline() {
  const timeline = new VersionsTimeline<boolean>();

  timeline.add({
    date: Update.BETA_RELEASE,
    info: false
  });

  UPDATES.forEach(update => {
    if (update.date !== undefined && update.update.fairCpip !== undefined && isGreaterOrEqual(update.date, Update.MODERN_AS3)) {
      timeline.add({
        date: update.date,
        end: update.end,
        info: true
      });
    }
  });

  return timeline.getVersions();
}