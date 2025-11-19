import { VersionsTimeline } from "../game-data";
import { Update } from "../game-data/updates";
import { UPDATES } from "../updates/updates";
import { START_DATE } from "./dates";

export function getMapNoteTimeline() {
  const timeline = new VersionsTimeline<boolean>();

  timeline.add({
    date: START_DATE,
    info: false
  });

  UPDATES.forEach(update => {
    if (update.update.mapNote !== undefined) {
      timeline.add({
        date: update.date,
        end: update.end,
        info: true
      });
    }
  });

  return timeline.getVersions();
}