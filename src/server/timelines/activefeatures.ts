import { newVersionsTimeline } from ".";
import { UPDATES } from "../updates/updates";
import { START_DATE } from "./dates";

export const ACTIVE_FEATURES_TIMELINE = newVersionsTimeline<string>((timeline) => {
  timeline.addInfo('', START_DATE);

  UPDATES.forEach(update => {
    if (update.update.activeFeatures !== undefined) {
      timeline.addInfo(update.update.activeFeatures, update.date, update.end);
    }
  });
});