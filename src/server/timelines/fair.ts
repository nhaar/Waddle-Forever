import { VersionsTimeline } from "../game-data";
import { PARTIES } from "../game-data/parties";
import { Update } from "../game-data/updates";
import { isGreaterOrEqual, Version } from "../routes/versions";
import { UPDATES } from "../updates/updates";

export function getFairTimeline() {
  const timeline = new VersionsTimeline<boolean>();

  timeline.add({
    date: Update.BETA_RELEASE,
    info: false
  });

  PARTIES.forEach((party) => {
    if (party.fairCpip && isGreaterOrEqual(party.date, Update.MODERN_AS3)) {
      timeline.add({
        date: party.date,
        end: party.end,
        info: true
      });
    }
  });

  UPDATES.forEach(update => {
    if (update.date !== undefined && update.update.fairCpip !== undefined) {
      timeline.add({
        date: update.date,
        end: update.end,
        info: true
      });
    }
  });

  return timeline.getVersions();
}