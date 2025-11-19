import { VersionsTimeline } from "../game-data"
import { UPDATES } from "../updates/updates";
import { START_DATE } from "./dates";

const brownTimeline = new VersionsTimeline<boolean>();

brownTimeline.add({
  date: START_DATE,
  info: false
});

UPDATES.forEach(update => {
  if (update.update.freeBrownPuffle === true) {
    brownTimeline.add({
      date: update.date,
      end: update.end,
      info: true
    });
  }
});

export const BROWN_PUFFLE_TIMELINE = brownTimeline.getVersions();