import { newVersionsTimeline } from ".";
import { UPDATES } from "../updates/updates";
import { START_DATE } from "./dates";

export const BROWN_PUFFLE_TIMELINE = newVersionsTimeline<boolean>(timeline => {
  timeline.add({
    date: START_DATE,
    info: false
  });
  
  UPDATES.forEach(update => {
    if (update.update.freeBrownPuffle === true) {
      timeline.add({
        date: update.date,
        end: update.end,
        info: true
      });
    }
  });
});